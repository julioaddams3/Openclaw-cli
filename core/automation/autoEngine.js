const { execSync } = require("child_process");
const ProviderManager = require("../../providers/providerManager");

/**
 * OpenClaw Automation Engine (OCR-010)
 * Responsable de detectar cambios y ejecutar análisis IA
 */
class AutoEngine {
  constructor(providerConfig) {
    this.providerManager = new ProviderManager();

    if (providerConfig && providerConfig.name !== "none") {
      this.providerManager.loadProvider(
        providerConfig.name,
        providerConfig.config
      );
    }
  }

  /**
   * Detecta cambios en git
   */
  getChanges() {
    try {
      const status = execSync("git status --porcelain", {
        encoding: "utf8",
      });

      const diff = execSync("git diff", {
        encoding: "utf8",
      });

      return {
        status,
        diff,
      };
    } catch (err) {
      return {
        status: "",
        diff: "",
        error: err.message,
      };
    }
  }

  /**
   * Análisis IA de cambios
   */
  async analyzeChanges() {
    const { status, diff } = this.getChanges();

    const prompt = `
Eres OpenClaw Automation Engine.

Analiza estos cambios de Git:

STATUS:
${status}

DIFF:
${diff}

Responde:
- Riesgo
- Calidad del cambio
- Recomendación de commit
`;

    const result = await this.providerManager.analyze(prompt);

    return {
      success: result.success,
      analysis: result.output || result.error,
    };
  }

  /**
   * Pipeline automático base
   */
  async run() {
    const analysis = await this.analyzeChanges();

    return {
      engine: "autoEngine",
      status: "executed",
      result: analysis,
    };
  }
}

module.exports = AutoEngine;
