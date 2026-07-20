"use client";

import React, { useState, useMemo } from "react";
import {
  FiFileText, FiSearch, FiDownload, FiShield, FiFilter, FiCalendar
} from "react-icons/fi";
import {
  Button, Badge, Select, Table, useToast, Avatar
} from "../../../../../components/ui";
import styles from "./page.module.scss";

// Mock Data
const mockAuditLogs = [
  { id: "EVT-1029", timestamp: "2026-07-20 12:45:00", user: "Arkalal Chakravarty", role: "System Admin", module: "Master Data", action: "Triggered ERP Sync", status: "Success", ip: "192.168.1.45" },
  { id: "EVT-1028", timestamp: "2026-07-20 12:30:15", user: "Priya Singh", role: "Zonal Manager", module: "Territories", action: "Reassigned Route 4A", status: "Success", ip: "10.0.4.12" },
  { id: "EVT-1027", timestamp: "2026-07-20 11:15:22", user: "Anil Sharma", role: "National Sales Head", module: "Projections", action: "Overrode Q3 Target", status: "Warning", ip: "10.0.1.55" },
  { id: "EVT-1026", timestamp: "2026-07-20 10:05:10", user: "System", role: "Automated", module: "Projections", action: "Generated Forecast (Nightly)", status: "Success", ip: "localhost" },
  { id: "EVT-1025", timestamp: "2026-07-20 09:12:00", user: "Unknown", role: "Guest", module: "Authentication", action: "Failed Login Attempt", status: "Failed", ip: "203.0.113.42" },
];

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModule, setFilterModule] = useState("All");
  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Audit Logs Exported",
      description: "A secure copy of the audit logs has been saved to your downloads.",
      tone: "success"
    });
  };

  // Table Columns Setup
  const logCols = [
    {
      key: "timestamp",
      label: "Timestamp & Event ID",
      sortable: true,
      render: (_, row) => (
        <div className={styles.entityMeta}>
          <strong>{row.timestamp}</strong>
          <span className="rc-tnum">{row.id}</span>
        </div>
      )
    },
    {
      key: "user",
      label: "User / Actor",
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar fallback={row.user.substring(0,2)} size="sm" />
          <div className={styles.entityMeta}>
            <strong>{row.user}</strong>
            <span>{row.role}</span>
          </div>
        </div>
      )
    },
    { key: "module", label: "Module" },
    { key: "action", label: "Action Taken" },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <Badge tone={val === "Success" ? "success" : val === "Failed" ? "danger" : "warning"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "ip",
      label: "IP Address",
      render: (val) => <span className="rc-tnum" style={{ color: 'var(--text-2)' }}>{val}</span>
    }
  ];

  const filteredData = useMemo(() => {
    return mockAuditLogs.filter(item => {
      const matchesSearch = item.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = filterModule === "All" || item.module === filterModule;
      return matchesSearch && matchesModule;
    });
  }, [searchQuery, filterModule]);

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiFileText />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Administration</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>System Audit Logs</h2>
            <p className={styles.subtitle}>
              Immutable record of all system events, configuration changes, and data overrides across the RetailConnect platform.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Audit Trail
          </Button>
        </div>
      </div>

      {/* ── 2. Security Summary Banner ───────────────────────────── */}
      <div className={styles.securityBanner}>
        <div className={styles.bannerAlert}>
          <FiShield className={styles.alertIcon} />
          <div className={styles.alertInfo}>
            <strong>Security Posture Normal</strong>
            <span>All sub-systems reporting standard activity</span>
          </div>
        </div>
        <div className={styles.bannerStats}>
          <div className={styles.statCol}>
            <span>Events Today</span>
            <strong className="rc-tnum">14,230</strong>
          </div>
          <div className={styles.statCol}>
            <span>Active Sessions</span>
            <strong className="rc-tnum">112</strong>
          </div>
          <div className={styles.statCol}>
            <span>Failed Logins</span>
            <strong className="rc-tnum" style={{ color: "var(--danger)" }}>14</strong>
          </div>
        </div>
        <div className={styles.bannerAction}>
          <Button variant="outline" size="sm">
            Security Settings
          </Button>
        </div>
      </div>

      {/* ── 3. Filter Toolbar ─────────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by User, Action, or Event ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch />
          </div>
          <div className={styles.filterGroup}>
            <FiFilter style={{ color: "var(--text-3)" }} />
            <select 
              className={styles.selectInput}
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
            >
              <option value="All">All Modules</option>
              <option value="Master Data">Master Data</option>
              <option value="Territories">Territories</option>
              <option value="Projections">Projections</option>
              <option value="Authentication">Authentication</option>
            </select>
          </div>
        </div>
        <div className={styles.filterGroup}>
          <FiCalendar style={{ color: "var(--text-3)" }} />
          <select className={styles.selectInput}>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* ── 4. Main Data Table ─────────────────────────────────── */}
      <div className={styles.mainLayout}>
        <div className={styles.tableSection}>
          <Table 
            data={filteredData} 
            columns={logCols} 
            emptyMessage="No audit logs match the current filters." 
          />
        </div>
      </div>
    </div>
  );
}
