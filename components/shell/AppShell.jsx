"use client";

// =============================================================
// AppShell — the authenticated frame: role-aware sidebar + topbar +
// breadcrumbs + page transitions, wrapping every module route.
// =============================================================

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "./SessionProvider";
import { canAccessPath } from "../../lib/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AppBreadcrumbs from "./AppBreadcrumbs";
import PageTransition from "./PageTransition";
import Unauthorized from "./Unauthorized";
import "./AppShell.scss";

function ShellFrame({ children }) {
  const { role, ready } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onMenuClick = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1024px)").matches
    ) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => !c);
    }
  };

  // Client-side guard (real server-side RBAC arrives with NextAuth).
  // Optimistic before the dev role is restored to avoid a flash.
  const blocked = ready && !canAccessPath(role, pathname);

  return (
    <div
      className={`rc-shell ${collapsed ? "rc-shell--collapsed" : ""}`}
      data-mobile-open={mobileOpen ? "true" : undefined}
    >
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div
          className="rc-shell__scrim"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="rc-shell__main">
        <Topbar onMenuClick={onMenuClick} />
        <div className="rc-shell__subbar">
          <AppBreadcrumbs />
        </div>
        <main className="rc-shell__content" id="main-content">
          <div className="rc-shell__content-inner">
            <PageTransition>
              {blocked ? <Unauthorized /> : children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <SessionProvider>
      <ShellFrame>{children}</ShellFrame>
    </SessionProvider>
  );
}
