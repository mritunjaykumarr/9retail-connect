"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiCheck,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { ROLE_META } from "../../lib/roles";
import { useSession } from "./SessionProvider";
import Menu, { MenuItem, MenuLabel, MenuDivider } from "../ui/Menu/Menu";
import Avatar from "../ui/Avatar/Avatar";
import Badge from "../ui/Badge/Badge";
import EmptyState from "../ui/EmptyState/EmptyState";
import ThemeToggle from "../ui/ThemeToggle/ThemeToggle";
import "./Topbar.scss";

function GlobalSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };
  return (
    <form className="rc-topbar__search" role="search" onSubmit={onSubmit}>
      <span className="rc-topbar__search-icon" aria-hidden="true">
        <FiSearch />
      </span>
      <input
        type="search"
        className="rc-topbar__search-input"
        placeholder="Search orders, retailers, SKUs…"
        aria-label="Global search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <kbd className="rc-topbar__search-kbd" aria-hidden="true">
        /
      </kbd>
    </form>
  );
}

function NotificationsMenu() {
  return (
    <Menu
      align="end"
      width={320}
      ariaLabel="Notifications"
      trigger={
        <button
          type="button"
          className="rc-topbar__icon-btn"
          aria-label="Notifications"
        >
          <FiBell />
        </button>
      }
    >
      <MenuLabel>Notifications</MenuLabel>
      <div className="rc-topbar__notif-empty">
        <EmptyState
          size="sm"
          icon={<FiBell />}
          title="You're all caught up"
          description="New orders, approvals and alerts will show up here."
        />
      </div>
      <MenuDivider />
      <MenuItem href="/notifications">View all notifications</MenuItem>
    </Menu>
  );
}

function ProfileMenu() {
  const { user, role, roles, setRole, signOut } = useSession();
  return (
    <Menu
      align="end"
      width={272}
      ariaLabel="Account menu"
      trigger={
        <button type="button" className="rc-topbar__profile" aria-label="Account menu">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <span className="rc-topbar__profile-meta">
            <span className="rc-topbar__profile-name">{user.name}</span>
            <span className="rc-topbar__profile-role">{user.title}</span>
          </span>
          <span className="rc-topbar__profile-caret" aria-hidden="true">
            <FiChevronDown />
          </span>
        </button>
      }
    >
      <div className="rc-topbar__profile-card">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="rc-topbar__profile-card-meta">
          <span className="rc-topbar__profile-card-name">{user.name}</span>
          <span className="rc-topbar__profile-card-email">{user.email}</span>
          <Badge tone="primary" variant="soft" size="sm">
            {user.territory}
          </Badge>
        </div>
      </div>

      <MenuDivider />
      <MenuLabel>Switch role · dev preview</MenuLabel>
      {roles.map((r) => (
        <MenuItem
          key={r}
          selected={r === role}
          icon={r === role ? <FiCheck /> : <FiUser />}
          onClick={() => setRole(r)}
        >
          {ROLE_META[r].label}
        </MenuItem>
      ))}

      <MenuDivider />
      <div className="rc-topbar__theme-row">
        <span className="rc-topbar__theme-label">Theme</span>
        <ThemeToggle />
      </div>

      <MenuDivider />
      <MenuItem href="/settings" icon={<FiSettings />}>
        Settings
      </MenuItem>
      <MenuItem tone="danger" icon={<FiLogOut />} onClick={signOut}>
        Sign out
      </MenuItem>
    </Menu>
  );
}

export default function Topbar({ onMenuClick }) {
  return (
    <header className="rc-topbar">
      <div className="rc-topbar__left">
        <button
          type="button"
          className="rc-topbar__icon-btn rc-topbar__menu"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <FiMenu />
        </button>
        <GlobalSearch />
      </div>

      <div className="rc-topbar__right">
        <ThemeToggle className="rc-topbar__theme-toggle" />
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
