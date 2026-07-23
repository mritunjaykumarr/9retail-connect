/**
 * RetailConnect Forecasting Service API Client
 * Interacts with the Python Projection Engine (FastAPI) on Render / Local port 8000
 */

const FORECAST_URL = process.env.FORECASTING_SERVICE_URL || "http://127.0.0.1:8000";
const FORECAST_SECRET = process.env.FORECAST_API_SECRET || "rc_forecast_secret_dev_2026";

/**
 * Helper to execute HTTP requests to Python service
 */
async function fetchForecasting(endpoint, method = "GET", body = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${FORECAST_SECRET}`
    };

    const options = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {})
    };

    const res = await fetch(`${FORECAST_URL}${endpoint}`, options);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Forecasting API HTTP ${res.status}: ${errText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Forecasting Client] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

/**
 * Get Service Health & Status
 */
export async function getForecastingHealth() {
  return await fetchForecasting("/health", "GET");
}

/**
 * Get Territories & SKU Overview
 */
export async function getForecastingOverview() {
  return await fetchForecasting("/api/v1/forecast/overview", "GET");
}

/**
 * Get Demand Prediction for Territory
 */
export async function predictTerritoryDemand(territoryId = "terr_north_01", skuIds = null, horizonDays = 30) {
  return await fetchForecasting("/api/v1/forecast/predict", "POST", {
    territoryId,
    skuIds,
    forecastHorizonDays: horizonDays
  });
}

/**
 * Generate Auto-Targets for Sales Officers
 */
export async function generateAutoTargets(territoryId = "terr_north_01", soCount = 14) {
  return await fetchForecasting("/api/v1/forecast/auto-targets", "POST", {
    territoryId,
    soCount
  });
}
