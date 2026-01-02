async function analyze() {
  const url = document.getElementById("urlInput").value;
  const result = document.getElementById("result");

  if (!url) {
    alert("Please enter a URL");
    return;
  }

  result.innerHTML = `<div class="card">⏳ Analyzing accessibility...</div>`;

  try {
    const res = await fetch(
      `http://localhost:3000/analyze?url=${encodeURIComponent(url)}`
    );
    const data = await res.json();

    console.log("Violations count:", data.violations.length);
    console.log("Violations array:", data.violations);

    const score = data.accessibilityScore;

    let scoreClass = "score-good";
    let label = "Good Accessibility";

    if (score < 80) {
      scoreClass = "score-medium";
      label = "Needs Improvement";
    }
    if (score < 50) {
      scoreClass = "score-bad";
      label = "Poor Accessibility";
    }

    // ---------- BASE LAYOUT ----------
    result.innerHTML = `
      <div class="card score-section">
        <div class="score-circle ${scoreClass}">${score}</div>
        <div class="score-info">
          <h2>${label}</h2>
          <p>${data.violationsCount} accessibility issues detected</p>
        </div>
      </div>

      <div class="card summary">
        <div class="summary-card">
          <h3>${data.violationsCount}</h3>
          <p>Total Issues</p>
        </div>
        <div class="summary-card">
          <h3>${score}</h3>
          <p>Accessibility Score</p>
        </div>
        <div class="summary-card">
          <h3>WCAG</h3>
          <p>Guideline Based</p>
        </div>
      </div>

      <div class="card">
        <h2>Issue Details</h2>
        <div id="issuesContainer"></div>
      </div>
    `;

    // ---------- APPEND ISSUES SAFELY ----------
    const issuesContainer = document.getElementById("issuesContainer");

    if (data.violations.length === 0) {
      issuesContainer.innerHTML = `<p>✅ No accessibility issues found.</p>`;
      return;
    }

    data.violations.forEach((v, index) => {
      const issueDiv = document.createElement("div");
      issueDiv.className = `issue ${v.impact}`;

      issueDiv.innerHTML = `
        <span class="badge ${v.impact}">
          ${v.impact.toUpperCase()}
        </span><br />
        <strong>${index + 1}. ${v.id}</strong><br />
        ${v.description}<br /><br />
        <strong>Affected elements:</strong> ${v.nodesAffected}<br />
        <a href="${v.helpUrl}" target="_blank">Learn how to fix</a>
      `;

      issuesContainer.appendChild(issueDiv);
    });

  } catch (err) {
    console.error(err);
    result.innerHTML = `<div class="card">❌ Failed to analyze website</div>`;
  }
}
