# RetailConnect SIP — Single Source of Truth & Design System (`brain.md`)

This document is the **authoritative Single Source of Truth (SSOT)** for all UI/UX design patterns, component architectures, styling tokens, page layouts, and development standards for the **RetailConnect SIP** platform.

> **GOLDEN RULE OF BUSINESS-DRIVEN DESIGN CONSISTENCY (NOT REPETITION):**  
> 1. **Reuse Design Tokens & Component Primitive System**: All pages MUST share the same visual design language, color tokens (`var(...)`), elevation layers, and UI component primitives (`Button`, `Badge`, `Drawer`, `Modal`, `Input`, `Select`, `StatCard`, `Table`, `Tabs`, `BarChart`, `Donut`, `Avatar`, `Chip`, `useToast`).  
> 2. **Page Layouts MUST be Business-Driven, NOT Template-Driven**:  
>    - **NO Mandatory Requirement for KPI Cards, Tables, or Charts**: If a table is not the best way to present information, DO NOT use one. If KPI cards do not add value, DO NOT include them. Choose the exact components that best communicate the data for that page.  
>    - **NO Formulaic Clones**: Developers must NEVER blindly duplicate a rigid "4 StatCards + Tabs + Table + Chart" structure across pages. Every screen must have its own purpose-built information architecture based on real user workflows.  
>    - **Domain-Specific Architectural Examples**:  
>      - **Capacity vs Demand**: Plant capacity utilization heatmaps, demand forecast vs production capacity comparison panels, production bottleneck alerts, shift allocation progress gauges, and AI production planning recommendation cards.  
>      - **Supplier Lead-Time**: Vendor SLA scorecards, risk radar cards, transit timeline cards, delay reason breakdowns, and vendor penalty drawer controls.  
>      - **Demand Signals**: Market demand rollups, BOM ingredient stockout alerts, and batch allocation wizards.  
> 3. **Goal**: Ensure 100% **design system consistency**, NOT **layout repetition or page duplication**.

---

## 1. Overall Design Philosophy & Principles

RetailConnect SIP is an enterprise-grade Sales Information Platform (SIP) built for FMCG manufacturers, regional managers, area sales managers, and distributors.

1. **Financial-Grade Precision**: Data, numbers, currencies, and timestamps must use tabular numerals (`font-family: var(--font-code)` / `.rc-tnum`) with exact, scannable formatting.
2. **Layered Elevation Model**: Low-contrast, clean surfaces (`--bg` → `--surface` → `--surface-raised` → `--surface-sunken`). Borders are subtle 1px hairlines (`var(--border)`).
3. **Intentional & Harmonious Color Palette**: Built on Cool Slate neutrals and rich Cobalt primary tones with strict semantic accents (Success Green, Warning Amber, Danger Red, Info Cyan).
4. **Business-Driven Information Architecture**: Page structures adapt dynamically to their specific business purpose and user workflow. Never repeat formulaic layouts when card grids, utilization heatmaps, timelines, recommendation panels, or custom metric cards communicate the data better.
5. **Zero Ad-Hoc Styling**: Developers must NEVER invent custom inline colors or duplicate CSS styles. Always consume semantic tokens and reusable components from `@/components/ui`.

---

## 2. Flexible Page Architecture Blueprint

Pages inherit the top header & filter toolbar for context, while the main content area adapts dynamically to the page's functional requirements.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. PAGE HEADER                                                          │
│  [Icon Box]  EYEBROW (Role Context [SIP])             [Header Actions]  │
│              Page Title                                (Action / Export)│
│              Page Description Subtitle                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. FILTER TOOLBAR (Contextual)                                          │
│  Primary Filter: [ All ▼ ]    Secondary Filter: [ Status ▼ ]            │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. BUSINESS-DRIVEN CONTENT COMPOSITION (Purpose-Built Layout)           │
│  - Capacity Utilization Cards / Demand vs Capacity Comparison Panel     │
│  - Bottleneck & Constraint Risk Alert Cards / Recommendation Engine     │
│  - Shift Allocation Progress Gauges / Custom Dynamic Components         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3. Design System Tokens & Foundations

### 3.1 Color Palette & Semantic Roles
Always reference CSS custom properties (`var(...)`) rather than hardcoded hex codes.

| Semantic Role | Light Mode CSS Variable | Dark Mode CSS Variable | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Page Background** | `var(--bg)` (`#f8fafc`) | `var(--bg)` (`#0a0f1c`) | Overall page canvas |
| **Card Surface** | `var(--surface)` (`#ffffff`) | `var(--surface)` (`#0f172a`) | Cards, toolbars, tables |
| **Sunken Surface** | `var(--surface-sunken)` (`#f8fafc`) | `var(--surface-sunken)` (`#1e293b`) | Inputs, table headers, list items |
| **Primary Accent** | `var(--primary)` (`#1f53e5`) | `var(--primary)` (`#3465f5`) | Primary buttons, active states |
| **Primary Soft** | `var(--primary-soft)` (`#ecf2ff`) | `var(--primary-soft)` (`#172f7a`) | Header icon bg, active tab bg |
| **Primary Text** | `var(--primary-text)` (`#1842c0`) | `var(--primary-text)` (`#8fb0ff`) | Highlighted text, links |
| **Text Primary** | `var(--text-1)` (`#0f172a`) | `var(--text-1)` (`#f8fafc`) | Headings, strong text |
| **Text Muted** | `var(--text-2)` (`#334155`) | `var(--text-2)` (`#cbd5e1`) | Subtitles, body copy |
| **Text Subtitle** | `var(--text-3)` (`#64748b`) | `var(--text-3)` (`#94a3b8`) | Captions, labels, timestamps |
| **Border Default** | `var(--border)` (`#e2e8f0`) | `var(--border)` (`#334155`) | Card & table borders |
| **Success** | `var(--success)` (`#0e9f6e`) | `var(--success)` (`#12b886`) | Positive trend, fulfilled status |
| **Warning** | `var(--warning)` (`#d97706`) | `var(--warning)` (`#f59e0b`) | Pending, behind schedule |
| **Danger** | `var(--danger)` (`#e02424`) | `var(--danger)` (`#f87171`) | Critical alerts, rejected, offline |

### 3.2 Typography & Stacks
- **Display Font**: `var(--font-display)` (Sora / System sans) — Used for `h1`, `h2`, `h3` titles.
- **UI Body Font**: `var(--font-ui)` (Plus Jakarta Sans / System sans) — Used for body, labels, buttons.
- **Monospace Font**: `var(--font-code)` (JetBrains Mono) — Used for currency, numbers, IDs (`.rc-tnum`, `.rc-mono`).

| Style | Variable | Size / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Page H2 Title** | `var(--text-h2)` | 24px / 700 | Main screen header title |
| **Section H3** | `var(--text-lg)` / `var(--text-base)` | 18px / 600 | Card & section headings |
| **Body Standard** | `var(--text-sm)` | 14px / 400 | General content, table cell text |
| **Caption / Meta** | `var(--text-caption)` | 12px / 500 | Eyebrows, timestamps, badges |

### 3.3 Border Radii
- `var(--radius-sm)`: 6px — Inputs, small buttons, chips.
- `var(--radius-md)`: 8px — Select inputs, standard buttons, badges.
- `var(--radius-lg)`: 12px — Cards, header icon box, filter toolbar, main sections.
- `var(--radius-pill)`: 9999px — Progress bar fills, rounded badges, avatars.

---

## 4. Reusable Component Inventory

All components **MUST** be imported from the central barrel:
```javascript
import {
  Button, Input, Select, Checkbox, Radio, Switch, Field,
  Badge, Chip, Avatar, Skeleton, Tooltip, Breadcrumbs,
  Card, CardHeader, CardBody, CardFooter, StatCard, Tabs, Modal, Drawer,
  EmptyState, Menu, MenuItem, Table, Sparkline, AreaChart, BarChart, Donut, useToast
} from "@/components/ui";
```

### Component Guidelines & Standards

| Component | Standard Usage Guidelines |
| :--- | :--- |
| **`StatCard`** | Top KPI summary tile. Must pass `label`, `value`, `delta`, `deltaLabel`, `deltaTone` (`"positive"|"negative"|"neutral"`), and `icon` (inside colored icon wrapper). |
| **`Table`** | Data table. Always provide structured `columns` array with `key`, `label`/`header`, `sortable`, `mono`, `align`, and custom `render`. Supports pagination & sorting. |
| **`Tabs`** | Navigation switch. Use `variant="segmented"` for main view toggles (`SO Quota Matrix` vs `Category Fulfillment`). |
| **`Button`** | Actions. `variant="primary"` (solid cobalt), `"outline"` (bordered), `"secondary"`, `"ghost"`. Pass `leadingIcon` for icons (e.g. `<FiDownload />`). |
| **`Badge`** | **Mandatory status pills in tables**. Must use `<Badge tone="..." variant="soft" dot>{text}</Badge>`. Renders uppercase text with circular status dot `•` and soft colored background tint. |
| **`Chip`** | Interactive filter / count tag only (e.g., `<Chip tone="primary">4 Active SOs</Chip>`). NEVER use `<Chip>` for table status cells. |
| **`Avatar`** | User profile avatar. Pass `src`, `fallback` initials, `size="sm"|"md"|"lg"`, and `avatarColor`. |
| **`AreaChart`** / **`BarChart`** | Trend visualization. Place inside `.chartCard`. Pass `labels`, `series` array, `height`. |
| **`Donut`** | Category distribution. Place inside `.chartCard`. Pass `data`, `colors`, `innerRadius={0.68}`, `centerLabel`, `centerSubLabel`. |
| **`Drawer`** | Side slide-over for viewing order/record deep-dive details. |
| **`Modal`** | Dialog popup for critical actions (e.g., Rejecting Order, Re-assigning Route). |
| **`useToast`** | System feedback hook (`toast({ title, description, tone: "info"|"success"|"danger" })`). |

### 4.1 Table Status Pill Specification (`<Badge />`)

All table status columns **MUST** use the `<Badge />` component with `variant="soft"` and `dot={true}`.

#### Code Pattern Example:
```javascript
{
  key: "status",
  header: "Status",
  align: "center",
  render: (val) => {
    // Map domain status strings to Badge tones:
    // "Fulfilled", "Accepted", "Delivered", "Healthy", "Overachieving" -> "success"
    // "Pending", "Low Stock", "Processing"                          -> "warning" (or "primary"/"info")
    // "Rejected", "Cancelled", "Critical", "Behind"                 -> "danger"
    // "In Transit", "On Track"                                      -> "primary" (or "info")
    const tone = 
      val === "Delivered" || val === "Accepted" || val === "Fulfilled" || val === "Healthy" || val === "Overachieving" ? "success" :
      val === "Pending" || val === "Low Stock" || val === "Low Stock Alert" ? "warning" :
      val === "Rejected" || val === "Cancelled" || val === "Critical" || val === "Behind" ? "danger" :
      "primary";

    return (
      <Badge tone={tone} variant="soft" dot>
        {val}
      </Badge>
    );
  }
}
```

#### Visual Result & Row Height Rules:
- **`tone="success"`**: `• DELIVERED` / `• ACCEPTED` / `• OVERACHIEVING` (Soft green background, dark green text & dot)
- **`tone="warning"`**: `• PENDING` / `• LOW STOCK` (Soft amber background, dark amber text & dot)
- **`tone="danger"`**: `• REJECTED` / `• CRITICAL` / `• BEHIND` (Soft red background, dark red text & dot)
- **`tone="primary"`**: `• IN TRANSIT` / `• ON TRACK` (Soft cobalt background, dark cobalt text & dot)
- **Uniform 52px Row Height**: All custom table cell wrappers (`.soMeta`, `.performerMeta`, `.planMeta`, `.skuMeta`) MUST apply `white-space: nowrap` to `strong` and `span` tags with appropriate `min-width` to prevent multi-line word wrapping and maintain clean, single-line 52px table rows.

---

## 5. Standard Page Implementation Blueprint

Every new page consists of a `page.js` file and a `page.module.scss` file.

### 5.1 Standard `page.js` Template

```javascript
"use client";

import React, { useState, useMemo } from "react";
import {
  FiTarget, FiSearch, FiDownload, FiFilter,
  FiTrendingUp, FiCheckCircle, FiActivity
} from "react-icons/fi";
import {
  StatCard, Table, Avatar, Chip, Button, Tabs, Badge, useToast
} from "@/components/ui";
import AreaChart from "@/components/ui/Chart/AreaChart";
import styles from "./page.module.scss";

export default function StandardModulePage() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const { toast } = useToast();

  const handleExport = () => {
    toast?.({
      title: "Report Downloaded",
      description: "Data successfully exported to CSV.",
      tone: "success",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Name & Zone",
      sortable: true,
      render: (_, row) => (
        <div className={styles.soMeta}>
          <Avatar src={row.avatar} size="md" fallback={row.initials} />
          <div>
            <strong>{row.name}</strong>
            <span>{row.zone}</span>
          </div>
        </div>
      ),
    },
    { key: "target", label: "Target", render: (val) => <strong>{val}</strong> },
    { key: "achieved", label: "Achieved", render: (val) => <strong>{val}</strong> },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <Chip tone={val === "Active" ? "success" : "warning"}>{val}</Chip>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* 1. Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.pageHeaderIcon} aria-hidden="true">
            <FiTarget />
          </span>
          <div className={styles.titleContent}>
            <div className={styles.eyebrow}>
              <span>Manager Dashboard</span>
              <span className="rc-logo__badge" style={{ marginLeft: "var(--space-2)" }}>SIP</span>
            </div>
            <h2>Screen Module Title</h2>
            <p className={styles.subtitle}>
              Clear, single-sentence explanation of what this page monitors and allows the user to perform.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" leadingIcon={<FiDownload />} onClick={handleExport}>
            Export Module Data
          </Button>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.filterGroup}>
            <label>Territory Zone:</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Zones</option>
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Status Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. KPI StatCards Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Primary Metric"
          value="₹48.25L"
          delta={14.2}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiTarget color="var(--primary)" />}
        />
        <StatCard
          label="Secondary Metric"
          value="1,842"
          delta={8.5}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiTrendingUp color="var(--success)" />}
        />
        <StatCard
          label="Performance SLA"
          value="94.8%"
          delta={2.1}
          deltaLabel="vs target SLA"
          deltaTone="positive"
          icon={<FiCheckCircle color="var(--success)" />}
        />
        <StatCard
          label="Average Unit Rate"
          value="₹2,620"
          delta={5.3}
          deltaLabel="vs last month"
          deltaTone="positive"
          icon={<FiActivity color="var(--primary)" />}
        />
      </div>

      {/* 4. Segmented Navigation Tabs */}
      <Tabs
        items={[
          { value: "tab1", label: "Primary Log View" },
          { value: "tab2", label: "Performance Matrix" },
        ]}
        value={activeTab}
        onChange={setActiveTab}
        variant="segmented"
      />

      {/* 5. Main Content Grid */}
      <div className={styles.mainLayout}>
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>Main Data Records</h3>
            <div className={styles.sectionControls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch />
              </div>
            </div>
          </div>
          <Table data={[]} columns={columns} emptyMessage="No records found." />
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>12-Week Analytics Trend</h3>
          </div>
          <AreaChart labels={["W1", "W2", "W3"]} series={[]} height={280} />
        </div>
      </div>
    </div>
  );
}
```

### 5.2 Standard `page.module.scss` Template

```scss
@use "@/styles/mixins" as *;

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--space-5);
  padding-bottom: var(--space-8);
  overflow-y: auto;
  @include custom-scrollbar;
}

/* Page Header */
.header {
  @include flex-between;
  gap: var(--space-4);
  flex-shrink: 0;
}

.headerTitle {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);

  .pageHeaderIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: var(--radius-lg);
    background: var(--primary-soft);
    color: var(--primary-text);
    font-size: 1.5rem;
    line-height: 0;
  }

  .titleContent {
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-family: var(--font-display);
    font-size: var(--text-h2);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
    color: var(--text-1);
    line-height: 1.2;
    margin-top: 0;
  }

  p {
    margin-top: var(--space-1);
    max-width: 65ch;
    font-size: var(--text-sm);
    color: var(--text-2);
    line-height: 1.5;
  }
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--space-1);
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--text-3);
}

.headerActions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

/* Filter Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.toolbarLeft {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.filterGroup {
  display: flex;
  align-items: center;
  gap: var(--space-2);

  label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-2);
    white-space: nowrap;
  }
}

.selectInput {
  height: 34px;
  padding: 0 var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  color: var(--text-1);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: var(--primary);
  }
}

/* Stats Grid */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

/* Main Layout */
.mainLayout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-4);

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.tableSection {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  .sectionHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-1);
    }
  }

  .sectionControls {
    display: flex;
    gap: var(--space-3);
    align-items: center;

    .searchBox {
      position: relative;
      input {
        height: 36px;
        padding-left: 36px;
        padding-right: var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface-sunken);
        font-size: var(--text-sm);
        color: var(--text-1);
        width: 260px;
        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
      svg {
        position: absolute;
        left: 12px;
        top: 10px;
        color: var(--text-3);
      }
    }
  }
}

.chartCard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-height: 380px;

  .chartHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: var(--text-base);
      font-weight: 600;
      color: var(--text-1);
    }
  }
}

.soMeta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  strong {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-1);
    font-weight: 600;
  }
  span {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-3);
  }
}
```

---

## 6. Accessibility, Responsiveness & Micro-Interactions

### 6.1 Responsiveness Rules
- **Desktop (> 1100px)**: 2-column layout (`2fr 1fr`). 4-card KPI grid. Filter toolbar on 1 horizontal row.
- **Tablet (768px – 1100px)**: Main layout stacks vertically to 1 column. 2-column KPI statcards.
- **Mobile (< 768px)**: Filter toolbar stacks vertically. Search boxes take 100% width. Tables scroll horizontally inside `.rc-table-scroll`.

### 6.2 Accessibility (a11y)
- **Focus Rings**: All interactive elements rely on standard keyboard focus ring (`:focus-visible`).
- **Icons**: Icons without text labels MUST have `aria-label` or `aria-hidden="true"`.
- **Semantic Tags**: Use `<button>`, `<input>`, `<select>`, `<table font>`, `<h3>` in logical order.

### 6.3 Micro-Interactions & Animations
- **Transitions**: Smooth property transitions (`transition: var(--duration-fast) var(--ease-standard)`).
- **Progress Fill**: Smooth width animations on bar charts & attainment bars (`transition: width 0.4s ease`).
- **Scrollbars**: Custom themed scrollbars (`@include custom-scrollbar`).

---

## 7. Pre-Development Developer Checklist

Before submitting or approving ANY new screen code, verify each item on this checklist:

- [ ] **1. Header Consistency**: Does the header include the icon box, eyebrow with `SIP` badge, `h2`, subtitle, and top-right action button?
- [ ] **2. Filter Toolbar**: Is there a `.toolbar` card with `.filterGroup` select inputs using `styles.selectInput`?
- [ ] **3. KPI StatCards**: Are there 4 `StatCard` items using standard props (`label`, `value`, `delta`, `deltaLabel`, `deltaTone`, `icon`)?
- [ ] **4. Segmented Navigation**: Are view switches using `<Tabs variant="segmented" />`?
- [ ] **5. Main Layout**: Is the content structured as `.mainLayout` (2fr : 1fr) with `.tableSection` on the left and `.chartCard` on the right?
- [ ] **6. Search Input**: Is the table search box placed inside `.sectionControls` in the table header with absolute positioned `<FiSearch />`?
- [ ] **7. Reusable Component Barrel**: Are all UI elements imported exclusively from `@/components/ui`?
- [ ] **8. Design System Tokens**: Are all CSS rules referencing `var(--surface)`, `var(--border)`, `var(--primary)`, `var(--text-1)`, etc., with ZERO hardcoded colors?
- [ ] **9. Code Execution**: Does the dev server compile clean without missing module errors (`react-icons/fi`)?
- [ ] **10. Zero Layout Deviations**: Does the screen look indistinguishable from existing modules like `Secondary Sales Analytics`?

---
*This file is maintained as the core project specification for RetailConnect SIP.*
