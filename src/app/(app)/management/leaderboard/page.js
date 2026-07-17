"use client";

import React from "react";
import { FiAward } from "react-icons/fi";
import { Badge } from "../../../../../components/ui";
import ManagementLeaderboards from "../../../../../components/management/ManagementLeaderboards";
import styles from "./page.module.scss";

export default function LeaderboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiAward />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Management</span>
              <Badge tone="primary" variant="soft" size="sm">Active</Badge>
            </div>
            <h2>National Sales Leaderboard</h2>
            <p className={styles.subtitle}>Real-time ranking of top-performing Sales Officers and distributor fulfillment matrix.</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <ManagementLeaderboards />
      </div>
    </div>
  );
}
