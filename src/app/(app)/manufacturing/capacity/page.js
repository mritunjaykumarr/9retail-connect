"use client";

import React, { useState, useMemo } from "react";
import {
  FiBarChart2, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiSliders, FiPackage, FiLayers, FiCpu, FiTrendingUp, FiSettings
} from "react-icons/fi";
import {
  Table, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── BESPOKE CAPACITY VS DEMAND MOCK DATA ────────────────────────── */

const mockPlantLinesCapacity = [
  {
    id: "LINE-01",
    lineName: "Line 1 - High Speed Bottling",
    category: "Beverages",
    maxWeeklyCapacity: "20,000 Cases",
    forecastDemand: "20,900 Cases",
    varianceCases: "-900 Cases (Capacity Deficit)",
    utilizationPct: 104.5,
    status: "Over Capacity Alert",
    bottleneckCause: "Canning Filler Nozzle Speed Limit",
    shiftAllocation: "3 Shifts / Day (Full Load)",
    recommendedAction: "Move 900 Cases to Off-Peak Shift C Night Run"
  },
  {
    id: "LINE-02",
    lineName: "Line 2 - Extrusion & Frying",
    category: "Snacks & Packaged",
    maxWeeklyCapacity: "16,000 Cases",
    forecastDemand: "10,800 Cases",
    varianceCases: "+5,200 Cases (Headroom Available)",
    utilizationPct: 67.5,
    status: "Optimal Run",
    bottleneckCause: "None (Smooth Operation)",
    shiftAllocation: "2 Shifts / Day",
    recommendedAction: "Absorb Q3 Snack Promotional Demand Spike"
  },
  {
    id: "LINE-03",
    lineName: "Line 3 - Soap Stamping",
    category: "Personal Care",
    maxWeeklyCapacity: "10,000 Cases",
    forecastDemand: "6,500 Cases",
    varianceCases: "+3,500 Cases (Headroom Available)",
    utilizationPct: 65.0,
    status: "Under-Utilized",
    bottleneckCause: "Die Mould Changeover Downtime",
    shiftAllocation: "2 Shifts / Day",
    recommendedAction: "Consolidate Batches into 1 Continuous 18-Hr Run"
  },
  {
    id: "LINE-04",
    lineName: "Line 4 - Chilled Packaging",
    category: "Dairy & Chill",
    maxWeeklyCapacity: "6,000 Cases",
    forecastDemand: "3,800 Cases",
    varianceCases: "+2,200 Cases (Headroom Available)",
    utilizationPct: 63.3,
    status: "Optimal Run",
    bottleneckCause: "Cold Chain Storage Limit",
    shiftAllocation: "2 Shifts / Day",
    recommendedAction: "Maintain Current Production Rhythm"
  }
];

const mockShiftLoading = [
  { shift: "Shift A (Morning 06:00-14:00)", loadCases: "18,400 Cases", capacityPct: 92, status: "High Load" },
  { shift: "Shift B (Evening 14:00-22:00)", loadCases: "16,200 Cases", capacityPct: 81, status: "Optimal Load" },
  { shift: "Shift C (Night 22:00-06:00)", loadCases: "7,400 Cases", capacityPct: 37, status: "Off-Peak Headroom" }
];

const mockRebalancingRecommendations = [
  {
    id: "REC-01",
    title: "Re-balance Line 1 Beverage Overload",
    impact: "Resolves 900 Case Deficit",
    description: "Shift 900 cases of 250ml Energy Blast from Shift A peak hours to Shift C Night Run to eliminate Line 1 capacity deficit.",
    actionText: "Apply Shift Re-allocation"
  },
  {
    id: "REC-02",
    title: "Consolidate Line 3 Soap Stamping Batches",
    impact: "Saves 45 Mins Changeover",
    description: "Combine 2 small batches of Glacial Ice Mint Soap into 1 continuous 18-hour run, reducing changeover downtime by 45 minutes.",
    actionText: "Schedule Consolidated Batch"
  },
  {
    id: "REC-03",
    title: "Weekend Overtime Shift Trigger",
    impact: "+2,500 Cases Buffer",
    description: "Trigger a 6-hour weekend overtime shift on Line 2 Extrusion to absorb unexpected Q3 retail trade demand spikes.",
    actionText: "Approve Overtime Shift"
  }
];

export default function CapacityVsDemandPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("All");
  const [horizonFilter, setHorizonFilter] = useState("Current Week (W29)");
  const [selectedLine, setSelectedLine] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Production Re-balance Modal
  const [rebalanceLine, setRebalanceLine] = useState("Line 1 - High Speed Bottling");
  const [targetShift, setTargetShift] = useState("Shift C (Night 22:00 - 06:00)");
  const [volumeTransfer, setVolumeTransfer] = useState("900 Cases");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Capacity Audit Exported",
      description: "Plant line utilization gauges & demand forecast comparison report downloaded to CSV.",
      tone: "success"
    });
  };

  const handleRebalanceSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Production Load Re-balanced",
      description: `Re-allocated ${volumeTransfer} on ${rebalanceLine} to ${targetShift}.`,
      tone: "success"
    });
  };

  const handleCardClick = (line) => {
    setSelectedLine(line);
    setDrawerOpen(true);
  };

  // Filter Plant Lines
  const filteredLines = useMemo(() => {
    return mockPlantLinesCapacity.filter(item => {
      const matchSearch = item.lineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchPlant = selectedPlant === "All" || item.category === selectedPlant;
      return matchSearch && matchPlant;
    });
  }, [searchQuery, selectedPlant]);

  const capacityColumns = [
    {
      key: "lineName",
      label: "Plant Line & Category",
      sortable: true,
      render: (_, row) => (
        <div className={styles.lineMeta}>
          <strong>{row.lineName}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    { key: "maxWeeklyCapacity", label: "Max Capacity" },
    { key: "forecastDemand", label: "Forecast Demand" },
    {
      key: "utilizationPct",
      label: "Utilization Gauge",
      render: (_, row) => (
        <div className={styles.progressWrap}>
          <span>{row.utilizationPct}%</span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min(row.utilizationPct, 100)}%`,
                background: row.utilizationPct > 100 ? "var(--danger)" : row.utilizationPct > 80 ? "var(--success)" : "var(--warning)"
              }}
            />
          </div>
        </div>
      )
    },
    {
      key: "varianceCases",
      label: "Headroom / Deficit",
      render: (val, row) => (
        <strong style={{ color: row.utilizationPct > 100 ? "var(--danger)" : "var(--success)" }}>
          {val}
        </strong>
      )
    },
    { key: "shiftAllocation", label: "Shift Schedule" },
    {
      key: "status",
      label: "Line Status",
      align: "center",
      sortable: true,
      render: (val, row) => {
        const tone = row.utilizationPct > 100 ? "danger" : row.utilizationPct > 80 ? "success" : "warning";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Line Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiBarChart2 />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manufacturing Planner</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Capacity vs Demand Optimization</h2>
            <p className={styles.subtitle}>
              Analyze maximum factory line production capacity against market demand forecasts, identify bottleneck constraints, and re-balance shift loads.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiSliders />} onClick={() => setModalOpen(true)}>
            Run Production Re-balance
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Capacity Audit
          </Button>
        </div>
      </div>

      {/* ── 2. Context Filter Toolbar ─────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Product Line Category:</label>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Categories</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks & Packaged">Snacks & Packaged</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Dairy & Chill">Dairy & Chill</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Planning Horizon:</label>
            <select
              value={horizonFilter}
              onChange={(e) => setHorizonFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="Current Week (W29)">Current Week (W29)</option>
              <option value="Next Week (W30)">Next Week (W30)</option>
              <option value="Monthly (Jul 2026)">Monthly (Jul 2026)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Section 1: Plant Line Capacity Table Section ── */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Plant Line Capacity Utilization & Headroom Ledger</h3>
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search Plant Line, Category or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
        </div>
        <Table
          data={filteredLines}
          columns={capacityColumns}
          onRowClick={handleCardClick}
          emptyMessage="No plant line records match selected filters."
        />
      </div>

      {/* ── Section 2: Comparison Chart + Shift Allocation Split ── */}
      <div className={styles.comparisonRow}>
        {/* Left: Max Capacity vs Forecast Demand BarChart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Max Weekly Production Capacity vs Forecasted Market Demand</h3>
          </div>
          <BarChart
            labels={["Line 1 (Beverages)", "Line 2 (Snacks)", "Line 3 (Personal Care)", "Line 4 (Dairy)"]}
            series={[
              { name: "Max Line Capacity (Cases)", data: [20000, 16000, 10000, 6000], color: "var(--primary)" },
              { name: "Forecast Market Demand (Cases)", data: [20900, 10800, 6500, 3800], color: "var(--warning)" }
            ]}
            height={280}
          />
        </div>

        {/* Right: Shift Capacity Utilization Panel */}
        <div className={styles.shiftAllocationCard}>
          <div className={styles.cardHeader}>
            <h3>Shift Capacity Loading & Headroom</h3>
          </div>
          <div className={styles.shiftList}>
            {mockShiftLoading.map((shift, idx) => (
              <div key={idx} className={styles.shiftItem}>
                <div className={styles.itemHead}>
                  <strong>{shift.shift}</strong>
                  <Badge tone={shift.capacityPct > 85 ? "warning" : shift.capacityPct > 60 ? "success" : "primary"} variant="soft" dot>
                    {shift.status}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <strong>Planned Load:</strong> {shift.loadCases} ({shift.capacityPct}% Utilization)
                </div>
                <div className={styles.gaugeTrack} style={{ marginTop: "4px" }}>
                  <div
                    className={styles.gaugeFill}
                    style={{
                      width: `${shift.capacityPct}%`,
                      background: shift.capacityPct > 85 ? "var(--warning)" : shift.capacityPct > 60 ? "var(--success)" : "var(--primary)"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Production Planning Recommendations ──── */}
      <div className={styles.recommendationsSection}>
        <div className={styles.sectionHeader}>
          <h3>AI & Operational Capacity Re-balancing Recommendations</h3>
        </div>
        <div className={styles.recomGrid}>
          {mockRebalancingRecommendations.map((rec) => (
            <div key={rec.id} className={styles.recomCard}>
              <div className={styles.recomHead}>
                <FiZap color="var(--warning)" />
                <h4>{rec.title}</h4>
              </div>
              <Badge tone="primary" variant="soft" dot style={{ width: "fit-content" }}>
                {rec.impact}
              </Badge>
              <p>{rec.description}</p>
              <div className={styles.recomAction}>
                <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                  {rec.actionText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Line Details Drawer ─────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedLine?.lineName}
        description={`Line ID: ${selectedLine?.id} • Category: ${selectedLine?.category}`}
        side="right"
        size="md"
      >
        {selectedLine && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Max Weekly Capacity</span>
                <strong>{selectedLine.maxWeeklyCapacity}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Forecasted Demand</span>
                <strong>{selectedLine.forecastDemand}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Utilization Rate</span>
                <strong style={{ color: selectedLine.utilizationPct > 100 ? "var(--danger)" : "var(--success)" }}>
                  {selectedLine.utilizationPct}%
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Variance</span>
                <strong>{selectedLine.varianceCases}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Shift Schedule</span>
                <strong>{selectedLine.shiftAllocation}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Status</span>
                <strong>{selectedLine.status}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Bottleneck Cause & Recommended Optimization
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Primary Bottleneck Cause:</strong> {selectedLine.bottleneckCause}</div>
                <div><strong>Recommended Action:</strong> {selectedLine.recommendedAction}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 5. Run Production Re-balance Modal ────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Run Production Load Re-balance"
        description="Re-allocate production batch loads across plant lines and shift schedules to resolve capacity bottlenecks."
        size="md"
      >
        <form onSubmit={handleRebalanceSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Source Plant Line
            </label>
            <Select
              value={rebalanceLine}
              onChange={(e) => setRebalanceLine(e.target.value)}
              options={[
                { label: "Line 1 - High Speed Bottling", value: "Line 1 - High Speed Bottling" },
                { label: "Line 2 - Extrusion & Frying", value: "Line 2 - Extrusion & Frying" },
                { label: "Line 3 - Soap Stamping", value: "Line 3 - Soap Stamping" }
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Target Shift Allocation
              </label>
              <Select
                value={targetShift}
                onChange={(e) => setTargetShift(e.target.value)}
                options={[
                  { label: "Shift C (Night 22:00 - 06:00)", value: "Shift C (Night 22:00 - 06:00)" },
                  { label: "Shift B (Evening 14:00 - 22:00)", value: "Shift B (Evening 14:00 - 22:00)" },
                  { label: "Weekend Overtime Shift", value: "Weekend Overtime Shift" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Volume to Re-allocate
              </label>
              <Input
                placeholder="e.g. 900 Cases"
                value={volumeTransfer}
                onChange={(e) => setVolumeTransfer(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Apply Re-balance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
