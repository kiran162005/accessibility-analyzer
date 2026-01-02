const express = require("express");
const cors = require("cors");
const { analyzeAccessibility, calculateScore } = require("./analyzer");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Health check route
 */
app.get("/", (req, res) => {
  res.send("Accessibility Analyzer Backend Running 🚀");
});

/**
 * Accessibility analysis route
 * Example:
 * http://localhost:3000/analyze?url=https://example.com
 */
app.get("/analyze", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL is required"
    });
  }

  try {
    // 1. Run accessibility analysis
    const violations = await analyzeAccessibility(url);

    // 2. Calculate accessibility score
    const accessibilityScore = calculateScore(violations);

    // 3. Send response
    res.json({
      url,
      accessibilityScore,
      violationsCount: violations.length,
      violations
    });

  } catch (error) {
    console.error("Accessibility analysis error:", error);

    res.status(500).json({
      error: "Accessibility analysis failed",
      message: error.message
    });
  }
});

/**
 * Start server
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
