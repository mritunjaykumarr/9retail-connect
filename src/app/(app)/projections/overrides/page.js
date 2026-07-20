"use client";

import React, { useState, useMemo } from "react";
import {
  FiSliders, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiEdit3,
  FiChevronRight, FiPackage, FiTrendingUp, FiAlertCircle, FiPlusCircle
} from "react-icons/fi";
import {
  Table, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import styles from "./page.module.scss";

/* --- BESPOKE DEMAND FORECAST MANUAL OVERRIDES MOCK DATA --- */

const mockOverridesLedger = [
  {
    id: "OVR-401",
    skuName: "Fizz Cola 250ml Can",
    territory: "Delhi East Area",
    category: "Beverages",
    submittedBy: "Vikram Malhotra (ASM)",
    dateSubmitted: "18 Jul 2026",
    aiBaselineCases: "18,500 Cases",
    manualTargetCases: "21,200 Cases",
    varianceLift: "+14.6% Lift",
    reason: "Competitor Out-of-Stock at Major Modern Trade Chain",
    status: "Approved",
    details: {
      originalModelConfidence: "96.2% Prophet v2.4",
      approver: "Anand Verma (Regional Director)",
      distributorImpact: "+2,700 Cases Allocation to East Depot",
      notes: "Competitor plant outage confirmed in NCR. Retailers switching orders to Fizz Cola."
    }
  },
  {
    id: "OVR-402",
    skuName: "Crunchy Chips 50g Salted",
    territory: "Noida Zone",
    category: "Snacks & Packaged",
    submittedBy: "Sanjay Singhania (ASM)",
    dateSubmitted: "17 Jul 2026",
    aiBaselineCases: "12,000 Cases",
    manualTargetCases: "14,500 Cases",
    varianceLift: "+20.8% Lift",
    reason: "Regional Monsoon Trade Scheme Launched (Buy 10 Get 1)",
    status: "Approved",
    details: {
      originalModelConfidence: "94.8% Prophet v2.4",
      approver: "Anand Verma (Regional Director)",
      distributorImpact: "+2,500 Cases Allocation to Noida Depot",
      notes: "Consumer trade scheme offering 10% bonus stock expected to drive retail stocking."
    }
  },
  {
    id: "OVR-403",
    skuName: "Glacial Mint Soap 100g",
    territory: "Gurgaon Commercial Hub",
    category: "Personal Care",
    submittedBy: "Ananya Roy (ASM)",
    dateSubmitted: "19 Jul 2026",
    aiBaselineCases: "8,500 Cases",
    manualTargetCases: "7,200 Cases",
    varianceLift: "-15.3% Reduction",
    reason: "Price Revision (+₹5/unit) Temporary Demand Dips",
    status: "Pending Review",
    details: {
      originalModelConfidence: "92.1% Prophet v2.4",
      approver: "Pending Regional Director Review",
      distributorImpact: "-1,300 Cases Allocation Adjustment",
      notes: "MRPs increased from ₹35 to ₹40. Initial retailer resistance expected for 2 weeks."
    }
  },
  {
    id: "OVR-404",
    skuName: "Mango Nectar 1L Pack",
    territory: "Faridabad Zone",
    category: "Beverages",
    submittedBy: "Rakesh Verma (ASM)",
    dateSubmitted: "16 Jul 2026",
    aiBaselineCases: "6,000 Cases",
    manualTargetCases: "7,500 Cases",
    varianceLift: "+25.0% Lift",
    reason: "Local School Sports Event & Festive Sponsorship",
    status: "Approved",
    details: {
      originalModelConfidence: "90.5% Prophet v2.4",
      approver: "Anand Verma (Regional Director)",
      distributorImpact: "+1,500 Cases Allocation to Faridabad Depot",
      notes: "Exclusive beverage sponsor for District Games event in July."
    }
  }
];

const mockOverrideReasonsBreakdown = [
  { reasonCat: "Trade Schemes & Promotions", caseLift: "+5,200 Cases", sharePct: 38, status: "High Impact" },
  { reasonCat: "Competitor Stockout Intel", caseLift: "+4,200 Cases", sharePct: 31, status: "High Impact" },
  { reasonCat: "Local Festive & Event Surge", caseLift: "+2,800 Cases", sharePct: 21, status: "Moderate Impact" },
  { reasonCat: "Price Hike Resistance", caseLift: "-1,300 Cases", sharePct: 10, status: "Volume Reduction" }
];

export default function ManualOverridesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOverride, setSelectedOverride] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for Submit Forecast Override Modal
  const [skuName, setSkuName] = useState("Fizz Cola 250ml Can");
  const [territory, setTerritory] = useState("Delhi East Area");
  const [aiBaseline, setAiBaseline] = useState("18,500 Cases");
  const [manualValue, setManualValue] = useState("21,200 Cases");
  const [justificationReason, setJustificationReason] = useState("Competitor Stockout Intel");
  const [overrideNotes, setOverrideNotes] = useState("");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Override Audit Log Exported",
      description: "Manual forecast overrides, justifications, and approvals exported to CSV.",
      tone: "success"
    });
  };

  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "Forecast Manual Override Logged",
      description: `Submitted adjustment of ${manualValue} for ${skuName} in ${territory}.`,
      tone: "success"
    });
  };

  const handleRowClick = (override) => {
    setSelectedOverride(override);
    setDrawerOpen(true);
  };

  // Filter Overrides Ledger
  const filteredOverrides = useMemo(() => {
    return mockOverridesLedger.filter(item => {
      const matchSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [searchQuery, categoryFilter, statusFilter]);

  const overrideColumns = [
    {
      key: "skuName",
      label: "SKU & Territory",
      sortable: true,
      render: (_, row) => (
        <div className={styles.skuMeta}>
          <strong>{row.skuName}</strong>
          <span>{row.territory} • {row.id}</span>
        </div>
      )
    },
    { key: "aiBaselineCases", label: "AI Baseline Forecast" },
    {
      key: "manualTargetCases",
      label: "Manual Override Target",
      render: (val) => <strong style={{ color: "var(--primary-text)" }}>{val}</strong>
    },
    {
      key: "varianceLift",
      label: "Variance Lift",
      render: (val) => (
        <strong style={{ color: val.includes("+") ? "var(--success)" : "var(--danger)" }}>
          {val}
        </strong>
      )
    },
    { key: "reason", label: "Business Justification" },
    { key: "submittedBy", label: "Submitted By" },
    {
      key: "status",
      label: "Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "Approved" ? "success" : "warning";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Override Details">
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
            <FiSliders />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Projection Engine</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP Commercial</span>
            </div>
            <h2>Demand Forecast Manual Overrides</h2>
            <p className={styles.subtitle}>
              Adjust AI-generated demand projections with real-time commercial intelligence, log business justifications, and track manager forecast accuracy.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiPlusCircle />} onClick={() => setModalOpen(true)}>
            Submit Forecast Override
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Audit Trail
          </Button>
        </div>
      </div>

      {/* --- 2. Context Filter Toolbar --- */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Product Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Categories</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks & Packaged">Snacks & Packaged</option>
              <option value="Personal Care">Personal Care</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Approval Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Section 1: Impact Summary Cards --- */}
      <div className={styles.impactCardsGrid}>
        <div className={styles.impactCard}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitle}>
              <strong>Net Volume Variance</strong>
              <span>Adjusted Total Lift</span>
            </div>
            <Badge tone="success" variant="soft" dot>+8.4% Net Lift</Badge>
          </div>
          <div className={styles.cardMetric}>
            <strong>+14,200</strong>
            <span>Cases Added</span>
          </div>
        </div>

        <div className={styles.impactCard}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitle}>
              <strong>Pending Approvals</strong>
              <span>Awaiting Director Review</span>
            </div>
            <Badge tone="warning" variant="soft" dot>1 Active Review</Badge>
          </div>
          <div className={styles.cardMetric}>
            <strong>1</strong>
            <span>Override Pending</span>
          </div>
        </div>

        <div className={styles.impactCard}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitle}>
              <strong>Manager Override Accuracy</strong>
              <span>Actual vs Adjusted Target Fit</span>
            </div>
            <Badge tone="primary" variant="soft" dot>94.1% Fit</Badge>
          </div>
          <div className={styles.cardMetric}>
            <strong>94.1%</strong>
            <span>Historical Fit</span>
          </div>
        </div>
      </div>

      {/* --- Section 2: Master Override Ledger Table --- */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Forecast Manual Overrides & Commercial Intel Ledger</h3>
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search SKU, Territory, Manager or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
        </div>
        <Table
          data={filteredOverrides}
          columns={overrideColumns}
          onRowClick={handleRowClick}
          emptyMessage="No forecast override records match selected filters."
        />
      </div>

      {/* --- Section 3: AI Baseline vs Manual Target Split --- */}
      <div className={styles.splitRow}>
        {/* Left: AI Baseline vs Manual Target BarChart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>AI Baseline Forecast vs Adjusted Manual Target (Cases)</h3>
          </div>
          <BarChart
            labels={["Fizz Cola 250ml", "Crunchy Chips 50g", "Glacial Mint Soap", "Mango Nectar 1L"]}
            series={[
              { name: "Original AI Baseline (Cases)", data: [18500, 12000, 8500, 6000], color: "var(--primary)" },
              { name: "Adjusted Manual Target (Cases)", data: [21200, 14500, 7200, 7500], color: "var(--success)" }
            ]}
            height={280}
          />
        </div>

        {/* Right: Override Reason Category Breakdown Panel */}
        <div className={styles.reasonCard}>
          <div className={styles.cardHeader}>
            <h3>Override Reason Category Breakdown</h3>
          </div>
          <div className={styles.reasonList}>
            {mockOverrideReasonsBreakdown.map((item, idx) => (
              <div key={idx} className={styles.reasonItem}>
                <div className={styles.itemHead}>
                  <strong>{item.reasonCat}</strong>
                  <Badge tone={item.status === "Volume Reduction" ? "danger" : "success"} variant="soft" dot>
                    {item.status}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <strong>Impact Volume:</strong> {item.caseLift} ({item.sharePct}% Share)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. Override Details Drawer --- */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedOverride?.skuName}
        description={`Territory: ${selectedOverride?.territory} • ID: ${selectedOverride?.id}`}
        side="right"
        size="md"
      >
        {selectedOverride && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Original AI Baseline</span>
                <strong>{selectedOverride.aiBaselineCases}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Adjusted Target</span>
                <strong>{selectedOverride.manualTargetCases}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Variance Lift</span>
                <strong style={{ color: selectedOverride.varianceLift.includes("+") ? "var(--success)" : "var(--danger)" }}>
                  {selectedOverride.varianceLift}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Approval Status</span>
                <strong>{selectedOverride.status}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Submitted By</span>
                <strong>{selectedOverride.submittedBy}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Submission Date</span>
                <strong>{selectedOverride.dateSubmitted}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Commercial Intel & Audit Notes
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Business Justification:</strong> {selectedOverride.reason}</div>
                <div><strong>Model Baseline Confidence:</strong> {selectedOverride.details.originalModelConfidence}</div>
                <div><strong>Reviewing Approver:</strong> {selectedOverride.details.approver}</div>
                <div><strong>Distributor Supply Impact:</strong> {selectedOverride.details.distributorImpact}</div>
                <div><strong>Manager Intel Notes:</strong> {selectedOverride.details.notes}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* --- 5. Submit Forecast Override Modal --- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Demand Forecast Manual Override"
        description="Adjust the AI baseline forecast with real-time commercial intel and submit for Regional Director approval."
        size="md"
      >
        <form onSubmit={handleOverrideSubmit} className={styles.formGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Target Product SKU
              </label>
              <Select
                value={skuName}
                onChange={(e) => setSkuName(e.target.value)}
                options={[
                  { label: "Fizz Cola 250ml Can", value: "Fizz Cola 250ml Can" },
                  { label: "Crunchy Chips 50g Salted", value: "Crunchy Chips 50g Salted" },
                  { label: "Glacial Mint Soap 100g", value: "Glacial Mint Soap 100g" },
                  { label: "Mango Nectar 1L Pack", value: "Mango Nectar 1L Pack" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Sales Territory Zone
              </label>
              <Select
                value={territory}
                onChange={(e) => setTerritory(e.target.value)}
                options={[
                  { label: "Delhi East Area", value: "Delhi East Area" },
                  { label: "Noida Zone", value: "Noida Zone" },
                  { label: "Gurgaon Commercial Hub", value: "Gurgaon Commercial Hub" },
                  { label: "Faridabad Zone", value: "Faridabad Zone" }
                ]}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Original AI Baseline
              </label>
              <Input
                value={aiBaseline}
                onChange={(e) => setAiBaseline(e.target.value)}
                readOnly
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Adjusted Manual Target
              </label>
              <Input
                placeholder="e.g. 21,200 Cases"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Commercial Justification Reason
            </label>
            <Select
              value={justificationReason}
              onChange={(e) => setJustificationReason(e.target.value)}
              options={[
                { label: "Competitor Stockout Intel", value: "Competitor Stockout Intel" },
                { label: "Regional Monsoon Trade Scheme Launched", value: "Regional Monsoon Trade Scheme Launched" },
                { label: "Local Festive & Event Sponsorship", value: "Local Festive & Event Sponsorship" },
                { label: "Price Revision Demand Dip", value: "Price Revision Demand Dip" }
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Manual Override
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
