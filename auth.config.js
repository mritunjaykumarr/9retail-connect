// =============================================================
// RetailConnect SIP — Auth.js (NextAuth v5) base config
// -------------------------------------------------------------
// EDGE-SAFE. This file must not import Node-only code (mongoose,
// bcrypt) so it can power the route-protection middleware, which runs
// on the edge and only ever DECODES the session JWT. The Credentials
// provider (which touches the DB) lives in auth.js, used by the Node
// route handler at /api/auth.
//
// Spec: docs/PROJECT.md §10 (short-lived sessions, RBAC on every route).
// =============================================================

// Routes reachable without a session.
const PUBLIC_PREFIXES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/style-guide",
];

function isPublic(pathname) {
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  // Short-lived, sliding sessions: a 30-minute JWT that refreshes at most
  // every 5 minutes of activity. Signing out or 30 min of inactivity ends it.
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 5 * 60, // slide the expiry at most every 5 minutes
  },
  providers: [], // real providers are added in auth.js (Node runtime)
  callbacks: {
    // Runs in middleware for every matched request. Returning false sends the
    // user to `pages.signIn` (with a callbackUrl); a Response redirects.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (isPublic(pathname)) {
        // Bounce already-authenticated users away from the login screen.
        if (isLoggedIn && (pathname === "/login" || pathname.startsWith("/login/"))) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Everything else requires a session.
      return isLoggedIn;
    },
  },
};
