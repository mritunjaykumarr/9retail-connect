"use client";

import React from "react";
import { FiDollarSign, FiTrendingUp, FiActivity, FiUsers } from "react-icons/fi";
import { Badge, Card, StatCard, Table } from "../../../../../components/ui";
import AreaChart from "../../../../../components/ui/Chart/AreaChart";
import styles from "./page.module.scss";

const mockChartData = [
  { label: "Jan", value: 12000 },
  { label: "Feb", value: 19000 },
  { label: "Mar", value: 15000 },
  { label: "Apr", value: 22000 },
  { label: "May", value: 28000 },
  { label: "Jun", value: 35000 }
];

const mockTableData = [
  { id: 1, region: "North", metric1: "84%", metric2: "$1.2M", status: "On Track" },
  { id: 2, region: "South", metric1: "76%", metric2: "$950K", status: "At Risk" },
  { id: 3, region: "East", metric1: "92%", metric2: "$1.8M", status: "Exceeding" },
  { id: 4, region: "West", metric1: "88%", metric2: "$1.5M", status: "On Track" }
];

export default function PayoutsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiDollarSign />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <Badge tone="primary" variant="soft" size="sm">Active</Badge>
            </div>
            <h2>Incentive Payouts</h2>
            <p className={styles.subtitle}>Summary of incentive payouts.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <StatCard
            label="Total Value"
            value="$4.2M"
            delta={12.5}
            deltaLabel="vs last quarter"
            icon={<FiTrendingUp />}
          />
          <StatCard
            label="Active Regions"
            value="14"
            delta={2}
            deltaLabel="new this month"
            icon={<FiActivity />}
          />
          <StatCard
            label="Performance Score"
            value="92"
            unit="/100"
            delta={4.1}
            deltaLabel="vs last month"
            icon={<FiUsers />}
          />
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <Card>
            <div style={{ padding: "var(--space-4)", height: "350px" }}>
              <h3 style={{ marginBottom: "var(--space-4)", fontSize: "var(--text-lg)" }}>Trend Overview</h3>
              <AreaChart 
                data={mockChartData}
                xKey="label"
                yKey="value"
                color="var(--primary)"
                gradient
              />
            </div>
          </Card>
        </div>

        {/* Table Row */}
        <div className={styles.tableRow}>
          <Card>
            <div style={{ padding: "var(--space-4)" }}>
              <h3 style={{ marginBottom: "var(--space-4)", fontSize: "var(--text-lg)" }}>Detailed Breakdown</h3>
              <Table 
                columns={[
                  { key: "region", label: "Region" },
                  { key: "metric1", label: "Achievement %", align: "right" },
                  { key: "metric2", label: "Revenue", align: "right" },
                  { 
                    key: "status", 
                    label: "Status",
                    render: (val) => (
                      <Badge tone={val === "At Risk" ? "critical" : val === "Exceeding" ? "success" : "neutral"} variant="soft">
                        {val}
                      </Badge>
                    )
                  }
                ]}
                data={mockTableData}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
