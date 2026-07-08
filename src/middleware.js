// =============================================================
// Route-protection middleware (NextAuth v5)
// -------------------------------------------------------------
// Lives in src/ because this project uses a src/ directory. Built from
// the EDGE-SAFE base config only (no DB imports) so it can run on the
// edge: it reads the session JWT and applies the `authorized` callback
// in auth.config.js. Unauthenticated users hitting a protected page are
// redirected to /login?callbackUrl=…; authenticated users on /login are
// bounced to /dashboard.
// =============================================================

import NextAuth from "next-auth";
import { authConfig } from "../auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  // The `authorized` callback in authConfig makes the allow/redirect
  // decision; nothing further is needed here.
  return;
});

export const config = {
  // Run on all page routes except Next internals, the auth API, and files
  // with an extension (images, fonts, etc.). API routes enforce their own auth.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
