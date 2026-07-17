"use client";

import React, { useState } from "react";
import { FiActivity, FiTrendingUp, FiCrosshair, FiAlertTriangle, FiTarget, FiBox, FiSearch } from "react-icons/fi";
import { Badge, Card, StatCard, Table, Avatar, Tabs } from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

// --- Mock Data ---

const accuracyCategoryNames = ["Beverages", "Snacks", "Personal Care", "Pantry"];
const accuracyCategorySeries = [
  { name: "Target Accuracy", data: [90, 90, 90, 90], color: "var(--border-strong)" },
  { name: "Actual Accuracy", data: [94.5, 88.2, 91.0, 85.4], color: "var(--primary)" }
];

// Forecast vs Actual Volume Trend
const forecastVsActualCategories = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const forecastVsActualSeries = [
  { name: "Forecasted Demand (U)", data: [115, 128, 122, 150, 180, 190], color: "var(--viz-4)" },
  { name: "Actual Sales (U)", data: [120, 135, 115, 160, 185, 195], color: "var(--primary)" }
];

const mockRegionalForecastData = [
  { id: "FC-101", region: "North (Delhi)", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=North", forecasted: "125,000", actual: "128,400", mape: 2.7, status: "Accurate", trend: [6.5, 5.2, 4.1, 3.8, 3.0, 2.7] },
  { id: "FC-105", region: "South (Chennai)", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=South", forecasted: "85,000", actual: "72,100", mape: 15.1, status: "Overforecast", trend: [8.5, 9.2, 11.0, 13.5, 14.8, 15.1] },
  { id: "FC-102", region: "West (Mumbai)", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=West", forecasted: "140,000", actual: "135,500", mape: 3.2, status: "Accurate", trend: [4.5, 4.2, 3.9, 3.5, 3.4, 3.2] },
  { id: "FC-104", region: "East (Kolkata)", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=East", forecasted: "65,000", actual: "78,200", mape: 20.3, status: "Underforecast", trend: [12.5, 14.2, 15.8, 17.5, 18.2, 20.3] },
  { id: "FC-103", region: "Central (Indore)", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Central", forecasted: "55,000", actual: "53,200", mape: 3.2, status: "Accurate", trend: [5.5, 5.2, 4.9, 4.5, 3.8, 3.2] }
];

const mockSkuForecastData = [
  { sku: "SKU-1001", name: "Premium Mango Juice 1L", category: "Beverages", forecasted: "15,000", actual: "15,400", variance: "+400", mape: 2.6, status: "Accurate", trend: [5.1, 4.8, 3.5, 3.1, 2.9, 2.6] },
  { sku: "SKU-2042", name: "Spicy Potato Chips 50g", category: "Snacks", forecasted: "22,000", actual: "19,500", variance: "-2,500", mape: 11.3, status: "Overforecast", trend: [14.0, 13.2, 12.5, 12.0, 11.5, 11.3] },
  { sku: "SKU-4051", name: "Organic Honey 250g", category: "Pantry", forecasted: "5,000", actual: "4,950", variance: "-50", mape: 1.0, status: "Accurate", trend: [2.5, 2.0, 1.8, 1.5, 1.2, 1.0] },
  { sku: "SKU-3015", name: "Herbal Soap 100g", category: "Personal Care", forecasted: "6,000", actual: "7,800", variance: "+1,800", mape: 30.0, status: "Underforecast", trend: [18.0, 22.0, 25.0, 28.0, 29.5, 30.0] },
  { sku: "SKU-1099", name: "Green Tea Box 50s", category: "Beverages", forecasted: "1,200", actual: "850", variance: "-350", mape: 29.1, status: "Overforecast", trend: [12.0, 15.6, 20.1, 24.8, 27.2, 29.1] }
];

export default function ForecastAccuracyPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [skuSearch, setSkuSearch] = useState("");

  const filteredSkus = mockSkuForecastData.filter(
    (item) =>
      item.name.toLowerCase().includes(skuSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(skuSearch.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiActivity />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Forecast Accuracy</h2>
            <p className={styles.subtitle}>Analyze supply chain prediction errors, WAPE/MAPE metrics, and identify supply-demand bias.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Navigation Tabs */}
        <div style={{ marginBottom: "var(--space-2)" }}>
          <Tabs
            items={[
              { value: "overview", label: "Executive Overview" },
              { value: "sku", label: "SKU-Level Accuracy" },
              { value: "distributor", label: "Distributor Performance" }
            ]}
            value={activeTab}
            onChange={setActiveTab}
            variant="segmented"
          />
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Row */}
            <div className={styles.statsRow}>
              <StatCard
                label="System Accuracy"
                value="92.8%"
                delta={2.1}
                deltaLabel="vs last month"
                icon={<FiTarget />}
              />
              <StatCard
                label="System MAPE"
                value="7.2%"
                delta={-1.5}
                deltaLabel="improvement vs last month"
                deltaTone="positive"
                icon={<FiTrendingUp />}
              />
              <StatCard
                label="Value at Risk"
                value="₹45.2L"
                delta={-12.5}
                deltaLabel="reduction in misallocated inventory"
                deltaTone="positive"
                icon={<FiActivity />}
              />
              <StatCard
                label="High Error Nodes"
                value="8"
                unit=" distributors"
                delta={3}
                deltaLabel="nodes exceeding 15% MAPE"
                icon={<FiAlertTriangle />}
                tone="critical"
              />
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Forecast vs Actual Sales</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Comparison of forecasted target demand vs actual bookings over 6 weeks.</p>
                  <div style={{ height: "260px" }}>
                    <AreaChart 
                      series={forecastVsActualSeries}
                      categories={forecastVsActualCategories}
                      height={260}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Accuracy by Category</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Actual vs Target forecast accuracy percentage.</p>
                  <BarChart 
                    categories={accuracyCategoryNames}
                    series={accuracyCategorySeries}
                    height={260}
                  />
                </div>
              </Card>
            </div>

            {/* Table Row */}
            <div className={styles.tableRow}>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <div style={{ marginBottom: "var(--space-6)" }}>
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>High Error Regional Nodes</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Top regional nodes with forecast accuracy below the 90% benchmark.</p>
                  </div>
                  <Table 
                    columns={[
                      { 
                        key: "region", 
                        label: "Region / Node",
                        render: (_, row) => (
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                            <Avatar src={row.avatar} fallback={<FiActivity />} size="md" />
                            <div>
                              <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.region}</div>
                              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id}</div>
                            </div>
                          </div>
                        )
                      },
                      { key: "forecasted", label: "Forecasted (U)", align: "right" },
                      { key: "actual", label: "Actual (U)", align: "right" },
                      { 
                        key: "mape", 
                        label: "MAPE (%)", 
                        align: "right",
                        render: (val) => (
                          <span style={{ fontWeight: 600, color: val > 10 ? "var(--critical)" : "inherit" }}>
                            {val}%
                          </span>
                        )
                      },
                      { 
                        key: "trend", 
                        label: "6W Error Trend", 
                        align: "right",
                        render: (val, row) => (
                          <div style={{ width: "80px", marginLeft: "auto" }}>
                            <Sparkline data={val} height={24} color={row.mape > 10 ? "var(--critical)" : "var(--success)"} />
                          </div>
                        )
                      },
                      { 
                        key: "status", 
                        label: "Bias Status",
                        render: (val) => {
                          let tone = "neutral";
                          if (val === "Accurate") tone = "success";
                          if (val === "Overforecast") tone = "warning";
                          if (val === "Underforecast") tone = "danger";
                          return (
                            <Badge tone={tone} variant="soft" dot>
                              {val}
                            </Badge>
                          );
                        }
                      }
                    ]}
                    data={mockRegionalForecastData}
                  />
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === "sku" && (
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)", gap: "var(--space-4)" }}>
                <div>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>SKU-Level Forecast Accuracy</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Forecast error analysis at the individual product level.</p>
                </div>
                <div style={{ position: "relative", width: "300px" }}>
                  <input
                    type="text"
                    placeholder="Search by SKU name or code..."
                    value={skuSearch}
                    onChange={(e) => setSkuSearch(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "var(--space-10)",
                      paddingRight: "var(--space-4)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--surface-sunken)",
                      color: "var(--text-1)",
                      fontSize: "var(--text-sm)"
                    }}
                  />
                  <FiSearch style={{ position: "absolute", left: "12px", top: "13px", color: "var(--text-3)" }} />
                </div>
              </div>

              <Table
                columns={[
                  {
                    key: "sku",
                    label: "Product / SKU",
                    render: (_, row) => (
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "var(--surface-sunken)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", color: "var(--text-2)" }}>
                          <FiBox size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.sku} • {row.category}</div>
                        </div>
                      </div>
                    )
                  },
                  { key: "forecasted", label: "Forecasted (U)", align: "right" },
                  { key: "actual", label: "Actual (U)", align: "right" },
                  {
                    key: "variance",
                    label: "Variance",
                    align: "right",
                    render: (val) => {
                      const isNegative = val.startsWith("-");
                      return (
                        <span style={{ fontWeight: 500, color: isNegative ? "var(--warning-text)" : "var(--success-text)" }}>
                          {val}
                        </span>
                      );
                    }
                  },
                  {
                    key: "mape",
                    label: "MAPE (%)",
                    align: "right",
                    render: (val) => (
                      <span style={{ fontWeight: 600, color: val > 15 ? "var(--critical)" : "inherit" }}>
                        {val}%
                      </span>
                    )
                  },
                  {
                    key: "trend",
                    label: "6W Error Trend",
                    align: "right",
                    render: (val, row) => (
                      <div style={{ width: "80px", marginLeft: "auto" }}>
                        <Sparkline data={val} height={24} color={row.mape > 15 ? "var(--critical)" : "var(--success)"} />
                      </div>
                    )
                  },
                  {
                    key: "status",
                    label: "Bias Status",
                    render: (val) => {
                      let tone = "neutral";
                      if (val === "Accurate") tone = "success";
                      if (val === "Overforecast") tone = "warning";
                      if (val === "Underforecast") tone = "danger";
                      return (
                        <Badge tone={tone} variant="soft" dot>
                          {val}
                        </Badge>
                      );
                    }
                  }
                ]}
                data={filteredSkus}
              />
            </div>
          </Card>
        )}

        {activeTab === "distributor" && (
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Distributor Forecast Accuracy Breakdown</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Forecast error metrics analyzed per distributor partner.</p>
              </div>

              <Table
                columns={[
                  {
                    key: "distributor",
                    label: "Distributor Partner",
                    render: (_, row) => (
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.region}`} size="md" />
                        <div>
                          <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.region} Logistics</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id}</div>
                        </div>
                      </div>
                    )
                  },
                  { key: "forecasted", label: "Primary Forecast (U)", align: "right" },
                  { key: "actual", label: "Secondary Actual (U)", align: "right" },
                  {
                    key: "mape",
                    label: "MAPE (%)",
                    align: "right",
                    render: (val) => (
                      <span style={{ fontWeight: 600, color: val > 10 ? "var(--critical)" : "inherit" }}>
                        {val}%
                      </span>
                    )
                  },
                  {
                    key: "bias",
                    label: "Forecast Bias",
                    align: "right",
                    render: (_, row) => {
                      const bias = row.status === "Overforecast" ? "+4.2%" : row.status === "Underforecast" ? "-5.8%" : "+0.3%";
                      return (
                        <span style={{ color: row.status === "Accurate" ? "var(--success-text)" : "var(--warning-text)" }}>
                          {bias}
                        </span>
                      );
                    }
                  },
                  {
                    key: "status",
                    label: "Alignment Status",
                    render: (val) => {
                      let tone = "neutral";
                      if (val === "Accurate") tone = "success";
                      if (val === "Overforecast") tone = "warning";
                      if (val === "Underforecast") tone = "danger";
                      return (
                        <Badge tone={tone} variant="soft" dot>
                          {val}
                        </Badge>
                      );
                    }
                  }
                ]}
                data={mockRegionalForecastData}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
