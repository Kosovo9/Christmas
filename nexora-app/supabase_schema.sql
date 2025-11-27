-- ============================================
-- NEXORA APP - SUPABASE DATABASE SCHEMA
-- ============================================

-- 1. USER CREDITS TABLE
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);

-- 2. TRANSACTIONS TABLE (Payment History)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    pack_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    credits INTEGER NOT NULL,
    stripe_session_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session ON transactions(stripe_session_id);

-- 3. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    source TEXT DEFAULT 'website',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- 4. GENERATED IMAGES TABLE (Gallery)
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    prompt TEXT,
    scenario TEXT,
    ai_provider TEXT DEFAULT 'gemini',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user images
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);

-- 5. AFFILIATE REFERRALS TABLE
CREATE TABLE IF NOT EXISTS affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id TEXT NOT NULL,
    referred_user_id TEXT NOT NULL,
    referral_code TEXT NOT NULL,
    commission_earned DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for referrals
CREATE INDEX IF NOT EXISTS idx_affiliate_referrer ON affiliate_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_code ON affiliate_referrals(referral_code);

-- 6. VIRAL SHARES TABLE (Track social shares)
CREATE TABLE IF NOT EXISTS viral_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'facebook', 'whatsapp', 'twitter'
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reward_granted BOOLEAN DEFAULT FALSE
);

-- Index for shares
CREATE INDEX IF NOT EXISTS idx_viral_shares_user_id ON viral_shares(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_shares ENABLE ROW LEVEL SECURITY;

-- User Credits Policies
CREATE POLICY "Users can view own credits" ON user_credits
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage credits" ON user_credits
    FOR ALL USING (auth.role() = 'service_role');

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage transactions" ON transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Generated Images Policies
CREATE POLICY "Users can view own images" ON generated_images
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own images" ON generated_images
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage images" ON generated_images
    FOR ALL USING (auth.role() = 'service_role');

-- Newsletter Policies (Public insert, admin read)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view subscribers" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'service_role');

-- Affiliate Policies
CREATE POLICY "Users can view own referrals" ON affiliate_referrals
    FOR SELECT USING (auth.uid()::text = referrer_user_id);

CREATE POLICY "Service role can manage referrals" ON affiliate_referrals
    FOR ALL USING (auth.role() = 'service_role');

-- Viral Shares Policies
CREATE POLICY "Users can view own shares" ON viral_shares
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own shares" ON viral_shares
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage shares" ON viral_shares
    FOR ALL USING (auth.role() = 'service_role');
