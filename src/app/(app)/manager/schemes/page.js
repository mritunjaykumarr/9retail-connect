"use client";

import React, { useState, useMemo } from "react";
import {
  FiTag, FiSearch, FiDownload, FiFilter,
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiGift, FiPlus, FiUsers, FiDollarSign, FiCalendar
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tooltip, Drawer, Modal, Tabs, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const mockSchemesData = [
  {
    id: "SCH-101",
    name: "Monsoon Beverage Volume Bonanza",
    type: "Volume Discount",
    category: "Beverages",
    threshold: "Order 25+ Cases",
    discount: "12% Invoice Off",
    validity: "01 Jul - 31 Jul 2026",
    participation: "420 Outlets",
    payout: "₹4,85,000",
    status: "Active",
    details: {
      minOrderValue: "₹25,000",
      eligibleZones: "Delhi East, Delhi Central, Noida",
      applicableSkus: "Sparkle Water 1L, Refresh Soda Can",
      description: "Get 12% instant invoice discount on all bulk orders exceeding 25 cases."
    }
  },
  {
    id: "SCH-102",
    name: "Crisp Chips BOGO 10+1 Promo",
    type: "BOGO / Free Goods",
    category: "Snacks & Packaged",
    threshold: "Buy 10 Cases",
    discount: "1 Case Free (Classic 50g)",
    validity: "15 Jul - 15 Aug 2026",
    participation: "680 Outlets",
    payout: "₹3,40,000",
    status: "Active",
    details: {
      minOrderValue: "₹12,000",
      eligibleZones: "All Territory Zones",
      applicableSkus: "Crisp Chips Classic 50g, Masala 50g",
      description: "Buy 10 cases of Crisp Chips and receive 1 case free of Classic 50g SKU."
    }
  },
  {
    id: "SCH-103",
    name: "Quarterly Retailer Growth Slab",
    type: "Slab Cashback",
    category: "All Categories",
    threshold: "₹1.5L Q3 Booking",
    discount: "₹8,500 Cash Reward",
    validity: "01 Jul - 30 Sep 2026",
    participation: "215 Outlets",
    payout: "₹5,20,000",
    status: "Active",
    details: {
      minOrderValue: "₹1,50,000 Quarterly",
      eligibleZones: "Gurugram, Delhi West, Faridabad",
      applicableSkus: "Full Catalog Portfolio",
      description: "Tiered quarterly slab payout transferred via direct bank credit upon target achievement."
    }
  },
  {
    id: "SCH-104",
    name: "Personal Care Counter Display Allowance",
    type: "Display Allowance",
    category: "Personal Care",
    threshold: "Prime Counter Unit",
    discount: "₹1,200 / Month",
    validity: "01 Aug - 31 Oct 2026",
    participation: "95 Outlets",
    payout: "₹1,14,000",
    status: "Scheduled",
    details: {
      minOrderValue: "Must maintain 3 SKU facings",
      eligibleZones: "Delhi Central, Gurugram",
      applicableSkus: "Glacial Ice Mint 15g, Fruit Bite Bar",
      description: "Monthly display rental paid to top retail counters for dedicated shelf placement."
    }
  },
  {
    id: "SCH-105",
    name: "Summer Cold Drink Blast",
    type: "Volume Discount",
    category: "Beverages",
    threshold: "Order 50+ Cases",
    discount: "15% Invoice Off",
    validity: "01 May - 30 Jun 2026",
    participation: "850 Outlets",
    payout: "₹8,90,000",
    status: "Expired",
    details: {
      minOrderValue: "₹50,000",
      eligibleZones: "All Territory Zones",
      applicableSkus: "Energy Blast 250ml, Refresh Soda Can",
      description: "Summer peak season bulk volume discount scheme."
    }
  }
];

const mockPerformanceMatrix = [
  { id: "ZONE-01", zone: "Delhi East", schemesCount: 4, activeRetailers: "420 / 480", totalPayout: "₹3.85L", uplift: "+24.5%", status: "High ROI" },
  { id: "ZONE-02", zone: "Delhi Central", schemesCount: 5, activeRetailers: "390 / 420", totalPayout: "₹4.10L", uplift: "+21.2%", status: "High ROI" },
  { id: "ZONE-03", zone: "Noida", schemesCount: 3, activeRetailers: "280 / 350", totalPayout: "₹2.95L", uplift: "+18.6%", status: "Moderate ROI" },
  { id: "ZONE-04", zone: "Gurugram", schemesCount: 4, activeRetailers: "310 / 360", totalPayout: "₹3.40L", uplift: "+26.8%", status: "High ROI" },
  { id: "ZONE-05", zone: "Delhi West", schemesCount: 3, activeRetailers: "260 / 340", totalPayout: "₹2.80L", uplift: "+15.4%", status: "Moderate ROI" }
];

export default function SchemeBuilderPage() {
  const [activeTab, setActiveTab] = useState("schemes_list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for new scheme modal
  const [newSchemeName, setNewSchemeName] = useState("");
  const [newSchemeType, setNewSchemeType] = useState("Volume Discount");
  const [newThreshold, setNewThreshold] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Schemes Data Exported",
      description: "Active trade scheme configurations exported to CSV.",
      tone: "success"
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Scheme Created Successfully",
      description: `Trade Scheme "${newSchemeName || 'New Trade Scheme'}" submitted for launch.`,
      tone: "success"
    });
    setNewSchemeName("");
    setNewThreshold("");
    setNewDiscount("");
  };

  // Filter Schemes Data
  const filteredSchemes = useMemo(() => {
    return mockSchemesData.filter(scheme => {
      const matchSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === "All" || scheme.type === selectedType;
      const matchStatus = statusFilter === "All" || scheme.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [searchQuery, selectedType, statusFilter]);

  const handleRowClick = (scheme) => {
    setSelectedScheme(scheme);
    setDrawerOpen(true);
  };

  const schemeColumns = [
    {
      key: "name",
      label: "Scheme Name & Category",
      sortable: true,
      render: (_, row) => (
        <div className={styles.schemeMeta}>
          <strong>{row.name}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    {
      key: "type",
      label: "Scheme Type & Reward",
      sortable: true,
      render: (_, row) => (
        <div className={styles.typeMeta}>
          <strong>{row.type}</strong>
          <span>{row.discount}</span>
        </div>
      )
    },
    { key: "threshold", label: "Volume Threshold" },
    { key: "validity", label: "Validity Period" },
    {
      key: "payout",
      label: "Total Payout",
      align: "right",
      mono: true,
      sortable: true,
      render: (val) => <strong>{val}</strong>
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Active" ? "success" : val === "Scheduled" ? "warning" : val === "Draft" ? "primary" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Scheme Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const matrixColumns = [
    {
      key: "zone",
      label: "Territory Zone",
      render: (_, row) => (
        <div className={styles.typeMeta}>
          <strong>{row.zone}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    { key: "schemesCount", label: "Active Schemes" },
    { key: "activeRetailers", label: "Retailer Adoption" },
    { key: "totalPayout", label: "Territory Payout", render: (val) => <strong>{val}</strong> },
    { key: "uplift", label: "Sales Uplift", render: (val) => <strong style={{ color: "var(--success)" }}>{val}</strong> },
    {
      key: "status",
      label: "ROI Rating",
      render: (val) => (
        <Badge tone={val === "High ROI" ? "success" : "primary"} variant="soft" dot>
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
            <FiTag />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Trade Scheme Builder</h2>
            <p className={styles.subtitle}>
              Design, configure, and launch regional trade schemes, discount slabs, buy-one-get-one (BOGO) offers, and retailer volume incentives.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiPlus />} onClick={() => setModalOpen(true)}>
            Create New Scheme
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Schemes
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Scheme Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Types</option>
              <option value="Volume Discount">Volume Discount</option>
              <option value="BOGO / Free Goods">BOGO / Free Goods</option>
              <option value="Slab Cashback">Slab Cashback</option>
              <option value="Display Allowance">Display Allowance</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Scheme Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Active Trade Schemes"
          value="12 Schemes"
          delta={3}
          deltaLabel="launched this month"
          deltaTone="positive"
          icon={<FiTag color="var(--primary)" />}
        />
        <StatCard
          label="Retailer Participation"
          value="1,480 Outlets"
          delta={84.2}
          deltaLabel="active adoption rate"
          deltaTone="positive"
          icon={<FiUsers color="var(--success)" />}
        />
        <StatCard
          label="Total Scheme Expenditure"
          value="₹14.25L"
          delta={11.5}
          deltaLabel="vs previous period"
          deltaTone="positive"
          icon={<FiGift color="var(--warning)" />}
        />
        <StatCard
          label="Sales Volume Uplift"
          value="+22.4%"
          delta={4.2}
          deltaLabel="above baseline target"
          deltaTone="positive"
          icon={<FiTrendingUp color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "schemes_list", label: "Trade Schemes Directory" },
          { value: "performance_matrix", label: "Territory Scheme Matrix" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid ───────────────────────────── */}
      {activeTab === "schemes_list" && (
        <div className={styles.mainLayout}>
          {/* Left: Schemes Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Configured Trade Schemes</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search Scheme Code, Name or Category..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredSchemes}
              columns={schemeColumns}
              onRowClick={handleRowClick}
              emptyMessage="No trade schemes match selected filters."
            />
          </div>

          {/* Right: Uplift vs Expenditure Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Scheme Uplift vs Investment</h3>
            </div>
            <BarChart
              labels={["Q1 Baseline", "Q2 Summer Promo", "Q3 Festival Slab", "Q4 Year-End"]}
              series={[
                { name: "Sales Lift (₹ Lakhs)", data: [18.4, 24.2, 38.5, 42.1], color: "var(--primary)" },
                { name: "Scheme Investment (₹ Lakhs)", data: [2.1, 3.4, 5.2, 6.0], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "performance_matrix" && (
        <div className={styles.mainLayout}>
          {/* Left: Territory Matrix Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Territory Scheme ROI & Adoption</h3>
            </div>
            <Table
              data={mockPerformanceMatrix}
              columns={matrixColumns}
              emptyMessage="No territory performance records found."
            />
          </div>

          {/* Right: Scheme Type Distribution Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Scheme Type Distribution</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Volume Discount", value: 45 },
                  { label: "BOGO / Free Goods", value: 30 },
                  { label: "Slab Cashback", value: 15 },
                  { label: "Display Allowance", value: 10 }
                ]}
                colors={["var(--primary)", "var(--success)", "var(--warning)", "var(--text-3)"]}
                innerRadius={0.68}
                centerLabel="Total Schemes"
                centerSubLabel="12 Active"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedScheme?.name}
        description={`Scheme Code: ${selectedScheme?.id} • ${selectedScheme?.type}`}
        side="right"
        size="md"
      >
        {selectedScheme && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Category</span>
                <strong>{selectedScheme.category}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Threshold Rule</span>
                <strong>{selectedScheme.threshold}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Discount Reward</span>
                <strong>{selectedScheme.discount}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Validity Period</span>
                <strong>{selectedScheme.validity}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Retailer Adoption</span>
                <strong>{selectedScheme.participation}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Total Expenditure</span>
                <strong>{selectedScheme.payout}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Scheme Configuration & Eligibility Rules
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                {selectedScheme.details.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Eligible Zones:</strong> {selectedScheme.details.eligibleZones}</div>
                <div><strong>Applicable SKUs:</strong> {selectedScheme.details.applicableSkus}</div>
                <div><strong>Minimum Order Value:</strong> {selectedScheme.details.minOrderValue}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Create Scheme Modal ─────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Configure New Trade Scheme"
        description="Define discount thresholds, reward rules, and target categories to launch a regional trade scheme."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Scheme Name
            </label>
            <Input
              placeholder="e.g. Monsoon Bulk Beverage Discount"
              value={newSchemeName}
              onChange={(e) => setNewSchemeName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Scheme Type
              </label>
              <Select
                value={newSchemeType}
                onChange={(e) => setNewSchemeType(e.target.value)}
                options={[
                  { label: "Volume Discount", value: "Volume Discount" },
                  { label: "BOGO / Free Goods", value: "BOGO / Free Goods" },
                  { label: "Slab Cashback", value: "Slab Cashback" },
                  { label: "Display Allowance", value: "Display Allowance" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Threshold Rule
              </label>
              <Input
                placeholder="e.g. Order 20+ Cases"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Reward / Discount Detail
            </label>
            <Input
              placeholder="e.g. 10% Invoice Discount or 1 Case Free"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Launch Scheme
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
