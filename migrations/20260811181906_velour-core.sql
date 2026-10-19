-- VELOUR core schema: products (public read), carts (owner-only), orders (owner-only)

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('women', 'men')),
  subcategory TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  description TEXT NOT NULL DEFAULT '',
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  trending BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON products
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON products TO anon, authenticated;

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id, size)
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_read_own_cart" ON carts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_can_insert_own_cart" ON carts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_can_update_own_cart" ON carts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_can_delete_own_cart" ON carts
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON carts TO authenticated;

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')),
  contact JSONB,
  shipping_address JSONB,
  payment_receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_read_own_orders" ON orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_can_insert_own_orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Status transitions are managed from the dashboard/admin side only:
-- no UPDATE/DELETE for regular users.
GRANT SELECT, INSERT ON orders TO authenticated;
