"use client";

import React, { useState, useMemo } from "react";
import {
  FiTrendingUp, FiSearch, FiDownload, FiFilter,
  FiPercent, FiCheckCircle, FiClock, FiAlertTriangle,
  FiChevronRight, FiPlus, FiUsers, FiDollarSign, FiAward
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tooltip, Drawer, Modal, Tabs, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Donut from "../../../../../components/ui/Chart/Donut";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const mockOffersData = [
  {
    id: "OFR-901",
    name: "Monsoon Beverage Volume Boost",
    category: "Beverages",
    offerType: "Instant 12% Off",
    salesLift: "₹16.40L",
    investment: "₹4.20L",
    roiRatio: "3.90x",
    redemptionRate: "88.4%",
    claimsCount: "1,240 Outlets",
    status: "High ROI",
    details: {
      minOrderQty: "25 Cases",
      validity: "01 Jul - 31 Jul 2026",
      applicableSkus: "Sparkle Water 1L, Refresh Soda 250ml",
      description: "Direct invoice discount scheme driving high volume bulk orders across Delhi & Noida territory zones."
    }
  },
  {
    id: "OFR-902",
    name: "Crisp Chips BOGO 10+1 Special",
    category: "Snacks & Packaged",
    offerType: "Buy 10 Get 1 Free",
    salesLift: "₹14.20L",
    investment: "₹3.80L",
    roiRatio: "3.73x",
    redemptionRate: "82.1%",
    claimsCount: "980 Outlets",
    status: "High ROI",
    details: {
      minOrderQty: "10 Cases",
      validity: "10 Jul - 10 Aug 2026",
      applicableSkus: "Crisp Chips Classic 50g, Masala 50g",
      description: "Buy 10 cases of Crisp Chips and receive 1 case free of Classic 50g SKU."
    }
  },
  {
    id: "OFR-903",
    name: "Personal Care Counter Placement",
    category: "Personal Care",
    offerType: "Display Rental Bonus",
    salesLift: "₹8.50L",
    investment: "₹2.50L",
    roiRatio: "3.40x",
    redemptionRate: "74.5%",
    claimsCount: "420 Outlets",
    status: "High ROI",
    details: {
      minOrderQty: "Maintain 3 Facings",
      validity: "01 Jul - 30 Sep 2026",
      applicableSkus: "Glacial Ice Mint 15g, Fruit Bar",
      description: "Monthly counter display rental payout for prime counter visibility."
    }
  },
  {
    id: "OFR-904",
    name: "Chilled Dairy Bulk Intro Promo",
    category: "Dairy & Chill",
    offerType: "8% Cashback Slab",
    salesLift: "₹3.70L",
    investment: "₹1.20L",
    roiRatio: "3.08x",
    redemptionRate: "61.2%",
    claimsCount: "210 Outlets",
    status: "Moderate ROI",
    details: {
      minOrderQty: "₹15,000 Order Value",
      validity: "15 Jul - 15 Aug 2026",
      applicableSkus: "Fresh Butter 500g, Cream Pack",
      description: "Introductory promotional slab for chilled dairy line extension."
    }
  },
  {
    id: "OFR-905",
    name: "Low Sugar Beverage Sampler",
    category: "Beverages",
    offerType: "Free Unit Sample",
    salesLift: "₹1.80L",
    investment: "₹0.95L",
    roiRatio: "1.89x",
    redemptionRate: "45.0%",
    claimsCount: "115 Outlets",
    status: "Low ROI",
    details: {
      minOrderQty: "5 Cases Any SKU",
      validity: "01 Jun - 30 Jun 2026",
      applicableSkus: "Zero Sugar Soda 250ml",
      description: "Sampling campaign to drive retail trial of new zero sugar variant."
    }
  }
];

const mockCategoryBreakdown = [
  { id: "CAT-01", category: "Beverages", activeOffers: 3, totalLift: "₹18.20L", totalCost: "₹5.15L", roi: "3.53x", status: "High ROI" },
  { id: "CAT-02", category: "Snacks & Packaged", activeOffers: 2, totalLift: "₹14.20L", totalCost: "₹3.80L", roi: "3.73x", status: "High ROI" },
  { id: "CAT-03", category: "Personal Care", activeOffers: 2, totalLift: "₹8.50L", totalCost: "₹2.50L", roi: "3.40x", status: "High ROI" },
  { id: "CAT-04", category: "Dairy & Chill", activeOffers: 1, totalLift: "₹3.70L", totalCost: "₹1.20L", roi: "3.08x", status: "Moderate ROI" }
];

export default function OfferPerformancePage() {
  const [activeTab, setActiveTab] = useState("offers_analytics");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for new offer modal
  const [newOfferName, setNewOfferName] = useState("");
  const [newCategory, setNewCategory] = useState("Beverages");
  const [newType, setNewType] = useState("");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Offer Performance Exported",
      description: "Active campaign ROI metrics exported to CSV.",
      tone: "success"
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    toast?.({
      title: "New Offer Launched",
      description: `Promotional Offer "${newOfferName || 'New Trade Offer'}" activated.`,
      tone: "success"
    });
    setNewOfferName("");
    setNewType("");
  };

  // Filter Offers Data
  const filteredOffers = useMemo(() => {
    return mockOffersData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [searchQuery, selectedCategory, statusFilter]);

  const handleRowClick = (offer) => {
    setSelectedOffer(offer);
    setDrawerOpen(true);
  };

  const offerColumns = [
    {
      key: "name",
      label: "Campaign Offer",
      sortable: true,
      render: (_, row) => (
        <div className={styles.offerMeta}>
          <strong>{row.name}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    {
      key: "category",
      label: "Category & Mechanism",
      sortable: true,
      render: (_, row) => (
        <div className={styles.categoryMeta}>
          <strong>{row.category}</strong>
          <span>{row.offerType}</span>
        </div>
      )
    },
    { key: "salesLift", label: "Sales Lift", render: (val) => <strong style={{ color: "var(--success)" }}>{val}</strong> },
    { key: "investment", label: "Investment" },
    { key: "roiRatio", label: "ROI", render: (val) => <strong>{val}</strong> },
    { key: "redemptionRate", label: "Redemption Rate" },
    {
      key: "status",
      label: "Status",
      align: "center",
      sortable: true,
      render: (val) => {
        const tone = val === "High ROI" ? "success" : val === "Moderate ROI" ? "warning" : "danger";
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
        <Button variant="ghost" size="sm" iconOnly aria-label="View Offer Details">
          <FiChevronRight />
        </Button>
      )
    }
  ];

  const categoryColumns = [
    {
      key: "category",
      label: "Product Category",
      render: (_, row) => (
        <div className={styles.categoryMeta}>
          <strong>{row.category}</strong>
          <span>{row.id}</span>
        </div>
      )
    },
    { key: "activeOffers", label: "Active Offers" },
    { key: "totalLift", label: "Total Sales Lift", render: (val) => <strong style={{ color: "var(--success)" }}>{val}</strong> },
    { key: "totalCost", label: "Total Investment" },
    { key: "roi", label: "Average ROI Ratio", render: (val) => <strong>{val}</strong> },
    {
      key: "status",
      label: "Performance Rating",
      render: (val) => (
        <Badge tone={val === "High ROI" ? "success" : "warning"} variant="soft" dot>
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
            <FiTrendingUp />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Offer Performance Analytics</h2>
            <p className={styles.subtitle}>
              Analyze trade promotion ROI, redemption velocity, incremental sales volume lift, and retailer redemption rate across active schemes.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiPlus />} onClick={() => setModalOpen(true)}>
            Launch New Offer
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Performance
          </Button>
        </div>
      </div>

      {/* ── 2. Filter Toolbar ─────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Offer Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Categories</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks & Packaged">Snacks & Packaged</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Dairy & Chill">Dairy & Chill</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Performance Rating:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="High ROI">High ROI</option>
              <option value="Moderate ROI">Moderate ROI</option>
              <option value="Low ROI">Low ROI</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. KPI StatCards Grid ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Active Offers"
          value="8 Campaigns"
          delta={2}
          deltaLabel="launched this week"
          deltaTone="positive"
          icon={<FiPercent color="var(--primary)" />}
        />
        <StatCard
          label="Total Offer Sales Lift"
          value="₹42.80L"
          delta={18.4}
          deltaLabel="incremental revenue"
          deltaTone="positive"
          icon={<FiTrendingUp color="var(--success)" />}
        />
        <StatCard
          label="Avg Redemption Rate"
          value="78.6%"
          delta={4.2}
          deltaLabel="above target benchmark"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--warning)" />}
        />
        <StatCard
          label="Average Campaign ROI"
          value="3.42x"
          delta={0.35}
          deltaLabel="ROI improvement"
          deltaTone="positive"
          icon={<FiAward color="var(--primary)" />}
        />
      </div>

      {/* ── 4. Navigation Tabs ────────────────────────────── */}
      <Tabs
        items={[
          { value: "offers_analytics", label: "Active Offers Directory" },
          { value: "category_breakdown", label: "Category ROI Breakdown" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 5. Main Layout Grid (Stacked Full Width) ──────── */}
      {activeTab === "offers_analytics" && (
        <div className={styles.mainLayout}>
          {/* Top: Offers Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Trade Offer Performance Directory</h3>
              <div className={styles.sectionControls}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search Offer Code, Campaign Name or Category..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FiSearch />
                </div>
              </div>
            </div>
            <Table
              data={filteredOffers}
              columns={offerColumns}
              onRowClick={handleRowClick}
              emptyMessage="No trade offers match selected filters."
            />
          </div>

          {/* Bottom: Sales Lift vs Investment BarChart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Offer Sales Lift vs Investment ROI</h3>
            </div>
            <BarChart
              labels={["Beverages", "Snacks & Packaged", "Personal Care", "Dairy & Chill"]}
              series={[
                { name: "Incremental Sales Lift (₹ Lakhs)", data: [16.4, 14.2, 8.5, 3.7], color: "var(--primary)" },
                { name: "Offer Investment (₹ Lakhs)", data: [4.2, 3.8, 2.5, 1.2], color: "var(--warning)" }
              ]}
              height={280}
            />
          </div>
        </div>
      )}

      {activeTab === "category_breakdown" && (
        <div className={styles.mainLayout}>
          {/* Top: Category ROI Table */}
          <div className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h3>Category Promotion ROI Summary</h3>
            </div>
            <Table
              data={mockCategoryBreakdown}
              columns={categoryColumns}
              emptyMessage="No category records found."
            />
          </div>

          {/* Bottom: Offer Category Distribution Donut */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Category Lift Contribution</h3>
            </div>
            <div style={{ height: "260px", width: "100%", marginTop: "var(--space-2)" }}>
              <Donut
                data={[
                  { label: "Beverages", value: 18.2 },
                  { label: "Snacks & Packaged", value: 14.2 },
                  { label: "Personal Care", value: 8.5 },
                  { label: "Dairy & Chill", value: 3.7 }
                ]}
                colors={["var(--primary)", "var(--success)", "var(--warning)", "var(--text-3)"]}
                innerRadius={0.68}
                centerLabel="Total Lift"
                centerSubLabel="₹44.60L"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Drawer Details ───────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedOffer?.name}
        description={`Offer Code: ${selectedOffer?.id} • ${selectedOffer?.category}`}
        side="right"
        size="md"
      >
        {selectedOffer && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Category</span>
                <strong>{selectedOffer.category}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Mechanism</span>
                <strong>{selectedOffer.offerType}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Sales Lift</span>
                <strong style={{ color: "var(--success)" }}>{selectedOffer.salesLift}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Investment</span>
                <strong>{selectedOffer.investment}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>ROI Ratio</span>
                <strong>{selectedOffer.roiRatio}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Redemption Rate</span>
                <strong>{selectedOffer.redemptionRate}</strong>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Campaign Rules & Eligibility Details
              </h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>
                {selectedOffer.details.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Min Order Threshold:</strong> {selectedOffer.details.minOrderQty}</div>
                <div><strong>Validity Period:</strong> {selectedOffer.details.validity}</div>
                <div><strong>Applicable SKUs:</strong> {selectedOffer.details.applicableSkus}</div>
                <div><strong>Total Outlets Redeemed:</strong> {selectedOffer.claimsCount}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── 7. Launch Offer Modal ───────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Launch New Trade Offer"
        description="Set promotional rules, target categories, discount thresholds, and campaign schedules."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className={styles.formGrid}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
              Offer Campaign Name
            </label>
            <Input
              placeholder="e.g. Festival Season Packaged Foods Promo"
              value={newOfferName}
              onChange={(e) => setNewOfferName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Product Category
              </label>
              <Select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                options={[
                  { label: "Beverages", value: "Beverages" },
                  { label: "Snacks & Packaged", value: "Snacks & Packaged" },
                  { label: "Personal Care", value: "Personal Care" },
                  { label: "Dairy & Chill", value: "Dairy & Chill" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Offer Mechanism / Reward
              </label>
              <Input
                placeholder="e.g. 15% Off or Buy 5 Get 1 Free"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Activate Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
