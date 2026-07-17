"use client";

import React, { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowDown,
  FiPackage,
  FiPercent,
  FiSearch,
  FiShoppingCart,
  FiTrendingDown,
} from "react-icons/fi";
import {
  AreaChart,
  Badge,
  BarChart,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  StatCard,
  Table,
} from "../ui";
import styles from "./SalesGaps.module.scss";

const salesTrendCategories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const salesTrendSeries = [
  { name: "Primary sales", data: [168, 176, 184, 191, 205, 214], color: "var(--viz-1)" },
  { name: "Secondary sales", data: [156, 163, 170, 179, 191, 203], color: "var(--viz-2)" },
];

const regionalSalesSeries = [
  { name: "Primary sales", data: [345, 272, 261, 298], color: "var(--viz-1)" },
  { name: "Secondary sales", data: [322, 253, 225, 280], color: "var(--viz-2)" },
];

const gapData = [
  { territory: "Delhi East", distributor: "Aman Distributors", region: "East", primary: 42.6, secondary: 35.8, gap: 6.8, deviation: 16.0, status: "Critical" },
  { territory: "Mumbai Central", distributor: "West Coast Agencies", region: "West", primary: 50.8, secondary: 48.2, gap: 2.6, deviation: 5.1, status: "At Risk" },
  { territory: "Noida North", distributor: "Kunal Trading Co.", region: "North", primary: 63.2, secondary: 57.9, gap: 5.3, deviation: 8.4, status: "At Risk" },
  { territory: "Pune West", distributor: "Sahyadri Distributors", region: "South", primary: 48.4, secondary: 46.8, gap: 1.6, deviation: 3.3, status: "On Track" },
  { territory: "Kolkata Central", distributor: "Eastern Link Supplies", region: "East", primary: 39.8, secondary: 34.3, gap: 5.5, deviation: 13.8, status: "Critical" },
  { territory: "Gurugram", distributor: "Horizon FMCG", region: "North", primary: 57.5, secondary: 54.9, gap: 2.6, deviation: 4.5, status: "On Track" },
  { territory: "Ahmedabad South", distributor: "Saffron Distribution", region: "West", primary: 45.2, secondary: 43.5, gap: 1.7, deviation: 3.8, status: "On Track" },
  { territory: "Chennai North", distributor: "Coromandel Partners", region: "South", primary: 52.7, secondary: 49.4, gap: 3.3, deviation: 6.3, status: "At Risk" },
];

const formatLakhs = (value) => `₹${Number(value).toFixed(1)} L`;

const riskTone = (status) => {
  if (status === "Critical") return "danger";
  if (status === "At Risk") return "warning";
  return "success";
};

export default function SalesGaps() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return gapData.filter((item) => {
      const matchesSearch =
        !search ||
        item.territory.toLowerCase().includes(search) ||
        item.distributor.toLowerCase().includes(search);
      const matchesRegion = regionFilter === "All" || item.region === regionFilter;

      return matchesSearch && matchesRegion;
    });
  }, [regionFilter, searchTerm]);

  const columns = [
    {
      key: "territory",
      header: "Territory / Distributor",
      sortable: true,
      render: (value, row) => (
        <div className={styles.territoryCell}>
          <span className={styles.territoryName}>{value}</span>
          <span className={styles.distributorName}>{row.distributor}</span>
        </div>
      ),
    },
    {
      key: "primary",
      header: "Primary Sales",
      align: "right",
      mono: true,
      sortable: true,
      render: formatLakhs,
    },
    {
      key: "secondary",
      header: "Secondary Sales",
      align: "right",
      mono: true,
      sortable: true,
      render: formatLakhs,
    },
    {
      key: "gap",
      header: "Sales Gap",
      align: "right",
      mono: true,
      sortable: true,
      render: (value) => <span className={styles.gapAmount}>{formatLakhs(value)}</span>,
    },
    {
      key: "deviation",
      header: "Gap %",
      align: "right",
      mono: true,
      sortable: true,
      render: (value) => (
        <span className={styles.negative}>
          {value.toFixed(1)}%
          <FiArrowDown className={styles.trendArrow} aria-hidden="true" />
        </span>
      ),
    },
    {
      key: "status",
      header: "Risk Level",
      align: "center",
      sortable: true,
      render: (value) => (
        <Badge tone={riskTone(value)} variant="soft" dot>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.kpiGrid}>
        <StatCard
          label="Primary Sales"
          value="₹12.48"
          unit="Cr"
          delta={8.4}
          deltaLabel="vs previous month"
          icon={<FiPackage />}
        />
        <StatCard
          label="Secondary Sales"
          value="₹11.62"
          unit="Cr"
          delta={11.2}
          deltaLabel="vs previous month"
          icon={<FiShoppingCart />}
        />
        <StatCard
          label="Secondary Conversion"
          value="93.1"
          unit="%"
          delta={2.4}
          deltaLabel="vs previous month"
          icon={<FiPercent />}
        />
        <StatCard
          label="Unconverted Sales Gap"
          value="₹86"
          unit="L"
          delta={-12.8}
          deltaTone="positive"
          deltaLabel="gap reduced vs previous month"
          icon={<FiTrendingDown />}
        />
      </div>

      <div className={styles.chartGrid}>
        <Card className={styles.chartCard} padding="none">
          <CardHeader
            title="Primary vs Secondary Sales Trend"
            subtitle="Monthly billed and booked sales · ₹ lakh"
            actions={<Badge tone="primary" variant="soft" size="sm">YTD</Badge>}
          />
          <CardBody className={styles.chartBody}>
            <AreaChart
              series={salesTrendSeries}
              categories={salesTrendCategories}
              height={270}
              valueFormat={(value) => `₹${value} L`}
            />
          </CardBody>
        </Card>

        <Card className={styles.chartCard} padding="none">
          <CardHeader
            title="Regional Conversion"
            subtitle="Primary vs secondary sales · ₹ lakh"
          />
          <CardBody className={styles.chartBody}>
            <BarChart
              series={regionalSalesSeries}
              categories={["North", "South", "East", "West"]}
              height={270}
              valueFormat={(value) => `₹${value} L`}
            />
          </CardBody>
        </Card>
      </div>

      <div className={styles.alertPanel} role="status">
        <div className={styles.alertHeader}>
          <FiAlertCircle size={20} className={styles.alertIcon} aria-hidden="true" />
          <h3>Priority Gap Notice</h3>
        </div>
        <p>
          East Region is carrying a <strong>₹12.3 L</strong> secondary sales gap this month. Review distributor stock movement and retailer order conversion for the affected territories.
        </p>
      </div>

      <Card elevated padding="none">
        <CardHeader
          title="Territory Sales Gap Analysis"
          subtitle="Primary billing compared with distributor secondary sales"
        />
        <CardBody className={styles.tableCardBody}>
          <div className={styles.filtersArea}>
            <div className={styles.searchBox}>
              <Input
                leading={<FiSearch />}
                placeholder="Search territories or distributors..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search territories or distributors"
              />
            </div>

            <div className={styles.filterActions}>
              <Select
                value={regionFilter}
                onChange={(event) => setRegionFilter(event.target.value)}
                aria-label="Filter by region"
                options={[
                  { value: "All", label: "All Regions" },
                  { value: "North", label: "North Region" },
                  { value: "South", label: "South Region" },
                  { value: "East", label: "East Region" },
                  { value: "West", label: "West Region" },
                ]}
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredData}
            rowKey={(row) => `${row.region}-${row.territory}`}
            pageSize={5}
          />
        </CardBody>
      </Card>
    </div>
  );
}
