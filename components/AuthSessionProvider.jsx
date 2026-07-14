"use client";

// =============================================================
// AuthSessionProvider — BYPASSED for frontend prototype
// -------------------------------------------------------------
// Original used NextAuth's SessionProvider which requires a
// backend /api/auth endpoint. Replaced with a simple passthrough
// so the app renders without any backend dependencies.
// =============================================================

export default function AuthSessionProvider({ children }) {
  return <>{children}</>;
}
