"use client";

import React, { useState, useMemo } from "react";
import {
  FiUsers, FiSearch, FiDownload, FiFilter,
  FiZap, FiCheckCircle, FiClock, FiShield, FiUserPlus,
  FiChevronRight, FiKey, FiLock, FiSliders, FiCheckSquare, FiAlertCircle, FiEdit2
} from "react-icons/fi";
import {
  Table, Avatar, Button, Drawer, Modal, Badge, Input, Select, useToast
} from "../../../../../components/ui";
import styles from "./page.module.scss";

/* --- BESPOKE USERS & ROLES MOCK DATA --- */

const initialUsersLedger = [
  {
    id: "USR-101",
    fullName: "Vikram Malhotra",
    email: "vikram.m@retailconnect.in",
    role: "Area Sales Manager (ASM)",
    territory: "Delhi East Cluster",
    twoFactorStatus: "2FA Verified",
    lastActive: "10 Mins Ago",
    status: "Active",
    details: {
      phone: "+91 98110 44210",
      assignedBeats: "12 Sales Beats (140 Retailers)",
      directReports: "8 Sales Officers (SOs)",
      dateCreated: "14 Jan 2025",
      securityLevel: "Level 3 - Territory Management"
    }
  },
  {
    id: "USR-102",
    fullName: "Sanjay Singhania",
    email: "sanjay.s@retailconnect.in",
    role: "Area Sales Manager (ASM)",
    territory: "Noida Zone",
    twoFactorStatus: "2FA Verified",
    lastActive: "25 Mins Ago",
    status: "Active",
    details: {
      phone: "+91 98101 22340",
      assignedBeats: "9 Sales Beats (110 Retailers)",
      directReports: "6 Sales Officers (SOs)",
      dateCreated: "20 Feb 2025",
      securityLevel: "Level 3 - Territory Management"
    }
  },
  {
    id: "USR-103",
    fullName: "Anand Verma",
    email: "anand.v@retailconnect.in",
    role: "Regional Commercial Director",
    territory: "North India Hub",
    twoFactorStatus: "2FA Verified",
    lastActive: "2 Hours Ago",
    status: "Active",
    details: {
      phone: "+91 98765 43210",
      assignedBeats: "All North Zones (18 Clusters)",
      directReports: "4 ASMs & 2 Plant Heads",
      dateCreated: "01 Nov 2024",
      securityLevel: "Level 5 - Regional Executive"
    }
  },
  {
    id: "USR-104",
    fullName: "Amit Kumar",
    email: "amit.k@retailconnect.in",
    role: "Sales Officer (SO)",
    territory: "Delhi East Beat 4",
    twoFactorStatus: "Pending Setup",
    lastActive: "Yesterday",
    status: "Active",
    details: {
      phone: "+91 98220 11980",
      assignedBeats: "Beat 4 (Preet Vihar & Laxmi Nagar)",
      directReports: "None (Field Representative)",
      dateCreated: "10 May 2026",
      securityLevel: "Level 1 - Mobile Field PJM"
    }
  }
];

const mockRolePermissions = [
  { roleName: "Regional Commercial Director", userCount: "4 Users", modules: "Full Access: Manufacturing, Projections, Field Sales, Master Data & Admin", tone: "primary" },
  { roleName: "Area Sales Manager (ASM)", userCount: "28 Users", modules: "Territory Access: Field Sales, Projections, Targets & Distributor Orders", tone: "success" },
  { roleName: "Plant Head / Operations Manager", userCount: "12 Users", modules: "Manufacturing Access: Production Schedule, Materials, Capacity & Suppliers", tone: "warning" },
  { roleName: "Sales Officer (SO)", userCount: "380 Users", modules: "Mobile Field Access: Beat Coverage, Check-ins, Orders & Adherence", tone: "primary" },
  { roleName: "System Super Admin", userCount: "3 Users", modules: "Platform Management: User Roles, Territory Hierarchy, MDM & Audit Logs", tone: "danger" }
];

const mockSecurityPolicies = [
  { policy: "Two-Factor Authentication (2FA)", requirement: "Enforced for Level 3+", status: "Active (98.4% Adoption)" },
  { policy: "Session Inactivity Timeout", requirement: "30 Minutes Auto-Lockout", status: "Active" },
  { policy: "Password Expiry Cycle", requirement: "Rotates Every 90 Days", status: "Enforced" },
  { policy: "IP Whitelisting Range", requirement: "Corporate VPN & Field Mobile Subnets", status: "Active" }
];

export default function UsersAndRolesPage() {
  const [usersList, setUsersList] = useState(initialUsersLedger);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleEditModalOpen, setRoleEditModalOpen] = useState(false);

  // Form State for Drawer Role Change
  const [drawerRole, setDrawerRole] = useState("");
  const [drawerTerritory, setDrawerTerritory] = useState("");

  // Form State for Provisioning User Modal
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Area Sales Manager (ASM)");
  const [newTerritory, setNewTerritory] = useState("Delhi East Cluster");

  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Security & User Matrix Exported",
      description: "Provisioned user accounts, role RBAC permissions, and 2FA status downloaded to CSV.",
      tone: "success"
    });
  };

  const handleProvisionSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: `USR-${105 + usersList.length}`,
      fullName: newFullName,
      email: newEmail,
      role: newRole,
      territory: newTerritory,
      twoFactorStatus: "Pending Setup",
      lastActive: "Just Now",
      status: "Active",
      details: {
        phone: "+91 98000 00000",
        assignedBeats: "Pending Beat Mapping",
        directReports: "0",
        dateCreated: "Today",
        securityLevel: newRole.includes("ASM") ? "Level 3 - Territory Management" : "Level 1 - Field User"
      }
    };
    setUsersList(prev => [newUser, ...prev]);
    setModalOpen(false);
    setNewFullName("");
    setNewEmail("");
    toast?.({
      title: "New User Provisioned",
      description: `Account created for ${newFullName} (${newRole}). Welcome security invite sent.`,
      tone: "success"
    });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setDrawerRole(user.role);
    setDrawerTerritory(user.territory);
    setDrawerOpen(true);
  };

  const handleSaveDrawerRoleChange = () => {
    if (!selectedUser) return;
    setUsersList(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: drawerRole, territory: drawerTerritory } : u));
    setSelectedUser(prev => prev ? { ...prev, role: drawerRole, territory: drawerTerritory } : null);
    toast?.({
      title: "User Role & Permissions Updated",
      description: `${selectedUser.fullName}'s role updated to ${drawerRole} (${drawerTerritory}).`,
      tone: "success"
    });
  };

  const handleReset2FA = (user) => {
    toast?.({
      title: "2FA Security Reset Dispatched",
      description: `SMS OTP & 2FA reset link dispatched to ${user.details.phone || user.fullName}.`,
      tone: "success"
    });
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    toast?.({
      title: `Account ${newStatus}`,
      description: `${user.fullName}'s account has been ${newStatus.toLowerCase()}.`,
      tone: newStatus === "Active" ? "success" : "danger"
    });
  };

  const openRoleEditModal = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setDrawerRole(user.role);
    setDrawerTerritory(user.territory);
    setRoleEditModalOpen(true);
  };

  // Filter Users Ledger
  const filteredUsers = useMemo(() => {
    return usersList.filter(item => {
      const matchSearch = item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchRole = roleFilter === "All" || item.role.includes(roleFilter);
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [usersList, searchQuery, roleFilter, statusFilter]);

  const userColumns = [
    {
      key: "fullName",
      label: "User Name & Contact",
      sortable: true,
      render: (_, row) => (
        <div className={styles.userMeta}>
          <Avatar name={row.fullName} size="sm" />
          <div className={styles.userText}>
            <strong>{row.fullName}</strong>
            <span>{row.email} • {row.id}</span>
          </div>
        </div>
      )
    },
    {
      key: "role",
      label: "Assigned Role",
      render: (val) => <Badge tone="primary" variant="soft" dot>{val}</Badge>
    },
    { key: "territory", label: "Territory / Cluster" },
    {
      key: "twoFactorStatus",
      label: "2FA Security",
      render: (val) => (
        <Badge tone={val.includes("Verified") ? "success" : "warning"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    { key: "lastActive", label: "Last Active" },
    {
      key: "status",
      label: "Account Status",
      align: "center",
      render: (val) => (
        <Badge tone={val === "Active" ? "success" : "danger"} variant="soft" dot>
          {val}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Role Actions",
      align: "right",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" leadingIcon={<FiEdit2 />} onClick={(e) => openRoleEditModal(e, row)}>
            Change Role
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="View User Details" onClick={() => handleUserClick(row)}>
            <FiChevronRight />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* --- 1. Page Header --- */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiUsers />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Administration</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>Super Admin</span>
            </div>
            <h2>User Accounts & RBAC Role Security</h2>
            <p className={styles.subtitle}>
              Provision user accounts, configure role-based access control (RBAC) permissions, enforce 2FA authentication, and manage territory assignments.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" leadingIcon={<FiUserPlus />} onClick={() => setModalOpen(true)}>
            Provision New User
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Security Matrix
          </Button>
        </div>
      </div>

      {/* --- 2. Context Filter Toolbar --- */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Filter by Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Enterprise Roles</option>
              <option value="Area Sales Manager">Area Sales Manager (ASM)</option>
              <option value="Sales Officer">Sales Officer (SO)</option>
              <option value="Commercial Director">Commercial Director</option>
              <option value="Plant Head">Plant Head / Operations Manager</option>
              <option value="Super Admin">System Super Admin</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Account Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Accounts</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Section 1: Security & License Status Banner --- */}
      <div className={styles.userSecurityBanner}>
        <div className={styles.badgeArea}>
          <div className={styles.shieldIcon}>
            <FiShield />
          </div>
          <div className={styles.shieldMeta}>
            <strong>Enterprise Security Active</strong>
            <span>RBAC Enforced • 5 Role Categories</span>
          </div>
        </div>

        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>Total Provisioned Users</span>
          <span className={styles.metricVal}>{usersList.length} Accounts</span>
          <span className={styles.metricSub}>{usersList.filter(u => u.status === "Active").length} Active</span>
        </div>

        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>2FA Adoption Rate</span>
          <span className={styles.metricVal}>98.4% Enforced</span>
          <span className={styles.metricSub}>All Level 3+ Management Accounts</span>
        </div>

        <div className={styles.bannerMetricBlock}>
          <span className={styles.metricLabel}>License Seat Quota</span>
          <span className={styles.metricVal}>{usersList.length} / 500 Used</span>
          <span className={styles.metricSub}>{500 - usersList.length} Available Seats</span>
        </div>
      </div>

      {/* --- Section 2: Master User Accounts Table --- */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3>Provisioned User Accounts & Security Roster</h3>
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search User Name, Email, Territory or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FiSearch />
            </div>
          </div>
        </div>
        <Table
          data={filteredUsers}
          columns={userColumns}
          onRowClick={handleUserClick}
          emptyMessage="No user records match selected filters."
        />
      </div>

      {/* --- Section 3: Role Permissions Matrix & Security Policy Split --- */}
      <div className={styles.splitRow}>
        {/* Left: Role Permissions Matrix */}
        <div className={styles.rbacCard}>
          <div className={styles.cardHeader}>
            <h3>Role-Based Access Control (RBAC) Permissions Matrix</h3>
          </div>
          <div className={styles.roleList}>
            {mockRolePermissions.map((item, idx) => (
              <div key={idx} className={styles.roleItem}>
                <div className={styles.itemHead}>
                  <strong>{item.roleName}</strong>
                  <Badge tone={item.tone} variant="soft" dot>
                    {item.userCount}
                  </Badge>
                </div>
                <div className={styles.itemMeta}>
                  <strong>Module Scope:</strong> {item.modules}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security Security Policies Panel */}
        <div className={styles.policyCard}>
          <h3>Enterprise Security Policies & 2FA Rules</h3>
          <div className={styles.policyList}>
            {mockSecurityPolicies.map((pol, idx) => (
              <div key={idx} className={styles.policyItem}>
                <div>
                  <strong style={{ display: "block", fontSize: "var(--text-xs)", color: "var(--text-1)" }}>{pol.policy}</strong>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>{pol.requirement}</span>
                </div>
                <Badge tone="success" variant="soft" dot>
                  {pol.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. User Details & Role Modification Drawer --- */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedUser?.fullName}
        description={`Email: ${selectedUser?.email} • ID: ${selectedUser?.id}`}
        side="right"
        size="md"
      >
        {selectedUser && (
          <div className={styles.drawerContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Current Role</span>
                <Badge tone="primary" variant="soft" dot>{selectedUser.role}</Badge>
              </div>
              <div className={styles.summaryItem}>
                <span>Territory Cluster</span>
                <strong>{selectedUser.territory}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>2FA Security</span>
                <strong>{selectedUser.twoFactorStatus}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Account Status</span>
                <Badge tone={selectedUser.status === "Active" ? "success" : "danger"} variant="soft" dot>
                  {selectedUser.status}
                </Badge>
              </div>
              <div className={styles.summaryItem}>
                <span>Phone Number</span>
                <strong>{selectedUser.details.phone}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Security Level</span>
                <strong>{selectedUser.details.securityLevel}</strong>
              </div>
            </div>

            {/* --- Interactive Role & Access Management Section --- */}
            <div style={{ background: "var(--surface-sunken)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", margin: 0, display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <FiEdit2 color="var(--primary)" /> Change User Role & Territory Access
              </h4>
              
              <div>
                <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: "var(--space-1)" }}>
                  Assign New Enterprise Role:
                </label>
                <Select
                  value={drawerRole}
                  onChange={(e) => setDrawerRole(e.target.value)}
                  options={[
                    { label: "Area Sales Manager (ASM)", value: "Area Sales Manager (ASM)" },
                    { label: "Sales Officer (SO)", value: "Sales Officer (SO)" },
                    { label: "Regional Commercial Director", value: "Regional Commercial Director" },
                    { label: "Plant Head / Operations Manager", value: "Plant Head / Operations Manager" },
                    { label: "System Super Admin", value: "System Super Admin" }
                  ]}
                />
              </div>

              <div>
                <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: "var(--space-1)" }}>
                  Re-assign Territory Cluster:
                </label>
                <Select
                  value={drawerTerritory}
                  onChange={(e) => setDrawerTerritory(e.target.value)}
                  options={[
                    { label: "Delhi East Cluster", value: "Delhi East Cluster" },
                    { label: "Noida Zone", value: "Noida Zone" },
                    { label: "Gurgaon Commercial Hub", value: "Gurgaon Commercial Hub" },
                    { label: "North India Hub", value: "North India Hub" },
                    { label: "Faridabad & Palwal Zone", value: "Faridabad & Palwal Zone" }
                  ]}
                />
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                <Button variant="primary" size="sm" onClick={handleSaveDrawerRoleChange}>
                  Save Role & Access
                </Button>
                <Button variant="outline" size="sm" leadingIcon={<FiKey />} onClick={() => handleReset2FA(selectedUser)}>
                  Reset 2FA
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ color: selectedUser.status === "Active" ? "var(--danger)" : "var(--success)" }}
                  onClick={() => handleToggleStatus(selectedUser)}
                >
                  {selectedUser.status === "Active" ? "Suspend" : "Activate"}
                </Button>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-1)", marginBottom: "var(--space-3)" }}>
                Field Beats & Organizational Telemetry
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-2)" }}>
                <div><strong>Assigned Sales Beats:</strong> {selectedUser.details.assignedBeats}</div>
                <div><strong>Direct Reports:</strong> {selectedUser.details.directReports}</div>
                <div><strong>Date Account Provisioned:</strong> {selectedUser.details.dateCreated}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* --- 5. Quick Change Role Modal --- */}
      <Modal
        open={roleEditModalOpen}
        onClose={() => setRoleEditModalOpen(false)}
        title={`Change Role: ${selectedUser?.fullName}`}
        description={`Modify RBAC security role and assigned territory for ${selectedUser?.email}`}
        size="md"
      >
        {selectedUser && (
          <div className={styles.formGrid}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Assigned Enterprise Role
              </label>
              <Select
                value={drawerRole}
                onChange={(e) => setDrawerRole(e.target.value)}
                options={[
                  { label: "Area Sales Manager (ASM)", value: "Area Sales Manager (ASM)" },
                  { label: "Sales Officer (SO)", value: "Sales Officer (SO)" },
                  { label: "Regional Commercial Director", value: "Regional Commercial Director" },
                  { label: "Plant Head / Operations Manager", value: "Plant Head / Operations Manager" },
                  { label: "System Super Admin", value: "System Super Admin" }
                ]}
              />
            </div>

            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Territory Assignment
              </label>
              <Select
                value={drawerTerritory}
                onChange={(e) => setDrawerTerritory(e.target.value)}
                options={[
                  { label: "Delhi East Cluster", value: "Delhi East Cluster" },
                  { label: "Noida Zone", value: "Noida Zone" },
                  { label: "Gurgaon Commercial Hub", value: "Gurgaon Commercial Hub" },
                  { label: "North India Hub", value: "North India Hub" }
                ]}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
              <Button variant="outline" size="sm" type="button" onClick={() => setRoleEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => { handleSaveDrawerRoleChange(); setRoleEditModalOpen(false); }}>
                Update Role Access
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* --- 6. Provision New User Modal --- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provision New Enterprise User Account"
        description="Create a new user account, assign RBAC role permissions, and issue a welcome security invite."
        size="md"
      >
        <form onSubmit={handleProvisionSubmit} className={styles.formGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Full Name
              </label>
              <Input
                placeholder="e.g. Rahul Sharma"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Corporate Work Email
              </label>
              <Input
                type="email"
                placeholder="rahul.s@retailconnect.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)", width: "100%" }}>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Assigned RBAC Role
              </label>
              <Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                options={[
                  { label: "Area Sales Manager (ASM)", value: "Area Sales Manager (ASM)" },
                  { label: "Sales Officer (SO)", value: "Sales Officer (SO)" },
                  { label: "Plant Head / Operations Manager", value: "Plant Head / Operations Manager" },
                  { label: "Regional Commercial Director", value: "Regional Commercial Director" },
                  { label: "System Super Admin", value: "System Super Admin" }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-1)", display: "block", marginBottom: "var(--space-1)" }}>
                Territory / Plant Cluster
              </label>
              <Select
                value={newTerritory}
                onChange={(e) => setNewTerritory(e.target.value)}
                options={[
                  { label: "Delhi East Cluster", value: "Delhi East Cluster" },
                  { label: "Noida Zone", value: "Noida Zone" },
                  { label: "Gurgaon Commercial Hub", value: "Gurgaon Commercial Hub" },
                  { label: "North Bottling Plant", value: "North Bottling Plant" }
                ]}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
