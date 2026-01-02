const express = require("express");
const cors = require("cors");
const { analyzeAccessibility, calculateScore } = require("./analyzer");

const app = express();
app.use(cors());

/**
 * Categorize violations based on rule id
 */
function categorizeViolations(violations) {
  const categories = {
    landmarks: [],
    images: [],
    forms: [],
    contrast: [],
    other: []
  };

  violations.forEach(v => {
    if (v.id.includes("landmark") || v.id.includes("region")) {
      categories.landmarks.push(v);
    } else if (v.id.includes("image") || v.id.includes("alt")) {
      categories.images.push(v);
    } else if (v.id.includes("label") || v.id.includes("form")) {
      categories.forms.push(v);
    } else if (v.id.includes("contrast")) {
      categories.contrast.push(v);
    } else {
      categories.other.push(v);
    }
  });

  return categories;
}

/**
 * Calculate score per category
 */
function calculateCategoryScores(categories) {
  const scores = {};

  Object.keys(categories).forEach(cat => {
    scores[cat] = calculateScore(categories[cat]);
  });

  return scores;
}

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.send("Accessibility Analyzer Backend Running 🚀");
});

app.get("/analyze", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const violations = await analyzeAccessibility(url);

    const overallScore = calculateScore(violations);
    const categorized = categorizeViolations(violations);
    const categoryScores = calculateCategoryScores(categorized);

    res.json({
      url,
      accessibilityScore: overallScore,
      violationsCount: violations.length,
      categoryScores,
      violations
    });
  } catch (err) {
    res.status(500).json({
      error: "Accessibility analysis failed",
      message: err.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
