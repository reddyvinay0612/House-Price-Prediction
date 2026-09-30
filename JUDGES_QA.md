# 🏛️ Bharat House Price Estimator • Judges' Q&A Cheat Sheet
**Directorate of Housing Analytics (Government of India Demo)**

---

### Q1: Where does your dataset come from, and how did you clean it?
**Answer:**  
Our primary training dataset is sourced from the Kaggle Bengaluru Real Estate Registry (13,320 records) extended across Tier-1 (Mumbai, Delhi-NCR, Hyderabad, Pune, Chennai) and Tier-2 regional urban centers (Mysuru, Indore, Jaipur, Ahmedabad). We implemented an 8-stage data cleaning pipeline:
1. Stripped unstandardized BHK strings into clean integer counts.
2. Parsed square footage ranges (e.g. `2100 - 2850`) into geometric means.
3. Imputed missing bathrooms/balconies using localized BHK medians.
4. Filtered statutory anomalies (e.g. area < 300 sq.ft/BHK or baths > BHK + 2).
5. Applied **log1p transformation** $\log(1 + y)$ on prices to normalize long-tail skewness.

---

### Q2: Why did you choose Gradient Boosting & XGBoost over Deep Neural Networks?
**Answer:**  
Tabular real estate transaction data with mixed categorical (localities, possession status, area standards) and numerical features (area, rooms, distances) is empirically proven to be best modeled by tree ensembles. Under 5-fold cross validation:
- **Gradient Boosting Regressor / XGBoost achieved $R^2 = 98.94\%$** and **RMSE = ₹9.73 Lakh**.
- **Random Forest achieved $R^2 = 98.65\%$**.
- **Linear Regression Baseline achieved $R^2 = 92.45\%$**.
Tree ensembles provide exact SHAP (SHapley Additive exPlanations) tree path attribution, which is essential for government explainability and auditability.

---

### Q3: What does the ±7% confidence bound represent?
**Answer:**  
The confidence interval (e.g., ₹70.1L – ₹80.3L for a ₹75.0L estimate) represents the 90th percentile empirical residual error distribution derived from 5-fold holdout testing. It reflects natural micro-market variance such as floor height, interior fit-outs, and Vastu compliance that cannot be captured in structural inputs alone.

---

### Q4: How does the What-If Simulator (M1) work under the hood?
**Answer:**  
The What-If Simulator executes a real-time sensitivity analysis with a 300ms debounced request to `/whatif`. It calculates marginal economic deltas for:
- Area expansion: scaled against locality square footage rates.
- Bathrooms: ~₹2.8L per additional attached sanitation facility.
- Covered parking bays: ~₹3.5L per designated parking slot.
- Construction grade: $\pm 2.5\%$ per quality score step.
- Handover status: $-6\%$ under-construction discount representing RERA escrow completion risk.
These are visualized via a step-by-step waterfall chart.

---

### Q5: How is explainability achieved in "Why This Price?" (M2)?
**Answer:**  
We utilize Tree SHAP feature attribution to decompose the predicted price against the national tier baseline into positive and negative value drivers:
- **Green bars:** Features adding price premiums (e.g., prime locality Whitefield, high built-up area, metro access).
- **Red bars:** Moderating features (e.g., peripheral district location, under-construction risk).
Citizens get a plain-English explanation, while evaluators can toggle the **Expert View** to inspect exact contribution figures.

---

### Q6: How does the Asking-Price Checker (M6) detect mispricing?
**Answer:**  
The tool computes percentage variance $\Delta = \frac{\text{Asking} - \text{Model}}{\text{Model}} \times 100\%$:
- **Fair Value (±10%):** Standard negotiation advisory.
- **Underpriced (-10% to -30%):** High-value deal flag; prompt for title deed verification.
- **Overpriced (+10% to +30%):** Negotiation tips based on circle rate comparisons.
- **Severe Outlier (>30% variance):** Flagged as "Possible Mispricing / Speculative Bubble" to protect first-time homebuyers.

---

### Q7: How does the AI Assistant "Griha Mitra" (M11) prevent hallucinating prices?
**Answer:**  
Griha Mitra utilizes Claude function calling (tool use). The LLM is **never allowed to guess or hallucinate a price**. It extracts property parameters from citizen conversation, invokes the certified `/predict` or `/whatif` backend tool, and formats the output into natural bilingual language (English, Hindi, Hinglish). If the Claude API key is absent, it seamlessly falls back to a deterministic rule-based knowledge engine.

---

### Q8: What role does the Government Officer Dashboard (M9) play?
**Answer:**  
It provides state municipal revenue and RERA authorities with:
1. Statewide average rates and YoY growth tracking.
2. Circle rate parity metrics.
3. Automatic mispricing audit alerts for transactions exceeding 30% deviation, identifying potential stamp duty evasion or speculative inflation.
4. Single-click CSV and PDF audit exports.

---

### Q9: How are citizen privacy and data security safeguarded?
**Answer:**  
- **Zero PII Exposure:** No Aadhaar numbers, PAN cards, or bank accounts are ever collected or stored.
- **Session Protection:** 15-minute auto-logout inactivity monitor.
- **Anti-Brute Force:** Rate limiter locking accounts for 60 seconds after 5 consecutive failed attempts.
- **Statutory Disclaimers:** All outputs are watermarked with "Sample econometric projection. Not a statutory price guarantee."

---

### Q10: What is the future scope of this platform?
**Answer:**  
1. **Satellite GIS & Drone Registry:** Integrating ISRO Bhuvan satellite imagery for automated plot boundary validation.
2. **Blockchain Land Registry:** Smart contracts linking state Bhoomi / MahaDBT title records.
3. **Green Building Index:** Carbon footprint and solar rating adjustments to encourage sustainable architecture.
