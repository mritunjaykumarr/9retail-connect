"use client";
import React from "react";
import { FiAward, FiStar, FiUser, FiActivity } from "react-icons/fi";
import styles from "./ManagementLeaderboards.module.scss";

export default function ManagementLeaderboards() {
  const topSOs = [
    { rank: 1, name: "Rohit Sharma", achievement: "114.5%", ordersCount: 84, avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Rohit" },
    { rank: 2, name: "Neha Patel", achievement: "108.2%", ordersCount: 79, avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Neha" },
    { rank: 3, name: "Priya Singh", achievement: "102.0%", ordersCount: 72, avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Priya" },
    { rank: 4, name: "Arjun Mehta", achievement: "94.8%", ordersCount: 68, avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Arjun" }
  ];

  const topDistributors = [
    { rank: 1, name: "Aman Verma (Delhi East)", fulfillment: "99.1%", revenue: "₹8,45,200", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Aman" },
    { rank: 2, name: "Kunal Verma (Delhi Central)", fulfillment: "97.5%", revenue: "₹6,85,900", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Kunal" },
    { rank: 3, name: "Rajesh Gupta (Noida Logistics)", fulfillment: "94.2%", revenue: "₹5,12,300", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Rajesh" },
    { rank: 4, name: "Suresh Kumar (Gurugram Wholesales)", fulfillment: "91.8%", revenue: "₹4,42,500", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Suresh" }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* SO Leaderboard */}
        <div className={styles.leaderboardCard}>
          <div className={styles.cardHeader}>
            <FiAward size={20} className={styles.headerIcon} style={{ color: "#f59e0b" }} />
            <h3 className={styles.cardTitle}>Top Sales Officers (Target achievement)</h3>
          </div>

          <div className={styles.list}>
            {topSOs.map((so) => (
              <div key={so.rank} className={styles.item}>
                <div className={styles.rankBadge} style={{
                  background: so.rank === 1 ? "gold" : so.rank === 2 ? "silver" : so.rank === 3 ? "#cd7f32" : "var(--border-subtle)",
                  color: so.rank <= 3 ? "black" : "var(--text-2)"
                }}>
                  {so.rank}
                </div>

                <img src={so.avatar} alt={so.name} className={styles.avatar} loading="lazy" />

                <div className={styles.info}>
                  <span className={styles.name}>{so.name}</span>
                  <span className={styles.subtitle}>{so.ordersCount} orders booked</span>
                </div>

                <div className={styles.metric}>
                  <span className={styles.value}>{so.achievement}</span>
                  <span className={styles.label}>of Quota</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distributor Leaderboard */}
        <div className={styles.leaderboardCard}>
          <div className={styles.cardHeader}>
            <FiActivity size={20} className={styles.headerIcon} style={{ color: "var(--primary)" }} />
            <h3 className={styles.cardTitle}>Top Distributors (Fulfillment Rate)</h3>
          </div>

          <div className={styles.list}>
            {topDistributors.map((dist) => (
              <div key={dist.rank} className={styles.item}>
                <div className={styles.rankBadge} style={{
                  background: dist.rank === 1 ? "gold" : dist.rank === 2 ? "silver" : dist.rank === 3 ? "#cd7f32" : "var(--border-subtle)",
                  color: dist.rank <= 3 ? "black" : "var(--text-2)"
                }}>
                  {dist.rank}
                </div>

                <img src={dist.avatar} alt={dist.name} className={styles.avatar} loading="lazy" />

                <div className={styles.info}>
                  <span className={styles.name}>{dist.name}</span>
                  <span className={styles.subtitle}>Volume: {dist.revenue}</span>
                </div>

                <div className={styles.metric}>
                  <span className={styles.value}>{dist.fulfillment}</span>
                  <span className={styles.label}>Fulfilled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
