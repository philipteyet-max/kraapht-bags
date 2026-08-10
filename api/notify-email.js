// ═══════════════════════════════════════════════════════
// api/notify-email.js — sends order status emails via Resend
// Vercel deploys this as: https://yourdomain.com/api/notify-email
//
// Trigger: Supabase Database Webhooks on the `orders` table.
// Set up TWO webhooks in Supabase Dashboard → Database → Webhooks:
//   1. Event: INSERT  → fires once when a new order is created (deposit paid)
//   2. Event: UPDATE  → fires whenever a row changes; this function
//      only actually sends an email for changes we care about
// Both webhooks point at this same URL, with an HTTP header:
//   x-webhook-secret: <SUPABASE_WEBHOOK_SECRET value>
// so this function can confirm the call really came from Supabase.
// ═══════════════════════════════════════════════════════

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Maps a new `stage` value to which email (if any) to send, for orders that
// are already fully paid. Deliberately NOT every stage — Printing/Die
// Cutting/Lamination/Folding would be inbox spam. Only the milestones a
// customer actually cares about. 'QC Check' is handled separately below
// since whether it sends anything depends on payment_status too.
const STAGE_EVENTS = {
  'Printing':   'production_started',
  'Dispatched': 'dispatched',
  'Delivered':  'delivered',
};

function ghs(n) {
  return 'GHS ' + Number(n || 0).toLocaleString();
}

const TEMPLATES = {
  confirmed: (order) => ({
    subject: `Order ${order.ref} confirmed — Kraapht Bags Ltd`,
    html: `<p>Hi ${order.business_name || 'there'},</p>
      <p>Your order <strong>${order.ref}</strong> is confirmed and paid in full. We've started sourcing materials — you'll hear from us again once production begins.</p>
      <p>— Kraapht Bags Ltd</p>`,
  }),
  deposit_confirmed: (order) => ({
    subject: `Order ${order.ref} — deposit received`,
    html: `<p>Hi ${order.business_name || 'there'},</p>
      <p>We've received your deposit of <strong>${ghs(order.amount_paid)}</strong> for order <strong>${order.ref}</strong> — production is starting now.</p>
      <p>Outstanding balance: <strong>${ghs(order.amount_ghs - order.amount_paid)}</strong>, due before dispatch. You can pay this anytime from your account at kraaphtbags.com/customer.html once your order is ready.</p>
      <p>— Kraapht Bags Ltd</p>`,
  }),
  production_started: (order) => ({
    subject: `Order ${order.ref} — production has started`,
    html: `<p>Hi ${order.business_name || 'there'},</p>
      <p>Good news — production on order <strong>${order.ref}</strong> has started.</p>
      <p>— Kraapht Bags Ltd</p>`,
  }),
  balance_due: (order) => ({
    subject: `Order ${order.ref} — balance due before dispatch`,
    html: `<p>Hi ${order.business_name || 'there'},</p>
      <p>Order <strong>${order.ref}</strong> has cleared quality check and is ready to dispatch as soon as the remaining balance is settled.</p>
      <p>Outstanding balance: <strong>${ghs(order.amount_ghs - order.amount_paid)}</strong>. Pay this from your account at kraaphtbags.com/customer.html to release your order for dispatch.</p>
      <p>— Kraapht Bags Ltd</p>`,
  }),
  dispatched: (order) => ({
    subject: `Order ${order.ref} is on its way`,
    html: `<p>Hi ${order.business_name || 'there'},</p>
      <p>Order <strong>${order.ref}</strong> has been dispatched and is on its way to you.</p>
      <p>— Kraapht Bags Ltd</p>`,
  }),
  delivered: (order) => ({
    subject: `Order ${order.ref} delivered — thank you!`,
    html: `<p>Hi ${order.business_name || 'there'},</p>
      <p>Order <strong>${order.ref}</strong> has been delivered. Thank you for choosing Kraapht Bags Ltd — we hope your customers love the packaging.</p>
      <p>— Kraapht Bags Ltd</p>`,
  }),
};

async function sendTemplate(eventKey, order) {
  const template = TEMPLATES[eventKey];
  if (!template || !order.email) return;
  const { subject, html } = template(order);
  await resend.emails.send({
    from: 'Kraapht Bags Ltd <orders@kraaphtbags.com>', // requires kraaphtbags.com verified in Resend
    to: order.email,
    subject,
    html,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Verify the request genuinely came from our Supabase webhook ──
  if (req.headers['x-webhook-secret'] !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, record, old_record } = req.body || {};

  try {
    if (type === 'INSERT' && record) {
      // A brand-new order is always either fully paid (deposit_percentage
      // configured at 100%, or a small order) or deposit-paid.
      await sendTemplate(record.payment_status === 'paid' ? 'confirmed' : 'deposit_confirmed', record);
    }

    if (type === 'UPDATE' && record && old_record) {
      const stageChanged = record.stage !== old_record.stage;

      if (stageChanged && record.stage === 'QC Check' && record.payment_status !== 'paid') {
        // Order's finished production but the balance is still outstanding —
        // give the customer a heads-up before they hit the Dispatch block.
        await sendTemplate('balance_due', record);
      } else if (stageChanged && STAGE_EVENTS[record.stage]) {
        await sendTemplate(STAGE_EVENTS[record.stage], record);
      }
      // Paying off the balance itself doesn't send an email here — the real
      // "dispatched" notification fires once an admin actually advances the
      // stage (admin.html's Dispatch gate is what that payment unblocks).
    }

    return res.status(200).json({ handled: true });
  } catch (err) {
    console.error('notify-email error:', err);
    // Still 200 — a failed notification shouldn't make Supabase retry-storm this webhook
    return res.status(200).json({ handled: false, error: 'Email send failed' });
  }
}
