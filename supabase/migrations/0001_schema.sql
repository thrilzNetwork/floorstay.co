-- FloorStay Supabase Schema
-- Multi-tenant direct booking platform for Fort Lauderdale properties

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- OWNERS (Property owners on the network)
-- ==========================================
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  business_name TEXT,
  slug TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#141414',
  headline TEXT,
  knowledge_base TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 10.00,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROPERTIES
-- ==========================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  base_price NUMERIC(10,2) NOT NULL,
  cleaning_fee NUMERIC(10,2) DEFAULT 0,
  ota_links JSONB DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  location JSONB DEFAULT '{}',
  bedrooms INTEGER DEFAULT 1,
  bathrooms NUMERIC(3,1) DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'maintenance')),
  ical_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- BOOKINGS
-- ==========================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  guest_email TEXT NOT NULL,
  guest_name TEXT,
  guest_phone TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  base_total NUMERIC(10,2) NOT NULL,
  cleaning_fee NUMERIC(10,2) DEFAULT 0,
  platform_fee_savings NUMERIC(10,2) DEFAULT 0,
  pay_now_discount NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'airbnb', 'vrbo', 'booking_com', 'referral')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'deposit', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- OTA PRICE CACHE (for comparison engine)
-- ==========================================
CREATE TABLE ota_price_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  ota TEXT NOT NULL CHECK (ota IN ('airbnb', 'vrbo', 'booking_com')),
  price NUMERIC(10,2) NOT NULL,
  fees NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  last_fetched TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, ota)
);

-- ==========================================
-- SYNC LOGS (Calendar sync)
-- ==========================================
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
  message TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties((location->>'city'));
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_owner ON bookings(owner_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_ota_cache_property ON ota_price_cache(property_id);
CREATE INDEX idx_sync_logs_property ON sync_logs(property_id);

-- ==========================================
-- RLS POLICIES (Row Level Security)
-- ==========================================
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ota_price_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Owners: can read/update their own row
CREATE POLICY "owners_self" ON owners
  FOR ALL USING (auth.uid() = auth_id);

-- Properties: owners see their own, public sees active
CREATE POLICY "properties_owner" ON properties
  FOR ALL USING (owner_id IN (SELECT id FROM owners WHERE auth_id = auth.uid()));

CREATE POLICY "properties_public" ON properties
  FOR SELECT USING (status = 'active');

-- Bookings: owners see their own property bookings
CREATE POLICY "bookings_owner" ON bookings
  FOR ALL USING (owner_id IN (SELECT id FROM owners WHERE auth_id = auth.uid()));

-- OTA cache: public read (for storefront)
CREATE POLICY "ota_cache_public" ON ota_price_cache
  FOR SELECT USING (true);

-- Sync logs: owner only
CREATE POLICY "sync_logs_owner" ON sync_logs
  FOR ALL USING (property_id IN (SELECT id FROM properties WHERE owner_id IN (SELECT id FROM owners WHERE auth_id = auth.uid())));

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER owners_updated_at BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
