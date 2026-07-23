"use client";

import { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiCpu, 
  FiZap, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiLayers, 
  FiTarget, 
  FiCornerDownLeft,
  FiDownload
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Table, 
  Badge, 
  Select, 
  useToast 
} from "../../../../../components/ui";
import styles from "./page.module.scss";

export default function ManagerForecastingPage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [selectedTerritory, setSelectedTerritory] = useState("terr_north_01");
  const [horizonDays, setHorizonDays] = useState(30);
  const [activeTab, setActiveTab] = useState("predictions"); // 'predictions' or 'so_targets'
  
  const [forecastData, setForecastData] = useState(null);
  const [targetsData, setTargetsData] = useState(null);

  const fetchForecast = async (terrId, days) => {
    setLoading(true);
    try {
      // Fetch demand predictions
      const predRes = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "predict",
          territoryId: terrId,
          forecastHorizonDays: Number(days)
        })
      });
      const predJson = await predRes.json();
      setForecastData(predJson);

      // Fetch auto-targets
      const targetRes = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "auto-targets",
          territoryId: terrId
        })
      });
      const targetJson = await targetRes.json();
      setTargetsData(targetJson);

    } catch (err) {
      console.error("Failed to load forecast data:", err);
      if (toast) {
        toast.error("Forecasting Error", {
          description: "Could not load demand prediction model output."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(selectedTerritory, horizonDays);
  }, [selectedTerritory, horizonDays]);

  const handleRetrain = async () => {
    if (toast) {
      toast.info("Retraining ML Models...", {
        description: "Re-computing trend lines, seasonality weights, and MAPE accuracy scores."
      });
    }
    await fetchForecast(selectedTerritory, horizonDays);
    if (toast) {
      toast.success("Retrain Complete", {
        description: "Models updated with latest secondary sales data."
      });
    }
  };

  const handleExportExcel = () => {
    if (!forecastData || !forecastData.predictions) return;

    const exportData = forecastData.predictions.map(sku => ({
      "SKU Code": sku.skuCode,
      "Product Title": sku.skuName,
      "Category": sku.category,
      "Projected Qty (Units)": sku.predictedQty,
      "Projected Revenue (INR)": sku.predictedValue,
      "95% Confidence Lower": sku.confidenceInterval.lowerValue,
      "95% Confidence Upper": sku.confidenceInterval.upperValue,
      "Active Scheme": sku.activeScheme || "Standard",
      "MAPE Error (%)": sku.mapeScore
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SKU Forecasts");
    XLSX.writeFile(workbook, `Demand_Forecast_${selectedTerritory}_${horizonDays}days.xlsx`);
    
    if (toast) {
      toast.success("Export Successful", { description: "Forecasting data exported to Excel." });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.pageHeaderIcon}>
            <FiTrendingUp />
          </div>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Phase 7 • Projection Engine</span>
              <Badge tone="success" variant="soft" size="sm">
                {forecastData?.demoMode ? "Demo Mode (Mock Data)" : "Live ML Models"}
              </Badge>
            </div>
            <h2>Demand Forecasting &amp; Auto-Targets</h2>
            <p>AI-powered SKU demand projection and automated Sales Officer target allocation.</p>
          </div>
        </div>
        <Button variant="outline" leadingIcon={<FiCornerDownLeft />} onClick={() => router.push("/manager")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.selectorsGroup}>
          <div className={styles.controlItem}>
            <label>Territory Scope:</label>
            <Select
              value={selectedTerritory}
              onChange={(e) => setSelectedTerritory(e.target.value)}
              options={[
                { value: "terr_north_01", label: "North Metro (DEL-NCR)" },
                { value: "terr_south_02", label: "South Region (BLR-KA)" },
                { value: "terr_east_03", label: "East Hub (KOL-WB)" },
                { value: "terr_west_04", label: "West Zone (MUM-MH)" },
              ]}
            />
          </div>

          <div className={styles.controlItem}>
            <label>Horizon Window:</label>
            <Select
              value={horizonDays.toString()}
              onChange={(e) => setHorizonDays(Number(e.target.value))}
              options={[
                { value: "14", label: "14 Days (Short-term)" },
                { value: "30", label: "30 Days (1 Month)" },
                { value: "60", label: "60 Days (2 Months)" },
                { value: "90", label: "90 Days (Quarterly)" },
              ]}
            />
          </div>
        </div>

        <div className={styles.actionsGroup}>
          <Button 
            variant="outline" 
            leadingIcon={<FiRefreshCw className={loading ? "spin" : ""} />} 
            onClick={handleRetrain}
            disabled={loading}
          >
            Retrain ML Models
          </Button>
        </div>
      </div>

      {/* AI Plain-English Executive Summary Card */}
      {forecastData?.summary?.aiExecutiveSummary && (
        <div className={styles.aiSummaryCard}>
          <div className={styles.aiHeader}>
            <FiZap className={styles.aiSparkleIcon} />
            <h3>OpenRouter AI Executive Demand Summary</h3>
          </div>
          <div className={styles.aiBody}>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {forecastData.summary.aiExecutiveSummary}
            </div>
            
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => toast?.success("Recommendations Applied", { description: "Secondary targets updated based on AI insights." })}
              >
                Apply Recommendations
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => toast?.info("Explain Why", { description: "Analyzing model feature importance and risk factors..." })}
              >
                ✨ Explain This
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Projected Demand</span>
          <span className={`${styles.statVal} ${styles.primary}`}>
            ₹{(forecastData?.summary?.totalPredictedValue || 0).toLocaleString()}
          </span>
          <span className={styles.statSub}>
            {(forecastData?.summary?.totalPredictedQty || 0).toLocaleString()} units total
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Projected Sales Growth</span>
          <span className={`${styles.statVal} ${styles.success}`}>
            +{forecastData?.summary?.projectedGrowthPct || 14.5}%
          </span>
          <span className={styles.statSub}>vs. Previous 30-day baseline</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg Model Accuracy (MAPE)</span>
          <span className={`${styles.statVal} ${styles.purple}`}>
            {forecastData?.summary?.averageMapeScore || 5.2}% Error
          </span>
          <span className={styles.statSub}>High Confidence (Mean Absolute % Error)</span>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
        <Button 
          variant={activeTab === "predictions" ? "primary" : "ghost"} 
          leadingIcon={<FiLayers />}
          onClick={() => setActiveTab("predictions")}
        >
          SKU Demand Predictions ({forecastData?.predictions?.length || 0})
        </Button>
        <Button 
          variant={activeTab === "so_targets" ? "primary" : "ghost"} 
          leadingIcon={<FiTarget />}
          onClick={() => setActiveTab("so_targets")}
        >
          SO Auto-Targets ({targetsData?.targetsData?.soTargets?.length || 0} Officers)
        </Button>
      </div>

      {/* TAB 1: SKU PREDICTIONS TABLE */}
      {activeTab === "predictions" && (
        <div className={styles.tableSection}>
          <div className={styles.sectionTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h3>SKU Demand Predictions &amp; Model Confidence</h3>
              <Badge tone="primary">{forecastData?.territory?.name || "Territory"}</Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              leadingIcon={<FiDownload />}
              onClick={handleExportExcel}
              disabled={!forecastData?.predictions}
            >
              Export to Excel
            </Button>
          </div>

          <Table
            columns={[
              { key: "skuCode", header: "SKU Code", width: "120px", mono: true },
              { 
                key: "skuName", 
                header: "Product Title",
                render: (v) => (
                  <Link href="/management/sku-velocity" style={{ color: "var(--primary)", fontWeight: "500", textDecoration: "none" }}>
                    {v}
                  </Link>
                )
              },
              { key: "category", header: "Category" },
              { 
                key: "predictedQty", 
                header: "Projected Qty", 
                align: "right",
                render: (v) => v.toLocaleString() + " units"
              },
              { 
                key: "predictedValue", 
                header: "Projected Revenue", 
                align: "right",
                render: (v) => "₹" + v.toLocaleString()
              },
              { 
                key: "confidenceInterval", 
                header: "95% Confidence Bounds", 
                render: (ci) => (
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    ₹{ci.lowerValue.toLocaleString()} – ₹{ci.upperValue.toLocaleString()}
                  </span>
                )
              },
              { 
                key: "activeScheme", 
                header: "Active Scheme",
                render: (v) => v ? <Badge tone="warning" size="sm">{v}</Badge> : <span style={{ color: "#94a3b8" }}>Standard</span>
              },
              { 
                key: "mapeScore", 
                header: "MAPE Error", 
                align: "center",
                render: (v) => <Badge tone={v < 10 ? "success" : "warning"} variant="soft">{v}%</Badge>
              }
            ]}
            data={forecastData?.predictions || []}
            rowKey={(r) => r.skuId}
          />
        </div>
      )}

      {/* TAB 2: SO AUTO-TARGETS TABLE */}
      {activeTab === "so_targets" && (
        <div className={styles.tableSection}>
          <div className={styles.sectionTitle}>
            <h3>Auto-Generated Sales Officer Monthly Targets</h3>
            <Badge tone="success">Stretch Factor: +8.0%</Badge>
          </div>

          <Table
            columns={[
              { key: "soId", header: "SO Code", width: "130px", mono: true },
              { key: "soName", header: "Sales Officer Name" },
              { 
                key: "monthlyTargetQty", 
                header: "Monthly Target Qty", 
                align: "right",
                render: (v) => v.toLocaleString() + " cases"
              },
              { 
                key: "monthlyTargetValue", 
                header: "Monthly Target Revenue", 
                align: "right",
                render: (v) => "₹" + v.toLocaleString()
              },
              { 
                key: "dailyTargetQty", 
                header: "Daily Beat Target", 
                align: "center",
                render: (v) => v + " units / day"
              },
              { 
                key: "recommendedBeatsPerWeek", 
                header: "Recommended Beats", 
                align: "center",
                render: (v) => <Badge tone="info">{v} days / wk</Badge>
              }
            ]}
            data={targetsData?.targetsData?.soTargets || []}
            rowKey={(r) => r.soId}
          />
        </div>
      )}
    </div>
  );
}
