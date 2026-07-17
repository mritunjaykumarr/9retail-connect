"use client";

import React from "react";
import { FiTrendingUp, FiLayers, FiInfo } from "react-icons/fi";
import { StatCard, Card, CardBody, AreaChart, Select, Badge } from "../../../../../components/ui";
import styles from "./page.module.scss";

export default function ForecastPage() {
  const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const series = [
    {
      name: "Demand",
      data: [120, 150, 140, 180, 200, 170, 210, 270, 320],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiTrendingUp />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>AI Projections</span>
              <Badge tone="primary" variant="soft" size="sm">In build</Badge>
            </div>
            <h2>Stock Demand Forecast</h2>
            <p className={styles.subtitle}>AI-powered replenishment projections and safety stock triggers.</p>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          label="Forecast Accuracy" 
          value="98.4%" 
          deltaLabel="Calculated over 90 days" 
          icon={<FiTrendingUp />} 
        />
        <StatCard 
          label="Predicted Safety Stock Shortfall" 
          value="12 SKUs" 
          deltaLabel="Replenishment recommended" 
          icon={<FiLayers />} 
        />
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitleArea}>
            <div className={styles.iconWrapper}>
              <FiTrendingUp size={18} />
            </div>
            <h3>
              Stock Forecast <span className={styles.chartSubtitle}>(Next 3 Months)</span>
            </h3>
          </div>
          <div className={styles.dropdown}>
            <Select
              options={[{ value: "all", label: "All Categories" }]}
              defaultValue="all"
            />
          </div>
        </div>

        <div className={styles.yAxisLabel}>Demand (Units)</div>

        <div className={styles.chartWrapper}>
          <AreaChart
            series={series}
            categories={categories}
            height={280}
            showLegend={false}
          />
        </div>
      </div>
    </div>
  );
}
