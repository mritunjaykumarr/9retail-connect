"use client";

import React, { useState, useMemo } from "react";
import {
  FiCalendar, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiPlay,
  FiChevronRight, FiSliders, FiPackage, FiLayers, FiAlertTriangle, FiCheckSquare, FiTool
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Button, Drawer, Modal, Tabs, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH PRODUCTION SCHEDULE MOCK DATA ───────────────────────── */

const mockProductionBatches = [
  {
    id: "BATCH-801",
    skuName: "Sparkle Water 1L Case",
    category: "Beverages",
    plantLine: "Line 1 - High Speed Bottling",
    shift: "Shift A (06:00 - 14:00)",
    targetQty: "4,500 Cases",
    producedQty: "3,800 Cases",
    completionRate: 84,
    startTime: "06:00 AM Today",
    endTime: "02:00 PM Today",
    operator: "Rajesh Kumar (Lead)",
    status: "In Production",
    telemetry: {
      lineSpeed: "120 Cases / Hr",
      qualityPassRate: "99.4%",
      downtimeMinutes: "12 Mins (Bottle Jam)",
      changeoverTime: "25 Mins Prior",
      bomStatus: "100% Issued to Floor"
    }
  },
  {
    id: "BATCH-802",
    skuName: "Crisp Chips Classic 50g Case",
    category: "Snacks & Packaged",
    plantLine: "Line 2 - Extrusion & Frying",
    shift: "Shift A (06:00 - 14:00)",
    targetQty: "3,500 Cases",
    producedQty: "3,500 Cases",
    completionRate: 100,
    startTime: "06:00 AM Today",
    endTime: "01:45 PM Today",
    operator: "Suresh Sharma (Lead)",
    status: "Completed",
    telemetry: {
      lineSpeed: "150 Cases / Hr",
      qualityPassRate: "99.8%",
      downtimeMinutes: "0 Mins",
      changeoverTime: "15 Mins Prior",
      bomStatus: "Reconciled Cleanly"
    }
  },
  {
    id: "BATCH-803",
    skuName: "Glacial Ice Mint Soap 15g Case",
    category: "Personal Care",
    plantLine: "Line 3 - Soap Stamping",
    shift: "Shift B (14:00 - 22:00)",
    targetQty: "3,000 Cases",
    producedQty: "0 Cases",
    completionRate: 0,
    startTime: "02:00 PM Today",
    endTime: "10:00 PM Today",
    operator: "Amit Verma (Lead)",
    status: "Scheduled",
    telemetry: {
      lineSpeed: "100 Cases / Hr (Target)",
      qualityPassRate: "Pending Run",
      downtimeMinutes: "N/A",
      changeoverTime: "In Progress (Dies Cleaned)",
      bomStatus: "Staged at Line 3 Bay"
    }
  },
  {
    id: "BATCH-804",
    skuName: "Fresh Butter 500g Pack",
    category: "Dairy & Chill",
    plantLine: "Line 4 - Chilled Packaging",
    shift: "Shift A (06:00 - 14:00)",
    targetQty: "2,000 Cases",
    producedQty: "2,000 Cases",
    completionRate: 100,
    startTime: "06:00 AM Today",
    endTime: "01:30 PM Today",
    operator: "Manoj Yadav (Lead)",
    status: "Completed",
    telemetry: {
      lineSpeed: "110 Cases / Hr",
      qualityPassRate: "100.0%",
      downtimeMinutes: "0 Mins",
      changeoverTime: "10 Mins Prior",
      bomStatus: "Reconciled Cleanly"
    }
  },
  {
    id: "BATCH-805",
    skuName: "Energy Blast 250ml Pack",
    category: "Beverages",
    plantLine: "Line 1 - High Speed Bottling",
    shift: "Shift B (14:00 - 22:00)",
    targetQty: "2,500 Cases",
    producedQty: "0 Cases",
    completionRate: 0,
    startTime: "02:30 PM Today",
    endTime: "10:30 PM Today",
    operator: "Vikas Singh (Lead)",
    status: "Changeover Delay",
    telemetry: {
      lineSpeed: "130 Cases / Hr (Target)",
      qualityPassRate: "Pending Run",
      downtimeMinutes: "35 Mins (Canning Line Maintenance)",
      changeoverTime: "Delayed by 35 Mins",
      bomStatus: "Aluminium Cans Shortage Alert"
    }
  }
];

const mockShiftTimetable = [
  { id: "SHIFT-A", shiftName: "Shift A (Morning)", timing: "06:00 AM - 02:00 PM", plannedBatches: 3, outputCases: "9,000 Cases", oeeRating: "92.4%", status: "Active" },
  { id: "SHIFT-B", shiftName: "Shift B (Evening)", timing: "02:00 PM - 10:00 PM", plannedBatches: 2, outputCases: "5,500 Cases", oeeRating: "88.6%", status: "Upcoming" },
  { id: "SHIFT-C", shiftName: "Shift C (Night Maintenance)", timing: "10:00 PM - 06:00 AM", plannedBatches: 1, outputCases: "2,000 Cases", oeeRating: "94.0%", status: "Scheduled" }
];

const mockLineDowntimeLogs = [
  { id: "DT-301", line: "Line 1 - High Speed Bottling", reason: "Filler Nozzle Jam & Sensor Recalibration", duration: "12 Mins", technician: "Deepak Verma", status: "Resolved" },
  { id: "DT-302", line: "Line 1 - High Speed Bottling", reason: "Canning Seamer Mechanical Alignment", duration: "35 Mins", technician: "Karan Johar", status: "In Progress" },
  { id: "DT-303", line: "Line 3 - Soap Stamping", reason: "Die Mould Changeover & Washdown", duration: "25 Mins", technician: "Rakesh Gupta", status: "Resolved" }
];

export default function ProductionSchedulePage() {
  const [activeTab, setActiveTab] = useState("active_batches");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLine, setSelectedLine] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Scheduling New Batch
  const [newSku, setNewSku] = useState("Sparkle Water 1L Case");
  const [newLine, setNewLine] = useState("Line 1 - High Speed Bottling");
  const [newShift, setNewShift] = useState("Shift B (14:00 - 22:00)");
  const [newQty, setNewQty] = useState("");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Schedule Exported",
      description: "Factory shift production timetable exported to CSV.",
      tone: "success"
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Batch Scheduled Successfully",
      description: `New Production Batch for ${newSku} allocated to ${newLine}.`,
      tone: "success"
    });
    setNewQty("");
  };

  // Filter Schedule Data
  const filteredBatches = useMemo(() => {
    return mockProductionBatches.filter(item => {
      const matchSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plantLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchLine = selectedLine === "All" || item.plantLine.includes(selectedLine);
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchLine && matchStatus;
    });
  }, [searchQuery, selectedLine, statusFilter]);

  const handleRowClick = (batch) => {
    setSelectedBatch(batch);
    setDrawerOpen(true);
  };

  const batchColumns = [
    {
      key: "id",
      label: "Batch Run ID & SKU",
      sortable: true,
      render: (_, row) => (
        <div className={styles.batchMeta}>
          <strong>{row.id}</strong>
          <span>{row.skuName} • {row.category}</span>
        </div>
      )
    },
    {
      key: "plantLine",
      label: "Plant Line & Shift",
      sortable: true,
      render: (_, row) => (
        <div className={styles.lineMeta}>
          <strong>{row.plantLine}</strong>
          <span>{row.shift}</span>
        </div>
      )
    },
    { key: "targetQty", label: "Target Batch Qty" },
    { key: "producedQty", label: "Produced Qty" },
    {
      key: "completionRate",
      label: "Batch Progress",
      render: (_, row) => (
        <div className={styles.progressWrap}>
          <span>{row.completionRate}% Done</span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${row.completionRate}%`,
                background: row.completionRate === 100 ? "var(--success)" : row.completionRate > 0 ? "var(--primary)" : "var(--text-3)"
              }}
            />
          </div>
        </div>
      )
    },
    { key: "operator", label: "Line Supervisor" },
    {
      key: "status",
      label: "Batch Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Completed" ? "success" : val === "In Production" ? "primary" : val === "Scheduled" ? "warning" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Batch Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const shiftColumns = [
    {
      key: "shiftName",
      label: "Shift Name & Hours",
      render: (_, row) => (
        <div className={styles.lineMeta}>
          <strong>{row.shiftName}</strong>
          <span>{row.timing}</span>
        </div>
      )
    },
    { key: "plannedBatches", label: "Planned Batches" },
    { key: "outputCases", label: "Target Output", render: (val) => <strong>{val}</strong> },
    { key: "oeeRating", label: "Expected OEE", render: (val) => <strong style={{ color: "var(--success)" }}>{val}</strong> },
    {
      key: "status",
      label: "Shift Status",
      render: (val) => (
        <Badge tone={val === "Active" ? "success" : "primary"} variant="soft" dot>
          {val}
        </Badge>
      )
    }
  ];

  const downtimeColumns = [
    {
      key: "line",
      label: "Plant Line & Incident",
      render: (_, row) => (
        <div className={styles.downtimeMeta}>
          <strong>{row.line}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    { key: "reason", label: "Stoppage Cause" },
    { key: "duration", label: "Downtime Duration", render: (val) => <strong style={{ color: "var(--danger)" }}>{val}</strong> },
    { key: "technician", label: "Assigned Technician" },
    {
      key: "status",
      label: "Resolution",
      render: (val) => (
        <Badge tone={val === "Resolved" ? "success" : "warning"} variant="soft" dot>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiCalendar />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manufacturing Planner</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Factory Production Schedule</h2>
            <p className={styles.subtitle}>
              Monitor real-time factory line execution, active batch runs, shift allocations, line speeds, and batch completion rates across manufacturing lines.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiPlay />} onClick={() => setModalOpen(true)}>
            Schedule New Batch
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Shift Timetable
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Plant Line:</label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Plant Lines</option>
              <option value="Line 1">Line 1 - Bottling</option>
              <option value="Line 2">Line 2 - Extrusion</option>
              <option value="Line 3">Line 3 - Soap Stamping</option>
              <option value="Line 4">Line 4 - Chilled Packaging</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Batch Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="In Production">In Production</option>
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Changeover Delay">Changeover Delay</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Scheduled Batches"
          value="5 Batches"
          delta={1}
          deltaLabel="shift A & B runs"
          deltaTone="positive"
          icon={<FiCalendar color="var(--primary)" />}
        />
        <StatCard
          label="Active Production Output"
          value="12,800 Cases"
          deltaLabel="9,300 cases produced today"
          deltaTone="positive"
          icon={<FiPackage color="var(--success)" />}
        />
        <StatCard
          label="Line Capacity Utilization"
          value="91.4%"
          deltaLabel="Optimal 3-shift OEE"
          deltaTone="positive"
          icon={<FiZap color="var(--warning)" />}
        />
        <StatCard
          label="On-Time Batch Completion"
          value="96.8%"
          deltaLabel="Minimal changeover delay"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "active_batches", label: "Active Factory Batches" },
          { value: "shift_timetable", label: "Plant Line Shift Timetable" },
          { value: "downtime_log", label: "Line Maintenance & Stoppages" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid (Stacked Full Width) ──────── */}
      {activeTab === "active_batches" && (
        <div className={styles.mainLayout}>
          {/* Top: Batch Schedule Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Active Factory Production Batches</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search Batch ID, SKU, Line or Supervisor..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredBatches}
              columns={batchColumns}
              onRowClick={handleRowClick}
              emptyMessage="No batch schedule records match selected filters."
            />
          </div>

          {/* Bottom: Hourly Production Output BarChart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Hourly Plant Output vs Scheduled Target</h3>
            </div>
            <BarChart
              labels={["06:00 - 08:00", "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"]}
              series={[
                { name: "Actual Output (Cases)", data: [2100, 2450, 2300, 2450, 1800, 1750], color: "var(--primary)" },
                { name: "Target Output (Cases)", data: [2200, 2200, 2200, 2200, 2000, 2000], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "shift_timetable" && (
        <div className={styles.mainLayout}>
          {/* Top: Shift Timetable Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Shift Allocation & OEE Rating Summary</h3>
            </div>
            <Table
              data={mockShiftTimetable}
              columns={shiftColumns}
              emptyMessage="No shift records found."
            />
          </div>

          {/* Bottom: Shift Output Distribution Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Daily Case Production Share by Shift</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Shift A (Morning)", value: 9000 },
                  { label: "Shift B (Evening)", value: 5500 },
                  { label: "Shift C (Night)", value: 2000 }
                ]}
                colors={["var(--primary)", "var(--success)", "var(--warning)"]}
                innerRadius={0.68}
                centerLabel="Total Planned"
                centerSubLabel="16,500 Cases"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "downtime_log" && (
        <div className={styles.mainLayout}>
          {/* Top: Downtime Logs Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Plant Line Maintenance & Stoppages Log</h3>
            </div>
            <Table
              data={mockLineDowntimeLogs}
              columns={downtimeColumns}
              emptyMessage="No downtime incidents logged today."
            />
          </div>
        </div>
      )}

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`Batch Run: ${selectedBatch?.id}`}
        description={`SKU: ${selectedBatch?.skuName} • Line: ${selectedBatch?.plantLine}`}
        side="right"
        size="md"
      >
        {selectedBatch && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Shift Schedule</span>
                <strong>{selectedBatch.shift}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Line Supervisor</span>
                <strong>{selectedBatch.operator}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Target Batch Qty</span>
                <strong>{selectedBatch.targetQty}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Produced Qty</span>
                <strong>{selectedBatch.producedQty} ({selectedBatch.completionRate}%)</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Start Time</span>
                <strong>{selectedBatch.startTime}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Est End Time</span>
                <strong>{selectedBatch.endTime}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Real-Time Telemetry & Line Performance
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Current Line Speed:</strong> {selectedBatch.telemetry.lineSpeed}</div>
                <div><strong>Quality Pass Rate:</strong> {selectedBatch.telemetry.qualityPassRate}</div>
                <div><strong>Recorded Downtime:</strong> {selectedBatch.telemetry.downtimeMinutes}</div>
                <div><strong>Changeover Time:</strong> {selectedBatch.telemetry.changeoverTime}</div>
                <div><strong>BOM Staging Status:</strong> {selectedBatch.telemetry.bomStatus}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Schedule Batch Modal ────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule New Production Batch"
        description="Allocate an SKU batch to a factory line, select shift timing, and set target production output."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Product SKU
            </label>
            <Select
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              options={[
                { label: "Sparkle Water 1L Case", value: "Sparkle Water 1L Case" },
                { label: "Crisp Chips Classic 50g Case", value: "Crisp Chips Classic 50g Case" },
                { label: "Glacial Ice Mint Soap 15g Case", value: "Glacial Ice Mint Soap 15g Case" },
                { label: "Fresh Butter 500g Pack", value: "Fresh Butter 500g Pack" }
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Plant Line
              </label>
              <Select
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                options={[
                  { label: "Line 1 - Bottling", value: "Line 1 - High Speed Bottling" },
                  { label: "Line 2 - Extrusion", value: "Line 2 - Extrusion & Frying" },
                  { label: "Line 3 - Soap Stamping", value: "Line 3 - Soap Stamping" },
                  { label: "Line 4 - Chilled Packaging", value: "Line 4 - Chilled Packaging" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Shift Timing
              </label>
              <Select
                value={newShift}
                onChange={(e) => setNewShift(e.target.value)}
                options={[
                  { label: "Shift A (06:00 - 14:00)", value: "Shift A (06:00 - 14:00)" },
                  { label: "Shift B (14:00 - 22:00)", value: "Shift B (14:00 - 22:00)" },
                  { label: "Shift C (22:00 - 06:00)", value: "Shift C (22:00 - 06:00)" }
                ]}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Target Batch Quantity (Cases)
            </label>
            <Input
              placeholder="e.g. 4,000 Cases"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Schedule Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
