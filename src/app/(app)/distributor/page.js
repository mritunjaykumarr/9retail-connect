"use client";

import React, { useState } from "react";
import { FiInbox, FiDollarSign, FiPackage, FiTruck, FiChevronRight } from "react-icons/fi";
import { 
  StatCard, 
  Card, 
  CardBody, 
  Table, 
  Badge, 
  Button, 
  Donut
} from "../../../../components/ui";
import styles from "./page.module.scss";

// Initial orders list matching reference screenshot
const initialOrders = [
  { id: "DRO - 20260713 - 01389", retailer: "Sri Super Market", booked: "13 Jul", status: "Pending", value: "₹10.7K" },
  { id: "DRO - 20260713 - 01395", retailer: "New Departmental Store", booked: "13 Jul", status: "Pending", value: "₹676" },
  { id: "DRO - 20260713 - 01396", retailer: "Green Departmental Store", booked: "13 Jul", status: "Pending", value: "₹4.5K" },
];

export default function DistributorDashboard() {
  const [orders] = useState(initialOrders);

  const columns = [
    {
      key: "id",
      header: "Order",
      render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      key: "retailer",
      header: "Retailer",
      render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      key: "booked",
      header: "Booked",
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <Badge tone="warning" dot>
          {v}
        </Badge>
      ),
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      mono: true,
      render: (v) => <strong>{v}</strong>,
    },
  ];

  const donutData = [
    { label: "Healthy", value: 68, color: "var(--success)" },
    { label: "Below reorder", value: 16, color: "var(--warning)" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.distributorLabel}>Distributor Portal</span>
          <h2>All distributors</h2>
          <p className={styles.subtitle}>Rolled up across 6 distributors in your scope.</p>
        </div>
        <button type="button" className={styles.nationalViewBtn}>
          <span className={styles.statusDot} />
          National view
        </button>
      </div>

      {/* Stats row */}
      <div className={styles.statsGrid}>
        <StatCard 
          label="Open orders" 
          value="54" 
          deltaLabel="Pending + confirmed" 
          icon={<FiInbox />} 
        />
        <StatCard 
          label="Value to fulfil" 
          value="₹1.5L" 
          deltaLabel="Across open orders" 
          icon={<FiDollarSign />} 
        />
        <StatCard 
          label="SKUs below reorder" 
          value="16" 
          deltaLabel="of 84 stocked" 
          icon={<FiPackage />} 
        />
        <StatCard 
          label="Fill rate (30d)" 
          value="79%" 
          deltaLabel="Delivered vs booked" 
          icon={<FiTruck />} 
        />
      </div>

      {/* Main content grid */}
      <div className={styles.contentGrid}>
        {/* Order Inbox card */}
        <Card>
          <div className={styles.cardHeader}>
            <div>
              <h3>Order inbox</h3>
              <p className={styles.cardSubtitle}>Secondary orders waiting on your warehouse</p>
            </div>
            <a className={styles.linkText} href="/distributor">
              Open Inbox
            </a>
          </div>
          <CardBody className={styles.cardBody}>
            <Table
              className={styles.tableWrap}
              columns={columns}
              data={orders}
              rowKey={(row) => row.id}
            />
          </CardBody>
        </Card>

        {/* Stock Coverage card */}
        <Card>
          <div className={styles.cardHeader}>
            <div>
              <h3>Stock coverage</h3>
              <p className={styles.cardSubtitle}>SKUs above vs below reorder level</p>
            </div>
          </div>
          <CardBody className={styles.cardBody}>
            <div className={styles.chartContainer}>
              <Donut
                data={donutData}
                centerValue="84"
                centerLabel="SKUS"
                size={160}
                thickness={20}
                showLegend={true}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
