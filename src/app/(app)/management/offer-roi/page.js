"use client";

import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { Badge } from "../../../../../components/ui";
import RoiTracker from "../../../../../components/management/RoiTracker";
import styles from "./page.module.scss";

export default function OfferRoiPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiTrendingUp />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <Badge tone="primary" variant="soft" size="sm">Active</Badge>
            </div>
            <h2>Offer ROI Analysis</h2>
            <p className={styles.subtitle}>Incremental revenue generation and campaign profit assessment.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <RoiTracker />
      </div>
    </div>
  );
}
