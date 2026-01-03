let currentFilter = "all";
let lastViolations = [];

async function analyze() {
  const url = document.getElementById("urlInput").value;
  const result = document.getElementById("result");

  if (!url) return alert("Enter a URL");

  result.innerHTML = `<div class="card">⏳ Analyzing...</div>`;

  const res = await fetch(
    `http://localhost:3000/analyze?url=${encodeURIComponent(url)}`
  );
  const data = await res.json();

  lastViolations = data.violations;

  const score = data.accessibilityScore;
  const scoreClass =
    score >= 80 ? "score-good" : score >= 50 ? "score-medium" : "score-bad";

  result.innerHTML = `
    <div class="card score-section">
      <div class="score-circle ${scoreClass}">${score}</div>
      <div>
        <h2>${score >= 80 ? "Good" : "Needs Improvement"}</h2>
        <p>${data.violationsCount} issues found</p>
      </div>
    </div>

    <div class="card summary">
      ${Object.entries(data.categoryScores || {}).map(
        ([k, v]) => `<div class="summary-card"><h3>${v}</h3><p>${k}</p></div>`
      ).join("")}
    </div>

    <div class="card">
      <h2>Keyboard Accessibility</h2>
      <div class="kb-box">
        Status: <strong>${data.keyboardAccessibility.status}</strong>
      </div>
    </div>

    <div class="card">
      <h2>Issues</h2>
      <div class="filters">
        ${["all","critical","serious","moderate"].map(f =>
          `<button class="filter-btn ${f==="all"?"active":""}" onclick="setFilter('${f}', this)">
            ${f}
          </button>`
        ).join("")}
      </div>

      <div id="issues"></div>

      <button class="download-btn" onclick="downloadPDF('${url}')">
        Download PDF Report
      </button>
    </div>
  `;

  renderIssues();
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderIssues();
}

function renderIssues() {
  const box = document.getElementById("issues");
  box.innerHTML = "";

  lastViolations
    .filter(v => currentFilter === "all" || v.impact === currentFilter)
    .forEach((v, i) => {
      const div = document.createElement("div");
      div.className = `issue ${v.impact}`;
      div.innerHTML = `
        <div class="issue-header">
          ${i + 1}. ${v.id}
          <span>+</span>
        </div>
        <div class="issue-details">
          ${v.description}<br/>
          Affected elements: ${v.nodesAffected}<br/>
          <a href="${v.helpUrl}" target="_blank">Fix guide</a>
        </div>
      `;
      div.querySelector(".issue-header").onclick = () =>
        div.classList.toggle("open");
      box.appendChild(div);
    });
}

function downloadPDF(url) {
  window.open(
    `http://localhost:3000/report?url=${encodeURIComponent(url)}`,
    "_blank"
  );
}
