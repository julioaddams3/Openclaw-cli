const { execSync } = require("child_process");

class GitService {
  status() {
    return execSync("git status", { encoding: "utf-8" });
  }

  diff() {
    return execSync("git diff", { encoding: "utf-8" });
  }

  log() {
    return execSync("git log --oneline -5", { encoding: "utf-8" });
  }
}

module.exports = GitService;
