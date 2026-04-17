#!/usr/bin/env bun
/**
 * qabot slack CLI — interact with Slack using Bot Token
 *
 * Usage:
 *   qabot slack channels               # list channels
 *   qabot slack history #channel 10    # show recent messages
 *   qabot slack send #channel "msg"    # send a message
 *   qabot slack search "query"         # search messages (needs xoxp token)
 *   qabot slack user U12345            # lookup user name
 *
 * Uses SLACK_BOT_TOKEN from .env.local (auto-loaded by Bun)
 * For search: also needs SLACK_MCP_XOXP_TOKEN (User OAuth Token)
 * Or: @snomiao/slack-cli via SLACK_MCP_XOXP_TOKEN for native search
 */

import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  console.error("SLACK_BOT_TOKEN not set in .env.local");
  process.exit(1);
}

const client = new WebClient(token);
const [subcmd, ...args] = process.argv.slice(2);

if (!subcmd || subcmd === "help" || subcmd === "--help") {
  console.log(`qabot slack <command> [args]

Commands:
  channels                    List public channels
  history <channel> [limit]   Show recent messages (default 10)
  send <channel> <text> [ts]  Send a message (optionally in thread)
  search <query>              Search messages (needs User Token)
  replies <channel> <ts>      Get thread replies
  user <userId>               Look up user display name
  help                        Show this help

Channel: use #name or C... ID`);
  process.exit(0);
}

async function resolveChannel(ref: string): Promise<string> {
  if (ref.startsWith("C") || ref.startsWith("D")) return ref;
  const name = ref.replace(/^#/, "");
  const resp = await client.conversations.list({ types: "public_channel,private_channel", limit: 200 });
  const ch = resp.channels?.find((c) => c.name === name);
  if (ch?.id) return ch.id;
  throw new Error(`Channel "${ref}" not found`);
}

async function main() {
  try {
    switch (subcmd) {
      case "channels":
      case "list": {
        const resp = await client.conversations.list({ types: "public_channel", limit: 100 });
        for (const ch of resp.channels || []) {
          const members = ch.num_members || 0;
          console.log(`${ch.id}  #${ch.name}  (${members} members)`);
        }
        break;
      }

      case "history":
      case "h": {
        if (!args[0]) { console.error("Usage: qabot slack history <channel> [limit]"); process.exit(1); }
        const channelId = await resolveChannel(args[0]);
        const limit = parseInt(args[1] || "10");
        const resp = await client.conversations.history({ channel: channelId, limit });
        for (const msg of (resp.messages || []).reverse()) {
          const time = new Date(parseFloat(msg.ts!) * 1000).toLocaleString();
          let name = msg.user || msg.bot_id || "?";
          try { const u = await client.users.info({ user: msg.user! }); name = u.user?.real_name || u.user?.name || name; } catch {}
          console.log(`[${time}] <${name}> ${(msg.text || "").slice(0, 300)}`);
        }
        break;
      }

      case "send":
      case "s": {
        if (!args[0] || !args[1]) { console.error("Usage: qabot slack send <channel> <text> [thread_ts]"); process.exit(1); }
        const channelId = await resolveChannel(args[0]);
        const resp = await client.chat.postMessage({ channel: channelId, text: args[1], thread_ts: args[2] });
        console.log(`Sent: ${resp.ts}`);
        break;
      }

      case "search":
      case "q": {
        // search.messages requires User Token (xoxp), not Bot Token
        const xoxp = process.env.SLACK_MCP_XOXP_TOKEN;
        if (!xoxp) {
          // Try native slack-cli
          try {
            const slack = require("../lib/slack-cli");
            const result = JSON.parse(await slack.search(args.join(" ")));
            for (const m of (result.messages?.matches || []).slice(0, 20)) {
              console.log(`#${m.channel?.name || "?"}  <${m.username || "?"}>  ${(m.text || "").slice(0, 200)}`);
            }
            break;
          } catch {}
          console.error("Search needs SLACK_MCP_XOXP_TOKEN (User OAuth Token)");
          process.exit(1);
        }
        const searchClient = new WebClient(xoxp);
        const resp = await searchClient.search.messages({ query: args.join(" ") });
        for (const m of (resp.messages?.matches || []).slice(0, 20)) {
          console.log(`#${(m as any).channel?.name || "?"}  <${(m as any).username || "?"}>  ${((m as any).text || "").slice(0, 200)}`);
        }
        break;
      }

      case "replies":
      case "r": {
        if (!args[0] || !args[1]) { console.error("Usage: qabot slack replies <channel> <ts>"); process.exit(1); }
        const channelId = await resolveChannel(args[0]);
        const resp = await client.conversations.replies({ channel: channelId, ts: args[1] });
        for (const msg of resp.messages || []) {
          const time = new Date(parseFloat(msg.ts!) * 1000).toLocaleString();
          console.log(`[${time}] <${msg.user || "?"}> ${(msg.text || "").slice(0, 300)}`);
        }
        break;
      }

      case "user":
      case "u": {
        if (!args[0]) { console.error("Usage: qabot slack user <userId>"); process.exit(1); }
        const resp = await client.users.info({ user: args[0] });
        console.log(`${resp.user?.real_name || resp.user?.name || "?"} (${resp.user?.id})`);
        break;
      }

      default:
        console.error(`Unknown: ${subcmd}. Run 'qabot slack help'`);
        process.exit(1);
    }
  } catch (err: any) {
    console.error(`Error: ${err.message || err}`);
    process.exit(1);
  }
}

main();
