# 🤖 Griha Mitra (गृह मित्र) — AI Real Estate Assistant
### *Directorate of Housing Analytics, Government of India (Demo)*

Griha Mitra is a bilingual (English, हिन्दी, and Hinglish) conversational AI assistant designed for the **Bharat House Price Estimator** portal. It guides citizens through real-time house price predictions, explains RERA regulations and financial metrics, and compares housing trends across Indian districts.

---

## 🏗️ Architecture & Features

1. **Frontend (`portal/src/components/chat/`)**:
   - Floating round launcher button with accessibility focus management.
   - 380px floating chat panel with national styling (Navy `#0b3d91`, Saffron accent).
   - Real-time Server-Sent Events (SSE) streaming text with typing animation.
   - Rich interactive **Price Result Cards** for calculated estimates with direct *"Open in Estimator"* navigation.
   - Web Speech API **Voice Input** and **Text-to-Speech** (Read Aloud) integration.
   - Thumbs up/down feedback and message clipboard copying.
   - Session persistence (last 20 messages in `sessionStorage`).
   - Seamless rule-based FAQ fallback when running offline.

2. **Backend (`backend/`)**:
   - **FastAPI** server with rate limiting (20 requests/min per IP).
   - **Claude 3.5 Haiku / Claude 3 Haiku** integration via Anthropic Python SDK.
   - **Autonomous Tool Calling**:
     - `predict_price(city, locality, area_sqft, bhk, bath, balcony)`
     - `get_district_price(state, district)`
     - `compare_locations(location_a, location_b)`
     - `get_model_metrics()`
     - `navigate(page)`
   - Robust safety system prompt preventing hallucinated prices, enforcing Indian currency notation (₹ Lakh/Crore), refusing legal/bank sanction advice, and blocking PII collection.

---

## 🚀 Installation & Running

### 1. Start Frontend (React + Vite)
```bash
cd d:\Hackathon\portal
npm install
npm run dev
# Running at http://localhost:5173
```

### 2. Start Backend (FastAPI + Claude AI)
```bash
cd d:\Hackathon\backend
pip install -r requirements.txt

# Create .env and provide your API key:
# ANTHROPIC_API_KEY=sk-ant-...

uvicorn main:app --reload --port 8000
# API running at http://127.0.0.1:8000
```

---

## 🧪 10 Test Conversations & Expected Behaviors

### 1. Price Estimation Request (English)
- **User:** "Estimate the price of a 3 BHK apartment with 1500 sq ft in Bengaluru Whitefield."
- **Expected Behavior:** Bot invokes `predict_price(city="Bengaluru", locality="Whitefield", area_sqft=1500, bhk=3)`. Renders rich Valuation Card with ~₹1.03 Crore estimate, 90% confidence range, and mandatory disclaimer: *"This is an indicative estimate, not a legal valuation."*

### 2. Price Estimation Request (Hindi)
- **User:** "पुणे में 2 BHK 1100 वर्ग फुट घर का अनुमानित मूल्य क्या होगा?"
- **Expected Behavior:** Bot invokes `predict_price(city="Pune", area_sqft=1100, bhk=2)`. Replies in polite Hindi detailing estimated value (~₹70.40 लाख), unit rate, and disclaimer.

### 3. Conversational Multi-Step Slot-Filling (Hinglish)
- **User:** "Mujhe house price estimate calculate karna hai."
- **Bot Response:** Asks for City, Square Feet, and BHK count with suggested chips.
- **User:** "Hyderabad, 1400 sqft, 3 BHK."
- **Expected Behavior:** Bot invokes `predict_price` and renders the interactive valuation card for Hyderabad (~₹82.60 Lakh).

### 4. District Housing Benchmark Lookup (English)
- **User:** "What is the average housing rate in Mysuru district?"
- **Expected Behavior:** Bot invokes `get_district_price(district="Mysuru")`. Returns ₹3,800/sq.ft. average, 2BHK benchmark of ₹47.5L, 6.5% YoY growth, and top localities (*Gokulam, Vijayanagar*).

### 5. Multi-City Comparison (English)
- **User:** "Compare property prices between Bengaluru and Mumbai."
- **Expected Behavior:** Bot invokes `compare_locations(location_a="Bengaluru", location_b="Mumbai")`. Presents structured comparison (Mumbai MMR average ₹19,500/sq.ft. vs Bengaluru ₹6,850/sq.ft.).

### 6. Technical Real Estate Concept (English)
- **User:** "What is the difference between carpet area and super built-up area?"
- **Expected Behavior:** Explains net usable wall-to-wall area (RERA carpet standard) vs common area additions (super built-up area).

### 7. Statutory RERA Guidelines (Hindi)
- **User:** "रेरा (RERA) के तहत 70% एस्क्रो खाता नियम क्या है?"
- **Expected Behavior:** Explains in Hindi that builders must deposit 70% of collected buyer funds into an escrow account strictly for construction purposes to prevent diversion of funds.

### 8. Financial Breakdown & EMI (Hinglish)
- **User:** "50 lakh ke home loan par monthly EMI aur stamp duty kitna hoga?"
- **Expected Behavior:** Explains standard ~6% stamp duty (₹3 Lakh) and 20-year home loan EMI at 8.5% interest (~₹43,400 per month).

### 9. Machine Learning Model Diagnostics (English)
- **User:** "Why is Gradient Boosting chosen as the champion model over Random Forest?"
- **Expected Behavior:** Invokes `get_model_metrics()`. Explains peak $R^2 = 97.13\%$ and lowest RMSE ($₹10.74\text{L}$) on non-linear micro-market housing variables.

### 10. Voice & Portal Navigation (Hinglish / English)
- **User:** "Take me to the City Trends page." / Voice Input "Open calculator"
- **Expected Behavior:** Bot invokes `navigate(page="city-trends")` and automatically navigates the user's browser to `/city-trends`.
