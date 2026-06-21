// ═══════════════════════════════════════════════════════
// api/profile.js
// GET  /api/profile  → read profile + orders + artwork
// POST /api/profile  → update profile fields
// Auth: Bearer token (Supabase JWT)
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function getUser(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user || null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  // ── GET — fetch full profile + orders + artwork ──
  if (req.method === 'GET') {
    const [profileRes, ordersRes, artworkRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', user.id).single(),
      supabaseAdmin.from('orders').select('ref,product_type,paper_type,quantity,amount_ghs,stage,order_date,due_date').eq('user_id', user.id).order('order_date', { ascending: false }),
      supabaseAdmin.from('artwork').select('*').eq('user_id', user.id).order('uploaded_at', { ascending: false }),
    ]);

    return res.status(200).json({
      user:    { id: user.id, email: user.email },
      profile: profileRes.data || {},
      orders:  ordersRes.data  || [],
      artwork: artworkRes.data || [],
    });
  }

  // ── POST — update profile ──
  if (req.method === 'POST') {
    const { full_name, business_name, phone, email, delivery_address } = req.body;

    const updates = {};
    if (full_name        !== undefined) updates.full_name        = full_name;
    if (business_name    !== undefined) updates.business_name    = business_name;
    if (phone            !== undefined) updates.phone            = phone;
    if (email            !== undefined) updates.email            = email;
    if (delivery_address !== undefined) updates.delivery_address = delivery_address;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user.id, ...updates })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Profile update failed' });
    return res.status(200).json({ profile: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
