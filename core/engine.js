const { execSync } = require("child_process");

class OpenClawEngine {
  constructor(gitService, providerConfig) {
    this.git = gitService;
    this.provider = providerConfig;
  }

  /**
   * Ejecuta comandos git de forma segura
   */
  runGit(command) {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  }

  /**
   * Git Status
   */
  async status() {
    try {
      const raw = this.runGit("git status --porcelain");

      return {
        command: "status",
        success: true,
        data: raw || "Clean working tree",
      };
    } catch (error) {
      return {
        command: "status",
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Git Diff
   */
  async diff() {
    try {
      const raw = this.runGit("git diff");

      return {
        command: "diff",
        success: true,
        raw,
        analysis: {
          status: raw.length ? "dirty" : "clean",
          risk: raw.length ? "unknown" : "none",
          summary: raw.length
            ? "Changes detected"
            : "No changes detected",
        },
      };
    } catch (error) {
      return {
        command: "diff",
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * AI Request
   */
  async ai(prompt) {
    try {
      if (!prompt) {
        throw new Error("Prompt is required");
      }

      if (!this.provider || this.provider.name === "none") {
        throw new Error("No AI provider configured.");
      }

      const Provider = require(
        `../providers/${this.provider.name}Provider`
      );

      const provider = new Provider(this.provider.config.apiKey);

      const response = await provider.analyze(prompt);

      // ===== DEBUG =====
      console.log("\n========== PROVIDER RESPONSE ==========");
      console.dir(response, { depth: null });
      console.log("=======================================\n");

      return {
        command: "ai",
        success: response.success === true,
        provider: response.provider,
        model: response.model,
        output: response.output,
        error: response.error || null,
      };
    } catch (error) {
      return {
        command: "ai",
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Git Commit
   */
  async commit(message) {
    try {
      if (!message) {
        throw new Error("Commit message required");
      }

      this.runGit("git add .");

      this.runGit(`git commit -m "${message}"`);

      return {
        command: "commit",
        success: true,
        message,
      };
    } catch (error) {
      return {
        command: "commit",
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = OpenClawEngine;
