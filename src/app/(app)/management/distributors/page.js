"use client";

import React, { useState, useMemo } from "react";
import {
  FiUsers, FiTrendingUp, FiCheckCircle, FiPackage,
  FiAlertTriangle, FiSearch, FiDownload, FiRefreshCw,
  FiTruck, FiClock, FiMapPin, FiDollarSign,
  FiChevronRight, FiAward, FiArrowUpRight, FiArrowDownRight,
  FiShield, FiPercent, FiActivity, FiStar, FiZap
} from "react-icons/fi";
import {
  Badge, Card, CardBody, StatCard, Table, Avatar, Tabs,
  Chip, Button, Tooltip, Donut, Drawer
} from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

// Fulfillment + volume trend (12 weeks)
const weekLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
const fulfillmentTrend = [
  { name: "Fulfillment Rate (%)", data: [91.2, 92.0, 91.8, 93.5, 94.0, 93.2, 94.8, 95.1, 94.5, 95.8, 96.2, 95.9], color: "var(--success)" },
  { name: "On-Time Delivery (%)", data: [88.5, 89.0, 88.2, 90.1, 91.5, 90.8, 92.0, 91.5, 92.4, 93.1, 93.5, 92.8], color: "var(--primary)" },
];

// Regional fill-rate bar chart
const regionLabels = ["North", "South", "East", "West", "Central"];
const regionSeries = [
  { name: "Target SLA", data: [95, 95, 95, 95, 95], color: "var(--border-strong)" },
  { name: "Actual Fill Rate", data: [96.2, 98.1, 93.5, 89.5, 94.8], color: "var(--primary)" },
];

// Tier summary data
const tierSummary = [
  { id: "platinum", label: "Platinum", icon: <FiAward />, count: 8, avgFill: "98.5%", avgOTD: "97.2%", revenue: "₹42.1Cr", tone: "success" },
  { id: "gold", label: "Gold", icon: <FiStar />, count: 14, avgFill: "95.8%", avgOTD: "93.5%", revenue: "₹35.6Cr", tone: "primary" },
  { id: "silver", label: "Silver", icon: <FiShield />, count: 18, avgFill: "91.2%", avgOTD: "88.0%", revenue: "₹22.4Cr", tone: "neutral" },
  { id: "watch", label: "Watch List", icon: <FiAlertTriangle />, count: 8, avgFill: "84.5%", avgOTD: "79.8%", revenue: "₹8.2Cr", tone: "danger" },
];

// Channel-mix donut
const channelMix = [
  { label: "Platinum Tier", value: 42.1 },
  { label: "Gold Tier", value: 35.6 },
  { label: "Silver Tier", value: 22.4 },
  { label: "Watch List", value: 8.2 },
];

// Top performers (scorecard)
const topPerformers = [
  { rank: 1, name: "Aman Verma", location: "Delhi East", score: 99.1, fill: "99.1%", otd: "98.5%", returns: "1.2%" },
  { rank: 2, name: "Meera Reddy", location: "Hyderabad South", score: 98.8, fill: "98.8%", otd: "99.0%", returns: "0.8%" },
  { rank: 3, name: "Priya Nair", location: "Chennai Central", score: 98.2, fill: "98.2%", otd: "97.5%", returns: "1.0%" },
  { rank: 4, name: "Ravi Shankar", location: "Bangalore North", score: 97.5, fill: "97.5%", otd: "96.0%", returns: "1.5%" },
  { rank: 5, name: "Kunal Verma", location: "Delhi Central", score: 97.0, fill: "97.0%", otd: "95.8%", returns: "2.0%" },
];

// SLA compliance meters
const complianceMetrics = [
  { label: "Order Fulfillment", value: 95.9, target: 95, color: "var(--success)" },
  { label: "On-Time Delivery", value: 92.8, target: 95, color: "var(--warning)" },
  { label: "Returns & Damage", value: 96.5, target: 97, color: "var(--warning)" },
  { label: "Invoice Accuracy", value: 99.1, target: 98, color: "var(--success)" },
  { label: "Stock Availability", value: 88.4, target: 92, color: "var(--danger)" },
];

// Active issues / escalations
const activeIssues = [
  { id: 1, type: "danger", title: "DST-004 Suresh Kumar – SLA breach 3 consecutive weeks", detail: "Fulfillment dropped below 88%. Escalation email sent to Regional Head.", dist: "Gurugram Wholesales", time: "30 min ago" },
  { id: 2, type: "danger", title: "DST-009 Vikram Singh – Returns rate at 5%", detail: "Return rate breached 4% threshold. Quality audit pending.", dist: "Mumbai West", time: "1h ago" },
  { id: 3, type: "warning", title: "DST-011 Rohit Jain – Stock availability dip to 82%", detail: "12 SKUs below reorder level. Replenishment PO not raised.", dist: "Lucknow East", time: "2h ago" },
  { id: 4, type: "warning", title: "DST-007 Anita Sharma – Late deliveries spiked this week", detail: "OTD dropped from 94% to 87%. Vehicle routing issue suspected.", dist: "Nashik Hub", time: "3h ago" },
  { id: 5, type: "info", title: "DST-001 Aman Verma – Promoted to Platinum Tier", detail: "3 consecutive months at 99%+ fulfillment and sub-1.5% returns.", dist: "Delhi East", time: "5h ago" },
  { id: 6, type: "info", title: "Monthly SLA review due in 3 days", detail: "48 distributors scheduled for automated score recalculation.", dist: null, time: "1d ago" },
];

// Full distributor table data
const distributorData = [
  { id: "DST-001", name: "Aman Verma", location: "Delhi East", region: "North", tier: "Platinum", fulfillment: 99.1, onTime: 98.5, returns: 1.2, stockAvail: 97, invoiceAcc: 99.5, revenue: "₹8.45L", compositeScore: 99.1, trend: [95, 96, 97, 98, 99, 99.1], status: "Excellent" },
  { id: "DST-005", name: "Meera Reddy", location: "Hyderabad South", region: "South", tier: "Platinum", fulfillment: 98.8, onTime: 99.0, returns: 0.8, stockAvail: 96, invoiceAcc: 99.8, revenue: "₹7.20L", compositeScore: 98.8, trend: [92, 94, 96, 97, 98, 98.8], status: "Excellent" },
  { id: "DST-008", name: "Priya Nair", location: "Chennai Central", region: "South", tier: "Platinum", fulfillment: 98.2, onTime: 97.5, returns: 1.0, stockAvail: 95, invoiceAcc: 99.2, revenue: "₹6.80L", compositeScore: 98.2, trend: [90, 93, 95, 96, 97, 98.2], status: "Excellent" },
  { id: "DST-002", name: "Kunal Verma", location: "Delhi Central", region: "North", tier: "Gold", fulfillment: 97.0, onTime: 95.8, returns: 2.0, stockAvail: 94, invoiceAcc: 98.5, revenue: "₹6.86L", compositeScore: 97.0, trend: [95, 94, 97, 98, 96, 97.0], status: "Good" },
  { id: "DST-010", name: "Ravi Shankar", location: "Bangalore North", region: "South", tier: "Gold", fulfillment: 96.5, onTime: 94.0, returns: 2.2, stockAvail: 93, invoiceAcc: 98.0, revenue: "₹5.92L", compositeScore: 96.5, trend: [90, 92, 94, 95, 96, 96.5], status: "Good" },
  { id: "DST-003", name: "Rajesh Gupta", location: "Noida Logistics", region: "North", tier: "Silver", fulfillment: 94.2, onTime: 91.8, returns: 4.1, stockAvail: 88, invoiceAcc: 97.0, revenue: "₹5.12L", compositeScore: 94.2, trend: [99, 97, 96, 94, 92, 94.2], status: "Average" },
  { id: "DST-007", name: "Anita Sharma", location: "Nashik Hub", region: "West", tier: "Silver", fulfillment: 91.5, onTime: 87.0, returns: 3.8, stockAvail: 86, invoiceAcc: 96.5, revenue: "₹4.65L", compositeScore: 91.5, trend: [93, 92, 91, 90, 89, 91.5], status: "Average" },
  { id: "DST-011", name: "Rohit Jain", location: "Lucknow East", region: "North", tier: "Watch", fulfillment: 88.0, onTime: 84.5, returns: 5.2, stockAvail: 82, invoiceAcc: 95.0, revenue: "₹3.85L", compositeScore: 88.0, trend: [92, 90, 88, 87, 86, 88.0], status: "At Risk" },
  { id: "DST-006", name: "Vikram Singh", location: "Mumbai West", region: "West", tier: "Watch", fulfillment: 85.0, onTime: 79.5, returns: 5.0, stockAvail: 80, invoiceAcc: 94.5, revenue: "₹3.15L", compositeScore: 85.0, trend: [88, 85, 83, 82, 84, 85.0], status: "At Risk" },
  { id: "DST-004", name: "Suresh Kumar", location: "Gurugram Wholesales", region: "North", tier: "Watch", fulfillment: 82.5, onTime: 78.2, returns: 8.5, stockAvail: 75, invoiceAcc: 92.0, revenue: "₹2.42L", compositeScore: 82.5, trend: [95, 92, 88, 85, 82, 82.5], status: "Critical" },
];

/* ─── PAGE COMPONENT ─────────────────────────────────────────── */

export default function DistributorsPage() {
  const [selectedTier, setSelectedTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const filteredDistributors = useMemo(() =>
    distributorData.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      const matchTier = selectedTier === "all" || d.tier.toLowerCase() === selectedTier;
      return matchSearch && matchStatus && matchTier;
    }),
    [searchQuery, statusFilter, selectedTier]
  );

  const statusOptions = ["All", "Excellent", "Good", "Average", "At Risk", "Critical"];

  function openIssueDetail(issue) {
    setSelectedIssue(issue);
    setDrawerOpen(true);
  }

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiUsers />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Distributor Performance Matrix</h2>
            <p className={styles.subtitle}>Composite scoring across fulfillment, delivery, returns, stock availability, and invoice accuracy — with tier classification and SLA compliance.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Tooltip content="Recalculate composite scores">
            <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />}>
              Recalculate
            </Button>
          </Tooltip>
          <Tooltip content="Export matrix as CSV">
            <Button variant="secondary" size="sm" leadingIcon={<FiDownload />}>
              Export
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Network Health Banner ──────────────────────── */}
      <div className={styles.networkBanner}>
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--green"]}`}>
            <FiUsers />
          </div>
          <div className={styles.bannerText}>
            <strong>48 Active Partners</strong>
            <span>Across 5 zones</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--blue"]}`}>
            <FiPackage />
          </div>
          <div className={styles.bannerText}>
            <strong>95.9% Fulfillment</strong>
            <span>Network average (12W)</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--amber"]}`}>
            <FiClock />
          </div>
          <div className={styles.bannerText}>
            <strong>92.8% OTD</strong>
            <span>On-time delivery rate</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--red"]}`}>
            <FiAlertTriangle />
          </div>
          <div className={styles.bannerText}>
            <strong>8 on Watch List</strong>
            <span>Below 90% composite</span>
          </div>
        </div>
      </div>

      {/* ── Tier Classification Cards ─────────────────── */}
      <div className={styles.tierGrid}>
        {tierSummary.map(tier => (
          <div
            key={tier.id}
            className={`${styles.tierCard} ${selectedTier === tier.id ? styles["tierCard--active"] : ""}`}
            onClick={() => setSelectedTier(selectedTier === tier.id ? "all" : tier.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setSelectedTier(selectedTier === tier.id ? "all" : tier.id)}
          >
            <div className={styles.tierHeader}>
              <div className={styles.tierLabel}>
                {tier.icon}
                {tier.label}
              </div>
              <Badge tone={tier.tone} variant="soft" size="sm">
                {tier.count} partners
              </Badge>
            </div>
            <div className={styles.tierCount}>
              {tier.avgFill} <span>avg fill</span>
            </div>
            <div className={styles.tierMeta}>
              <div className={styles.tierMetaItem}>
                <span>OTD</span>
                <span>{tier.avgOTD}</span>
              </div>
              <div className={styles.tierMetaItem}>
                <span>Revenue</span>
                <span>{tier.revenue}</span>
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
                  <h3 className={styles.cardTitle}>Network Performance Trend (12 Weeks)</h3>
                  <p className={styles.cardDesc}>Aggregate fulfillment rate and on-time delivery across all active distributors.</p>
                </div>
              </div>
              <div style={{ height: "280px" }}>
                <AreaChart
                  series={fulfillmentTrend}
                  categories={weekLabels}
                  height={280}
                />
              </div>
            </div>
          </Card>

          <div className={styles.sidePanels}>
            {/* Revenue Split Donut */}
            <Card>
              <div className={styles.cardPad}>
                <h3 className={styles.cardTitle}>Revenue by Tier</h3>
                <p className={styles.cardDesc}>Contribution of each tier to total distributor revenue.</p>
                <div className={styles.donutLayout}>
                  <Donut
                    data={channelMix}
                    centerValue="₹108Cr"
                    centerLabel="Total Rev"
                    size={150}
                    thickness={20}
                    showLegend={true}
                    valueFormat={(n) => `₹${n}Cr`}
                  />
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <StatCard
                label="Avg Returns Rate"
                value="2.8%"
                delta={-0.4}
                deltaLabel="vs last month"
                deltaTone="positive"
                icon={<FiTruck />}
              />
              <StatCard
                label="Invoice Accuracy"
                value="99.1%"
                delta={0.3}
                deltaLabel="improvement"
                deltaTone="positive"
                icon={<FiCheckCircle />}
              />
            </div>
          </div>
        </div>

        {/* ── Middle Grid: Scorecard + Compliance + Issues ─ */}
        <div className={styles.middleGrid}>
          {/* Top Performers Scorecard */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Top Performers</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Highest composite scores this period.</p>
                </div>
                <Badge tone="success" variant="soft" size="sm">
                  <FiAward style={{ marginRight: 4 }} /> Leaderboard
                </Badge>
              </div>
              <div className={styles.scorecardList}>
                {topPerformers.map(p => {
                  const rankClass = p.rank === 1 ? "gold" : p.rank === 2 ? "silver" : p.rank === 3 ? "bronze" : "default";
                  return (
                    <div key={p.rank} className={styles.scorecardItem}>
                      <div className={`${styles.scorecardRank} ${styles[`scorecardRank--${rankClass}`]}`}>
                        #{p.rank}
                      </div>
                      <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${p.name}`} size="sm" />
                      <div className={styles.scorecardInfo}>
                        <strong>{p.name}</strong>
                        <span>{p.location} • Fill {p.fill} • OTD {p.otd}</span>
                      </div>
                      <span className={styles.scorecardScore} style={{ color: "var(--success-text)" }}>
                        {p.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* SLA Compliance Meters */}
          <Card>
            <div className={styles.cardPad}>
              <h3 className={styles.cardTitle}>SLA Compliance</h3>
              <p className={styles.cardDesc}>Network-wide performance against contracted service levels.</p>
              <div className={styles.complianceList}>
                {complianceMetrics.map((m, i) => {
                  const met = m.value >= m.target;
                  return (
                    <div key={i} className={styles.complianceRow}>
                      <div className={styles.complianceLabel}>
                        <span>{m.label}</span>
                        <span style={{ color: met ? "var(--success-text)" : "var(--danger-text)" }}>
                          {m.value}% / {m.target}%
                        </span>
                      </div>
                      <div className={styles.complianceTrack}>
                        <div
                          className={styles.complianceFill}
                          style={{
                            width: `${Math.min(m.value, 100)}%`,
                            background: m.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Active Issues */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Active Issues</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Escalations, breaches, and updates.</p>
                </div>
                <Badge tone="danger" variant="soft" size="sm">
                  {activeIssues.filter(a => a.type === "danger").length} critical
                </Badge>
              </div>
              <div className={styles.issueList}>
                {activeIssues.map(issue => (
                  <div
                    key={issue.id}
                    className={styles.issueItem}
                    onClick={() => openIssueDetail(issue)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && openIssueDetail(issue)}
                  >
                    <div className={`${styles.issueIcon} ${styles[`issueIcon--${issue.type}`]}`}>
                      {issue.type === "danger" ? <FiAlertTriangle /> : issue.type === "warning" ? <FiActivity /> : <FiZap />}
                    </div>
                    <div className={styles.issueBody}>
                      <strong>{issue.title}</strong>
                      <span>{issue.time}</span>
                    </div>
                    <FiChevronRight style={{ color: "var(--text-3)", flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Regional Fill-Rate Chart ────────────────── */}
        <Card>
          <div className={styles.cardPad}>
            <h3 className={styles.cardTitle}>Regional Fulfillment vs Target</h3>
            <p className={styles.cardDesc}>Actual fill-rate benchmarked against the 95% SLA target per zone.</p>
            <BarChart
              categories={regionLabels}
              series={regionSeries}
              height={240}
            />
          </div>
        </Card>

        {/* ── Full Distributor Table ──────────────────── */}
        <Card>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardHeaderIcon}>
                <FiUsers />
              </div>
              <div>
                <h3>Distributor Scorecard</h3>
                <div className={styles.cardSubtitle}>
                  Composite performance matrix — fulfillment, OTD, returns, stock availability, invoice accuracy.
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
                      placeholder="Search distributor or location..."
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
                  label: "Distributor",
                  render: (_, row) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`} fallback={row.name.charAt(0)} size="md" />
                      <div>
                        <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.location}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: "region",
                  label: "Zone",
                  render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
                },
                {
                  key: "tier",
                  label: "Tier",
                  render: (val) => {
                    const tones = { Platinum: "success", Gold: "primary", Silver: "neutral", Watch: "danger" };
                    return <Badge tone={tones[val] || "neutral"} variant="soft" size="sm">{val}</Badge>;
                  }
                },
                {
                  key: "fulfillment",
                  label: "Fulfillment",
                  align: "right",
                  render: (val) => (
                    <div className={styles.inlineBar}>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${val}%`,
                            background: val >= 95 ? "var(--success)" : val >= 90 ? "var(--warning)" : "var(--danger)"
                          }}
                        />
                      </div>
                      <span className={styles.barLabel}>{val}%</span>
                    </div>
                  )
                },
                {
                  key: "onTime",
                  label: "OTD %",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      color: val >= 95 ? "var(--success-text)" : val >= 90 ? "var(--text-1)" : "var(--danger-text)"
                    }}>
                      {val}%
                    </span>
                  )
                },
                {
                  key: "returns",
                  label: "Returns",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      color: val > 4 ? "var(--danger-text)" : val > 2 ? "var(--warning-text)" : "var(--success-text)"
                    }}>
                      {val}%
                    </span>
                  )
                },
                {
                  key: "stockAvail",
                  label: "Stock Avail.",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      color: val >= 92 ? "var(--success-text)" : val >= 85 ? "var(--warning-text)" : "var(--danger-text)"
                    }}>
                      {val}%
                    </span>
                  )
                },
                { key: "revenue", label: "Revenue", align: "right" },
                {
                  key: "trend",
                  label: "Score Trend",
                  align: "right",
                  render: (val, row) => (
                    <div style={{ width: "72px", marginLeft: "auto" }}>
                      <Sparkline data={val} height={22} color={row.compositeScore >= 95 ? "var(--success)" : row.compositeScore >= 90 ? "var(--primary)" : "var(--danger)"} />
                    </div>
                  )
                },
                {
                  key: "compositeScore",
                  label: "Score",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 700,
                      fontSize: "var(--text-sm)",
                      fontVariantNumeric: "tabular-nums",
                      color: val >= 95 ? "var(--success-text)" : val >= 90 ? "var(--text-1)" : "var(--danger-text)"
                    }}>
                      {val}
                    </span>
                  )
                },
                {
                  key: "status",
                  label: "Status",
                  render: (val) => {
                    const tones = { Excellent: "success", Good: "primary", Average: "warning", "At Risk": "danger", Critical: "danger" };
                    return <Badge tone={tones[val] || "neutral"} variant="soft" dot>{val}</Badge>;
                  }
                }
              ]}
              data={filteredDistributors}
              rowKey={(row) => row.id}
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Issue Detail Drawer ───────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedIssue(null); }}
        title="Issue Details"
        description={selectedIssue?.title}
        side="right"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Dismiss</Button>
            <Button variant="primary" leadingIcon={<FiZap />}>Escalate</Button>
          </div>
        }
      >
        {selectedIssue && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <Badge tone={selectedIssue.type === "danger" ? "danger" : selectedIssue.type === "warning" ? "warning" : "primary"} variant="soft" dot>
                {selectedIssue.type === "danger" ? "Critical" : selectedIssue.type === "warning" ? "Warning" : "Informational"}
              </Badge>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{selectedIssue.time}</span>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>
                Description
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.6 }}>
                {selectedIssue.detail}
              </p>
            </div>

            {selectedIssue.dist && (
              <div>
                <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                  Distributor
                </h4>
                <div style={{
                  padding: "var(--space-4)",
                  background: "var(--surface-sunken)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontWeight: 500, color: "var(--text-1)" }}>{selectedIssue.dist}</span>
                    <Badge tone="neutral" variant="soft" size="sm">Partner</Badge>
                  </div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>
                    Review full performance history and SLA metrics in the scorecard table above.
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Recommended Actions
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {selectedIssue.type === "danger" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Schedule performance review with distributor
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Issue corrective action plan
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Escalate to regional head if no improvement in 7 days
                    </div>
                  </>
                )}
                {selectedIssue.type === "warning" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Investigate root cause of performance dip
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Send automated replenishment reminder
                    </div>
                  </>
                )}
                {selectedIssue.type === "info" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                    <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> No action required — informational update
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
