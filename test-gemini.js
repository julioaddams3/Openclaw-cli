const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no está definida.");
    }

    console.log("API Key detectada:");
    console.log(apiKey.substring(0, 8) + "..." + apiKey.slice(-4));

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent("Responde únicamente: OK");

    const response = await result.response;

    console.log("\n===== RESPUESTA =====");
    console.log(response.text());
    console.log("=====================\n");

  } catch (err) {
    console.error("\n===== ERROR =====");
    console.error(err);
    console.error("=================\n");
  }
}

main();
