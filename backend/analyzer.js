const puppeteer = require("puppeteer");
const axeCore = require("axe-core");

async function analyzeAccessibility(url) {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    await page.addScriptTag({ content: axeCore.source });

    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    return results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodesAffected: v.nodes.length
    }));

  } finally {
    if (browser) await browser.close();
  }
}

function calculateScore(violations) {
  let score = 100;

  violations.forEach(v => {
    switch (v.impact) {
      case "critical":
        score -= 20;
        break;
      case "serious":
        score -= 10;
        break;
      case "moderate":
        score -= 5;
        break;
      case "minor":
        score -= 2;
        break;
    }
  });

  return Math.max(score, 0);
}

module.exports = {
  analyzeAccessibility,
  calculateScore
};
