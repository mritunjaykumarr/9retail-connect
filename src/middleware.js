// =============================================================
// Route-protection middleware — BYPASSED for frontend prototype
// -------------------------------------------------------------
// Original middleware used NextAuth to enforce authentication.
// Disabled to allow the frontend to render without a backend.
// =============================================================

export default function middleware() {
  // No-op: allow all routes without authentication
}

export const config = {
  matcher: [],
};
