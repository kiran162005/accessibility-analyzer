const puppeteer = require("puppeteer");
const axeCore = require("axe-core");

/**
 * Map axe rule IDs to categories
 */
function getCategory(ruleId) {
  if (ruleId.includes("image") || ruleId.includes("alt")) return "Images";
  if (ruleId.includes("label") || ruleId.includes("form")) return "Forms";
  if (ruleId.includes("landmark") || ruleId.includes("region")) return "Landmarks";
  if (ruleId.includes("contrast") || ruleId.includes("color")) return "Contrast";
  return "Other";
}

/**
 * Penalty based on impact
 */
function impactPenalty(impact) {
  switch (impact) {
    case "critical":
      return 20;
    case "serious":
      return 10;
    case "moderate":
      return 5;
    case "minor":
      return 2;
    default:
      return 0;
  }
}

/**
 * Run accessibility analysis
 */
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

    // enrich violations with category
    const violations = results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      nodesAffected: v.nodes.length,
      category: getCategory(v.id)
    }));

    return violations;

  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Calculate overall accessibility score
 */
function calculateScore(violations) {
  let score = 100;

  violations.forEach(v => {
    score -= impactPenalty(v.impact);
  });

  return Math.max(score, 0);
}

/**
 * Calculate category-wise scores
 */
function calculateCategoryScores(violations) {
  const categories = {};

  // initialize categories
  violations.forEach(v => {
    if (!categories[v.category]) {
      categories[v.category] = 100;
    }
  });

  // apply penalties
  violations.forEach(v => {
    categories[v.category] -= impactPenalty(v.impact);
  });

  // clamp scores
  Object.keys(categories).forEach(cat => {
    categories[cat] = Math.max(categories[cat], 0);
  });

  return categories;
}

module.exports = {
  analyzeAccessibility,
  calculateScore,
  calculateCategoryScores
};
