"use client";

import React, { useState, useMemo } from "react";
import {
  FiTrendingUp, FiDollarSign, FiTarget, FiTag,
  FiSearch, FiDownload, FiRefreshCw, FiGift,
  FiPercent, FiActivity, FiChevronRight, FiAward,
  FiArrowUpRight, FiArrowDownRight, FiCalendar,
  FiZap, FiAlertTriangle, FiBarChart2, FiUsers
} from "react-icons/fi";
import {
  Badge, Card, CardBody, StatCard, Table, Avatar,
  Chip, Button, Tooltip, Donut, Drawer
} from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

// ROI trend over months
const roiTrendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const roiTrendSeries = [
  { name: "Spend (₹L)", data: [4.2, 5.1, 6.8, 7.5, 8.2, 9.0, 10.5, 11.2, 9.8, 8.5, 12.0, 14.5], color: "var(--border-strong)" },
  { name: "Incremental Revenue (₹L)", data: [12.5, 16.8, 22.0, 24.5, 28.0, 32.5, 38.0, 42.5, 35.0, 30.5, 45.0, 58.0], color: "var(--success)" },
];

// Category-wise ROI bar chart
const categoryLabels = ["Beverages", "Snacks", "Personal Care", "Home Care", "Dairy"];
const categorySeries = [
  { name: "Budget (₹L)", data: [28, 18, 12, 8, 22], color: "var(--border-strong)" },
  { name: "Incremental Rev (₹L)", data: [95, 48, 32, 18, 72], color: "var(--primary)" },
];

// Offer type summary cards
const offerTypes = [
  { id: "buyget", label: "Buy X Get Y", icon: <FiGift />, count: 12, spend: "₹18.5L", roi: "342%", uplift: "+28%", tone: "success" },
  { id: "discount", label: "% Discount", icon: <FiPercent />, count: 8, spend: "₹12.2L", roi: "215%", uplift: "+18%", tone: "primary" },
  { id: "display", label: "Display / Visibility", icon: <FiBarChart2 />, count: 6, spend: "₹8.4L", roi: "168%", uplift: "+12%", tone: "neutral" },
  { id: "loyalty", label: "Loyalty / Cashback", icon: <FiAward />, count: 5, spend: "₹6.8L", roi: "290%", uplift: "+22%", tone: "success" },
];

// Spend allocation donut
const spendAllocation = [
  { label: "Buy X Get Y", value: 18.5 },
  { label: "% Discount", value: 12.2 },
  { label: "Display / Visibility", value: 8.4 },
  { label: "Loyalty / Cashback", value: 6.8 },
];

// Top performing offers (ranked)
const topOffers = [
  { rank: 1, name: "Mango Burst Buy 10 Get 2", territory: "National", roi: "482%", spend: "₹4.5L", revenue: "₹26.1L" },
  { rank: 2, name: "Masala Mix Retailer Loyalty", territory: "North + West", roi: "410%", spend: "₹3.2L", revenue: "₹16.3L" },
  { rank: 3, name: "Maggi Festival Combo Pack", territory: "All India", roi: "388%", spend: "₹5.8L", revenue: "₹28.3L" },
  { rank: 4, name: "Hair Oil 15% Summer Discount", territory: "South", roi: "325%", spend: "₹2.1L", revenue: "₹8.9L" },
  { rank: 5, name: "Detergent Display Stand Offer", territory: "Metro Cities", roi: "245%", spend: "₹1.8L", revenue: "₹6.2L" },
];

// Budget utilization by region
const budgetUtilization = [
  { label: "North Zone", spent: 82, allocated: "₹14.5L", color: "var(--primary)" },
  { label: "South Zone", spent: 94, allocated: "₹12.8L", color: "var(--success)" },
  { label: "East Zone", spent: 68, allocated: "₹8.2L", color: "var(--warning)" },
  { label: "West Zone", spent: 91, allocated: "₹10.4L", color: "var(--success)" },
  { label: "Central Zone", spent: 55, allocated: "₹5.0L", color: "var(--danger)" },
];

// AI insights / anomalies
const roiInsights = [
  { id: 1, type: "success", title: "Buy X Get Y outperforming all other types by 2.1x", detail: "Average ROI 342% vs 215% for discounts. Recommend shifting 15% budget allocation.", time: "Analyzed today" },
  { id: 2, type: "danger", title: "KitKat Display campaign ROI dropped below 100%", detail: "₹3.2L spent, only ₹2.8L incremental. Pause and reallocate to higher performers.", campaign: "KitKat Premium Display", time: "2h ago" },
  { id: 3, type: "warning", title: "East Zone budget only 68% utilized — ₹2.6L unspent", detail: "Recommend launching a targeted snacks promo in Bihar + Jharkhand corridors.", time: "5h ago" },
  { id: 4, type: "info", title: "Seasonal uplift expected for Dairy in Aug–Sep", detail: "Historical data shows 35% demand spike. Pre-allocate ₹4L for dairy promos.", time: "1d ago" },
  { id: 5, type: "success", title: "Retailer loyalty schemes driving repeat purchases", detail: "+22% repeat order rate for enrolled retailers vs non-enrolled baseline.", time: "1d ago" },
  { id: 6, type: "warning", title: "Discount fatigue detected in Personal Care segment", detail: "Third consecutive discount in 8 weeks. Diminishing uplift observed (from +18% to +6%).", time: "2d ago" },
];

// Full campaign table
const campaignData = [
  { id: "OFR-001", name: "Mango Burst Buy 10 Get 2", type: "Buy X Get Y", territory: "National", start: "01 Jun", end: "30 Jun", budget: "₹4.50L", spent: "₹4.32L", utilization: 96, incremental: "₹26.10L", roi: 482, uplift: 28.5, status: "High ROI", trend: [320, 350, 400, 450, 470, 482] },
  { id: "OFR-002", name: "Masala Mix Retailer Loyalty", type: "Loyalty", territory: "North + West", start: "15 May", end: "15 Jul", budget: "₹3.20L", spent: "₹2.88L", utilization: 90, incremental: "₹16.30L", roi: 410, uplift: 22.0, status: "High ROI", trend: [280, 310, 340, 380, 400, 410] },
  { id: "OFR-003", name: "Maggi Festival Combo Pack", type: "Buy X Get Y", territory: "All India", start: "01 Jul", end: "31 Jul", budget: "₹5.80L", spent: "₹5.10L", utilization: 88, incremental: "₹28.30L", roi: 388, uplift: 25.0, status: "High ROI", trend: [200, 260, 310, 350, 370, 388] },
  { id: "OFR-004", name: "Hair Oil 15% Summer Discount", type: "% Discount", territory: "South", start: "01 Jun", end: "31 Jul", budget: "₹2.10L", spent: "₹1.95L", utilization: 93, incremental: "₹8.90L", roi: 325, uplift: 18.5, status: "On Track", trend: [180, 220, 260, 290, 310, 325] },
  { id: "OFR-005", name: "Detergent Display Stand", type: "Display", territory: "Metro Cities", start: "10 Jun", end: "10 Aug", budget: "₹1.80L", spent: "₹1.44L", utilization: 80, incremental: "₹6.20L", roi: 245, uplift: 12.0, status: "On Track", trend: [150, 180, 200, 220, 235, 245] },
  { id: "OFR-006", name: "Tata Salt Bulk 5% Off", type: "% Discount", territory: "All Regions", budget: "₹8.50L", spent: "₹7.82L", start: "01 Apr", end: "30 Jun", utilization: 92, incremental: "₹26.80L", roi: 215, uplift: 15.0, status: "On Track", trend: [120, 150, 170, 190, 205, 215] },
  { id: "OFR-007", name: "Floor Cleaner BOGO Pilot", type: "Buy X Get Y", territory: "West", start: "15 Jun", end: "15 Jul", budget: "₹1.20L", spent: "₹1.18L", utilization: 98, incremental: "₹2.40L", roi: 103, uplift: 6.5, status: "Low ROI", trend: [80, 85, 90, 95, 100, 103] },
  { id: "OFR-008", name: "KitKat Premium Display", type: "Display", territory: "Noida Central", start: "01 Jul", end: "31 Jul", budget: "₹3.20L", spent: "₹3.05L", utilization: 95, incremental: "₹2.80L", roi: 78, uplift: 3.2, status: "Underperforming", trend: [120, 110, 100, 90, 85, 78] },
];

/* ─── PAGE COMPONENT ─────────────────────────────────────────── */

export default function OfferRoiPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);

  const filteredCampaigns = useMemo(() =>
    campaignData.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.territory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchType = selectedType === "all" || c.type.toLowerCase().includes(selectedType);
      return matchSearch && matchStatus && matchType;
    }),
    [searchQuery, statusFilter, selectedType]
  );

  const statusOptions = ["All", "High ROI", "On Track", "Low ROI", "Underperforming"];

  // Overall ROI gauge
  const overallROI = 309;
  const gaugeRadius = 54;
  const gaugeCirc = 2 * Math.PI * gaugeRadius;
  const normalizedROI = Math.min(overallROI / 500, 1); // cap at 500%
  const gaugeFill = normalizedROI * gaugeCirc;

  function openInsightDetail(insight) {
    setSelectedInsight(insight);
    setDrawerOpen(true);
  }

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
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Offer ROI Analysis</h2>
            <p className={styles.subtitle}>Measure incremental revenue, budget efficiency, and campaign profitability across offer types, territories, and SKU categories.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Tooltip content="Recalculate ROI with latest POS data">
            <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />}>
              Recalculate
            </Button>
          </Tooltip>
          <Tooltip content="Export campaign data as CSV">
            <Button variant="secondary" size="sm" leadingIcon={<FiDownload />}>
              Export
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Spend Summary Banner ───────────────────────── */}
      <div className={styles.spendBanner}>
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--blue"]}`}>
            <FiDollarSign />
          </div>
          <div className={styles.bannerText}>
            <strong>₹45.9L Total Spend</strong>
            <span>Across 31 active campaigns</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--green"]}`}>
            <FiTrendingUp />
          </div>
          <div className={styles.bannerText}>
            <strong>₹1.42Cr Incremental</strong>
            <span>Net revenue attributable to offers</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--amber"]}`}>
            <FiTarget />
          </div>
          <div className={styles.bannerText}>
            <strong>309% Blended ROI</strong>
            <span>₹3.09 return per ₹1 spent</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--purple"]}`}>
            <FiActivity />
          </div>
          <div className={styles.bannerText}>
            <strong>+19.4% Avg Uplift</strong>
            <span>Incremental volume vs baseline</span>
          </div>
        </div>
      </div>

      {/* ── Offer Type Cards ──────────────────────────── */}
      <div className={styles.offerTypeGrid}>
        {offerTypes.map(ot => (
          <div
            key={ot.id}
            className={`${styles.offerCard} ${selectedType === ot.id ? styles["offerCard--active"] : ""}`}
            onClick={() => setSelectedType(selectedType === ot.id ? "all" : ot.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setSelectedType(selectedType === ot.id ? "all" : ot.id)}
          >
            <div className={styles.offerHeader}>
              <div className={styles.offerLabel}>
                {ot.icon}
                {ot.label}
              </div>
              <Badge tone={ot.tone} variant="soft" size="sm">
                {ot.count} active
              </Badge>
            </div>
            <div className={styles.offerValue}>
              {ot.roi} <span>ROI</span>
            </div>
            <div className={styles.offerMeta}>
              <div className={styles.offerMetaItem}>
                <span>Spend</span>
                <span>{ot.spend}</span>
              </div>
              <div className={styles.offerMetaItem}>
                <span>Uplift</span>
                <span>{ot.uplift}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.body}>
        {/* ── Top Grid: Trend Chart + Side Panels ──────── */}
        <div className={styles.topGrid}>
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-5)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Spend vs Incremental Revenue (12 Months)</h3>
                  <p className={styles.cardDesc}>Monthly promotional spend overlaid with attributable incremental revenue generated.</p>
                </div>
              </div>
              <div style={{ height: "280px" }}>
                <AreaChart
                  series={roiTrendSeries}
                  categories={roiTrendLabels}
                  height={280}
                />
              </div>
            </div>
          </Card>

          <div className={styles.sidePanels}>
            {/* Spend Allocation Donut */}
            <Card>
              <div className={styles.cardPad}>
                <h3 className={styles.cardTitle}>Spend Allocation</h3>
                <p className={styles.cardDesc}>Budget distribution across offer mechanics.</p>
                <div className={styles.donutLayout}>
                  <Donut
                    data={spendAllocation}
                    centerValue="₹45.9L"
                    centerLabel="Total"
                    size={150}
                    thickness={20}
                    showLegend={true}
                    valueFormat={(n) => `₹${n}L`}
                  />
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <StatCard
                label="Best Performer"
                value="482%"
                deltaLabel="Mango Burst B10G2"
                icon={<FiAward />}
              />
              <StatCard
                label="Worst Performer"
                value="78%"
                deltaLabel="KitKat Display"
                icon={<FiAlertTriangle />}
              />
            </div>
          </div>
        </div>

        {/* ── Middle Grid: Top Offers + Budget + Insights ─ */}
        <div className={styles.middleGrid}>
          {/* Top ROI Leaderboard */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Top ROI Campaigns</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Highest return on investment this period.</p>
                </div>
                <Badge tone="success" variant="soft" size="sm">
                  <FiAward style={{ marginRight: 4 }} /> Ranked
                </Badge>
              </div>
              <div className={styles.rankedList}>
                {topOffers.map(o => {
                  const rankClass = o.rank === 1 ? "gold" : o.rank === 2 ? "silver" : o.rank === 3 ? "bronze" : "default";
                  return (
                    <div key={o.rank} className={styles.rankedItem}>
                      <div className={`${styles.rankedRank} ${styles[`rankedRank--${rankClass}`]}`}>
                        #{o.rank}
                      </div>
                      <div className={styles.rankedInfo}>
                        <strong>{o.name}</strong>
                        <span>{o.territory} • Spend {o.spend}</span>
                      </div>
                      <span className={styles.rankedScore} style={{ color: "var(--success-text)" }}>
                        {o.roi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Budget Utilization by Region */}
          <Card>
            <div className={styles.cardPad}>
              <h3 className={styles.cardTitle}>Budget Utilization by Zone</h3>
              <p className={styles.cardDesc}>Percentage of allocated promo budget consumed per zone.</p>
              <div className={styles.meterList}>
                {budgetUtilization.map((m, i) => (
                  <div key={i} className={styles.meterRow}>
                    <div className={styles.meterLabel}>
                      <span>{m.label}</span>
                      <span style={{ color: m.spent >= 85 ? "var(--success-text)" : m.spent >= 65 ? "var(--warning-text)" : "var(--danger-text)" }}>
                        {m.spent}% of {m.allocated}
                      </span>
                    </div>
                    <div className={styles.meterTrack}>
                      <div
                        className={styles.meterFill}
                        style={{ width: `${m.spent}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Insights Feed */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>ROI Insights</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>AI-generated recommendations and anomalies.</p>
                </div>
                <Badge tone="danger" variant="soft" size="sm">
                  {roiInsights.filter(a => a.type === "danger").length} action needed
                </Badge>
              </div>
              <div className={styles.insightList}>
                {roiInsights.map(insight => (
                  <div
                    key={insight.id}
                    className={styles.insightItem}
                    onClick={() => openInsightDetail(insight)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && openInsightDetail(insight)}
                  >
                    <div className={`${styles.insightIcon} ${styles[`insightIcon--${insight.type}`]}`}>
                      {insight.type === "success" ? <FiTrendingUp /> : insight.type === "danger" ? <FiAlertTriangle /> : insight.type === "warning" ? <FiActivity /> : <FiZap />}
                    </div>
                    <div className={styles.insightBody}>
                      <strong>{insight.title}</strong>
                      <span>{insight.time}</span>
                    </div>
                    <FiChevronRight style={{ color: "var(--text-3)", flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Category ROI Bar Chart ──────────────────── */}
        <Card>
          <div className={styles.cardPad}>
            <h3 className={styles.cardTitle}>Category-wise Spend vs Revenue</h3>
            <p className={styles.cardDesc}>Promotional budget and incremental revenue broken down by product category.</p>
            <BarChart
              categories={categoryLabels}
              series={categorySeries}
              height={240}
            />
          </div>
        </Card>

        {/* ── Full Campaign Table ─────────────────────── */}
        <Card>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardHeaderIcon}>
                <FiTag />
              </div>
              <div>
                <h3>Campaign Performance Matrix</h3>
                <div className={styles.cardSubtitle}>
                  All active and recent campaigns with spend, ROI, uplift, and utilization tracking.
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
                      placeholder="Search campaign or territory..."
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
                  key: "name",
                  label: "Campaign",
                  render: (_, row) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`} fallback={<FiTag />} size="md" />
                      <div>
                        <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.type}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: "territory",
                  label: "Territory",
                  render: (val) => <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>{val}</span>
                },
                {
                  key: "timeline",
                  label: "Timeline",
                  render: (_, row) => (
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>
                      {row.start} – {row.end}
                    </div>
                  )
                },
                { key: "budget", label: "Budget", align: "right" },
                {
                  key: "utilization",
                  label: "Utilization",
                  align: "right",
                  render: (val) => (
                    <div className={styles.inlineBar}>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${val}%`,
                            background: val >= 90 ? "var(--success)" : val >= 75 ? "var(--warning)" : "var(--danger)"
                          }}
                        />
                      </div>
                      <span className={styles.barLabel}>{val}%</span>
                    </div>
                  )
                },
                { key: "incremental", label: "Incr. Rev", align: "right" },
                {
                  key: "roi",
                  label: "ROI %",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      color: val >= 300 ? "var(--success-text)" : val >= 150 ? "var(--text-1)" : val >= 100 ? "var(--warning-text)" : "var(--danger-text)"
                    }}>
                      {val}%
                    </span>
                  )
                },
                {
                  key: "uplift",
                  label: "Uplift",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 2,
                      fontWeight: 600, fontSize: "var(--text-sm)",
                      fontVariantNumeric: "tabular-nums",
                      color: val >= 20 ? "var(--success-text)" : val >= 10 ? "var(--text-1)" : "var(--warning-text)"
                    }}>
                      <FiArrowUpRight size={14} />
                      +{val}%
                    </span>
                  )
                },
                {
                  key: "trend",
                  label: "ROI Trend",
                  align: "right",
                  render: (val, row) => (
                    <div style={{ width: "72px", marginLeft: "auto" }}>
                      <Sparkline data={val} height={22} color={row.roi >= 200 ? "var(--success)" : row.roi >= 100 ? "var(--primary)" : "var(--danger)"} />
                    </div>
                  )
                },
                {
                  key: "status",
                  label: "Status",
                  render: (val) => {
                    const tones = { "High ROI": "success", "On Track": "primary", "Low ROI": "warning", "Underperforming": "danger" };
                    return <Badge tone={tones[val] || "neutral"} variant="soft" dot>{val}</Badge>;
                  }
                }
              ]}
              data={filteredCampaigns}
              rowKey={(row) => row.id}
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Insight Drawer ────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedInsight(null); }}
        title="ROI Insight"
        description={selectedInsight?.title}
        side="right"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Dismiss</Button>
            <Button variant="primary" leadingIcon={<FiZap />}>Apply Recommendation</Button>
          </div>
        }
      >
        {selectedInsight && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <Badge
                tone={selectedInsight.type === "success" ? "success" : selectedInsight.type === "danger" ? "danger" : selectedInsight.type === "warning" ? "warning" : "primary"}
                variant="soft" dot
              >
                {selectedInsight.type === "success" ? "Opportunity" : selectedInsight.type === "danger" ? "Action Required" : selectedInsight.type === "warning" ? "Watch" : "Informational"}
              </Badge>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{selectedInsight.time}</span>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>
                Analysis
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.6 }}>
                {selectedInsight.detail}
              </p>
            </div>

            {selectedInsight.campaign && (
              <div>
                <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                  Related Campaign
                </h4>
                <div style={{
                  padding: "var(--space-4)",
                  background: "var(--surface-sunken)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontWeight: 500, color: "var(--text-1)" }}>{selectedInsight.campaign}</span>
                    <Badge tone="neutral" variant="soft" size="sm">Campaign</Badge>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Recommended Actions
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {selectedInsight.type === "success" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Increase budget allocation for this offer type
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Replicate winning mechanics in underperforming zones
                    </div>
                  </>
                )}
                {selectedInsight.type === "danger" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Pause campaign immediately
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Reallocate remaining budget to top performers
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Conduct post-mortem analysis with territory manager
                    </div>
                  </>
                )}
                {selectedInsight.type === "warning" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Review zone manager's campaign pipeline
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Consider launching targeted promo in underserved areas
                    </div>
                  </>
                )}
                {selectedInsight.type === "info" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                    <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Pre-allocate budget based on seasonal forecast
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
