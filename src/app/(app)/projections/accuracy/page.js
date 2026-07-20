"use client";

import React, { useState, useMemo } from "react";
import {
  FiActivity, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiCpu, FiTrendingUp,
  FiChevronRight, FiAlertTriangle, FiRefreshCw, FiSliders, FiShield, FiTrendingDown, FiAward, FiAlertCircle
} from "react-icons/fi";
import {
  Table, StatCard, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import styles from "./page.module.scss";

/* --- 15-POINT COMPREHENSIVE MOCK DATA --- */

const mockAccuracySummary = {
  overallAccuracy: "94.2%",
  currentMape: "5.8%",
  forecastBias: "+1.2% (Over)",
  confidenceScore: "96.5%",
  lastRun: "18 Jul 2026",
  modelVersion: "Prophet v2.4 + XGBoost",
  healthScore: "95 / 100",
  healthMetrics: {
    accuracy: "94%",
    stability: "96%",
    bias: "+1.2%",
    confidence: "96%",
    dataQuality: "99%",
    modelFreshness: "98%"
  }
};

const mockRegionalAccuracy = [
  { region: "North Region (Best Performing)", accuracyPct: "97.4%", mapePct: "2.6%", biasPct: "+0.4%", status: "Best Performing", color: "var(--success)" },
  { region: "West Region", accuracyPct: "95.8%", mapePct: "4.2%", biasPct: "+0.8%", status: "Optimal", color: "var(--success)" },
  { region: "South Region", accuracyPct: "94.1%", mapePct: "5.9%", biasPct: "-0.5%", status: "Optimal", color: "var(--success)" },
  { region: "East Region", accuracyPct: "92.5%", mapePct: "7.5%", biasPct: "+1.9%", status: "Optimal", color: "var(--warning)" },
  { region: "Central Region (Worst Performing)", accuracyPct: "88.2%", mapePct: "11.8%", biasPct: "+3.8%", status: "Needs Retraining", color: "var(--danger)" }
];

const mockCategoryAccuracy = [
  { category: "Beverages", accuracyPct: "96.5%", mapePct: "3.5%", biasPct: "-0.8%" },
  { category: "Snacks & Packaged", accuracyPct: "95.2%", mapePct: "4.8%", biasPct: "+0.6%" },
  { category: "Dairy & Chill", accuracyPct: "93.8%", mapePct: "6.2%", biasPct: "+1.1%" },
  { category: "Personal Care", accuracyPct: "89.5%", mapePct: "10.5%", biasPct: "+2.4%" },
  { category: "Home Care", accuracyPct: "94.0%", mapePct: "6.0%", biasPct: "+0.3%" }
];

const mockSkuPerformanceGroups = {
  mostAccurate: [
    { sku: "Fizz Cola 250ml Can", accuracy: "98.2% Accuracy", mape: "1.8% MAPE" },
    { sku: "Crunchy Chips 50g Salted", accuracy: "97.6% Accuracy", mape: "2.4% MAPE" }
  ],
  leastAccurate: [
    { sku: "Glacial Soap 100g", accuracy: "84.2% Accuracy", mape: "15.8% MAPE" },
    { sku: "Fresh Milk 1L Pack", accuracy: "87.5% Accuracy", mape: "12.5% MAPE" }
  ],
  fastestImproving: [
    { sku: "Mango Nectar 1L", improvement: "+6.4% Accuracy Lift", currentMape: "3.2% MAPE" },
    { sku: "Pure Butter 200g", improvement: "+4.8% Accuracy Lift", currentMape: "4.1% MAPE" }
  ]
};

const mockErrorCausesBreakdown = [
  { cause: "Unplanned Trade Promotion Impact", sharePct: 28, errorLift: "+3.2% MAPE" },
  { cause: "Seasonal Weather Variation", sharePct: 22, errorLift: "+2.5% MAPE" },
  { cause: "Distributor & Depot Stock-outs", sharePct: 16, errorLift: "+1.8% MAPE" },
  { cause: "New SKU Product Launch Uncertainty", sharePct: 12, errorLift: "+1.4% MAPE" },
  { cause: "Supplier Ingredient Lead-Time Delay", sharePct: 8, errorLift: "+0.9% MAPE" },
  { cause: "Festival Demand Surge Miss", sharePct: 7, errorLift: "+0.8% MAPE" },
  { cause: "Manual Planner Override Errors", sharePct: 7, errorLift: "+0.8% MAPE" }
];

const mockAiRecommendations = [
  { id: "REC-1", title: "Retrain Beverage Forecast Model", desc: "Re-fit Prophet v2.4 on recent 14-day heatwave sales surge to improve accuracy by +2.4%.", action: "Retrain Model" },
  { id: "REC-2", title: "Increase July Forecast by 8%", desc: "Adjust Q3 baseline upwards to capture retail trade stocking ahead of monsoon promo.", action: "Apply 8% Lift" },
  { id: "REC-3", title: "Reduce Production for Slow-Moving SKUs", desc: "Lower Glacial Soap 100g batch schedule to prevent inventory holding bloat.", action: "Adjust Production" },
  { id: "REC-4", title: "Investigate Central Region High Forecast Error", desc: "Central region MAPE is 11.8%. Audit distributor primary order dispatches.", action: "Audit Region" },
  { id: "REC-5", title: "Demand Spike Expected Next Week", desc: "Predictive engine flags a 12% demand spike in Delhi NCR for 250ml Cans.", action: "Stage Inventory" }
];

const mockModelDrift = {
  accuracyChange: "-0.4% Drift",
  driftScore: "0.02 (Low Drift)",
  retrainingStatus: "Active & Healthy",
  lastModelTraining: "10 Jul 2026",
  nextScheduledRetraining: "25 Jul 2026"
};

const mockExceptions = [
  { sku: "Glacial Soap 100g", issue: "High MAPE (15.8%)", action: "Model Retune Needed" },
  { sku: "Fizz Cola 250ml", issue: "Sudden Demand Spike (+22%)", action: "Capacity Re-balance" },
  { sku: "Fresh Milk 1L", issue: "Negative Forecast Bias (-3.5%)", action: "Increase Baseline" },
  { sku: "New Herbal Tea 250g", issue: "Missing Historical Data", action: "Use Proxy Profile" }
];

const mockDemandVarianceLedger = [
  {
    id: "VAR-801",
    skuName: "Fizz Cola 250ml Can",
    category: "Beverages",
    region: "North Region",
    warehouse: "Delhi Central Depot",
    forecastQty: "20,000 Cases",
    actualQty: "20,900 Cases",
    variancePct: "+4.5%",
    absError: "900 Cases",
    mape: "4.3%",
    confidence: "98.2% High Confidence"
  },
  {
    id: "VAR-802",
    skuName: "Crunchy Chips 50g Salted",
    category: "Snacks & Packaged",
    region: "West Region",
    warehouse: "Mumbai West Plant",
    forecastQty: "16,000 Cases",
    actualQty: "15,200 Cases",
    variancePct: "-5.0%",
    absError: "800 Cases",
    mape: "5.0%",
    confidence: "96.5% High Confidence"
  },
  {
    id: "VAR-803",
    skuName: "Glacial Mint Soap 100g",
    category: "Personal Care",
    region: "Central Region",
    warehouse: "Indore Central Depot",
    forecastQty: "10,000 Cases",
    actualQty: "8,200 Cases",
    variancePct: "-18.0%",
    absError: "1,800 Cases",
    mape: "18.0%",
    confidence: "74.1% Low Confidence"
  },
  {
    id: "VAR-804",
    skuName: "Mango Nectar 1L Pack",
    category: "Beverages",
    region: "East Region",
    warehouse: "Kolkata Hub",
    forecastQty: "6,000 Cases",
    actualQty: "6,400 Cases",
    variancePct: "+6.7%",
    absError: "400 Cases",
    mape: "6.2%",
    confidence: "94.8% High Confidence"
  }
];

export default function ForecastAccuracyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("Monthly");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Model Retraining Modal
  const [retrainTarget, setRetrainTarget] = useState("Central Region - Personal Care");
  const [retrainAlgorithm, setRetrainAlgorithm] = useState("Prophet v2.4 + XGBoost Blend");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "MAPE Accuracy & Health Audit Exported",
      description: "15-point statistical forecast error, drift monitoring & variance ledger exported to CSV.",
      tone: "success"
    });
  };

  const handleRetrainSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Model Retraining Pipeline Triggered",
      description: `Re-fitting algorithm for ${retrainTarget} using ${retrainAlgorithm}.`,
      tone: "success"
    });
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  // Filter Master Variance Ledger
  const filteredLedger = useMemo(() => {
    return mockDemandVarianceLedger.filter(item => {
      const matchSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchRegion = regionFilter === "All" || item.region === regionFilter;
      return matchSearch && matchCategory && matchRegion;
    });
  }, [searchQuery, categoryFilter, regionFilter]);

  const varianceColumns = [
    {
      key: "skuName",
      label: "SKU & Category",
      sortable: true,
      render: (_, row) => (
        <div className={styles.skuMeta}>
          <strong>{row.skuName}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    { key: "region", label: "Region & Warehouse", render: (_, row) => <span>{row.region} ({row.warehouse})</span> },
    { key: "forecastQty", label: "Forecast Qty" },
    { key: "actualQty", label: "Actual Qty" },
    {
      key: "variancePct",
      label: "Variance %",
      render: (val) => (
        <strong style={{ color: val.includes("-") ? "var(--warning)" : "var(--success)" }}>
          {val}
        </strong>
      )
    },
    { key: "absError", label: "Absolute Error" },
    {
      key: "mape",
      label: "MAPE (%)",
      sortable: true,
      render: (val) => (
        <strong style={{ color: parseFloat(val) > 10 ? "var(--danger)" : "var(--success)" }}>
          {val}
        </strong>
      )
    },
    {
      key: "confidence",
      label: "Confidence Band",
      align: "center",
      render: (val) => {
        const tone = val.includes("High") ? "success" : "warning";
        return (
          <Badge tone={tone} variant="soft" dot>
            {val}
          </Badge>
        );
      }
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <Button variant="ghost" size="sm" iconOnly aria-label="View Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* --- 1. Page Header --- */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiActivity />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Projection Engine</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP AI Command</span>
            </div>
            <h2>Forecast Accuracy & MAPE Analytics Command Center</h2>
            <p className={styles.subtitle}>
              Monitor statistical forecast error metrics (MAPE / WAPE / Bias), track model drift & health, review regional accuracy leaderboards, and execute AI recommendations.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiRefreshCw />} onClick={() => setModalOpen(true)}>
            Retrain Model
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Accuracy Audit
          </Button>
        </div>
      </div>

      {/* --- 2. Context Filter Toolbar & Time Horizon Selector --- */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Time Granularity:</label>
            <div className={styles.tabPillGroup}>
              {["Daily", "Weekly", "Monthly", "Quarterly"].map(tab => (
                <button
                  key={tab}
                  className={timeHorizon === tab ? styles.activeTab : ""}
                  onClick={() => setTimeHorizon(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Region:</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Regions</option>
              <option value="North Region">North Region</option>
              <option value="West Region">West Region</option>
              <option value="South Region">South Region</option>
              <option value="East Region">East Region</option>
              <option value="Central Region">Central Region</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Section 1: Unified Forecast Health & Telemetry Banner (Points 1 & 8 & 15) --- */}
      <div className={styles.forecastHealthBanner}>
        {/* Score Radial Ring */}
        <div className={styles.scoreBadgeArea}>
          <div className={styles.scoreRing}>
            <strong>95</strong>
            <span>/ 100</span>
          </div>
          <div className={styles.scoreMeta}>
            <strong>Forecast Health Score</strong>
            <span>Stability 96% • Data Quality 99%</span>
          </div>
        </div>

        {/* Accuracy & MAPE Block */}
        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>Overall Forecast Accuracy</span>
          <span className={styles.metricVal}>94.2%</span>
          <span className={styles.metricSub}>MAPE: 5.8% • Bias: +1.2% (Over)</span>
        </div>

        {/* Model Telemetry Block */}
        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>Model Telemetry & Version</span>
          <span className={styles.metricVal}>96.5% Fit</span>
          <span className={styles.metricSub}>Prophet v2.4 + XGBoost • Run: 18 Jul</span>
        </div>

        {/* Confidence Band Strip */}
        <div className={styles.confidenceBandStrip}>
          <div className={styles.bandHeader}>
            <span>Confidence Distribution</span>
            <span>72% High Band</span>
          </div>
          <div className={styles.bandTrack}>
            <div className={styles.bandHigh} style={{ width: "72%" }} />
            <div className={styles.bandMed} style={{ width: "21%" }} />
            <div className={styles.bandLow} style={{ width: "7%" }} />
          </div>
        </div>
      </div>

      {/* --- Section 2: Large Forecast vs Actual Demand Chart (Points 2 & 3 & 14) --- */}
      <div className={styles.largeChartCard}>
        <div className={styles.chartHeader}>
          <h3>Forecast Demand vs Actual Sales Velocity ({timeHorizon} Trend & Confidence Interval)</h3>
          <div className={styles.chartControls}>
            <Badge tone="primary" variant="soft" dot>95% Confidence Interval Band</Badge>
          </div>
        </div>
        <BarChart
          labels={["Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026"]}
          series={[
            { name: "Forecasted Demand (Cases)", data: [18000, 19200, 21000, 22500, 23800, 24500], color: "var(--primary)" },
            { name: "Actual Secondary Sales (Cases)", data: [17800, 19500, 20800, 22900, 24100, 24800], color: "var(--success)" }
          ]}
          height={320}
        />
      </div>

      {/* --- Section 3: Region & Category Accuracy Matrix (Points 4 & 5 & 13) --- */}
      <div className={styles.matrixGrid}>
        {/* Region Leaderboard */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <h3>Accuracy by Region & Regional Leaderboard</h3>
          </div>
          <div className={styles.matrixList}>
            {mockRegionalAccuracy.map((reg, idx) => (
              <div key={idx} className={styles.matrixItem}>
                <div className={styles.itemHead}>
                  <strong>#{idx + 1} {reg.region}</strong>
                  <Badge tone={reg.status === "Needs Retraining" ? "danger" : reg.status === "Best Performing" ? "success" : "primary"} variant="soft" dot>
                    {reg.status}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <span><strong>Accuracy:</strong> {reg.accuracyPct}</span>
                  <span><strong>MAPE:</strong> {reg.mapePct}</span>
                  <span><strong>Bias:</strong> {reg.biasPct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Category Accuracy */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <h3>Accuracy by Product Category</h3>
          </div>
          <div className={styles.matrixList}>
            {mockCategoryAccuracy.map((cat, idx) => (
              <div key={idx} className={styles.matrixItem}>
                <div className={styles.itemHead}>
                  <strong>{cat.category}</strong>
                  <strong style={{ color: "var(--primary-text)" }}>{cat.accuracyPct} Accuracy</strong>
                </div>
                <div className={styles.itemMeta}>
                  <span><strong>MAPE:</strong> {cat.mapePct}</span>
                  <span><strong>Bias:</strong> {cat.biasPct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Section 4: AI Recommendations & Forecast Exceptions (Points 10 & 12) --- */}
      <div className={styles.recExceptionsRow}>
        {/* AI Recommendations */}
        <div className={styles.recomPanel}>
          <h3>AI Actionable Recommendations & Optimizations</h3>
          <div className={styles.recomList}>
            {mockAiRecommendations.map((rec) => (
              <div key={rec.id} className={styles.recomItem}>
                <FiZap className={styles.recomIcon} />
                <div className={styles.recomBody}>
                  <strong>{rec.title}</strong>
                  <p>{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Exceptions */}
        <div className={styles.recomPanel}>
          <h3>Forecast Exceptions & Attention Alerts</h3>
          <div className={styles.recomList}>
            {mockExceptions.map((exc, idx) => (
              <div key={idx} className={styles.recomItem}>
                <FiAlertCircle className={styles.recomIcon} style={{ color: "var(--danger)" }} />
                <div className={styles.recomBody}>
                  <strong>{exc.sku} • {exc.issue}</strong>
                  <p>Recommended Action: {exc.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Section 5: Model Drift & Error Cause Analysis (Points 7 & 9) --- */}
      <div className={styles.driftLeaderboardRow}>
        {/* Model Drift Monitoring */}
        <div className={styles.driftCard}>
          <h3>Model Drift & Retraining Telemetry</h3>
          <div className={styles.driftMetricsList}>
            <div className={styles.driftMetricItem}>
              <span>Accuracy Drift</span>
              <strong>{mockModelDrift.accuracyChange}</strong>
            </div>
            <div className={styles.driftMetricItem}>
              <span>Drift Score</span>
              <strong>{mockModelDrift.driftScore}</strong>
            </div>
            <div className={styles.driftMetricItem}>
              <span>Retraining Status</span>
              <strong>{mockModelDrift.retrainingStatus}</strong>
            </div>
            <div className={styles.driftMetricItem}>
              <span>Last Model Training</span>
              <strong>{mockModelDrift.lastModelTraining}</strong>
            </div>
            <div className={styles.driftMetricItem}>
              <span>Next Scheduled Retraining</span>
              <strong>{mockModelDrift.nextScheduledRetraining}</strong>
            </div>
          </div>
        </div>

        {/* Forecast Error Analysis */}
        <div className={styles.driftCard}>
          <h3>Forecast Error Cause Breakdown</h3>
          <div className={styles.driftMetricsList}>
            {mockErrorCausesBreakdown.map((err, idx) => (
              <div key={idx} className={styles.driftMetricItem}>
                <span>{err.cause}</span>
                <strong>{err.errorLift} ({err.sharePct}% Share)</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Section 6: Demand Variance Analysis Master Table (Point 11) --- */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Demand Variance Analysis Master Ledger</h3>
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search SKU, Region, Warehouse or Category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
        </div>
        <Table
          data={filteredLedger}
          columns={varianceColumns}
          onRowClick={handleRowClick}
          emptyMessage="No demand variance records match selected filters."
        />
      </div>

      {/* --- 4. Accuracy Details Drawer --- */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedRecord?.skuName}
        description={`Category: ${selectedRecord?.category} • Region: ${selectedRecord?.region}`}
        side="right"
        size="md"
      >
        {selectedRecord && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Forecasted Qty</span>
                <strong>{selectedRecord.forecastQty}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Actual Qty</span>
                <strong>{selectedRecord.actualQty}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Variance %</span>
                <strong>{selectedRecord.variancePct}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Absolute Error</span>
                <strong>{selectedRecord.absError}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>MAPE Error</span>
                <strong>{selectedRecord.mape}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Confidence Band</span>
                <strong>{selectedRecord.confidence}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Warehouse & Model Diagnostics
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Assigned Warehouse Depot:</strong> {selectedRecord.warehouse}</div>
                <div><strong>Primary Error Source:</strong> Unplanned Regional Promotional Shift</div>
                <div><strong>Recommended Action:</strong> Re-fit Prophet model with promotion event tag</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* --- 5. Model Retraining Modal --- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Execute Forecast Model Retraining"
        description="Re-fit AI forecasting algorithms on recent 30-day secondary actuals to optimize MAPE accuracy."
        size="md"
      >
        <form onSubmit={handleRetrainSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Target Region / Category
            </label>
            <Select
              value={retrainTarget}
              onChange={(e) => setRetrainTarget(e.target.value)}
              options={[
                { label: "Central Region - Personal Care (High Error)", value: "Central Region - Personal Care" },
                { label: "North Region - Beverages", value: "North Region - Beverages" },
                { label: "West Region - Snacks", value: "West Region - Snacks" }
              ]}
            />
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              AI Model Algorithm
            </label>
            <Select
              value={retrainAlgorithm}
              onChange={(e) => setRetrainAlgorithm(e.target.value)}
              options={[
                { label: "Prophet v2.4 + XGBoost Blend (Recommended)", value: "Prophet v2.4 + XGBoost Blend" },
                { label: "Pure Prophet Trend Model", value: "Pure Prophet Trend Model" },
                { label: "LSTM Deep Learning", value: "LSTM Deep Learning" }
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Start Model Retraining
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
