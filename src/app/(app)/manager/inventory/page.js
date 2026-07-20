"use client";

import React, { useState, useMemo } from "react";
import {
  FiPackage, FiSearch, FiDownload, FiFilter,
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiTruck, FiBox, FiRefreshCw
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tooltip, Drawer, Tabs, Badge, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const mockInventoryData = [
  {
    id: "SKU-501",
    skuName: "Sparkle Water 1L Case (12x)",
    category: "Beverages",
    distributor: "East Delhi Logistics",
    zone: "Delhi East",
    stockCases: 1420,
    reorderLevel: 500,
    stockValue: "₹5,96,400",
    doi: "22 Days",
    status: "In Stock",
    lastRestocked: "16 Jul 2026",
    details: {
      warehouse: "Depot Bay B-04",
      avgDailySales: "64 cases/day",
      safetyBuffer: "300 cases",
      leadTime: "3 days"
    }
  },
  {
    id: "SKU-502",
    skuName: "Crisp Chips Classic 50g",
    category: "Snacks & Packaged",
    distributor: "Central FMCG Distributors",
    zone: "Delhi Central",
    stockCases: 380,
    reorderLevel: 600,
    stockValue: "₹2,47,000",
    doi: "6 Days",
    status: "Low Stock",
    lastRestocked: "10 Jul 2026",
    details: {
      warehouse: "Depot Bay A-12",
      avgDailySales: "63 cases/day",
      safetyBuffer: "400 cases",
      leadTime: "2 days"
    }
  },
  {
    id: "SKU-503",
    skuName: "Refresh Soda Can 330ml",
    category: "Beverages",
    distributor: "Noida Wholesale Traders",
    zone: "Noida",
    stockCases: 2150,
    reorderLevel: 800,
    stockValue: "₹18,27,500",
    doi: "28 Days",
    status: "In Stock",
    lastRestocked: "17 Jul 2026",
    details: {
      warehouse: "Sector 63 Warehouse C",
      avgDailySales: "76 cases/day",
      safetyBuffer: "500 cases",
      leadTime: "4 days"
    }
  },
  {
    id: "SKU-504",
    skuName: "Energy Blast 250ml Pack",
    category: "Beverages",
    distributor: "Gurugram Supply Chain",
    zone: "Gurugram",
    stockCases: 95,
    reorderLevel: 400,
    stockValue: "₹96,520",
    doi: "2 Days",
    status: "Critical",
    lastRestocked: "04 Jul 2026",
    details: {
      warehouse: "Cyber Hub Logistics Bay 2",
      avgDailySales: "48 cases/day",
      safetyBuffer: "200 cases",
      leadTime: "5 days"
    }
  },
  {
    id: "SKU-505",
    skuName: "Fruit Bite Bar 30g",
    category: "Snacks & Packaged",
    distributor: "Westside Distributors",
    zone: "Delhi West",
    stockCases: 3400,
    reorderLevel: 1000,
    stockValue: "₹13,60,000",
    doi: "42 Days",
    status: "Overstocked",
    lastRestocked: "18 Jul 2026",
    details: {
      warehouse: "Rajouri Garden Depot 1",
      avgDailySales: "80 cases/day",
      safetyBuffer: "600 cases",
      leadTime: "3 days"
    }
  },
  {
    id: "SKU-506",
    skuName: "Glacial Ice Mint 15g",
    category: "Personal Care",
    distributor: "Faridabad Retail Hub",
    zone: "Faridabad",
    stockCases: 890,
    reorderLevel: 450,
    stockValue: "₹4,45,000",
    doi: "18 Days",
    status: "In Stock",
    lastRestocked: "14 Jul 2026",
    details: {
      warehouse: "Sector 15 Distribution Point",
      avgDailySales: "49 cases/day",
      safetyBuffer: "250 cases",
      leadTime: "4 days"
    }
  }
];

const mockDistributorMatrix = [
  { id: "DIST-01", name: "East Delhi Logistics", zone: "Delhi East", skusCount: 142, totalValue: "₹38.4L", status: "Healthy", fillRate: "98.2%" },
  { id: "DIST-02", name: "Central FMCG Distributors", zone: "Delhi Central", skusCount: 138, totalValue: "₹32.1L", status: "Low Stock Alert", fillRate: "92.4%" },
  { id: "DIST-03", name: "Noida Wholesale Traders", zone: "Noida", skusCount: 150, totalValue: "₹41.5L", status: "Healthy", fillRate: "97.8%" },
  { id: "DIST-04", name: "Gurugram Supply Chain", zone: "Gurugram", skusCount: 124, totalValue: "₹29.8L", status: "Stockout Risk", fillRate: "88.6%" },
  { id: "DIST-05", name: "Westside Distributors", zone: "Delhi West", skusCount: 160, totalValue: "₹42.2L", status: "Healthy", fillRate: "99.1%" }
];

export default function DistributorInventoryPage() {
  const [activeTab, setActiveTab] = useState("sku_stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Stock Report Exported",
      description: "Distributor inventory status downloaded to CSV.",
      tone: "success"
    });
  };

  const handleRefresh = () => {
    toast?.({
      title: "Inventory Synced",
      description: "Real-time distributor ERP stock levels updated.",
      tone: "info"
    });
  };

  // Filter Inventory
  const filteredInventory = useMemo(() => {
    return mockInventoryData.filter(item => {
      const matchSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.distributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchHub = selectedHub === "All" || item.distributor === selectedHub;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchHub && matchStatus;
    });
  }, [searchQuery, selectedHub, statusFilter]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const inventoryColumns = [
    {
      key: "skuName",
      label: "SKU Name & Category",
      sortable: true,
      render: (_, row) => (
        <div className={styles.skuMeta}>
          <strong>{row.skuName}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    {
      key: "distributor",
      label: "Distributor Hub",
      sortable: true,
      render: (_, row) => (
        <div className={styles.distributorMeta}>
          <strong>{row.distributor}</strong>
          <span>{row.zone}</span>
        </div>
      )
    },
    {
      key: "stockCases",
      label: "Stock (Cases)",
      align: "right",
      mono: true,
      sortable: true,
      render: (val) => <strong>{val.toLocaleString()}</strong>
    },
    {
      key: "stockValue",
      label: "Stock Value",
      align: "right",
      mono: true,
      sortable: true,
      render: (val) => <strong>{val}</strong>
    },
    {
      key: "doi",
      label: "DOI (Days)",
      align: "center",
      sortable: true,
      render: (val) => <span>{val}</span>
    },
    {
      key: "status",
      label: "Stock Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "In Stock" ? "success" : val === "Low Stock" ? "warning" : val === "Critical" ? "danger" : "primary";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Stock Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const distributorColumns = [
    {
      key: "name",
      label: "Distributor Hub & Zone",
      render: (_, row) => (
        <div className={styles.distributorMeta}>
          <strong>{row.name}</strong>
          <span>{row.zone} • {row.id}</span>
        </div>
      )
    },
    { key: "skusCount", label: "Active SKUs" },
    { key: "totalValue", label: "Warehouse Stock Value", render: (val) => <strong>{val}</strong> },
    { key: "fillRate", label: "Order Fill Rate", render: (val) => <strong style={{ color: "var(--success)" }}>{val}</strong> },
    {
      key: "status",
      label: "Health Status",
      render: (val) => (
        <Badge tone={val === "Healthy" ? "success" : val === "Low Stock Alert" ? "warning" : "danger"} variant="soft" dot>
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
            <FiPackage />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Distributor Inventory Stock</h2>
            <p className={styles.subtitle}>
              Monitor real-time distributor warehouse stock levels, stock-out risks, days of inventory (DOI), and replenishment status.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />} onClick={handleRefresh}>
            Sync Stock
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Stock Data
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Distributor Hub:</label>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Hubs</option>
              <option value="East Delhi Logistics">East Delhi Logistics</option>
              <option value="Central FMCG Distributors">Central FMCG Distributors</option>
              <option value="Noida Wholesale Traders">Noida Wholesale Traders</option>
              <option value="Gurugram Supply Chain">Gurugram Supply Chain</option>
              <option value="Westside Distributors">Westside Distributors</option>
              <option value="Faridabad Retail Hub">Faridabad Retail Hub</option>
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
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical / Stockout</option>
              <option value="Overstocked">Overstocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Stock Value"
          value="₹1.84Cr"
          delta={5.4}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiPackage color="var(--primary)" />}
        />
        <StatCard
          label="Reporting Distributors"
          value="18 Hubs"
          deltaLabel="100% active ERP sync"
          deltaTone="positive"
          icon={<FiTruck color="var(--success)" />}
        />
        <StatCard
          label="Low / Critical SKUs"
          value="14 SKUs"
          delta={-3}
          deltaLabel="flagged reorder risk"
          deltaTone="negative"
          icon={<FiAlertTriangle color="var(--warning)" />}
        />
        <StatCard
          label="Average DOI (Days of Inventory)"
          value="18.4 Days"
          delta={1.2}
          deltaLabel="within optimal range (15-21d)"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "sku_stock", label: "SKU Stock Breakdown" },
          { value: "distributor_matrix", label: "Distributor Stock Heatmap" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid ───────────────────────────── */}
      {activeTab === "sku_stock" && (
        <div className={styles.mainLayout}>
          {/* Left: Inventory Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Distributor Inventory Log</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search SKU, Brand or Distributor..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredInventory}
              columns={inventoryColumns}
              onRowClick={handleRowClick}
              emptyMessage="No inventory items match selected filters."
            />
          </div>

          {/* Right: Stock Velocity Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Stock Level & Safety Buffer</h3>
            </div>
            <BarChart
              labels={["Beverages", "Personal Care", "Snacks", "Home Care", "Dairy"]}
              series={[
                { name: "Available Stock (Cases)", data: [4200, 2800, 5100, 1900, 3100], color: "var(--primary)" },
                { name: "Safety Buffer (Cases)", data: [1500, 1200, 1800, 1000, 1100], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "distributor_matrix" && (
        <div className={styles.mainLayout}>
          {/* Left: Distributor Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Distributor Warehouse Health</h3>
            </div>
            <Table
              data={mockDistributorMatrix}
              columns={distributorColumns}
              emptyMessage="No distributor hub records found."
            />
          </div>

          {/* Right: Category Distribution Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Regional Stock Allocation</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Beverages", value: 38 },
                  { label: "Snacks", value: 32 },
                  { label: "Personal Care", value: 18 },
                  { label: "Home Care", value: 12 }
                ]}
                colors={["var(--primary)", "var(--success)", "var(--warning)", "var(--text-3)"]}
                innerRadius={0.68}
                centerLabel="Total Value"
                centerSubLabel="₹1.84Cr"
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
        description={`Stock details for ${selectedItem?.distributor}`}
        side="right"
        size="md"
      >
        {selectedItem && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Category</span>
                <strong>{selectedItem.category}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Warehouse Location</span>
                <strong>{selectedItem.details.warehouse}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Available Stock</span>
                <strong>{selectedItem.stockCases} Cases ({selectedItem.stockValue})</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Reorder Threshold</span>
                <strong>{selectedItem.reorderLevel} Cases</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Avg Daily Velocity</span>
                <strong>{selectedItem.details.avgDailySales}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Lead Time</span>
                <strong>{selectedItem.details.leadTime}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Stock Status & Replenishment Summary
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.5 }}>
                This SKU is currently <strong>{selectedItem.status}</strong> at {selectedItem.distributor}. With a current stock level of {selectedItem.stockCases} cases and average daily consumption of {selectedItem.details.avgDailySales}, estimated coverage is <strong>{selectedItem.doi}</strong>.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
