-- LADO Row Level Security Policies
-- Run this in Supabase SQL Editor after schema.sql

-- ============================================================================
-- USERS TABLE
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());

-- ============================================================================
-- MISSIONS TABLE
-- ============================================================================
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions" ON missions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own missions" ON missions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own missions" ON missions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own missions" ON missions FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- MISSION_STEPS TABLE
-- ============================================================================
ALTER TABLE mission_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mission steps" ON mission_steps FOR SELECT
  USING (mission_id IN (SELECT id FROM missions WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own mission steps" ON mission_steps FOR INSERT
  WITH CHECK (mission_id IN (SELECT id FROM missions WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own mission steps" ON mission_steps FOR UPDATE
  USING (mission_id IN (SELECT id FROM missions WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own mission steps" ON mission_steps FOR DELETE
  USING (mission_id IN (SELECT id FROM missions WHERE user_id = auth.uid()));

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- AUTOMATIONS TABLE
-- ============================================================================
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automations" ON automations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own automations" ON automations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own automations" ON automations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own automations" ON automations FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- HUSTLES TABLE
-- ============================================================================
ALTER TABLE hustles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hustles" ON hustles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own hustles" ON hustles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own hustles" ON hustles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own hustles" ON hustles FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- MARKETPLACE_PRODUCTS TABLE
-- ============================================================================
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products" ON marketplace_products FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own products" ON marketplace_products FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own products" ON marketplace_products FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own products" ON marketplace_products FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- LEDGER_ENTRIES TABLE
-- ============================================================================
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ledger entries" ON ledger_entries FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own ledger entries" ON ledger_entries FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own ledger entries" ON ledger_entries FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own ledger entries" ON ledger_entries FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- KNOWLEDGE_BASE TABLE
-- ============================================================================
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own knowledge base" ON knowledge_base FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own knowledge base" ON knowledge_base FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own knowledge base" ON knowledge_base FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own knowledge base" ON knowledge_base FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- ACTIVITY_LOG TABLE
-- ============================================================================
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity log" ON activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own activity log" ON activity_log FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own activity log" ON activity_log FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own activity log" ON activity_log FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- INTEGRATIONS TABLE
-- ============================================================================
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integrations" ON integrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own integrations" ON integrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own integrations" ON integrations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own integrations" ON integrations FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- USER_METRICS TABLE
-- ============================================================================
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics" ON user_metrics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own metrics" ON user_metrics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own metrics" ON user_metrics FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own metrics" ON user_metrics FOR DELETE USING (user_id = auth.uid());
