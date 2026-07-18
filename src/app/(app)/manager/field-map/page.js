"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FiMap, FiSearch, FiActivity, FiUsers, FiClock,
  FiBattery, FiWifi, FiAlertTriangle, FiTrendingUp,
  FiSliders, FiFilter, FiRefreshCw, FiCheckCircle,
  FiDollarSign, FiChevronRight, FiNavigation, FiPlay,
  FiVolume2, FiCrosshair, FiGrid, FiArrowUpRight, FiList
} from "react-icons/fi";
import {
  Badge, Card, StatCard, Avatar, Chip, Button, Tooltip, Drawer
} from "../../../../../components/ui";
import Sparkline from "../../../../../components/ui/Chart/Sparkline";
import styles from "./page.module.scss";

/* ─── RICH MOCK DATA ─────────────────────────────────────────── */

const initialSalesOfficers = [
  {
    id: "SO-101",
    name: "Rohit Sharma",
    beat: "Delhi East • Beat 4A",
    status: "Active",
    battery: 84,
    signal: "4G",
    visited: 14,
    total: 18,
    ordersValue: "₹28,450",
    distance: "8.4 km",
    lastPing: "2 min ago",
    coords: { top: "36%", left: "44%" },
    initials: "RS",
    avatarColor: "var(--primary)",
    timeline: [
      { time: "09:00 AM", event: "Shift Started", detail: "Checked in at depot. Battery 98%. GPS accuracy: 4m.", type: "primary" },
      { time: "09:20 AM", event: "Visit Completed", detail: "Sharma General Store (Delhi East) — Order booked: ₹4,500.", type: "success" },
      { time: "09:55 AM", event: "Visit Completed", detail: "Aggarwal Provisions — Order booked: ₹8,200.", type: "success" },
      { time: "10:30 AM", event: "Visit Skipped", detail: "Green Valley Mart — Retailer shop closed.", type: "warning" },
      { time: "11:15 AM", event: "Visit Completed", detail: "Balaji Traders — Order booked: ₹15,750.", type: "success" },
      { time: "12:10 PM", event: "GPS Ping Update", detail: "Located near Preet Vihar metro station. Battery 84%.", type: "info" }
    ]
  },
  {
    id: "SO-102",
    name: "Neha Patel",
    beat: "Delhi Central • Beat 2B",
    status: "Active",
    battery: 91,
    signal: "5G",
    visited: 12,
    total: 16,
    ordersValue: "₹24,800",
    distance: "6.2 km",
    lastPing: "1 min ago",
    coords: { top: "52%", left: "30%" },
    initials: "NP",
    avatarColor: "var(--success)",
    timeline: [
      { time: "09:15 AM", event: "Shift Started", detail: "Checked in at central hub. Battery 100%.", type: "primary" },
      { time: "09:45 AM", event: "Visit Completed", detail: "Metro Groceries — Order booked: ₹12,300.", type: "success" },
      { time: "10:30 AM", event: "Visit Completed", detail: "New Bombay Kirana — Order booked: ₹7,500.", type: "success" },
      { time: "11:45 AM", event: "Visit Completed", detail: "Janta Supermarket — Order booked: ₹5,000.", type: "success" }
    ]
  },
  {
    id: "SO-103",
    name: "Priya Singh",
    beat: "Noida South • Beat 5C",
    status: "Break",
    battery: 68,
    signal: "3G",
    visited: 8,
    total: 15,
    ordersValue: "₹14,200",
    distance: "7.8 km",
    lastPing: "12 min ago",
    coords: { top: "26%", left: "70%" },
    initials: "PS",
    avatarColor: "var(--warning)",
    timeline: [
      { time: "08:45 AM", event: "Shift Started", detail: "Checked in at Noida depot. Battery 95%.", type: "primary" },
      { time: "09:15 AM", event: "Visit Completed", detail: "Noida General Store — Order booked: ₹6,200.", type: "success" },
      { time: "10:00 AM", event: "Visit Completed", detail: "Apna Bazaar — Order booked: ₹8,000.", type: "success" },
      { time: "11:30 PM", event: "Lunch Break", detail: "Paused at Sector 62 food court. Status set to Break.", type: "warning" }
    ]
  },
  {
    id: "SO-104",
    name: "Arjun Mehta",
    beat: "Gurugram • Beat 1D",
    status: "Active",
    battery: 75,
    signal: "4G",
    visited: 15,
    total: 20,
    ordersValue: "₹32,150",
    distance: "9.5 km",
    lastPing: "3 min ago",
    coords: { top: "66%", left: "54%" },
    initials: "AM",
    avatarColor: "var(--primary)",
    timeline: [
      { time: "09:00 AM", event: "Shift Started", detail: "Checked in at Gurugram hub. Battery 99%.", type: "primary" },
      { time: "09:30 AM", event: "Visit Completed", detail: "Cyber Provisions — Order booked: ₹14,500.", type: "success" },
      { time: "10:15 AM", event: "Visit Completed", detail: "DLF Mini Mart — Order booked: ₹9,150.", type: "success" },
      { time: "11:30 AM", event: "Visit Completed", detail: "Galaxy Stores — Order booked: ₹8,500.", type: "success" }
    ]
  },
  {
    id: "SO-105",
    name: "Amit Patel",
    beat: "Noida East • Beat 3A",
    status: "Offline",
    battery: 12,
    signal: "None",
    visited: 4,
    total: 12,
    ordersValue: "₹8,500",
    distance: "4.1 km",
    lastPing: "35 min ago",
    coords: { top: "42%", left: "78%" },
    initials: "AP",
    avatarColor: "var(--text-3)",
    timeline: [
      { time: "09:30 AM", event: "Shift Started", detail: "Checked in. Low Battery Warning (32%).", type: "primary" },
      { time: "10:00 AM", event: "Visit Completed", detail: "Sector 12 corner shop — Order booked: ₹8,500.", type: "success" },
      { time: "10:45 AM", event: "Offline Alert", detail: "Battery critical (12%). GPS and network signal lost.", type: "danger" }
    ]
  },
  {
    id: "SO-106",
    name: "Vikas Tripathi",
    beat: "Ghaziabad • Beat 6B",
    status: "Active",
    battery: 50,
    signal: "4G",
    visited: 10,
    total: 14,
    ordersValue: "₹18,900",
    distance: "5.5 km",
    lastPing: "4 min ago",
    coords: { top: "60%", left: "68%" },
    initials: "VT",
    avatarColor: "var(--success)",
    timeline: [
      { time: "09:00 AM", event: "Shift Started", detail: "Checked in. Battery 100%.", type: "primary" },
      { time: "09:40 AM", event: "Visit Completed", detail: "Ghaziabad Wholesale — Order booked: ₹11,400.", type: "success" },
      { time: "10:30 AM", event: "Visit Completed", detail: "UP Stores — Order booked: ₹7,500.", type: "success" }
    ]
  }
];

const mockRetailers = [
  { name: "Sharma General Store", coords: { top: "32%", left: "42%" }, status: "success", info: "Order: ₹4,500" },
  { name: "Balaji Retail", coords: { top: "46%", left: "34%" }, status: "success", info: "Order: ₹15,750" },
  { name: "Green Valley Mart", coords: { top: "22%", left: "72%" }, status: "warning", info: "Closed" },
  { name: "Metro Groceries", coords: { top: "54%", left: "28%" }, status: "success", info: "Order: ₹12,300" },
  { name: "Krishna Traders", coords: { top: "38%", left: "76%" }, status: "neutral", info: "Pending" },
  { name: "Aggarwal Provisions", coords: { top: "30%", left: "46%" }, status: "success", info: "Order: ₹8,200" }
];

const initialTickers = [
  "Rohit Sharma checked in at Balaji Traders (1 min ago)",
  "Neha Patel completed route coverage at New Bombay Kirana (3 min ago)",
  "Priya Singh paused beat route - Sector 62 Lunch Break (12 min ago)"
];

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */

export default function LiveFieldMapPage() {
  const [salesOfficers, setSalesOfficers] = useState(initialSalesOfficers);
  const [selectedSO, setSelectedSO] = useState(initialSalesOfficers[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mapLayer, setMapLayer] = useState("standard"); // standard | satellite | routes
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tickers, setTickers] = useState(initialTickers);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Filter SOs based on Search and Status
  const filteredSOs = useMemo(() => {
    return salesOfficers.filter(so => {
      const matchSearch = so.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        so.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        so.beat.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || so.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [salesOfficers, searchQuery, statusFilter]);

  // Handle live GPS ping simulation
  function triggerGpsSimulation() {
    setSalesOfficers(prev => {
      const updated = prev.map(so => {
        if (so.status !== "Active") return so;

        // Shift coordinates randomly by +/- 2%
        const topNum = parseFloat(so.coords.top) + (Math.random() * 4 - 2);
        const leftNum = parseFloat(so.coords.left) + (Math.random() * 4 - 2);

        // Constrain to map boundaries
        const top = `${Math.max(10, Math.min(topNum, 90))}%`;
        const left = `${Math.max(10, Math.min(leftNum, 90))}%`;

        // Randomly add order value if visited is less than total
        let visited = so.visited;
        let ordersValue = so.ordersValue;
        if (visited < so.total && Math.random() > 0.6) {
          visited += 1;
          const currentVal = parseInt(ordersValue.replace(/[^0-9]/g, ""));
          const newVal = currentVal + Math.floor(Math.random() * 5000 + 1000);
          ordersValue = `₹${newVal.toLocaleString("en-IN")}`;
        }

        return {
          ...so,
          coords: { top, left },
          visited,
          ordersValue,
          lastPing: "Just now"
        };
      });

      // Update selected SO reference to keep drawer/details synced
      const currentSelected = updated.find(s => s.id === selectedSO.id);
      if (currentSelected) {
        setSelectedSO(currentSelected);
      }

      return updated;
    });

    // Add a new random ticker item
    const randomSO = salesOfficers[Math.floor(Math.random() * salesOfficers.length)];
    const newTicker = `${randomSO.name} sent GPS telemetry signal - Battery ${randomSO.battery}% (Just now)`;
    setTickers(t => [newTicker, t[0], t[1]]);
  }

  // Auto rotate ticker feed
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(idx => (idx + 1) % tickers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickers]);

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiMap />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Regional Manager Panel</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>Live</span>
            </div>
            <h2>Live Field Map</h2>
            <p className={styles.subtitle}>Real-time tracking of Sales Officers, active retail beat routes, check-ins, and target quota status.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />} onClick={triggerGpsSimulation}>
            Ping Telemetry
          </Button>
          <select
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-1)",
              fontSize: "var(--text-sm)",
              fontWeight: 500
            }}
          >
            <option value="standard">Standard Map</option>
            <option value="satellite">Satellite Grid</option>
            <option value="routes">Beat Routes</option>
          </select>
        </div>
      </div>

      {/* ── Main Layout Grid ──────────────────────────── */}
      <div className={styles.mainLayout}>
        {/* Left: SO Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search Sales Officer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
            <div className={styles.filterChips}>
              {["All", "Active", "Break", "Offline"].map(chip => (
                <Chip
                  key={chip}
                  selected={statusFilter === chip}
                  onClick={() => setStatusFilter(chip)}
                >
                  {chip}
                </Chip>
              ))}
            </div>
          </div>

          <div className={styles.soList}>
            {filteredSOs.map(so => {
              const isActive = selectedSO.id === so.id;
              const statusTones = { Active: "success", Break: "warning", Offline: "neutral" };
              return (
                <div
                  key={so.id}
                  className={`${styles.soItem} ${isActive ? styles["soItem--active"] : ""}`}
                  onClick={() => { setSelectedSO(so); }}
                >
                  <Avatar
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${so.name}`}
                    fallback={so.initials}
                    size="md"
                    style={{ background: so.avatarColor, color: "#fff" }}
                  />
                  <div className={styles.soMeta}>
                    <div className={styles.soNameRow}>
                      <strong>{so.name}</strong>
                      <Badge tone={statusTones[so.status]} variant="soft" size="sm" dot>
                        {so.status}
                      </Badge>
                    </div>
                    <div className={styles.soSubtext}>
                      <FiNavigation size={12} /> {so.beat.split("•")[0]}
                    </div>
                    <div className={styles.soMetricsRow}>
                      <span>
                        <FiCheckCircle size={13} style={{ color: "var(--success)" }} /> {so.visited}/{so.total}
                      </span>
                      <span>
                        <FiDollarSign size={13} style={{ color: "var(--primary)" }} /> {so.ordersValue}
                      </span>
                    </div>
                    <div className={styles.deviceStats}>
                      <span>
                        <FiBattery size={11} /> {so.battery}%
                      </span>
                      <span>
                        <FiWifi size={11} /> {so.signal}
                      </span>
                      <span style={{ marginLeft: "auto" }}>
                        <FiClock size={11} /> {so.lastPing}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Map Area & Activity Feed */}
        <div className={styles.contentArea}>
          {/* Simulated Interactive Map */}
          <div className={styles.mapContainer}>
            {/* Map Legends */}
            <div className={styles.mapLegends}>
              <div className={styles.legendItem}>
                <span className={`${styles.retailerPin} ${styles["retailerPin--success"]}`} />
                <span>Visited shop</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.retailerPin} ${styles["retailerPin--neutral"]}`} />
                <span>Pending shop</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.retailerPin} ${styles["retailerPin--warning"]}`} />
                <span>Skipped / Closed</span>
              </div>
            </div>

            {/* Map Visuals */}
            <div
              className={styles.mapVisual}
              style={{
                filter: mapLayer === "satellite" ? "invert(1) hue-rotate(180deg) brightness(0.9)" : "none"
              }}
            >
              {/* Simulate street lines */}
              <div className={`${styles.mapStreet} ${styles["mapStreet--h1"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--h2"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--v1"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--v2"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--diagonal"]}`} />

              {/* Retailer Pins */}
              {mockRetailers.map((ret, i) => (
                <Tooltip key={i} content={`${ret.name} (${ret.info})`}>
                  <div className={styles.mapPin} style={{ top: ret.coords.top, left: ret.coords.left }}>
                    <div className={`${styles.retailerPin} ${styles[`retailerPin--${ret.status}`]}`} />
                  </div>
                </Tooltip>
              ))}

              {/* Active Sales Officers Pins */}
              {salesOfficers.map(so => {
                if (so.status === "Offline") return null;
                const isSelected = selectedSO.id === so.id;
                return (
                  <div
                    key={so.id}
                    className={`${styles.mapPin} ${isSelected ? styles["mapPin--active"] : ""}`}
                    style={{ top: so.coords.top, left: so.coords.left }}
                    onClick={() => { setSelectedSO(so); setDrawerOpen(true); }}
                  >
                    <div className={`${styles.pulseRing} ${so.status === "Active" ? styles["pulseRing--green"] : styles["pulseRing--blue"]}`} />
                    <div className={`${styles.soPin} ${isSelected ? styles["soPin--active"] : ""}`}>
                      <Avatar
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${so.name}`}
                        fallback={so.initials}
                        size="sm"
                        style={{ background: so.avatarColor, color: "#fff", width: "100%", height: "100%" }}
                      />
                    </div>
                    <span className={styles.pinLabel}>{so.name.split(" ")[0]}</span>
                  </div>
                );
              })}

              {/* Route Connection Paths (renders if mapLayer === routes) */}
              {mapLayer === "routes" && (
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                  <path
                    d={`M ${parseFloat(salesOfficers[0].coords.left) * 8} ${parseFloat(salesOfficers[0].coords.top) * 6} 
                       L ${parseFloat(salesOfficers[1].coords.left) * 8} ${parseFloat(salesOfficers[1].coords.top) * 6}
                       L ${parseFloat(salesOfficers[3].coords.left) * 8} ${parseFloat(salesOfficers[3].coords.top) * 6}`}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3.5"
                    strokeDasharray="6 6"
                    opacity="0.6"
                  />
                </svg>
              )}
            </div>

            {/* Map Zoom Controls */}
            <div className={styles.mapControls}>
              <button className={styles.controlBtn} title="Recenter to active user" onClick={() => {
                const active = salesOfficers.find(s => s.status === "Active");
                if (active) setSelectedSO(active);
              }}>
                <FiCrosshair />
              </button>
              <button className={styles.controlBtn} title="Toggle view overlays">
                <FiGrid />
              </button>
            </div>
          </div>

          {/* Live Check-in Ticker */}
          <div className={styles.tickerFeed}>
            <div className={styles.tickerTitle}>
              <FiVolume2 style={{ color: "var(--primary)" }} /> Live Feed:
            </div>
            <div className={styles.tickerList}>
              <div key={tickerIndex} className={styles.tickerItem}>
                <strong>Telemetry Sync:</strong>
                <span className={styles.tickerText}>{tickers[tickerIndex]}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
              View Activity Timeline
            </Button>
          </div>
        </div>
      </div>

      {/* ── Activity Timeline Drawer ─────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedSO?.name}
        description={selectedSO?.beat}
        side="right"
        size="md"
      >
        {selectedSO && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {/* Quick stats grid inside drawer */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              <div style={{ background: "var(--surface-sunken)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "var(--text-overline)", color: "var(--text-3)", display: "block" }}>Orders Booked</span>
                <span style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--primary)" }}>{selectedSO.ordersValue}</span>
              </div>
              <div style={{ background: "var(--surface-sunken)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "var(--text-overline)", color: "var(--text-3)", display: "block" }}>Beat Coverage</span>
                <span style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--success)" }}>
                  {Math.round((selectedSO.visited / selectedSO.total) * 100)}% ({selectedSO.visited}/{selectedSO.total})
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", color: "var(--text-3)", marginBottom: "var(--space-4)" }}>
                Beat Activity Timeline
              </h4>
              <div className={styles.timeline}>
                {selectedSO.timeline.map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={`${styles.timelineIcon} ${styles[`timelineIcon--${item.type}`]}`}>
                      {item.type === "success" ? <FiCheckCircle /> : item.type === "warning" ? <FiAlertTriangle /> : item.type === "primary" ? <FiPlay /> : <FiClock />}
                    </div>
                    <div className={styles.timelineContent}>
                      <h5>{item.event}</h5>
                      <span>{item.time}</span>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
