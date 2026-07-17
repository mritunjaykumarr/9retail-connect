"use client";

import React, { useState } from "react";
import { FiTrendingUp, FiLayers, FiInfo, FiSearch, FiPackage } from "react-icons/fi";
import { 
  StatCard, 
  Card, 
  CardBody, 
  Table, 
  Badge, 
  Input 
} from "../../../../../components/ui";
import styles from "./page.module.scss";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const inventory = [
    { sku: "Maggi Noodles 12-Pack", category: "Packaged Foods", stock: "145 cases", threshold: "150 cases", status: "Low Stock", trend: "+12% MoM" },
    { sku: "Tata Salt 1kg", category: "Staples", stock: "620 cases", threshold: "200 cases", status: "Good Stock", trend: "+2% MoM" },
    { sku: "KitKat Sharebag", category: "Confectionery", stock: "32 cases", threshold: "50 cases", status: "Critical Outage", trend: "-18% MoM" },
    { sku: "Munch Bar 10g", category: "Confectionery", stock: "410 cases", threshold: "100 cases", status: "Good Stock", trend: "+5% MoM" },
    { sku: "Nescafe Classic 50g", category: "Beverages", stock: "18 cases", threshold: "40 cases", status: "Low Stock", trend: "+30% MoM" }
  ];

  const filteredInventory = inventory.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "sku",
      header: "Stock Keeping Unit (SKU)",
      render: (v) => <span className={styles.skuName}>{v}</span>
    },
    {
      key: "category",
      header: "Category"
    },
    {
      key: "stock",
      header: "Current Stock",
      align: "right",
      mono: true
    },
    {
      key: "threshold",
      header: "Safety Threshold",
      align: "right",
      mono: true
    },
    {
      key: "trend",
      header: "Demand Velocity",
      align: "right",
      mono: true,
      render: (v) => (
        <span className={v.startsWith("+") ? styles.trendUp : styles.trendDown}>
          {v}
        </span>
      )
    },
    {
      key: "status",
      header: "Reorder Trigger",
      align: "center",
      render: (v) => (
        <Badge 
          tone={v === "Good Stock" ? "success" : v === "Critical Outage" ? "danger" : "warning"} 
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
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiPackage />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Distributor Portal</span>
              <Badge tone="primary" variant="soft" size="sm">In build</Badge>
            </div>
            <h2>Inventory Overview</h2>
            <p className={styles.subtitle}>Real-time stock on hand and Safety Stock compliance metrics.</p>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          label="Safety Stock Compliance" 
          value="94.2%" 
          deltaLabel="Optimal range is 90%+" 
          icon={<FiTrendingUp />} 
        />
        <StatCard 
          label="Low Stock Reorder Alerts" 
          value="3 SKUs" 
          deltaLabel="Needs immediate attention" 
          icon={<FiLayers />} 
        />
        <StatCard 
          label="Active Outages Detected" 
          value="1 SKU" 
          deltaLabel="Critical status" 
          icon={<FiInfo />} 
        />
      </div>

      <Card>
        <CardBody className={styles.cardBodyPaddingNone}>
          <div className={styles.filtersArea}>
            <div className={styles.searchBox}>
              <Input
                leading={<FiSearch />}
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table 
            columns={columns}
            data={filteredInventory}
            rowKey={(row) => row.sku}
          />
        </CardBody>
      </Card>
    </div>
  );
}
