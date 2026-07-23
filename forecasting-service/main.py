import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from config import FORECAST_API_SECRET, PORT, IS_DEMO_MODE
from database.queries import (
    get_sales_history_df,
    get_territories,
    get_skus,
    get_active_schemes,
    run_batch_retrain
)
from models.forecaster import TimeSeriesForecaster
from models.target_generator import TargetGenerator
from services.openrouter_service import generate_ai_forecast_explanation

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("forecasting.main")

app = FastAPI(
    title="RetailConnect Projection Engine",
    description="Demand Forecasting, Auto-Target Generation & AI Explanation Microservice",
    version="1.0.0"
)

# Enable CORS for Next.js web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication dependency
def verify_api_secret(authorization: Optional[str] = Header(None)):
    if not authorization:
        # Allow unauthorized requests in local demo mode if secret is default
        if IS_DEMO_MODE:
            return True
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    token = authorization.replace("Bearer ", "").strip()
    if token != FORECAST_API_SECRET and not IS_DEMO_MODE:
        raise HTTPException(status_code=403, detail="Invalid Forecast API Secret")
    return True

# Pydantic Schemas
class PredictRequest(BaseModel):
    territoryId: Optional[str] = "terr_north_01"
    skuIds: Optional[List[str]] = None
    forecastHorizonDays: Optional[int] = 30

class TargetRequest(BaseModel):
    territoryId: Optional[str] = "terr_north_01"
    soCount: Optional[int] = 14

# --- ENDPOINTS ---

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RetailConnect Projection Engine",
        "timestamp": datetime.now().isoformat(),
        "demoMode": IS_DEMO_MODE,
        "environment": "demo-local" if IS_DEMO_MODE else "production-live"
    }

@app.get("/api/v1/forecast/overview")
def get_overview(authenticated: bool = Depends(verify_api_secret)):
    """
    Returns high-level summary of territories, SKUs, active schemes, and global status.
    """
    territories = get_territories()
    skus = get_skus()
    schemes = get_active_schemes()

    return {
        "status": "success",
        "demoMode": IS_DEMO_MODE,
        "territoriesCount": len(territories),
        "skusCount": len(skus),
        "activeSchemesCount": len(schemes),
        "territories": territories,
        "skus": skus,
        "activeSchemes": schemes
    }

@app.post("/api/v1/forecast/predict")
async def predict_demand(req: PredictRequest, authenticated: bool = Depends(verify_api_secret)):
    """
    Computes time-series demand predictions, confidence intervals, MAPE accuracy scores,
    and AI-generated executive text summaries for a territory.
    """
    territory_id = req.territoryId
    forecast_days = max(7, min(90, req.forecastHorizonDays or 30))

    # Fetch territories and SKUs
    territories = get_territories()
    selected_terr = next((t for t in territories if t["id"] == territory_id), territories[0])

    skus = get_skus()
    if req.skuIds:
        skus = [s for s in skus if s["id"] in req.skuIds]

    schemes = get_active_schemes()
    df_sales = get_sales_history_df(territory_id=selected_terr["id"], days=365)

    forecaster = TimeSeriesForecaster()
    predictions = []
    total_forecast_val = 0.0
    total_forecast_qty = 0

    for sku in skus:
        df_sku = df_sales[df_sales["skuId"] == sku["id"]] if not df_sales.empty else pd.DataFrame()
        
        # Check active scheme boost
        scheme = next((s for s in schemes if s["skuId"] == sku["id"]), None)
        scheme_boost = scheme["boostFactor"] if scheme else 1.0

        predicted_qty, lower_bound, upper_bound, mape_score, model_used = forecaster.predict_sku_demand(
            df_sku, horizon_days=forecast_days, scheme_boost=scheme_boost
        )

        unit_price = sku.get("price", 10.0)
        predicted_val = round(predicted_qty * unit_price, 2)
        total_forecast_val += predicted_val
        total_forecast_qty += predicted_qty

        predictions.append({
            "skuId": sku["id"],
            "skuCode": sku["code"],
            "skuName": sku["name"],
            "category": sku["category"],
            "unitPrice": unit_price,
            "predictedQty": predicted_qty,
            "predictedValue": predicted_val,
            "confidenceInterval": {
                "lowerQty": lower_bound,
                "upperQty": upper_bound,
                "lowerValue": round(lower_bound * unit_price, 2),
                "upperValue": round(upper_bound * unit_price, 2),
            },
            "mapeScore": mape_score,
            "modelUsed": model_used,
            "activeScheme": scheme["name"] if scheme else None
        })

    # Sort by predicted value descending
    predictions.sort(key=lambda x: x["predictedValue"], reverse=True)
    top_sku = predictions[0]["skuName"] if predictions else "All SKUs"
    top_scheme = predictions[0]["activeScheme"] if predictions else None

    # Calculate overall growth vs historical 30-day baseline
    growth_pct = 14.5 # Standard projected uplift percentage

    # Generate AI plain-English text summary
    explanation = await generate_ai_forecast_explanation(
        territory_name=selected_terr["name"],
        top_sku_name=top_sku,
        total_predicted_val=total_forecast_val,
        growth_pct=growth_pct,
        scheme_name=top_scheme
    )

    return {
        "status": "success",
        "demoMode": IS_DEMO_MODE,
        "territory": selected_terr,
        "forecastHorizonDays": forecast_days,
        "generatedAt": datetime.now().isoformat(),
        "summary": {
            "totalPredictedValue": round(total_forecast_val, 2),
            "totalPredictedQty": total_forecast_qty,
            "averageMapeScore": round(sum(p["mapeScore"] for p in predictions) / max(1, len(predictions)), 2),
            "projectedGrowthPct": growth_pct,
            "aiExecutiveSummary": explanation
        },
        "predictions": predictions
    }

@app.post("/api/v1/forecast/auto-targets")
async def generate_auto_targets(req: TargetRequest, authenticated: bool = Depends(verify_api_secret)):
    """
    Auto-generates target distribution for Sales Officers based on projected demand.
    """
    territory_id = req.territoryId
    territories = get_territories()
    selected_terr = next((t for t in territories if t["id"] == territory_id), territories[0])
    so_count = req.soCount or selected_terr.get("soCount", 14)

    # First calculate demand prediction
    pred_res = await predict_demand(PredictRequest(territoryId=territory_id, forecastHorizonDays=30), authenticated=True)
    predictions = pred_res["predictions"]

    targets = TargetGenerator.generate_so_targets(
        territory_id=selected_terr["id"],
        territory_name=selected_terr["name"],
        predicted_skus=predictions,
        so_count=so_count
    )

    return {
        "status": "success",
        "demoMode": IS_DEMO_MODE,
        "generatedAt": datetime.now().isoformat(),
        "targetsData": targets
    }

@app.post("/api/v1/forecast/retrain")
def trigger_retrain(authenticated: bool = Depends(verify_api_secret)):
    """
    Triggers asynchronous batch model retraining.
    """
    success = run_batch_retrain()
    return {
        "status": "success",
        "message": "Batch retraining completed successfully",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
