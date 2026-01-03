# ♿ Accessibility Analyzer

A **full-stack web application** that analyzes websites for **WCAG accessibility issues**, calculates an **accessibility score**, categorizes problems, checks **keyboard accessibility**, and generates a **downloadable PDF report**.

This project helps developers and organizations build **inclusive, accessible, and user-friendly websites**.

---

## 🚀 Features

### 🌐 Website Accessibility Analysis
- Audits live websites using WCAG rules
- Detects accessibility violations using **axe-core**

### 📊 Accessibility Score (0–100)
- Overall accessibility score
- Color-coded results:
  - Good
  - Needs Improvement
  - Poor

### 🧩 Category-Wise Scoring
- Landmarks
- Forms
- Images
- Color Contrast
- Other issues

### ⚠️ Issue Severity Detection
- Critical
- Serious
- Moderate
- Minor

### 🔍 Expandable Issue Details
- Click to expand/collapse issue explanations
- Includes official fix guide links

### 🎛️ Severity Filters
- Filter issues by impact level for easy prioritization

### ⌨️ Keyboard Accessibility Check
- Basic keyboard usability status
- Focus and semantic accessibility awareness

### 📄 Downloadable PDF Report
- Clean, formatted accessibility audit report
- Includes:
  - Accessibility score
  - Category-wise scores
  - Complete list of issues

### 🎨 Modern Responsive UI
- Clean dashboard design
- Accessible color contrast
- User-friendly layout

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (separated stylesheet)
- Vanilla JavaScript

### Backend
- Node.js
- Express.js

### Accessibility & Analysis
- Puppeteer (headless browser automation)
- axe-core (WCAG accessibility engine)

### Reporting
- PDFKit (PDF generation)

---

## 📂 Project Structure
accessibility-analyzer/
│
├── backend/
│ ├── index.js # Express server & APIs
│ └── analyzer.js # Accessibility analysis logic
│
├── frontend/
│ ├── index.html # UI structure
│ ├── style.css # UI styling
│ └── script.js # Frontend logic
│
├── package.json
├── .gitignore
└── README.md

## ⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/accessibility-analyzer.git
cd accessibility-analyzer
2️⃣ Install Dependencies
npm install
3️⃣ Start the Backend Server
npm start

**Server runs at:**

http://localhost:3000

## ▶️ How to Use

1. Open `frontend/index.html` in a browser
2. Enter a website URL (example: `https://example.com`)
3. Click **Analyze**
4. View:
   - Accessibility score
   - Category scores
   - Keyboard accessibility status
   - Detailed issues
5. Click **Download PDF Report** to export results



## 📄 API Endpoints

### 🔍 Analyze Website

GET /analyze?url=https://example.com


**Returns:**
- Accessibility score
- Category scores
- Keyboard accessibility status
- List of violations

### 📥 Download PDF Report

GET /report?url=https://example.com
Downloads a formatted PDF accessibility audit report.

## 🎯 Use Cases

- Developers testing website accessibility
- Students learning WCAG & inclusive design
- Accessibility audits for projects
- Hackathons & academic submissions
- Resume & portfolio showcase


## 🧠 What This Project Demonstrates

- Real-world accessibility testing
- WCAG guideline awareness
- Full-stack development skills
- UI/UX design thinking
- API design & integration
- Report generation & automation


## 👤 Author
Kiran T
Computer Science & Engineering Student
Accessibility • Web Development • Software Engineering