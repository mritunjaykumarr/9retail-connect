import React from "react";
import Link from "next/link";
import { FiShoppingCart, FiPhoneCall, FiCheckSquare, FiShield, FiTrendingUp, FiMap, FiNavigation, FiTarget } from "react-icons/fi";
import { roleLabel } from "../../lib/roles";
import StatCard from "../ui/StatCard/StatCard";
import Badge from "../ui/Badge/Badge";
import "./ManagerOverview.scss";

// Server-safe presentational overview (no hooks). Everything it shows was
// authorized + scoped server-side before this rendered.
export default function ManagerOverview({ user, summary }) {
  const { national, metrics, territory } = summary;
  const lakhs = (n) => `₹${(n / 100000).toFixed(1)}L`;

  return (
    <section className="mgr">
      <header className="mgr__head">
        <div>
          <span className="mgr__eyebrow">Manager Dashboard</span>
          <h1 className="mgr__title">Overview</h1>
          <p className="mgr__subtitle">
            Field performance for your area — secondary sales, coverage and
            adherence.
          </p>
        </div>
        <Badge tone={national ? "info" : "neutral"} variant="soft" dot>
          {national ? "National view" : "Territory-scoped"}
        </Badge>
      </header>

      <div className="mgr__stats">
        <StatCard
          label="Secondary sales (MTD)"
          value={lakhs(metrics.secondarySales)}
          delta={6.4}
          deltaLabel="vs last month"
          icon={<FiShoppingCart />}
        />
        <StatCard
          label="Productive calls"
          value={metrics.productiveCalls.toLocaleString("en-IN")}
          delta={2.1}
          deltaLabel="vs last month"
          icon={<FiPhoneCall />}
        />
        <StatCard
          label="Beat adherence"
          value={Math.round(metrics.beatAdherence * 100)}
          unit="%"
          delta={national ? 1.2 : -0.6}
          deltaLabel="vs last month"
          icon={<FiCheckSquare />}
        />
      </div>

      <div className="mgr__modules" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", margin: "1.5rem 0" }}>
        <Link href="/manager/forecasting" style={{ textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <FiTrendingUp style={{ fontSize: "1.25rem", color: "#f59e0b" }} />
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#fff" }}>AI Demand Forecasting</h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#c7d2fe" }}>Python Projection Engine &amp; Auto-Targets</p>
          </div>
        </Link>

        <Link href="/manager/field-map" style={{ textDecoration: "none" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <FiMap style={{ fontSize: "1.25rem", color: "#2563eb" }} />
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Live Field Map</h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Real-time positions of Sales Officers</p>
          </div>
        </Link>

        <Link href="/manager/beats" style={{ textDecoration: "none" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <FiNavigation style={{ fontSize: "1.25rem", color: "#059669" }} />
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Beat Designer</h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Plan ordered retailer routes per SO</p>
          </div>
        </Link>

        <Link href="/projections" style={{ textDecoration: "none" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <FiTarget style={{ fontSize: "1.25rem", color: "#7c3aed" }} />
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Projection Engine</h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>National SKU projections &amp; overrides</p>
          </div>
        </Link>
      </div>

      <div className="mgr__scope">
        <span className="mgr__scope-icon" aria-hidden="true">
          <FiShield />
        </span>
        <div className="mgr__scope-body">
          <h2 className="mgr__scope-title">Server-enforced access</h2>
          <p className="mgr__scope-text">
            This page and its data were authorized on the server by the RBAC
            guard before rendering. You're signed in as{" "}
            <b>{roleLabel(user.role)}</b>
            {national
              ? " with national scope — you see every territory."
              : ` scoped to ${
                  territory ? `territory ${territory}` : "your assigned territory"
                } — you only see your own data.`}
          </p>
          <dl className="mgr__scope-facts">
            <div>
              <dt>Role</dt>
              <dd>{roleLabel(user.role)}</dd>
            </div>
            <div>
              <dt>Territory scope</dt>
              <dd>{national ? "All territories" : territory || "Unassigned"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
