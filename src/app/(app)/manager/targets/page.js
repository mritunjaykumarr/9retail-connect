"use client";

import React, { useState, useMemo } from "react";
import {
  FiTarget, FiSearch, FiDownload, FiFilter,
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiPackage, FiUser, FiMapPin, FiActivity
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tooltip, Tabs, Badge
} from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const targetTrendLabels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"];
const targetSeries = [
  { name: "Target Quota (₹ Lakhs)", data: [100, 100, 100, 100, 110, 110, 115, 115, 120, 120, 120, 120], color: "var(--primary)" },
  { name: "Achieved Sales (₹ Lakhs)", data: [68.2, 72.5, 75.1, 79.4, 82.0, 85.3, 89.1, 91.8, 94.0, 96.2, 97.5, 98.4], color: "var(--success)" }
];

const mockSoPerformance = [
  { id: "SO-101", name: "Rohit Sharma", zone: "Delhi East", target: "₹25.00L", achieved: "₹21.00L", pct: 84, status: "On Track", color: "var(--primary)" },
  { id: "SO-102", name: "Neha Patel", zone: "Delhi Central", target: "₹30.00L", achieved: "₹31.50L", pct: 105, status: "Overachieving", color: "var(--success)" },
  { id: "SO-103", name: "Priya Singh", zone: "Noida", target: "₹18.00L", achieved: "₹11.00L", pct: 61, status: "Behind", color: "var(--danger)" },
  { id: "SO-104", name: "Arjun Mehta", zone: "Gurugram", target: "₹28.00L", achieved: "₹26.00L", pct: 93, status: "On Track", color: "var(--primary)" },
  { id: "SO-105", name: "Vikas Verma", zone: "Delhi West", target: "₹32.00L", achieved: "₹33.50L", pct: 105, status: "Overachieving", color: "var(--success)" },
  { id: "SO-106", name: "Ananya Roy", zone: "Faridabad", target: "₹17.00L", achieved: "₹15.40L", pct: 90, status: "On Track", color: "var(--primary)" }
];

const mockCategoryFulfillment = [
  { id: "CAT-01", name: "Beverages", target: "₹45.00L", achieved: "₹41.00L", pct: 91, status: "On Track" },
  { id: "CAT-02", name: "Personal Care", target: "₹30.00L", achieved: "₹22.00L", pct: 73, status: "Behind" },
  { id: "CAT-03", name: "Snacks & Packaged", target: "₹45.00L", achieved: "₹35.40L", pct: 78, status: "On Track" },
];

export default function TargetsPage() {
  const [activeTab, setActiveTab] = useState("so_perf");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter SO Performance Data
  const filteredSoData = useMemo(() => {
    return mockSoPerformance.filter(so => {
      const matchSearch = so.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        so.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        so.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchZone = selectedZone === "All" || so.zone === selectedZone;
      const matchStatus = statusFilter === "All" || so.status === statusFilter;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchQuery, selectedZone, statusFilter]);

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
    { key: "target", label: "Quota Target", render: (val) => <strong>{val}</strong> },
    { key: "achieved", label: "Achieved Volume", render: (val) => <strong>{val}</strong> },
    {
      key: "pct",
      label: "Attainment %",
      render: (val) => {
        const barColor = val >= 100 ? "var(--success)" : val >= 80 ? "var(--primary)" : "var(--danger)";
        return (
          <div className={styles.progressCol}>
            <span style={{ fontWeight: 600, fontSize: "var(--text-xs)", color: barColor }}>{val}%</span>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${Math.min(100, val)}%`, background: barColor }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <Badge tone={val === "Overachieving" ? "success" : val === "On Track" ? "primary" : "danger"} variant="soft" dot>
          {val}
        </Badge>
      )
    }
  ];

  const categoryColumns = [
    { key: "name", label: "Category Name", render: (val) => <strong>{val}</strong> },
    { key: "target", label: "Category Target" },
    { key: "achieved", label: "Category Achieved" },
    {
      key: "pct",
      label: "Fulfillment %",
      render: (val) => {
        const barColor = val >= 90 ? "var(--success)" : val >= 75 ? "var(--primary)" : "var(--danger)";
        return (
          <div className={styles.progressCol}>
            <span style={{ fontWeight: 600, fontSize: "var(--text-xs)", color: barColor }}>{val}%</span>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${Math.min(100, val)}%`, background: barColor }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <Badge tone={val === "On Track" ? "primary" : "danger"} variant="soft" dot>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiTarget />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Targets & Quota Performance</h2>
            <p className={styles.subtitle}>
              Monitor territory target allocation, sales officer quota attainment, and category achievement velocity.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />}>
            Export Target Data
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
            <label>Target Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Overachieving">Overachieving</option>
              <option value="On Track">On Track</option>
              <option value="Behind">Behind</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Quota Target"
          value="₹120.00L"
          delta={12.5}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiTarget color="var(--primary)" />}
        />
        <StatCard
          label="Achieved Sales Volume"
          value="₹98.40L"
          delta={8.4}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiTrendingUp color="var(--success)" />}
        />
        <StatCard
          label="Remaining Quota Gap"
          value="₹21.60L"
          delta={-5.2}
          deltaLabel="to target completion"
          deltaTone="neutral"
          icon={<FiActivity color="var(--warning)" />}
        />
        <StatCard
          label="Overall Attainment Rate"
          value="82.0%"
          delta={4.1}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--primary)" />}
        />
      </div>

      {/* ── Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "so_perf", label: "SO Quota Matrix" },
          { value: "cat_fulfillment", label: "Category Fulfillment" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── Main Layout ────────────────────────────────── */}
      {activeTab === "so_perf" && (
        <div className={styles.mainLayout}>
          {/* Left: SO Performance Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Sales Officers Quota Performance</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search SO or Zone..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredSoData}
              columns={soColumns}
              emptyMessage="No sales officers found matching filters."
            />
          </div>

          {/* Right: Trend Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>12-Week Target vs Achievement Trend</h3>
            </div>
            <AreaChart
              labels={targetTrendLabels}
              series={targetSeries}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "cat_fulfillment" && (
        <div className={styles.mainLayout}>
          {/* Left: Category Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Category Target Fulfillment</h3>
            </div>
            <Table
              data={mockCategoryFulfillment}
              columns={categoryColumns}
              emptyMessage="No category records found."
            />
          </div>

          {/* Right: Donut Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Category Achievement Distribution</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={mockCategoryFulfillment.map(c => ({ label: c.name, value: parseFloat(c.achieved.replace(/[^0-9.]/g, "")) }))}
                colors={["var(--primary)", "var(--warning)", "var(--success)"]}
                innerRadius={0.68}
                centerLabel="Achieved"
                centerSubLabel="₹98.40L"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
