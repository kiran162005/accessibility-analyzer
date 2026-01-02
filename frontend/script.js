async function analyze() {
  const url = document.getElementById("urlInput").value;
  const result = document.getElementById("result");

  if (!url) {
    alert("Please enter a URL");
    return;
  }

  result.innerHTML = `
    <div class="card">⏳ Analyzing accessibility...</div>
  `;

  try {
    const res = await fetch(
      `http://localhost:3000/analyze?url=${encodeURIComponent(url)}`
    );
    const data = await res.json();

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

    let html = `
      <div class="card score-section">
        <div class="score-circle ${scoreClass}">
          ${score}
        </div>
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
    `;

    if (data.violationsCount === 0) {
      html += `<p>✅ No accessibility issues found.</p>`;
    } else {
      data.violations.forEach(v => {
        html += `
          <div class="issue ${v.impact}">
            <span class="badge ${v.impact}">
              ${v.impact.toUpperCase()}
            </span><br />
            <strong>${v.id}</strong><br />
            ${v.description}<br /><br />
            Affected elements: ${v.nodesAffected}<br />
            <a href="${v.helpUrl}" target="_blank">Learn how to fix</a>
          </div>
        `;
      });
    }

    html += `</div>`;
    result.innerHTML = html;

  } catch (err) {
    result.innerHTML = `
      <div class="card">❌ Failed to analyze website</div>
    `;
  }
}
