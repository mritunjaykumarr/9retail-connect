import React from "react";
import { FiShoppingCart, FiPhoneCall, FiCheckSquare, FiShield } from "react-icons/fi";
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
