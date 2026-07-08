// EXAMPLE protected page — guarded server-side by role + territory.
// Manager roles only; forbidden roles are redirected to /unauthorized.
import { guardPage } from "../../../../lib/auth/guard";
import { isNationalRole, ROLES } from "../../../../lib/roles";
import ManagerOverview from "../../../../components/manager/ManagerOverview";

export const metadata = {
  title: "Manager Overview · RetailConnect SIP",
};

export default async function ManagerPage() {
  // Authoritative, server-side gate. Returns the user or redirects.
  const user = await guardPage({
    roles: [ROLES.AREA_MANAGER, ROLES.REGIONAL, ROLES.SYSTEM_ADMIN],
  });

  // Data is scoped to the viewer: national roles see everything, scoped
  // roles see only their territory. (Demo figures until the Orders
  // collection exists; the scope decision is real.)
  const national = isNationalRole(user.role);
  const summary = {
    national,
    territory: user.territory,
    metrics: national
      ? { secondarySales: 4820000, productiveCalls: 18240, beatAdherence: 0.91 }
      : { secondarySales: 612000, productiveCalls: 2160, beatAdherence: 0.88 },
  };

  return <ManagerOverview user={user} summary={summary} />;
}
