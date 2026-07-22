"use client";

// =============================================================
// SessionProvider — MOCK for frontend prototype
// -------------------------------------------------------------
// Provides a hardcoded distributor-admin session so the shell
// renders without NextAuth or any backend.
// =============================================================

import React, { createContext, useContext, useState } from "react";
import { ROLES, ROLE_META, ROLE_ORDER } from "../../lib/roles";

// Sample territory labels per role — display fallback.
const TERRITORY_SAMPLE = {
  [ROLES.SALES_OFFICER]: "Pune Zone 2",
  [ROLES.AREA_MANAGER]: "Maharashtra West",
  [ROLES.REGIONAL]: "West Region",
  [ROLES.DISTRIBUTOR_ADMIN]: "Pune — Kothrud",
  [ROLES.MANAGEMENT]: "National",
  [ROLES.PLANT_HEAD]: "Aurangabad Plant",
  [ROLES.SYSTEM_ADMIN]: "All Territories",
};

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [previewRole, setPreviewRole] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  const sessionUser = {
    id: "mock-distributor-admin",
    name: "Arkalal Chakravarty",
    email: "arkalal@distributor.com",
    role: ROLES.DISTRIBUTOR_ADMIN,
    territory: "distributor-territory",
    avatar:
      "https://api.dicebear.com/9.x/initials/svg?seed=AC&backgroundType=gradientLinear&fontWeight=600",
  };
  const realRole = ROLES.DISTRIBUTOR_ADMIN;
  const role = previewRole || realRole;

  const setRole = (next) => setPreviewRole(next);

  const name = sessionUser.name;
  const user = {
    id: sessionUser.id,
    role,
    name,
    title: ROLE_META[role]?.label || "User",
    territory: TERRITORY_SAMPLE[role] || "—",
    email: sessionUser.email,
    avatar: userAvatar || sessionUser.avatar,
  };

  const value = {
    ready: true, // Always ready — no auth to wait for
    role,
    setRole,
    roles: ROLE_ORDER,
    user,
    updateAvatar: (url) => setUserAvatar(url),
    signOut: () => {
      // No-op in prototype mode
      console.log("Sign out bypassed in prototype mode");
    },
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
