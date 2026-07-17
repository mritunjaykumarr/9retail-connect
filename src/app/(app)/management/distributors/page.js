"use client";

import React from "react";
import { FiUsers, FiTrendingUp, FiCheckCircle, FiPackage, FiAlertTriangle } from "react-icons/fi";
import { Badge, Card, StatCard, Table, Avatar } from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

// --- Mock Data ---

const regionalChartCategories = ["North", "South", "East", "West"];
const regionalChartSeries = [
  { name: "Target", data: [95, 95, 95, 95], color: "var(--border-strong)" },
  { name: "Actual Fulfillment", data: [93.2, 98.8, 95.1, 89.5], color: "var(--primary)" }
];

const volumeTrendCategories = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const volumeTrendSeries = [
  { name: "Shipment Volume (U)", data: [120, 135, 115, 160, 185, 195], color: "var(--viz-1)" }
];

const mockDistributorData = [
  { id: "DST-001", name: "Aman Verma", location: "Delhi East", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Aman", region: "North", fulfillment: 99.1, onTime: 98.5, returns: 1.2, revenue: "₹8,45,200", status: "Excellent", trend: [60, 70, 85, 95, 98, 99.1] },
  { id: "DST-005", name: "Meera Reddy", location: "Hyderabad South", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Meera", region: "South", fulfillment: 98.8, onTime: 99.0, returns: 0.8, revenue: "₹7,20,000", status: "Excellent", trend: [80, 85, 88, 92, 96, 98.8] },
  { id: "DST-002", name: "Kunal Verma", location: "Delhi Central", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Kunal", region: "North", fulfillment: 97.5, onTime: 96.0, returns: 2.5, revenue: "₹6,85,900", status: "Good", trend: [95, 94, 97, 98, 96, 97.5] },
  { id: "DST-003", name: "Rajesh Gupta", location: "Noida Logistics", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Rajesh", region: "North", fulfillment: 94.2, onTime: 91.8, returns: 4.1, revenue: "₹5,12,300", status: "Average", trend: [99, 97, 96, 94, 92, 94.2] },
  { id: "DST-006", name: "Vikram Singh", location: "Mumbai West", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Vikram", region: "West", fulfillment: 92.0, onTime: 89.5, returns: 5.0, revenue: "₹6,15,400", status: "Average", trend: [88, 85, 89, 90, 91, 92.0] },
  { id: "DST-004", name: "Suresh Kumar", location: "Gurugram Wholesales", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Suresh", region: "North", fulfillment: 88.5, onTime: 85.2, returns: 8.5, revenue: "₹4,42,500", status: "At Risk", trend: [95, 92, 88, 85, 82, 88.5] }
];

export default function DistributorsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiUsers />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Distributor Performance Matrix</h2>
            <p className={styles.subtitle}>A comprehensive analysis of fulfillment speeds, stock accuracy, and regional volume compliance.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <StatCard
            label="Total Active Distributors"
            value="48"
            delta={2}
            deltaLabel="new this quarter"
            icon={<FiUsers />}
          />
          <StatCard
            label="Avg. Fulfillment Rate"
            value="94.8%"
            delta={1.2}
            deltaLabel="vs last month"
            icon={<FiPackage />}
          />
          <StatCard
            label="On-Time Delivery"
            value="92.5%"
            delta={-0.5}
            deltaLabel="vs last month"
            icon={<FiCheckCircle />}
            deltaTone="negative"
          />
          <StatCard
            label="Critical Partners"
            value="3"
            unit=" distributors"
            delta={1}
            deltaLabel="require attention"
            icon={<FiAlertTriangle />}
            tone="critical"
          />
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Regional Fulfillment Rate</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Actual vs Target fulfillment percentage across major zones.</p>
              <BarChart 
                categories={regionalChartCategories}
                series={regionalChartSeries}
                height={260}
              />
            </div>
          </Card>
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>System Volume Trend</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Weekly gross shipment volume processed through all distributors.</p>
              <div style={{ height: "260px" }}>
                <AreaChart 
                  series={volumeTrendSeries}
                  categories={volumeTrendCategories}
                  height={260}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Table Row */}
        <div className={styles.tableRow}>
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>Distributor Leaderboard</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Detailed performance metrics and health status for top regional partners.</p>
              </div>
              <Table 
                columns={[
                  { 
                    key: "distributor", 
                    label: "Distributor Partner",
                    render: (_, row) => (
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <Avatar src={row.avatar} fallback={row.name.charAt(0)} size="md" />
                        <div>
                          <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.location}</div>
                        </div>
                      </div>
                    )
                  },
                  { 
                    key: "region", 
                    label: "Zone",
                    render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
                  },
                  { 
                    key: "fulfillment", 
                    label: "Fulfillment SLA", 
                    align: "right",
                    render: (val) => (
                      <span style={{ color: val < 90 ? "var(--critical)" : "inherit" }}>
                        {val}%
                      </span>
                    )
                  },
                  { key: "onTime", label: "On-Time %", align: "right", render: (v) => `${v}%` },
                  { key: "revenue", label: "Revenue Vol.", align: "right" },
                  { 
                    key: "trend", 
                    label: "Fulfillment Trend (6W)", 
                    align: "right",
                    render: (val, row) => (
                      <div style={{ width: "80px", marginLeft: "auto" }}>
                        <Sparkline data={val} height={24} color={row.fulfillment >= 95 ? "var(--success)" : row.fulfillment < 90 ? "var(--critical)" : "var(--primary)"} />
                      </div>
                    )
                  },
                  { 
                    key: "status", 
                    label: "Health Status",
                    render: (val) => {
                      let tone = "neutral";
                      if (val === "Excellent") tone = "success";
                      if (val === "Good") tone = "primary";
                      if (val === "Average") tone = "warning";
                      if (val === "At Risk") tone = "danger";
                      return (
                        <Badge tone={tone} variant="soft">
                          {val}
                        </Badge>
                      );
                    }
                  }
                ]}
                data={mockDistributorData}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
