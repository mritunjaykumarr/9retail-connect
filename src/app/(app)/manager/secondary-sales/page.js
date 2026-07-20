"use client";

import React, { useState, useMemo } from "react";
import {
  FiShoppingCart, FiSearch, FiDownload, FiFilter,
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiPackage, FiUser, FiMapPin, FiCheck, FiX
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tooltip, Drawer, Tabs, Badge
} from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const secondarySalesTrendLabels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"];
const secondarySalesSeries = [
  { name: "Secondary Booking (₹ Lakhs)", data: [28.4, 31.2, 30.5, 34.1, 38.0, 39.5, 41.2, 43.8, 44.5, 46.0, 47.2, 48.25], color: "var(--primary)" },
  { name: "Fulfilled Orders (₹ Lakhs)", data: [27.1, 29.8, 29.0, 32.5, 36.2, 37.8, 39.1, 41.5, 42.1, 44.0, 45.1, 45.7], color: "var(--success)" }
];

const mockOrdersData = [
  {
    id: "ORD-8821",
    date: "18 Jul 2026, 11:30 AM",
    soName: "Rohit Sharma",
    soZone: "Delhi East",
    retailerName: "Sharma General Store",
    distributor: "East Delhi Logistics",
    itemsCount: 14,
    totalAmount: "₹18,450",
    status: "Fulfilled",
    paymentMode: "Credit (14 Days)",
    items: [
      { sku: "Sparkle Water 1L Case (12x)", qty: 5, price: 420, total: 2100 },
      { sku: "Crisp Chips Classic 50g", qty: 10, price: 650, total: 6500 },
      { sku: "Refresh Soda Can 330ml", qty: 8, price: 850, total: 6800 },
      { sku: "Energy Blast 250ml Pack", qty: 3, price: 1016, total: 3050 },
    ]
  },
  {
    id: "ORD-8822",
    date: "18 Jul 2026, 11:15 AM",
    soName: "Neha Patel",
    soZone: "Delhi Central",
    retailerName: "Aggarwal Provisions",
    distributor: "Central FMCG Distributors",
    itemsCount: 8,
    totalAmount: "₹12,200",
    status: "Processing",
    paymentMode: "UPI / Instant",
    items: [
      { sku: "Sparkle Water 500ml Case", qty: 8, price: 350, total: 2800 },
      { sku: "Crisp Chips Masala 50g", qty: 12, price: 650, total: 7800 },
      { sku: "Fruit Bite Bar 30g", qty: 4, price: 400, total: 1600 },
    ]
  },
  {
    id: "ORD-8823",
    date: "18 Jul 2026, 10:45 AM",
    soName: "Priya Singh",
    soZone: "Noida",
    retailerName: "Royal Groceries",
    distributor: "Noida Wholesale Traders",
    itemsCount: 22,
    totalAmount: "₹34,800",
    status: "Fulfilled",
    paymentMode: "Cheque",
    items: [
      { sku: "Energy Blast 250ml Pack", qty: 15, price: 1016, total: 15240 },
      { sku: "Refresh Soda Can 330ml", qty: 15, price: 850, total: 12750 },
      { sku: "Sparkle Water 1L Case", qty: 16, price: 420, total: 6810 },
    ]
  },
  {
    id: "ORD-8824",
    date: "18 Jul 2026, 10:20 AM",
    soName: "Arjun Mehta",
    soZone: "Gurugram",
    retailerName: "Apna Bazaar",
    distributor: "Gurugram Supply Chain",
    itemsCount: 5,
    totalAmount: "₹8,400",
    status: "Pending",
    paymentMode: "Credit (7 Days)",
    items: [
      { sku: "Crisp Chips Classic 50g", qty: 8, price: 650, total: 5200 },
      { sku: "Sparkle Water 1L Case", qty: 7, price: 420, total: 2940 },
    ]
  },
  {
    id: "ORD-8825",
    date: "18 Jul 2026, 09:50 AM",
    soName: "Vikas Verma",
    soZone: "Delhi West",
    retailerName: "Om General Store",
    distributor: "Westside Distributors",
    itemsCount: 18,
    totalAmount: "₹26,750",
    status: "Fulfilled",
    paymentMode: "UPI / Instant",
    items: [
      { sku: "Fruit Bite Bar 30g", qty: 25, price: 400, total: 10000 },
      { sku: "Energy Blast 250ml Pack", qty: 10, price: 1016, total: 10160 },
      { sku: "Sparkle Water 500ml Case", qty: 18, price: 350, total: 6300 },
    ]
  },
  {
    id: "ORD-8826",
    date: "18 Jul 2026, 09:15 AM",
    soName: "Ananya Roy",
    soZone: "Faridabad",
    retailerName: "National Traders",
    distributor: "Faridabad Retail Hub",
    itemsCount: 3,
    totalAmount: "₹4,100",
    status: "Cancelled",
    paymentMode: "Cash on Delivery",
    items: [
      { sku: "Sparkle Water 1L Case", qty: 5, price: 420, total: 2100 },
      { sku: "Fruit Bite Bar 30g", qty: 5, price: 400, total: 2000 },
    ]
  }
];

const mockSoPerformance = [
  { id: "SO-101", name: "Rohit Sharma", zone: "Delhi East", orders: 342, totalValue: "₹9.85L", avgLines: 6.4, achievement: 104, color: "var(--success)" },
  { id: "SO-102", name: "Neha Patel", zone: "Delhi Central", orders: 310, totalValue: "₹8.90L", avgLines: 5.8, achievement: 98, color: "var(--primary)" },
  { id: "SO-103", name: "Priya Singh", zone: "Noida", orders: 295, totalValue: "₹8.15L", avgLines: 7.1, achievement: 91, color: "var(--warning)" },
  { id: "SO-104", name: "Arjun Mehta", zone: "Gurugram", orders: 328, totalValue: "₹9.40L", avgLines: 6.2, achievement: 101, color: "var(--primary)" },
  { id: "SO-105", name: "Vikas Verma", zone: "Delhi West", orders: 355, totalValue: "₹10.20L", avgLines: 6.9, achievement: 108, color: "var(--success)" },
  { id: "SO-106", name: "Ananya Roy", zone: "Faridabad", orders: 212, totalValue: "₹5.75L", avgLines: 4.5, achievement: 78, color: "var(--danger)" }
];

export default function SecondarySalesPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return mockOrdersData.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.soName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.distributor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchZone = selectedZone === "All" || o.soZone === selectedZone;
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchQuery, selectedZone, statusFilter]);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const orderColumns = [
    {
      key: "orderId",
      label: "Order ID & Time",
      render: (_, row) => (
        <div className={styles.orderMeta}>
          <strong>{row.id}</strong>
          <span>{row.date}</span>
        </div>
      )
    },
    {
      key: "soName",
      label: "Sales Officer & Zone",
      render: (_, row) => (
        <div className={styles.soMeta}>
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.soName}`}
            size="sm"
          />
          <div>
            <strong>{row.soName}</strong>
            <span>{row.soZone}</span>
          </div>
        </div>
      )
    },
    {
      key: "retailerName",
      label: "Retailer & Distributor",
      render: (_, row) => (
        <div className={styles.retailerMeta}>
          <strong>{row.retailerName}</strong>
          <span>{row.distributor}</span>
        </div>
      )
    },
    {
      key: "itemsCount",
      label: "Items",
      render: (val) => <span>{val} SKUs</span>
    },
    {
      key: "totalAmount",
      label: "Booking Value",
      render: (val) => <span className={styles.amountCell}>{val}</span>
    },
    {
      key: "status",
      label: "Fulfilment",
      render: (val) => (
        <Chip tone={val === "Fulfilled" ? "success" : val === "Processing" ? "info" : val === "Pending" ? "warning" : "danger"}>
          {val}
        </Chip>
      )
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <Button variant="ghost" size="sm" iconOnly aria-label="View Order Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const soColumns = [
    {
      key: "name",
      label: "Sales Officer & Zone",
      render: (_, row) => (
        <div className={styles.soMeta}>
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`}
            size="md"
            style={{ background: row.color, color: "#fff" }}
          />
          <div>
            <strong>{row.name}</strong>
            <span>{row.zone}</span>
          </div>
        </div>
      )
    },
    { key: "orders", label: "Orders Booked" },
    { key: "totalValue", label: "Secondary Revenue", render: (val) => <strong>{val}</strong> },
    { key: "avgLines", label: "Avg Lines / Order" },
    {
      key: "achievement",
      label: "Target Quota",
      render: (val) => (
        <span style={{ fontWeight: 600, color: val >= 100 ? "var(--success)" : val >= 90 ? "var(--primary)" : "var(--danger)" }}>
          {val}%
        </span>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiShoppingCart />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Secondary Sales Analytics</h2>
            <p className={styles.subtitle}>Monitor real-time order bookings captured by field reps, distributor fulfilment SLAs, and SKU revenue velocity.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />}>
            Export Secondary Data
          </Button>
        </div>
      </div>

      {/* ── Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Territory Zone:</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Zones</option>
              <option value="Delhi East">Delhi East</option>
              <option value="Delhi Central">Delhi Central</option>
              <option value="Delhi West">Delhi West</option>
              <option value="Noida">Noida</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Faridabad">Faridabad</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Order Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Secondary Sales Value"
          value="₹48.25L"
          delta={14.2}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiShoppingCart color="var(--primary)" />}
        />
        <StatCard
          label="Total Orders Booked"
          value="1,842"
          delta={8.5}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiPackage color="var(--success)" />}
        />
        <StatCard
          label="Fulfilment Rate"
          value="94.8%"
          delta={2.1}
          deltaLabel="vs SLA target"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--success)" />}
        />
        <StatCard
          label="Avg. Order Value (AOV)"
          value="₹2,620"
          delta={5.3}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiTrendingUp color="var(--primary)" />}
        />
      </div>

      {/* ── Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "orders", label: "Secondary Orders Log" },
          { value: "so_perf", label: "SO Booking Matrix" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── Main Layout ────────────────────────────────── */}
      {activeTab === "orders" && (
        <div className={styles.mainLayout}>
          {/* Left: Orders Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Recent Secondary Orders</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search Order, SO or Retailer..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredOrders}
              columns={orderColumns}
              onRowClick={handleRowClick}
              emptyMessage="No secondary orders found matching filters."
            />
          </div>

          {/* Right: Trend Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>12-Week Booking vs Fulfilment Trend</h3>
            </div>
            <div style={{ height: "320px" }}>
              <AreaChart 
                labels={secondarySalesTrendLabels} 
                series={secondarySalesSeries} 
                height="100%" 
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "so_perf" && (
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>Sales Officer Booking Breakdown</h3>
          </div>
          <Table
            data={mockSoPerformance}
            columns={soColumns}
            emptyMessage="No sales officer performance data found."
          />
        </div>
      )}

      {/* ── Detail Drawer ──────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Secondary Order Summary"
        size="md"
      >
        {selectedOrder && (
          <div className={styles.drawerContent}>
            <div className={styles.drawerHeader}>
              <div>
                <h3>{selectedOrder.id}</h3>
                <p>Booked: {selectedOrder.date}</p>
              </div>
              <Chip tone={selectedOrder.status === "Fulfilled" ? "success" : "info"}>
                {selectedOrder.status}
              </Chip>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Sales Officer</span>
                <strong>{selectedOrder.soName} ({selectedOrder.soZone})</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Retailer Outlet</span>
                <strong>{selectedOrder.retailerName}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Distributor</span>
                <strong>{selectedOrder.distributor}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Payment Term</span>
                <strong>{selectedOrder.paymentMode}</strong>
              </div>
            </div>

            <div className={styles.lineItemsSection}>
              <h4>Order Line Items ({selectedOrder.items.length} SKUs)</h4>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>SKU Name</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.sku}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                      <td><strong>₹{item.total.toLocaleString("en-IN")}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Total Order Value:</span>
              <span style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--primary)" }}>{selectedOrder.totalAmount}</span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
