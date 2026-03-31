-- LADO Platform PostgreSQL Schema
-- Version: 0.1.0
-- Created: 2026-03-30

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE - Core user profiles
-- Note: Authentication is handled by Supabase Auth (auth.users).
-- The users.id here matches auth.users.id from Supabase for 1:1 mapping.
-- Password hashing is handled by Supabase — no password_hash stored here.
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY,  -- matches Supabase auth.users.id
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,

  -- LADO Agent Configuration
  lado_name VARCHAR(100) NOT NULL,
  current_job VARCHAR(255),
  skills JSONB DEFAULT '[]'::jsonb,

  -- Financial Metrics
  hours_per_week INTEGER DEFAULT 0,
  monthly_income INTEGER DEFAULT 0,
  monthly_expenses INTEGER DEFAULT 0,
  current_savings INTEGER DEFAULT 0,
  side_hustle_income INTEGER DEFAULT 0,

  -- Communication Channels
  channel VARCHAR(50) CHECK (channel IN ('telegram', 'discord', 'whatsapp', 'web')),
  telegram_chat_id BIGINT UNIQUE,
  discord_user_id VARCHAR(255) UNIQUE,

  -- Stripe Integration
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  budget_tier VARCHAR(50) DEFAULT 'starter' CHECK (budget_tier IN ('starter', 'pro', 'unlimited')),

  -- Onboarding & Status
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MISSIONS TABLE - Multi-step goals aligned with LADO engines
-- ============================================================================
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'active', 'paused', 'complete')),
  engine VARCHAR(50) NOT NULL CHECK (engine IN ('discover', 'build', 'formalize', 'protect')),
  due_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MISSION STEPS TABLE - Granular steps within missions
-- ============================================================================
CREATE TABLE mission_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'ai_working', 'needs_input', 'done')),
  assigned_to VARCHAR(50) DEFAULT 'ai' CHECK (assigned_to IN ('ai', 'user')),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_mission_steps UNIQUE(mission_id, step_number)
);

-- ============================================================================
-- TASKS TABLE - Actionable items with AI/user assignment
-- ============================================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'review', 'done', 'failed')),
  engine VARCHAR(50) CHECK (engine IN ('discover', 'build', 'formalize', 'protect')),
  assigned_to VARCHAR(50) DEFAULT 'ai' CHECK (assigned_to IN ('ai', 'user')),
  estimated_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- ============================================================================
-- AUTOMATIONS TABLE - Scheduled recurring actions and workflows
-- ============================================================================
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50) CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  cron_expression VARCHAR(255),
  engine VARCHAR(50) CHECK (engine IN ('discover', 'build', 'formalize', 'protect')),
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMP,
  next_run_at TIMESTAMP,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- HUSTLES TABLE - Side business ventures
-- ============================================================================
CREATE TABLE hustles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'concluded')),
  revenue_this_month INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MARKETPLACE PRODUCTS TABLE - Products/services sold via hustle
-- ============================================================================
CREATE TABLE marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hustle_id UUID REFERENCES hustles(id) ON DELETE SET NULL,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  product_type VARCHAR(50) DEFAULT 'physical' CHECK (product_type IN ('physical', 'digital', 'service', 'event')),
  channel VARCHAR(100) CHECK (channel IN ('etsy', 'shopify', 'gumroad', 'printful', 'eventbrite', 'amazon', 'custom')),
  external_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('quote', 'draft', 'active', 'sold_out', 'archived')),
  price NUMERIC(10,2),
  production_cost NUMERIC(10,2) DEFAULT 0,
  platform_fee NUMERIC(5,4) DEFAULT 0,
  projected_margin NUMERIC(10,2) DEFAULT 0,
  deliverables JSONB DEFAULT '[]'::jsonb,
  orders_count INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOCUMENTS TABLE - Generated business documents (P&L, projections, etc)
-- ============================================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hustle_id UUID REFERENCES hustles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  doc_type VARCHAR(100) NOT NULL CHECK (doc_type IN ('pnl', 'projection', 'business_plan', 'branding', 'loan_package', 'tax_summary')),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'ready')),
  file_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- LEDGER ENTRIES TABLE - Financial transaction log
-- ============================================================================
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hustle_id UUID REFERENCES hustles(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  amount INTEGER NOT NULL,
  entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('income', 'expense')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- KNOWLEDGE BASE TABLE - User-uploaded documents and context files
-- ============================================================================
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(512) NOT NULL,
  file_url VARCHAR(512) NOT NULL,
  file_type VARCHAR(50),
  summary TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONVERSATIONS TABLE - Message history for continuity
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(50) CHECK (channel IN ('telegram', 'discord', 'whatsapp', 'web')),
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ACTIVITY LOG TABLE - Audit trail of all significant actions
-- ============================================================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engine VARCHAR(50),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INTEGRATIONS TABLE - Third-party service connections
-- ============================================================================
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(100) NOT NULL CHECK (service IN ('gmail', 'google_calendar', 'stripe', 'etsy', 'shopify', 'slack', 'discord', 'whatsapp')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'revoked')),
  config JSONB DEFAULT '{}'::jsonb,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_integration UNIQUE(user_id, service)
);

-- ============================================================================
-- USER METRICS TABLE - Time-series metrics for freedom tracking
-- ============================================================================
CREATE TABLE user_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  employer_dependency INTEGER CHECK (employer_dependency >= 0 AND employer_dependency <= 100),
  savings_total INTEGER DEFAULT 0,
  hustle_income_total INTEGER DEFAULT 0,
  hustle_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_daily_metrics UNIQUE(user_id, date)
);

-- ============================================================================
-- INDEXES - Performance optimization
-- ============================================================================

-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_telegram_chat_id ON users(telegram_chat_id);
CREATE INDEX idx_users_discord_user_id ON users(discord_user_id);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Missions
CREATE INDEX idx_missions_user_id ON missions(user_id);
CREATE INDEX idx_missions_status ON missions(status);

-- Tasks
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_mission_id ON tasks(mission_id);

-- Automations
CREATE INDEX idx_automations_user_id ON automations(user_id);
CREATE INDEX idx_automations_next_run_at ON automations(next_run_at);

-- Activity Log
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- Conversations
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);

-- Hustles
CREATE INDEX idx_hustles_user_id ON hustles(user_id);
CREATE INDEX idx_hustles_status ON hustles(status);

-- Marketplace Products
CREATE INDEX idx_marketplace_products_user_id ON marketplace_products(user_id);
CREATE INDEX idx_marketplace_products_hustle_id ON marketplace_products(hustle_id);
CREATE INDEX idx_marketplace_products_mission_id ON marketplace_products(mission_id);
CREATE INDEX idx_marketplace_products_status ON marketplace_products(status);

-- Ledger
CREATE INDEX idx_ledger_entries_user_id ON ledger_entries(user_id);
CREATE INDEX idx_ledger_entries_hustle_id ON ledger_entries(hustle_id);
CREATE INDEX idx_ledger_entries_date ON ledger_entries(date);

-- User Metrics
CREATE INDEX idx_user_metrics_user_id_date ON user_metrics(user_id, date);

-- ============================================================================
-- TRIGGERS - Automatic timestamp management
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on users
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger on missions
CREATE TRIGGER trigger_missions_updated_at
BEFORE UPDATE ON missions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger on automations
CREATE TRIGGER trigger_automations_updated_at
BEFORE UPDATE ON automations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger on marketplace_products
CREATE TRIGGER trigger_marketplace_products_updated_at
BEFORE UPDATE ON marketplace_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger on integrations
CREATE TRIGGER trigger_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger on conversations
CREATE TRIGGER trigger_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- GRANTS - Permission management (adjust as needed for your deployment)
-- ============================================================================
GRANT CONNECT ON DATABASE lado TO lado;
GRANT USAGE ON SCHEMA public TO lado;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lado;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lado;
