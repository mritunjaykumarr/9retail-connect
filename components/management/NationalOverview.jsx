"use client";
import React from "react";
import { FiTrendingUp, FiMapPin, FiAward, FiLayers, FiDollarSign } from "react-icons/fi";
import styles from "./NationalOverview.module.scss";

export default function NationalOverview() {
  const kpis = [
    {
      id: "revenue",
      title: "Total Revenue (YTD)",
      value: "₹24,85,900",
      change: "+12.4% vs Target",
      isPositive: true,
      icon: <FiDollarSign size={20} />,
      color: "cobalt"
    },
    {
      id: "margin",
      title: "Gross Margin %",
      value: "18.2%",
      change: "+0.5% vs Target",
      isPositive: true,
      icon: <FiAward size={20} />,
      color: "emerald"
    },
    {
      id: "territory",
      title: "Active Territories",
      value: "4 / 4",
      change: "100% Operations Active",
      isPositive: true,
      icon: <FiLayers size={20} />,
      color: "amber"
    },
    {
      id: "roi",
      title: "Schemes Net ROI",
      value: "285%",
      change: "Target: 250%",
      isPositive: true,
      icon: <FiTrendingUp size={20} />,
      color: "purple"
    }
  ];

  const regions = [
    { name: "North Territory", revenue: "₹8,45,200", margin: "19.1%", soActive: 14, status: "Profitable", color: "#1f53e5" },
    { name: "South Territory", revenue: "₹6,85,900", margin: "18.5%", soActive: 12, status: "Profitable", color: "#10b981" },
    { name: "East Territory", revenue: "₹5,12,300", margin: "15.4%", soActive: 9, status: "Underperforming", color: "#f59e0b" },
    { name: "West Territory", revenue: "₹4,42,500", margin: "19.8%", soActive: 10, status: "Profitable", color: "#8b5cf6" }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.id} className={`${styles.kpiCard} ${styles[kpi.color]}`}>
            <div className={styles.cardHeader}>
              <span className={styles.kpiTitle}>{kpi.title}</span>
              <div className={styles.iconWrapper}>{kpi.icon}</div>
            </div>
            <div className={styles.valueRow}>
              <span className={styles.kpiValue}>{kpi.value}</span>
            </div>
            <div className={styles.cardFooter}>
              <span className={`${styles.changeText} ${kpi.isPositive ? styles.positive : styles.negative}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mapGrid}>
        <div className={styles.mapCard}>
          <div className={styles.mapHeader}>
            <h3 className={styles.sectionTitle}>National P&L Territory Map</h3>
            <span className={styles.liveBadge}>
              <span className={styles.dot}></span> Live Regional Data
            </span>
          </div>

          <div className={styles.mapWorkspace}>
            <div className={styles.vectorMap}>
              {regions.map((region, idx) => (
                <div
                  key={idx}
                  className={`${styles.mapNode} ${region.status === "Profitable" ? styles.nodeProfitable : styles.nodeWarning}`}
                  style={{
                    top: idx === 0 ? "25%" : idx === 1 ? "70%" : idx === 2 ? "45%" : "40%",
                    left: idx === 0 ? "48%" : idx === 1 ? "52%" : idx === 2 ? "72%" : "28%"
                  }}
                >
                  <FiMapPin size={24} className={styles.pinIcon} />
                  <div className={styles.nodeTooltip}>
                    <strong>{region.name}</strong>
                    <span>Rev: {region.revenue}</span>
                    <span>Margin: {region.margin}</span>
                  </div>
                </div>
              ))}

              <svg className={styles.connections} width="100%" height="100%">
                <line x1="48%" y1="25%" x2="72%" y2="45%" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="48%" y1="25%" x2="28%" y2="40%" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="28%" y1="40%" x2="52%" y2="70%" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="72%" y1="45%" x2="52%" y2="70%" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.regionListCard}>
          <h3 className={styles.sectionTitle}>Territory Financial Highlights</h3>
          <div className={styles.regionList}>
            {regions.map((region, idx) => (
              <div key={idx} className={styles.regionItem}>
                <div className={styles.regionHeader}>
                  <div className={styles.colorIndicator} style={{ backgroundColor: region.color }}></div>
                  <span className={styles.regionName}>{region.name}</span>
                  <span className={`${styles.statusBadge} ${region.status === "Profitable" ? styles.success : styles.warning}`}>
                    {region.status}
                  </span>
                </div>

                <div className={styles.regionMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.label}>Revenue</span>
                    <span className={styles.value}>{region.revenue}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Gross Margin</span>
                    <span className={styles.value}>{region.margin}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Active SOs</span>
                    <span className={styles.value}>{region.soActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
