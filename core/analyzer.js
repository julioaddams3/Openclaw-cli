class Analyzer {
  constructor(gitService) {
    this.git = gitService;
  }

  analyzeDiff(diffText) {
    if (!diffText || diffText.trim() === "") {
      return {
        status: "clean",
        risk: "none",
        summary: "No changes detected in working tree"
      };
    }

    const lines = diffText.split("\n");

    const added = lines.filter(l => l.startsWith("+")).length;
    const removed = lines.filter(l => l.startsWith("-")).length;

    let risk = "low";

    if (added + removed > 50) risk = "medium";
    if (added + removed > 200) risk = "high";

    return {
      status: "changes_detected",
      summary: "Code changes detected in repository",
      stats: {
        added,
        removed,
        total: added + removed
      },
      risk
    };
  }
}

module.exports = Analyzer;
