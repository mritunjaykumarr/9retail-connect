"use client";

import React, { useState } from "react";
import {
  FiSettings, FiUser, FiBell, FiShield, FiSliders, FiCpu, FiKey,
  FiSave, FiRotateCcw, FiCheckCircle, FiLock, FiGlobe, FiSmartphone, FiTrash2, FiRefreshCw
} from "react-icons/fi";
import {
  Button, Avatar, Badge, Tabs, Table, useToast
} from "../../../../components/ui";
import styles from "./page.module.scss";

// Mock Active Sessions Data
const mockSessions = [
  { id: "SES-901", device: "Chrome / Windows 11", location: "New Delhi, India", ip: "192.168.1.45", lastActive: "Just Now", current: true },
  { id: "SES-902", device: "Safari / macOS Sonoma", location: "Mumbai, India", ip: "10.0.4.12", lastActive: "2 hours ago", current: false },
  { id: "SES-903", device: "RetailConnect App / iOS 17", location: "Bengaluru, India", ip: "10.0.1.55", lastActive: "Yesterday", current: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Arkalal Chakravarty",
    email: "arkalal.c@retailconnect.io",
    phone: "+91 98765 43210",
    designation: "System Administrator & Lead Architect",
    timezone: "Asia/Kolkata (IST +05:30)",
    theme: "dark",
    currency: "INR (₹)",
    language: "English (US)",
    compactView: false,
    autoSyncErp: true,
  });

  // Toggle States for Notifications
  const [notifications, setNotifications] = useState({
    emailAnomalies: true,
    emailStockout: true,
    pushSystemErrors: true,
    weeklyReport: false,
    whatsappAlerts: true,
  });

  // Toggle Notification State Helper
  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toast Helpers
  const handleSave = () => {
    toast?.({
      title: "Settings Saved Successfully",
      description: "Your account preferences and system parameters have been updated.",
      tone: "success"
    });
  };

  const handleDiscard = () => {
    toast?.({
      title: "Changes Discarded",
      description: "Reverted back to original preference configuration.",
      tone: "info"
    });
  };

  const handleRevokeSession = (sessionId) => {
    toast?.({
      title: "Session Terminated",
      description: `Security token for session ${sessionId} has been invalidated.`,
      tone: "warning"
    });
  };

  const handleRegenerateKey = () => {
    toast?.({
      title: "API Key Regenerated",
      description: "New bearer key generated for SAP S/4HANA connector.",
      tone: "success"
    });
  };

  // Table Columns for Active Sessions
  const sessionCols = [
    {
      key: "device",
      label: "Device & Browser",
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiSmartphone style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-1)', display: 'block' }}>{row.device}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>{row.ip}</span>
          </div>
        </div>
      )
    },
    { key: "location", label: "Location" },
    { key: "lastActive", label: "Last Active" },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <Badge tone={row.current ? "success" : "neutral"} variant="soft" dot>
          {row.current ? "Current Session" : "Active"}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (_, row) => !row.current && (
        <Button 
          variant="ghost" 
          size="sm" 
          iconOnly 
          aria-label="Revoke Session"
          onClick={() => handleRevokeSession(row.id)}
        >
          <FiTrash2 style={{ color: 'var(--danger)' }} />
        </Button>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiSettings />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Administration</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Account & Platform Settings</h2>
            <p className={styles.subtitle}>
              Configure your user profile, security credentials, notification channels, ERP integrations, and workspace preferences.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiRotateCcw />} onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="primary" size="sm" leadingIcon={<FiSave />} onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* ── 2. Profile & Health Banner ─────────────────────────── */}
      <div className={styles.profileBanner}>
        <div className={styles.userCard}>
          <Avatar fallback="AC" size="lg" />
          <div className={styles.userInfo}>
            <strong>{formData.fullName}</strong>
            <span>{formData.designation}</span>
            <span style={{ color: 'var(--primary-text)' }}>{formData.email}</span>
          </div>
        </div>
        <div className={styles.bannerStats}>
          <div className={styles.statCol}>
            <span>Security Score</span>
            <strong style={{ color: "var(--success)" }}>98% Excellent</strong>
          </div>
          <div className={styles.statCol}>
            <span>Two-Factor Auth</span>
            <strong style={{ color: "var(--success)" }}>Enabled (Hardware Key)</strong>
          </div>
          <div className={styles.statCol}>
            <span>ERP Connection</span>
            <strong style={{ color: "var(--success)" }}>SAP S/4HANA Connected</strong>
          </div>
          <div className={styles.statCol}>
            <span>Active Sessions</span>
            <strong className="rc-tnum">3 Devices</strong>
          </div>
        </div>
        <div className={styles.bannerAction}>
          <Button variant="outline" size="sm" leadingIcon={<FiLock />}>
            Security Center
          </Button>
        </div>
      </div>

      {/* ── 3. Tabs Navigation ─────────────────────────────────── */}
      <Tabs
        items={[
          { value: "profile", label: "Profile & Security" },
          { value: "notifications", label: "Notification Rules" },
          { value: "integrations", label: "Integrations & ERP" },
          { value: "preferences", label: "App Preferences" }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* ── 4. Main Tab Content Area ───────────────────────────── */}
      <div className={styles.contentGrid}>
        {/* TAB 1: Profile & Security */}
        {activeTab === "profile" && (
          <>
            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleBlock}>
                  <h3><FiUser style={{ marginRight: 8 }} /> Personal Details</h3>
                  <p>Update your public profile, contact information, and organizational role.</p>
                </div>
              </div>
              <div className={styles.formGridTwoCol}>
                <div className={styles.formField}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                  />
                </div>
                <div className={styles.formField}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
                <div className={styles.formField}>
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                  />
                </div>
                <div className={styles.formField}>
                  <label>Designation & Role</label>
                  <input 
                    type="text" 
                    value={formData.designation} 
                    onChange={e => setFormData({ ...formData, designation: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleBlock}>
                  <h3><FiShield style={{ marginRight: 8 }} /> Password & Authentication</h3>
                  <p>Manage your master password, multi-factor authentication, and login credentials.</p>
                </div>
              </div>
              <div className={styles.formGridTwoCol}>
                <div className={styles.formField}>
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••••••" />
                </div>
                <div className={styles.formField}>
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new strong password" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outline" size="sm" leadingIcon={<FiLock />}>
                  Update Password
                </Button>
              </div>
            </div>

            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleBlock}>
                  <h3><FiSmartphone style={{ marginRight: 8 }} /> Active Sessions & Recognized Devices</h3>
                  <p>Devices currently authenticated to your RetailConnect account.</p>
                </div>
              </div>
              <Table data={mockSessions} columns={sessionCols} />
            </div>
          </>
        )}

        {/* TAB 2: Notification Rules */}
        {activeTab === "notifications" && (
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.titleBlock}>
                <h3><FiBell style={{ marginRight: 8 }} /> Alert Subscriptions & Channels</h3>
                <p>Choose which system events trigger email, push, or messaging alerts.</p>
              </div>
            </div>
            <div className={styles.toggleList}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>Demand & Order Anomalies</strong>
                  <span>Send immediate alerts when unexpected demand spikes or dropoffs occur.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={notifications.emailAnomalies} 
                    onChange={() => handleToggleNotification("emailAnomalies")} 
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>Stockout Risk Alerts</strong>
                  <span>Notify inventory managers when safety stock levels breach critical threshold.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={notifications.emailStockout} 
                    onChange={() => handleToggleNotification("emailStockout")} 
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>System Errors & Integration Failures</strong>
                  <span>Receive high-priority notifications if SAP ERP or API sync connectors fail.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={notifications.pushSystemErrors} 
                    onChange={() => handleToggleNotification("pushSystemErrors")} 
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>WhatsApp & SMS Broadcasts</strong>
                  <span>Dispatch dispatch and PO status updates directly to regional managers via WhatsApp.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={notifications.whatsappAlerts} 
                    onChange={() => handleToggleNotification("whatsappAlerts")} 
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>Weekly Performance Digest</strong>
                  <span>Automated summary of forecast accuracy (MAPE), sales velocity, and distributor health.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={notifications.weeklyReport} 
                    onChange={() => handleToggleNotification("weeklyReport")} 
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Integrations & ERP */}
        {activeTab === "integrations" && (
          <>
            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleBlock}>
                  <h3><FiCpu style={{ marginRight: 8 }} /> Enterprise Connectors</h3>
                  <p>Status and parameters of central ERP, WMS, and CRM data sync pipelines.</p>
                </div>
              </div>

              <div className={styles.integrationBox}>
                <div className={styles.integrationInfo}>
                  <div className={styles.logoIcon}>
                    <FiCpu />
                  </div>
                  <div className={styles.details}>
                    <strong>SAP S/4HANA Enterprise Connector</strong>
                    <span>Endpoint: https://sap-gateway.retailconnect.internal/v2/odata</span>
                  </div>
                </div>
                <Badge tone="success" variant="soft" dot>Active & Syncing</Badge>
              </div>

              <div className={styles.formGridTwoCol}>
                <div className={styles.formField}>
                  <label>Sync Interval</label>
                  <select defaultValue="15">
                    <option value="5">Every 5 Minutes</option>
                    <option value="15">Every 15 Minutes (Default)</option>
                    <option value="60">Hourly</option>
                    <option value="1440">Daily Batch</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Data Compression</label>
                  <select defaultValue="gzip">
                    <option value="gzip">GZIP (Enabled)</option>
                    <option value="brotli">Brotli</option>
                    <option value="none">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleBlock}>
                  <h3><FiKey style={{ marginRight: 8 }} /> API Bearer Keys & Webhooks</h3>
                  <p>Secret credentials for authenticating third-party applications.</p>
                </div>
              </div>
              <div className={styles.formField}>
                <label>Production API Key</label>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <input type="password" value="rc_live_9f82a10b4c73d9e21045a" readOnly style={{ flex: 1 }} />
                  <Button variant="outline" size="sm" leadingIcon={<FiRefreshCw />} onClick={handleRegenerateKey}>
                    Regenerate Key
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 4: App Preferences */}
        {activeTab === "preferences" && (
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.titleBlock}>
                <h3><FiSliders style={{ marginRight: 8 }} /> Regional & UI Preferences</h3>
                <p>Customize system units, date formats, and visual theme options.</p>
              </div>
            </div>
            <div className={styles.formGridTwoCol}>
              <div className={styles.formField}>
                <label>Timezone</label>
                <select 
                  value={formData.timezone} 
                  onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                >
                  <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label>Default Currency Display</label>
                <select 
                  value={formData.currency} 
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                  <option value="USD ($)">USD ($ - US Dollar)</option>
                  <option value="EUR (€)">EUR (€ - Euro)</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label>System Display Language</label>
                <select 
                  value={formData.language} 
                  onChange={e => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label>Visual Interface Theme</label>
                <select 
                  value={formData.theme} 
                  onChange={e => setFormData({ ...formData, theme: e.target.value })}
                >
                  <option value="dark">Sleek Dark Mode (Default)</option>
                  <option value="light">Clean Light Mode</option>
                  <option value="system">Follow System Preference</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
