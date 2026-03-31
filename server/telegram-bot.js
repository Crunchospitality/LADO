/**
 * LADO Telegram Bot Agent
 * Core communication layer for LADO AI platform
 *
 * Handles:
 * - User authentication and context loading
 * - Message routing to Claude AI
 * - Conversation persistence
 * - Proactive messaging via automation scheduler
 * - Command handling (/start, /status, /missions, etc)
 *
 * Dependencies: node-telegram-bot-api, @anthropic-ai/sdk, pg
 */

const TelegramBot = require('node-telegram-bot-api');
const Anthropic = require('@anthropic-ai/sdk');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// ============================================================================
// CONFIGURATION & INITIALIZATION
// ============================================================================

const logger = require('./logger');
const {
  TELEGRAM_BOT_TOKEN,
  ANTHROPIC_API_KEY,
  DATABASE_URL,
  LADO_DOMAIN,
} = process.env;

// Validate environment variables
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}
if (!ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// Initialize services
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const pool = new Pool({ connectionString: DATABASE_URL });

// Configuration constants
const CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  MESSAGE_HISTORY_LIMIT: 20,
  COMMAND_TIMEOUT_MS: 30000,
  RATE_LIMIT_PER_MINUTE: 30,
  CLAUDE_MODEL: 'claude-sonnet-4-20250514',
  SYSTEM_PROMPT_FILE: path.join(__dirname, 'prompts', 'CLAUDE.md'),
};

// In-memory rate limiting (simple implementation - use Redis for production)
const rateLimits = new Map();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Load system prompt from CLAUDE.md
 */
function getSystemPrompt() {
  try {
    if (fs.existsSync(CONFIG.SYSTEM_PROMPT_FILE)) {
      return fs.readFileSync(CONFIG.SYSTEM_PROMPT_FILE, 'utf-8');
    }
    logger.warn('CLAUDE.md not found, using default system prompt');
    return `You are LADO, an AI agent helping entrepreneurs escape their 9-to-5 jobs through intelligent side hustles and business operations.`;
  } catch (error) {
    logger.error('Error loading system prompt:', error);
    return `You are LADO, an AI agent helping entrepreneurs escape their 9-to-5 jobs.`;
  }
}

/**
 * Check and enforce rate limiting per user
 */
function checkRateLimit(userId) {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  if (!rateLimits.has(userId)) {
    rateLimits.set(userId, []);
  }

  const userRequests = rateLimits.get(userId);
  const recentRequests = userRequests.filter((time) => time > oneMinuteAgo);

  if (recentRequests.length >= CONFIG.RATE_LIMIT_PER_MINUTE) {
    return false;
  }

  recentRequests.push(now);
  rateLimits.set(userId, recentRequests);
  return true;
}

/**
 * Split long messages into Telegram-compatible chunks
 */
function splitMessage(text, maxLength = CONFIG.MAX_MESSAGE_LENGTH) {
  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length <= maxLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks.length ? chunks : [text.substring(0, maxLength)];
}

/**
 * Load user from database by telegram_chat_id
 */
async function getUserByTelegramId(chatId) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE telegram_chat_id = $1',
      [chatId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error loading user:', error);
    throw error;
  }
}

/**
 * Create new user after /start
 */
async function createUser(chatId, firstName) {
  try {
    const ladoName = `${firstName}'s LADO Agent`;
    const result = await pool.query(
      `INSERT INTO users (telegram_chat_id, name, email, lado_name, channel, onboarding_complete)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [chatId, firstName, `user_${chatId}@temp.lado`, ladoName, 'telegram', false]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Load conversation history for user
 */
async function getConversationHistory(userId, limit = CONFIG.MESSAGE_HISTORY_LIMIT) {
  try {
    const result = await pool.query(
      `SELECT messages FROM conversations
       WHERE user_id = $1 AND channel = 'telegram'
       ORDER BY updated_at DESC
       LIMIT 1`,
      [userId]
    );

    if (!result.rows.length) return [];

    const conversation = result.rows[0];
    const messages = conversation.messages || [];
    return messages.slice(-limit).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  } catch (error) {
    logger.error('Error loading conversation history:', error);
    return [];
  }
}

/**
 * Save message to conversation history
 */
async function saveMessage(userId, role, content) {
  try {
    const message = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    // Upsert conversation
    await pool.query(
      `INSERT INTO conversations (user_id, channel, messages)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (user_id) DO UPDATE SET
         messages = array_append(
           COALESCE(excluded.messages, '[]'::jsonb),
           $3::jsonb
         ),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, 'telegram', JSON.stringify([message])]
    );
  } catch (error) {
    logger.error('Error saving message:', error);
  }
}

/**
 * Load user context for system prompt injection
 */
async function loadUserContext(userId) {
  try {
    const userResult = await pool.query(
      `SELECT u.*,
              COUNT(DISTINCT m.id) as active_missions_count,
              SUM(CASE WHEN l.entry_type = 'income' THEN l.amount ELSE 0 END) as total_income,
              SUM(CASE WHEN l.entry_type = 'expense' THEN l.amount ELSE 0 END) as total_expenses
       FROM users u
       LEFT JOIN missions m ON u.id = m.user_id AND m.status = 'active'
       LEFT JOIN ledger_entries l ON u.id = l.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (!userResult.rows.length) return null;

    const user = userResult.rows[0];

    // Get latest metrics
    const metricsResult = await pool.query(
      `SELECT * FROM user_metrics
       WHERE user_id = $1
       ORDER BY date DESC
       LIMIT 1`,
      [userId]
    );

    const metrics = metricsResult.rows[0] || {};

    // Get active missions
    const missionsResult = await pool.query(
      `SELECT id, name, status, progress FROM missions
       WHERE user_id = $1 AND status = 'active'
       LIMIT 5`,
      [userId]
    );

    return {
      id: user.id,
      name: user.name,
      ladoName: user.lado_name,
      currentJob: user.current_job,
      skills: user.skills,
      monthlyIncome: user.monthly_income,
      monthlyExpenses: user.monthly_expenses,
      currentSavings: user.current_savings,
      sideHustleIncome: user.side_hustle_income,
      hoursPerWeek: user.hours_per_week,
      budgetTier: user.budget_tier,
      activeMissionsCount: user.active_missions_count,
      confidenceScore: metrics.confidence_score,
      employerDependency: metrics.employer_dependency,
      activeMissions: missionsResult.rows,
    };
  } catch (error) {
    logger.error('Error loading user context:', error);
    return null;
  }
}

/**
 * Build system prompt with user context
 */
function buildSystemPrompt(basePrompt, userContext) {
  if (!userContext) return basePrompt;

  const contextSection = `
## USER CONTEXT

- **Name**: ${userContext.name}
- **LADO Agent Name**: ${userContext.ladoName}
- **Current Situation**: ${userContext.currentJob || 'Between jobs'}
- **Skills**: ${userContext.skills?.join(', ') || 'Not specified'}
- **Monthly Income**: $${userContext.monthlyIncome}
- **Monthly Expenses**: $${userContext.monthlyExpenses}
- **Current Savings**: $${userContext.currentSavings}
- **Side Hustle Income**: $${userContext.sideHustleIncome}
- **Hours Available/Week**: ${userContext.hoursPerWeek}
- **Confidence Score**: ${userContext.confidenceScore || 'N/A'}/100
- **Employer Dependency**: ${userContext.employerDependency || 'N/A'}/100
- **Active Missions**: ${userContext.activeMissionsCount}
${
  userContext.activeMissions?.length
    ? '\n### Current Missions:\n' +
      userContext.activeMissions.map((m) => `- ${m.name} (${m.progress}% complete)`).join('\n')
    : ''
}

Remember to tailor your responses to their specific situation, available resources, and goals.
`;

  return basePrompt + contextSection;
}

/**
 * Log activity to activity_log table
 */
async function logActivity(userId, engine, action, details = {}) {
  try {
    await pool.query(
      `INSERT INTO activity_log (user_id, engine, action, details)
       VALUES ($1, $2, $3, $4)`,
      [userId, engine, action, JSON.stringify(details)]
    );
  } catch (error) {
    logger.error('Error logging activity:', error);
  }
}

/**
 * Call Claude API and stream response
 */
async function callClaudeAPI(userContext, conversationHistory, userMessage) {
  try {
    const basePrompt = getSystemPrompt();
    const systemPrompt = buildSystemPrompt(basePrompt, userContext);

    // Build message history for API
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await anthropic.messages.create({
      model: CONFIG.CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return assistantMessage;
  } catch (error) {
    logger.error('Claude API error:', error);
    throw error;
  }
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

/**
 * /start command - Initialize user or welcome back
 */
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;

  try {
    let user = await getUserByTelegramId(chatId);

    if (!user) {
      // New user - create and send onboarding link
      user = await createUser(chatId, firstName);
      logger.info(`New user created: ${user.id}`);

      const welcomeText = `Welcome to LADO! 🚀

I'm your AI agent, here to help you escape the 9-to-5 and build sustainable freedom through smart side hustles.

Let's get to know you better! Please complete your profile:

${LADO_DOMAIN}/onboard?user=${user.id}

Once you're set up, I'll be able to help with:
- Discovering profitable side hustles
- Building your business systematically
- Formulating growth strategies
- Protecting and scaling what you've built`;

      await bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
    } else {
      // Returning user
      const welcomeBack = `Welcome back, ${user.name}! 👋

${user.lado_name} is ready to help. What can I assist you with today?

Commands:
/status - Your freedom metrics
/missions - Active missions
/schedule - This week's hustle schedule
/help - Full command list`;

      await bot.sendMessage(chatId, welcomeBack, { parse_mode: 'Markdown' });
      await logActivity(user.id, null, 'returned_to_bot', { timestamp: new Date() });
    }
  } catch (error) {
    logger.error('Error handling /start:', error);
    await bot.sendMessage(
      chatId,
      'Error initializing bot. Please try again later.'
    );
  }
});

/**
 * /status command - Show freedom metrics
 */
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    if (!checkRateLimit(chatId)) {
      await bot.sendMessage(chatId, 'Rate limit exceeded. Please wait before sending more messages.');
      return;
    }

    const user = await getUserByTelegramId(chatId);
    if (!user) {
      await bot.sendMessage(chatId, 'Please use /start to initialize.');
      return;
    }

    const metricsResult = await pool.query(
      `SELECT * FROM user_metrics WHERE user_id = $1 ORDER BY date DESC LIMIT 1`,
      [user.id]
    );

    const metrics = metricsResult.rows[0] || {};

    // Calculate Freedom Number (savings / monthly expenses)
    const freedomNumber =
      user.monthly_expenses > 0
        ? Math.floor(user.current_savings / user.monthly_expenses)
        : 0;

    const statusText = `📊 **Your LADO Status**

**Freedom Number**: ${freedomNumber} months
(You can sustain ${freedomNumber} months without income)

**Confidence Score**: ${metrics.confidence_score || '—'}/100
**Employer Dependency**: ${metrics.employer_dependency || '—'}/100

**Financials**:
- Current Savings: $${user.current_savings}
- Monthly Income: $${user.monthly_income}
- Monthly Expenses: $${user.monthly_expenses}
- Side Hustle Income: $${user.side_hustle_income}

**Engagement**:
- Hours Available: ${user.hours_per_week}/week
- Budget Tier: ${user.budget_tier}`;

    await bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error('Error handling /status:', error);
    await bot.sendMessage(chatId, 'Error retrieving status.');
  }
});

/**
 * /missions command - List active missions
 */
bot.onText(/\/missions/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const user = await getUserByTelegramId(chatId);
    if (!user) {
      await bot.sendMessage(chatId, 'Please use /start to initialize.');
      return;
    }

    const missionsResult = await pool.query(
      `SELECT * FROM missions WHERE user_id = $1 ORDER BY updated_at DESC`,
      [user.id]
    );

    if (!missionsResult.rows.length) {
      await bot.sendMessage(
        chatId,
        "You don't have any missions yet. Ask me to help you create one!"
      );
      return;
    }

    let missionText = '🎯 **Your Missions**\n\n';
    missionsResult.rows.forEach((mission) => {
      const statusEmoji =
        {
          'not_started': '⏳',
          'active': '🚀',
          'paused': '⏸',
          'complete': '✅',
        }[mission.status] || '•';

      missionText += `${statusEmoji} **${mission.name}**\nEngine: ${mission.engine} | Progress: ${mission.progress}%\n\n`;
    });

    await bot.sendMessage(chatId, missionText, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error('Error handling /missions:', error);
    await bot.sendMessage(chatId, 'Error retrieving missions.');
  }
});

/**
 * /schedule command - Show hustle schedule for the week
 */
bot.onText(/\/schedule/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const user = await getUserByTelegramId(chatId);
    if (!user) {
      await bot.sendMessage(chatId, 'Please use /start to initialize.');
      return;
    }

    const hustlesResult = await pool.query(
      `SELECT * FROM hustles WHERE user_id = $1 AND status = 'active'`,
      [user.id]
    );

    if (!hustlesResult.rows.length) {
      await bot.sendMessage(chatId, 'You have no active hustles scheduled.');
      return;
    }

    let scheduleText = '📅 **This Week\'s Hustle Schedule**\n\n';
    hustlesResult.rows.forEach((hustle) => {
      scheduleText += `**${hustle.name}** (${hustle.category})\nStatus: ${hustle.status}\nRevenue This Month: $${hustle.revenue_this_month}\n\n`;
    });

    await bot.sendMessage(chatId, scheduleText, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error('Error handling /schedule:', error);
    await bot.sendMessage(chatId, 'Error retrieving schedule.');
  }
});

/**
 * /help command - Show all available commands
 */
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  const helpText = `🤖 **LADO Commands**

*Core Commands:*
/start - Initialize or return to bot
/status - View your freedom metrics
/missions - List your active missions
/schedule - This week's hustle schedule

*Chat & Interaction:*
Just send me a message and I'll help with:
- Discovering side hustles
- Building your business
- Formalizing strategies
- Protecting and scaling

*Settings:*
/profile - Update your profile
/settings - Preferences and integrations

*Support:*
/help - This message`;

  await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// ============================================================================
// MESSAGE HANDLER
// ============================================================================

/**
 * Handle all text messages - Route to Claude API
 */
bot.on('message', async (msg) => {
  // Skip command messages (handled above)
  if (msg.text?.startsWith('/')) return;

  const chatId = msg.chat.id;
  const messageText = msg.text;

  try {
    // Rate limiting
    if (!checkRateLimit(chatId)) {
      await bot.sendMessage(
        chatId,
        'You\'re sending messages too quickly. Please wait a moment.'
      );
      return;
    }

    // Load or create user
    let user = await getUserByTelegramId(chatId);
    if (!user) {
      user = await createUser(chatId, msg.from.first_name);
    }

    // Show typing indicator
    await bot.sendChatAction(chatId, 'typing');

    // Load context and conversation history
    const userContext = await loadUserContext(user.id);
    const conversationHistory = await getConversationHistory(user.id);

    // Call Claude API
    const assistantResponse = await callClaudeAPI(
      userContext,
      conversationHistory,
      messageText
    );

    // Save messages to database
    await saveMessage(user.id, 'user', messageText);
    await saveMessage(user.id, 'assistant', assistantResponse);

    // Log activity
    await logActivity(user.id, null, 'sent_message', {
      messageLength: messageText.length,
      responseLength: assistantResponse.length,
    });

    // Split and send response
    const chunks = splitMessage(assistantResponse);
    for (const chunk of chunks) {
      await bot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
    }
  } catch (error) {
    logger.error('Error processing message:', error);
    await bot.sendMessage(
      chatId,
      'Sorry, I encountered an error processing your message. Please try again.'
    );
  }
});

// ============================================================================
// PROACTIVE MESSAGING
// ============================================================================

/**
 * Send proactive message to user
 * Called by automation scheduler
 */
async function sendProactiveMessage(userId, message) {
  try {
    const user = await pool.query('SELECT telegram_chat_id FROM users WHERE id = $1', [
      userId,
    ]);

    if (!user.rows.length || !user.rows[0].telegram_chat_id) {
      logger.warn(`User ${userId} not found or has no Telegram chat ID`);
      return false;
    }

    const chatId = user.rows[0].telegram_chat_id;
    const chunks = splitMessage(message);

    for (const chunk of chunks) {
      await bot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
    }

    // Log proactive message
    await logActivity(userId, null, 'received_proactive_message', {
      messageLength: message.length,
    });

    return true;
  } catch (error) {
    logger.error('Error sending proactive message:', error);
    return false;
  }
}

// ============================================================================
// ERROR HANDLING & LIFECYCLE
// ============================================================================

bot.on('error', (error) => {
  logger.error('Telegram bot error:', error);
});

bot.on('polling_error', (error) => {
  logger.error('Telegram polling error:', error);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down telegram bot...');
  bot.stopPolling();
  await pool.end();
  process.exit(0);
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  bot,
  sendProactiveMessage,
  getUserByTelegramId,
  loadUserContext,
  callClaudeAPI,
};
