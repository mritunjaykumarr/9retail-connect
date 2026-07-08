"use client";

// =============================================================
// SessionProvider — the shell's identity source.
// -------------------------------------------------------------
// Sourced from the REAL NextAuth v5 session (name / email / role /
// avatar travel on the JWT — see auth.js). Keeps the same
// `useSession()` API the shell already consumes, so nothing downstream
// changed. A dev-only role switcher remains as a LOCAL preview override
// (persisted to localStorage) so the role-aware nav can be exercised
// across roles without seven logins; it never changes the real session
// and is cleared on sign-out.
// =============================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useSession as useNextAuthSession,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import { ROLES, ROLE_META, ROLE_ORDER } from "../../lib/roles";

// Legacy key from the pre-auth mock. We no longer persist a role override
// (it would mask the real authenticated role across sessions); we only
// clean up any stale value left behind.
const LEGACY_DEV_ROLE_KEY = "rc-dev-role";

// Sample territory labels per role — a display fallback until the
// Territory model + population land (session carries only the ref id).
const TERRITORY_SAMPLE = {
  [ROLES.SALES_OFFICER]: "Pune Zone 2",
  [ROLES.AREA_MANAGER]: "Maharashtra West",
  [ROLES.REGIONAL]: "West Region",
  [ROLES.DISTRIBUTOR_ADMIN]: "Pune — Kothrud",
  [ROLES.MANAGEMENT]: "National",
  [ROLES.PLANT_HEAD]: "Aurangabad Plant",
  [ROLES.SYSTEM_ADMIN]: "All Territories",
};

// DiceBear initials avatar (free for commercial use) as a fallback when
// the user has no avatarUrl.
function avatarFor(name = "User") {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundType=gradientLinear&fontWeight=600`;
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { data, status } = useNextAuthSession();
  // In-memory only preview override (never persisted) — resets to the real
  // role on every reload, so the authenticated role is always authoritative.
  const [previewRole, setPreviewRole] = useState(null);

  // One-time cleanup of the legacy persisted override from the mock era.
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_DEV_ROLE_KEY);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const sessionUser = data?.user || null;
  const realRole =
    sessionUser?.role && ROLE_ORDER.includes(sessionUser.role)
      ? sessionUser.role
      : ROLES.AREA_MANAGER;

  // The real authenticated role is the default; a preview override (from the
  // dev role switcher) only lasts for the current page session.
  const role = previewRole || realRole;

  const setRole = (next) => setPreviewRole(next);

  const name = sessionUser?.name || "Signed-in user";
  const user = {
    id: sessionUser?.id || role,
    role,
    name,
    title: ROLE_META[role]?.label || "User",
    territory: TERRITORY_SAMPLE[role] || "—",
    email: sessionUser?.email || "",
    avatar: sessionUser?.avatar || avatarFor(name),
  };

  const value = {
    ready: status !== "loading",
    role,
    setRole,
    roles: ROLE_ORDER,
    user,
    // End the real NextAuth session and return to /login.
    signOut: () => nextAuthSignOut({ callbackUrl: "/login" }),
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a <SessionProvider>");
  }
  return ctx;
}
