const fs = require("fs");
const path = require("path");

class RepositoryScanner {
  constructor(rootPath = process.cwd()) {
    this.rootPath = rootPath;
  }

  /**
   * Devuelve información básica del repositorio.
   */
  scan() {
    return {
      root: this.rootPath,
      exists: fs.existsSync(this.rootPath),
      files: this.listFiles(),
    };
  }

  /**
   * Lista únicamente el primer nivel del proyecto.
   */
  listFiles() {
    try {
      return fs.readdirSync(this.rootPath).sort();
    } catch (error) {
      return [];
    }
  }
}

module.exports = RepositoryScanner;
