// =============================================================
// RetailConnect SIP — Roles (RBAC identity layer)
// -------------------------------------------------------------
// The 7 roles from docs/PROJECT.md §3. These string constants are
// the single source of truth for role identity across the shell,
// navigation config, and (later) the NextAuth session + server-side
// route guards. Never hardcode a role string elsewhere — import from
// here so a rename is one edit.
// =============================================================

export const ROLES = {
  SALES_OFFICER: "sales_officer",
  AREA_MANAGER: "area_manager",
  REGIONAL: "regional",
  DISTRIBUTOR_ADMIN: "distributor_admin",
  MANAGEMENT: "management",
  PLANT_HEAD: "plant_head",
  SYSTEM_ADMIN: "system_admin",
};

// Display order (used by the dev role switcher and any role list).
export const ROLE_ORDER = [
  ROLES.SALES_OFFICER,
  ROLES.AREA_MANAGER,
  ROLES.REGIONAL,
  ROLES.DISTRIBUTOR_ADMIN,
  ROLES.MANAGEMENT,
  ROLES.PLANT_HEAD,
  ROLES.SYSTEM_ADMIN,
];

// Human-facing metadata + the landing route each role lands on after login.
export const ROLE_META = {
  [ROLES.SALES_OFFICER]: {
    label: "Sales Officer",
    short: "SO",
    description: "Field sales — books orders on the mobile app.",
    home: "/field",
    platform: "mobile",
  },
  [ROLES.AREA_MANAGER]: {
    label: "Area Sales Manager",
    short: "ASM",
    description: "Designs beats, builds schemes, tracks the field.",
    home: "/manager",
    platform: "web",
  },
  [ROLES.REGIONAL]: {
    label: "Regional Manager",
    short: "RM",
    description: "Regional layer between area and national.",
    home: "/management",
    platform: "web",
  },
  [ROLES.DISTRIBUTOR_ADMIN]: {
    label: "Distributor Admin",
    short: "DA",
    description: "Fulfils orders and uploads secondary sales.",
    home: "/distributor",
    platform: "web",
  },
  [ROLES.MANAGEMENT]: {
    label: "Management",
    short: "GM",
    description: "GM / National Sales Head — national analytics.",
    home: "/management",
    platform: "web",
  },
  [ROLES.PLANT_HEAD]: {
    label: "Plant Head",
    short: "PH",
    description: "Manufacturing & supply planning.",
    home: "/manufacturing",
    platform: "web",
  },
  [ROLES.SYSTEM_ADMIN]: {
    label: "System Admin",
    short: "SA",
    description: "Full platform access and administration.",
    home: "/dashboard",
    platform: "web",
  },
};

export const ALL_ROLES = ROLE_ORDER;

// Roles that operate across ALL territories (no territory scoping). Every
// other role is scoped to its own territory. Used by the RBAC guard to
// decide whether to apply a territory filter. Kept here so it's the single
// source of truth for role classification (client + server).
export const NATIONAL_ROLES = [ROLES.SYSTEM_ADMIN, ROLES.MANAGEMENT];

export function isNationalRole(role) {
  return NATIONAL_ROLES.includes(role);
}

export function roleLabel(role) {
  return ROLE_META[role]?.label || "Unknown";
}

export function roleHome(role) {
  return ROLE_META[role]?.home || "/dashboard";
}
