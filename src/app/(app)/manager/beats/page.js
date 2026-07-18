"use client";

import React, { useState, useMemo } from "react";
import {
  FiNavigation, FiSearch, FiSliders, FiUsers,
  FiClock, FiMapPin, FiPlus, FiTrash2, FiChevronUp,
  FiChevronDown, FiActivity, FiDollarSign, FiCheckCircle,
  FiMap, FiRefreshCw, FiSave, FiAlertTriangle, FiX
} from "react-icons/fi";
import {
  Badge, Card, StatCard, Avatar, Chip, Button, Tooltip, Modal, useToast
} from "../../../../../components/ui";
import styles from "./page.module.scss";

/* ─── INITIAL MOCK DATA ───────────────────────────────────────── */

const initialReps = [
  { id: "SO-101", name: "Rohit Sharma", territory: "Delhi East", beatsCount: 6, avatarColor: "var(--primary)" },
  { id: "SO-102", name: "Neha Patel", territory: "Delhi Central", beatsCount: 5, avatarColor: "var(--success)" },
  { id: "SO-103", name: "Priya Singh", territory: "Noida South", beatsCount: 4, avatarColor: "var(--warning)" },
  { id: "SO-104", name: "Arjun Mehta", territory: "Gurugram", beatsCount: 5, avatarColor: "var(--primary)" },
];

const initialBeats = {
  "SO-101-Mon": [
    { id: "RET-201", name: "Sharma General Store", frequency: "Weekly", coords: { top: "30%", left: "45%" }, potential: "₹15,000", lat: 28.614, lng: 77.291 },
    { id: "RET-202", name: "Aggarwal Provisions", frequency: "Bi-weekly", coords: { top: "38%", left: "38%" }, potential: "₹12,000", lat: 28.625, lng: 77.280 },
    { id: "RET-203", name: "Balaji Traders", frequency: "Weekly", coords: { top: "52%", left: "48%" }, potential: "₹24,000", lat: 28.601, lng: 77.299 },
    { id: "RET-204", name: "Gupta Retail", frequency: "Monthly", coords: { top: "62%", left: "60%" }, potential: "₹8,000", lat: 28.589, lng: 77.315 },
    { id: "RET-205", name: "Metro Supermarket", frequency: "Weekly", coords: { top: "70%", left: "50%" }, potential: "₹35,000", lat: 28.572, lng: 77.302 }
  ],
  "SO-101-Tue": [
    { id: "RET-301", name: "Janta Kirana Store", frequency: "Bi-weekly", coords: { top: "25%", left: "30%" }, potential: "₹10,000", lat: 28.630, lng: 77.260 },
    { id: "RET-302", name: "Apna Bazaar", frequency: "Weekly", coords: { top: "45%", left: "42%" }, potential: "₹18,000", lat: 28.610, lng: 77.288 },
    { id: "RET-303", name: "New Bombay Kirana", frequency: "Weekly", coords: { top: "60%", left: "34%" }, potential: "₹15,000", lat: 28.592, lng: 77.272 }
  ],
  "SO-102-Mon": [
    { id: "RET-401", name: "Karan Provisions", frequency: "Weekly", coords: { top: "20%", left: "65%" }, potential: "₹12,000", lat: 28.640, lng: 77.330 },
    { id: "RET-402", name: "Shri Krishna Stores", frequency: "Bi-weekly", coords: { top: "42%", left: "70%" }, potential: "₹9,000", lat: 28.618, lng: 77.345 },
    { id: "RET-403", name: "Metro Mart Noida", frequency: "Weekly", coords: { top: "68%", left: "72%" }, potential: "₹28,000", lat: 28.580, lng: 77.350 }
  ]
};

const initialUnassigned = [
  { id: "RET-901", name: "Durga General Store", frequency: "Weekly", coords: { top: "22%", left: "40%" }, potential: "₹6,500", lat: 28.633, lng: 77.282 },
  { id: "RET-902", name: "Kalyani Provisions", frequency: "Bi-weekly", coords: { top: "55%", left: "65%" }, potential: "₹9,000", lat: 28.598, lng: 77.325 },
  { id: "RET-903", name: "Royal Groceries", frequency: "Weekly", coords: { top: "48%", left: "58%" }, potential: "₹12,500", lat: 28.608, lng: 77.312 },
  { id: "RET-904", name: "Saraswati Supermarket", frequency: "Weekly", coords: { top: "72%", left: "38%" }, potential: "₹14,000", lat: 28.568, lng: 77.280 }
];

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */

export default function BeatDesignerPage() {
  const toast = useToast();
  const [selectedRep, setSelectedRep] = useState(initialReps[0]);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [searchRepQuery, setSearchRepQuery] = useState("");
  
  // Dynamic Route data state
  const [beatsData, setBeatsData] = useState(initialBeats);
  const [unassignedPool, setUnassignedPool] = useState(initialUnassigned);

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);

  // Active Beat Selection Key
  const activeKey = `${selectedRep.id}-${selectedDay}`;

  // Get active route list or empty array
  const activeRoute = useMemo(() => {
    return beatsData[activeKey] || [];
  }, [beatsData, activeKey]);

  // Filter reps
  const filteredReps = useMemo(() => {
    return initialReps.filter(rep => 
      rep.name.toLowerCase().includes(searchRepQuery.toLowerCase()) ||
      rep.territory.toLowerCase().includes(searchRepQuery.toLowerCase())
    );
  }, [searchRepQuery]);

  // Estimated stats calculation
  const stats = useMemo(() => {
    const outletsCount = activeRoute.length;
    if (outletsCount === 0) {
      return { distance: "0 km", duration: "0m", potential: "₹0", outlets: 0 };
    }

    // Sum revenue potential
    const totalVal = activeRoute.reduce((sum, item) => {
      const num = parseInt(item.potential.replace(/[^0-9]/g, ""));
      return sum + num;
    }, 0);

    // Simulated distance calculation based on coordinates difference
    let totalDist = 0;
    for (let i = 0; i < outletsCount - 1; i++) {
      const dx = parseFloat(activeRoute[i].coords.left) - parseFloat(activeRoute[i+1].coords.left);
      const dy = parseFloat(activeRoute[i].coords.top) - parseFloat(activeRoute[i+1].coords.top);
      totalDist += Math.sqrt(dx*dx + dy*dy) * 0.18; // scaling factor
    }
    if (totalDist === 0) totalDist = 1.2; // default if 1 shop

    const durationMin = outletsCount * 20 + Math.round(totalDist * 8);

    return {
      distance: `${totalDist.toFixed(1)} km`,
      duration: durationMin > 60 ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m` : `${durationMin}m`,
      potential: `₹${totalVal.toLocaleString("en-IN")}`,
      outlets: outletsCount
    };
  }, [activeRoute]);

  // Re-ordering items inside sequence list
  function moveItem(index, direction) {
    const updated = [...activeRoute];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setBeatsData(prev => ({
      ...prev,
      [activeKey]: updated
    }));
  }

  // Remove retailer from current beat route
  function removeRetailer(index) {
    const item = activeRoute[index];
    const updatedRoute = activeRoute.filter((_, idx) => idx !== index);

    setBeatsData(prev => ({
      ...prev,
      [activeKey]: updatedRoute
    }));

    // Add back to unassigned list
    setUnassignedPool(prev => [...prev, item]);

    toast({
      title: "Retailer Removed",
      description: `${item.name} removed from active beat.`,
      tone: "info"
    });
  }

  // Optimize Route by sorting coordinates (nearest neighbor path)
  function optimizeRoute() {
    if (activeRoute.length <= 2) {
      toast({
        title: "Optimization Skipped",
        description: "Route already optimal or contains too few outlets.",
        tone: "info"
      });
      return;
    }

    // Basic heuristic: sort by left position, then top position to minimize zigzags
    const optimized = [...activeRoute].sort((a, b) => {
      const scoreA = parseFloat(a.coords.left) + parseFloat(a.coords.top) * 0.5;
      const scoreB = parseFloat(b.coords.left) + parseFloat(b.coords.top) * 0.5;
      return scoreA - scoreB;
    });

    setBeatsData(prev => ({
      ...prev,
      [activeKey]: optimized
    }));

    toast({
      title: "Route Optimized",
      description: `Arranged ${optimized.length} outlets to minimize travel displacement.`,
      tone: "success"
    });
  }

  // Assign retailer from unassigned modal list
  function assignRetailer(retailer) {
    setBeatsData(prev => ({
      ...prev,
      [activeKey]: [...activeRoute, retailer]
    }));

    // Remove from unassigned pool
    setUnassignedPool(prev => prev.filter(r => r.id !== retailer.id));
    setModalOpen(false);

    toast({
      title: "Retailer Assigned",
      description: `${retailer.name} added to beat route sequence.`,
      tone: "success"
    });
  }

  // Save the entire beat route changes
  function saveRoute() {
    toast({
      title: "Beat Route Saved",
      description: `Beat route for ${selectedRep.name} (${selectedDay}) updated successfully!`,
      tone: "success"
    });
  }

  return (
    <div className={styles.container}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiNavigation />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Beat Designer</h2>
            <p className={styles.subtitle}>Plan, re-sequence, and optimize Daily Beat coverage routes for your Sales Officers.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />} onClick={optimizeRoute}>
            Auto Optimize
          </Button>
          <Button variant="primary" size="sm" leadingIcon={<FiSave />} onClick={saveRoute}>
            Save Beat
          </Button>
        </div>
      </div>

      {/* ── Main Layout ────────────────────────────────── */}
      <div className={styles.mainLayout}>
        
        {/* Left sidebar: Sales Officer List */}
        <div className={styles.leftSidebar}>
          <div className={styles.repHeader}>Sales Officers</div>
          <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--border-subtle)" }}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search Sales Officer..."
                value={searchRepQuery}
                onChange={(e) => setSearchRepQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
          <div className={styles.repList}>
            {filteredReps.map(rep => {
              const isActive = selectedRep.id === rep.id;
              return (
                <div
                  key={rep.id}
                  className={`${styles.repItem} ${isActive ? styles["repItem--active"] : ""}`}
                  onClick={() => { setSelectedRep(rep); }}
                >
                  <Avatar
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${rep.name}`}
                    size="md"
                    style={{ background: rep.avatarColor, color: "#fff" }}
                  />
                  <div className={styles.repMeta}>
                    <strong>{rep.name}</strong>
                    <span>{rep.territory} • {rep.beatsCount} beats</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Map Viewport */}
        <div className={styles.mapWrapper}>
          {/* Day selection tabs */}
          <div className={styles.daySelector}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div
                key={day}
                className={`${styles.dayBtn} ${selectedDay === day ? styles["dayBtn--active"] : ""}`}
                onClick={() => setSelectedDay(day)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setSelectedDay(day)}
              >
                {day}
              </div>
            ))}
          </div>

          <div className={styles.mapContainer}>
            {/* Map Legends */}
            <div className={styles.mapLegends}>
              <div className={styles.legendItem}>
                <span className={`${styles.retailerMarker} ${styles["retailerMarker--weekly"]}`} style={{ width: 12, height: 12 }} />
                <span>Weekly beat Visit</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.retailerMarker} ${styles["retailerMarker--biweekly"]}`} style={{ width: 12, height: 12 }} />
                <span>Bi-weekly Visit</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.retailerMarker} ${styles["retailerMarker--monthly"]}`} style={{ width: 12, height: 12 }} />
                <span>Monthly Visit</span>
              </div>
            </div>

            <div className={styles.mapVisual}>
              <div className={`${styles.mapStreet} ${styles["mapStreet--h1"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--h2"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--v1"]}`} />
              <div className={`${styles.mapStreet} ${styles["mapStreet--v2"]}`} />

              {/* Draw sequenced connections dynamically using SVG lines */}
              {activeRoute.length > 1 && (
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
                  {activeRoute.map((item, idx) => {
                    if (idx === activeRoute.length - 1) return null;
                    const next = activeRoute[idx + 1];
                    return (
                      <line
                        key={idx}
                        x1={item.coords.left}
                        y1={item.coords.top}
                        x2={next.coords.left}
                        y2={next.coords.top}
                        stroke="var(--primary)"
                        strokeWidth="3.5"
                        strokeDasharray="6 4"
                        opacity="0.65"
                      />
                    );
                  })}
                </svg>
              )}

              {/* Retailer Pins */}
              {activeRoute.map((item, idx) => {
                const markerClass = item.frequency === "Weekly" ? "weekly" : item.frequency === "Bi-weekly" ? "biweekly" : "monthly";
                return (
                  <Tooltip key={item.id} content={`${item.name} (${item.frequency} Visit)`}>
                    <div className={styles.mapPin} style={{ top: item.coords.top, left: item.coords.left }}>
                      <div className={`${styles.retailerMarker} ${styles[`retailerMarker--${markerClass}`]}`}>
                        {idx + 1}
                      </div>
                      <span className={styles.markerLabel}>{item.name.split(" ")[0]}</span>
                    </div>
                  </Tooltip>
                );
              })} {activeRoute.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", color: "var(--text-3)" }}>
                  <FiAlertTriangle size={32} />
                  <span>No Beat route active for this day. Click "Add Retailer" to begin.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar: Sequence & Optimization */}
        <div className={styles.sequencePanel}>
          <div className={styles.panelHeader}>
            <h3>Beat sequence</h3>
            <p>Order of retail visits planned for the day.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span>Outlets</span>
              <span>{stats.outlets}</span>
            </div>
            <div className={styles.statItem}>
              <span>Dist. Est</span>
              <span>{stats.distance}</span>
            </div>
            <div className={styles.statItem}>
              <span>Est. time</span>
              <span>{stats.duration}</span>
            </div>
            <div className={styles.statItem}>
              <span>Potential</span>
              <span>{stats.potential}</span>
            </div>
          </div>

          <div className={styles.scrollList}>
            {activeRoute.map((item, idx) => (
              <div key={item.id} className={styles.sequenceItem}>
                <div className={styles.seqNumber}>#{idx + 1}</div>
                <div className={styles.seqInfo}>
                  <strong>{item.name}</strong>
                  <span>{item.frequency} • Est: {item.potential}</span>
                </div>
                <div className={styles.seqActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    title="Move up route"
                  >
                    <FiChevronUp />
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === activeRoute.length - 1}
                    title="Move down route"
                  >
                    <FiChevronDown />
                  </button>
                </div>
                <button
                  className={styles.actionBtn}
                  style={{ marginLeft: "var(--space-2)", color: "var(--danger)" }}
                  onClick={() => removeRetailer(idx)}
                  title="Remove from beat"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.panelFooter}>
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<FiPlus />}
              onClick={() => setModalOpen(true)}
              style={{ flex: 1 }}
            >
              Add Retailer
            </Button>
          </div>
        </div>
      </div>

      {/* ── Assign Retailer Modal ───────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Retailer to Beat"
        description="Select an unassigned retailer from the regional list to add to the daily visit route."
        size="md"
      >
        <div className={styles.modalList}>
          {unassignedPool.map(ret => (
            <div key={ret.id} className={styles.modalListItem}>
              <div className={styles.modalListItemLeft}>
                <strong>{ret.name}</strong>
                <span>{ret.frequency} Visit • Potential: {ret.potential}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                leadingIcon={<FiPlus />}
                onClick={() => assignRetailer(ret)}
              >
                Assign
              </Button>
            </div>
          ))}
          {unassignedPool.length === 0 && (
            <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--text-3)" }}>
              No unassigned retailers found in this territory zone.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
