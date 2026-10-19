-- PayPal payments: payment columns on orders, new status flow, owner UPDATE.
-- Status flow becomes: pending (created, unpaid) → confirmed (paid) → shipped → delivered.

ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'paypal';

ALTER TABLE orders DROP CONSTRAINT orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered'));

-- Users may update their own orders (required to mark payment on return).
CREATE POLICY "users_can_update_own_orders" ON orders
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

GRANT UPDATE ON orders TO authenticated;
