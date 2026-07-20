"use client";

import React, { useState, useMemo } from "react";
import {
  FiTruck, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiSliders, FiPackage, FiLayers, FiShield, FiFileText, FiAlertCircle
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── BESPOKE SUPPLIER LEAD-TIME MOCK DATA ────────────────────────── */

const mockVendorScorecards = [
  {
    id: "SUP-101",
    vendorName: "Ball Beverage Packaging Ltd",
    category: "Primary Packaging",
    region: "North Plant Hub",
    promisedLeadTime: "4.0 Days",
    actualLeadTime: "6.2 Days",
    otifRate: "78.4%",
    riskScore: "High Risk",
    activeOrders: "3 POs In-Transit",
    details: {
      contractSLA: "95% OTIF Target",
      contact: "Ankit Sharma (+91 98110 44210)",
      delayVariance: "+2.2 Days Late",
      lastReceived: "15 Jul 2026",
      activeOrderValue: "₹18.50 Lakhs",
      slaPenaltyStatus: "Penalty Notice Issued",
      riskMitigation: "Expedited Air Freight Requested"
    }
  },
  {
    id: "SUP-102",
    vendorName: "Mawana Sugar Mills Ltd",
    category: "Raw Ingredients",
    region: "Central Warehouse",
    promisedLeadTime: "2.0 Days",
    actualLeadTime: "2.1 Days",
    otifRate: "97.8%",
    riskScore: "Low Risk",
    activeOrders: "1 PO Scheduled",
    details: {
      contractSLA: "95% OTIF Target",
      contact: "Ramesh Gupta (+91 98101 22340)",
      delayVariance: "+0.1 Days (On Schedule)",
      lastReceived: "18 Jul 2026",
      activeOrderValue: "₹12.40 Lakhs",
      slaPenaltyStatus: "SLA Compliant",
      riskMitigation: "Buffer Stock Re-aligned"
    }
  },
  {
    id: "SUP-103",
    vendorName: "Ester Industries Ltd",
    category: "Primary Packaging",
    region: "West Plant Hub",
    promisedLeadTime: "3.0 Days",
    actualLeadTime: "3.2 Days",
    otifRate: "94.2%",
    riskScore: "Low Risk",
    activeOrders: "2 POs Scheduled",
    details: {
      contractSLA: "90% OTIF Target",
      contact: "Priya Malhotra (+91 98765 43210)",
      delayVariance: "+0.2 Days (Minor Delay)",
      lastReceived: "17 Jul 2026",
      activeOrderValue: "₹8.90 Lakhs",
      slaPenaltyStatus: "SLA Compliant",
      riskMitigation: "Vendor Stock Staged"
    }
  },
  {
    id: "SUP-104",
    vendorName: "Godrej Industries Oleo",
    category: "Raw Ingredients",
    region: "South Warehouse",
    promisedLeadTime: "5.0 Days",
    actualLeadTime: "6.8 Days",
    otifRate: "82.5%",
    riskScore: "Moderate Risk",
    activeOrders: "2 POs In-Transit",
    details: {
      contractSLA: "90% OTIF Target",
      contact: "Siddharth Nair (+91 98220 11980)",
      delayVariance: "+1.8 Days Late",
      lastReceived: "10 Jul 2026",
      activeOrderValue: "₹6.70 Lakhs",
      slaPenaltyStatus: "Warning Notice Sent",
      riskMitigation: "Reorder Trigger Advanced"
    }
  }
];

const mockTransitStoppages = [
  { id: "PO-4418", supplier: "Ball Beverage Packaging", item: "250ml Aluminium Cans", stage: "Delayed at Port", cause: "Customs Hold at Nhava Sheva", impact: "+3.5 Days Late" },
  { id: "PO-4425", supplier: "Godrej Industries Oleo", item: "Soap Noodle Flakes", stage: "In Transit", cause: "Highway Flooding Detour", impact: "+1.8 Days Late" },
  { id: "PO-4390", supplier: "Ester Industries Ltd", item: "1L PET Bottle Preforms", stage: "Order Confirmed", cause: "Raw Resin Batch Test", impact: "+0.5 Days Late" }
];

export default function SupplierLeadTimePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for SLA Audit Modal
  const [auditVendor, setAuditVendor] = useState("Ball Beverage Packaging Ltd");
  const [auditReason, setAuditReason] = useState("Chronic Lead Time Breach (>2 Days Late)");
  const [penaltyAction, setPenaltyAction] = useState("Issue Financial Penalty Notice");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Lead-Time Report Exported",
      description: "Supplier SLA scorecards & transit bottleneck logs exported to CSV.",
      tone: "success"
    });
  };

  const handleAuditSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Supplier SLA Audit Triggered",
      description: `Formal review logged for ${auditVendor}. Action: ${penaltyAction}.`,
      tone: "success"
    });
  };

  // Filter Vendor Data
  const filteredVendors = useMemo(() => {
    return mockVendorScorecards.filter(item => {
      const matchSearch = item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchRegion = selectedRegion === "All" || item.region.includes(selectedRegion);
      const matchRisk = riskFilter === "All" || item.riskScore === riskFilter;
      return matchSearch && matchRegion && matchRisk;
    });
  }, [searchQuery, selectedRegion, riskFilter]);

  const handleCardClick = (vendor) => {
    setSelectedVendor(vendor);
    setDrawerOpen(true);
  };

  const vendorColumns = [
    {
      key: "vendorName",
      label: "Vendor Supplier & ID",
      sortable: true,
      render: (_, row) => (
        <div className={styles.supplierMeta}>
          <strong>{row.vendorName}</strong>
          <span>{row.category} • {row.id}</span>
        </div>
      )
    },
    { key: "region", label: "Supply Hub Region" },
    { key: "promisedLeadTime", label: "Contracted SLA" },
    {
      key: "actualLeadTime",
      label: "Actual Avg Lead-Time",
      render: (val, row) => (
        <strong style={{ color: parseFloat(val) > parseFloat(row.promisedLeadTime) + 1 ? "var(--danger)" : "var(--text-1)" }}>
          {val}
        </strong>
      )
    },
    { key: "otifRate", label: "OTIF Rate (%)" },
    { key: "activeOrders", label: "Active Orders" },
    {
      key: "riskScore",
      label: "Risk Score",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Low Risk" ? "success" : val === "Moderate Risk" ? "warning" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Vendor Details">
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
            <FiTruck />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manufacturing Planner</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Supplier Lead-Time & Risk Analytics</h2>
            <p className={styles.subtitle}>
              Monitor vendor lead-time SLA compliance, transit delays, on-time in-full (OTIF) fulfillment rates, and supply chain bottleneck risks.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiShield />} onClick={() => setModalOpen(true)}>
            Audit Supplier SLA
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Lead-Time Report
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Supply Hub Region:</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Regions</option>
              <option value="North">North Plant Hub</option>
              <option value="Central">Central Warehouse</option>
              <option value="West">West Plant Hub</option>
              <option value="South">South Warehouse</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Vendor Risk Score:</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Risk Levels</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Moderate Risk">Moderate Risk</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. Vendor SLA Scorecards Grid ────────────────── */}
      <div className={styles.scorecardsGrid}>
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className={styles.vendorCard} onClick={() => handleCardClick(vendor)} style={{ cursor: "pointer" }}>
            <div className={styles.cardTop}>
              <div className={styles.vendorInfo}>
                <strong>{vendor.vendorName}</strong>
                <span>{vendor.category} • {vendor.region}</span>
              </div>
              <Badge tone={vendor.riskScore === "Low Risk" ? "success" : vendor.riskScore === "Moderate Risk" ? "warning" : "danger"} variant="soft" dot>
                {vendor.riskScore}
              </Badge>
            </div>
            <div className={styles.cardMetrics}>
              <div className={styles.metric}>
                <span>Contract SLA</span>
                <strong>{vendor.promisedLeadTime}</strong>
              </div>
              <div className={styles.metric}>
                <span>Actual Lead-Time</span>
                <strong style={{ color: parseFloat(vendor.actualLeadTime) > parseFloat(vendor.promisedLeadTime) + 1 ? "var(--danger)" : "var(--text-1)" }}>
                  {vendor.actualLeadTime}
                </strong>
              </div>
              <div className={styles.metric}>
                <span>OTIF Fulfillment</span>
                <strong>{vendor.otifRate}</strong>
              </div>
              <div className={styles.metric}>
                <span>Active Orders</span>
                <strong>{vendor.activeOrders}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. Analytics Split Row (Chart + Bottleneck Feed) ── */}
      <div className={styles.analyticsRow}>
        {/* Left: Lead-Time Variance BarChart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Promised SLA Lead Time vs Actual Transit Lead Time (Days)</h3>
          </div>
          <BarChart
            labels={["Ball Packaging", "Mawana Sugar", "Ester Industries", "Godrej Oleo"]}
            series={[
              { name: "Promised SLA (Days)", data: [4.0, 2.0, 3.0, 5.0], color: "var(--primary)" },
              { name: "Actual Avg Lead-Time (Days)", data: [6.2, 2.1, 3.2, 6.8], color: "var(--warning)" }
            ]}
            height={280}
          />
        </div>

        {/* Right: Live Transit Stoppage & Bottleneck Feed */}
        <div className={styles.bottleneckCard}>
          <div className={styles.cardHeader}>
            <h3>Active Transit Bottlenecks & Stoppages</h3>
          </div>
          <div className={styles.stoppageList}>
            {mockTransitStoppages.map((stoppage) => (
              <div key={stoppage.id} className={styles.stoppageItem}>
                <div className={styles.itemTop}>
                  <strong>{stoppage.id} • {stoppage.supplier}</strong>
                  <Badge tone="danger" variant="soft" dot>
                    {stoppage.impact}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <strong>Material:</strong> {stoppage.item}
                </div>
                <div className={styles.itemMeta}>
                  <strong>Stoppage Cause:</strong> {stoppage.cause} ({stoppage.stage})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Full Width Detailed Vendor Ledger Table ──────── */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Comprehensive Supplier Lead-Time & SLA Audit Ledger</h3>
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search Vendor Name, Category, Region or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
        </div>
        <Table
          data={filteredVendors}
          columns={vendorColumns}
          onRowClick={handleCardClick}
          emptyMessage="No supplier records match selected filters."
        />
      </div>

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedVendor?.vendorName}
        description={`Vendor ID: ${selectedVendor?.id} • ${selectedVendor?.category}`}
        side="right"
        size="md"
      >
        {selectedVendor && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Supply Hub Region</span>
                <strong>{selectedVendor.region}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>OTIF Fulfillment Rate</span>
                <strong>{selectedVendor.otifRate}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Promised Lead Time</span>
                <strong>{selectedVendor.promisedLeadTime}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Actual Lead Time</span>
                <strong>{selectedVendor.actualLeadTime}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Contract SLA</span>
                <strong>{selectedVendor.details.contractSLA}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Active Order Value</span>
                <strong>{selectedVendor.details.activeOrderValue}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Vendor Scorecard & SLA Telemetry
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Primary Vendor Contact:</strong> {selectedVendor.details.contact}</div>
                <div><strong>Avg Delay Variance:</strong> {selectedVendor.details.delayVariance}</div>
                <div><strong>Last Received Shipment:</strong> {selectedVendor.details.lastReceived}</div>
                <div><strong>SLA Penalty Status:</strong> {selectedVendor.details.slaPenaltyStatus}</div>
                <div><strong>Risk Mitigation Plan:</strong> {selectedVendor.details.riskMitigation}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Audit Supplier SLA Modal ─────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Audit Supplier SLA & Issue Penalty Notice"
        description="Review supplier lead-time breach logs, trigger formal contract SLA audits, and log penalty actions."
        size="md"
      >
        <form onSubmit={handleAuditSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Vendor Supplier
            </label>
            <Select
              value={auditVendor}
              onChange={(e) => setAuditVendor(e.target.value)}
              options={[
                { label: "Ball Beverage Packaging Ltd", value: "Ball Beverage Packaging Ltd" },
                { label: "Godrej Industries Oleo", value: "Godrej Industries Oleo" },
                { label: "Ester Industries Ltd", value: "Ester Industries Ltd" }
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Audit Trigger Reason
              </label>
              <Select
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                options={[
                  { label: "Chronic Lead Time Breach (>2 Days Late)", value: "Chronic Lead Time Breach (>2 Days Late)" },
                  { label: "OTIF Below 80% SLA Threshold", value: "OTIF Below 80% SLA Threshold" },
                  { label: "Unnotified Shipment Stoppage", value: "Unnotified Shipment Stoppage" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Contractual Action
              </label>
              <Select
                value={penaltyAction}
                onChange={(e) => setPenaltyAction(e.target.value)}
                options={[
                  { label: "Issue Financial Penalty Notice", value: "Issue Financial Penalty Notice" },
                  { label: "Reduce PO Volume Share by 20%", value: "Reduce PO Volume Share by 20%" },
                  { label: "Request Vendor Senior Escalation", value: "Request Vendor Senior Escalation" }
                ]}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Log SLA Audit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
