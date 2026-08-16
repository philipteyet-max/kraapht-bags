// ═══════════════════════════════════════════════════════
// api/webhook.js — Paystack webhook receiver
// Vercel deploys this as: https://yourdomain.com/api/webhook
// Set this URL in Paystack Dashboard → Settings → Webhooks
//
// Handles two kinds of successful charges, told apart by the
// "payment_type" custom field payment.html sends:
//   - 'deposit' (default) — creates a new order row. amount_ghs is the
//     FIXED full order total (locked in at checkout), amount_paid is
//     whatever was actually charged today.
//   - 'balance' — a customer paying off the rest of an existing order
//     from their account. Updates that order row instead of inserting
//     a new one.
// ═══════════════════════════════════════════════════════

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import KRAAPHT_CONFIG from '../config.js';
import pricingFloor from '../pricing-floor.js';
const { minimumOrderTotal } = pricingFloor;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // service role key — has write access
);

// Paystack returns metadata.custom_fields as an array of
// {display_name, variable_name, value} — flatten to {variable_name: value}.
function flattenCustomFields(metadata) {
  const fields = {};
  (metadata?.custom_fields || []).forEach((f) => {
    fields[f.variable_name] = f.value;
  });
  return fields;
}

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Verify the request is genuinely from Paystack ──
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto
    .createHmac('sha512', paystackSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  // ── Handle successful charge ──
  if (event.event === 'charge.success') {
    const data = event.data;
    const fields = flattenCustomFields(data.metadata);
    const paymentType = fields.payment_type || 'deposit';
    const amountChargedGHS = data.amount / 100; // Paystack stores in pesewas

    // ── Balance payment: update the EXISTING order, don't create a new row ──
    if (paymentType === 'balance') {
      const orderRef = fields.order_ref;
      if (!orderRef) {
        console.error('Balance webhook missing order_ref:', data.reference);
        return res.status(400).json({ error: 'Missing order_ref in metadata' });
      }

      const { data: existing, error: fetchError } = await supabase
        .from('orders')
        .select('amount_ghs, amount_paid')
        .eq('ref', orderRef)
        .single();

      if (fetchError || !existing) {
        console.error('Balance webhook: order not found:', orderRef, fetchError);
        return res.status(404).json({ error: 'Order not found' });
      }

      const newAmountPaid = Number(existing.amount_paid || 0) + amountChargedGHS;
      const nowPaidInFull = newAmountPaid >= Number(existing.amount_ghs);

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          amount_paid: newAmountPaid,
          payment_status: nowPaidInFull ? 'paid' : 'deposit_paid',
          balance_paystack_ref: data.reference,
        })
        .eq('ref', orderRef);

      if (updateError) {
        console.error('Balance webhook update failed:', updateError);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`Balance paid: ${orderRef} — GHS ${amountChargedGHS} (${nowPaidInFull ? 'paid in full' : 'still owing'})`);
      return res.status(200).json({ received: true });
    }

    // ── Deposit (or full) payment: create the order row ──
    const orderTotal = parseFloat(fields.order_total) || amountChargedGHS;

    // ── Server-side price-tampering guard ──
    // orderTotal (and the amount actually sent to Paystack) both come from
    // the customer's browser and are editable via devtools before paying —
    // see pricing-floor.js for why this checks a conservative floor instead
    // of trying to recompute the exact price. amountChargedGHS itself is
    // trustworthy (Paystack's signature above confirms it's really what was
    // charged); what's NOT trustworthy is whether that amount was a
    // reasonable deposit for the order described in the same metadata.
    const floorTotal   = minimumOrderTotal(fields, KRAAPHT_CONFIG);
    const floorDeposit = floorTotal * KRAAPHT_CONFIG.order.deposit_percentage;
    const priceLooksTampered = floorTotal > 0 && amountChargedGHS < floorDeposit;

    if (priceLooksTampered) {
      console.error(
        `[price-guard] ${data.reference}: charged GHS ${amountChargedGHS}, ` +
        `expected at least ~GHS ${floorDeposit.toFixed(2)} deposit for qty ` +
        `${fields.quantity} × ${fields.paper_type} (${fields.product_type}). ` +
        `Recording as flagged_review instead of paid — needs manual check.`
      );
    }

    const paidInFull = !priceLooksTampered && amountChargedGHS >= orderTotal;

    const orderRow = {
      // Client details (sent as Paystack metadata from your order form)
      full_name:      fields.full_name      || data.customer?.first_name || '',
      business_name:  fields.business_name  || '',
      phone:          fields.phone          || '',
      whatsapp:       fields.whatsapp       || fields.phone || '',
      email:          data.customer?.email  || fields.email || '',
      location:       fields.location       || '',

      // Order details
      product_type:   fields.product_type   || '',
      paper_type:     fields.paper_type     || '',
      size:           fields.size           || '',
      quantity:       parseInt(fields.quantity) || 0,
      lamination:     fields.lamination === 'true' || fields.lamination === true,
      custom_print:   fields.custom_print   === 'true' || fields.custom_print === true,
      notes:          fields.notes          || '',

      // Payment — amount_ghs is the FIXED full order total, locked in now and
      // never recalculated later; amount_paid is what's actually been collected
      amount_ghs:     orderTotal,
      amount_paid:    amountChargedGHS,
      paystack_ref:   data.reference,
      payment_status: priceLooksTampered ? 'flagged_review' : (paidInFull ? 'paid' : 'deposit_paid'),

      // Production starts at New Order
      stage:          'New Order',
      due_date:       fields.due_date || null,
    };

    // Upsert: if same paystack_ref comes twice (Paystack retries), don't duplicate
    const { error } = await supabase
      .from('orders')
      .upsert(orderRow, { onConflict: 'paystack_ref' });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Database write failed' });
    }

    console.log(`Order created: ${data.reference} — ${orderRow.business_name} (${orderRow.payment_status})`);
    return res.status(200).json({ received: true });
  }

  // Acknowledge all other Paystack events without acting on them
  return res.status(200).json({ received: true });
}
