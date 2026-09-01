-- =============================================
-- AVENXO ONLINE — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. GAMES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  publisher TEXT NOT NULL,
  cover_url TEXT NOT NULL DEFAULT '',
  banner_url TEXT NOT NULL DEFAULT '',
  short_desc TEXT NOT NULL DEFAULT '',
  long_desc TEXT[] DEFAULT '{}',
  fields JSONB NOT NULL DEFAULT '[
    {"id":"userId","label":"User ID","placeholder":"Masukkan User ID"}
  ]',
  tags TEXT NOT NULL DEFAULT '',
  badge TEXT DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  rating_count TEXT DEFAULT '0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. DENOMINATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS denominations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  bonus TEXT DEFAULT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_denominations_game_id ON denominations(game_id);

-- =============================================
-- 3. PAYMENT METHODS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  icon_url TEXT DEFAULT NULL,
  account_number TEXT DEFAULT NULL,
  account_name TEXT DEFAULT NULL,
  qr_image_url TEXT DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 4. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  game_slug TEXT NOT NULL,
  game_name TEXT NOT NULL,
  publisher TEXT NOT NULL,
  cover_url TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL,
  zone_id TEXT DEFAULT NULL,
  denom_amount TEXT NOT NULL,
  denom_id TEXT NOT NULL,
  total INTEGER NOT NULL,
  method_id TEXT NOT NULL,
  method_label TEXT NOT NULL,
  cat_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_proof_url TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- =============================================
-- 5. SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default settings
INSERT INTO site_settings (key, value) VALUES
  ('wa_number', '081234567890'),
  ('payment_timeout_minutes', '15'),
  ('cs_email', 'support@avenxoonline.net')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 6. STORAGE BUCKETS (run separately)
-- =============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('game-images', 'game-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-qr', 'payment-qr', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proof', 'payment-proof', false);

-- =============================================
-- 7. ROW LEVEL SECURITY
-- =============================================
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE denominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for active data (landing page)
CREATE POLICY "Public can read active games" ON games
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active denominations" ON denominations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active payment methods" ON payment_methods
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Public can read settings" ON site_settings
  FOR SELECT USING (true);

-- Public can insert orders (customer creates order)
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public can update own orders (for "saya sudah bayar" status)
CREATE POLICY "Public can update orders" ON orders
  FOR UPDATE USING (true);

-- Admin full access (using service_role key via API routes)
-- Service role bypasses RLS, so no admin policies needed here

-- =============================================
-- 8. SEED DATA — Games
-- =============================================
INSERT INTO games (slug, name, publisher, cover_url, banner_url, short_desc, long_desc, fields, tags, badge, is_active, sort_order, rating, rating_count)
VALUES
  ('mobile-legends', 'Mobile Legends', 'Moonton',
   '/images/8d346431-48aa-4414-9125-9d2d7e78fd44.png',
   '/images/27522459-50c5-4023-96b4-359a9aba0052.png',
   'Top up Mobile Legends langsung ke User ID kamu tanpa login akun.',
   ARRAY['Mobile Legends: Bang Bang adalah game MOBA 5v5 terpopuler di Asia Tenggara. Top up Diamond ML di AVENXO ONLINE diproses otomatis setelah pembayaran — cukup masukkan User ID + Zone ID, pilih nominal Diamond, bayar, dan Diamond langsung masuk ke akun ML kamu.', 'Diamond ML bisa dipakai untuk beli hero, skin, dan ikut event. Tanpa login akun, tanpa ribet, harga mulai dari Rp3.000.'],
   '[{"id":"userId","label":"User ID","placeholder":"Masukkan User ID"},{"id":"zoneId","label":"Zone ID","placeholder":"Masukkan Zone ID","zone":true}]',
   'populer best moba', 'BEST SELLER', true, 1, 4.99, '2.1jt+')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (slug, name, publisher, cover_url, banner_url, short_desc, long_desc, fields, tags, badge, is_active, sort_order, rating, rating_count)
VALUES
  ('free-fire', 'Free Fire', 'Garena',
   '/images/697ea9d0-5cc7-4726-9a87-8108b0c6789d.png',
   '/images/697ea9d0-5cc7-4726-9a87-8108b0c6789d.png',
   'Top up Free Fire (FF) dengan memasukkan Player ID, Diamond langsung masuk ke akun.',
   ARRAY['Free Fire adalah game Battle Royale 50-pemain yang dikembangkan Garena. Top up Diamond FF di AVENXO ONLINE diproses otomatis 24/7 — cukup masukkan Player ID, pilih nominal, bayar via QRIS / e-wallet / VA, dan Diamond FF langsung masuk ke akun kamu.', 'Diamond FF bisa dipakai untuk beli karakter, skin senjata, dan Elite Pass. Harga mulai dari Rp2.500, proses instan tanpa login.'],
   '[{"id":"userId","label":"Player ID","placeholder":"Masukkan Player ID"}]',
   'populer br', 'HOT', true, 2, 4.97, '1.4jt+')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (slug, name, publisher, cover_url, banner_url, short_desc, long_desc, fields, tags, badge, is_active, sort_order, rating, rating_count)
VALUES
  ('pubg-mobile', 'PUBG Mobile', 'Level Infinite',
   '/images/1cab02ab-4465-4cdf-b715-649267c7076e.png',
   '/images/1cab02ab-4465-4cdf-b715-649267c7076e.png',
   'Top up UC PUBG Mobile dengan Player ID, UC langsung masuk ke akun.',
   ARRAY['PUBG Mobile adalah game Battle Royale kelas dunia dari Level Infinite / Krafton. Top up UC (Unknown Cash) PUBG Mobile di AVENXO ONLINE diproses otomatis 24/7 — cukup masukkan Player ID, pilih nominal UC, dan bayar. UC akan langsung masuk ke akun PUBG Mobile kamu.', 'UC PUBG bisa dipakai untuk membeli Royal Pass, skin senjata, outfit, dan crate. Harga mulai Rp15.000, proses cepat dan aman.'],
   '[{"id":"userId","label":"Player ID","placeholder":"Masukkan Player ID"}]',
   'br', NULL, true, 3, 4.95, '876rb+')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (slug, name, publisher, cover_url, banner_url, short_desc, long_desc, fields, tags, badge, is_active, sort_order, rating, rating_count)
VALUES
  ('genshin-impact', 'Genshin Impact', 'HoYoverse',
   '/images/26a5b02c-d21f-4296-a694-11ab7a2a2413.png',
   '/images/26a5b02c-d21f-4296-a694-11ab7a2a2413.png',
   'Top up Genesis Crystal Genshin Impact via UID, crystal langsung masuk ke akun.',
   ARRAY['Genshin Impact adalah game open-world RPG dari HoYoverse. Top up Genesis Crystal di AVENXO ONLINE diproses otomatis setelah pembayaran — cukup masukkan UID dan Server (Asia/EU/America), pilih nominal, dan bayar.', 'Genesis Crystal bisa ditukar menjadi Primogem untuk Wish (gacha) karakter dan senjata baru. Harga mulai Rp16.000, proses instan.'],
   '[{"id":"userId","label":"UID","placeholder":"Masukkan UID"},{"id":"server","label":"Server","placeholder":"Pilih server","zone":true}]',
   'populer rpg', 'POPULER', true, 4, 4.96, '652rb+')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (slug, name, publisher, cover_url, banner_url, short_desc, long_desc, fields, tags, badge, is_active, sort_order, rating, rating_count)
VALUES
  ('magic-chess', 'Magic Chess: Go Go', 'Moonton',
   '/images/a250d7d9-fac4-4731-8a84-640cd30dc99b.png',
   '/images/a250d7d9-fac4-4731-8a84-640cd30dc99b.png',
   'Top up Magic Chess Go Go: Go Go Pass dan Diamond dengan User ID.',
   ARRAY['Magic Chess: Go Go adalah game auto-battler dari Moonton. Top up Go Go Pass & Diamond di AVENXO ONLINE diproses otomatis — masukkan User ID, pilih nominal, bayar, dan item langsung masuk ke akun kamu.', 'Go Go Pass & Diamond bisa dipakai untuk ikut event board dan beli hero. Harga mulai Rp5.000.'],
   '[{"id":"userId","label":"User ID","placeholder":"Masukkan User ID"}]',
   'strategy', NULL, true, 5, 4.92, '184rb+')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (slug, name, publisher, cover_url, banner_url, short_desc, long_desc, fields, tags, badge, is_active, sort_order, rating, rating_count)
VALUES
  ('call-of-duty-mobile', 'Call of Duty Mobile', 'Activision',
   '/images/9dc7563b-96ae-4439-bb24-dfc5324695d9.png',
   '/images/9dc7563b-96ae-4439-bb24-dfc5324695d9.png',
   'Top up CP Call of Duty Mobile dengan UID, CP langsung masuk ke akun.',
   ARRAY['Call of Duty Mobile (CODM) adalah game FPS multiplatform dari Activision. Top up CP (Credit Point) di AVENXO ONLINE diproses otomatis — masukkan UID, pilih nominal, bayar, dan CP langsung masuk ke akun CODM kamu.', 'CP bisa dipakai untuk beli Battle Pass, senjata, skin, dan crate. Harga mulai Rp10.000, proses cepat dan aman.'],
   '[{"id":"userId","label":"UID","placeholder":"Masukkan UID"}]',
   'br', NULL, true, 6, 4.94, '421rb+')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 9. SEED DATA — Denominations
-- =============================================
DO $$
DECLARE
  ml_id UUID;
  ff_id UUID;
  pubg_id UUID;
  gi_id UUID;
  mc_id UUID;
  cod_id UUID;
BEGIN
  SELECT id INTO ml_id FROM games WHERE slug = 'mobile-legends';
  SELECT id INTO ff_id FROM games WHERE slug = 'free-fire';
  SELECT id INTO pubg_id FROM games WHERE slug = 'pubg-mobile';
  SELECT id INTO gi_id FROM games WHERE slug = 'genshin-impact';
  SELECT id INTO mc_id FROM games WHERE slug = 'magic-chess';
  SELECT id INTO cod_id FROM games WHERE slug = 'call-of-duty-mobile';

  -- Mobile Legends denominations
  INSERT INTO denominations (game_id, amount, price, is_popular, sort_order) VALUES
    (ml_id, '3 Diamond', 3000, false, 1),
    (ml_id, '5 Diamond', 5000, false, 2),
    (ml_id, '12 Diamond', 12000, true, 3),
    (ml_id, '19 Diamond', 19000, false, 4),
    (ml_id, '28 Diamond', 28000, false, 5),
    (ml_id, '36 Diamond', 36000, false, 6),
    (ml_id, '44 Diamond', 44000, false, 7),
    (ml_id, '59 Diamond', 59000, false, 8),
    (ml_id, '86 Diamond', 86000, false, 9),
    (ml_id, '144 Diamond', 144000, false, 10),
    (ml_id, '172 Diamond', 172000, false, 11),
    (ml_id, '257 Diamond', 257000, false, 12),
    (ml_id, '344 Diamond', 344000, false, 13),
    (ml_id, '429 Diamond', 429000, false, 14),
    (ml_id, '514 Diamond', 514000, false, 15),
    (ml_id, '706 Diamond', 706000, false, 16),
    (ml_id, '1.050 Diamond', 1050000, false, 17),
    (ml_id, '1.412 Diamond', 1412000, false, 18),
    (ml_id, '2.195 Diamond', 2195000, false, 19),
    (ml_id, '3.688 Diamond', 3688000, false, 20)
  ON CONFLICT DO NOTHING;

  -- Free Fire denominations
  INSERT INTO denominations (game_id, amount, price, is_popular, sort_order) VALUES
    (ff_id, '5 Diamond', 2500, false, 1),
    (ff_id, '12 Diamond', 6000, false, 2),
    (ff_id, '50 Diamond', 7000, true, 3),
    (ff_id, '70 Diamond', 10000, false, 4),
    (ff_id, '100 Diamond', 14000, false, 5),
    (ff_id, '140 Diamond', 20000, false, 6),
    (ff_id, '210 Diamond', 30000, false, 7),
    (ff_id, '355 Diamond', 50000, false, 8),
    (ff_id, '720 Diamond', 100000, false, 9),
    (ff_id, '1.080 Diamond', 150000, false, 10),
    (ff_id, '1.450 Diamond', 200000, false, 11),
    (ff_id, '2.180 Diamond', 300000, false, 12),
    (ff_id, '3.640 Diamond', 500000, false, 13)
  ON CONFLICT DO NOTHING;

  -- PUBG Mobile denominations
  INSERT INTO denominations (game_id, amount, price, is_popular, sort_order) VALUES
    (pubg_id, '60 UC', 15000, false, 1),
    (pubg_id, '300 UC', 75000, true, 2),
    (pubg_id, '600 UC', 150000, false, 3),
    (pubg_id, '1.500 UC', 375000, false, 4),
    (pubg_id, '3.000 UC', 750000, false, 5),
    (pubg_id, '6.000 UC', 1500000, false, 6)
  ON CONFLICT DO NOTHING;

  -- Genshin Impact denominations
  INSERT INTO denominations (game_id, amount, price, is_popular, sort_order) VALUES
    (gi_id, '60 Genesis Crystal', 16000, false, 1),
    (gi_id, '300 Genesis Crystal', 79000, false, 2),
    (gi_id, '980 Genesis Crystal', 249000, true, 3),
    (gi_id, '1.980 Genesis Crystal', 499000, false, 4),
    (gi_id, '3.280 Genesis Crystal', 799000, false, 5),
    (gi_id, '6.560 Genesis Crystal', 1599000, false, 6)
  ON CONFLICT DO NOTHING;

  -- Magic Chess denominations
  INSERT INTO denominations (game_id, amount, price, is_popular, sort_order) VALUES
    (mc_id, '12 Diamond', 5000, false, 1),
    (mc_id, '30 Diamond', 12500, false, 2),
    (mc_id, '60 Diamond', 25000, true, 3),
    (mc_id, '120 Diamond', 50000, false, 4),
    (mc_id, '300 Diamond', 125000, false, 5),
    (mc_id, '600 Diamond', 250000, false, 6)
  ON CONFLICT DO NOTHING;

  -- Call of Duty Mobile denominations
  INSERT INTO denominations (game_id, amount, price, is_popular, sort_order) VALUES
    (cod_id, '80 CP', 10000, false, 1),
    (cod_id, '400 CP', 50000, true, 2),
    (cod_id, '800 CP', 100000, false, 3),
    (cod_id, '1.600 CP', 200000, false, 4),
    (cod_id, '4.000 CP', 500000, false, 5),
    (cod_id, '8.000 CP', 1000000, false, 6)
  ON CONFLICT DO NOTHING;
END $$;

-- =============================================
-- 10. SEED DATA — Payment Methods
-- =============================================
INSERT INTO payment_methods (category, label, is_active, sort_order) VALUES
  ('ewallet', 'QRIS', true, 1),
  ('ewallet', 'DANA', true, 2),
  ('ewallet', 'OVO', true, 3),
  ('ewallet', 'GoPay', true, 4),
  ('ewallet', 'ShopeePay', true, 5),
  ('va', 'BCA VA', true, 6),
  ('va', 'BRI VA', true, 7),
  ('va', 'BNI VA', true, 8),
  ('va', 'Mandiri VA', true, 9),
  ('va', 'CIMB VA', true, 10),
  ('bank', 'BCA', true, 11),
  ('bank', 'BRI', true, 12),
  ('bank', 'BNI', true, 13),
  ('pulsa', 'Telkomsel', true, 14),
  ('pulsa', 'XL', true, 15),
  ('pulsa', 'Tri', true, 16)
ON CONFLICT DO NOTHING;

-- =============================================
-- 11. UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
