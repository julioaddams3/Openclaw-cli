const { execSync } = require("child_process");
const AutoEngine = require("./autoEngine");

/**
 * OpenClaw Watcher (OCR-011)
 * Detecta cambios en el repositorio y dispara análisis automático
 */
class Watcher {
  constructor(providerConfig) {
    this.autoEngine = new AutoEngine(providerConfig);
    this.isRunning = false;
  }

  /**
   * Ejecuta git status limpio
   */
  getStatus() {
    return execSync("git status --porcelain", {
      encoding: "utf8",
    });
  }

  /**
   * Ejecuta ciclo de análisis automático
   */
  async runCycle() {
    const status = this.getStatus();

    if (!status || status.trim() === "") {
      return {
        watcher: "idle",
        message: "No changes detected",
      };
    }

    const analysis = await this.autoEngine.run();

    return {
      watcher: "active",
      changes: status,
      analysis,
    };
  }

  /**
   * Loop simple de observación
   */
  async start(interval = 5000) {
    if (this.isRunning) return;

    this.isRunning = true;

    const loop = async () => {
      if (!this.isRunning) return;

      try {
        const result = await this.runCycle();

        console.log("\n=== OPENCLAW WATCHER ===");
        console.log(JSON.stringify(result, null, 2));
        console.log("========================\n");
      } catch (err) {
        console.error("[Watcher Error]", err.message);
      }

      setTimeout(loop, interval);
    };

    loop();

    return {
      watcher: "started",
      interval,
    };
  }

  stop() {
    this.isRunning = false;

    return {
      watcher: "stopped",
    };
  }
}

module.exports = Watcher;
