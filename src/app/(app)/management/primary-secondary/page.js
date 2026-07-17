"use client";

import React from "react";
import { FiBarChart2 } from "react-icons/fi";
import { Badge } from "../../../../../components/ui";
import SalesGaps from "../../../../../components/management/SalesGaps";
import styles from "./page.module.scss";

export default function PrimarySecondaryPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiBarChart2 />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <Badge tone="primary" variant="soft" size="sm">Active</Badge>
            </div>
            <h2>Primary vs Secondary Sales</h2>
            <p className={styles.subtitle}>Analyze target variances and identify gaps between distributor billing and secondary sales bookings.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <SalesGaps />
      </div>
    </div>
  );
}
