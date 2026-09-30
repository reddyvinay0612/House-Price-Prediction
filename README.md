# 🏛️ Bharat House Price Estimator
### Directorate of Housing Analytics • Government of India (Demo Portal)
> **National Econometric Real Estate Valuation, Geospatial GIS, and Conversational AI Platform**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-orange.svg)](https://scikit-learn.org/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-green.svg)]()
[![Model Accuracy](https://img.shields.io/badge/Champion_R²-98.94%25-success.svg)]()

---

## 📋 Table of Contents
1. [Overview & Highlights](#-overview--highlights)
2. [Milestones Architecture (M1 – M12)](#-milestones-architecture-m1--m12)
3. [Quick Start & One-Command Launcher](#-quick-start--one-command-launcher)
4. [Demo Accounts & Credentials](#-demo-accounts--credentials)
5. [4-Minute Presentation Demo Script](#-4-minute-presentation-demo-script)
6. [Judges' Q&A Cheat Sheet](#-judges-qa-cheat-sheet)
7. [Pitch Deck Summary](#-pitch-deck-summary)

---

## 🌟 Overview & Highlights

**Bharat House Price Estimator** is a government-grade property valuation, financial feasibility, and real estate intelligence platform built for Indian citizens, banks, and urban planning authorities.

### Key Capabilities
- **Certified 5-Fold ML Champion Model:** Gradient Boosting & XGBoost regressors delivering **$R^2 = 98.94\%$** and **RMSE ₹9.73 Lakh** on 13,320+ calibrated Indian housing records.
- **Tree SHAP Explainability (M2):** Transparently reveals *Why This Price?* with horizontal feature attribution charts and plain-language citizen summaries.
- **What-If Sensitivity Simulator (M1):** Real-time 300ms debounced sliders simulating area expansions, bathrooms, parking bays, and construction quality with step-by-step waterfall charts.
- **Interactive India Map (M3):** State-level choropleth GIS dashboard with price, growth, and investment score heatmaps.
- **Financial Feasibility & Buy-vs-Rent (M4):** Home loan reducing-balance EMI calculators, year-wise amortization schedules, and 10-year equity accumulation crossover charts.
- **Asking-Price Verification (M6):** Instant fair-value gauge and outlier mispricing alerts (>30% deviation).
- **5-Year Growth Forecasts (M7):** Compound annual growth modeling with optimistic, base, and cautious volatility bands.
- **Government Officer Compliance Dashboard (M9):** Role-protected administrative dashboard for circle rate parity audits, revenue leakage tracking, and CSV/PDF export.
- **Valuation Certificates (M10):** Single-click high-resolution PDF download with official headers, QR code verification, and statutory disclaimers.
- **Griha Mitra AI Assistant (M11):** Claude-powered bilingual conversational AI with 7 tool-calling capabilities and voice speech synthesis.

---

## 🏗️ Milestones Architecture (M1 – M12)

```
d:\Hackathon\
├── backend/                       # FastAPI Backend Service
│   ├── main.py                    # REST & SSE Streaming Endpoints
│   ├── valuation_engine.py        # Econometrics, SHAP & Sensitivity Engine
│   ├── tools.py                   # Claude Function-Calling Handlers (7 Tools)
│   ├── report_pdf.py              # PDF Valuation Certificate Generator
│   ├── chat.py                    # Claude Streaming & Rate Limiting (25 req/min)
│   └── requirements.txt           # Python Dependencies
├── portal/                        # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Fullscreen Citizen Gateway
│   │   │   ├── Estimate.jsx       # Main Valuation Wizard (M2, M6, M8, M10)
│   │   │   ├── WhatIf.jsx         # M1 What-If Simulator with Waterfall Chart
│   │   │   ├── IndiaMap.jsx       # M3 Interactive Geospatial Map Dashboard
│   │   │   ├── FinanceCalculator.jsx # M4 EMI & Buy-vs-Rent Analyzer
│   │   │   ├── CompareProperties.jsx # M5 Dual Property Comparator
│   │   │   ├── ForecastDashboard.jsx # M7 5-Year Forecast & Top 10 Scores
│   │   │   ├── OfficerDashboard.jsx  # M9 Protected Government Officer Portal
│   │   │   └── Dashboard.jsx      # Citizen Saved Records Dashboard
│   │   ├── components/
│   │   │   ├── estimate/          # WhyThisPrice, AmenitiesInput, AskingPriceChecker, EmiCard, PdfReportButton
│   │   │   ├── common/            # DemoTour (M12), Toast, ModelStrip
│   │   │   └── chat/              # Griha Mitra AI Floating Widget & Voice Button
│   │   ├── services/              # api.js, demoModel.js (Offline Math), chatApi.js
│   │   └── context/               # AuthContext.jsx, AppContext.jsx
├── data/                          # india_state_district_house_prices.csv, forecast_projections.json
├── models/                        # metrics.json, champion_model.joblib
├── train.py                       # 5-Fold Cross Validation ML Training Script
├── seed_data.py                   # Data Seeder & Benchmark Generator
├── run_all.bat                    # One-Command Double-Click Launcher
├── JUDGES_QA.md                   # 10 Questions & Answers for Judges
└── PITCH_DECK.md                  # 5-Slide Pitch Deck Outline
```

---

## 🚀 Quick Start & One-Command Launcher

### Method 1: Single-Click Batch Launcher (Windows)
Double-click **`run_all.bat`** or run:
```powershell
.\run_all.bat
```

### Method 2: Manual Terminal Startup

#### 1. Seed Data & Run Machine Learning Benchmarks
```powershell
python seed_data.py
python train.py
```

#### 2. Start the FastAPI Backend
```powershell
cd backend
python -m uvicorn main:app --reload --port 8000
```

#### 3. Start the React Frontend Portal
```powershell
cd portal
npm install
npm run dev
```

Open **`http://localhost:5173`** in your web browser.

---

## 🔑 Demo Accounts & Credentials

| Role | Email / User ID | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Citizen (Default)** | `demo@portal.in` | `Demo@1234` | Full access to Estimator, What-If, Map, Finance, Compare, Forecast, Chatbot |
| **Government Officer** | `officer@portal.in` | `Officer@1234` | All Citizen features + Protected Officer Compliance Dashboard (`/officer`) |

*Note: You can click the **Auto-Fill** button on the Login page to fill demo credentials with a single click.*

---

## ⏱️ 4-Minute Presentation Demo Script

### 0:00 – 0:30 | 1. Login Gateway & Security
- Navigate to `http://localhost:5173/login`.
- Highlight the full-screen government gateway: automated 5-second background slideshow, accessible CAPTCHA with speech audio, and one-click demo auto-fill (`demo@portal.in`).
- Click **LOGIN** to authenticate.

### 0:30 – 1:15 | 2. Main Estimate & "Why This Price?" (M2 & M8)
- Navigate to **Estimate Price** (`/estimate`).
- Select **Bengaluru** &rarr; **Whitefield**, 1,450 sq.ft, 3 BHK, 3 Bathrooms.
- Adjust **Nearby Amenities** (Metro < 1.5 km, Schools < 1 km).
- Click **Calculate Valuation**: Output displays **₹85.20 Lakh** (±7% confidence bounds).
- Scroll to **Why This Price? (M2)**: Showcase the horizontal SHAP bar chart and toggle between *Simple View* and *Expert View*.

### 1:15 – 2:00 | 3. What-If Sensitivity Simulator (M1)
- Click **What-If (M1)** in the navbar (`/whatif`).
- Move the **Area Expansion slider** (+300 sq.ft) and **Parking Bays** (+1 Bay).
- Highlight the **live 300ms debouncing**, animated green delta badge (+₹18.4L), and step-by-step waterfall chart.

### 2:00 – 2:40 | 4. Interactive India Map (M3) & Forecasts (M7)
- Navigate to **India Map** (`/map`).
- Switch metric from *Price/sq.ft* to *Investment Score (0-100)*.
- Click on **Karnataka** or **Maharashtra** to open the district breakdown side-panel.
- Click **Forecast (M7)** (`/forecast`) to show 5-year projections with optimistic, base, and cautious bands.

### 2:40 – 3:15 | 5. EMI & Buy-vs-Rent Financial Engine (M4)
- Navigate to **EMI & Rent** (`/finance`).
- Demonstrate the reducing balance loan calculator, Donut Chart (Principal vs Interest), year-wise amortization table, and the **10-Year Buy-vs-Rent Wealth Break-Even Chart**.

### 3:15 – 3:45 | 6. Asking-Price Checker (M6) & PDF Report (M10)
- On the Estimate result panel, enter a seller's quoted price of ₹125 Lakh against the ₹85L estimate.
- Watch the gauge needle swing into **⚠️ Severe Overpricing Alert (+47%)** with negotiation tips.
- Click **Download PDF Valuation Report (M10)** to generate the official branded valuation certificate.

### 3:45 – 4:00 | 7. AI Assistant "Griha Mitra" (M11) & Officer Dashboard (M9)
- Open the bottom-right chat widget: ask *"What is the estimated price for a 2 BHK in Indiranagar, Bengaluru?"*
- Observe real-time tool calling and streaming response.
- Log in as `officer@portal.in` / `Officer@1234` and open **Officer Dashboard (`/officer`)** to view statewide KPIs, circle rate anomalies, and CSV export.

---

## 🏆 Summary Checklist for Judges

- [x] **M1: What-If Simulator** (`/whatif`) with 300ms debounce and waterfall chart.
- [x] **M2: Explainable Why This Price?** SHAP horizontal bar chart with Simple vs Expert view.
- [x] **M3: India Map GIS Dashboard** (`/map`) with state choropleth and metric toggles.
- [x] **M4: EMI & Buy-vs-Rent Calculator** (`/finance`) with amortization table and wealth crossover chart.
- [x] **M5: Property Comparator** (`/compare`) with differential matrix and automated rationale.
- [x] **M6: Asking-Price Checker** with fair-value gauge and outlier mispricing detection.
- [x] **M7: 5-Year Forecast & Investment Scores** (`/forecast`) with multi-scenario bands and Top 10 leaderboard.
- [x] **M8: Nearby Amenities Factor** for metro, schools, hospitals, and markets.
- [x] **M9: Government Officer Dashboard** (`/officer`) with role protection, anomaly audit table, and CSV/PDF export.
- [x] **M10: High-Resolution PDF Valuation Certificate** with ReportLab & jsPDF generators.
- [x] **M11: Griha Mitra AI Conversational Assistant** with 7 tools, voice synthesis, and offline FAQ fallback.
- [x] **M12: 6-Step Guided Judge Demo Tour** with floating launcher and confetti completion.

---

## 📜 Statutory Notice
*This application is a demonstration portal for the fictional **Directorate of Housing Analytics, Demo**. All models, projections, and estimates are econometric mathematical indicators and do not constitute formal legal property valuations or chartered deeds under RERA.*
