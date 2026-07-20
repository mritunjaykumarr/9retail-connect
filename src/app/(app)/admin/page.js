"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiShield, FiUsers, FiMapPin, FiDatabase, FiFileText,
  FiActivity, FiCheckCircle, FiClock, FiCpu, FiServer,
  FiChevronRight, FiRefreshCw, FiSliders, FiLock, FiSettings, FiDownload
} from "react-icons/fi";
import {
  Table, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../components/ui";
import styles from "./page.module.scss";

/* --- BESPOKE ADMINISTRATION OVERVIEW MOCK DATA --- */

const mockAuditLogs = [
  {
    id: "LOG-9941",
    timestamp: "12:28 PM Today",
    user: "Rajesh Sharma (System Admin)",
    action: "Updated Target Baseline for Delhi East Area (Q3 2026)",
    module: "Projection Engine",
    ipAddress: "192.168.1.104",
    status: "Success",
    payloadDiff: "Changed Baseline from ₹1.85 Cr to ₹2.12 Cr"
  },
  {
    id: "LOG-9940",
    timestamp: "12:15 PM Today",
    user: "System Auto-Scheduler",
    action: "Triggered Secondary Sales ERP Synchronization",
    module: "Master Data Sync",
    ipAddress: "Internal Cron",
    status: "Success",
    payloadDiff: "Synced 14,200 Invoice Records from SAP S/4HANA"
  },
  {
    id: "LOG-9939",
    timestamp: "11:42 AM Today",
    user: "Anand Verma (Regional Director)",
    action: "Granted Territory Access to ASM Sanjay Singhania",
    module: "User & Roles",
    ipAddress: "192.168.1.142",
    status: "Success",
    payloadDiff: "Added Noida & Greater Noida Beat Permissions"
  },
  {
    id: "LOG-9938",
    timestamp: "10:30 AM Today",
    user: "System Security Sentinel",
    action: "Reset Password for Sales Officer Amit Kumar",
    module: "Security Portal",
    ipAddress: "192.168.1.88",
    status: "Verified",
    payloadDiff: "2FA Verified via Mobile SMS OTP"
  }
];

const mockIntegrations = [
  { name: "SAP S/4HANA ERP Connector", status: "Active & Synced", latency: "120ms Latency", lastSync: "4 Mins Ago", health: "Optimal" },
  { name: "Salesforce Automation API", status: "Connected", latency: "45ms Latency", lastSync: "12 Mins Ago", health: "Optimal" },
  { name: "PostgreSQL Primary Database", status: "Healthy Cluster", latency: "14% CPU Load", lastSync: "Live Stream", health: "Optimal" },
  { name: "Redis Session Cache", status: "Active", latency: "99.9% Hit Ratio", lastSync: "Live Stream", health: "Optimal" }
];

export default function AdminOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Maintenance Modal
  const [syncModule, setSyncModule] = useState("SAP Secondary Sales Invoices");
  const [maintenanceAction, setMaintenanceAction] = useState("Force Full Master Data Sync");

  const { toast } = useToast();

  const handleExportAudit = () => {
    toast?.({
      title: "System Audit Logs Exported",
      description: "Platform security telemetry & administrative audit logs exported to CSV.",
      tone: "success"
    });
  };

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "System Maintenance Action Triggered",
      description: `Executed ${maintenanceAction} for ${syncModule}.`,
      tone: "success"
    });
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const auditColumns = [
    {
      key: "user",
      label: "User & ID",
      sortable: true,
      render: (_, row) => (
        <div className={styles.auditMeta}>
          <strong>{row.user}</strong>
          <span>{row.timestamp} • {row.id}</span>
        </div>
      )
    },
    { key: "action", label: "Action Executed" },
    { key: "module", label: "Module" },
    { key: "ipAddress", label: "IP Address" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (val) => (
        <Badge tone="success" variant="soft" dot>
          {val}
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
      {/* --- 1. Page Header --- */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiShield />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Administration</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>Super Admin</span>
            </div>
            <h2>Platform Administration Overview</h2>
            <p className={styles.subtitle}>
              Monitor enterprise system health, manage user roles & security access, configure territory hierarchies, and inspect real-time audit logs.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiRefreshCw />} onClick={() => setModalOpen(true)}>
            System Maintenance
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExportAudit}>
            Export Audit Logs
          </Button>
        </div>
      </div>

      {/* --- Section 1: System Health Telemetry Banner --- */}
      <div className={styles.adminSystemBanner}>
        <div className={styles.statusShieldArea}>
          <div className={styles.shieldIcon}>
            <FiCheckCircle />
          </div>
          <div className={styles.shieldMeta}>
            <strong>All Systems Operational</strong>
            <span>99.98% Monthly Uptime • SOC2 Compliant</span>
          </div>
        </div>

        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>Active Platform Users</span>
          <span className={styles.metricVal}>142 Online</span>
          <span className={styles.metricSub}>450 Total Provisioned Accounts</span>
        </div>

        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>Primary ERP Sync Status</span>
          <span className={styles.metricVal}>Synced (4m ago)</span>
          <span className={styles.metricSub}>SAP S/4HANA Connector Active</span>
        </div>

        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>Security Risk Posture</span>
          <span className={styles.metricVal}>Zero Alerts</span>
          <span className={styles.metricSub}>2FA Enforced • SSL Encrypted</span>
        </div>
      </div>

      {/* --- Section 2: Quick Administration Modules Grid --- */}
      <div className={styles.actionHubGrid}>
        <Link href="/admin/users" style={{ textDecoration: "none" }}>
          <div className={styles.actionCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>
                <FiUsers />
              </div>
              <Badge tone="primary" variant="soft" dot>450 Users</Badge>
            </div>
            <h3>Users & Roles</h3>
            <p>Manage user accounts, assign role permissions (ASMs, SOs, Plant Heads), and enforce 2FA security.</p>
            <div className={styles.cardFooter}>
              <span>Manage User Access</span>
              <FiChevronRight />
            </div>
          </div>
        </Link>

        <Link href="/admin/territories" style={{ textDecoration: "none" }}>
          <div className={styles.actionCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>
                <FiMapPin />
              </div>
              <Badge tone="success" variant="soft" dot>18 Zones</Badge>
            </div>
            <h3>Territories & Beats</h3>
            <p>Configure regional sales zones, area clusters, distributor beat mappings, and PJM route coverage.</p>
            <div className={styles.cardFooter}>
              <span>Configure Hierarchy</span>
              <FiChevronRight />
            </div>
          </div>
        </Link>

        <Link href="/admin/master-data" style={{ textDecoration: "none" }}>
          <div className={styles.actionCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>
                <FiDatabase />
              </div>
              <Badge tone="warning" variant="soft" dot>Sync Active</Badge>
            </div>
            <h3>Master Data Management</h3>
            <p>Synchronize FMCG SKU catalogues, distributor pricing ladders, tax matrices, and factory warehouses.</p>
            <div className={styles.cardFooter}>
              <span>Sync Master Catalogues</span>
              <FiChevronRight />
            </div>
          </div>
        </Link>

        <Link href="/admin/audit-logs" style={{ textDecoration: "none" }}>
          <div className={styles.actionCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>
                <FiFileText />
              </div>
              <Badge tone="primary" variant="soft" dot>Real-time</Badge>
            </div>
            <h3>Audit Logs & Security</h3>
            <p>Inspect real-time administrative audit trails, security login attempts, and API request payloads.</p>
            <div className={styles.cardFooter}>
              <span>View Security Logs</span>
              <FiChevronRight />
            </div>
          </div>
        </Link>
      </div>

      {/* --- Section 3: Integration Connectors & Live Audit Log Split --- */}
      <div className={styles.splitRow}>
        {/* Left: Live Audit Log Table */}
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>Live Administrative Audit Trail</h3>
            <Button variant="ghost" size="sm" leadingIcon={<FiFileText />}>
              Full Audit History
            </Button>
          </div>
          <Table
            data={mockAuditLogs}
            columns={auditColumns}
            onRowClick={handleLogClick}
            emptyMessage="No administrative actions logged."
          />
        </div>

        {/* Right: Enterprise Integration Health Panel */}
        <div className={styles.integrationCard}>
          <div className={styles.cardHeader}>
            <h3>Enterprise Integration Connectors</h3>
          </div>
          <div className={styles.connectorList}>
            {mockIntegrations.map((conn, idx) => (
              <div key={idx} className={styles.connectorItem}>
                <div className={styles.itemHead}>
                  <strong>{conn.name}</strong>
                  <Badge tone="success" variant="soft" dot>
                    {conn.health}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <strong>Status:</strong> {conn.status} ({conn.latency})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. Audit Log Details Drawer --- */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedLog?.id}
        description={`Executed by: ${selectedLog?.user}`}
        side="right"
        size="md"
      >
        {selectedLog && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Action Executed</span>
                <strong>{selectedLog.action}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Target Module</span>
                <strong>{selectedLog.module}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Timestamp</span>
                <strong>{selectedLog.timestamp}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>IP Address</span>
                <strong>{selectedLog.ipAddress}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Execution Status</span>
                <strong>{selectedLog.status}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Payload Change Diff
              </h4>
              <div style={{ padding: "var(--space-3)", background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", fontSize: "var(--text-xs)", color: "var(--text-1)", fontFamily: "var(--font-code)" }}>
                {selectedLog.payloadDiff}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* --- 5. System Maintenance Modal --- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Execute System Maintenance Action"
        description="Run manual master data sync, flush Redis cache sessions, or audit API connector health."
        size="md"
      >
        <form onSubmit={handleMaintenanceSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Target Data Connector
            </label>
            <Select
              value={syncModule}
              onChange={(e) => setSyncModule(e.target.value)}
              options={[
                { label: "SAP Secondary Sales Invoices", value: "SAP Secondary Sales Invoices" },
                { label: "FMCG Product SKU Master Catalogue", value: "FMCG Product SKU Master Catalogue" },
                { label: "Distributor Beats & Territory Mappings", value: "Distributor Beats & Territory Mappings" }
              ]}
            />
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Maintenance Action
            </label>
            <Select
              value={maintenanceAction}
              onChange={(e) => setMaintenanceAction(e.target.value)}
              options={[
                { label: "Force Full Master Data Sync", value: "Force Full Master Data Sync" },
                { label: "Flush Redis Session Cache", value: "Flush Redis Session Cache" },
                { label: "Re-index Database Search Catalogues", value: "Re-index Database Search Catalogues" }
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Run Maintenance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
