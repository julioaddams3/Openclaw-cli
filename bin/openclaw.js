#!/usr/bin/env node

const GitService = require("../git/gitService");
const OpenClawEngine = require("../core/engine");
const AutoEngine = require("../core/automation/autoEngine");
const Watcher = require("../core/automation/watcher");

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
 * Safe output
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
 * CLI entry
 */
async function main() {
  const git = new GitService();
  const providerConfig = getProviderConfig();

  const engine = new OpenClawEngine(git, providerConfig);
  const autoEngine = new AutoEngine(providerConfig);
  const watcher = new Watcher(providerConfig);

  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    if (!command) {
      console.log(`
OpenClaw CLI v0

Usage:
  openclaw status
  openclaw diff
  openclaw commit "message"
  openclaw ai "prompt"
  openclaw auto
  openclaw watch [interval]
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

      case "auto": {
        const result = await autoEngine.run();
        return output(result);
      }

      case "watch": {
        const interval = parseInt(args[0]) || 5000;
        const result = await watcher.start(interval);
        return output(result);
      }

      case "help": {
        console.log(`
OpenClaw CLI v0 Commands:

  status   → Git status analysis
  diff     → Git diff + AI analysis
  commit   → Create commit (AI-assisted)
  ai       → Direct AI query
  auto     → Autonomous analysis pipeline
  watch    → Continuous repository monitoring (CI/CD loop)
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
