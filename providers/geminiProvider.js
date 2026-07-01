const BaseProvider = require("./baseProvider");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiProvider extends BaseProvider {
  constructor(apiKey) {
    super();

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    // 🔥 MODELO CORRECTO (seguro según tu API)
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });
  }

  async analyze(prompt) {
    try {
      if (!prompt) {
        throw new Error("Prompt is required");
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        provider: "gemini",
        success: true,
        model: "gemini-2.5-flash",
        output: text
      };

    } catch (error) {
      return {
        provider: "gemini",
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = GeminiProvider;
