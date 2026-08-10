-- ═══════════════════════════════════════════════════════
-- KRAAPHT BAGS — Deposit / Balance Payment Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Run this AFTER admin_security_fix.sql (it depends on the same orders table
-- and RLS setup that script already put in place).
--
-- WHAT THIS ADDS
--   - orders.amount_paid          — running total actually collected so far
--                                    (amount_ghs stays the FIXED full order
--                                    total, locked in at checkout time)
--   - orders.balance_paystack_ref — the Paystack reference for the second
--                                    (balance) payment, kept alongside the
--                                    original paystack_ref for the deposit
--   - payment_status gets a new value in normal use: 'deposit_paid'
--     (existing 'pending' | 'paid' | 'failed' values are unchanged)
--
-- ALSO FIXES: the "Customers read own orders" RLS policy from
-- admin_security_fix.sql matched on user_id, but webhook.js never actually
-- sets user_id on an order (checkout has no login step), so that policy has
-- matched zero rows for every real customer since it was written. Replacing
-- it with an email match — no checkout UX change needed, and it works
-- retroactively for orders that already exist.
-- ═══════════════════════════════════════════════════════

-- 1. New columns -----------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS balance_paystack_ref TEXT UNIQUE;

-- 2. Fix the customer-read policy to match by email, not user_id -----------
DROP POLICY IF EXISTS "Customers read own orders" ON orders;

CREATE POLICY "Customers read own orders"
  ON orders FOR SELECT
  USING (email = auth.email());

-- Note: "Admins read all orders" and "Admins update orders" from
-- admin_security_fix.sql are unaffected and still apply.
