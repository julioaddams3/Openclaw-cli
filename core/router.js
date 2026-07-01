class CommandRouter {
  constructor(engine) {
    this.engine = engine;
  }

  async handle(command) {
    switch (command) {
      case "status":
        return await this.engine.status();

      case "diff":
        return await this.engine.diff();

      default:
        return {
          error: "Comando no reconocido"
        };
    }
  }
}

module.exports = CommandRouter;
