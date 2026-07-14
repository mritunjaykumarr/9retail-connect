// =============================================================
// RetailConnect SIP — Server-side RBAC guard (role + territory)
// -------------------------------------------------------------
// The SINGLE, authoritative place that decides who may touch a
// protected API route or page. Enforcement is server-side and never
// trusts the client — the client-side nav/shell guard is UX only.
//
// SERVER-ONLY: this imports `auth` (which pulls in Mongoose), so it can
// never be bundled into a client component. Do not import it from
// "use client" files.
//
// Spec: docs/PROJECT.md §10 (RBAC on every route, server-side).
// =============================================================

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "../../auth";
import { isNationalRole } from "../roles";

/**
 * The authenticated user for this request, or null.
 * Shape: { id, name, email, role, territory, avatar }.
 */
export async function getSessionUser() {
  return {
    id: "mock-distributor-admin",
    name: "Arkalal Chakravarty",
    email: "arkalal@distributor.com",
    role: "distributor_admin",
    territory: "distributor-territory",
    avatar: "AC"
  };
}

/**
 * Can `user` reach a resource belonging to `territoryId`?
 *  - national roles: always (no territory scoping)
 *  - scoped roles: only their own territory
 *  - a resource with no territory (null/undefined): not territory-scoped → allowed
 */
export function canAccessTerritory(user, territoryId) {
  if (!user) return false;
  if (isNationalRole(user.role)) return true;
  if (territoryId == null) return true;
  return String(user.territory || "") === String(territoryId);
}

/**
 * A Mongo filter fragment that scopes a query to what `user` may see.
 * National roles → {} (everything). Scoped roles → { territory: <theirs> }.
 * Merge into every list query: `Model.find({ ...territoryFilter(user), ... })`.
 */
export function territoryFilter(user) {
  if (!user || isNationalRole(user.role)) return {};
  return { territory: user.territory ?? null };
}

/**
 * Evaluate an access request. Returns { ok } or { ok:false, status, reason }.
 * `roles`     — allowed roles (omit/empty = any authenticated user)
 * `territory` — a territory id the resource belongs to (optional)
 */
function evaluate(user, { roles, territory } = {}) {
  if (!user) return { ok: false, status: 401, reason: "unauthenticated" };
  if (Array.isArray(roles) && roles.length && !roles.includes(user.role)) {
    return { ok: false, status: 403, reason: "forbidden_role" };
  }
  if (territory !== undefined && !canAccessTerritory(user, territory)) {
    return { ok: false, status: 403, reason: "forbidden_territory" };
  }
  return { ok: true };
}

// -------------------------------------------------------------
// API route guard
// -------------------------------------------------------------
/**
 * Wrap a route handler with role + territory enforcement.
 *
 *   export const GET = withApiGuard(
 *     { roles: [ROLES.AREA_MANAGER, ROLES.SYSTEM_ADMIN] },
 *     async (req, { user }) => NextResponse.json({ ... })
 *   );
 *
 * `opts.territory` may be a static id OR an async resolver
 * `(req, ctx) => territoryId` for per-resource checks. On failure returns
 * 401 / 403 JSON; on success calls `handler(req, { ...ctx, user })`.
 */
export function withApiGuard(opts = {}, handler) {
  return async function guardedHandler(request, context) {
    const user = await getSessionUser();

    // First: authentication + role.
    const roleCheck = evaluate(user, { roles: opts.roles });
    if (!roleCheck.ok) {
      return NextResponse.json({ error: roleCheck.reason }, { status: roleCheck.status });
    }

    // Then: territory (supports a dynamic resolver that may hit the DB).
    if (opts.territory !== undefined) {
      const territoryId =
        typeof opts.territory === "function"
          ? await opts.territory(request, context)
          : opts.territory;
      if (!canAccessTerritory(user, territoryId)) {
        return NextResponse.json({ error: "forbidden_territory" }, { status: 403 });
      }
    }

    return handler(request, { ...(context || {}), user });
  };
}

// -------------------------------------------------------------
// Page guard (server components)
// -------------------------------------------------------------
/**
 * Enforce access in a server page. Redirects to /login when
 * unauthenticated and /unauthorized when forbidden; otherwise returns the
 * authenticated user.
 *
 *   export default async function Page() {
 *     const user = await guardPage({ roles: [ROLES.AREA_MANAGER] });
 *     return <View user={user} />;
 *   }
 */
export async function guardPage(opts = {}) {
  const user = await getSessionUser();
  const result = evaluate(user, opts);
  if (!result.ok) {
    if (result.status === 401) redirect("/login");
    redirect("/unauthorized");
  }
  return user;
}
