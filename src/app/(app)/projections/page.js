"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiTrendingUp, FiActivity, FiTarget, FiBox,
  FiMapPin, FiSearch, FiFilter, FiAlertTriangle,
  FiCpu, FiCalendar, FiRefreshCw, FiDownload,
  FiChevronRight, FiZap, FiLayers, FiArrowUpRight,
  FiArrowDownRight, FiClock, FiSliders
} from "react-icons/fi";
import {
  Badge, Card, CardBody, StatCard, Table, Avatar, Tabs,
  Chip, Button, Tooltip, Donut, Switch, Drawer
} from "../../../../components/ui";
import AreaChart from "../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../components/ui/Chart/Sparkline";
import ChartLegend from "../../../../components/ui/Chart/ChartLegend";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

// Main demand forecast chart – 12 months historical + 6 months projected
const demandCategories = [
  "Jul'25", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan'26", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const demandSeries = [
  {
    name: "Actuals",
    data: [420, 445, 410, 480, 510, 560, 530, 490, 510, 540, 580, 610, null, null, null, null, null, null],
    color: "var(--text-2)"
  },
  {
    name: "Baseline Forecast",
    data: [null, null, null, null, null, null, null, null, null, null, null, 610, 640, 670, 700, 720, 760, 810],
    color: "var(--primary)"
  },
  {
    name: "Promo + Seasonal Uplift",
    data: [null, null, null, null, null, null, null, null, null, null, null, 610, 700, 740, 780, 800, 860, 950],
    color: "var(--viz-4)"
  }
];

// SKU heatmap data – top demand movers
const skuHeatmap = [
  { sku: "Mango Burst 500ml", demand: 450, cover: 8, status: "danger" },
  { sku: "Orange Fizz 250ml", demand: 620, cover: 12, status: "warning" },
  { sku: "Masala Mix 100g", demand: 850, cover: 28, status: "success" },
  { sku: "Herbal Soap 75g", demand: 320, cover: 5, status: "danger" },
  { sku: "Floor Clean 1L", demand: 150, cover: 42, status: "success" },
  { sku: "Rice Bran Oil 1L", demand: 280, cover: 18, status: "warning" },
  { sku: "Washing Powder 1Kg", demand: 410, cover: 22, status: "success" },
  { sku: "Glucose Biscuit 150g", demand: 520, cover: 10, status: "warning" },
  { sku: "Hair Oil 200ml", demand: 180, cover: 35, status: "success" },
  { sku: "Detergent Bar 250g", demand: 390, cover: 6, status: "danger" },
];

// Channel-mix donut
const channelMix = [
  { label: "General Trade (GT)", value: 62 },
  { label: "Modern Trade (MT)", value: 21 },
  { label: "E-commerce", value: 11 },
  { label: "Institutional", value: 6 },
];

// Alerts / anomalies
const forecastAlerts = [
  { id: 1, type: "danger", title: "Mango Burst 500ml – Stockout in 8 days", detail: "Projected demand 450K units vs 180K on-hand. Trigger PO immediately.", sku: "SKU-1001", time: "12 min ago" },
  { id: 2, type: "danger", title: "Herbal Soap 75g – Coverage below 7 days", detail: "Safety stock breached. 5 days cover remaining at current velocity.", sku: "SKU-3012", time: "28 min ago" },
  { id: 3, type: "warning", title: "Orange Fizz 250ml – Demand spike detected", detail: "+35% jump over trailing 4-week avg. Seasonal? Investigate.", sku: "SKU-1055", time: "1h ago" },
  { id: 4, type: "warning", title: "Glucose Biscuit 150g – Below reorder level", detail: "10 days cover. Lead time 12 days. Reorder window closing.", sku: "SKU-5020", time: "2h ago" },
  { id: 5, type: "info", title: "Detergent Bar – Promo uplift modelled", detail: "Upcoming July offer expected to add +28% to baseline. Auto-target adjusted.", sku: "SKU-4088", time: "3h ago" },
  { id: 6, type: "info", title: "Model retraining completed", detail: "XGBoost ensemble updated with latest 4 weeks' POS data. MAPE improved 0.8pp.", sku: null, time: "5h ago" },
];

// Scenario comparison
const scenarios = [
  { id: "baseline", label: "Baseline", icon: <FiTarget />, volume: "42.5M", revenue: "₹168Cr", margin: "18.2%", confidence: "92%", desc: "No promotions, steady state" },
  { id: "promo", label: "Promo Push", icon: <FiZap />, volume: "48.2M", revenue: "₹191Cr", margin: "16.8%", confidence: "86%", desc: "July–Sep national campaign" },
  { id: "conservative", label: "Conservative", icon: <FiSliders />, volume: "39.1M", revenue: "₹155Cr", margin: "19.5%", confidence: "95%", desc: "Monsoon headwind, supply risk" },
];

// Detailed territory-SKU table
const territoryData = [
  { id: "TR-201", territory: "Avadh Belt", manager: "Vikas T.", forecastVol: "1.2M", actual30d: "98K", accuracy: 93.5, bias: -1.2, topSku: "Mango Burst", coverDays: 14, status: "On Track", trend: [82, 85, 88, 91, 93, 93] },
  { id: "TR-205", territory: "Coastal Andhra", manager: "Suresh P.", forecastVol: "2.4M", actual30d: "195K", accuracy: 88.2, bias: +3.8, topSku: "Rice Bran Oil", coverDays: 22, status: "Monitor", trend: [80, 82, 84, 86, 87, 88] },
  { id: "TR-110", territory: "Pune Outskirts", manager: "Meera K.", forecastVol: "850K", actual30d: "72K", accuracy: 75.0, bias: -8.5, topSku: "Floor Clean", coverDays: 35, status: "Underforecast", trend: [78, 76, 74, 73, 74, 75] },
  { id: "TR-304", territory: "Brahmaputra Valley", manager: "Arun B.", forecastVol: "420K", actual30d: "34K", accuracy: 81.5, bias: +2.1, topSku: "Glucose Biscuit", coverDays: 10, status: "At Risk", trend: [70, 72, 75, 78, 80, 81] },
  { id: "TR-212", territory: "Malwa Plateau", manager: "Deepak S.", forecastVol: "1.8M", actual30d: "155K", accuracy: 94.1, bias: -0.4, topSku: "Masala Mix", coverDays: 28, status: "On Track", trend: [88, 90, 91, 92, 93, 94] },
  { id: "TR-401", territory: "Kutch Periphery", manager: "Nitin P.", forecastVol: "310K", actual30d: "24K", accuracy: 78.2, bias: +5.5, topSku: "Detergent Bar", coverDays: 6, status: "At Risk", trend: [72, 74, 75, 76, 77, 78] },
  { id: "TR-502", territory: "Coimbatore Industrial", manager: "Priya R.", forecastVol: "1.1M", actual30d: "88K", accuracy: 91.0, bias: -2.0, topSku: "Hair Oil", coverDays: 18, status: "On Track", trend: [84, 86, 88, 89, 90, 91] },
  { id: "TR-601", territory: "Lucknow Metro", manager: "Ravi S.", forecastVol: "2.1M", actual30d: "180K", accuracy: 96.2, bias: +0.3, topSku: "Washing Powder", coverDays: 25, status: "On Track", trend: [90, 92, 93, 94, 95, 96] },
];

/* ─── PAGE COMPONENT ─────────────────────────────────────────── */

export default function ForecastsPage() {
  const [selectedScenario, setSelectedScenario] = useState("baseline");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showPromo, setShowPromo] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredTerritories = useMemo(() =>
    territoryData.filter(t => {
      const matchesSearch = t.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.manager.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    [searchQuery, statusFilter]
  );

  const statusOptions = ["All", "On Track", "Monitor", "At Risk", "Underforecast"];

  function openAlertDetail(alert) {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  }

  // Accuracy gauge SVG
  const overallAccuracy = 91.4;
  const gaugeRadius = 54;
  const gaugeCirc = 2 * Math.PI * gaugeRadius;
  const gaugeFill = (overallAccuracy / 100) * gaugeCirc;

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiTrendingUp />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Projection Engine</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>AI</span>
            </div>
            <h2>Demand Forecasts</h2>
            <p className={styles.subtitle}>AI-driven demand projections across territories and SKUs — powered by XGBoost ensemble with POS, seasonal, and promotional signals.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/manager/forecasting">
            <Button variant="primary" size="sm" leadingIcon={<FiCpu />}>
              Live Python Engine Dashboard
            </Button>
          </Link>
          <Tooltip content="Re-run model with latest data">
            <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />}>
              Retrain
            </Button>
          </Tooltip>
          <Tooltip content="Export forecast data as CSV">
            <Button variant="secondary" size="sm" leadingIcon={<FiDownload />}>
              Export
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Model Health Banner ────────────────────────── */}
      <div className={styles.modelBanner}>
        <div className={styles.modelItem}>
          <div className={`${styles.modelItemIcon} ${styles["modelItemIcon--green"]}`}>
            <FiCpu />
          </div>
          <div className={styles.modelItemText}>
            <strong>91.4% MAPE</strong>
            <span>Model accuracy (90-day)</span>
          </div>
        </div>
        <div className={styles.modelSep} />
        <div className={styles.modelItem}>
          <div className={`${styles.modelItemIcon} ${styles["modelItemIcon--blue"]}`}>
            <FiClock />
          </div>
          <div className={styles.modelItemText}>
            <strong>6h 14m ago</strong>
            <span>Last model retrain</span>
          </div>
        </div>
        <div className={styles.modelSep} />
        <div className={styles.modelItem}>
          <div className={`${styles.modelItemIcon} ${styles["modelItemIcon--amber"]}`}>
            <FiAlertTriangle />
          </div>
          <div className={styles.modelItemText}>
            <strong>4 SKUs at risk</strong>
            <span>Below safety-stock cover</span>
          </div>
        </div>
        <div className={styles.modelSep} />
        <div className={styles.modelItem}>
          <div className={`${styles.modelItemIcon} ${styles["modelItemIcon--purple"]}`}>
            <FiLayers />
          </div>
          <div className={styles.modelItemText}>
            <strong>18 features</strong>
            <span>POS · Seasonal · Promo · Weather</span>
          </div>
        </div>
      </div>

      {/* ── Scenario Strip ────────────────────────────── */}
      <div className={styles.scenarioStrip}>
        {scenarios.map(s => (
          <div
            key={s.id}
            className={`${styles.scenarioCard} ${selectedScenario === s.id ? styles["scenarioCard--active"] : ""}`}
            onClick={() => setSelectedScenario(s.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setSelectedScenario(s.id)}
          >
            <div className={styles.scenarioHeader}>
              <div className={styles.scenarioLabel}>
                {s.icon}
                {s.label}
              </div>
              <Badge tone={s.id === "baseline" ? "primary" : s.id === "promo" ? "success" : "neutral"} variant="soft" size="sm">
                {s.confidence} conf.
              </Badge>
            </div>
            <div className={styles.scenarioValue}>
              {s.volume} <span>units</span>
            </div>
            <div className={styles.scenarioMeta}>
              <div className={styles.scenarioMetaItem}>
                <span>Revenue</span>
                <span>{s.revenue}</span>
              </div>
              <div className={styles.scenarioMetaItem}>
                <span>Margin</span>
                <span>{s.margin}</span>
              </div>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* ── Main Content ──────────────────────────────── */}
      <div className={styles.body}>

        {/* Top Grid: big chart + heatmap */}
        <div className={styles.topGrid}>
          {/* Main forecast chart */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-5)" }}>
                <div>
                  <h3 className={styles.cardTitle}>18-Month Demand Trajectory</h3>
                  <p className={styles.cardDesc}>12 months historical actuals + 6 months AI-projected demand with optional promo overlay.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <Switch
                    label="Promo overlay"
                    size="sm"
                    checked={showPromo}
                    onChange={(e) => setShowPromo(e.target.checked)}
                  />
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <AreaChart
                  series={showPromo ? demandSeries : demandSeries.slice(0, 2)}
                  categories={demandCategories}
                  height={300}
                />
              </div>
            </div>
          </Card>

          {/* Side panels */}
          <div className={styles.sidePanels}>
            {/* SKU Coverage Heatmap */}
            <Card>
              <div className={styles.cardPad}>
                <h3 className={styles.cardTitle}>SKU Coverage Heatmap</h3>
                <p className={styles.cardDesc}>Days of inventory cover. Red = critical, amber = watch, green = healthy.</p>
                <div className={styles.heatmapGrid}>
                  {skuHeatmap.map((item, i) => (
                    <Tooltip key={i} content={`${item.sku}: ${item.demand}K demand, ${item.cover}d cover`} side="top">
                      <div className={`${styles.heatmapCell} ${styles[`heatmapCell--${item.status}`]}`}>
                        <span className={styles.heatVal}>{item.cover}d</span>
                        <span className={styles.heatLabel}>{item.sku.split(" ")[0]}</span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <StatCard
                label="Projected Revenue"
                value="₹168Cr"
                delta={12.4}
                deltaLabel="vs LY"
                deltaTone="positive"
                icon={<FiTrendingUp />}
              />
              <StatCard
                label="Auto-Reorder Triggers"
                value="7"
                deltaLabel="SKUs this week"
                icon={<FiAlertTriangle />}
              />
            </div>
          </div>
        </div>

        {/* Middle Grid: Donut + Accuracy Gauge + Alerts */}
        <div className={styles.middleGrid}>
          {/* Channel Mix */}
          <Card>
            <div className={styles.cardPad}>
              <h3 className={styles.cardTitle}>Forecast by Channel</h3>
              <p className={styles.cardDesc}>Projected volume split across sales channels.</p>
              <div className={styles.donutLayout}>
                <Donut
                  data={channelMix}
                  centerValue="42.5M"
                  centerLabel="Total Units"
                  size={160}
                  thickness={20}
                  showLegend={true}
                  valueFormat={(n) => `${n}%`}
                />
              </div>
            </div>
          </Card>

          {/* Accuracy Gauge */}
          <Card>
            <div className={styles.cardPad}>
              <h3 className={styles.cardTitle}>Overall Accuracy</h3>
              <p className={styles.cardDesc}>Weighted MAPE across all active territories.</p>
              <div className={styles.gaugeWrap}>
                <div className={styles.gaugeRing}>
                  <svg viewBox="0 0 120 120" width={140} height={140}>
                    <circle cx="60" cy="60" r={gaugeRadius} fill="none" stroke="var(--surface-sunken)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r={gaugeRadius}
                      fill="none"
                      stroke={overallAccuracy >= 90 ? "var(--success)" : overallAccuracy >= 80 ? "var(--warning)" : "var(--danger)"}
                      strokeWidth="8"
                      strokeDasharray={`${gaugeFill} ${gaugeCirc - gaugeFill}`}
                      strokeDashoffset={gaugeCirc * 0.25}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 0.6s ease" }}
                    />
                  </svg>
                  <div className={styles.gaugeCenter}>
                    <strong>{overallAccuracy}%</strong>
                    <span>MAPE</span>
                  </div>
                </div>
                <div className={styles.gaugeMeta}>
                  <div className={styles.gaugeMetaItem}>
                    <span>-1.2%</span>
                    <span>Avg Bias</span>
                  </div>
                  <div className={styles.gaugeMetaItem}>
                    <span>8 / 8</span>
                    <span>Terr. &gt;80%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Live Alerts */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Forecast Alerts</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Anomalies, stockout risks, and model updates.</p>
                </div>
                <Badge tone="danger" variant="soft" size="sm">{forecastAlerts.filter(a => a.type === "danger").length} critical</Badge>
              </div>
              <div className={styles.alertList}>
                {forecastAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={styles.alertItem}
                    onClick={() => openAlertDetail(alert)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && openAlertDetail(alert)}
                  >
                    <div className={`${styles.alertIcon} ${styles[`alertIcon--${alert.type}`]}`}>
                      {alert.type === "danger" ? <FiAlertTriangle /> : alert.type === "warning" ? <FiActivity /> : <FiZap />}
                    </div>
                    <div className={styles.alertBody}>
                      <strong>{alert.title}</strong>
                      <span>{alert.time}</span>
                    </div>
                    <FiChevronRight style={{ color: "var(--text-3)", flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Territory Forecast Table */}
        <Card>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardHeaderIcon}>
                <FiMapPin />
              </div>
              <div>
                <h3>Territory Forecast Grid</h3>
                <div className={styles.cardSubtitle}>
                  Volume projections, accuracy, bias, and inventory cover by territory.
                </div>
              </div>
            </div>
          </div>
          <CardBody>
            <div style={{ padding: "var(--space-5) var(--space-6) var(--space-3)" }}>
              <div className={styles.tableToolbar}>
                <div className={styles.tableToolbarLeft}>
                  <div className={styles.chipRow}>
                    {statusOptions.map(opt => (
                      <Chip
                        key={opt}
                        selected={statusFilter === opt}
                        onClick={() => setStatusFilter(opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className={styles.tableToolbarRight}>
                  <div className={styles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search territory or manager..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FiSearch />
                  </div>
                </div>
              </div>
            </div>
            <Table
              columns={[
                {
                  key: "territory",
                  label: "Territory / Manager",
                  render: (_, row) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.territory}`} fallback={<FiMapPin />} size="md" />
                      <div>
                        <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.territory}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.manager}</div>
                      </div>
                    </div>
                  )
                },
                { key: "forecastVol", label: "Forecast (6M)", align: "right" },
                {
                  key: "actual30d",
                  label: "Last 30d",
                  align: "right",
                  render: (val) => <span style={{ fontVariantNumeric: "tabular-nums" }}>{val}</span>
                },
                {
                  key: "accuracy",
                  label: "Accuracy",
                  align: "right",
                  render: (val) => (
                    <div className={styles.inlineBar}>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${val}%`,
                            background: val >= 90 ? "var(--success)" : val >= 80 ? "var(--warning)" : "var(--danger)"
                          }}
                        />
                      </div>
                      <span className={styles.barLabel}>{val}%</span>
                    </div>
                  )
                },
                {
                  key: "bias",
                  label: "Bias",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 2,
                      fontWeight: 600, fontSize: "var(--text-sm)",
                      fontVariantNumeric: "tabular-nums",
                      color: Math.abs(val) > 5 ? "var(--danger-text)" : Math.abs(val) > 2 ? "var(--warning-text)" : "var(--success-text)"
                    }}>
                      {val > 0 ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />}
                      {val > 0 ? "+" : ""}{val}%
                    </span>
                  )
                },
                { key: "topSku", label: "Top SKU" },
                {
                  key: "coverDays",
                  label: "Cover (days)",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      color: val < 10 ? "var(--danger-text)" : val < 15 ? "var(--warning-text)" : "var(--text-1)"
                    }}>
                      {val}d
                    </span>
                  )
                },
                {
                  key: "trend",
                  label: "Accuracy Trend",
                  align: "right",
                  render: (val) => (
                    <div style={{ width: "72px", marginLeft: "auto" }}>
                      <Sparkline data={val} height={22} color="var(--primary)" />
                    </div>
                  )
                },
                {
                  key: "status",
                  label: "Status",
                  render: (val) => {
                    const tones = { "On Track": "success", "Monitor": "primary", "At Risk": "danger", "Underforecast": "warning" };
                    return <Badge tone={tones[val] || "neutral"} variant="soft" dot>{val}</Badge>;
                  }
                }
              ]}
              data={filteredTerritories}
              rowKey={(row) => row.id}
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Alert Drawer ──────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedAlert(null); }}
        title="Alert Details"
        description={selectedAlert?.title}
        side="right"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Dismiss</Button>
            <Button variant="primary" leadingIcon={<FiZap />}>Take Action</Button>
          </div>
        }
      >
        {selectedAlert && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <Badge tone={selectedAlert.type === "danger" ? "danger" : selectedAlert.type === "warning" ? "warning" : "primary"} variant="soft" dot>
                {selectedAlert.type === "danger" ? "Critical" : selectedAlert.type === "warning" ? "Warning" : "Informational"}
              </Badge>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{selectedAlert.time}</span>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>
                Description
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.6 }}>
                {selectedAlert.detail}
              </p>
            </div>

            {selectedAlert.sku && (
              <div>
                <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                  SKU Reference
                </h4>
                <div style={{
                  padding: "var(--space-4)",
                  background: "var(--surface-sunken)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontWeight: 500, color: "var(--text-1)" }}>{selectedAlert.sku}</span>
                    <Badge tone="neutral" variant="soft" size="sm">SKU</Badge>
                  </div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>
                    View detailed SKU forecast and reorder recommendations in the full detail view.
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Recommended Actions
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {selectedAlert.type === "danger" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Trigger emergency purchase order
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Notify regional manager
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Adjust safety-stock threshold
                    </div>
                  </>
                )}
                {selectedAlert.type === "warning" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Investigate demand spike root cause
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Pre-position buffer stock from nearest depot
                    </div>
                  </>
                )}
                {selectedAlert.type === "info" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                    <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Review updated model parameters
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
