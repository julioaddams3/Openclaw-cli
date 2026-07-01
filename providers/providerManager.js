const GeminiProvider = require("./geminiProvider");

class ProviderManager {
  constructor() {
    this.provider = null;
  }

  loadProvider(name, config) {
    switch (name) {
      case "gemini":
        this.provider = new GeminiProvider(config.apiKey);
        break;

      default:
        throw new Error("Provider not supported");
    }
  }

  async analyze(prompt) {
    if (!this.provider) {
      throw new Error("No provider loaded");
    }

    return await this.provider.analyze(prompt);
  }
}

module.exports = ProviderManager;
