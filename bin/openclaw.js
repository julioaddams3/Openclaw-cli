#!/usr/bin/env node

const GitService = require("../git/gitService");
const OpenClawEngine = require("../core/engine");

/**
 * Provider configuration (AI layer)
 */
function getProviderConfig() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      name: "none",
      config: {},
    };
  }

  return {
    name: "gemini",
    config: {
      apiKey,
    },
  };
}

/**
 * CLI bootstrap
 */
const git = new GitService();
const engine = new OpenClawEngine(git, getProviderConfig());

const command = process.argv[2];
const args = process.argv.slice(3);

/**
 * Safe JSON output
 */
function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Error handler
 */
function handleError(cmd, error) {
  output({
    command: cmd,
    success: false,
    error: error?.message || String(error),
  });
}

/**
 * Main CLI router
 */
async function main() {
  try {
    if (!command) {
      console.log(`
OpenClaw CLI v0

Usage:
  openclaw status
  openclaw diff
  openclaw commit "message"
  openclaw ai "prompt"
      `);
      return;
    }

    switch (command) {
      case "status": {
        const result = await engine.status();
        return output(result);
      }

      case "diff": {
        const result = await engine.diff();
        return output(result);
      }

      case "commit": {
        const message = args.join(" ");
        const result = await engine.commit(message);
        return output(result);
      }

      case "ai": {
        const prompt = args.join(" ");
        const result = await engine.ai(prompt);
        return output(result);
      }

      case "help": {
        console.log(`
OpenClaw CLI v0 Commands:

  status   → Git status analysis
  diff     → Git diff + AI analysis
  commit   → Create commit (AI-assisted)
  ai       → Direct AI query
        `);
        return;
      }

      default:
        return output({
          success: false,
          error: `Unknown command: ${command}`,
        });
    }
  } catch (err) {
    handleError(command, err);
  }
}

main();
