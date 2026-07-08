"use client";

// Thin client wrapper around NextAuth's SessionProvider so the whole app
// (shell, login, everything) can read the real session via useSession().
import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({ children }) {
  // refetchInterval keeps the sliding session fresh without a hard reload.
  return <SessionProvider refetchOnWindowFocus>{children}</SessionProvider>;
}
