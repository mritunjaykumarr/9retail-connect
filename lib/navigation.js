// =============================================================
// RetailConnect SIP — Navigation config (single source of truth)
// -------------------------------------------------------------
// Every authenticated route is declared here once, with the roles
// allowed to see it. The Sidebar renders from this (filtered by the
// current role), breadcrumbs derive their trail from it, and the
// shell's permission guard checks access against it. No route or nav
// item is hardcoded in a component.
//
// `roles` on a group is the default for its items; an item may narrow
// it further with its own `roles`. Groups/items with no `roles` are
// visible to everyone (e.g. Dashboard, account routes).
// =============================================================

import {
  FiGrid,
  FiActivity,
  FiMap,
  FiNavigation,
  FiCheckSquare,
  FiShoppingCart,
  FiTarget,
  FiPackage,
  FiTag,
  FiGift,
  FiTrendingUp,
  FiInbox,
  FiUpload,
  FiAlertTriangle,
  FiFileText,
  FiClipboard,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
  FiZap,
  FiAward,
  FiMapPin,
  FiCalendar,
  FiLayers,
  FiTruck,
  FiSliders,
  FiShield,
  FiDatabase,
  FiSmartphone,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { ROLES, ALL_ROLES } from "./roles";

const {
  SALES_OFFICER,
  AREA_MANAGER,
  REGIONAL,
  DISTRIBUTOR_ADMIN,
  MANAGEMENT,
  PLANT_HEAD,
  SYSTEM_ADMIN,
} = ROLES;

// ---- Primary navigation tree --------------------------------
export const NAV_GROUPS = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: FiGrid,
        description: "Your role-based home with the metrics that matter to you.",
      },
    ],
  },
  {
    id: "field",
    label: "Field Sales",
    roles: [SALES_OFFICER, SYSTEM_ADMIN],
    items: [
      {
        label: "Field App",
        href: "/field",
        icon: FiSmartphone,
        description:
          "The Field Sales App runs on mobile — beat routes, GPS check-in and offline order capture.",
      },
    ],
  },
  {
    id: "manager",
    label: "Manager Dashboard",
    roles: [AREA_MANAGER, REGIONAL, SYSTEM_ADMIN],
    items: [
      { label: "Overview", href: "/manager", icon: FiActivity, description: "Field performance at a glance for your area." },
      { label: "Live Field Map", href: "/manager/field-map", icon: FiMap, description: "Real-time positions of your Sales Officers." },
      { label: "Beat Designer", href: "/manager/beats", icon: FiNavigation, description: "Plan ordered retailer routes per SO per day." },
      { label: "Adherence Report", href: "/manager/adherence", icon: FiCheckSquare, description: "Planned vs actual beat coverage." },
      { label: "Secondary Sales", href: "/manager/secondary-sales", icon: FiShoppingCart, description: "Orders booked by your field team." },
      { label: "Targets", href: "/manager/targets", icon: FiTarget, description: "Progress against target gauges." },
      { label: "Demand Forecasting", href: "/manager/forecasting", roles: [AREA_MANAGER, REGIONAL, MANAGEMENT, SYSTEM_ADMIN], icon: FiTrendingUp, description: "AI demand forecasting & auto-targets." },
      { label: "Distributor Inventory", href: "/manager/inventory", icon: FiPackage, description: "Stock heatmap across your distributors." },
      { label: "Scheme Builder", href: "/manager/schemes", icon: FiTag, description: "Design trade schemes and offers." },
      { label: "Incentives", href: "/manager/incentives", icon: FiGift, description: "Build SO and retailer incentive plans." },
      { label: "Offer Performance", href: "/manager/offers", icon: FiTrendingUp, description: "Uplift and ROI on running offers." },
    ],
  },
  {
    id: "distributor",
    label: "Distributor Portal",
    roles: [DISTRIBUTOR_ADMIN, SYSTEM_ADMIN],
    items: [
      { label: "Order Inbox", href: "/distributor", icon: FiInbox, description: "Incoming secondary orders to fulfil." },
      { label: "Inventory", href: "/distributor/inventory", icon: FiPackage, description: "Stock on hand per SKU." },
      { label: "Sales Upload", href: "/distributor/sales-upload", icon: FiUpload, description: "Upload secondary sales with column-mapping." },
      { label: "Upload Errors", href: "/distributor/upload-errors", icon: FiAlertTriangle, description: "Validation issues from your last upload." },
      { label: "Stock Forecast", href: "/distributor/forecast", icon: FiTrendingUp, description: "Projected demand for replenishment." },
      { label: "Purchase Orders", href: "/distributor/purchase-orders", icon: FiFileText, description: "Place primary orders on the manufacturer." },
      { label: "Reconciliation", href: "/distributor/reconciliation", icon: FiClipboard, description: "Match primary invoices to receipts." },
    ],
  },
  {
    id: "management",
    label: "Management",
    roles: [MANAGEMENT, REGIONAL, SYSTEM_ADMIN],
    items: [
      { label: "Overview", href: "/management", icon: FiGrid, description: "National sales and distribution health." },
      { label: "Territory P&L", href: "/management/pnl", icon: FiDollarSign, description: "Profit-and-loss heatmap by territory." },
      { label: "Primary vs Secondary", href: "/management/primary-secondary", icon: FiBarChart2, description: "The gap between primary and secondary sales." },
      { label: "Distributor Matrix", href: "/management/distributors", icon: FiUsers, description: "Performance matrix across distributors." },
      { label: "SKU Velocity", href: "/management/sku-velocity", icon: FiZap, description: "How fast each SKU is moving." },
      { label: "SO Leaderboard", href: "/management/leaderboard", icon: FiAward, description: "Top Sales Officers nationally." },
      { label: "Forecast Accuracy", href: "/management/forecast-accuracy", icon: FiActivity, description: "How close forecasts landed to actuals." },
      { label: "Offer ROI", href: "/management/offer-roi", icon: FiTrendingUp, description: "Return on national offers and schemes." },
      { label: "Expansion Map", href: "/management/expansion", icon: FiMapPin, description: "White-space and expansion opportunities." },
      { label: "National Schemes", href: "/management/schemes", icon: FiTag, description: "All active schemes across regions." },
      { label: "Incentive Payouts", href: "/management/payouts", icon: FiDollarSign, description: "Summary of incentive payouts." },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    roles: [PLANT_HEAD, SYSTEM_ADMIN],
    items: [
      { label: "Demand Signal", href: "/manufacturing", icon: FiActivity, description: "Aggregated demand feeding the plant." },
      { label: "Production Schedule", href: "/manufacturing/schedule", icon: FiCalendar, description: "What to produce and when." },
      { label: "Raw Materials", href: "/manufacturing/materials", icon: FiLayers, description: "Material requirements from the plan." },
      { label: "Supplier Lead-Time", href: "/manufacturing/suppliers", icon: FiTruck, description: "Track supplier lead-times and risk." },
      { label: "Capacity vs Demand", href: "/manufacturing/capacity", icon: FiBarChart2, description: "Where capacity meets or misses demand." },
    ],
  },
  {
    id: "projections",
    label: "Projection Engine",
    roles: [MANAGEMENT, PLANT_HEAD, AREA_MANAGER, REGIONAL, SYSTEM_ADMIN],
    items: [
      { label: "Forecasts", href: "/projections", icon: FiTrendingUp, description: "Demand forecasts across SKUs and territories." },
      { label: "Auto Targets", href: "/projections/targets", icon: FiTarget, description: "Targets auto-generated from forecasts." },
      { label: "Manual Overrides", href: "/projections/overrides", icon: FiSliders, description: "Adjust forecasts with business judgement." },
      { label: "Accuracy (MAPE)", href: "/projections/accuracy", icon: FiActivity, description: "Track forecast error over time." },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    roles: [SYSTEM_ADMIN],
    items: [
      { label: "Overview", href: "/admin", icon: FiShield, description: "Platform administration home." },
      { label: "Users & Roles", href: "/admin/users", icon: FiUsers, description: "Manage users, roles and access." },
      { label: "Territories", href: "/admin/territories", icon: FiMapPin, description: "Territory hierarchy and mapping." },
      { label: "Master Data", href: "/admin/master-data", icon: FiDatabase, description: "Products, distributors and retailers." },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: FiFileText, description: "Before/after audit trail of changes." },
    ],
  },
];

// ---- Account routes (rendered separately, visible to everyone) ----
export const ACCOUNT_ITEMS = [
  { label: "Notifications", href: "/notifications", icon: FiBell, description: "Everything that needs your attention." },
  { label: "Settings", href: "/settings", icon: FiSettings, description: "Your account and preferences." },
];

// Non-nav routes that still need placeholder pages + breadcrumb labels.
export const EXTRA_ROUTES = [
  { label: "Search", href: "/search" },
  { label: "Access Denied", href: "/unauthorized" },
];

// ---- Helpers ------------------------------------------------
function groupRolesFor(group) {
  return group.roles || ALL_ROLES;
}

function itemRolesFor(group, item) {
  return item.roles || groupRolesFor(group);
}

/** Does `role` have access to a given item? */
function itemVisible(group, item, role) {
  return itemRolesFor(group, item).includes(role);
}

/** Nav groups (with items) visible to `role`, empty groups dropped. */
export function navForRole(role) {
  return NAV_GROUPS.map((group) => {
    const items = group.items.filter((item) => itemVisible(group, item, role));
    return items.length ? { ...group, items } : null;
  }).filter(Boolean);
}

/** Every item (flattened) plus the always-on account items. */
function allItems() {
  const fromGroups = NAV_GROUPS.flatMap((g) =>
    g.items.map((item) => ({ group: g, item }))
  );
  const fromAccount = ACCOUNT_ITEMS.map((item) => ({ group: null, item }));
  return [...fromGroups, ...fromAccount];
}

/** Find the nav item whose href best matches a pathname (longest prefix). */
export function findItemByPath(pathname) {
  let best = null;
  for (const entry of allItems()) {
    const href = entry.item.href;
    if (pathname === href || pathname.startsWith(href + "/")) {
      if (!best || href.length > best.item.href.length) best = entry;
    }
  }
  return best;
}

/** Can `role` access `pathname`? Account routes are open; unknown = allow. */
export function canAccessPath(role, pathname) {
  // Account + extra routes are available to any authenticated user.
  if (ACCOUNT_ITEMS.some((i) => pathname.startsWith(i.href))) return true;
  if (EXTRA_ROUTES.some((r) => pathname.startsWith(r.href))) return true;
  if (pathname === "/dashboard") return true;

  const match = findItemByPath(pathname);
  if (!match || !match.group) return true; // no rule declared → don't block
  return itemVisible(match.group, match.item, role);
}

/** Breadcrumb trail for a pathname: Home → [group] → item. */
export function crumbsForPath(pathname) {
  const crumbs = [{ label: "Home", href: "/dashboard" }];
  if (pathname === "/dashboard") return crumbs;

  const match = findItemByPath(pathname);
  if (match) {
    if (match.group && match.group.id !== "overview") {
      // Group label points at the group's first item (its landing route).
      const landing = match.group.items[0]?.href || match.item.href;
      crumbs.push({ label: match.group.label, href: landing });
    }
    if (match.item.href !== match.group?.items[0]?.href) {
      crumbs.push({ label: match.item.label, href: match.item.href });
    } else if (crumbs[crumbs.length - 1]?.href !== match.item.href) {
      crumbs.push({ label: match.item.label, href: match.item.href });
    }
    return crumbs;
  }

  const extra = EXTRA_ROUTES.find((r) => pathname.startsWith(r.href));
  const account = ACCOUNT_ITEMS.find((i) => pathname.startsWith(i.href));
  const leaf = extra || account;
  if (leaf) crumbs.push({ label: leaf.label, href: leaf.href });
  return crumbs;
}

/** Metadata (title/description/icon) for the current route, for placeholders. */
export function routeMeta(pathname) {
  const match = findItemByPath(pathname);
  if (match) {
    return {
      title: match.item.label,
      description: match.item.description,
      icon: match.item.icon,
      group: match.group?.label,
    };
  }
  const extra = EXTRA_ROUTES.find((r) => pathname.startsWith(r.href));
  if (extra) return { title: extra.label };
  return { title: "Page" };
}
