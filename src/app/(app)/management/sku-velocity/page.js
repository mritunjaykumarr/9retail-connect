"use client";

import React from "react";
import { FiZap, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiBox } from "react-icons/fi";
import { Badge, Card, StatCard, Table, Avatar } from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import BarChart from "../../../../../components/ui/Chart/BarChart";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

// --- Mock Data ---

const categoryVelocityCategories = ["Beverages", "Snacks", "Personal Care", "Pantry"];
const categoryVelocitySeries = [
  { name: "Target Velocity (u/d)", data: [4.5, 5.0, 2.0, 3.5], color: "var(--border-strong)" },
  { name: "Actual Velocity (u/d)", data: [5.2, 4.8, 1.5, 3.8], color: "var(--viz-3)" }
];

const velocityTrendCategories = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const velocityTrendSeries = [
  { name: "Avg Velocity (u/d)", data: [3.2, 3.4, 3.8, 4.1, 4.0, 4.2], color: "var(--viz-2)" }
];

const mockSkuData = [
  { id: "SKU-1001", name: "Premium Mango Juice 1L", category: "Beverages", avatar: "https://api.dicebear.com/9.x/icons/svg?seed=mango&backgroundColor=ffdfbf", sold: "12,450", velocity: 5.2, daysLeft: 12, status: "Fast Moving", trend: [3.1, 3.8, 4.2, 4.8, 5.0, 5.2] },
  { id: "SKU-2042", name: "Spicy Potato Chips 50g", category: "Snacks", avatar: "https://api.dicebear.com/9.x/icons/svg?seed=chips&backgroundColor=ffd5d5", sold: "18,900", velocity: 6.8, daysLeft: 8, status: "Fast Moving", trend: [6.0, 6.2, 6.5, 6.8, 6.7, 6.8] },
  { id: "SKU-4051", name: "Organic Honey 250g", category: "Pantry", avatar: "https://api.dicebear.com/9.x/icons/svg?seed=honey&backgroundColor=fff5cc", sold: "3,100", velocity: 3.8, daysLeft: 30, status: "Stable", trend: [3.5, 3.6, 3.6, 3.7, 3.8, 3.8] },
  { id: "SKU-3015", name: "Herbal Soap 100g", category: "Personal Care", avatar: "https://api.dicebear.com/9.x/icons/svg?seed=soap&backgroundColor=d5ffea", sold: "4,200", velocity: 1.5, daysLeft: 45, status: "Stable", trend: [1.8, 1.7, 1.6, 1.5, 1.6, 1.5] },
  { id: "SKU-2088", name: "Roasted Almonds 200g", category: "Snacks", avatar: "https://api.dicebear.com/9.x/icons/svg?seed=almonds&backgroundColor=ffeadd", sold: "5,600", velocity: 2.1, daysLeft: 22, status: "Stable", trend: [2.5, 2.3, 2.2, 2.0, 2.1, 2.1] },
  { id: "SKU-1099", name: "Green Tea Box 50s", category: "Beverages", avatar: "https://api.dicebear.com/9.x/icons/svg?seed=tea&backgroundColor=e6ffd5", sold: "850", velocity: 0.3, daysLeft: 90, status: "Slow Moving", trend: [0.8, 0.6, 0.5, 0.4, 0.3, 0.3] }
];

export default function SkuVelocityPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiZap />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>SKU Velocity</h2>
            <p className={styles.subtitle}>Track product movement rates, identify slow-movers, and optimize shelf space.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <StatCard
            label="Avg. SKU Velocity"
            value="4.2"
            unit=" units/day"
            delta={8.5}
            deltaLabel="vs last month"
            icon={<FiTrendingUp />}
          />
          <StatCard
            label="Fast Moving SKUs"
            value="145"
            delta={12}
            deltaLabel="new items added"
            icon={<FiZap />}
          />
          <StatCard
            label="Slow Moving SKUs"
            value="32"
            delta={-4}
            deltaLabel="fewer than last month"
            icon={<FiTrendingDown />}
            deltaTone="positive" // Decreasing slow movers is good
          />
          <StatCard
            label="Stockout Risk"
            value="18"
            unit=" SKUs"
            delta={3}
            deltaLabel="high risk items"
            icon={<FiAlertCircle />}
            tone="critical"
          />
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Category Velocity (Units/Day)</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Actual vs Target sales velocity across major product categories.</p>
              <BarChart 
                categories={categoryVelocityCategories}
                series={categoryVelocitySeries}
                height={260}
              />
            </div>
          </Card>
          <Card>
            <div style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-2)" }}>System Velocity Trend</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)", marginBottom: "var(--space-6)" }}>Weekly average units sold per store per day system-wide.</p>
              <div style={{ height: "260px" }}>
                <AreaChart 
                  series={velocityTrendSeries}
                  categories={velocityTrendCategories}
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
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-1)" }}>SKU Performance Breakdown</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-2)" }}>Detailed metrics for the top active SKUs across all categories.</p>
              </div>
              <Table 
                columns={[
                  { 
                    key: "product", 
                    label: "SKU",
                    render: (_, row) => (
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <Avatar src={row.avatar} fallback={<FiBox />} size="md" />
                        <div>
                          <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{row.name}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-2)" }}>{row.id} • {row.category}</div>
                        </div>
                      </div>
                    )
                  },
                  { 
                    key: "category", 
                    label: "Category",
                    render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
                  },
                  { key: "sold", label: "Units Sold (30d)", align: "right" },
                  { 
                    key: "velocity", 
                    label: "Velocity (u/d)", 
                    align: "right",
                    render: (val) => (
                      <span style={{ fontWeight: 600 }}>{val}</span>
                    )
                  },
                  { 
                    key: "trend", 
                    label: "6W Trend", 
                    align: "right",
                    render: (val, row) => (
                      <div style={{ width: "80px", marginLeft: "auto" }}>
                        <Sparkline data={val} height={24} color={row.velocity >= 4.0 ? "var(--success)" : row.velocity < 1.0 ? "var(--critical)" : "var(--primary)"} />
                      </div>
                    )
                  },
                  { 
                    key: "daysLeft", 
                    label: "Inventory Days", 
                    align: "right",
                    render: (val) => (
                      <span style={{ color: val < 15 ? "var(--critical)" : "inherit" }}>
                        {val}d
                      </span>
                    )
                  },
                  { 
                    key: "status", 
                    label: "Status",
                    render: (val) => {
                      let tone = "neutral";
                      if (val === "Fast Moving") tone = "success";
                      if (val === "Stable") tone = "primary";
                      if (val === "Slow Moving") tone = "warning";
                      return (
                        <Badge tone={tone} variant="soft">
                          {val}
                        </Badge>
                      );
                    }
                  }
                ]}
                data={mockSkuData}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
