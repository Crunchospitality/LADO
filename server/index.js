/**
 * LADO Server - Main Entry Point
 * Express API powering the LADO AI agent platform
 *
 * Architecture:
 *   Supabase  → Auth + Database (PostgreSQL)
 *   Redis     → Caching, rate limiting, job queues
 *   Anthropic → Claude AI for Atlas agent
 *   Stripe    → Payments and subscriptions
 *   Telegram  → Messaging channel (separate process)
 *
 * Costa Spirits LLC — www.lado.club
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const Stripe = require('stripe');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIG
// ============================================================================
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiry: process.env.JWT_EXPIRY || '7d',
  },
};

// ============================================================================
// INITIALIZE SERVICES
// ============================================================================

// Supabase client (service role for server-side operations)
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

// Supabase client (anon key for auth-related operations)
const supabaseAuth = createClient(config.supabase.url, config.supabase.anonKey);

// Anthropic Claude
const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

// Stripe
const stripe = new Stripe(config.stripe.secretKey);

// Redis
const redis = new Redis(config.redis.url);
redis.on('error', (err) => console.error('[Redis]', err.message));
redis.on('connect', () => console.log('[Redis] Connected'));

// Load Atlas system prompt
let atlasPrompt = '';
try {
  atlasPrompt = fs.readFileSync(path.join(__dirname, '..', 'CLAUDE.md'), 'utf8');
  console.log('[Atlas] System prompt loaded (' + atlasPrompt.length + ' chars)');
} catch (e) {
  console.warn('[Atlas] CLAUDE.md not found, using fallback prompt');
  atlasPrompt = 'You are Atlas, a freedom agent helping users escape their 9-to-5 through side hustle intelligence.';
}

// ============================================================================
// EXPRESS APP
// ============================================================================
const app = express();

// Stripe webhook needs raw body — must come BEFORE json parser
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.LADO_DOMAIN ? [`https://${process.env.LADO_DOMAIN}`, 'http://localhost:3000'] : '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve static files (landing page, platform, etc.)
app.use(express.static(path.join(__dirname, '..')));

// ============================================================================
// AUTH MIDDLEWARE
// ============================================================================
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify with Supabase
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// ============================================================================
// RATE LIMITING (Redis-based)
// ============================================================================
async function rateLimit(key, maxRequests, windowSeconds) {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current <= maxRequests;
}

function rateLimitMiddleware(maxPerMinute = 60) {
  return async (req, res, next) => {
    const key = `rl:${req.userId || req.ip}:${Math.floor(Date.now() / 60000)}`;
    const allowed = await rateLimit(key, maxPerMinute, 60);
    if (!allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
    }
    next();
  };
}

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/health', async (req, res) => {
  const checks = {
    server: 'ok',
    redis: 'checking',
    supabase: 'checking',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  };

  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch (e) {
    checks.redis = 'error';
  }

  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    checks.supabase = error ? 'error' : 'ok';
  } catch (e) {
    checks.supabase = 'error';
  }

  const allOk = checks.redis === 'ok' && checks.supabase === 'ok';
  res.status(allOk ? 200 : 503).json(checks);
});

// ============================================================================
// AUTH ROUTES (proxy to Supabase Auth)
// ============================================================================
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return res.status(400).json({ error: error.message });

    // Create user profile in our users table
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        lado_name: 'Atlas',
        budget_tier: 'starter',
      });
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  try {
    await supabaseAuth.auth.signOut();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error) return res.status(404).json({ error: 'User not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============================================================================
// USER ROUTES
// ============================================================================
app.put('/api/users/profile', requireAuth, async (req, res) => {
  const allowed = [
    'name', 'lado_name', 'current_job', 'skills', 'hours_per_week',
    'monthly_income', 'monthly_expenses', 'current_savings',
    'side_hustle_income', 'channel',
  ];

  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.put('/api/users/onboarding', requireAuth, async (req, res) => {
  const { current_job, skills, hours_per_week, monthly_income, monthly_expenses, current_savings, side_hustle_income, channel, lado_name } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        current_job, skills, hours_per_week,
        monthly_income, monthly_expenses, current_savings,
        side_hustle_income, channel, lado_name,
        onboarding_complete: true,
      })
      .eq('id', req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Onboarding update failed' });
  }
});

// ============================================================================
// FREEDOM NUMBER (computed metrics)
// ============================================================================
app.get('/api/users/freedom', requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('monthly_income, monthly_expenses, current_savings, side_hustle_income')
      .eq('id', req.userId)
      .single();

    if (error) return res.status(404).json({ error: 'User not found' });

    const freedomNumber = user.monthly_expenses;
    const runwayTarget = user.monthly_expenses * 6;
    const salaryTarget = Math.round(user.monthly_income * 0.75);
    const savingsProgress = runwayTarget > 0 ? Math.min(100, Math.round((user.current_savings / runwayTarget) * 100)) : 0;
    const incomeProgress = freedomNumber > 0 ? Math.min(100, Math.round((user.side_hustle_income / freedomNumber) * 100)) : 0;
    const quitReadyScore = Math.round((savingsProgress + incomeProgress) / 2);

    res.json({
      freedomNumber,
      runwayTarget,
      salaryTarget,
      savingsProgress,
      incomeProgress,
      quitReadyScore,
      currentSavings: user.current_savings,
      sideHustleIncome: user.side_hustle_income,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute freedom metrics' });
  }
});

// ============================================================================
// MISSIONS ROUTES
// ============================================================================
app.get('/api/missions', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*, mission_steps(*)')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

app.post('/api/missions', requireAuth, async (req, res) => {
  const { name, description, engine, due_date, steps } = req.body;
  if (!name || !engine) {
    return res.status(400).json({ error: 'Name and engine are required' });
  }

  try {
    const { data: mission, error } = await supabase
      .from('missions')
      .insert({ user_id: req.userId, name, description, engine, due_date })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Insert steps if provided
    if (steps && steps.length > 0) {
      const stepsData = steps.map((step, idx) => ({
        mission_id: mission.id,
        step_number: idx + 1,
        title: step.title,
        owner: step.owner || 'user',
      }));

      await supabase.from('mission_steps').insert(stepsData);
    }

    // Fetch with steps
    const { data: full } = await supabase
      .from('missions')
      .select('*, mission_steps(*)')
      .eq('id', mission.id)
      .single();

    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mission' });
  }
});

app.put('/api/missions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const allowed = ['name', 'description', 'status', 'due_date', 'progress'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const { data, error } = await supabase
      .from('missions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mission' });
  }
});

// ============================================================================
// TASKS ROUTES
// ============================================================================
app.get('/api/tasks', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', requireAuth, async (req, res) => {
  const { title, description, mission_id, status, due_date } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: req.userId, title, description, mission_id, status: status || 'queued', due_date })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const allowed = ['title', 'description', 'status', 'due_date', 'mission_id'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ============================================================================
// MARKETPLACE ROUTES
// ============================================================================
app.get('/api/marketplace', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch marketplace products' });
  }
});

app.post('/api/marketplace', requireAuth, async (req, res) => {
  const { name, channel, price, production_cost, platform_fee, status, mission_id, deliverables } = req.body;
  if (!name || !channel) return res.status(400).json({ error: 'Name and channel are required' });

  try {
    const margin = (price || 0) - (production_cost || 0) - ((price || 0) * (platform_fee || 0));
    const { data, error } = await supabase
      .from('marketplace_products')
      .insert({
        user_id: req.userId,
        name, channel, price, production_cost, platform_fee,
        projected_margin: margin,
        status: status || 'draft',
        mission_id,
        deliverables,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create marketplace product' });
  }
});

app.put('/api/marketplace/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const allowed = ['name', 'channel', 'price', 'production_cost', 'platform_fee', 'status'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Forward from Execute to Marketplace
app.post('/api/marketplace/forward', requireAuth, async (req, res) => {
  const { mission_id, deliverables, channel, suggested_price, production_cost } = req.body;
  if (!mission_id || !channel) {
    return res.status(400).json({ error: 'Mission ID and channel are required' });
  }

  try {
    // Get mission name
    const { data: mission } = await supabase
      .from('missions')
      .select('name')
      .eq('id', mission_id)
      .eq('user_id', req.userId)
      .single();

    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const feeRates = { etsy: 0.065, shopify: 0.029, gumroad: 0.10, printful: 0.05, eventbrite: 0.037, amazon: 0.15 };
    const feeRate = feeRates[channel] || 0.05;
    const price = suggested_price || 0;
    const prodCost = production_cost || 0;
    const margin = price - (price * feeRate) - prodCost;

    const { data, error } = await supabase
      .from('marketplace_products')
      .insert({
        user_id: req.userId,
        name: mission.name,
        channel,
        price,
        production_cost: prodCost,
        platform_fee: feeRate,
        projected_margin: margin,
        status: 'quote',
        mission_id,
        deliverables,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to forward to marketplace' });
  }
});

// ============================================================================
// HUSTLES ROUTES
// ============================================================================
app.get('/api/hustles', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hustles')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hustles' });
  }
});

app.post('/api/hustles', requireAuth, async (req, res) => {
  const { name, type, monthly_revenue, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const { data, error } = await supabase
      .from('hustles')
      .insert({ user_id: req.userId, name, type, monthly_revenue: monthly_revenue || 0, status: status || 'active' })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hustle' });
  }
});

// ============================================================================
// LEDGER ROUTES (Formalize)
// ============================================================================
app.get('/api/ledger', requireAuth, async (req, res) => {
  const { hustle_id, month } = req.query;

  try {
    let query = supabase
      .from('ledger_entries')
      .select('*')
      .eq('user_id', req.userId)
      .order('date', { ascending: false });

    if (hustle_id) query = query.eq('hustle_id', hustle_id);

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
});

app.post('/api/ledger', requireAuth, async (req, res) => {
  const { date, description, category, amount, type, hustle_id } = req.body;
  if (!description || amount === undefined) {
    return res.status(400).json({ error: 'Description and amount are required' });
  }

  try {
    const { data, error } = await supabase
      .from('ledger_entries')
      .insert({ user_id: req.userId, date: date || new Date().toISOString().split('T')[0], description, category, amount, type: type || (amount >= 0 ? 'income' : 'expense'), hustle_id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ledger entry' });
  }
});

// ============================================================================
// ATLAS AI CHAT
// ============================================================================
app.post('/api/chat', requireAuth, rateLimitMiddleware(30), async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    // Fetch user context
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    // Fetch active missions
    const { data: missions } = await supabase
      .from('missions')
      .select('name, status, progress, engine')
      .eq('user_id', req.userId)
      .in('status', ['active', 'not_started']);

    // Fetch active hustles
    const { data: hustles } = await supabase
      .from('hustles')
      .select('name, type, monthly_revenue, status')
      .eq('user_id', req.userId);

    // Fetch conversation history from Redis (last 20 messages)
    const historyKey = `chat:${req.userId}`;
    const historyRaw = await redis.get(historyKey);
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    // Build user context injection
    const freedomNumber = user.monthly_expenses;
    const runwayTarget = freedomNumber * 6;
    const salaryTarget = Math.round(user.monthly_income * 0.75);
    const savingsProgress = runwayTarget > 0 ? Math.round((user.current_savings / runwayTarget) * 100) : 0;
    const incomeProgress = freedomNumber > 0 ? Math.round((user.side_hustle_income / freedomNumber) * 100) : 0;
    const quitReadyScore = Math.round((savingsProgress + incomeProgress) / 2);

    const userContext = `
User: ${user.name}
Agent Name: ${user.lado_name}
Current Job: ${user.current_job || 'Not specified'}
Skills: ${JSON.stringify(user.skills || [])}
Available Hours/Week: ${user.hours_per_week}
Monthly Salary: $${user.monthly_income}
Monthly Expenses: $${user.monthly_expenses}
Current Savings: $${user.current_savings}
Side Hustle Income: $${user.side_hustle_income}/mo
Freedom Number: $${freedomNumber}/mo
6-Month Runway Target: $${runwayTarget}
75% Salary Target: $${salaryTarget}/mo
Quit-Ready Score: ${quitReadyScore}%
Active Missions: ${missions?.map(m => `${m.name} (${m.status}, ${m.progress}%)`).join(', ') || 'None'}
Active Hustles: ${hustles?.map(h => `${h.name} ($${h.monthly_revenue}/mo)`).join(', ') || 'None'}
Plan Tier: ${user.budget_tier}
Channel: web
`;

    const systemPrompt = atlasPrompt + '\n\n--- CURRENT USER CONTEXT ---\n' + userContext;

    // Add new message to history
    history.push({ role: 'user', content: message });

    // Call Claude
    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: history.slice(-20), // Last 20 messages for context
    });

    const assistantMessage = response.content[0].text;

    // Save to history
    history.push({ role: 'assistant', content: assistantMessage });
    await redis.set(historyKey, JSON.stringify(history.slice(-40)), 'EX', 86400 * 7); // 7 day TTL

    // Log conversation
    await supabase.from('conversations').insert({
      user_id: req.userId,
      channel: 'web',
      messages: [
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() },
      ],
    });

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: req.userId,
      action: 'chat_message',
      details: { messageLength: message.length },
    });

    res.json({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (err) {
    console.error('[Chat Error]', err.message);
    res.status(500).json({ error: 'Atlas is temporarily unavailable. Please try again.' });
  }
});

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================
app.get('/api/knowledge', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

app.post('/api/knowledge', requireAuth, async (req, res) => {
  const { title, content, type } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({ user_id: req.userId, title, content, type: type || 'document' })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to knowledge base' });
  }
});

// ============================================================================
// INTEGRATIONS
// ============================================================================
app.get('/api/integrations', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', req.userId);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

app.post('/api/integrations', requireAuth, async (req, res) => {
  const { provider, access_token, refresh_token, config: intConfig } = req.body;
  if (!provider) return res.status(400).json({ error: 'Provider is required' });

  try {
    const { data, error } = await supabase
      .from('integrations')
      .upsert({
        user_id: req.userId,
        provider,
        access_token,
        refresh_token,
        config: intConfig || {},
        status: 'connected',
      }, { onConflict: 'user_id, provider' })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save integration' });
  }
});

// ============================================================================
// STRIPE WEBHOOK HANDLER
// ============================================================================
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  console.log(`[Stripe] Event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email;
        if (email) {
          await supabase
            .from('users')
            .update({
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            })
            .eq('email', email);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const tierMap = {
          'price_1TGol0P6Kli0ZPQxGm2e0T6z': 'starter',
          'price_1TGol1P6Kli0ZPQx3gdcrUfl': 'pro',
        };
        const tier = tierMap[sub.items.data[0]?.price?.id] || 'starter';

        await supabase
          .from('users')
          .update({ budget_tier: tier })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await supabase
          .from('users')
          .update({ budget_tier: 'starter', stripe_subscription_id: null })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn(`[Stripe] Payment failed for customer: ${invoice.customer}`);
        // TODO: Send notification via Atlas
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[Stripe Webhook] Processing error:', err.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// ============================================================================
// ACTIVITY LOG
// ============================================================================
app.get('/api/activity', requireAuth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// ============================================================================
// USER METRICS (Protect engine)
// ============================================================================
app.get('/api/metrics', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', req.userId)
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

app.post('/api/metrics', requireAuth, async (req, res) => {
  const { hustle_hours, energy_level, confidence_score } = req.body;

  try {
    const { data, error } = await supabase
      .from('user_metrics')
      .insert({
        user_id: req.userId,
        hustle_hours: hustle_hours || 0,
        energy_level: energy_level || 5,
        confidence_score: confidence_score || 50,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save metrics' });
  }
});

// ============================================================================
// CATCH-ALL: Serve index.html for SPA routing
// ============================================================================
app.get('*', (req, res) => {
  // Don't catch API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ============================================================================
// ERROR HANDLER
// ============================================================================
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║        LADO Server v0.1.0            ║');
  console.log('  ║        Costa Spirits LLC             ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║  Port:     ${PORT}                      ║`);
  console.log(`  ║  Env:      ${NODE_ENV.padEnd(24)}║`);
  console.log(`  ║  Supabase: ${config.supabase.url ? 'configured' : 'NOT SET'.padEnd(24)}║`);
  console.log(`  ║  Claude:   ${config.anthropic.apiKey ? 'configured' : 'NOT SET'.padEnd(24)}║`);
  console.log(`  ║  Stripe:   ${config.stripe.secretKey ? 'configured' : 'NOT SET'.padEnd(24)}║`);
  console.log(`  ║  Redis:    ${config.redis.url ? 'configured' : 'NOT SET'.padEnd(24)}║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
