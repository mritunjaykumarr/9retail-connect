"use client";

import React, { useState, useMemo } from "react";
import {
  FiBell, FiSearch, FiSliders, FiCheckSquare,
  FiAlertTriangle, FiCheckCircle, FiClock, FiShoppingBag,
  FiChevronRight, FiPackage, FiTarget, FiGift, FiActivity, FiShield
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Button, Drawer, Modal, Tabs, Badge, Switch, useToast
} from "../../../../components/ui";
import BarChart from "../../../../components/ui/Chart/BarChart";
import Donut from "../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const mockNotificationsData = [
  {
    id: "NTF-401",
    title: "Stock Alert: Low Safety Buffer",
    category: "Stock & Inventory",
    source: "Delhi Central Hub",
    timestamp: "10 mins ago",
    priority: "High Priority",
    isUnread: true,
    icon: <FiPackage color="var(--danger)" />,
    details: {
      sku: "Sparkle Water 1L Case",
      stockOnHand: "140 Cases",
      reorderPoint: "300 Cases",
      impact: "Depletion risk within 48 hours unless primary replenishment is initiated.",
      actionText: "Create Primary PO"
    }
  },
  {
    id: "NTF-402",
    title: "Primary Order Acceptance Needed",
    category: "Order Alerts",
    source: "Faridabad Hub • PO-9902",
    timestamp: "32 mins ago",
    priority: "Action Needed",
    isUnread: true,
    icon: <FiShoppingBag color="var(--warning)" />,
    details: {
      orderId: "PO-9902",
      bookedAmount: "₹2,45,000",
      soName: "Ananya Roy",
      impact: "Requires Area Sales Manager sign-off for priority factory dispatch.",
      actionText: "Approve Purchase Order"
    }
  },
  {
    id: "NTF-403",
    title: "Target Milestone Achieved!",
    category: "Target & Incentive",
    source: "Rohit Sharma • Delhi East",
    timestamp: "1 hour ago",
    priority: "Info",
    isUnread: true,
    icon: <FiTarget color="var(--success)" />,
    details: {
      soName: "Rohit Sharma",
      achievement: "113% of Q3 Target",
      value: "₹28.45L",
      impact: "Qualified for Tier-1 Super Achiever incentive payout (₹34,500).",
      actionText: "View Incentive Log"
    }
  },
  {
    id: "NTF-404",
    title: "Trade Scheme Verification Request",
    category: "Scheme & Offers",
    source: "Noida Territory",
    timestamp: "2 hours ago",
    priority: "Action Needed",
    isUnread: true,
    icon: <FiGift color="var(--warning)" />,
    details: {
      schemeName: "Monsoon Beverage Volume Bonanza",
      participation: "420 Outlets",
      impact: "Verify distributor payout slab adjustments prior to month-end disallowance.",
      actionText: "Review Scheme Rules"
    }
  },
  {
    id: "NTF-405",
    title: "GPS Check-In Deviation Warning",
    category: "Field Audit",
    source: "Priya Singh • Beat #04",
    timestamp: "3 hours ago",
    priority: "High Priority",
    isUnread: true,
    icon: <FiAlertTriangle color="var(--danger)" />,
    details: {
      soName: "Priya Singh",
      retailer: "Gupta Superstore",
      deviation: "520m out of geofence bounds",
      impact: "SO check-in tagged for compliance review.",
      actionText: "Inspect Beat Deviation"
    }
  },
  {
    id: "NTF-406",
    title: "Daily Secondary Sales Digest Ready",
    category: "System Digest",
    source: "System Engine",
    timestamp: "5 hours ago",
    priority: "Info",
    isUnread: true,
    icon: <FiActivity color="var(--primary)" />,
    details: {
      summary: "₹48.20L Total Booked Secondary Sales across 1,840 Active Outlets today.",
      topZone: "Delhi East (+24% growth)",
      impact: "All secondary order logs reconciled cleanly.",
      actionText: "Open Sales Dashboard"
    }
  },
  {
    id: "NTF-407",
    title: "Security & Login Audit Passed",
    category: "System Security",
    source: "Security Module",
    timestamp: "1 day ago",
    priority: "Info",
    isUnread: false,
    icon: <FiShield color="var(--success)" />,
    details: {
      event: "Role-based permission check",
      impact: "0 unauthorized access attempts detected in last 24 hours.",
      actionText: "View Audit Logs"
    }
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotificationsData);
  const [activeTab, setActiveTab] = useState("all_notifications");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  // Preference Toggle States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);

  const { toast } = useToast();

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    toast?.({
      title: "All Notifications Marked as Read",
      description: "6 unread notifications marked as read.",
      tone: "success"
    });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPreferencesModalOpen(false);
    toast?.({
      title: "Notification Preferences Saved",
      description: "Your alert delivery preferences have been updated.",
      tone: "success"
    });
  };

  // Filter Notifications Data
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat = categoryFilter === "All" || item.category === categoryFilter;
      const matchPriority = priorityFilter === "All" || item.priority === priorityFilter;
      
      let matchTab = true;
      if (activeTab === "unread_notifications") matchTab = item.isUnread;
      if (activeTab === "urgent_notifications") matchTab = item.priority === "High Priority" || item.priority === "Action Needed";

      let matchStatus = true;
      if (statusFilter === "Unread") matchStatus = item.isUnread;
      if (statusFilter === "Read") matchStatus = !item.isUnread;

      return matchSearch && matchCat && matchPriority && matchTab && matchStatus;
    });
  }, [notifications, searchQuery, categoryFilter, priorityFilter, activeTab, statusFilter]);

  const handleRowClick = (notif) => {
    // Mark single notification as read on view
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isUnread: false } : n));
    setSelectedNotif(notif);
    setDrawerOpen(true);
  };

  const notificationColumns = [
    {
      key: "title",
      label: "Alert Title",
      sortable: true,
      render: (_, row) => (
        <div className={styles.notifMeta}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "var(--surface-sunken)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "1rem"
          }}>
            {row.icon}
          </div>
          <div>
            <strong style={{ fontWeight: row.isUnread ? 700 : 500 }}>{row.title}</strong>
            <span>{row.source} • {row.id}</span>
          </div>
        </div>
      )
    },
    {
      key: "category",
      label: "Category & System",
      sortable: true,
      render: (_, row) => (
        <div className={styles.categoryMeta}>
          <strong>{row.category}</strong>
          <span>Automatic Event</span>
        </div>
      )
    },
    { key: "timestamp", label: "Time Received" },
    {
      key: "priority",
      label: "Urgency Level",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "High Priority" ? "danger" : val === "Action Needed" ? "warning" : "primary";
        return (
          <Badge tone={tone} variant="soft" dot>
            {val}
          </Badge>
        );
      }
    },
    {
      key: "isUnread",
      label: "Read Status",
      align: "center",
      render: (val) => (
        <Badge tone={val ? "warning" : "success"} variant="soft" dot>
          {val ? "UNREAD" : "READ"}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <Button variant="ghost" size="sm" iconOnly aria-label="View Details">
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
            <FiBell />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Account & System</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Notifications & Activity Feed</h2>
            <p className={styles.subtitle}>
              Everything that needs your attention — live order alerts, target milestones, scheme approvals, low-stock warnings, and field officer updates.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiCheckSquare />} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiSliders />} onClick={() => setPreferencesModalOpen(true)}>
            Notification Preferences
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Categories</option>
              <option value="Stock & Inventory">Stock & Inventory</option>
              <option value="Order Alerts">Order Alerts</option>
              <option value="Target & Incentive">Target & Incentive</option>
              <option value="Scheme & Offers">Scheme & Offers</option>
              <option value="Field Audit">Field Audit</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Urgency Level:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Priorities</option>
              <option value="High Priority">High Priority</option>
              <option value="Action Needed">Action Needed</option>
              <option value="Info">Info / Low</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Read Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread Only</option>
              <option value="Read">Read Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Unread Alerts"
          value={`${notifications.filter(n => n.isUnread).length} Items`}
          delta={3}
          deltaLabel="urgent high priority"
          deltaTone="negative"
          icon={<FiBell color="var(--primary)" />}
        />
        <StatCard
          label="Pending Approvals"
          value="4 Requests"
          deltaLabel="Order & scheme approvals"
          deltaTone="positive"
          icon={<FiClock color="var(--warning)" />}
        />
        <StatCard
          label="System Health"
          value="0 Errors"
          deltaLabel="100% services operational"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--success)" />}
        />
        <StatCard
          label="Daily Alerts Volume"
          value="42 Today"
          delta={12}
          deltaLabel="vs 7-day average"
          deltaTone="positive"
          icon={<FiActivity color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "all_notifications", label: "All Activity & Alerts" },
          { value: "unread_notifications", label: `Unread Only (${notifications.filter(n => n.isUnread).length})` },
          { value: "urgent_notifications", label: "Action Needed / Urgent" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid (Stacked Full Width) ──────── */}
      <div className={styles.mainLayout}>
        {/* Top: Notifications Table */}
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>System Notifications & Event Log</h3>
            <div className={styles.sectionControls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search Notification Title, Code, SO or Distributor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <FiSearch />
              </div>
            </div>
          </div>
          <Table
            data={filteredNotifications}
            columns={notificationColumns}
            onRowClick={handleRowClick}
            emptyMessage="No notifications match selected filters."
          />
        </div>

        {/* Bottom: Notification Volume BarChart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>7-Day Notification Volume & Category Breakdown</h3>
          </div>
          <BarChart
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            series={[
              { name: "Order & Field Alerts", data: [18, 24, 32, 28, 35, 22, 14], color: "var(--primary)" },
              { name: "System & Stock Alerts", data: [5, 8, 12, 6, 9, 4, 2], color: "var(--warning)" }
            ]}
            height={280}
          />
        </div>
      </div>

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedNotif?.title}
        description={`Alert ID: ${selectedNotif?.id} • ${selectedNotif?.timestamp}`}
        side="right"
        size="md"
      >
        {selectedNotif && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Category</span>
                <strong>{selectedNotif.category}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Source / Origin</span>
                <strong>{selectedNotif.source}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Urgency</span>
                <strong>{selectedNotif.priority}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Timestamp</span>
                <strong>{selectedNotif.timestamp}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Alert Details & Impact Analysis
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                {selectedNotif.details.impact}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                {Object.entries(selectedNotif.details).map(([k, v]) => (
                  k !== "impact" && k !== "actionText" && (
                    <div key={k}>
                      <strong style={{ textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, ' $1')}:</strong> {v}
                    </div>
                  )
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
              <Button variant="primary" size="sm" style={{ width: "100%" }}>
                {selectedNotif.details.actionText || "Take Action"}
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Preferences Modal ───────────────────────── */}
      <Modal
        open={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        title="Notification Delivery Preferences"
        description="Configure automated alert notifications across email, mobile push, and system dashboard channels."
        size="md"
      >
        <form onSubmit={handleSavePreferences} className={styles.formGrid}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: "var(--text-sm)", color: "var(--text-1)", display: "block" }}>Email Alerts</strong>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>Receive high-priority order and target digests via email.</span>
            </div>
            <Switch checked={emailAlerts} onChange={setEmailAlerts} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: "var(--text-sm)", color: "var(--text-1)", display: "block" }}>Mobile Push Notifications</strong>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>Instant alerts for beat route deviations & low stock.</span>
            </div>
            <Switch checked={mobilePush} onChange={setMobilePush} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: "var(--text-sm)", color: "var(--text-1)", display: "block" }}>Order Booking Notifications</strong>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>Alert when secondary order value exceeds ₹50,000.</span>
            </div>
            <Switch checked={orderAlerts} onChange={setOrderAlerts} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: "var(--text-sm)", color: "var(--text-1)", display: "block" }}>Distributor Low Stock Warnings</strong>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>Alert when distributor inventory falls below 3-day buffer.</span>
            </div>
            <Switch checked={stockAlerts} onChange={setStockAlerts} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setPreferencesModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Preferences
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
