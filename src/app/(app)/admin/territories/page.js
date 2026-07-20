"use client";

import React, { useState, useMemo } from "react";
import {
  FiMapPin, FiSearch, FiDownload, FiFolder, FiMap, FiUsers,
  FiChevronRight, FiChevronDown, FiAlertTriangle, FiUserCheck, FiTarget,
  FiActivity
} from "react-icons/fi";
import {
  Button, Avatar, Badge, Select, Table, useToast
} from "../../../../../components/ui";
import styles from "./page.module.scss";

// Mock Data for the Territory Hierarchy
const mockTerritories = [
  {
    id: "IND-NAT",
    name: "India National",
    type: "National",
    level: 0,
    distributors: 450,
    activeRoutes: 1250,
    health: "Healthy",
    expanded: true,
    manager: { name: "Anil Sharma", role: "National Sales Head", avatar: "" },
    children: [
      {
        id: "NORTH-REG",
        name: "North Region",
        type: "Region",
        level: 1,
        distributors: 120,
        activeRoutes: 340,
        health: "Healthy",
        expanded: true,
        manager: { name: "Rajesh Kumar", role: "Regional Head", avatar: "" },
        children: [
          {
            id: "DEL-ZONE",
            name: "Delhi NCR Zone",
            type: "Zone",
            level: 2,
            distributors: 45,
            activeRoutes: 120,
            health: "Warning",
            expanded: false,
            manager: { name: "Priya Singh", role: "Zonal Manager", avatar: "" },
            children: [
              { id: "DEL-SOUTH", name: "South Delhi", type: "Territory", level: 3, distributors: 12, activeRoutes: 35, health: "Healthy", manager: { name: "Vikram Das", role: "Area Sales Manager", avatar: "" } },
              { id: "DEL-EAST", name: "East Delhi", type: "Territory", level: 3, distributors: 14, activeRoutes: 40, health: "Warning", manager: { name: "Neha Gupta", role: "Area Sales Manager", avatar: "" } }
            ]
          },
          {
            id: "PUN-ZONE",
            name: "Punjab Zone",
            type: "Zone",
            level: 2,
            distributors: 35,
            activeRoutes: 90,
            health: "Healthy",
            expanded: false,
            manager: { name: "Aman Preet", role: "Zonal Manager", avatar: "" },
            children: []
          }
        ]
      },
      {
        id: "WEST-REG",
        name: "West Region",
        type: "Region",
        level: 1,
        distributors: 135,
        activeRoutes: 400,
        health: "Healthy",
        expanded: false,
        manager: { name: "Suresh Menon", role: "Regional Head", avatar: "" },
        children: []
      }
    ]
  }
];

// Helper to flatten tree for rendering
const flattenTree = (nodes, result = []) => {
  nodes.forEach(node => {
    result.push(node);
    if (node.expanded && node.children && node.children.length > 0) {
      flattenTree(node.children, result);
    }
  });
  return result;
};

export default function TerritoriesPage() {
  const [treeData, setTreeData] = useState(mockTerritories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(mockTerritories[0]);
  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Territory Map Exported",
      description: "Full territory hierarchy and assignments exported to CSV.",
      tone: "success"
    });
  };

  const toggleNode = (targetId, currentNodes = treeData) => {
    const updated = currentNodes.map(node => {
      if (node.id === targetId) {
        return { ...node, expanded: !node.expanded };
      }
      if (node.children) {
        return { ...node, children: toggleNode(targetId, node.children) };
      }
      return node;
    });
    setTreeData(updated);
    return updated; // needed for recursion
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const flatNodes = useMemo(() => flattenTree(treeData), [treeData]);
  
  // Filter for search
  const visibleNodes = flatNodes.filter(node => 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    node.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiMapPin />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Administration</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Territories & Coverage</h2>
            <p className={styles.subtitle}>
              Manage geographical sales boundaries, hierarchy levels, and personnel mapping across the distribution network.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Coverage Map
          </Button>
        </div>
      </div>

      {/* ── 2. Territory Health Banner ─────────────────────────── */}
      <div className={styles.healthBanner}>
        <div className={styles.bannerAlert}>
          <FiAlertTriangle className={styles.alertIcon} />
          <div className={styles.alertInfo}>
            <strong>Coverage Gap Detected</strong>
            <span>3 Territories Unassigned</span>
          </div>
        </div>
        <div className={styles.bannerStats}>
          <div className={styles.statCol}>
            <span>Total Territories</span>
            <strong>485</strong>
          </div>
          <div className={styles.statCol}>
            <span>Active Distributors</span>
            <strong>450</strong>
          </div>
          <div className={styles.statCol}>
            <span>Active Routes</span>
            <strong>1,250</strong>
          </div>
          <div className={styles.statCol}>
            <span>Overall Coverage</span>
            <strong style={{ color: "var(--success)" }}>98.2%</strong>
          </div>
        </div>
        <div className={styles.bannerAction}>
          <Button variant="primary" size="sm">
            Assign Personnel
          </Button>
        </div>
      </div>

      {/* ── 3. Main Layout ─────────────────────────────────────── */}
      <div className={styles.mainLayout}>
        {/* Left: Hierarchy Tree */}
        <div className={styles.treePanel}>
          <div className={styles.treeHeader}>
            <h3>Hierarchy</h3>
          </div>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search territory..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <FiSearch />
          </div>
          <div className={styles.treeList}>
            {visibleNodes.map((node) => (
              <div 
                key={node.id}
                className={`${styles.treeNode} ${selectedNode?.id === node.id ? styles.active : ""}`}
                style={{ paddingLeft: `calc(var(--space-2) + ${node.level * 16}px)` }}
                onClick={() => handleNodeClick(node)}
              >
                <div 
                  className={styles.nodeIcon}
                  onClick={(e) => {
                    if (node.children && node.children.length > 0) {
                      e.stopPropagation();
                      toggleNode(node.id);
                    }
                  }}
                  style={{ cursor: node.children?.length ? "pointer" : "default" }}
                >
                  {node.children && node.children.length > 0 ? (
                    node.expanded ? <FiChevronDown /> : <FiChevronRight />
                  ) : (
                    <span style={{ width: 14 }} />
                  )}
                  <FiFolder style={{ marginLeft: 4, color: node.type === "Territory" ? "var(--primary)" : "inherit" }} />
                </div>
                <div className={styles.nodeName}>
                  {node.name}
                </div>
                <div className={styles.nodeBadge}>
                  {node.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Details */}
        <div className={styles.detailsPanel}>
          {selectedNode ? (
            <>
              <div className={styles.detailsHeader}>
                <div className={styles.territoryTitle}>
                  <h3>{selectedNode.name}</h3>
                  <p>{selectedNode.id} • {selectedNode.type} Level</p>
                </div>
                <Badge tone={selectedNode.health === "Healthy" ? "success" : "warning"} variant="soft" dot>
                  {selectedNode.health} Coverage
                </Badge>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <h4><FiUserCheck /> Personnel Assignment</h4>
                  {selectedNode.manager ? (
                    <div className={styles.assignmentMeta}>
                      <Avatar fallback={selectedNode.manager.name.substring(0,2)} size="md" />
                      <div className={styles.assignmentInfo}>
                        <strong>{selectedNode.manager.name}</strong>
                        <span>{selectedNode.manager.role}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.assignmentMeta}>
                      <div className={styles.assignmentInfo}>
                        <span style={{ color: "var(--danger)" }}>Unassigned</span>
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: "var(--space-2)" }}>
                    <Button variant="ghost" size="sm">Change Assignment</Button>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h4><FiTarget /> Coverage Metrics</h4>
                  <div className={styles.assignmentMeta}>
                    <div className={styles.assignmentInfo}>
                      <strong>{selectedNode.distributors}</strong>
                      <span>Mapped Distributors</span>
                    </div>
                  </div>
                  <div className={styles.assignmentMeta}>
                    <div className={styles.assignmentInfo}>
                      <strong>{selectedNode.activeRoutes}</strong>
                      <span>Active Sales Routes</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <FiMap />
              <h3>No Territory Selected</h3>
              <p>Select a region, zone, or territory from the hierarchy tree to view coverage details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
