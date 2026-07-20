"use client";

import React, { useState, useMemo } from "react";
import {
  FiMapPin, FiClock, FiAlertTriangle, FiCheckCircle,
  FiTrendingDown, FiMap, FiSearch, FiDownload, FiActivity,
  FiChevronRight, FiFilter, FiRefreshCw, FiCalendar, FiSliders
} from "react-icons/fi";
import {
  Badge, Card, StatCard, Table, Avatar, Chip, Button, Tooltip, Drawer, Tabs
} from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const adherenceTrendLabels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"];
const adherenceTrendSeries = [
  { name: "Network Adherence (%)", data: [78, 80, 81, 79, 85, 87, 86, 89, 91, 92, 94, 96], color: "var(--success)" },
  { name: "Sequence Violations", data: [15, 14, 18, 12, 10, 8, 9, 6, 5, 4, 3, 2], color: "var(--warning)" }
];

const adherenceData = [
  {
    id: "SO-101",
    name: "Rohit Sharma",
    route: "Delhi East - Mon Beat",
    zone: "Delhi East",
    planned: 45,
    visited: 43,
    sequenceScore: 95,
    durationDeviation: "+12m",
    status: "Excellent",
    avatarColor: "var(--success)",
    timeline: [
      { time: "09:00 AM", shop: "Sharma General Store", status: "visited", notes: "On time" },
      { time: "09:45 AM", shop: "Aggarwal Provisions", status: "visited", notes: "Sequence match" },
      { time: "10:30 AM", shop: "Balaji Traders", status: "seq-error", notes: "Out of sequence (Visited early)" },
      { time: "11:15 AM", shop: "Gupta Retail", status: "missed", notes: "Shop closed" },
    ]
  },
  {
    id: "SO-102",
    name: "Neha Patel",
    route: "Delhi Central - Tue Beat",
    zone: "Delhi Central",
    planned: 38,
    visited: 38,
    sequenceScore: 100,
    durationDeviation: "-5m",
    status: "Excellent",
    avatarColor: "var(--primary)",
    timeline: [
      { time: "09:30 AM", shop: "Karan Provisions", status: "visited", notes: "On time" },
      { time: "10:15 AM", shop: "Shri Krishna Stores", status: "visited", notes: "On time" },
      { time: "11:00 AM", shop: "Metro Mart Noida", status: "visited", notes: "On time" },
    ]
  },
  {
    id: "SO-103",
    name: "Priya Singh",
    route: "Noida South - Wed Beat",
    zone: "Noida",
    planned: 50,
    visited: 40,
    sequenceScore: 80,
    durationDeviation: "+45m",
    status: "Poor",
    avatarColor: "var(--warning)",
    timeline: [
      { time: "10:00 AM", shop: "Royal Groceries", status: "visited", notes: "Late start" },
      { time: "11:30 AM", shop: "Saraswati Supermarket", status: "missed", notes: "Skipped route segment" },
      { time: "01:00 PM", shop: "Kalyani Provisions", status: "seq-error", notes: "Out of sequence" },
    ]
  },
  {
    id: "SO-104",
    name: "Arjun Mehta",
    route: "Gurugram - Mon Beat",
    zone: "Gurugram",
    planned: 42,
    visited: 39,
    sequenceScore: 88,
    durationDeviation: "+20m",
    status: "Average",
    avatarColor: "var(--primary)",
    timeline: [
      { time: "09:15 AM", shop: "Apna Bazaar", status: "visited", notes: "On time" },
      { time: "10:45 AM", shop: "Janta Kirana Store", status: "missed", notes: "Traffic delay reported" },
    ]
  },
  {
    id: "SO-105",
    name: "Vikas Verma",
    route: "Delhi West - Thu Beat",
    zone: "Delhi West",
    planned: 40,
    visited: 39,
    sequenceScore: 97,
    durationDeviation: "+8m",
    status: "Excellent",
    avatarColor: "var(--success)",
    timeline: [
      { time: "09:05 AM", shop: "Om General Store", status: "visited", notes: "On time" },
      { time: "10:10 AM", shop: "New India Mart", status: "visited", notes: "On time" },
    ]
  },
  {
    id: "SO-106",
    name: "Ananya Roy",
    route: "Faridabad North - Fri Beat",
    zone: "Faridabad",
    planned: 36,
    visited: 30,
    sequenceScore: 75,
    durationDeviation: "+55m",
    status: "Poor",
    avatarColor: "var(--danger)",
    timeline: [
      { time: "09:40 AM", shop: "National Traders", status: "visited", notes: "Delayed check-in" },
      { time: "11:20 AM", shop: "Metro Supermarket", status: "seq-error", notes: "Sequence mismatch" },
    ]
  }
];

export default function AdherenceReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSO, setSelectedSO] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter SOs by search, zone, and status
  const filteredData = useMemo(() => {
    return adherenceData.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.route.toLowerCase().includes(searchQuery.toLowerCase());
      const matchZone = selectedZone === "All" || d.zone === selectedZone;
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchQuery, selectedZone, statusFilter]);

  const handleRowClick = (so) => {
    setSelectedSO(so);
    setDrawerOpen(true);
  };

  const columns = [
    {
      key: "so",
      label: "Sales Officer & Route",
      render: (_, row) => (
        <div className={styles.soMeta}>
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`}
            size="md"
            style={{ background: row.avatarColor, color: "#fff" }}
          />
          <div>
            <strong>{row.name}</strong>
            <span>{row.route}</span>
          </div>
        </div>
      )
    },
    {
      key: "visits",
      label: "Visits (Actual / Planned)",
      render: (_, row) => {
        const percent = Math.round((row.visited / row.planned) * 100);
        let color = "var(--success)";
        if (percent < 90) color = "var(--warning)";
        if (percent < 80) color = "var(--danger)";
        
        return (
          <div className={styles.progressCell}>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${percent}%`, background: color }} />
            </div>
            <span>{row.visited}/{row.planned}</span>
          </div>
        );
      }
    },
    {
      key: "sequenceScore",
      label: "Sequence Score",
      render: (val) => (
        <span style={{ fontWeight: 600, color: val >= 95 ? "var(--success)" : val >= 85 ? "var(--warning)" : "var(--danger)" }}>
          {val}%
        </span>
      )
    },
    {
      key: "durationDeviation",
      label: "Time Deviation",
      render: (val) => {
        const isLate = val.startsWith("+");
        return (
          <Badge tone={isLate ? "danger" : "success"} size="sm">
            {val}
          </Badge>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <Chip tone={val === "Excellent" ? "success" : val === "Average" ? "warning" : "danger"}>
          {val}
        </Chip>
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
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiActivity />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Route Adherence Report</h2>
            <p className={styles.subtitle}>Analyze Planned vs Actual route adherence, sequence violations, and field travel efficiency.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />}>
            Export Report
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
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Excellent">Excellent (&gt;95%)</option>
              <option value="Average">Average (85-95%)</option>
              <option value="Poor">Poor (&lt;85%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Network Adherence Rate"
          value="96%"
          delta={2.4}
          deltaLabel="vs last week"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--success)" />}
        />
        <StatCard
          label="Sequence Violations"
          value="42"
          delta={-12.5}
          deltaLabel="vs last week"
          deltaTone="positive"
          icon={<FiTrendingDown color="var(--warning)" />}
        />
        <StatCard
          label="Missed Check-ins"
          value="18"
          delta={-5.2}
          deltaLabel="vs last week"
          deltaTone="positive"
          icon={<FiAlertTriangle color="var(--danger)" />}
        />
        <StatCard
          label="Avg. Route Deviation"
          value="+14m"
          delta={4.1}
          deltaLabel="vs last week"
          deltaTone="negative"
          icon={<FiClock color="var(--text-2)" />}
        />
      </div>

      {/* ── Main Content Layout ────────────────────────── */}
      <div className={styles.mainLayout}>
        {/* Left: Detailed Data Table */}
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>Sales Officer Adherence Breakdown</h3>
            <div className={styles.sectionControls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search Rep or Route..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <FiSearch />
              </div>
            </div>
          </div>
          <Table
            data={filteredData}
            columns={columns}
            onRowClick={handleRowClick}
            emptyMessage="No adherence data found for current filters."
          />
        </div>

        {/* Right: Trend Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>12-Week Adherence Trend</h3>
          </div>
          <div style={{ height: "300px" }}>
            <AreaChart 
              labels={adherenceTrendLabels} 
              series={adherenceTrendSeries} 
              height="100%" 
            />
          </div>
        </div>
      </div>

      {/* ── Detail Drawer (Timeline) ───────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Route Adherence Details"
        size="md"
      >
        {selectedSO && (
          <div className={styles.drawerContent}>
            <div className={styles.drawerHeader}>
              <Avatar
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${selectedSO.name}`}
                size="lg"
                style={{ background: selectedSO.avatarColor, color: "#fff" }}
              />
              <div>
                <h3>{selectedSO.name}</h3>
                <p>{selectedSO.route} • {selectedSO.visited}/{selectedSO.planned} Visits Completed</p>
              </div>
            </div>

            <div className={styles.miniMap}>
              <div className={styles.mapPlaceholder}>
                <FiMap size={32} />
                <span>Simulated Map View</span>
                <span style={{ fontSize: "12px" }}>Showing actual GPS trail vs planned vector path</span>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: "var(--space-4)", fontWeight: 600 }}>Sequence Timeline</h4>
              <div className={styles.drawerTimeline}>
                {selectedSO.timeline.map((evt, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${
                      evt.status === "missed" ? styles.dotMissed : 
                      evt.status === "seq-error" ? styles.dotSeqErr : ""
                    }`} />
                    <div className={styles.timelineContent}>
                      <div className={styles.tTop}>
                        <strong>{evt.shop}</strong>
                        <span className={styles.tTime}>{evt.time}</span>
                      </div>
                      <div className={styles.tStatus}>
                        <Chip size="sm" tone={
                          evt.status === "visited" ? "success" :
                          evt.status === "missed" ? "danger" : "warning"
                        }>
                          {evt.status === "visited" ? "Visited" :
                           evt.status === "missed" ? "Missed" : "Sequence Error"}
                        </Chip>
                        <span style={{ fontSize: "12px", color: "var(--text-3)", display: "flex", alignItems: "center" }}>
                          {evt.notes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
