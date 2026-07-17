"use client";
import React, { useState } from "react";
import { FiTrendingUp, FiLayers, FiInfo, FiSearch } from "react-icons/fi";
import { Table, Badge, Card, CardBody, Input } from "../ui";
import styles from "./RoiTracker.module.scss";

export default function RoiTracker() {
  const [searchTerm, setSearchTerm] = useState("");

  const schemes = [
    { name: "Maggi Buy 10 Get 1 Free", territory: "Delhi East", budget: "₹ 45,000", returns: "₹ 2,400", incremental: "₹ 1,85,000", roi: "411%", status: "High ROI" },
    { name: "Tata Salt Bulk 5% Discount", territory: "All Regions", budget: "₹ 85,000", returns: "₹ 1,200", incremental: "₹ 2,68,000", roi: "315%", status: "On Track" },
    { name: "KitKat Supermarket Premium Display", territory: "Noida Central", budget: "₹ 30,000", returns: "₹ 800", incremental: "₹ 62,000", roi: "206%", status: "Low ROI" },
    { name: "Munch Buy 5 Cartons Get ₹ 500 Claim", territory: "Gurugram Central", budget: "₹ 25,000", returns: "₹ 3,500", incremental: "₹ 58,000", roi: "232%", status: "On Track" }
  ];

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Active Scheme Campaign",
      render: (v) => <span className={styles.schemeName}>{v}</span>
    },
    {
      key: "territory",
      header: "Territory Scope"
    },
    {
      key: "budget",
      header: "Budget Spent",
      align: "right",
      mono: true
    },
    {
      key: "returns",
      header: "Returns Impact",
      align: "right",
      mono: true,
      render: (v) => <span className={styles.returnsText}>{v}</span>
    },
    {
      key: "incremental",
      header: "Incremental Rev",
      align: "right",
      mono: true,
      render: (v) => <span className={styles.incText}>{v}</span>
    },
    {
      key: "roi",
      header: "Net ROI %",
      align: "right",
      mono: true,
      render: (v) => <span className={styles.roiText}>{v}</span>
    },
    {
      key: "status",
      header: "Performance",
      align: "center",
      render: (v) => (
        <Badge 
          tone={v === "High ROI" ? "success" : v === "Low ROI" ? "danger" : "warning"} 
          variant="soft"
          dot
        >
          {v}
        </Badge>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.label}>Total Promo Budget</span>
          <span className={styles.value}>₹1,85,000</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.label}>Net Incremental Sales</span>
          <span className={styles.value}>₹5,73,000</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.label}>Overall Campaign ROI</span>
          <span className={styles.value} style={{ color: "var(--success)" }}>309%</span>
        </div>
      </div>

      <Card elevated>
        <CardBody className={styles.cardBodyPaddingNone}>
          <div className={styles.filtersArea}>
            <div className={styles.searchBox}>
              <Input
                leading={<FiSearch />}
                placeholder="Search active schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table 
            columns={columns}
            data={filteredSchemes}
            rowKey={(row) => row.name}
            pageSize={5}
          />
        </CardBody>
      </Card>
    </div>
  );
}
