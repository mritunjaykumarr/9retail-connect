"use client";

import React, { useState, useMemo } from "react";
import {
  FiLayers, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiPlusCircle,
  FiChevronRight, FiSliders, FiPackage, FiAlertTriangle, FiShoppingBag, FiTruck
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Button, Drawer, Modal, Tabs, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH RAW MATERIALS SPEC-COMPLIANT MOCK DATA ──────────────── */

const mockRawMaterials = [
  {
    id: "RM-101",
    materialName: "Refined Sugar Grade-A",
    category: "Raw Ingredients",
    stockOnHand: "6.0 Tons",
    dailyBurnRate: "1.4 Tons/Day",
    daysCover: 4.2,
    reorderPoint: "3.0 Tons",
    primarySupplier: "Mawana Sugar Mills",
    leadTimeDays: "2 Days",
    unitCost: "₹42,000 / Ton",
    status: "Sufficient Stock",
    bomAssignedSKUs: "Sparkle Water 1L, Energy Blast 250ml",
    details: {
      warehouseBay: "Bay A-12 (Dry Storage)",
      lastReceived: "18 Jul 2026",
      qualityInspection: "Passed (100% Purity)",
      pendingPo: "PO-4402 (5.0 Tons expected 22 Jul)"
    }
  },
  {
    id: "RM-102",
    materialName: "250ml Aluminium Can Bodies",
    category: "Primary Packaging",
    stockOnHand: "84,000 Cans",
    dailyBurnRate: "30,000 Cans/Day",
    daysCover: 1.2,
    reorderPoint: "120,000 Cans",
    primarySupplier: "Ball Beverage Packaging Ltd",
    leadTimeDays: "4 Days",
    unitCost: "₹3.80 / Can",
    status: "Critical Deficit",
    bomAssignedSKUs: "Energy Blast 250ml Pack",
    details: {
      warehouseBay: "Bay P-04 (Packaging Store)",
      lastReceived: "12 Jul 2026",
      qualityInspection: "Passed",
      pendingPo: "PO-4418 (150,000 Cans Expedited)"
    }
  },
  {
    id: "RM-103",
    materialName: "1L PET Bottle Preforms",
    category: "Primary Packaging",
    stockOnHand: "200,000 Pcs",
    dailyBurnRate: "45,000 Pcs/Day",
    daysCover: 4.4,
    reorderPoint: "100,000 Pcs",
    primarySupplier: "Ester Industries Ltd",
    leadTimeDays: "3 Days",
    unitCost: "₹1.45 / Pc",
    status: "Sufficient Stock",
    bomAssignedSKUs: "Sparkle Water 1L Case",
    details: {
      warehouseBay: "Bay P-01 (Packaging Store)",
      lastReceived: "17 Jul 2026",
      qualityInspection: "Passed",
      pendingPo: "PO-4390 (200,000 Pcs Scheduled 24 Jul)"
    }
  },
  {
    id: "RM-104",
    materialName: "Potato Flakes Dehydrated",
    category: "Raw Ingredients",
    stockOnHand: "10.2 Tons",
    dailyBurnRate: "2.1 Tons/Day",
    daysCover: 4.8,
    reorderPoint: "5.0 Tons",
    primarySupplier: "AgroTech Foods India",
    leadTimeDays: "2 Days",
    unitCost: "₹85,000 / Ton",
    status: "Sufficient Stock",
    bomAssignedSKUs: "Crisp Chips Classic 50g",
    details: {
      warehouseBay: "Bay A-08 (Dry Storage)",
      lastReceived: "19 Jul 2026",
      qualityInspection: "Passed",
      pendingPo: "None required"
    }
  },
  {
    id: "RM-105",
    materialName: "Raw Glycerine Soap Noodles",
    category: "Raw Ingredients",
    stockOnHand: "1.6 Tons",
    dailyBurnRate: "0.5 Tons/Day",
    daysCover: 2.5,
    reorderPoint: "2.0 Tons",
    primarySupplier: "Godrej Industries Oleo",
    leadTimeDays: "5 Days",
    unitCost: "₹68,000 / Ton",
    status: "Reorder Placed",
    bomAssignedSKUs: "Glacial Ice Mint Soap 15g",
    details: {
      warehouseBay: "Bay B-03 (Chemical Vault)",
      lastReceived: "10 Jul 2026",
      qualityInspection: "Passed",
      pendingPo: "PO-4425 (4.0 Tons in Transit)"
    }
  }
];

const mockRequisitions = [
  { id: "REQ-901", material: "250ml Aluminium Can Bodies", qty: "150,000 Units", supplier: "Ball Beverage Ltd", deliveryDate: "22 Jul 2026", status: "Expedited Order", cost: "₹5,70,000" },
  { id: "REQ-902", material: "Raw Glycerine Soap Noodles", qty: "4.0 Tons", supplier: "Godrej Oleo", deliveryDate: "23 Jul 2026", status: "In Transit", cost: "₹2,72,000" },
  { id: "REQ-903", material: "Refined Sugar Grade-A", qty: "5.0 Tons", supplier: "Mawana Sugar", deliveryDate: "24 Jul 2026", status: "PO Confirmed", cost: "₹2,10,000" }
];

export default function RawMaterialsPage() {
  const [activeTab, setActiveTab] = useState("materials_stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Requisition Form State
  const [reqMaterial, setReqMaterial] = useState("250ml Aluminium Can Bodies");
  const [reqQty, setReqQty] = useState("");
  const [reqSupplier, setReqSupplier] = useState("Ball Beverage Packaging Ltd");
  const [reqUrgency, setReqUrgency] = useState("High (Expedite Shipment)");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Inventory Report Exported",
      description: "Raw materials warehouse stock balance & reorder ledger downloaded to CSV.",
      tone: "success"
    });
  };

  const handleRequisitionSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Purchase Requisition Raised",
      description: `Requisition order created for ${reqQty} of ${reqMaterial}.`,
      tone: "success"
    });
    setReqQty("");
  };

  // Filter Raw Materials
  const filteredMaterials = useMemo(() => {
    return mockRawMaterials.filter(item => {
      const matchSearch = item.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primarySupplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const materialColumns = [
    {
      key: "materialName",
      label: "Material & Category",
      sortable: true,
      render: (_, row) => (
        <div className={styles.materialMeta}>
          <strong>{row.materialName}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    {
      key: "primarySupplier",
      label: "Primary Supplier",
      sortable: true,
      render: (_, row) => (
        <div className={styles.supplierMeta}>
          <strong>{row.primarySupplier}</strong>
          <span>Lead Time: {row.leadTimeDays}</span>
        </div>
      )
    },
    { key: "stockOnHand", label: "Stock on Hand", render: (val) => <strong>{val}</strong> },
    { key: "dailyBurnRate", label: "Daily Consumption" },
    {
      key: "daysCover",
      label: "Inventory Cover",
      render: (_, row) => (
        <div className={styles.progressWrap}>
          <span>{row.daysCover} Days Cover</span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min((row.daysCover / 5) * 100, 100)}%`,
                background: row.daysCover < 2.0 ? "var(--danger)" : row.daysCover < 3.5 ? "var(--warning)" : "var(--success)"
              }}
            />
          </div>
        </div>
      )
    },
    { key: "unitCost", label: "Unit Cost" },
    {
      key: "status",
      label: "Stock Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Sufficient Stock" ? "success" : val === "Reorder Placed" ? "warning" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Material Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const reqColumns = [
    {
      key: "material",
      label: "Material & Requisition ID",
      render: (_, row) => (
        <div className={styles.materialMeta}>
          <strong>{row.material}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    { key: "qty", label: "Order Quantity" },
    { key: "supplier", label: "Vendor Name" },
    { key: "deliveryDate", label: "Expected Delivery" },
    { key: "cost", label: "PO Value", render: (val) => <strong>{val}</strong> },
    {
      key: "status",
      label: "Delivery Status",
      render: (val) => (
        <Badge tone={val === "Expedited Order" ? "danger" : val === "In Transit" ? "warning" : "success"} variant="soft" dot>
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
            <FiLayers />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manufacturing Planner</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Raw Material Requirements & Inventory</h2>
            <p className={styles.subtitle}>
              Track warehouse inventory levels of raw ingredients, bottle preforms, packaging foils, and chemical compounds required for factory production batches.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiPlusCircle />} onClick={() => setModalOpen(true)}>
            Raise Material Requisition
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Inventory Balance
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Material Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Categories</option>
              <option value="Raw Ingredients">Raw Ingredients</option>
              <option value="Primary Packaging">Primary Packaging</option>
              <option value="Chemical Vault">Chemical Vault</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Stock Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Sufficient Stock">Sufficient Stock</option>
              <option value="Reorder Placed">Reorder Placed</option>
              <option value="Critical Deficit">Critical Deficit</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Inventory Value"
          value="₹48.5 Lakhs"
          delta={8.5}
          deltaLabel="active warehouse stock"
          deltaTone="positive"
          icon={<FiLayers color="var(--primary)" />}
        />
        <StatCard
          label="Active Purchase Orders"
          value="3 Orders"
          deltaLabel="₹10.52 Lakhs in pipeline"
          deltaTone="positive"
          icon={<FiShoppingBag color="var(--success)" />}
        />
        <StatCard
          label="Critical Stockout Risk"
          value="1 Component"
          deltaLabel="Aluminium Cans 1.2 Days Cover"
          deltaTone="negative"
          icon={<FiAlertTriangle color="var(--danger)" />}
        />
        <StatCard
          label="Avg Days Buffer Cover"
          value="3.8 Days"
          deltaLabel="Optimal safety stock level"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "materials_stock", label: "Raw Ingredients & Packaging Stock" },
          { value: "purchase_requisitions", label: "Supplier Purchase Requisitions" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid (Stacked Full Width) ──────── */}
      {activeTab === "materials_stock" && (
        <div className={styles.mainLayout}>
          {/* Top: Raw Materials Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Raw Materials & Packaging Components Inventory</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search Material Name, Code, Supplier or Category..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredMaterials}
              columns={materialColumns}
              onRowClick={handleRowClick}
              emptyMessage="No raw material records match selected filters."
            />
          </div>

          {/* Bottom: Material Stock Cover BarChart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Inventory Days of Supply Cover vs Minimum Buffer Threshold</h3>
            </div>
            <BarChart
              labels={["Refined Sugar", "Aluminium Cans", "PET Preforms", "Potato Flakes", "Soap Noodles"]}
              series={[
                { name: "Current Stock Cover (Days)", data: [4.2, 1.2, 4.4, 4.8, 2.5], color: "var(--primary)" },
                { name: "Safety Buffer Threshold (Days)", data: [3.0, 3.0, 3.0, 3.0, 3.0], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "purchase_requisitions" && (
        <div className={styles.mainLayout}>
          {/* Top: Purchase Requisitions Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Active Supplier Purchase Orders & In-Transit Deliveries</h3>
            </div>
            <Table
              data={mockRequisitions}
              columns={reqColumns}
              emptyMessage="No active purchase requisitions found."
            />
          </div>

          {/* Bottom: Requisition Value Distribution Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Pending Purchase Requisition Value Share</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Aluminium Cans (Ball Ltd)", value: 570000 },
                  { label: "Glycerine Noodles (Godrej)", value: 272000 },
                  { label: "Refined Sugar (Mawana)", value: 210000 }
                ]}
                colors={["var(--danger)", "var(--warning)", "var(--primary)"]}
                innerRadius={0.68}
                centerLabel="Total PO Pipeline"
                centerSubLabel="₹10,52,000"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedItem?.materialName}
        description={`Material Code: ${selectedItem?.id} • ${selectedItem?.category}`}
        side="right"
        size="md"
      >
        {selectedItem && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Primary Supplier</span>
                <strong>{selectedItem.primarySupplier}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Stock On Hand</span>
                <strong>{selectedItem.stockOnHand}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Daily Burn Rate</span>
                <strong>{selectedItem.dailyBurnRate}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Days Cover</span>
                <strong>{selectedItem.daysCover} Days</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Reorder Point</span>
                <strong>{selectedItem.reorderPoint}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Unit Cost</span>
                <strong>{selectedItem.unitCost}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Warehouse Staging & Supplier Ledger
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Warehouse Storage Bay:</strong> {selectedItem.details.warehouseBay}</div>
                <div><strong>Last Receipt Date:</strong> {selectedItem.details.lastReceived}</div>
                <div><strong>Quality Inspection Status:</strong> {selectedItem.details.qualityInspection}</div>
                <div><strong>Active PO Status:</strong> {selectedItem.details.pendingPo}</div>
                <div><strong>BOM Assigned SKUs:</strong> {selectedItem.bomAssignedSKUs}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Raise Requisition Modal ─────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Raise Material Purchase Requisition"
        description="Issue a new purchase requisition order to primary raw material vendors to replenish warehouse safety stock."
        size="md"
      >
        <form onSubmit={handleRequisitionSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Raw Material / Component
            </label>
            <Select
              value={reqMaterial}
              onChange={(e) => setReqMaterial(e.target.value)}
              options={[
                { label: "250ml Aluminium Can Bodies", value: "250ml Aluminium Can Bodies" },
                { label: "Refined Sugar Grade-A", value: "Refined Sugar Grade-A" },
                { label: "1L PET Bottle Preforms", value: "1L PET Bottle Preforms" },
                { label: "Raw Glycerine Soap Noodles", value: "Raw Glycerine Soap Noodles" }
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Primary Supplier
              </label>
              <Select
                value={reqSupplier}
                onChange={(e) => setReqSupplier(e.target.value)}
                options={[
                  { label: "Ball Beverage Packaging Ltd", value: "Ball Beverage Packaging Ltd" },
                  { label: "Mawana Sugar Mills", value: "Mawana Sugar Mills" },
                  { label: "Ester Industries Ltd", value: "Ester Industries Ltd" },
                  { label: "Godrej Industries Oleo", value: "Godrej Industries Oleo" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Delivery Urgency
              </label>
              <Select
                value={reqUrgency}
                onChange={(e) => setReqUrgency(e.target.value)}
                options={[
                  { label: "High (Expedite Shipment)", value: "High (Expedite Shipment)" },
                  { label: "Normal (Standard Lead Time)", value: "Normal (Standard Lead Time)" }
                ]}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Requisition Quantity
            </label>
            <Input
              placeholder="e.g. 150,000 Units or 5.0 Tons"
              value={reqQty}
              onChange={(e) => setReqQty(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Issue Requisition PO
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
