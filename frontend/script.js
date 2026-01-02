async function analyze() {
  const url = document.getElementById("urlInput").value;
  const output = document.getElementById("output");

  if (!url) {
    output.innerHTML = "❌ Please enter a URL";
    return;
  }

  output.innerHTML = "⏳ Analyzing...";

  try {
    const response = await fetch(
      `http://localhost:3000/analyze?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    if (data.error) {
      output.innerHTML = `❌ ${data.error}`;
      return;
    }

    let html = `<h3>Violations Found: ${data.violationsCount}</h3>`;

    data.violations.forEach(v => {
      html += `
        <div class="issue">
          <strong>${v.id}</strong> (${v.impact})<br>
          ${v.description}<br>
          Affected Elements: ${v.nodesAffected}<br>
          <a href="${v.helpUrl}" target="_blank">Learn more</a>
        </div>
      `;
    });

    output.innerHTML = html;

  } catch (err) {
    output.innerHTML = "❌ Failed to fetch analysis";
  }
}
