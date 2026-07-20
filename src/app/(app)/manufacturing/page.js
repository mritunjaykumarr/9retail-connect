"use client";

import React, { useState, useMemo } from "react";
import {
  FiActivity, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiShoppingBag,
  FiChevronRight, FiSliders, FiPackage, FiLayers, FiAlertCircle, FiTruck
} from "react-icons/fi";
import {
  Table, Avatar, Button, Drawer, Modal, Tabs, Badge, Input, Select, useToast
} from "../../../../components/ui";
import BarChart from "../../../../components/ui/Chart/BarChart";
import Donut from "../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH SPEC-COMPLIANT DEMAND SIGNAL DATA ───────────────────── */

const mockDemandSignalData = [
  {
    id: "DS-901",
    skuName: "Sparkle Water 1L Case",
    category: "Beverages",
    secondaryDemand: "12,400 Cases",
    primaryBooked: "10,800 Cases",
    forecastDemand: "14,000 Cases",
    scheduledBatch: "13,500 Cases",
    plantLine: "Line 1 - High Speed Bottling",
    materialStatus: "Sugar & PET Bottle Stocked",
    bufferCover: "4.2 Days",
    utilization: 94,
    status: "Optimized",
    bomDetails: [
      { material: "Refined Sugar", required: "4.2 Tons", inStock: "6.0 Tons", status: "Sufficient" },
      { material: "1L PET Preforms", required: "162,000 Pcs", inStock: "200,000 Pcs", status: "Sufficient" },
      { material: "Outer Carton Boxes", required: "13,500 Boxes", inStock: "15,000 Boxes", status: "Sufficient" }
    ],
    distributors: "Delhi East (4.2K), Noida (3.8K), Gurgaon (2.8K)"
  },
  {
    id: "DS-902",
    skuName: "Crisp Chips Classic 50g Case",
    category: "Snacks & Packaged",
    secondaryDemand: "10,800 Cases",
    primaryBooked: "9,500 Cases",
    forecastDemand: "11,200 Cases",
    scheduledBatch: "11,000 Cases",
    plantLine: "Line 2 - Extrusion & Frying",
    materialStatus: "Seasoning & Foil Stocked",
    bufferCover: "3.8 Days",
    utilization: 88,
    status: "Optimized",
    bomDetails: [
      { material: "Potato Flakes", required: "8.5 Tons", inStock: "10.2 Tons", status: "Sufficient" },
      { material: "Classic Seasoning", required: "850 kg", inStock: "1,200 kg", status: "Sufficient" },
      { material: "Laminated Foil Rolls", required: "132,000 Rolls", inStock: "150,000 Rolls", status: "Sufficient" }
    ],
    distributors: "Delhi Central (4.5K), Faridabad (3.2K), Ghaziabad (1.8K)"
  },
  {
    id: "DS-903",
    skuName: "Energy Blast 250ml Pack",
    category: "Beverages",
    secondaryDemand: "8,500 Cases",
    primaryBooked: "4,200 Cases",
    forecastDemand: "9,000 Cases",
    scheduledBatch: "5,000 Cases",
    plantLine: "Line 1 - High Speed Bottling",
    materialStatus: "Aluminium Can Deficit",
    bufferCover: "1.2 Days",
    utilization: 108,
    status: "Supply Deficit",
    bomDetails: [
      { material: "250ml Aluminium Cans", required: "120,000 Cans", inStock: "84,000 Cans", status: "Deficit (36k Short)" },
      { material: "Taurine Extract", required: "350 kg", inStock: "500 kg", status: "Sufficient" },
      { material: "Shrink Wrap Film", required: "5,000 Rolls", inStock: "6,200 Rolls", status: "Sufficient" }
    ],
    distributors: "Delhi North (3.0K), Noida (2.5K), Gurgaon (3.0K)"
  },
  {
    id: "DS-904",
    skuName: "Glacial Ice Mint Soap 15g Case",
    category: "Personal Care",
    secondaryDemand: "6,500 Cases",
    primaryBooked: "5,800 Cases",
    forecastDemand: "7,000 Cases",
    scheduledBatch: "6,800 Cases",
    plantLine: "Line 3 - Soap Stamping",
    materialStatus: "Glycerine Reorder Placed",
    bufferCover: "2.5 Days",
    utilization: 82,
    status: "Near Capacity",
    bomDetails: [
      { material: "Raw Glycerine Noodle", required: "1.4 Tons", inStock: "1.6 Tons", status: "Low Stock" },
      { material: "Mint Perfume Oil", required: "120 Litres", inStock: "180 Litres", status: "Sufficient" },
      { material: "Printed Cartons", required: "81,600 Pcs", inStock: "90,000 Pcs", status: "Sufficient" }
    ],
    distributors: "Delhi West (2.8K), Gurgaon (2.2K), Central (1.5K)"
  },
  {
    id: "DS-905",
    skuName: "Fresh Butter 500g Pack",
    category: "Dairy & Chill",
    secondaryDemand: "3,800 Cases",
    primaryBooked: "3,200 Cases",
    forecastDemand: "4,200 Cases",
    scheduledBatch: "4,000 Cases",
    plantLine: "Line 4 - Chilled Packaging",
    materialStatus: "Raw Milk In-Bound",
    bufferCover: "2.0 Days",
    utilization: 76,
    status: "Optimized",
    bomDetails: [
      { material: "Raw Cream Milk", required: "45,000 Litres", inStock: "50,000 Litres", status: "In-Bound" },
      { material: "Foil Wrapper Sheets", required: "48,000 Sheets", inStock: "60,000 Sheets", status: "Sufficient" },
      { material: "Corrugated Cases", required: "4,000 Cartons", inStock: "5,000 Cartons", status: "Sufficient" }
    ],
    distributors: "Delhi South (1.8K), Noida (1.4K)"
  }
];

const mockRawMaterials = [
  { id: "RM-101", materialName: "Refined Sugar Grade-A", category: "Raw Ingredients", stockOnHand: "6.0 Tons", dailyBurnRate: "1.4 Tons/Day", leadTime: "2 Days", status: "Ready" },
  { id: "RM-102", materialName: "250ml Aluminium Cans", category: "Packaging", stockOnHand: "84,000 Units", dailyBurnRate: "30,000 Units/Day", leadTime: "4 Days", status: "Critical Shortage" },
  { id: "RM-103", materialName: "1L PET Preforms", category: "Packaging", stockOnHand: "200,000 Units", dailyBurnRate: "45,000 Units/Day", leadTime: "3 Days", status: "Ready" },
  { id: "RM-104", materialName: "Potato Flakes Powder", category: "Raw Ingredients", stockOnHand: "10.2 Tons", dailyBurnRate: "2.1 Tons/Day", leadTime: "2 Days", status: "Ready" },
  { id: "RM-105", materialName: "Raw Glycerine Noodle", category: "Raw Ingredients", stockOnHand: "1.6 Tons", dailyBurnRate: "0.5 Tons/Day", leadTime: "5 Days", status: "Reorder Placed" }
];

export default function DemandSignalPage() {
  const [activeTab, setActiveTab] = useState("demand_signals");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Production Plan Generation
  const [planningCycle, setPlanningCycle] = useState("Weekly (W29 2026)");
  const [targetPlantLine, setTargetPlantLine] = useState("Line 1 - High Speed Bottling");
  const [shiftCount, setShiftCount] = useState("3 Shifts Full Capacity");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Demand Signal Exported",
      description: "Aggregated plant demand signal and raw material requirements exported to CSV.",
      tone: "success"
    });
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Production Plan Generated",
      description: `Factory batch schedule compiled for ${planningCycle} on ${targetPlantLine}.`,
      tone: "success"
    });
  };

  // Filter Demand Signals
  const filteredDemand = useMemo(() => {
    return mockDemandSignalData.filter(item => {
      const matchSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plantLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [searchQuery, selectedCategory, statusFilter]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const demandColumns = [
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
    {
      key: "plantLine",
      label: "Assigned Production Line",
      sortable: true,
      render: (_, row) => (
        <div className={styles.lineMeta}>
          <strong>{row.plantLine}</strong>
          <span>{row.materialStatus}</span>
        </div>
      )
    },
    { key: "secondaryDemand", label: "Secondary Demand" },
    { key: "primaryBooked", label: "Primary Factory POs" },
    { key: "forecastDemand", label: "Forecast Demand" },
    { key: "scheduledBatch", label: "Scheduled Batch", render: (val) => <strong>{val}</strong> },
    {
      key: "utilization",
      label: "Line Load",
      render: (_, row) => (
        <div className={styles.progressWrap}>
          <span>{row.utilization}% Load</span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min(row.utilization, 100)}%`,
                background: row.utilization > 100 ? "var(--danger)" : row.utilization > 90 ? "var(--warning)" : "var(--success)"
              }}
            />
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Optimized" ? "success" : val === "Near Capacity" ? "warning" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View SKU Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const materialColumns = [
    {
      key: "materialName",
      label: "Raw Material / Component",
      render: (_, row) => (
        <div className={styles.materialMeta}>
          <strong>{row.materialName}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    { key: "stockOnHand", label: "Current Stock", render: (val) => <strong>{val}</strong> },
    { key: "dailyBurnRate", label: "Daily Production Burn" },
    { key: "leadTime", label: "Supplier Lead Time" },
    {
      key: "status",
      label: "Inventory Status",
      render: (val) => {
        const tone = val === "Ready" ? "success" : val === "Reorder Placed" ? "warning" : "danger";
        return (
          <Badge tone={tone} variant="soft" dot>
            {val}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiActivity />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manufacturing Planner</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Demand Signal & Production Planning</h2>
            <p className={styles.subtitle}>
              Turn aggregated market demand (distributor secondary sales + primary POs + forecast engine) into plant production schedules, raw material requirements, and line capacity plans.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiSliders />} onClick={() => setModalOpen(true)}>
            Generate Production Plan
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Demand Signal
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Product Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
            <label>Production Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Optimized">Optimized</option>
              <option value="Near Capacity">Near Capacity</option>
              <option value="Supply Deficit">Supply Deficit</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. AI Production Readiness & Bottleneck Alert Banner ── */}
      <div className={styles.demandBanner}>
        <div className={styles.bannerAlert}>
          <FiAlertCircle className={styles.alertIcon} />
          <div className={styles.alertInfo}>
            <strong>Critical BOM Shortage</strong>
            <span>250ml Aluminium Cans (36k Short)</span>
          </div>
        </div>
        <div className={styles.bannerStats}>
          <div className={styles.statCol}>
            <span>Total Aggregated Demand</span>
            <strong>42,000 Cases</strong>
          </div>
          <div className={styles.statCol}>
            <span>Primary Factory POs</span>
            <strong>33,500 Cases</strong>
          </div>
          <div className={styles.statCol}>
            <span>Avg Plant Line Load</span>
            <strong style={{ color: "var(--warning)" }}>91.6%</strong>
          </div>
          <div className={styles.statCol}>
            <span>BOM Preparedness</span>
            <strong>94.2%</strong>
          </div>
        </div>
        <div className={styles.bannerAction}>
          <Button variant="outline" size="sm" leadingIcon={<FiZap />}>
            Resolve Bottleneck
          </Button>
        </div>
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "demand_signals", label: "Aggregated Demand Signal Matrix" },
          { value: "raw_materials", label: "Raw Material & BOM Requirements" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid (Stacked Full Width) ──────── */}
      {activeTab === "demand_signals" && (
        <div className={styles.mainLayout}>
          {/* Top: SKU Demand Signal Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Market Demand Signals & Scheduled Factory Batches</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search SKU Name, Category, Line or Code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredDemand}
              columns={demandColumns}
              onRowClick={handleRowClick}
              emptyMessage="No demand signal records match selected filters."
            />
          </div>

          {/* Bottom: Market Demand vs Plant Production Capacity BarChart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Aggregated Market Demand vs Factory Production Capacity</h3>
            </div>
            <BarChart
              labels={["Beverages (Line 1)", "Snacks (Line 2)", "Personal Care (Line 3)", "Dairy (Line 4)"]}
              series={[
                { name: "Market Demand Signal (Cases)", data: [20900, 10800, 6500, 3800], color: "var(--primary)" },
                { name: "Max Weekly Line Capacity (Cases)", data: [20000, 16000, 10000, 6000], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "raw_materials" && (
        <div className={styles.mainLayout}>
          {/* Top: Raw Materials Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Raw Materials & Component Inventory Readiness</h3>
            </div>
            <Table
              data={mockRawMaterials}
              columns={materialColumns}
              emptyMessage="No raw material records found."
            />
          </div>

          {/* Bottom: Raw Material Inventory Breakdown Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Component Preparedness & Buffer Stock</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Sugar & Sweeteners", value: 45 },
                  { label: "Potato Flakes & Grains", value: 30 },
                  { label: "PET & Foil Packaging", value: 18 },
                  { label: "Aluminium Cans Deficit", value: 7 }
                ]}
                colors={["var(--primary)", "var(--success)", "var(--warning)", "var(--danger)"]}
                innerRadius={0.68}
                centerLabel="BOM Readiness"
                centerSubLabel="94.2% Ready"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedItem?.skuName}
        description={`SKU Code: ${selectedItem?.id} • ${selectedItem?.category}`}
        side="right"
        size="md"
      >
        {selectedItem && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Assigned Plant Line</span>
                <strong>{selectedItem.plantLine}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Secondary Field Demand</span>
                <strong>{selectedItem.secondaryDemand}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Primary POs Booked</span>
                <strong>{selectedItem.primaryBooked}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Engine Forecast</span>
                <strong>{selectedItem.forecastDemand}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Scheduled Batch</span>
                <strong>{selectedItem.scheduledBatch}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Stock Cover Days</span>
                <strong>{selectedItem.bufferCover}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>
                Bill of Materials (BOM) Requirements
              </h4>
              <div className={styles.bomList}>
                {selectedItem.bomDetails?.map((bom, idx) => (
                  <div key={idx} className={styles.bomItem}>
                    <div>
                      <strong style={{ color: "var(--text-1)", display: "block" }}>{bom.material}</strong>
                      <span style={{ color: "var(--text-3)" }}>Required: {bom.required} • In Stock: {bom.inStock}</span>
                    </div>
                    <Badge tone={bom.status.includes("Deficit") ? "danger" : bom.status.includes("Low") ? "warning" : "success"} variant="soft" dot>
                      {bom.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>
                Distributor Demands Rollup
              </h4>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-2)", lineHeight: 1.5 }}>
                {selectedItem.distributors}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Generate Production Plan Modal ───────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate Factory Production Plan"
        description="Compile demand signals, primary POs, and forecast engine outputs into line batch schedules."
        size="md"
      >
        <form onSubmit={handleCreatePlan} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Planning Cycle Horizon
            </label>
            <Select
              value={planningCycle}
              onChange={(e) => setPlanningCycle(e.target.value)}
              options={[
                { label: "Weekly (W29 2026)", value: "Weekly (W29 2026)" },
                { label: "Bi-Weekly (W29-W30)", value: "Bi-Weekly (W29-W30)" },
                { label: "Monthly (Jul 2026)", value: "Monthly (Jul 2026)" }
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Target Plant Line
              </label>
              <Select
                value={targetPlantLine}
                onChange={(e) => setTargetPlantLine(e.target.value)}
                options={[
                  { label: "Line 1 - High Speed Bottling", value: "Line 1 - High Speed Bottling" },
                  { label: "Line 2 - Extrusion & Frying", value: "Line 2 - Extrusion & Frying" },
                  { label: "Line 3 - Soap Stamping", value: "Line 3 - Soap Stamping" },
                  { label: "Line 4 - Chilled Packaging", value: "Line 4 - Chilled Packaging" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Shift Capacity
              </label>
              <Select
                value={shiftCount}
                onChange={(e) => setShiftCount(e.target.value)}
                options={[
                  { label: "3 Shifts Full Capacity", value: "3 Shifts Full Capacity" },
                  { label: "2 Shifts Standard", value: "2 Shifts Standard" },
                  { label: "Overtime Weekend Shift", value: "Overtime Weekend Shift" }
                ]}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Generate Batch Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
