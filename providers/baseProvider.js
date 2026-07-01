class BaseProvider {
  async analyze(prompt) {
    throw new Error("analyze() must be implemented by provider");
  }
}

module.exports = BaseProvider;
