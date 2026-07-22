# RetailConnect — Forecasting Engine Architecture & Render Research Plan

> **Document Version:** 1.0  
> **Target Release:** Phase 7 (Projection Engine)  
> **Reference Specs:** `main_pdf.pdf` & `docs/PROJECT.md`  

---

## 1. Executive Summary & Architectural Rationale

### Why Render for the Forecasting Engine?
In the **RetailConnect SIP** architecture:
- **Vercel** hosts the Next.js full-stack web application (App Router, UI dashboards, serverless API endpoints).
- **Render** hosts the **Python Demand Forecasting Engine (FastAPI + Prophet / XGBoost)** and always-on background workers/Redis.

#### Key Architectural Reasons:
1. **Serverless Timeout & Memory Limits on Vercel:**  
   Vercel serverless functions have a 10s to 60s execution timeout limit and tight memory constraints (1024MB on standard tiers). Training machine learning time-series models (like Meta Prophet or XGBoost over thousands of SKU-territory combinations) requires dedicated CPU time and sustained RAM.
2. **Native Python Ecosystem Support:**  
   Render natively supports standard Python runtimes (Python 3.11+), PyPI packages (`prophet`, `xgboost`, `scikit-learn`, `pandas`, `fastapi`, `uvicorn`, `pymongo`), and Docker containers with C/C++ build tools required by ML libraries.
3. **Background Job Execution & Redis Integration:**  
   Model retraining, batch Target generation, and MAPE (Mean Absolute Percentage Error) accuracy calculations run asynchronously as background cron tasks or worker processes on Render without blocking the user-facing Next.js web application.

---

## 2. Render Platform Capabilities & Infrastructure Setup

Render (`https://render.com`) provides standard compute primitives suited for hosting python data/ML services:

### A. Compute Primitives Used
1. **Render Web Service (FastAPI API Server):**
   - Serves real-time prediction endpoints to Next.js API routes via HTTP/REST.
   - Auto-scales based on incoming demand requests from management & manager dashboards.
2. **Render Background Worker / Cron Job:**
   - Runs model retraining (e.g., nightly or weekly batch jobs).
   - Pre-computes demand forecasts and auto-generates monthly sales targets for Sales Officers (SOs).
3. **Render Managed Redis (Optional for Phase 7/v2):**
   - Task queues (BullMQ / Celery) for offloading heavy SKU target calculations.

### B. Infrastructure as Code: Render Blueprint (`render.yaml`)
To ensure clean deployment and environment repeatability, the forecasting microservice will use a `render.yaml` configuration:

```yaml
services:
  - type: web
    name: retailconnect-forecasting-service
    env: python
    region: singapore # or nearest low-latency region to MongoDB Atlas
    plan: starter # Upgrade to standard/pro as data volume grows
    buildCommand: "pip install --upgrade pip && pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.8
      - key: MONGODB_URI
        sync: false
      - key: FORECAST_API_SECRET
        generateValue: true
      - key: OPENROUTER_API_KEY
        sync: false

  - type: cron
    name: retailconnect-weekly-model-retrain
    env: python
    schedule: "0 2 * * 0" # Every Sunday at 2 AM
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python scripts/retrain_models.py"
    envVars:
      - key: MONGODB_URI
        sync: false
```

---

## 3. Forecasting Engine Technical Design

### A. Data Inputs & Pipeline
The engine pulls historical data from MongoDB Atlas:
- **Secondary Sales (`orders` & `uploadedSales`):** Distributor → Shop sales transactions (invoices, dates, quantities, values).
- **Master Data (`products`, `territories`, `distributors`, `retailers`):** SKU metadata, categories, shop tiers (A/B/C), beat route frequencies.
- **Active Trade Schemes (`schemes`):** Historical and active promotional discounts/offers.

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│  MongoDB Atlas         │ ───► │  Render Python Service  │ ───► │  OpenRouter (LLM)       │
│  (Secondary Sales Data)│      │  (FastAPI + Prophet/XGB)│      │  (Plain-English Text)   │
└────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
                                             │                                │
                                             ▼                                ▼
                                ┌──────────────────────────────────────────────────────────┐
                                │ Pre-computed Forecasts & Auto-Targets back into MongoDB  │
                                └──────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                                ┌──────────────────────────────────────────────────────────┐
                                │ Next.js Dashboards (Vercel) read pre-computed rollups    │
                                └──────────────────────────────────────────────────────────┘
```

### B. Machine Learning Modeling Hierarchy

1. **Level 1: Baseline / Cold Start (Moving Average & Exponential Smoothing)**
   - *Use case:* New distributors, newly launched SKUs, or shops with less than 60 days of historical sales data.
   - *Logic:* 4-week weighted moving average with seasonal/category growth multiplier.

2. **Level 2: Meta Prophet (Time-Series Seasonality & Trend)**
   - *Use case:* Established SKUs across territories with strong calendar seasonality (e.g. festivals like Diwali/Eid, summer/winter demand spikes).
   - *Features:* Daily/weekly/yearly seasonality curves, holiday parameters, trend change-point detection.

3. **Level 3: XGBoost / LightGBM (Multi-Variate Feature-Based Regression)**
   - *Use case:* High-volume SKUs where external variables heavily influence sales.
   - *Features:*
     - Historical 7d, 14d, 30d lag features.
     - Scheme/promotion discount percentage.
     - Beat route compliance rate (% of scheduled SO visits completed).
     - Distributor stockout indicators.

4. **Level 4: Auto-Target Generation & MAPE Tracking**
   - Auto-computes suggested monthly targets for **Sales Officers (SOs)** and **Distributors**.
   - Calculates **MAPE (Mean Absolute Percentage Error)** to measure accuracy against actual secondary sales over time.

---

## 4. OpenRouter (LLM Text AI) Integration

As highlighted in the project brief:
> *"OpenRouter is for text AI only; the actual demand numbers come from the Python forecasting libraries, not OpenRouter."*

### Plain-English Forecast Summaries
Once Prophet/XGBoost produces numeric outputs, the Python service calls **OpenRouter** (e.g., using `anthropic/claude-3-haiku` or `google/gemini-2.5-flash`) to generate structured executive insights for managers:

#### Example Prompt sent to OpenRouter:
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "You are an FMCG Demand Analyst for RetailConnect. Explain the numerical forecast in 2 bullet points for the Area Sales Manager."
    },
    {
      "role": "user",
      "content": "Territory: North Metro. SKU: Sunshine Biscuit 100g. Historical Q2 Avg: 12,000 units. Forecasted Q3 Demand: 14,800 units (+23%). Key drivers: Upcoming Festive Scheme (10% extra margin) and +15% retailer coverage expansion."
    }
  ]
}
```

#### Response output stored in database:
> *"Demand projected to increase by 23% (14,800 units) in North Metro due to the upcoming festive scheme extra margin and 15% increase in active retailer route check-ins."*

---

## 5. API Interface Contract (FastAPI on Render)

### Service Endpoint Definitions

#### 1. `POST /api/v1/forecast/predict`
Calculates demand prediction for a given list of SKUs and territory scope.

- **Headers:** `Authorization: Bearer <FORECAST_API_SECRET>`
- **Request Body:**
```json
{
  "territoryId": "terr_north_01",
  "skuIds": ["sku_biscuit_100g", "sku_wafer_50g"],
  "forecastHorizonDays": 30
}
```
- **Response Body:**
```json
{
  "status": "success",
  "territoryId": "terr_north_01",
  "generatedAt": "2026-07-22T10:00:00Z",
  "predictions": [
    {
      "skuId": "sku_biscuit_100g",
      "predictedQty": 14800,
      "confidenceInterval": { "lower": 13900, "upper": 15700 },
      "modelUsed": "prophet",
      "mapeScore": 5.4,
      "explanation": "Demand expected to surge by 23% driven by festive season trend."
    }
  ]
}
```

#### 2. `POST /api/v1/forecast/auto-targets`
Generates suggested targets for Sales Officers based on projected demand.

#### 3. `GET /health`
Liveness check endpoint for Render health checks.

---

## 6. Proposed Python Service Directory Layout

```
retailconnect-forecasting/
├── main.py                     # FastAPI app entry point & routes
├── render.yaml                 # Render deployment configuration
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container definition (optional)
├── config.py                   # Environment variables setup
├── database/
│   ├── connection.py           # MongoDB PyMongo connection handler
│   └── queries.py              # Secondary sales aggregation pipelines
├── models/
│   ├── baseline.py             # Moving average fallback
│   ├── prophet_model.py        # Meta Prophet implementation
│   ├── xgboost_model.py        # XGBoost regressor
│   └── target_generator.py     # SO auto-target logic
├── services/
│   ├── forecast_service.py     # Pipeline orchestration
│   └── openrouter_service.py   # AI text summary generator
└── scripts/
    └── retrain_models.py       # Cron script for scheduled retraining
```

### Essential `requirements.txt`:
```txt
fastapi>=0.110.0
uvicorn>=0.28.0
pydantic>=2.6.0
pymongo>=4.6.0
pandas>=2.2.0
numpy>=1.26.0
prophet>=1.1.5
xgboost>=2.0.3
scikit-learn>=1.4.0
httpx>=0.27.0
python-dotenv>=1.0.1
```

---

## 7. Implementation Roadmap & Steps to Deploy

When Phase 7 is initiated, follow these execution steps:

1. **Step 1: Setup Repository / Microservice Folder**
   Create the FastAPI service structure with standard endpoints.
2. **Step 2: Connect MongoDB Atlas**
   Use `pymongo` or `motor` with the shared MongoDB connection string (`MONGODB_URI`) to query historical secondary sales.
3. **Step 3: Deploy Web Service on Render**
   - Link your GitHub repository to **Render.com**.
   - Select **Web Service**, runtime **Python 3**.
   - Add environment variables (`MONGODB_URI`, `FORECAST_API_SECRET`, `OPENROUTER_API_KEY`).
4. **Step 4: Connect Next.js (Vercel) to Render**
   - Add `FORECASTING_SERVICE_URL` (e.g. `https://retailconnect-forecasting.onrender.com`) and `FORECAST_API_SECRET` to Next.js `.env.local` / Vercel Environment Variables.
   - Call the forecasting API from Next.js server actions or App Router `/api/forecast` endpoints.
5. **Step 5: Configure Background Retraining Job**
   - Setup Render Cron Job for weekly batch retraining and target pre-computation.

---

## 8. Summary Table

| Layer | Service / Tech | Hosted On | Role in RetailConnect |
| :--- | :--- | :--- | :--- |
| **Web App** | Next.js 16 (App Router) | Vercel | Dashboards, Portals, User APIs |
| **Database** | MongoDB Atlas | Cloud | Central Data Store |
| **Forecasting Engine** | Python 3.11 + FastAPI + Prophet + XGBoost | **Render** | Demand prediction, Auto-targets |
| **Background Automation** | Render Worker / Cron + Redis | **Render** | Model retraining, Batch rollups |
| **AI Explanation** | OpenRouter (Gemini / Claude) | OpenRouter API | Plain-English forecast text |

---
*Reference: RetailConnect SIP Project Brief & Tech Stack Specification (docs/PROJECT.md)*
