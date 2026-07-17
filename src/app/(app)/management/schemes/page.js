"use client";

import React, { useState } from "react";
import { 
  FiTag, FiTrendingUp, FiActivity, FiTarget, 
  FiFilter, FiDollarSign, FiSearch, FiGift, FiAward, FiClock 
} from "react-icons/fi";
import { Badge, Card, StatCard, Table, Avatar, Tabs } from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

// --- Enhanced Mock Data ---

const roiTrendCategories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const roiTrendSeries = [
  { name: "Target ROI (%)", data: [150, 150, 150, 150, 150, 150], color: "var(--border-strong)" },
  { name: "Actual ROI (%)", data: [120, 145, 180, 210, 195, 230], color: "var(--primary)" },
  { name: "Incremental Lift (%)", data: [15, 18, 22, 28, 25, 32], color: "var(--success)" }
];

const schemeTypeCategories = ["Volume Discounts", "BOGO Offers", "Trade Displays", "Seasonal Push", "Loyalty Rewards"];
const schemeTypeSeries = [
  { name: "Budget Allocated (₹L)", data: [25, 15, 10, 30, 20], color: "var(--border-strong)" },
  { name: "Net Incremental Rev (₹L)", data: [85, 42, 18, 110, 65], color: "var(--primary)" }
];

const mockActiveSchemes = [
  { id: "SCH-101", name: "Summer Cool Fest", type: "Seasonal Push", audience: "Distributors", budget: "₹15.0L", burn: 65, end: "15 Aug 2026", status: "Active", trend: [10, 15, 25, 45, 55, 65] },
  { id: "SCH-204", name: "Maggi Bulk Buy", type: "Volume Discounts", audience: "Retailers", budget: "₹8.5L", burn: 92, end: "30 Jul 2026", status: "Closing Soon", trend: [20, 40, 60, 80, 88, 92] },
  { id: "SCH-312", name: "New Store Launch", type: "Trade Displays", audience: "Retailers", budget: "₹4.0L", burn: 15, end: "30 Sep 2026", status: "Active", trend: [0, 2, 5, 8, 12, 15] },
  { id: "SCH-145", name: "Monsoon Stock Up", type: "BOGO Offers", audience: "Wholesalers", budget: "₹12.0L", burn: 45, end: "31 Aug 2026", status: "Active", trend: [5, 15, 25, 30, 35, 45] },
  { id: "SCH-501", name: "Diwali Early Bird", type: "Seasonal Push", audience: "Distributors", budget: "₹25.0L", burn: 0, end: "30 Oct 2026", status: "Draft", trend: [0, 0, 0, 0, 0, 0] }
];

const mockRoiAnalysis = [
  { id: "ROI-01", name: "Maggi Buy 10 Get 1 Free", territory: "Delhi East", manager: "Rahul K.", spent: "₹45,000", returns: "₹2,400", incremental: "₹1,85,000", roi: "411%", status: "High ROI" },
  { id: "ROI-02", name: "Tata Salt Bulk 5% Off", territory: "All Regions", manager: "National", spent: "₹85,000", returns: "₹1,200", incremental: "₹2,68,000", roi: "315%", status: "On Track" },
  { id: "ROI-03", name: "KitKat Supermarket Display", territory: "Noida Central", manager: "Priya S.", spent: "₹30,000", returns: "₹800", incremental: "₹62,000", roi: "206%", status: "Low ROI" },
  { id: "ROI-04", name: "Munch 5 Cartons Claim", territory: "Gurugram Central", manager: "Amit J.", spent: "₹25,000", returns: "₹3,500", incremental: "₹58,000", roi: "232%", status: "On Track" },
  { id: "ROI-05", name: "Nescafe Winter Combo", territory: "North Hubs", manager: "Deepak T.", spent: "₹1,15,000", returns: "₹12,500", incremental: "₹4,20,000", roi: "365%", status: "High ROI" }
];

export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [schemeSearch, setSchemeSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filteredSchemes = mockActiveSchemes.filter(
    (item) =>
      (typeFilter === "All Types" || item.type === typeFilter) &&
      (item.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
       item.id.toLowerCase().includes(schemeSearch.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiTag />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>National Schemes Performance</h2>
            <p className={styles.subtitle}>Track active trade promotions, measure incremental volume lift, and analyze scheme ROI.</p>
          </div>
        </div>
      </div>

      {/* Global Filters */}
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-2)", background: "var(--surface)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-2)", fontWeight: 500 }}>
          <FiFilter /> Filters:
        </div>
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface-sunken)", color: "var(--text-1)" }}
        >
          <option>All Types</option>
          <option>Seasonal Push</option>
          <option>Volume Discounts</option>
          <option>Trade Displays</option>
          <option>BOGO Offers</option>
        </select>
        <select style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface-sunken)", color: "var(--text-1)" }}>
          <option>All Audiences</option>
          <option>Distributors</option>
          <option>Wholesalers</option>
          <option>Retailers</option>
        </select>
        <select style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface-sunken)", color: "var(--text-1)" }}>
          <option>Last 6 Months</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className={styles.body}>
        {/* Navigation Tabs */}
        <div style={{ marginBottom: "var(--space-2)" }}>
          <Tabs
            items={[
              { value: "overview", label: "Executive Dashboard" },
              { value: "active", label: "Active Schemes Pipeline" },
              { value: "roi", label: "Scheme ROI Analysis" }
            ]}
            value={activeTab}
            onChange={setActiveTab}
            variant="segmented"
          />
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Row */}
            <div className={styles.statsRow}>
              <StatCard
                label="Total Promo Budget"
                value="₹12.4Cr"
                delta={4.2}
                deltaLabel="increase vs last year"
                icon={<FiDollarSign />}
              />
              <StatCard
                label="Net Incremental Rev"
                value="₹38.5Cr"
                delta={15.4}
                deltaLabel="driven by active schemes"
                deltaTone="positive"
                icon={<FiTrendingUp />}
              />
              <StatCard
                label="Active National Schemes"
                value="42"
                delta={-5}
                deltaLabel="vs peak season"
                icon={<FiTag />}
              />
              <StatCard
                label="Average Campaign ROI"
                value="309%"
                delta={24.5}
                deltaLabel="basis points uplift"
                deltaTone="positive"
                icon={<FiAward />}
              />
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Campaign ROI & Lift Momentum</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Tracking aggregate ROI percentages against organizational targets over time.</p>
                  <div style={{ height: "260px" }}>
                    <AreaChart 
                      series={roiTrendSeries}
                      categories={roiTrendCategories}
                      height={260}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Performance by Scheme Category</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Budget allocation versus resulting incremental revenue by promo type.</p>
                  <BarChart 
                    categories={schemeTypeCategories}
                    series={schemeTypeSeries}
                    height={260}
                  />
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Active Schemes Tab */}
        {activeTab === "active" && (
          <div className={styles.tableRow}>
            <Card>
              <div style={{ padding: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)", gap: "var(--space-4)" }}>
                  <div>
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Active Schemes Pipeline</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Monitor budget utilization and status for currently running national promotions.</p>
                  </div>
                  <div style={{ position: "relative", width: "320px" }}>
                    <input
                      type="text"
                      placeholder="Search scheme name or ID..."
                      value={schemeSearch}
                      onChange={(e) => setSchemeSearch(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        paddingLeft: "var(--space-10)",
                        paddingRight: "var(--space-4)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface-sunken)",
                        color: "var(--text-1)",
                        fontSize: "var(--text-sm)"
                      }}
                    />
                    <FiSearch style={{ position: "absolute", left: "12px", top: "13px", color: "var(--text-3)" }} />
                  </div>
                </div>
                <Table 
                  columns={[
                    { 
                      key: "name", 
                      label: "Scheme Program",
                      render: (_, row) => (
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "var(--surface-sunken)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", color: "var(--text-2)" }}>
                            <FiGift size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.type}</div>
                          </div>
                        </div>
                      )
                    },
                    { 
                      key: "audience", 
                      label: "Target Audience",
                      render: (val) => <span style={{ color: "var(--text-2)" }}>{val}</span>
                    },
                    { key: "budget", label: "Allocated Budget", align: "right" },
                    { 
                      key: "burn", 
                      label: "Budget Burn (%)", 
                      align: "right",
                      render: (val) => (
                        <span style={{ fontWeight: 600, color: val > 90 ? "var(--warning-text)" : "inherit" }}>
                          {val}%
                        </span>
                      )
                    },
                    { 
                      key: "trend", 
                      label: "Burn Velocity", 
                      align: "right",
                      render: (val, row) => (
                        <div style={{ width: "80px", marginLeft: "auto" }}>
                          <Sparkline data={val} height={24} color={row.burn > 90 ? "var(--warning)" : "var(--primary)"} />
                        </div>
                      )
                    },
                    { 
                      key: "end", 
                      label: "Closes On",
                      align: "right",
                      render: (val) => (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-sm)", color: "var(--text-2)" }}>
                          <FiClock /> {val}
                        </span>
                      )
                    },
                    { 
                      key: "status", 
                      label: "Status",
                      render: (val) => {
                        let tone = "neutral";
                        if (val === "Active") tone = "success";
                        if (val === "Closing Soon") tone = "warning";
                        if (val === "Draft") tone = "neutral";
                        return (
                          <Badge tone={tone} variant="soft" dot>
                            {val}
                          </Badge>
                        );
                      }
                    }
                  ]}
                  data={filteredSchemes}
                />
              </div>
            </Card>
          </div>
        )}

        {/* ROI Analysis Tab */}
        {activeTab === "roi" && (
          <div className={styles.tableRow}>
            <Card>
              <div style={{ padding: "var(--space-6)" }}>
                <div style={{ marginBottom: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Scheme ROI Analysis</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Granular breakdown of spent budget versus net incremental revenue generation.</p>
                </div>

                <Table
                  columns={[
                    {
                      key: "scheme",
                      label: "Campaign Details",
                      render: (_, row) => (
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                          <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`} fallback={<FiTag />} size="md" />
                          <div>
                            <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • Lead: {row.manager}</div>
                          </div>
                        </div>
                      )
                    },
                    { 
                      key: "territory", 
                      label: "Territory Scope", 
                      render: (val) => (
                        <span style={{ color: "var(--text-1)" }}>{val}</span>
                      )
                    },
                    { key: "spent", label: "Budget Spent", align: "right" },
                    { 
                      key: "returns", 
                      label: "Returns Impact", 
                      align: "right",
                      render: (val) => <span style={{ color: "var(--danger-text)" }}>-{val}</span>
                    },
                    { 
                      key: "incremental", 
                      label: "Incremental Rev", 
                      align: "right",
                      render: (val) => <span style={{ color: "var(--success-text)", fontWeight: 500 }}>{val}</span>
                    },
                    {
                      key: "roi",
                      label: "Net ROI (%)",
                      align: "right",
                      render: (val) => {
                        const numVal = parseInt(val);
                        return (
                          <span style={{ fontWeight: 700, color: numVal > 300 ? "var(--success-text)" : numVal < 250 ? "var(--danger-text)" : "var(--text-1)" }}>
                            {val}
                          </span>
                        );
                      }
                    },
                    {
                      key: "status",
                      label: "Performance",
                      render: (val) => {
                        let tone = "neutral";
                        if (val === "High ROI") tone = "success";
                        if (val === "Low ROI") tone = "danger";
                        if (val === "On Track") tone = "primary";
                        return (
                          <Badge tone={tone} variant="soft" dot>
                            {val}
                          </Badge>
                        );
                      }
                    }
                  ]}
                  data={mockRoiAnalysis}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

