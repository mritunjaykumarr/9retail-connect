"use client";

import React, { useState, useMemo } from "react";
import {
  FiGift, FiSearch, FiDownload, FiFilter,
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiPlus, FiUsers, FiDollarSign, FiAward
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tooltip, Drawer, Modal, Tabs, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const mockIncentivesData = [
  {
    id: "INC-801",
    name: "Rohit Sharma",
    role: "Sales Officer (SO)",
    zone: "Delhi East",
    planName: "Q3 Target Super Achiever",
    target: "₹25.00L",
    achieved: "₹28.45L (113%)",
    calculatedPayout: "₹34,500",
    status: "Approved",
    color: "var(--primary)",
    details: {
      baseRate: "1.2% on Quota Target",
      tierBonus: "₹10,000 Super-Slab Bonus",
      approvalDate: "16 Jul 2026",
      approver: "Regional Manager",
      payoutPeriod: "Q3 FY26 Cycle 1"
    }
  },
  {
    id: "INC-802",
    name: "Neha Patel",
    role: "Sales Officer (SO)",
    zone: "Delhi Central",
    planName: "Q3 Target Super Achiever",
    target: "₹30.00L",
    achieved: "₹31.50L (105%)",
    calculatedPayout: "₹28,200",
    status: "Approved",
    color: "var(--success)",
    details: {
      baseRate: "1.0% on Quota Target",
      tierBonus: "₹5,000 Tier-1 Bonus",
      approvalDate: "16 Jul 2026",
      approver: "Regional Manager",
      payoutPeriod: "Q3 FY26 Cycle 1"
    }
  },
  {
    id: "INC-803",
    name: "Sharma General Store",
    role: "Retail Partner",
    zone: "Delhi East",
    planName: "Retailer Loyalty Slab C",
    target: "₹1.50L",
    achieved: "₹1.85L (123%)",
    calculatedPayout: "₹8,500",
    status: "Disbursed",
    color: "var(--warning)",
    details: {
      baseRate: "Flat Slab Reward",
      tierBonus: "₹1,000 Display Addition",
      approvalDate: "14 Jul 2026",
      approver: "Area Manager",
      payoutPeriod: "Monthly Retailer Club"
    }
  },
  {
    id: "INC-804",
    name: "Priya Singh",
    role: "Sales Officer (SO)",
    zone: "Noida",
    planName: "New Outlet Acquisition Scheme",
    target: "20 Outlets",
    achieved: "24 Outlets (120%)",
    calculatedPayout: "₹18,000",
    status: "Pending Approval",
    color: "var(--primary)",
    details: {
      baseRate: "₹750 per active outlet",
      tierBonus: "₹3,000 Milestone Bonus",
      approvalDate: "Pending Review",
      approver: "Area Manager",
      payoutPeriod: "Jul 2026 Campaign"
    }
  },
  {
    id: "INC-805",
    name: "Arjun Mehta",
    role: "Sales Officer (SO)",
    zone: "Gurugram",
    planName: "Q3 Target Super Achiever",
    target: "₹28.00L",
    achieved: "₹26.00L (93%)",
    calculatedPayout: "₹12,400",
    status: "In Processing",
    color: "var(--primary)",
    details: {
      baseRate: "0.8% Pro-rata Payout",
      tierBonus: "N/A",
      approvalDate: "15 Jul 2026",
      approver: "Regional Manager",
      payoutPeriod: "Q3 FY26 Cycle 1"
    }
  },
  {
    id: "INC-806",
    name: "Aggarwal Provisions",
    role: "Retail Partner",
    zone: "Delhi Central",
    planName: "Retailer Loyalty Slab B",
    target: "₹1.00L",
    achieved: "₹1.12L (112%)",
    calculatedPayout: "₹5,000",
    status: "Disbursed",
    color: "var(--success)",
    details: {
      baseRate: "Flat Slab Reward",
      tierBonus: "N/A",
      approvalDate: "12 Jul 2026",
      approver: "Area Manager",
      payoutPeriod: "Monthly Retailer Club"
    }
  }
];

const mockRetailerMatrix = [
  { id: "RET-01", clubTier: "Platinum Partners", outletsCount: 145, minQuarterlyBooking: "₹3.00L", avgPayout: "₹18,500", status: "Active" },
  { id: "RET-02", clubTier: "Gold Partners", outletsCount: 380, minQuarterlyBooking: "₹1.50L", avgPayout: "₹8,500", status: "Active" },
  { id: "RET-03", clubTier: "Silver Partners", outletsCount: 620, minQuarterlyBooking: "₹75,000", avgPayout: "₹3,500", status: "Active" },
  { id: "RET-04", clubTier: "Bronze Outlets", outletsCount: 840, minQuarterlyBooking: "₹30,000", avgPayout: "₹1,200", status: "Active" }
];

export default function IncentivesPage() {
  const [activeTab, setActiveTab] = useState("so_incentives");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for new incentive modal
  const [newPlanName, setNewPlanName] = useState("");
  const [newRole, setNewRole] = useState("Sales Officer (SO)");
  const [newSlabTarget, setNewSlabTarget] = useState("");
  const [newRate, setNewRate] = useState("");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Incentive Report Exported",
      description: "Calculated incentive payouts downloaded to CSV.",
      tone: "success"
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Incentive Plan Created",
      description: `Plan "${newPlanName || 'New Incentive Plan'}" created and configured.`,
      tone: "success"
    });
    setNewPlanName("");
    setNewSlabTarget("");
    setNewRate("");
  };

  // Filter Incentives Data
  const filteredIncentives = useMemo(() => {
    return mockIncentivesData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = selectedRole === "All" || item.role === selectedRole;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [searchQuery, selectedRole, statusFilter]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const soColumns = [
    {
      key: "name",
      label: "Performer",
      sortable: true,
      render: (_, row) => (
        <div className={styles.performerMeta}>
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`}
            size="sm"
            style={{ background: row.color, color: "#fff" }}
          />
          <div>
            <strong>{row.name}</strong>
            <span>{row.zone}</span>
          </div>
        </div>
      )
    },
    {
      key: "planName",
      label: "Incentive Plan",
      sortable: true,
      render: (_, row) => (
        <div className={styles.planMeta}>
          <strong>{row.planName}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    { key: "target", label: "Target" },
    { key: "achieved", label: "Achieved" },
    {
      key: "calculatedPayout",
      label: "Payout",
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
        const tone = val === "Approved" || val === "Disbursed" ? "success" : val === "Pending Approval" ? "warning" : val === "In Processing" ? "primary" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Incentive Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const retailerColumns = [
    {
      key: "clubTier",
      label: "Loyalty Club Tier",
      render: (_, row) => (
        <div className={styles.planMeta}>
          <strong>{row.clubTier}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    { key: "outletsCount", label: "Enrolled Outlets" },
    { key: "minQuarterlyBooking", label: "Min Quarterly Booking" },
    { key: "avgPayout", label: "Avg Payout / Outlet", render: (val) => <strong>{val}</strong> },
    {
      key: "status",
      label: "Tier Status",
      render: (val) => (
        <Badge tone="success" variant="soft" dot>
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
            <FiGift />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Incentives & Payout Management</h2>
            <p className={styles.subtitle}>
              Build sales officer & retailer incentive structures, track slab achievements, calculate commission payouts, and monitor target fulfillment.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiPlus />} onClick={() => setModalOpen(true)}>
            Create Incentive Plan
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Payouts
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Target Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Roles</option>
              <option value="Sales Officer (SO)">Sales Officer (SO)</option>
              <option value="Retail Partner">Retail Partner</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Payout Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="In Processing">In Processing</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Incentive Pool"
          value="₹18.50L"
          delta={8.2}
          deltaLabel="vs last quarter"
          deltaTone="positive"
          icon={<FiGift color="var(--primary)" />}
        />
        <StatCard
          label="Eligible Performers"
          value="864 Participants"
          delta={92.4}
          deltaLabel="qualification rate"
          deltaTone="positive"
          icon={<FiUsers color="var(--success)" />}
        />
        <StatCard
          label="Average Payout / Performer"
          value="₹21,400"
          delta={5.1}
          deltaLabel="vs target slab"
          deltaTone="positive"
          icon={<FiAward color="var(--warning)" />}
        />
        <StatCard
          label="Approved Disbursal Value"
          value="₹14.20L"
          deltaLabel="100% processed on schedule"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "so_incentives", label: "Sales Officer Payout Log" },
          { value: "retailer_incentives", label: "Retailer Loyalty Matrix" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid ───────────────────────────── */}
      {activeTab === "so_incentives" && (
        <div className={styles.mainLayout}>
          {/* Left: Incentives Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Incentive Payout Directory</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search Performer, Plan Name or Territory..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredIncentives}
              columns={soColumns}
              onRowClick={handleRowClick}
              emptyMessage="No incentive payouts match selected filters."
            />
          </div>

          {/* Right: Disbursal Trend Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Quarterly Incentive Disbursal Trend</h3>
            </div>
            <BarChart
              labels={["Q1 FY26", "Q2 FY26", "Q3 FY26", "Q4 FY26 (Est)"]}
              series={[
                { name: "Disbursed Payout (₹ Lakhs)", data: [12.4, 15.1, 14.2, 18.5], color: "var(--primary)" },
                { name: "Budget Pool (₹ Lakhs)", data: [15.0, 16.5, 16.0, 20.0], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "retailer_incentives" && (
        <div className={styles.mainLayout}>
          {/* Left: Retailer Loyalty Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Retailer Club Tier Matrix</h3>
            </div>
            <Table
              data={mockRetailerMatrix}
              columns={retailerColumns}
              emptyMessage="No retailer loyalty tier records found."
            />
          </div>

          {/* Right: Tier Distribution Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Retailer Club Enrollment Breakdown</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Bronze Outlets", value: 840 },
                  { label: "Silver Partners", value: 620 },
                  { label: "Gold Partners", value: 380 },
                  { label: "Platinum Partners", value: 145 }
                ]}
                colors={["var(--text-3)", "var(--primary)", "var(--warning)", "var(--success)"]}
                innerRadius={0.68}
                centerLabel="Total Retailers"
                centerSubLabel="1,985 Outlets"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`Incentive Details: ${selectedItem?.name}`}
        description={`Plan: ${selectedItem?.planName} • ${selectedItem?.role}`}
        side="right"
        size="md"
      >
        {selectedItem && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Target Role</span>
                <strong>{selectedItem.role}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Territory Zone</span>
                <strong>{selectedItem.zone}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Quota Target</span>
                <strong>{selectedItem.target}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Achieved Performance</span>
                <strong>{selectedItem.achieved}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Calculated Payout</span>
                <strong>{selectedItem.calculatedPayout}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Approval Status</span>
                <strong>{selectedItem.status}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Incentive Calculation & Audit Details
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Base Payout Formula:</strong> {selectedItem.details.baseRate}</div>
                <div><strong>Milestone / Tier Bonus:</strong> {selectedItem.details.tierBonus}</div>
                <div><strong>Payout Cycle:</strong> {selectedItem.details.payoutPeriod}</div>
                <div><strong>Authorized By:</strong> {selectedItem.details.approver} ({selectedItem.details.approvalDate})</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Create Incentive Plan Modal ──────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Incentive Plan"
        description="Define target roles, slab qualifications, commission formulas, and payout structures."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Plan Name
            </label>
            <Input
              placeholder="e.g. Q4 Peak Season Target Accelerator"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Target Role
              </label>
              <Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                options={[
                  { label: "Sales Officer (SO)", value: "Sales Officer (SO)" },
                  { label: "Retail Partner", value: "Retail Partner" },
                  { label: "Distributor Rep", value: "Distributor Rep" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Slab Target Threshold
              </label>
              <Input
                placeholder="e.g. 100% Quota or ₹2.0L"
                value={newSlabTarget}
                onChange={(e) => setNewSlabTarget(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Commission / Bonus Formula
            </label>
            <Input
              placeholder="e.g. 1.5% on sales over quota + ₹5,000 bonus"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Launch Incentive Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
