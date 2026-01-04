-- =====================================================
-- GELİR-GİDER TAKİP UYGULAMASI - SUPABASE MIGRATION
-- =====================================================
-- Bu SQL dosyasını Supabase SQL Editor'de çalıştırın
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  default_currency TEXT DEFAULT 'TRY' CHECK (default_currency IN ('TRY', 'USD', 'EUR', 'GBP')),
  auto_update_rates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT DEFAULT '📌',
  color TEXT DEFAULT '#6B7280',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own categories" 
  ON categories FOR ALL 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================================================
-- 3. RECURRING ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS recurring_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  company_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR', 'GBP')),
  category_id TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'yearly')),
  day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  last_generated DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for recurring_items
ALTER TABLE recurring_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own recurring items" 
  ON recurring_items FOR ALL 
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  company_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR', 'GBP')),
  exchange_rate DECIMAL(10,4) DEFAULT 1,
  amount_try DECIMAL(15,2) GENERATED ALWAYS AS (amount * exchange_rate) STORED,
  category_id TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'paid', 'cancelled')),
  is_recurring BOOLEAN DEFAULT false,
  recurring_id UUID REFERENCES recurring_items(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own transactions" 
  ON transactions FOR ALL 
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. EXCHANGE RATES TABLE (Cache)
-- =====================================================
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  currency_from TEXT NOT NULL CHECK (currency_from IN ('USD', 'EUR', 'GBP')),
  currency_to TEXT NOT NULL DEFAULT 'TRY',
  rate DECIMAL(10,4) NOT NULL,
  source TEXT DEFAULT 'manual',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(currency_from, currency_to)
);

-- RLS for exchange_rates (public read)
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exchange rates" 
  ON exchange_rates FOR SELECT 
  TO authenticated 
  USING (true);

-- =====================================================
-- 6. MONTHLY SUMMARIES TABLE (Performance)
-- =====================================================
CREATE TABLE IF NOT EXISTS monthly_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_income DECIMAL(15,2) DEFAULT 0,
  total_expense DECIMAL(15,2) DEFAULT 0,
  net_profit DECIMAL(15,2) GENERATED ALWAYS AS (total_income - total_expense) STORED,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

-- RLS for monthly_summaries
ALTER TABLE monthly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own summaries" 
  ON monthly_summaries FOR ALL 
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for transactions
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for recurring_items
CREATE TRIGGER update_recurring_items_updated_at
  BEFORE UPDATE ON recurring_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function: Update monthly summary
CREATE OR REPLACE FUNCTION update_monthly_summary()
RETURNS TRIGGER AS $$
DECLARE
  v_year INTEGER;
  v_month INTEGER;
  v_user_id UUID;
BEGIN
  -- Get the relevant values
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
    v_year := EXTRACT(YEAR FROM OLD.transaction_date);
    v_month := EXTRACT(MONTH FROM OLD.transaction_date);
  ELSE
    v_user_id := NEW.user_id;
    v_year := EXTRACT(YEAR FROM NEW.transaction_date);
    v_month := EXTRACT(MONTH FROM NEW.transaction_date);
  END IF;

  -- Upsert the summary
  INSERT INTO monthly_summaries (user_id, year, month, total_income, total_expense)
  SELECT 
    v_user_id,
    v_year,
    v_month,
    COALESCE(SUM(CASE WHEN type = 'income' AND status != 'cancelled' THEN amount_try ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'expense' AND status != 'cancelled' THEN amount_try ELSE 0 END), 0)
  FROM transactions
  WHERE user_id = v_user_id
    AND EXTRACT(YEAR FROM transaction_date) = v_year
    AND EXTRACT(MONTH FROM transaction_date) = v_month
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET
    total_income = EXCLUDED.total_income,
    total_expense = EXCLUDED.total_expense,
    updated_at = NOW();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update summary on transaction changes
CREATE TRIGGER trigger_update_monthly_summary
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_monthly_summary();

-- =====================================================
-- 8. DEFAULT DATA - Exchange Rates
-- =====================================================
INSERT INTO exchange_rates (currency_from, currency_to, rate, source) VALUES
  ('USD', 'TRY', 43.05, 'initial'),
  ('EUR', 'TRY', 46.80, 'initial'),
  ('GBP', 'TRY', 54.20, 'initial')
ON CONFLICT (currency_from, currency_to) DO UPDATE SET
  rate = EXCLUDED.rate,
  fetched_at = NOW();

-- =====================================================
-- 9. DEFAULT CATEGORIES (Global)
-- =====================================================
INSERT INTO categories (user_id, name, type, icon, color, is_default) VALUES
  (NULL, 'Tıbbi Hizmetler', 'income', '🏥', '#10B981', true),
  (NULL, 'Diş Hizmetleri', 'income', '🦷', '#8B5CF6', true),
  (NULL, 'Danışmanlık', 'income', '💼', '#3B82F6', true),
  (NULL, 'Maaş', 'income', '💰', '#F59E0B', true),
  (NULL, 'Diğer Gelir', 'income', '➕', '#6B7280', true),
  (NULL, 'Ev Giderleri', 'expense', '🏠', '#EF4444', true),
  (NULL, 'Yazılım/Dijital', 'expense', '💻', '#8B5CF6', true),
  (NULL, 'Kişisel', 'expense', '👤', '#F59E0B', true),
  (NULL, 'Ulaşım', 'expense', '🚗', '#3B82F6', true),
  (NULL, 'Personel', 'expense', '👥', '#EC4899', true),
  (NULL, 'Diğer Gider', 'expense', '➖', '#6B7280', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Artık Supabase veritabanınız hazır.
-- .env dosyanıza NEXT_PUBLIC_SUPABASE_URL ve 
-- NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerini ekleyin.
-- =====================================================
