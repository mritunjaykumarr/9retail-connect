// =============================================================
// GET /api/manager/summary  — EXAMPLE protected API route
// -------------------------------------------------------------
// Demonstrates the reusable RBAC guard: role-gated to the manager roles,
// and territory-scoped via territoryFilter(user). National roles see all
// territories; scoped roles are limited to their own. Enforcement is
// entirely server-side.
// =============================================================

import { NextResponse } from "next/server";
import { withApiGuard, territoryFilter } from "../../../../../lib/auth/guard";
import { isNationalRole, ROLES } from "../../../../../lib/roles";

export const GET = withApiGuard(
  { roles: [ROLES.AREA_MANAGER, ROLES.REGIONAL, ROLES.SYSTEM_ADMIN] },
  async (_request, { user }) => {
    // The filter you'd merge into any real query, e.g.
    //   Order.find({ ...scope, ... })
    const scope = territoryFilter(user);
    const national = isNationalRole(user.role);

    // No Orders collection yet — return a scope-aware summary so the guard
    // is demonstrably enforced end-to-end. When real data lands, swap this
    // for `await Order.find({ ...scope })` etc.
    return NextResponse.json({
      viewer: { role: user.role, territory: user.territory },
      scope: national ? "national" : "territory",
      // The exact query fragment applied server-side for this viewer.
      appliedFilter: scope,
      metrics: {
        secondarySales: national ? 4820000 : 612000,
        productiveCalls: national ? 18240 : 2160,
        beatAdherence: national ? 0.91 : 0.88,
      },
    });
  }
);
