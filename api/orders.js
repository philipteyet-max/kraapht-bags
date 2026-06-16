// ═══════════════════════════════════════════════════════
// api/orders.js — serves order data to admin dashboard
// GET  /api/orders            → all orders
// GET  /api/orders?stage=X    → filter by stage
// GET  /api/orders?month=X    → filter by month (e.g. 2026-06)
// PATCH /api/orders           → update stage or costs for one order
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS — allow your Vercel domain to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Simple admin key check — prevents public access ──
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ════════════════════════════════════════
  // GET — fetch orders
  // ════════════════════════════════════════
  if (req.method === 'GET') {
    let query = supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false });

    // Optional filters
    if (req.query.stage) {
      query = query.eq('stage', req.query.stage);
    }
    if (req.query.month) {
      // e.g. month=2026-06
      const start = `${req.query.month}-01`;
      const end   = `${req.query.month}-31`;
      query = query.gte('order_date', start).lte('order_date', end);
    }
    if (req.query.client) {
      query = query.ilike('business_name', `%${req.query.client}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Database read failed' });
    }

    return res.status(200).json({ orders: data });
  }

  // ════════════════════════════════════════
  // PATCH — update stage or costs
  // Body: { ref: "KBL-00148", stage: "Folding" }
  // Body: { ref: "KBL-00148", material_cost: 360, labour_cost: 30 }
  // ════════════════════════════════════════
  if (req.method === 'PATCH') {
    const { ref, stage, material_cost, labour_cost, due_date } = req.body;

    if (!ref) return res.status(400).json({ error: 'Order ref required' });

    const updates = {};
    if (stage !== undefined)         updates.stage         = stage;
    if (material_cost !== undefined) updates.material_cost = material_cost;
    if (labour_cost !== undefined)   updates.labour_cost   = labour_cost;
    if (due_date !== undefined)      updates.due_date      = due_date;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('ref', ref)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Update failed' });
    }

    return res.status(200).json({ updated: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
