let currentFilter = "all";

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

    /* ---------- BASE LAYOUT ---------- */
    result.innerHTML = `
      <div class="card score-section">
        <div class="score-circle ${scoreClass}">${score}</div>
        <div class="score-info">
          <h2>${label}</h2>
          <p>${data.violationsCount} accessibility issues detected</p>
        </div>
      </div>

      <!-- CATEGORY SCORES -->
      <div class="card summary">
        ${Object.entries(data.categoryScores).map(
          ([key, value]) => `
          <div class="summary-card">
            <h3>${value}</h3>
            <p>${key.charAt(0).toUpperCase() + key.slice(1)}</p>
          </div>
        `
        ).join("")}
      </div>

      <!-- ISSUE DETAILS -->
      <div class="card">
        <h2>Issue Details</h2>

        <div class="filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="critical">Critical</button>
          <button class="filter-btn" data-filter="serious">Serious</button>
          <button class="filter-btn" data-filter="moderate">Moderate</button>
        </div>

        <div id="issuesContainer"></div>
      </div>
    `;

    const issuesContainer = document.getElementById("issuesContainer");

    function renderIssues() {
      issuesContainer.innerHTML = "";

      const filtered = data.violations.filter(v => {
        if (currentFilter === "all") return true;
        return v.impact === currentFilter;
      });

      if (filtered.length === 0) {
        issuesContainer.innerHTML = `<p>No issues for this filter.</p>`;
        return;
      }

      filtered.forEach((v, index) => {
        const issue = document.createElement("div");
        issue.className = `issue ${v.impact}`;

        issue.innerHTML = `
          <div class="issue-header">
            <div>
              <span class="badge ${v.impact}">
                ${v.impact.toUpperCase()}
              </span>
              <strong>${index + 1}. ${v.id}</strong>
            </div>
            <div class="toggle">+</div>
          </div>

          <div class="issue-details">
            ${v.description}<br /><br />
            <strong>Affected elements:</strong> ${v.nodesAffected}<br />
            <a href="${v.helpUrl}" target="_blank">Learn how to fix</a>
          </div>
        `;

        issue.querySelector(".issue-header").addEventListener("click", () => {
          const open = issue.classList.contains("open");

          document.querySelectorAll(".issue").forEach(i => {
            i.classList.remove("open");
            i.querySelector(".toggle").textContent = "+";
          });

          if (!open) {
            issue.classList.add("open");
            issue.querySelector(".toggle").textContent = "−";
          }
        });

        issuesContainer.appendChild(issue);
      });
    }

    renderIssues();

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderIssues();
      });
    });

  } catch (err) {
    console.error(err);
    result.innerHTML = `<div class="card">❌ Failed to analyze website</div>`;
  }
}
