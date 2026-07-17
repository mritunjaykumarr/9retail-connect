"use client";

import React from "react";
import { FiDollarSign } from "react-icons/fi";
import { Badge } from "../../../../../components/ui";
import NationalOverview from "../../../../../components/management/NationalOverview";
import styles from "./page.module.scss";

export default function PnlPage() {
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
            <h2>Territory P&amp;L Map</h2>
            <p className={styles.subtitle}>National and regional performance map overlay with margin analysis.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <NationalOverview />
      </div>
    </div>
  );
}
