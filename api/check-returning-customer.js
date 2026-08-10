// ═══════════════════════════════════════════════════════
// api/check-returning-customer.js
// GET /api/check-returning-customer?email=someone@example.com
//
// Checkout has no login step (by design — see the usability study notes on
// keeping it frictionless), so payment.html can't rely on Supabase Auth/RLS
// to check order history the way customer.html does. This runs server-side
// with the service role key instead, and returns ONLY a boolean — never
// order details — so it's safe to call from an unauthenticated page.
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const { count, error } = await supabase
    .from('orders')
    .select('ref', { count: 'exact', head: true })
    .ilike('email', email);

  if (error) {
    console.error('check-returning-customer error:', error);
    return res.status(500).json({ error: 'Lookup failed' });
  }

  return res.status(200).json({ isReturning: (count || 0) > 0 });
}
