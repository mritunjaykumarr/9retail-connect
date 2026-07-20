"use client";

import React, { useState, useMemo } from "react";
import {
  FiTarget, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiCpu,
  FiChevronRight, FiSliders, FiPackage, FiTrendingUp, FiSettings, FiCheckSquare
} from "react-icons/fi";
import {
  Table, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* --- BESPOKE PROJECTION ENGINE AUTO-TARGETS MOCK DATA --- */

const mockAutoTargetLedger = [
  {
    id: "TGT-901",
    territory: "Delhi East Area",
    manager: "Vikram Malhotra (ASM)",
    period: "Q3 2026",
    historicalBaseline: "₹1.85 Cr",
    aiForecastTarget: "₹2.12 Cr",
    stretchMultiplier: "+14.5%",
    status: "Auto-Generated",
    breakdown: {
      salesOfficerCount: "12 SOs",
      distributorCount: "8 Distributors",
      seasonalityModifier: "+6.5% Monsoons & Festive",
      beatExpansionRate: "+8.0% New Retailers",
      confidenceScore: "96.4% Model Fit"
    }
  },
  {
    id: "TGT-902",
    territory: "Noida & Greater Noida",
    manager: "Sanjay Singhania (ASM)",
    period: "Q3 2026",
    historicalBaseline: "₹1.40 Cr",
    aiForecastTarget: "₹1.58 Cr",
    stretchMultiplier: "+12.8%",
    status: "Approved",
    breakdown: {
      salesOfficerCount: "9 SOs",
      distributorCount: "6 Distributors",
      seasonalityModifier: "+4.8% Summer Surge",
      beatExpansionRate: "+8.0% Outlet Addition",
      confidenceScore: "98.1% Model Fit"
    }
  },
  {
    id: "TGT-903",
    territory: "Gurgaon Commercial Hub",
    manager: "Ananya Roy (ASM)",
    period: "Q3 2026",
    historicalBaseline: "₹2.10 Cr",
    aiForecastTarget: "₹2.45 Cr",
    stretchMultiplier: "+16.6%",
    status: "Approved",
    breakdown: {
      salesOfficerCount: "14 SOs",
      distributorCount: "10 Distributors",
      seasonalityModifier: "+7.2% Premium SKU Shift",
      beatExpansionRate: "+9.4% Modern Trade Expansion",
      confidenceScore: "95.2% Model Fit"
    }
  },
  {
    id: "TGT-904",
    territory: "Faridabad & Palwal Zone",
    manager: "Rakesh Verma (ASM)",
    period: "Q3 2026",
    historicalBaseline: "₹1.10 Cr",
    aiForecastTarget: "₹1.21 Cr",
    stretchMultiplier: "+10.0%",
    status: "Pending Review",
    breakdown: {
      salesOfficerCount: "8 SOs",
      distributorCount: "5 Distributors",
      seasonalityModifier: "+3.0% Standard Run",
      beatExpansionRate: "+7.0% Rural Penetration",
      confidenceScore: "91.8% Model Fit"
    }
  }
];

const mockTargetAllocationSplit = [
  { level: "Area Sales Managers (ASMs)", allocatedVal: "₹7.36 Cr", sharePct: 45, status: "Deployed" },
  { level: "Sales Officers Daily Beats (SOs)", allocatedVal: "₹5.72 Cr", sharePct: 35, status: "Beat-Mapped" },
  { level: "Distributor Primary Quota", allocatedVal: "₹3.27 Cr", sharePct: 20, status: "Staged" }
];

export default function AutoTargetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("Q3 2026");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Generating Auto-Targets
  const [targetPeriod, setTargetPeriod] = useState("Q3 2026 (Jul - Sep)");
  const [aiAlgorithm, setAiAlgorithm] = useState("Prophet v2.4 + XGBoost Blend");
  const [stretchMultiplier, setStretchMultiplier] = useState("12% Stretch Growth Factor");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Auto-Targets Exported",
      description: "AI-generated territory sales target allocation ledger exported to CSV.",
      tone: "success"
    });
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "AI Auto-Target Pipeline Executed",
      description: `Auto-generated sales targets for ${targetPeriod} using ${aiAlgorithm}.`,
      tone: "success"
    });
  };

  const handleRowClick = (target) => {
    setSelectedTarget(target);
    setDrawerOpen(true);
  };

  // Filter Target Ledger
  const filteredTargets = useMemo(() => {
    return mockAutoTargetLedger.filter(item => {
      const matchSearch = item.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchPeriod = periodFilter === "All" || item.period === periodFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchPeriod && matchStatus;
    });
  }, [searchQuery, periodFilter, statusFilter]);

  const targetColumns = [
    {
      key: "territory",
      label: "Territory & Manager",
      sortable: true,
      render: (_, row) => (
        <div className={styles.territoryMeta}>
          <strong>{row.territory}</strong>
          <span>{row.manager} • {row.id}</span>
        </div>
      )
    },
    { key: "period", label: "Target Period" },
    { key: "historicalBaseline", label: "6-Mo Historical Baseline" },
    {
      key: "aiForecastTarget",
      label: "AI Auto-Target Value",
      render: (val) => <strong style={{ color: "var(--primary-text)" }}>{val}</strong>
    },
    {
      key: "stretchMultiplier",
      label: "Growth Lift",
      render: (val) => <strong style={{ color: "var(--success)" }}>{val}</strong>
    },
    {
      key: "status",
      label: "Target Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Approved" ? "success" : val === "Auto-Generated" ? "primary" : "warning";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Target Details">
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
            <FiTarget />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Projection Engine</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP AI</span>
            </div>
            <h2>AI Auto-Generated Sales Targets</h2>
            <p className={styles.subtitle}>
              Automated target-setting engine driven by Prophet/XGBoost demand forecasts, historical secondary sales velocity, seasonality indices, and beat expansion multipliers.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiCpu />} onClick={() => setModalOpen(true)}>
            Run Auto-Target Pipeline
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Target Schedule
          </Button>
        </div>
      </div>

      {/* --- 2. Context Filter Toolbar --- */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Target Period:</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Periods</option>
              <option value="Q3 2026">Q3 2026 (Current)</option>
              <option value="Q4 2026">Q4 2026 (Upcoming)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Approval Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Auto-Generated">Auto-Generated</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Section 1: AI Model Weighting & Engine Parameter Cards --- */}
      <div className={styles.paramCardsGrid}>
        <div className={styles.paramCard}>
          <div className={styles.cardTop}>
            <div className={styles.paramTitle}>
              <strong>Secondary Velocity Weight</strong>
              <span>Historical 6-Month Run Rate</span>
            </div>
            <Badge tone="primary" variant="soft" dot>45% Weight</Badge>
          </div>
          <div className={styles.paramMetric}>
            <strong>45.0%</strong>
            <span>Model Factor</span>
          </div>
        </div>

        <div className={styles.paramCard}>
          <div className={styles.cardTop}>
            <div className={styles.paramTitle}>
              <strong>Seasonality Index Modifier</strong>
              <span>Monsoon & Festive Lift</span>
            </div>
            <Badge tone="success" variant="soft" dot>35% Weight</Badge>
          </div>
          <div className={styles.paramMetric}>
            <strong>35.0%</strong>
            <span>Model Factor</span>
          </div>
        </div>

        <div className={styles.paramCard}>
          <div className={styles.cardTop}>
            <div className={styles.paramTitle}>
              <strong>Beat Expansion Multiplier</strong>
              <span>New Retailer Outlet Addition</span>
            </div>
            <Badge tone="warning" variant="soft" dot>20% Weight</Badge>
          </div>
          <div className={styles.paramMetric}>
            <strong>20.0%</strong>
            <span>Model Factor</span>
          </div>
        </div>
      </div>

      {/* --- Section 2: Auto Target Master Ledger Table --- */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Territory Auto-Generated Sales Targets Ledger</h3>
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search Territory, Manager or Target ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
        </div>
        <Table
          data={filteredTargets}
          columns={targetColumns}
          onRowClick={handleRowClick}
          emptyMessage="No auto-target records match selected filters."
        />
      </div>

      {/* --- Section 3: Baseline vs AI Target Chart + Allocation Breakdown --- */}
      <div className={styles.splitRow}>
        {/* Left: Historical Baseline vs AI Target BarChart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>6-Mo Historical Sales Baseline vs AI Auto-Target (₹ Cr)</h3>
          </div>
          <BarChart
            labels={["Delhi East", "Noida Zone", "Gurgaon Hub", "Faridabad Zone"]}
            series={[
              { name: "Historical 6-Mo Baseline (₹ Cr)", data: [1.85, 1.40, 2.10, 1.10], color: "var(--primary)" },
              { name: "AI Auto-Target (₹ Cr)", data: [2.12, 1.58, 2.45, 1.21], color: "var(--success)" }
            ]}
            height={280}
          />
        </div>

        {/* Right: Target Distribution Breakdown Panel */}
        <div className={styles.allocationCard}>
          <div className={styles.cardHeader}>
            <h3>Target Cascade & Role Allocation</h3>
          </div>
          <div className={styles.allocList}>
            {mockTargetAllocationSplit.map((item, idx) => (
              <div key={idx} className={styles.allocItem}>
                <div className={styles.itemHead}>
                  <strong>{item.level}</strong>
                  <Badge tone="success" variant="soft" dot>
                    {item.status}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <strong>Quota Allocated:</strong> {item.allocatedVal} ({item.sharePct}% Share)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. Target Details Drawer --- */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedTarget?.territory}
        description={`Target Period: ${selectedTarget?.period} • ${selectedTarget?.manager}`}
        side="right"
        size="md"
      >
        {selectedTarget && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Historical Baseline</span>
                <strong>{selectedTarget.historicalBaseline}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>AI Auto-Target</span>
                <strong>{selectedTarget.aiForecastTarget}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Growth Lift Multiplier</span>
                <strong>{selectedTarget.stretchMultiplier}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Approval Status</span>
                <strong>{selectedTarget.status}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Model Confidence</span>
                <strong>{selectedTarget.breakdown.confidenceScore}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Seasonality Lift</span>
                <strong>{selectedTarget.breakdown.seasonalityModifier}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Field Force Cascade & Territory Metrics
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Assigned Sales Officers:</strong> {selectedTarget.breakdown.salesOfficerCount}</div>
                <div><strong>Mapped Distributors:</strong> {selectedTarget.breakdown.distributorCount}</div>
                <div><strong>Beat Outlet Expansion Rate:</strong> {selectedTarget.breakdown.beatExpansionRate}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* --- 5. Run Auto-Target Pipeline Modal --- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Run AI Auto-Target Pipeline"
        description="Execute the Projection Engine algorithm to generate baseline sales targets across all sales territories."
        size="md"
      >
        <form onSubmit={handleGenerateSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Target Period Horizon
            </label>
            <Select
              value={targetPeriod}
              onChange={(e) => setTargetPeriod(e.target.value)}
              options={[
                { label: "Q3 2026 (Jul - Sep)", value: "Q3 2026 (Jul - Sep)" },
                { label: "Q4 2026 (Oct - Dec)", value: "Q4 2026 (Oct - Dec)" },
                { label: "Monthly (Aug 2026)", value: "Monthly (Aug 2026)" }
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                AI Forecasting Model
              </label>
              <Select
                value={aiAlgorithm}
                onChange={(e) => setAiAlgorithm(e.target.value)}
                options={[
                  { label: "Prophet v2.4 + XGBoost Blend", value: "Prophet v2.4 + XGBoost Blend" },
                  { label: "Prophet Pure Trend", value: "Prophet Pure Trend" },
                  { label: "XGBoost Machine Learning", value: "XGBoost Machine Learning" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Stretch Growth Multiplier
              </label>
              <Select
                value={stretchMultiplier}
                onChange={(e) => setStretchMultiplier(e.target.value)}
                options={[
                  { label: "12% Stretch Growth Factor", value: "12% Stretch Growth Factor" },
                  { label: "15% Aggressive Growth", value: "15% Aggressive Growth" },
                  { label: "8% Conservative Growth", value: "8% Conservative Growth" }
                ]}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Generate Auto Targets
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
