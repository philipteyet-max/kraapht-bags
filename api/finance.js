// ═══════════════════════════════════════════════════════
// api/finance.js — monthly finance summary for admin dashboard
// GET /api/finance?month=2026-06
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const month = req.query.month || new Date().toISOString().slice(0, 7); // default: current month

  const start = `${month}-01T00:00:00Z`;
  // Last moment of the month
  const [year, mon] = month.split('-').map(Number);
  const nextMonth = new Date(year, mon, 1); // JS months are 0-indexed, so mon = next month
  const end = nextMonth.toISOString();

  // Fetch paid orders in range
  const { data: monthOrders, error } = await supabase
    .from('orders')
    .select('ref, business_name, full_name, quantity, amount_ghs, material_cost, labour_cost, stage, order_date')
    .eq('payment_status', 'paid')
    .gte('order_date', start)
    .lt('order_date', end)
    .order('order_date', { ascending: true });

  if (error) return res.status(500).json({ error: 'Query failed' });

  // Aggregate
  const revenue      = monthOrders.reduce((s, o) => s + Number(o.amount_ghs),     0);
  const materialCost = monthOrders.reduce((s, o) => s + Number(o.material_cost),   0);
  const labourCost   = monthOrders.reduce((s, o) => s + Number(o.labour_cost),     0);
  const totalCost    = materialCost + labourCost;
  const profit       = revenue - totalCost;
  const margin       = revenue > 0 ? Math.round(profit / revenue * 100) : 0;
  const totalUnits   = monthOrders.reduce((s, o) => s + o.quantity,                0);

  return res.status(200).json({
    month,
    order_count:   monthOrders.length,
    total_units:   totalUnits,
    revenue,
    material_cost: materialCost,
    labour_cost:   labourCost,
    total_cost:    totalCost,
    profit,
    margin_pct:    margin,
    orders:        monthOrders,
  });
}
