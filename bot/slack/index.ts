/**
 * Comfy QA Slack Bot
 *
 * Responds to @mentions in #qa-bot-playground and DMs from admin.
 * Uses OpenAI gpt-4o with read-only tools to query QA task list.
 *
 * Setup:
 *   1. Create Slack app at https://api.slack.com/apps
 *   2. Enable Socket Mode + Event Subscriptions (app_mention, message.im)
 *   3. Add Bot Token Scopes: chat:write, app_mentions:read, im:history
 *   4. Set env vars in .env.local:
 *      SLACK_BOT_TOKEN=xoxb-...
 *      SLACK_APP_TOKEN=xapp-...
 *      SLACK_SIGNING_SECRET=...
 *      OPENAI_API_KEY=sk-...
 *      QABOT_ADMIN=U... (Slack user ID of admin, e.g. @snomiao)
 *
 * Run:
 *   bun bot/slack/index.ts
 */

import App from "@slack/bolt";
import OpenAI from "openai";
import { toolDefinitions, executeTool } from "./tools";

// ── Config ──
const ALLOWED_CHANNEL = process.env.QABOT_CHANNEL || "qa-bot-playground";
const ADMIN_USER_ID = process.env.QABOT_ADMIN || "";
const MODEL = "gpt-4o";

const SYSTEM_PROMPT = `You are Comfy QA Bot — a helpful assistant that answers questions about QA test results for Comfy-Org products.

You have access to read-only tools that query the QA registry at comfy-qa.pages.dev. The registry contains:
- QA bug reproduction results (reproduced / not-repro / inconclusive) from automated E2E tests
- Demo videos of Comfy-Org product walkthroughs

When asked about QA results, use the tools to look up the data. Always include URLs so people can view the results directly.

Keep responses concise and use Slack formatting:
- *bold* for emphasis
- \`code\` for issue numbers and branches
- <URL|text> for links

You are read-only — you cannot trigger new QA runs or modify results. If asked to run QA, point to the GitHub Actions workflow.`;

// ── Init ──
const app = new App.default({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Use OpenRouter if available, fallback to OpenAI directly
const openai = new OpenAI(
  process.env.OPENROUTER_API_KEY
    ? {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      }
    : { apiKey: process.env.OPENAI_API_KEY },
);

// ── Helpers ──
async function isAllowed(
  event: { channel: string; user: string; channel_type?: string },
): Promise<boolean> {
  // Allow DMs from admin
  if (event.channel_type === "im" && event.user === ADMIN_USER_ID) return true;

  // Allow mentions in the designated channel
  try {
    const info = await app.client.conversations.info({
      channel: event.channel,
    });
    const channelName = (info.channel as any)?.name || "";
    if (channelName === ALLOWED_CHANNEL) return true;
  } catch {}

  return false;
}

async function chat(userMessage: string): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  // Tool-calling loop (max 5 rounds)
  for (let i = 0; i < 5; i++) {
    const resp = await openai.chat.completions.create({
      model: MODEL,
      messages,
      tools: toolDefinitions,
      tool_choice: "auto",
    });

    const choice = resp.choices[0];
    if (!choice) break;

    const msg = choice.message;
    messages.push(msg);

    // If no tool calls, return the text response
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      return msg.content || "I couldn't generate a response.";
    }

    // Execute tool calls
    for (const tc of msg.tool_calls) {
      const args = JSON.parse(tc.function.arguments || "{}");
      const result = await executeTool(tc.function.name, args);
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      });
    }
  }

  return "I ran out of tool-calling rounds. Please try a simpler question.";
}

// ── Event Handlers ──

// @mention in channels
app.event("app_mention", async ({ event, say }) => {
  if (!(await isAllowed(event))) {
    await say({
      text: `Sorry, I only respond in #${ALLOWED_CHANNEL}.`,
      thread_ts: event.ts,
    });
    return;
  }

  // Strip the bot mention from the message
  const text = event.text.replace(/<@[A-Z0-9]+>/g, "").trim();
  if (!text) {
    await say({
      text: "Hi! Ask me about QA results. Try: `what's the latest QA status?` or `show me issue #10766`",
      thread_ts: event.ts,
    });
    return;
  }

  try {
    // Show typing indicator
    const reply = await chat(text);
    await say({ text: reply, thread_ts: event.ts, unfurl_links: false });
  } catch (err) {
    console.error("Chat error:", err);
    await say({
      text: `Error: ${String(err).slice(0, 200)}`,
      thread_ts: event.ts,
    });
  }
});

// DMs
app.event("message", async ({ event, say }) => {
  // Only handle DMs (im channel type)
  if ((event as any).channel_type !== "im") return;
  // Ignore bot's own messages
  if ((event as any).bot_id) return;

  const ev = event as any;
  if (!(await isAllowed({ channel: ev.channel, user: ev.user, channel_type: "im" }))) {
    await say({ text: "Sorry, only the admin can DM me.", thread_ts: ev.ts });
    return;
  }

  const text = ev.text?.trim();
  if (!text) return;

  try {
    const reply = await chat(text);
    await say({ text: reply, thread_ts: ev.ts, unfurl_links: false });
  } catch (err) {
    console.error("Chat error:", err);
    await say({ text: `Error: ${String(err).slice(0, 200)}`, thread_ts: ev.ts });
  }
});

// ── Start ──
(async () => {
  await app.start();
  console.log("⚡ Comfy QA Bot is running");
  console.log(`  Channel: #${ALLOWED_CHANNEL}`);
  console.log(`  Admin: ${ADMIN_USER_ID || "(not set)"}`);
  console.log(`  Model: ${MODEL}`);
  console.log(`  Tools: ${toolDefinitions.map((t) => t.function.name).join(", ")}`);
})();
