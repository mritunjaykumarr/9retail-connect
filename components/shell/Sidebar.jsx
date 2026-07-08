"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiX } from "react-icons/fi";
import {
  navForRole,
  ACCOUNT_ITEMS,
  findItemByPath,
} from "../../lib/navigation";
import { useSession } from "./SessionProvider";
import Logo from "./Logo";
import "./Sidebar.scss";

function NavItem({ item, active, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <li className="rc-side__item">
      <Link
        href={item.href}
        className={`rc-side__link ${active ? "is-active" : ""}`}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
      >
        <span className="rc-side__link-icon" aria-hidden="true">
          <Icon />
        </span>
        <span className="rc-side__link-label">{item.label}</span>
      </Link>
    </li>
  );
}

export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}) {
  const { role } = useSession();
  const pathname = usePathname();
  const groups = navForRole(role);
  const activeHref = findItemByPath(pathname)?.item.href;

  // Collapsed groups (by id). Default: all open.
  const [closedGroups, setClosedGroups] = useState({});
  const toggleGroup = (id) =>
    setClosedGroups((s) => ({ ...s, [id]: !s[id] }));

  return (
    <aside
      className={`rc-side ${collapsed ? "rc-side--collapsed" : ""} ${
        mobileOpen ? "is-mobile-open" : ""
      }`}
      aria-label="Primary navigation"
    >
      <div className="rc-side__brand">
        <Link href="/dashboard" className="rc-side__brand-link" aria-label="Go to dashboard">
          <Logo compact={collapsed} />
        </Link>
        <button
          type="button"
          className="rc-side__mobile-close"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        >
          <FiX />
        </button>
      </div>

      <nav className="rc-side__nav" aria-label="Modules">
        {groups.map((group) => {
          const isClosed = !collapsed && closedGroups[group.id];
          const isOverview = group.id === "overview";
          return (
            <div className="rc-side__group" key={group.id}>
              {!collapsed && !isOverview && (
                <button
                  type="button"
                  className="rc-side__group-label"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={!isClosed}
                >
                  <span>{group.label}</span>
                  <span
                    className={`rc-side__group-caret ${
                      isClosed ? "is-closed" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <FiChevronDown />
                  </span>
                </button>
              )}
              {!isClosed && (
                <ul className="rc-side__list">
                  {group.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      active={activeHref === item.href}
                      collapsed={collapsed}
                      onNavigate={onCloseMobile}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="rc-side__footer">
        <ul className="rc-side__list">
          {ACCOUNT_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={activeHref === item.href}
              collapsed={collapsed}
              onNavigate={onCloseMobile}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}
