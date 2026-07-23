import { NextResponse } from "next/server";
import { 
  getForecastingOverview, 
  predictTerritoryDemand, 
  generateAutoTargets 
} from "../../../lib/forecasting";

export async function GET(request) {
  try {
    const data = await getForecastingOverview();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to fetch forecasting overview" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { action, territoryId, skuIds, forecastHorizonDays, soCount } = body || {};

    if (action === "auto-targets") {
      const targetsData = await generateAutoTargets(territoryId || "terr_north_01", soCount || 14);
      return NextResponse.json(targetsData);
    }

    // Default action: predict demand
    const predictionData = await predictTerritoryDemand(
      territoryId || "terr_north_01", 
      skuIds || null, 
      forecastHorizonDays || 30
    );
    return NextResponse.json(predictionData);
  } catch (err) {
    console.error("API /api/forecast POST error:", err);
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to process forecasting request" },
      { status: 500 }
    );
  }
}
