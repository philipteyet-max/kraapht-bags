-- ═══════════════════════════════════════════════════════
-- KRAAPHT BAGS — Admin Access Security Fix
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- WHAT THIS FIXES
-- supabase_schema.sql originally granted SELECT / INSERT / UPDATE on the
-- `orders` table to everyone — USING (true) / WITH CHECK (true) — with a
-- comment saying "your admin dashboard uses the anon key". The anon key
-- is embedded in plain text in every page's JavaScript (view-source on
-- any page shows it), so this policy actually meant: any visitor on the
-- internet can read every customer's name, phone, email, address, order
-- details, and cost/margin data, and can insert or modify order rows —
-- without ever opening admin.html or signing in anywhere.
--
-- This script locks `orders` down to:
--   - Customers can read only their own orders.
--   - Only signed-in admins (listed in the new `admins` table) can read
--     all orders or update them (production stage, costs).
--   - No public INSERT/UPDATE policy at all. Real order creation goes
--     through api/webhook.js using the SERVICE ROLE key, which bypasses
--     RLS entirely — so the old public INSERT policy was never actually
--     needed for checkout to work. Removing it closes an open door with
--     zero effect on real orders.
-- ═══════════════════════════════════════════════════════

-- 1. Admins allowlist -----------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  user_id   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email     TEXT NOT NULL,
  added_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- Intentionally no SELECT/INSERT policy for this table — nobody can read
-- or write it from the browser. Only the SECURITY DEFINER function below
-- can see it, so the admin list itself is never exposed to the client.

-- 2. is_admin() — safe to call from the browser; returns true/false only,
--    never exposes who else is on the list.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;

-- 3. Replace the wide-open orders policies --------------------------------
DROP POLICY IF EXISTS "Admin can read all orders" ON orders;
DROP POLICY IF EXISTS "Allow inserts" ON orders;
DROP POLICY IF EXISTS "Allow updates" ON orders;
DROP POLICY IF EXISTS "Users can read own orders" ON orders; -- from auth_schema.sql, recreated below

CREATE POLICY "Customers read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins update orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- No INSERT policy at all: the webhook's service role key bypasses RLS,
-- and nothing else should ever be writing new order rows.

-- ═══════════════════════════════════════════════════════
-- 4. ADD YOUR OWN ADMIN ACCOUNT — do this AFTER the steps above
-- ═══════════════════════════════════════════════════════
-- a) In Supabase Dashboard → Authentication → Users → "Add User", create
--    an account with your email + a strong password. Tick "Auto Confirm
--    User" so you don't need to click an email link.
-- b) Then run this, replacing the email with the one you just created:
--
--    INSERT INTO admins (user_id, email)
--    SELECT id, email FROM auth.users WHERE email = 'philipteyet@gmail.com'
--    ON CONFLICT (user_id) DO NOTHING;
--
-- c) Sign in at admin.html with that email + password. Add more admins
--    later by repeating (a) and (b) for each person's email.
