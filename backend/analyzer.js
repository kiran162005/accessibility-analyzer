const puppeteer = require("puppeteer");
const axeCore = require("axe-core");

/* ---------------- SCORE CALCULATION ---------------- */
function calculateScore(violations) {
  let score = 100;

  violations.forEach(v => {
    if (v.impact === "critical") score -= 20;
    else if (v.impact === "serious") score -= 10;
    else if (v.impact === "moderate") score -= 5;
    else if (v.impact === "minor") score -= 2;
  });

  return Math.max(score, 0);
}

/* ---------------- CATEGORY SCORING (PHASE 3) ---------------- */
function calculateCategoryScores(violations) {
  const categories = {
    landmarks: [],
    forms: [],
    images: [],
    contrast: [],
    other: []
  };

  violations.forEach(v => {
    const id = v.id.toLowerCase();

    if (id.includes("landmark")) categories.landmarks.push(v);
    else if (id.includes("form") || id.includes("label")) categories.forms.push(v);
    else if (id.includes("image") || id.includes("alt")) categories.images.push(v);
    else if (id.includes("contrast") || id.includes("color")) categories.contrast.push(v);
    else categories.other.push(v);
  });

  const scores = {};
  Object.keys(categories).forEach(key => {
    scores[key] = calculateScore(categories[key]);
  });

  return scores;
}

/* ---------------- MAIN ANALYSIS ---------------- */
async function analyzeAccessibility(url) {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.addScriptTag({ content: axeCore.source });

    const results = await page.evaluate(async () => await axe.run());

    const violations = results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      nodesAffected: v.nodes.length
    }));

    return {
      violations,
      accessibilityScore: calculateScore(violations),
      categoryScores: calculateCategoryScores(violations)
    };

  } finally {
    if (browser) await browser.close();
  }
}

module.exports = {
  analyzeAccessibility
};
