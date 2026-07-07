// Demo tokens + FMCG-flavoured sample data for the style guide.

export const primaryRamp = [
  { step: "50", hex: "#ECF2FF", use: "Tint backgrounds" },
  { step: "100", hex: "#DBE6FF", use: "Soft fills, hover" },
  { step: "200", hex: "#BCD0FF", use: "Borders on soft" },
  { step: "300", hex: "#8FB0FF" },
  { step: "400", hex: "#5B87FF" },
  { step: "500", hex: "#3465F5", use: "Primary (dark UI)" },
  { step: "600", hex: "#1F53E5", use: "Primary action" },
  { step: "700", hex: "#1842C0", use: "Hover / pressed" },
  { step: "800", hex: "#17389B" },
  { step: "900", hex: "#172F7A", use: "Text on tint" },
];

export const neutralRamp = [
  { step: "0", hex: "#FFFFFF", use: "Surface" },
  { step: "50", hex: "#F8FAFC", use: "App background" },
  { step: "100", hex: "#F1F5F9", use: "Sunken / hover" },
  { step: "200", hex: "#E2E8F0", use: "Border" },
  { step: "300", hex: "#CBD5E1", use: "Border strong" },
  { step: "400", hex: "#94A3B8", use: "Placeholder" },
  { step: "500", hex: "#64748B", use: "Muted text" },
  { step: "600", hex: "#475569" },
  { step: "700", hex: "#334155", use: "Body text" },
  { step: "800", hex: "#1E293B" },
  { step: "900", hex: "#0F172A", use: "Headings" },
  { step: "950", hex: "#0A0F1C", use: "Dark canvas" },
];

export const semanticColors = [
  { name: "Success", token: "--success", hex: "#0E9F6E", desc: "Sell-through, on-target" },
  { name: "Warning", token: "--warning", hex: "#F5A524", desc: "At-risk, needs attention" },
  { name: "Danger", token: "--danger", hex: "#E5484D", desc: "Off-target, errors" },
  { name: "Info", token: "--info", hex: "#0EA5E9", desc: "Neutral information" },
];

export const vizColors = [
  { name: "Cobalt", token: "--viz-1", hex: "#1F53E5" },
  { name: "Teal", token: "--viz-2", hex: "#0EA5A4" },
  { name: "Amber", token: "--viz-3", hex: "#F5A524" },
  { name: "Violet", token: "--viz-4", hex: "#7C5CFC" },
  { name: "Emerald", token: "--viz-5", hex: "#0E9F6E" },
  { name: "Rose", token: "--viz-6", hex: "#E5484D" },
  { name: "Sky", token: "--viz-7", hex: "#0EA5E9" },
  { name: "Slate", token: "--viz-8", hex: "#64748B" },
];

export const typeScale = [
  { name: "Display 2XL", cls: "sg-t-d2xl", meta: "Sora · 700 · fluid 40–56", sample: "Secondary sales" },
  { name: "Display XL", cls: "sg-t-dxl", meta: "Sora · 700 · fluid 32–44", sample: "Distributor network" },
  { name: "Heading 1", cls: "sg-t-h1", meta: "Sora · 600 · 32", sample: "National overview" },
  { name: "Heading 2", cls: "sg-t-h2", meta: "Sora · 600 · 24", sample: "Beat performance" },
  { name: "Heading 3", cls: "sg-t-h3", meta: "Sora · 600 · 20", sample: "Scheme uplift" },
  { name: "Body Large", cls: "sg-t-lg", meta: "Jakarta · 400 · 17", sample: "Sales officers booked 12,480 GPS-verified orders today." },
  { name: "Body", cls: "sg-t-base", meta: "Jakarta · 400 · 16", sample: "Sales officers booked 12,480 GPS-verified orders today." },
  { name: "Caption", cls: "sg-t-cap", meta: "Jakarta · 500 · 13", sample: "Updated 4 minutes ago · North zone" },
  { name: "Overline", cls: "sg-t-over", meta: "Jakarta · 600 · 11 · tracked", sample: "PRIMARY VS SECONDARY" },
];

export const spacingScale = [
  { name: "space-1", px: 4 },
  { name: "space-2", px: 8 },
  { name: "space-3", px: 12 },
  { name: "space-4", px: 16 },
  { name: "space-6", px: 24 },
  { name: "space-8", px: 32 },
  { name: "space-12", px: 48 },
  { name: "space-16", px: 64 },
];

export const radiusScale = [
  { name: "xs", px: 4 },
  { name: "sm", px: 6 },
  { name: "md", px: 8 },
  { name: "lg", px: 12 },
  { name: "xl", px: 16 },
  { name: "pill", px: 999 },
];

export const elevationScale = [
  { name: "shadow-xs", token: "--shadow-xs", use: "Buttons, inputs" },
  { name: "shadow-sm", token: "--shadow-sm", use: "Raised chips" },
  { name: "shadow-md", token: "--shadow-md", use: "Raised cards" },
  { name: "shadow-lg", token: "--shadow-lg", use: "Popovers, toasts" },
  { name: "shadow-xl", token: "--shadow-xl", use: "Modals, drawers" },
];

export const motionTokens = [
  { name: "fast", val: "120ms", use: "Hover, press" },
  { name: "base", val: "200ms", use: "Toggles, tabs" },
  { name: "slow", val: "320ms", use: "Overlays, drawers" },
];

// Distributor performance rows (secondary sales in ₹ lakh).
export const distributors = [
  { id: "D-104", name: "Sunrise Traders", region: "North", secondary: 42.8, target: 108, orders: 1284, status: "On track", trend: [28, 31, 30, 34, 38, 41, 43] },
  { id: "D-118", name: "Metro Distribution Co.", region: "West", secondary: 38.1, target: 96, orders: 1102, status: "On track", trend: [40, 39, 37, 36, 35, 37, 38] },
  { id: "D-092", name: "Anand Super Stockist", region: "West", secondary: 21.4, target: 71, orders: 640, status: "At risk", trend: [30, 28, 27, 25, 23, 22, 21] },
  { id: "D-141", name: "Coastal FMCG Partners", region: "South", secondary: 55.6, target: 121, orders: 1560, status: "On track", trend: [44, 46, 48, 50, 52, 54, 56] },
  { id: "D-077", name: "Northgate Wholesale", region: "North", secondary: 12.9, target: 48, orders: 388, status: "Off target", trend: [26, 24, 21, 19, 17, 15, 13] },
  { id: "D-153", name: "Deccan Retail Supply", region: "South", secondary: 33.2, target: 88, orders: 970, status: "On track", trend: [29, 30, 31, 30, 32, 33, 33] },
  { id: "D-165", name: "Prime Bazaar Depot", region: "East", secondary: 27.7, target: 79, orders: 812, status: "At risk", trend: [34, 33, 31, 30, 29, 28, 28] },
  { id: "D-188", name: "Unity Distributors", region: "East", secondary: 46.0, target: 112, orders: 1348, status: "On track", trend: [38, 40, 41, 43, 44, 45, 46] },
];

export const salesTrend = {
  categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  series: [
    { name: "Primary", data: [62, 58, 71, 66, 78, 84, 74] },
    { name: "Secondary", data: [48, 52, 55, 61, 64, 69, 72] },
  ],
};

export const regionSales = {
  categories: ["North", "South", "East", "West"],
  series: [{ name: "Secondary sales", data: [96, 122, 74, 108] }],
};

export const skuMix = [
  { label: "Biscuits", value: 42 },
  { label: "Beverages", value: 28 },
  { label: "Snacks", value: 18 },
  { label: "Confectionery", value: 12 },
];
