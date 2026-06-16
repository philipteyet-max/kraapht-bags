// ═══════════════════════════════════════════════════════
// api/webhook.js — Paystack webhook receiver
// Vercel deploys this as: https://yourdomain.com/api/webhook
// Set this URL in Paystack Dashboard → Settings → Webhooks
// ═══════════════════════════════════════════════════════

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // service role key — has write access
);

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
    const meta = data.metadata || {};   // order form fields passed as metadata

    // Build the order row from Paystack data + metadata
    const orderRow = {
      // Client details (sent as Paystack metadata from your order form)
      full_name:      meta.full_name      || data.customer?.first_name || '',
      business_name:  meta.business_name  || '',
      phone:          meta.phone          || '',
      whatsapp:       meta.whatsapp       || meta.phone || '',
      email:          data.customer?.email || meta.email || '',
      location:       meta.location       || '',

      // Order details
      product_type:   meta.product_type   || '',
      paper_type:     meta.paper_type     || '',
      size:           meta.size           || '',
      quantity:       parseInt(meta.quantity) || 0,
      lamination:     meta.lamination === 'true' || meta.lamination === true,
      custom_print:   meta.custom_print   === 'true' || meta.custom_print === true,
      notes:          meta.notes          || '',

      // Payment
      amount_ghs:     data.amount / 100,   // Paystack stores in pesewas
      paystack_ref:   data.reference,
      payment_status: 'paid',

      // Production starts at New Order
      stage:          'New Order',
      due_date:       meta.due_date || null,
    };

    // Upsert: if same paystack_ref comes twice (Paystack retries), don't duplicate
    const { error } = await supabase
      .from('orders')
      .upsert(orderRow, { onConflict: 'paystack_ref' });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Database write failed' });
    }

    console.log(`Order created: ${data.reference} — ${orderRow.business_name}`);
    return res.status(200).json({ received: true });
  }

  // Acknowledge all other Paystack events without acting on them
  return res.status(200).json({ received: true });
}
