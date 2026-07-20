"use client";

import React, { useState, useMemo } from "react";
import {
  FiDatabase, FiSearch, FiDownload, FiRefreshCw, FiAlertCircle, FiEdit3, FiUploadCloud
} from "react-icons/fi";
import {
  Button, Badge, Select, Table, Tabs, useToast
} from "../../../../../components/ui";
import styles from "./page.module.scss";

// Mock Data
const mockProducts = [
  { id: "SKU-901", name: "Sparkle Water 1L Case", category: "Beverages", erpSync: "Synced", integrity: "Valid" },
  { id: "SKU-902", name: "Crisp Chips Classic 50g", category: "Snacks", erpSync: "Synced", integrity: "Valid" },
  { id: "SKU-903", name: "Energy Blast 250ml", category: "Beverages", erpSync: "Pending", integrity: "Missing Weight" },
  { id: "SKU-904", name: "Glacial Ice Mint Soap", category: "Personal Care", erpSync: "Synced", integrity: "Valid" },
];

const mockDistributors = [
  { id: "DST-112", name: "Alpha Traders", region: "Delhi NCR", erpSync: "Synced", integrity: "Valid" },
  { id: "DST-114", name: "MegaMart Logistics", region: "Punjab Zone", erpSync: "Failed", integrity: "Missing GSTIN" },
  { id: "DST-118", name: "Global FMCG Dist.", region: "Mumbai Zone", erpSync: "Synced", integrity: "Valid" },
];

const mockRetailers = [
  { id: "RET-441", name: "Sharma General Store", type: "Kirana", erpSync: "Synced", integrity: "Valid" },
  { id: "RET-442", name: "QuickShop Supermart", type: "Modern Trade", erpSync: "Synced", integrity: "Valid" },
  { id: "RET-445", name: "Daily Needs Hub", type: "Kirana", erpSync: "Pending", integrity: "Missing Lat/Lng" },
];

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Master Data Exported",
      description: `The ${activeTab} data registry has been exported to CSV.`,
      tone: "success"
    });
  };

  const handleSync = () => {
    toast?.({
      title: "ERP Sync Triggered",
      description: `Pushing pending ${activeTab} updates to SAP S/4HANA.`,
      tone: "info"
    });
  };

  // Table Columns Setup
  const productCols = [
    {
      key: "name",
      label: "SKU Name & ID",
      sortable: true,
      render: (_, row) => (
        <div className={styles.entityMeta}>
          <strong>{row.name}</strong>
          <span className="rc-tnum">{row.id}</span>
        </div>
      )
    },
    { key: "category", label: "Category" },
    {
      key: "integrity",
      label: "Data Integrity",
      render: (val) => (
        <Badge tone={val === "Valid" ? "success" : "warning"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "erpSync",
      label: "ERP Status",
      render: (val) => (
        <Badge tone={val === "Synced" ? "success" : val === "Failed" ? "danger" : "primary"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: () => (
        <Button variant="ghost" size="sm" iconOnly aria-label="Edit Record">
          <FiEdit3 />
        </Button>
      )
    }
  ];

  const distributorCols = [
    {
      key: "name",
      label: "Distributor & ID",
      sortable: true,
      render: (_, row) => (
        <div className={styles.entityMeta}>
          <strong>{row.name}</strong>
          <span className="rc-tnum">{row.id}</span>
        </div>
      )
    },
    { key: "region", label: "Assigned Region" },
    {
      key: "integrity",
      label: "Data Integrity",
      render: (val) => (
        <Badge tone={val === "Valid" ? "success" : "warning"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "erpSync",
      label: "ERP Status",
      render: (val) => (
        <Badge tone={val === "Synced" ? "success" : val === "Failed" ? "danger" : "primary"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: () => (
        <Button variant="ghost" size="sm" iconOnly aria-label="Edit Record">
          <FiEdit3 />
        </Button>
      )
    }
  ];

  const retailerCols = [
    {
      key: "name",
      label: "Retailer & ID",
      sortable: true,
      render: (_, row) => (
        <div className={styles.entityMeta}>
          <strong>{row.name}</strong>
          <span className="rc-tnum">{row.id}</span>
        </div>
      )
    },
    { key: "type", label: "Retail Type" },
    {
      key: "integrity",
      label: "Data Integrity",
      render: (val) => (
        <Badge tone={val === "Valid" ? "success" : "warning"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "erpSync",
      label: "ERP Status",
      render: (val) => (
        <Badge tone={val === "Synced" ? "success" : val === "Failed" ? "danger" : "primary"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: () => (
        <Button variant="ghost" size="sm" iconOnly aria-label="Edit Record">
          <FiEdit3 />
        </Button>
      )
    }
  ];

  // Dynamic Data and Columns based on Tab
  const { currentData, currentCols, moduleName } = useMemo(() => {
    switch (activeTab) {
      case "products": return { currentData: mockProducts, currentCols: productCols, moduleName: "Products (SKUs)" };
      case "distributors": return { currentData: mockDistributors, currentCols: distributorCols, moduleName: "Distributors" };
      case "retailers": return { currentData: mockRetailers, currentCols: retailerCols, moduleName: "Retailers" };
      default: return { currentData: [], currentCols: [], moduleName: "" };
    }
  }, [activeTab]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return currentData;
    return currentData.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentData, searchQuery]);

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiDatabase />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Administration</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Master Data Registry</h2>
            <p className={styles.subtitle}>
              Manage core entity data (Products, Distributors, Retailers) and ensure synchronization with the central ERP system.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Selected Registry
          </Button>
          <Button variant="primary" size="sm" leadingIcon={<FiUploadCloud />} onClick={handleSync}>
            Force ERP Sync
          </Button>
        </div>
      </div>

      {/* ── 2. Data Integrity Banner ───────────────────────────── */}
      <div className={styles.healthBanner}>
        <div className={styles.bannerAlert}>
          <FiAlertCircle className={styles.alertIcon} />
          <div className={styles.alertInfo}>
            <strong>Data Anomalies Detected</strong>
            <span>3 records have missing mandatory fields</span>
          </div>
        </div>
        <div className={styles.bannerStats}>
          <div className={styles.statCol}>
            <span>Total SKUs</span>
            <strong className="rc-tnum">1,245</strong>
          </div>
          <div className={styles.statCol}>
            <span>Active Distributors</span>
            <strong className="rc-tnum">450</strong>
          </div>
          <div className={styles.statCol}>
            <span>Registered Retailers</span>
            <strong className="rc-tnum">24,500</strong>
          </div>
          <div className={styles.statCol}>
            <span>Global ERP Sync Status</span>
            <strong style={{ color: "var(--success)" }}>99.2% Healthy</strong>
          </div>
        </div>
        <div className={styles.bannerAction}>
          <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />}>
            Run Integrity Check
          </Button>
        </div>
      </div>

      {/* ── 3. Tabs Navigation ─────────────────────────────────── */}
      <Tabs
        items={[
          { value: "products", label: "Product Catalog (SKUs)" },
          { value: "distributors", label: "Distributor Network" },
          { value: "retailers", label: "Retailer Database" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 4. Main Data Table ─────────────────────────────────── */}
      <div className={styles.mainLayout}>
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>{moduleName} Registry</h3>
            <div className={styles.sectionControls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder={`Search ${moduleName.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch />
              </div>
            </div>
          </div>
          <Table 
            data={filteredData} 
            columns={currentCols} 
            emptyMessage={`No ${moduleName.toLowerCase()} found.`} 
          />
        </div>
      </div>
    </div>
  );
}
