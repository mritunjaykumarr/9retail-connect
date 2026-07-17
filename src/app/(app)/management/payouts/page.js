"use client";

import React, { useState, useMemo } from "react";
import {
  FiDollarSign, FiUsers, FiCheckCircle, FiClock,
  FiSearch, FiDownload, FiRefreshCw, FiCalendar,
  FiPercent, FiActivity, FiChevronRight, FiAward,
  FiArrowUpRight, FiArrowDownRight, FiAlertTriangle,
  FiZap, FiSend, FiFileText, FiTrendingUp, FiTarget
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

// Payout disbursement trend (12 months)
const monthLabels = ["Jul'24", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan'25", "Feb", "Mar", "Apr", "May", "Jun"];
const payoutTrend = [
  { name: "Payouts Disbursed (₹L)", data: [18.5, 21.2, 19.8, 24.5, 26.0, 32.5, 28.0, 22.5, 25.8, 27.5, 30.2, 34.8], color: "var(--primary)" },
  { name: "Earned (Eligible) (₹L)", data: [22.0, 24.5, 23.0, 28.0, 30.5, 36.0, 32.0, 26.0, 29.5, 31.0, 34.0, 38.2], color: "var(--success)" },
];

// Zone-wise payout bar chart
const zoneLabels = ["North", "South", "East", "West", "Central"];
const zoneSeries = [
  { name: "Earned (₹L)", data: [12.5, 10.8, 6.2, 8.4, 5.2], color: "var(--success)" },
  { name: "Disbursed (₹L)", data: [11.2, 10.1, 5.0, 7.8, 4.6], color: "var(--primary)" },
];

// Incentive programme cards
const programmes = [
  {
    id: "volume", label: "Volume Slab Bonus", icon: <FiTarget />,
    totalBudget: "₹18.5L", disbursed: "₹14.2L", pctUsed: 77,
    reps: 42, qualifiedPct: "78%", tone: "primary"
  },
  {
    id: "beat", label: "Beat Coverage Incentive", icon: <FiActivity />,
    totalBudget: "₹8.2L", disbursed: "₹6.8L", pctUsed: 83,
    reps: 38, qualifiedPct: "85%", tone: "success"
  },
  {
    id: "new_outlet", label: "New Outlet Activation", icon: <FiUsers />,
    totalBudget: "₹5.5L", disbursed: "₹3.2L", pctUsed: 58,
    reps: 22, qualifiedPct: "52%", tone: "warning"
  },
];

// Payout split donut
const payoutSplit = [
  { label: "Volume Slab Bonus", value: 14.2 },
  { label: "Beat Coverage", value: 6.8 },
  { label: "New Outlet Activation", value: 3.2 },
  { label: "Ad-hoc & Spot Awards", value: 2.6 },
];

// Top earners ranked
const topEarners = [
  { rank: 1, name: "Aman Verma", territory: "Delhi East", earned: "₹48,500", achievement: "128%", programme: "Volume Slab" },
  { rank: 2, name: "Meera Reddy", territory: "Hyderabad South", earned: "₹42,200", achievement: "122%", programme: "Beat Coverage" },
  { rank: 3, name: "Ravi Shankar", territory: "Bangalore North", earned: "₹38,800", achievement: "118%", programme: "Volume Slab" },
  { rank: 4, name: "Priya Nair", territory: "Chennai Central", earned: "₹35,100", achievement: "112%", programme: "New Outlet" },
  { rank: 5, name: "Kunal Verma", territory: "Delhi Central", earned: "₹32,500", achievement: "108%", programme: "Volume Slab" },
];

// Zone disbursement progress
const zoneDisbursement = [
  { label: "North Zone", disbursed: 90, total: "₹12.5L", paid: "₹11.2L", color: "var(--success)" },
  { label: "South Zone", disbursed: 94, total: "₹10.8L", paid: "₹10.1L", color: "var(--success)" },
  { label: "West Zone", disbursed: 93, total: "₹8.4L", paid: "₹7.8L", color: "var(--success)" },
  { label: "East Zone", disbursed: 81, total: "₹6.2L", paid: "₹5.0L", color: "var(--warning)" },
  { label: "Central Zone", disbursed: 88, total: "₹5.2L", paid: "₹4.6L", color: "var(--primary)" },
];

// Pending actions
const pendingActions = [
  { id: 1, type: "danger", title: "₹1.2L pending for East Zone — 18 reps awaiting payout", detail: "Q2 volume slab payouts for Bihar + Jharkhand reps not processed. Finance approval pending since July 8.", time: "3h ago" },
  { id: 2, type: "warning", title: "Kunal Verma disputed payout calculation (₹4,200)", detail: "Rep claims 3 additional outlets activated in June not counted. Territory manager reviewing.", time: "5h ago" },
  { id: 3, type: "warning", title: "New Outlet programme at only 52% qualification", detail: "22 of 42 reps qualified. Consider revising slab thresholds or extending qualification period.", time: "1d ago" },
  { id: 4, type: "info", title: "July payout cycle opens on 20th — 5 days to close June", detail: "Ensure all June achievement data finalized. Auto-calculation scheduled for July 18.", time: "1d ago" },
  { id: 5, type: "success", title: "South Zone: 94% payouts disbursed — best completion rate", detail: "All 38 eligible reps paid within SLA. Regional head Meera Reddy commended.", time: "2d ago" },
  { id: 6, type: "info", title: "Spot award budget: ₹1.8L remaining for Q3", detail: "₹2.6L of ₹4.4L utilized. Available for manager-discretionary rewards.", time: "3d ago" },
];

// Full rep payout ledger
const payoutLedger = [
  { id: "REP-001", name: "Aman Verma", territory: "Delhi East", zone: "North", programme: "Volume Slab", target: "₹8.5L", achieved: "₹10.9L", achievement: 128, earned: "₹48,500", disbursed: "₹48,500", paidOn: "05 Jul", status: "Paid", trend: [85, 95, 105, 115, 122, 128] },
  { id: "REP-005", name: "Meera Reddy", territory: "Hyderabad South", zone: "South", programme: "Beat Coverage", target: "92%", achieved: "98%", achievement: 122, earned: "₹42,200", disbursed: "₹42,200", paidOn: "05 Jul", status: "Paid", trend: [88, 95, 100, 108, 115, 122] },
  { id: "REP-008", name: "Ravi Shankar", territory: "Bangalore North", zone: "South", programme: "Volume Slab", target: "₹7.2L", achieved: "₹8.5L", achievement: 118, earned: "₹38,800", disbursed: "₹38,800", paidOn: "06 Jul", status: "Paid", trend: [80, 88, 95, 102, 110, 118] },
  { id: "REP-003", name: "Priya Nair", territory: "Chennai Central", zone: "South", programme: "New Outlet", target: "15", achieved: "18", achievement: 120, earned: "₹35,100", disbursed: "₹35,100", paidOn: "06 Jul", status: "Paid", trend: [60, 72, 85, 98, 110, 120] },
  { id: "REP-002", name: "Kunal Verma", territory: "Delhi Central", zone: "North", programme: "Volume Slab", target: "₹6.8L", achieved: "₹7.3L", achievement: 108, earned: "₹32,500", disbursed: "₹28,300", paidOn: "—", status: "Disputed", trend: [92, 96, 100, 104, 106, 108] },
  { id: "REP-010", name: "Vikram Singh", territory: "Mumbai West", zone: "West", programme: "Beat Coverage", target: "90%", achieved: "94%", achievement: 104, earned: "₹28,000", disbursed: "₹28,000", paidOn: "07 Jul", status: "Paid", trend: [78, 82, 88, 92, 98, 104] },
  { id: "REP-011", name: "Rohit Jain", territory: "Lucknow East", zone: "East", programme: "Volume Slab", target: "₹5.0L", achieved: "₹4.8L", achievement: 96, earned: "₹18,200", disbursed: "—", paidOn: "—", status: "Pending", trend: [80, 84, 88, 92, 94, 96] },
  { id: "REP-007", name: "Anita Sharma", territory: "Nashik Hub", zone: "West", programme: "New Outlet", target: "12", achieved: "10", achievement: 83, earned: "₹12,500", disbursed: "₹12,500", paidOn: "08 Jul", status: "Paid", trend: [50, 58, 65, 72, 78, 83] },
  { id: "REP-004", name: "Suresh Kumar", territory: "Gurugram Wholesale", zone: "North", programme: "Beat Coverage", target: "88%", achieved: "72%", achievement: 82, earned: "₹0", disbursed: "₹0", paidOn: "—", status: "Not Qualified", trend: [90, 85, 80, 78, 76, 82] },
  { id: "REP-012", name: "Deepak Shukla", territory: "Indore Central", zone: "Central", programme: "Volume Slab", target: "₹4.5L", achieved: "₹5.1L", achievement: 113, earned: "₹24,800", disbursed: "—", paidOn: "—", status: "Processing", trend: [82, 88, 94, 100, 108, 113] },
];

/* ─── PAGE COMPONENT ─────────────────────────────────────────── */

export default function PayoutsPage() {
  const [selectedProgramme, setSelectedProgramme] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const filteredLedger = useMemo(() =>
    payoutLedger.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.territory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchProg = selectedProgramme === "all" || r.programme.toLowerCase().includes(selectedProgramme);
      return matchSearch && matchStatus && matchProg;
    }),
    [searchQuery, statusFilter, selectedProgramme]
  );

  const statusOptions = ["All", "Paid", "Processing", "Pending", "Disputed", "Not Qualified"];

  function openActionDetail(action) {
    setSelectedAction(action);
    setDrawerOpen(true);
  }

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiDollarSign />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Incentive Payouts</h2>
            <p className={styles.subtitle}>Track incentive programme budgets, rep-level earnings, disbursement status, and payout cycle completion across all zones.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Tooltip content="Run payout calculation for current cycle">
            <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />}>
              Recalculate
            </Button>
          </Tooltip>
          <Tooltip content="Process pending payouts">
            <Button variant="primary" size="sm" leadingIcon={<FiSend />}>
              Disburse
            </Button>
          </Tooltip>
          <Tooltip content="Export payout ledger">
            <Button variant="secondary" size="sm" leadingIcon={<FiDownload />}>
              Export
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Payout Cycle Banner ────────────────────────── */}
      <div className={styles.cycleBanner}>
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--blue"]}`}>
            <FiCalendar />
          </div>
          <div className={styles.bannerText}>
            <strong>June 2025 Cycle</strong>
            <span>Closing deadline: Jul 20</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--green"]}`}>
            <FiDollarSign />
          </div>
          <div className={styles.bannerText}>
            <strong>₹34.8L Disbursed</strong>
            <span>91% of ₹38.2L earned</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--amber"]}`}>
            <FiClock />
          </div>
          <div className={styles.bannerText}>
            <strong>₹3.4L Pending</strong>
            <span>22 reps awaiting payout</span>
          </div>
        </div>
        <div className={styles.bannerSep} />
        <div className={styles.bannerItem}>
          <div className={`${styles.bannerIcon} ${styles["bannerIcon--red"]}`}>
            <FiAlertTriangle />
          </div>
          <div className={styles.bannerText}>
            <strong>1 Dispute Open</strong>
            <span>₹4,200 under review</span>
          </div>
        </div>
      </div>

      {/* ── Programme Cards ───────────────────────────── */}
      <div className={styles.programmeGrid}>
        {programmes.map(prog => (
          <div
            key={prog.id}
            className={`${styles.progCard} ${selectedProgramme === prog.id ? styles["progCard--active"] : ""}`}
            onClick={() => setSelectedProgramme(selectedProgramme === prog.id ? "all" : prog.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setSelectedProgramme(selectedProgramme === prog.id ? "all" : prog.id)}
          >
            <div className={styles.progHeader}>
              <div className={styles.progLabel}>
                {prog.icon}
                {prog.label}
              </div>
              <Badge tone={prog.tone} variant="soft" size="sm">
                {prog.reps} reps
              </Badge>
            </div>
            <div className={styles.progValue}>
              {prog.disbursed} <span>of {prog.totalBudget}</span>
            </div>
            <div className={styles.progBar}>
              <div className={styles.progBarLabel}>
                <span>Budget utilization</span>
                <span>{prog.pctUsed}%</span>
              </div>
              <div className={styles.progBarTrack}>
                <div
                  className={styles.progBarFill}
                  style={{
                    width: `${prog.pctUsed}%`,
                    background: prog.pctUsed >= 80 ? "var(--success)" : prog.pctUsed >= 60 ? "var(--primary)" : "var(--warning)"
                  }}
                />
              </div>
            </div>
            <div className={styles.progMeta}>
              <div className={styles.progMetaItem}>
                <span>Qualified</span>
                <span>{prog.qualifiedPct}</span>
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
                  <h3 className={styles.cardTitle}>Earned vs Disbursed (12 Months)</h3>
                  <p className={styles.cardDesc}>Monthly incentive earnings compared to actual payouts processed.</p>
                </div>
              </div>
              <div style={{ height: "280px" }}>
                <AreaChart
                  series={payoutTrend}
                  categories={monthLabels}
                  height={280}
                />
              </div>
            </div>
          </Card>

          <div className={styles.sidePanels}>
            {/* Payout Split Donut */}
            <Card>
              <div className={styles.cardPad}>
                <h3 className={styles.cardTitle}>Payout by Programme</h3>
                <p className={styles.cardDesc}>Distribution of disbursed incentives across programmes.</p>
                <div className={styles.donutLayout}>
                  <Donut
                    data={payoutSplit}
                    centerValue="₹26.8L"
                    centerLabel="Disbursed"
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
                label="Avg. Earning / Rep"
                value="₹28.4K"
                delta={8.2}
                deltaLabel="vs Q1"
                deltaTone="positive"
                icon={<FiTrendingUp />}
              />
              <StatCard
                label="Payout SLA Met"
                value="94%"
                delta={2.1}
                deltaLabel="improvement"
                deltaTone="positive"
                icon={<FiCheckCircle />}
              />
            </div>
          </div>
        </div>

        {/* ── Middle Grid: Earners + Zone Progress + Actions ─ */}
        <div className={styles.middleGrid}>
          {/* Top Earners */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Top Earners</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Highest incentive payouts this cycle.</p>
                </div>
                <Badge tone="success" variant="soft" size="sm">
                  <FiAward style={{ marginRight: 4 }} /> Leaderboard
                </Badge>
              </div>
              <div className={styles.earnerList}>
                {topEarners.map(e => {
                  const rankClass = e.rank === 1 ? "gold" : e.rank === 2 ? "silver" : e.rank === 3 ? "bronze" : "default";
                  return (
                    <div key={e.rank} className={styles.earnerItem}>
                      <div className={`${styles.earnerRank} ${styles[`earnerRank--${rankClass}`]}`}>
                        #{e.rank}
                      </div>
                      <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${e.name}`} size="sm" />
                      <div className={styles.earnerInfo}>
                        <strong>{e.name}</strong>
                        <span>{e.territory} • {e.programme} • {e.achievement} ach.</span>
                      </div>
                      <span className={styles.earnerAmount} style={{ color: "var(--success-text)" }}>
                        {e.earned}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Zone Disbursement Progress */}
          <Card>
            <div className={styles.cardPad}>
              <h3 className={styles.cardTitle}>Disbursement by Zone</h3>
              <p className={styles.cardDesc}>Percentage of earned incentives actually paid out per zone.</p>
              <div className={styles.zoneList}>
                {zoneDisbursement.map((z, i) => (
                  <div key={i} className={styles.zoneRow}>
                    <div className={styles.zoneLabel}>
                      <span>{z.label}</span>
                      <span style={{ color: z.disbursed >= 90 ? "var(--success-text)" : z.disbursed >= 80 ? "var(--warning-text)" : "var(--danger-text)" }}>
                        {z.paid} / {z.total} ({z.disbursed}%)
                      </span>
                    </div>
                    <div className={styles.zoneTrack}>
                      <div
                        className={styles.zoneFill}
                        style={{ width: `${z.disbursed}%`, background: z.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Pending Actions */}
          <Card>
            <div className={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <div>
                  <h3 className={styles.cardTitle}>Pending Actions</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Disputes, approvals, and cycle updates.</p>
                </div>
                <Badge tone="danger" variant="soft" size="sm">
                  {pendingActions.filter(a => a.type === "danger").length} urgent
                </Badge>
              </div>
              <div className={styles.actionList}>
                {pendingActions.map(action => (
                  <div
                    key={action.id}
                    className={styles.actionItem}
                    onClick={() => openActionDetail(action)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && openActionDetail(action)}
                  >
                    <div className={`${styles.actionIcon} ${styles[`actionIcon--${action.type}`]}`}>
                      {action.type === "danger" ? <FiAlertTriangle /> : action.type === "warning" ? <FiClock /> : action.type === "success" ? <FiCheckCircle /> : <FiZap />}
                    </div>
                    <div className={styles.actionBody}>
                      <strong>{action.title}</strong>
                      <span>{action.time}</span>
                    </div>
                    <FiChevronRight style={{ color: "var(--text-3)", flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Zone Payout Bar Chart ───────────────────── */}
        <Card>
          <div className={styles.cardPad}>
            <h3 className={styles.cardTitle}>Zone-wise Earned vs Disbursed</h3>
            <p className={styles.cardDesc}>Earned incentive pool versus actual payout per zone — gap indicates pending disbursement.</p>
            <BarChart
              categories={zoneLabels}
              series={zoneSeries}
              height={240}
            />
          </div>
        </Card>

        {/* ── Full Payout Ledger ──────────────────────── */}
        <Card>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.cardHeaderIcon}>
                <FiFileText />
              </div>
              <div>
                <h3>Payout Ledger</h3>
                <div className={styles.cardSubtitle}>
                  Rep-level target achievement, earnings, disbursement status, and payment tracking.
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
                      placeholder="Search rep or territory..."
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
                  label: "Sales Rep",
                  render: (_, row) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`} fallback={row.name.charAt(0)} size="md" />
                      <div>
                        <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.territory}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: "zone",
                  label: "Zone",
                  render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
                },
                {
                  key: "programme",
                  label: "Programme",
                  render: (val) => {
                    const tones = { "Volume Slab": "primary", "Beat Coverage": "success", "New Outlet": "warning" };
                    return <Badge tone={tones[val] || "neutral"} variant="soft" size="sm">{val}</Badge>;
                  }
                },
                {
                  key: "achievement",
                  label: "Achievement",
                  align: "right",
                  render: (val) => (
                    <div className={styles.inlineBar}>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${Math.min(val, 130)}%`,
                            maxWidth: "100%",
                            background: val >= 100 ? "var(--success)" : val >= 85 ? "var(--warning)" : "var(--danger)"
                          }}
                        />
                      </div>
                      <span className={styles.barLabel}>{val}%</span>
                    </div>
                  )
                },
                { key: "earned", label: "Earned", align: "right" },
                {
                  key: "disbursed",
                  label: "Disbursed",
                  align: "right",
                  render: (val) => (
                    <span style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      color: val === "—" ? "var(--text-3)" : val === "₹0" ? "var(--text-3)" : "var(--text-1)"
                    }}>
                      {val}
                    </span>
                  )
                },
                {
                  key: "paidOn",
                  label: "Paid On",
                  render: (val) => (
                    <span style={{ fontSize: "var(--text-sm)", color: val === "—" ? "var(--text-3)" : "var(--text-2)" }}>
                      {val}
                    </span>
                  )
                },
                {
                  key: "trend",
                  label: "Achievement Trend",
                  align: "right",
                  render: (val, row) => (
                    <div style={{ width: "72px", marginLeft: "auto" }}>
                      <Sparkline data={val} height={22} color={row.achievement >= 100 ? "var(--success)" : row.achievement >= 85 ? "var(--primary)" : "var(--danger)"} />
                    </div>
                  )
                },
                {
                  key: "status",
                  label: "Status",
                  render: (val) => {
                    const tones = { Paid: "success", Processing: "primary", Pending: "warning", Disputed: "danger", "Not Qualified": "neutral" };
                    return <Badge tone={tones[val] || "neutral"} variant="soft" dot>{val}</Badge>;
                  }
                }
              ]}
              data={filteredLedger}
              rowKey={(row) => row.id}
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Action Detail Drawer ──────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedAction(null); }}
        title="Payout Action"
        description={selectedAction?.title}
        side="right"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Dismiss</Button>
            <Button variant="primary" leadingIcon={<FiSend />}>Process</Button>
          </div>
        }
      >
        {selectedAction && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <Badge
                tone={selectedAction.type === "danger" ? "danger" : selectedAction.type === "warning" ? "warning" : selectedAction.type === "success" ? "success" : "primary"}
                variant="soft" dot
              >
                {selectedAction.type === "danger" ? "Urgent" : selectedAction.type === "warning" ? "Needs Attention" : selectedAction.type === "success" ? "Positive" : "Informational"}
              </Badge>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{selectedAction.time}</span>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>
                Details
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.6 }}>
                {selectedAction.detail}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Recommended Actions
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {selectedAction.type === "danger" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Fast-track finance approval for pending payouts
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Notify affected reps with expected payment date
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Escalate to Finance Head if not cleared by Jul 18
                    </div>
                  </>
                )}
                {selectedAction.type === "warning" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Review disputed achievement data with territory manager
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                      <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> Cross-verify outlet activation records in DMS
                    </div>
                  </>
                )}
                {(selectedAction.type === "info" || selectedAction.type === "success") && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-1)" }}>
                    <FiChevronRight size={14} style={{ color: "var(--primary)" }} /> No immediate action — for awareness
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
