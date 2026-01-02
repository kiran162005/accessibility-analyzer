const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const { analyzeAccessibility } = require("./analyzer");

const app = express();
app.use(cors());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Accessibility Analyzer Backend Running 🚀");
});

/* ---------------- ANALYSIS API ---------------- */
app.get("/analyze", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const analysis = await analyzeAccessibility(url);

    /* -------- PHASE 5: KEYBOARD ACCESSIBILITY -------- */
    const keyboardAccessibility = {
      status: analysis.violations.length > 0 ? "Needs Improvement" : "Pass",
      note: "Based on focusable & semantic accessibility checks"
    };

    res.json({
      url,
      accessibilityScore: analysis.accessibilityScore,
      violationsCount: analysis.violations.length,
      categoryScores: analysis.categoryScores,
      keyboardAccessibility,
      violations: analysis.violations
    });

  } catch (err) {
    res.status(500).json({
      error: "Accessibility analysis failed",
      message: err.message
    });
  }
});

/* ---------------- PHASE 4: PDF REPORT ---------------- */
app.get("/report", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL required");

  try {
    const analysis = await analyzeAccessibility(url);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=accessibility-report.pdf"
    );

    doc.pipe(res);

    /* ---- PDF STYLING ---- */
    doc.fontSize(22).text("Accessibility Audit Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Website: ${url}`);
    doc.text(`Accessibility Score: ${analysis.accessibilityScore}/100`);
    doc.text(`Total Issues: ${analysis.violations.length}`);
    doc.text(`Generated On: ${new Date().toLocaleString()}`);

    doc.moveDown();
    doc.fontSize(18).text("Category Scores", { underline: true });
    doc.moveDown();

    Object.entries(analysis.categoryScores).forEach(([cat, score]) => {
      doc.fontSize(12).text(`${cat.toUpperCase()}: ${score}/100`);
    });

    doc.moveDown();
    doc.fontSize(18).text("Accessibility Issues", { underline: true });
    doc.moveDown();

    if (analysis.violations.length === 0) {
      doc.text("🎉 No accessibility issues found.");
    } else {
      analysis.violations.forEach((v, i) => {
        doc
          .fontSize(12)
          .text(
            `${i + 1}. [${v.impact.toUpperCase()}] ${v.id}\n${v.description}\nAffected elements: ${v.nodesAffected}`,
            { paragraphGap: 10 }
          );
      });
    }

    doc.end();

  } catch (err) {
    res.status(500).send("Failed to generate PDF report");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
