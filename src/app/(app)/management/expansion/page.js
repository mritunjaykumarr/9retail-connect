"use client";

import React, { useState } from "react";
import { 
  FiMapPin, FiTrendingUp, FiActivity, FiUsers, FiTarget, 
  FiMap, FiSearch, FiFlag, FiFilter, FiCalendar, FiClock, FiCrosshair 
} from "react-icons/fi";
import { Badge, Card, StatCard, Table, Avatar, Tabs } from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

// --- Enhanced Mock Data ---

const penetrationTrendCategories = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const penetrationTrendSeries = [
  { name: "Target Outlets", data: [400, 450, 500, 650, 800, 950], color: "var(--viz-4)" },
  { name: "Onboarded Outlets", data: [380, 420, 530, 610, 780, 990], color: "var(--primary)" },
  { name: "Active Transacting", data: [300, 310, 400, 450, 520, 710], color: "var(--success)" }
];

const competitorCategories = ["Tier 2 North", "Eastern Periphery", "South Corridors", "West Rural", "Central Hubs"];
const competitorSeries = [
  { name: "Our Market Share (%)", data: [12, 5, 22, 8, 35], color: "var(--primary)" },
  { name: "Competitor A (%)", data: [45, 60, 15, 75, 40], color: "var(--border-strong)" },
  { name: "Competitor B (%)", data: [20, 10, 40, 5, 15], color: "var(--viz-2)" }
];

const budgetCategories = ["Campaign Alpha", "Nashik Blitz", "Kerala Surge", "Assam Outreach"];
const budgetSeries = [
  { name: "Allocated Budget (₹L)", data: [15, 8, 25, 12], color: "var(--border-strong)" },
  { name: "Actual Spend (₹L)", data: [14.5, 9.2, 21.0, 11.5], color: "var(--primary)" }
];

const mockTerritoriesData = [
  { id: "TR-201", name: "Avadh Belt", type: "Rural", manager: "Vikas T.", potential: "₹8.5Cr", outlets: "1,200", active: "850", penetration: 15.2, status: "Untapped", trend: [2, 3, 4, 8, 12, 15] },
  { id: "TR-205", name: "Coastal Andhra", type: "Semi-Urban", manager: "Suresh P.", potential: "₹14.2Cr", outlets: "3,400", active: "2,100", penetration: 42.5, status: "Developing", trend: [30, 32, 35, 38, 40, 42] },
  { id: "TR-110", name: "Pune Outskirts", type: "Urban Fringe", manager: "Meera K.", potential: "₹6.8Cr", outlets: "2,100", active: "1,950", penetration: 75.0, status: "Saturated", trend: [70, 72, 73, 74, 75, 75] },
  { id: "TR-304", name: "Brahmaputra Valley", type: "Rural", manager: "Arun B.", potential: "₹5.1Cr", outlets: "850", active: "120", penetration: 8.5, status: "Untapped", trend: [1, 2, 2, 4, 6, 8] },
  { id: "TR-212", name: "Malwa Plateau", type: "Semi-Urban", manager: "Deepak S.", potential: "₹9.4Cr", outlets: "1,850", active: "1,150", penetration: 28.4, status: "Developing", trend: [15, 18, 20, 24, 26, 28] },
  { id: "TR-401", name: "Kutch Periphery", type: "Rural", manager: "Nitin P.", potential: "₹3.2Cr", outlets: "450", active: "50", penetration: 5.1, status: "Untapped", trend: [1, 1, 2, 3, 4, 5] },
  { id: "TR-502", name: "Coimbatore Industrial", type: "Urban Fringe", manager: "Priya R.", potential: "₹11.5Cr", outlets: "2,800", active: "2,200", penetration: 62.0, status: "Developing", trend: [45, 48, 52, 58, 60, 62] }
];

const mockRecentExpansions = [
  { id: "EXP-801", name: "Kochi Hub", manager: "Rajeev M.", date: "12 Jun 2026", duration: "45 Days", cost: "₹1.2L", generated: "₹3.4L", roi: "183%", status: "High Yield" },
  { id: "EXP-802", name: "Nashik Belt", manager: "Anita S.", date: "28 May 2026", duration: "60 Days", cost: "₹0.8L", generated: "₹1.5L", roi: "87%", status: "On Track" },
  { id: "EXP-803", name: "Siliguri Route", manager: "Vikram B.", date: "15 Apr 2026", duration: "90 Days", cost: "₹2.5L", generated: "₹3.0L", roi: "20%", status: "Needs Attention" },
  { id: "EXP-804", name: "Surat Periphery", manager: "Mehul P.", date: "02 Mar 2026", duration: "120 Days", cost: "₹1.5L", generated: "₹5.1L", roi: "240%", status: "High Yield" },
  { id: "EXP-805", name: "Bhopal Rural", manager: "Sanjay D.", date: "10 Jul 2026", duration: "15 Days", cost: "₹0.5L", generated: "₹0.2L", roi: "-60%", status: "Early Stage" }
];

const liveFeedData = [
  { time: "10 mins ago", retailer: "Shri Krishna Stores", territory: "Avadh Belt", action: "First Order Placed (₹4,500)", status: "Active" },
  { time: "25 mins ago", retailer: "Balaji Traders", territory: "Malwa Plateau", action: "KYC Approved & Onboarded", status: "Onboarded" },
  { time: "1 hour ago", retailer: "New Modern Mart", territory: "Coastal Andhra", action: "Assigned to Beat Route 4A", status: "Mapped" },
  { time: "2 hours ago", retailer: "Sivami Provision", territory: "Pune Outskirts", action: "First Order Placed (₹12,200)", status: "Active" },
  { time: "3 hours ago", retailer: "Gupta General", territory: "Avadh Belt", action: "App Downloaded & Verified", status: "Verified" }
];

export default function ExpansionPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [territorySearch, setTerritorySearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const filteredTerritories = mockTerritoriesData.filter(
    (item) =>
      (regionFilter === "All Regions" || item.status === regionFilter || item.type === regionFilter) &&
      (item.name.toLowerCase().includes(territorySearch.toLowerCase()) ||
       item.id.toLowerCase().includes(territorySearch.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiMapPin />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Expansion & White-Space Map</h2>
            <p className={styles.subtitle}>Identify white-space opportunities, track new market penetration, monitor competitor density, and measure expansion ROI.</p>
          </div>
        </div>
      </div>

      {/* Global Filters */}
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-2)", background: "var(--surface)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-2)", fontWeight: 500 }}>
          <FiFilter /> Filters:
        </div>
        <select 
          value={regionFilter} 
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface-sunken)", color: "var(--text-1)" }}
        >
          <option>All Regions</option>
          <option>Untapped</option>
          <option>Developing</option>
          <option>Saturated</option>
          <option>Rural</option>
          <option>Semi-Urban</option>
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
              { value: "whitespace", label: "Territory Deep Dive" },
              { value: "campaigns", label: "Campaign ROI & Budgets" },
              { value: "feed", label: "Live Onboarding Feed" }
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
                label="New Outlets Onboarded"
                value="1,245"
                delta={8.4}
                deltaLabel="vs last quarter"
                icon={<FiUsers />}
              />
              <StatCard
                label="Total Addressable Market"
                value="₹45.2Cr"
                delta={4.1}
                deltaLabel="expansion identified"
                deltaTone="positive"
                icon={<FiTarget />}
              />
              <StatCard
                label="Active Expansion Zones"
                value="24"
                delta={3}
                deltaLabel="launched this month"
                deltaTone="positive"
                icon={<FiMap />}
              />
              <StatCard
                label="Avg Cost of Acquisition"
                value="₹840"
                unit=" / outlet"
                delta={-12.5}
                deltaLabel="reduction in CAC"
                deltaTone="positive"
                icon={<FiActivity />}
              />
            </div>

            {/* Charts Row 1 */}
            <div className={styles.chartsRow}>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Outlet Penetration & Activation</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Target vs Onboarded vs Active transacting outlets in expansion zones.</p>
                  <div style={{ height: "260px" }}>
                    <AreaChart 
                      series={penetrationTrendSeries}
                      categories={penetrationTrendCategories}
                      height={260}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Competitor Density in Expansion Zones</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Our market share vs leading competitors in key white-space areas.</p>
                  <BarChart 
                    categories={competitorCategories}
                    series={competitorSeries}
                    height={260}
                  />
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Territory Deep Dive Tab */}
        {(activeTab === "whitespace") && (
          <div className={styles.tableRow}>
            <Card>
              <div style={{ padding: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)", gap: "var(--space-4)" }}>
                  <div>
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Territory Expansion Grid</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Detailed breakdown of market potential, current penetration, and activation rates.</p>
                  </div>
                  <div style={{ position: "relative", width: "320px" }}>
                    <input
                      type="text"
                      placeholder="Search territory name or ID..."
                      value={territorySearch}
                      onChange={(e) => setTerritorySearch(e.target.value)}
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
                      label: "Territory / Manager",
                      render: (_, row) => (
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                          <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`} fallback={<FiMapPin />} size="md" />
                          <div>
                            <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.manager}</div>
                          </div>
                        </div>
                      )
                    },
                    { 
                      key: "type", 
                      label: "Topology",
                      render: (val) => <span style={{ color: "var(--text-2)" }}>{val}</span>
                    },
                    { key: "potential", label: "Est. Potential", align: "right" },
                    { 
                      key: "outlets", 
                      label: "Onboarded / Active", 
                      align: "right",
                      render: (_, row) => (
                        <div>
                          <span style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.active}</span>
                          <span style={{ color: "var(--text-3)", margin: "0 4px" }}>/</span>
                          <span style={{ color: "var(--text-2)", fontSize: "var(--text-xs)" }}>{row.outlets}</span>
                        </div>
                      )
                    },
                    { 
                      key: "penetration", 
                      label: "Penetration (%)", 
                      align: "right",
                      render: (val) => (
                        <span style={{ fontWeight: 600, color: val < 20 ? "var(--warning-text)" : "inherit" }}>
                          {val}%
                        </span>
                      )
                    },
                    { 
                      key: "trend", 
                      label: "6W Momentum", 
                      align: "right",
                      render: (val, row) => (
                        <div style={{ width: "80px", marginLeft: "auto" }}>
                          <Sparkline data={val} height={24} color={row.penetration > 50 ? "var(--success)" : "var(--primary)"} />
                        </div>
                      )
                    },
                    { 
                      key: "status", 
                      label: "Market Phase",
                      render: (val) => {
                        let tone = "neutral";
                        if (val === "Saturated") tone = "success";
                        if (val === "Developing") tone = "primary";
                        if (val === "Untapped") tone = "warning";
                        return (
                          <Badge tone={tone} variant="soft" dot>
                            {val}
                          </Badge>
                        );
                      }
                    }
                  ]}
                  data={filteredTerritories}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className={styles.chartsRow}>
              <Card>
                <div style={{ padding: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Campaign Spend vs Budget</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Financial efficiency tracking across top expansion campaigns.</p>
                  <BarChart 
                    categories={budgetCategories}
                    series={budgetSeries}
                    height={220}
                  />
                </div>
              </Card>
              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "var(--space-4)" }}>
                <StatCard
                  label="Average Campaign ROI"
                  value="134%"
                  delta={12.5}
                  deltaLabel="improvement YTD"
                  deltaTone="positive"
                  icon={<FiTrendingUp />}
                  style={{ height: "100%" }}
                />
                <StatCard
                  label="Total Expansion Spend"
                  value="₹8.4L"
                  delta={-2.1}
                  deltaLabel="under budget"
                  deltaTone="positive"
                  icon={<FiCrosshair />}
                  style={{ height: "100%" }}
                />
              </div>
            </div>

            <Card>
              <div style={{ padding: "var(--space-6)" }}>
                <div style={{ marginBottom: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Campaign ROI & Performance</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Track the performance and ROI of recent go-to-market pushes.</p>
                </div>

                <Table
                  columns={[
                    {
                      key: "campaign",
                      label: "Campaign Details",
                      render: (_, row) => (
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                          <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${row.name}`} fallback={<FiFlag />} size="md" />
                          <div>
                            <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name} Push</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • Lead: {row.manager}</div>
                          </div>
                        </div>
                      )
                    },
                    { 
                      key: "date", 
                      label: "Timeline", 
                      render: (_, row) => (
                        <div>
                          <div style={{ color: "var(--text-1)" }}>{row.date}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{row.duration}</div>
                        </div>
                      )
                    },
                    { key: "cost", label: "Total Cost", align: "right" },
                    { key: "generated", label: "Rev Generated", align: "right" },
                    {
                      key: "roi",
                      label: "ROI (Net)",
                      align: "right",
                      render: (val) => {
                        const numVal = parseInt(val);
                        return (
                          <span style={{ fontWeight: 600, color: numVal > 100 ? "var(--success-text)" : numVal < 0 ? "var(--danger-text)" : "var(--warning-text)" }}>
                            {val}
                          </span>
                        );
                      }
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (val) => {
                        let tone = "neutral";
                        if (val === "High Yield") tone = "success";
                        if (val === "Needs Attention") tone = "danger";
                        if (val === "On Track") tone = "primary";
                        if (val === "Early Stage") tone = "neutral";
                        return (
                          <Badge tone={tone} variant="soft" dot>
                            {val}
                          </Badge>
                        );
                      }
                    }
                  ]}
                  data={mockRecentExpansions}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Live Feed Tab */}
        {activeTab === "feed" && (
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Live Retailer Onboarding Feed</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Real-time activity log of new retailers being onboarded in white-space zones.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {liveFeedData.map((feed, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", paddingBottom: "var(--space-4)", borderBottom: i !== liveFeedData.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ padding: "10px", background: "var(--primary-soft)", color: "var(--primary)", borderRadius: "50%" }}>
                      <FiActivity />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-1)" }}>{feed.retailer}</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <FiClock /> {feed.time}
                        </span>
                      </div>
                      <div style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "8px" }}>
                        {feed.action} in <strong>{feed.territory}</strong> territory.
                      </div>
                      <div>
                        <Badge tone={feed.status === "Active" ? "success" : feed.status === "Mapped" ? "primary" : "neutral"} variant="soft" dot size="sm">
                          {feed.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


