"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiPackage,
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiPlus,
  FiDownload,
  FiSearch,
  FiArrowRight,
  FiMapPin,
  FiCopy,
  FiCheck,
  FiHome,
  FiChevronRight,
  FiInbox,
  FiAlertTriangle,
  FiSliders,
  FiLayers,
  FiGrid,
  FiDroplet,
  FiType,
  FiBox,
} from "react-icons/fi";

import {
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  Checkbox,
  Radio,
  Badge,
  Chip,
  Avatar,
  AvatarGroup,
  Skeleton,
  Tooltip,
  Breadcrumbs,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  Tabs,
  Modal,
  Drawer,
  EmptyState,
  Table,
  Sparkline,
  AreaChart,
  BarChart,
  Donut,
  ThemeToggle,
  useToast,
} from "../ui";

import {
  primaryRamp,
  neutralRamp,
  semanticColors,
  vizColors,
  typeScale,
  spacingScale,
  radiusScale,
  elevationScale,
  motionTokens,
  distributors,
  salesTrend,
  regionSales,
  skuMix,
} from "./data";
import "./StyleGuide.scss";

const NAV = [
  {
    group: "Foundations",
    items: [
      { id: "colors", label: "Color", icon: <FiDroplet /> },
      { id: "typography", label: "Typography", icon: <FiType /> },
      { id: "space", label: "Space & Radius", icon: <FiGrid /> },
      { id: "elevation", label: "Elevation & Motion", icon: <FiLayers /> },
    ],
  },
  {
    group: "Components",
    items: [
      { id: "buttons", label: "Buttons", icon: <FiBox /> },
      { id: "forms", label: "Form controls", icon: <FiSliders /> },
      { id: "status", label: "Badges & Chips", icon: <FiPackage /> },
      { id: "people", label: "Avatars & Tabs", icon: <FiUsers /> },
      { id: "data", label: "Data table", icon: <FiGrid /> },
      { id: "charts", label: "Charts", icon: <FiTrendingUp /> },
      { id: "overlays", label: "Overlays", icon: <FiLayers /> },
      { id: "feedback", label: "Feedback & Empty", icon: <FiInbox /> },
    ],
  },
  {
    group: "Patterns",
    items: [{ id: "dashboard", label: "In context", icon: <FiHome /> }],
  },
];

const flatNav = NAV.flatMap((g) => g.items);

function statusTone(s) {
  return s === "On track" ? "success" : s === "At risk" ? "warning" : "danger";
}

function Swatch({ hex, token, name, use, step }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <button className="sg-swatch" onClick={copy} title={`Copy ${hex}`}>
      <span className="sg-swatch__chip" style={{ background: hex }}>
        <span className="sg-swatch__copy">{copied ? <FiCheck /> : <FiCopy />}</span>
      </span>
      <span className="sg-swatch__meta">
        <span className="sg-swatch__name">{name || step}</span>
        <span className="sg-swatch__hex">{token || hex}</span>
        {use && <span className="sg-swatch__use">{use}</span>}
      </span>
    </button>
  );
}

function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="sg-section">
      <header className="sg-section__head">
        {eyebrow && <span className="sg-section__eyebrow">{eyebrow}</span>}
        <h2 className="sg-section__title">{title}</h2>
        {description && <p className="sg-section__desc">{description}</p>}
      </header>
      {children}
    </section>
  );
}

function Demo({ title, children, className = "" }) {
  return (
    <div className={`sg-demo ${className}`.trim()}>
      {title && <span className="sg-demo__label">{title}</span>}
      <div className="sg-demo__stage">{children}</div>
    </div>
  );
}

export default function StyleGuide() {
  const toast = useToast();
  const [active, setActive] = useState("colors");
  const [navOpen, setNavOpen] = useState(false);

  // interactive demo state
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [segTab, setSegTab] = useState("week");
  const [chips, setChips] = useState(["North", "West"]);
  const [tableLoading, setTableLoading] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);

  const observerRef = useRef(null);

  // Scrollspy
  useEffect(() => {
    const opts = { rootMargin: "-45% 0px -50% 0px", threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, opts);
    flatNav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    observerRef.current = obs;
    return () => obs.disconnect();
  }, []);

  const goTo = (id) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleChip = (region) =>
    setChips((c) =>
      c.includes(region) ? c.filter((r) => r !== region) : [...c, region]
    );

  const runTableLoading = () => {
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 1600);
  };

  const columns = [
    {
      key: "name",
      header: "Distributor",
      sortable: true,
      render: (v, row) => (
        <div className="sg-cell-dist">
          <Avatar name={row.name} size="sm" shape="rounded" />
          <div>
            <span className="sg-cell-dist__name">{v}</span>
            <span className="sg-cell-dist__id rc-mono">{row.id}</span>
          </div>
        </div>
      ),
    },
    { key: "region", header: "Region", sortable: true },
    { key: "orders", header: "Orders", align: "right", mono: true, sortable: true },
    {
      key: "secondary",
      header: "Secondary ₹L",
      align: "right",
      mono: true,
      sortable: true,
      render: (v) => v.toFixed(1),
    },
    {
      key: "trend",
      header: "7-day",
      render: (v, row) => (
        <div className="sg-cell-spark">
          <Sparkline
            data={v}
            height={28}
            color={
              row.status === "Off target"
                ? "var(--danger)"
                : row.status === "At risk"
                ? "var(--warning)"
                : "var(--viz-2)"
            }
          />
        </div>
      ),
    },
    {
      key: "target",
      header: "Target",
      align: "right",
      sortable: true,
      render: (v) => (
        <span className="sg-target">
          <span className="rc-mono">{v}%</span>
          <span className="sg-target__bar">
            <span
              className="sg-target__fill"
              style={{
                width: `${Math.min(100, v)}%`,
                background:
                  v >= 100 ? "var(--success)" : v >= 70 ? "var(--warning)" : "var(--danger)",
              }}
            />
          </span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <Badge tone={statusTone(v)} dot>
          {v}
        </Badge>
      ),
    },
  ];

  return (
    <div className="sg">
      {/* ---------- Top bar ---------- */}
      <header className="sg-topbar">
        <div className="sg-topbar__inner">
          <div className="sg-brand">
            <span className="sg-brand__mark" aria-hidden="true">
              <FiPackage />
            </span>
            <span className="sg-brand__text">
              <span className="sg-brand__name">RetailConnect SIP</span>
              <span className="sg-brand__tag">Design System</span>
            </span>
          </div>
          <div className="sg-topbar__right">
            <Badge tone="primary" variant="soft" size="sm">
              v1.0
            </Badge>
            <ThemeToggle />
            <button
              className="sg-topbar__menu"
              onClick={() => setNavOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              <FiSliders />
            </button>
          </div>
        </div>
      </header>

      <div className="sg-shell">
        {/* ---------- Left nav ---------- */}
        <aside className={`sg-nav ${navOpen ? "is-open" : ""}`}>
          <nav className="sg-nav__inner">
            {NAV.map((g) => (
              <div className="sg-nav__group" key={g.group}>
                <span className="sg-nav__group-title">{g.group}</span>
                {g.items.map((it) => (
                  <button
                    key={it.id}
                    className={`sg-nav__link ${active === it.id ? "is-active" : ""}`}
                    onClick={() => goTo(it.id)}
                  >
                    <span className="sg-nav__icon">{it.icon}</span>
                    {it.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        {navOpen && (
          <div className="sg-nav-scrim" onClick={() => setNavOpen(false)} />
        )}

        {/* ---------- Main ---------- */}
        <main className="sg-main">
          {/* Masthead */}
          <div className="sg-hero">
            <Breadcrumbs
              items={[
                { label: "Platform", href: "#", icon: <FiHome /> },
                { label: "Core", href: "#" },
                { label: "Design System" },
              ]}
            />
            <h1 className="sg-hero__title">
              A calm, precise system for{" "}
              <span className="sg-hero__accent">field sales at scale</span>.
            </h1>
            <p className="sg-hero__lead">
              The shared design language behind every RetailConnect surface — from
              the manager dashboard to the distributor portal. Tokens, components
              and motion, tuned to read like a financial instrument, not a
              template.
            </p>
            <div className="sg-hero__actions">
              <Button leadingIcon={<FiArrowRight />} onClick={() => goTo("buttons")}>
                Explore components
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<FiDownload />}
                onClick={() =>
                  toast.info("Tokens exported", {
                    description: "design-tokens.json copied to your workspace.",
                  })
                }
              >
                Export tokens
              </Button>
            </div>
            <div className="sg-hero__meta">
              <span>3 type layers</span>
              <span>·</span>
              <span>24 components</span>
              <span>·</span>
              <span>Light &amp; dark</span>
              <span>·</span>
              <span>WCAG AA</span>
            </div>
          </div>

          {/* ---------------- COLORS ---------------- */}
          <Section
            id="colors"
            eyebrow="Foundations"
            title="Color"
            description="One confident cobalt carries every action. Cool-slate neutrals hold the canvas, and a disciplined data-viz palette gives charts and status their own identity. Click any swatch to copy."
          >
            <h3 className="sg-sub">Primary · Cobalt</h3>
            <div className="sg-ramp">
              {primaryRamp.map((c) => (
                <Swatch key={c.step} step={c.step} hex={c.hex} use={c.use} />
              ))}
            </div>

            <h3 className="sg-sub">Neutral · Slate</h3>
            <div className="sg-ramp">
              {neutralRamp.map((c) => (
                <Swatch key={c.step} step={c.step} hex={c.hex} use={c.use} />
              ))}
            </div>

            <div className="sg-grid-2">
              <div>
                <h3 className="sg-sub">Semantic</h3>
                <div className="sg-semantic">
                  {semanticColors.map((c) => (
                    <div className="sg-semantic__row" key={c.name}>
                      <span
                        className="sg-semantic__dot"
                        style={{ background: c.hex }}
                      />
                      <span className="sg-semantic__name">{c.name}</span>
                      <span className="sg-semantic__token rc-mono">{c.token}</span>
                      <span className="sg-semantic__desc">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="sg-sub">Data visualisation</h3>
                <div className="sg-viz">
                  {vizColors.map((c) => (
                    <div className="sg-viz__item" key={c.name}>
                      <span
                        className="sg-viz__chip"
                        style={{ background: c.hex }}
                      />
                      <span className="sg-viz__name">{c.name}</span>
                      <span className="sg-viz__token rc-mono">{c.token}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ---------------- TYPOGRAPHY ---------------- */}
          <Section
            id="typography"
            eyebrow="Foundations"
            title="Typography"
            description="Sora for display and metrics, Plus Jakarta Sans for UI and body, JetBrains Mono for codes and figures. A modular scale, fluid on the largest sizes."
          >
            <div className="sg-type">
              {typeScale.map((t) => (
                <div className="sg-type__row" key={t.name}>
                  <div className="sg-type__meta">
                    <span className="sg-type__name">{t.name}</span>
                    <span className="sg-type__spec rc-mono">{t.meta}</span>
                  </div>
                  <div className={`sg-type__sample ${t.cls}`}>{t.sample}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* ---------------- SPACE & RADIUS ---------------- */}
          <Section
            id="space"
            eyebrow="Foundations"
            title="Space & Radius"
            description="An 8px base with 4px half-steps keeps rhythm consistent. Radii scale by role — tighter on dense controls, softer on cards and overlays."
          >
            <div className="sg-grid-2">
              <div>
                <h3 className="sg-sub">Spacing scale</h3>
                <div className="sg-space">
                  {spacingScale.map((s) => (
                    <div className="sg-space__row" key={s.name}>
                      <span className="sg-space__bar" style={{ width: s.px }} />
                      <span className="sg-space__name rc-mono">{s.name}</span>
                      <span className="sg-space__val">{s.px}px</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="sg-sub">Radius</h3>
                <div className="sg-radius">
                  {radiusScale.map((r) => (
                    <div className="sg-radius__item" key={r.name}>
                      <span
                        className="sg-radius__box"
                        style={{
                          borderRadius: r.px > 100 ? "50%" : r.px,
                        }}
                      />
                      <span className="sg-radius__name rc-mono">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ---------------- ELEVATION & MOTION ---------------- */}
          <Section
            id="elevation"
            eyebrow="Foundations"
            title="Elevation & Motion"
            description="Depth comes from surface layering and hairline borders; shadows are reserved for surfaces that genuinely float. Motion stays in a 120–320ms ease-out band — present, never showy."
          >
            <h3 className="sg-sub">Elevation</h3>
            <div className="sg-elevation">
              {elevationScale.map((e) => (
                <div
                  className="sg-elevation__card"
                  key={e.name}
                  style={{ boxShadow: `var(${e.token})` }}
                >
                  <span className="sg-elevation__name rc-mono">{e.name}</span>
                  <span className="sg-elevation__use">{e.use}</span>
                </div>
              ))}
            </div>

            <h3 className="sg-sub">Motion</h3>
            <div className="sg-motion">
              {motionTokens.map((m) => (
                <div className="sg-motion__item" key={m.name}>
                  <span className="sg-motion__dot" />
                  <div>
                    <span className="sg-motion__name">
                      {m.name} · <span className="rc-mono">{m.val}</span>
                    </span>
                    <span className="sg-motion__use">{m.use}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ---------------- BUTTONS ---------------- */}
          <Section
            id="buttons"
            eyebrow="Components"
            title="Buttons"
            description="Six variants, three sizes, with icon, loading and disabled states. One primary action per view; everything else recedes."
          >
            <Demo title="Variants">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="danger">Danger</Button>
            </Demo>
            <Demo title="Sizes & icons">
              <Button size="sm" leadingIcon={<FiPlus />}>
                New beat
              </Button>
              <Button size="md" leadingIcon={<FiPlus />}>
                New beat
              </Button>
              <Button size="lg" trailingIcon={<FiArrowRight />}>
                Continue
              </Button>
              <Button iconOnly aria-label="Search">
                <FiSearch />
              </Button>
            </Demo>
            <Demo title="States">
              <Button loading>Saving</Button>
              <Button variant="secondary" loading>
                Syncing
              </Button>
              <Button disabled>Disabled</Button>
              <Button
                onClick={() =>
                  toast.success("Order booked", {
                    description: "GPS-verified · Sunrise Traders · ₹18,400",
                    action: { label: "View", onClick: () => {} },
                  })
                }
              >
                Trigger toast
              </Button>
            </Demo>
          </Section>

          {/* ---------------- FORMS ---------------- */}
          <Section
            id="forms"
            eyebrow="Components"
            title="Form controls"
            description="Inputs, selects, toggles and choices — all with labels, hints, error and disabled states, and a single shared focus ring."
          >
            <div className="sg-form-grid">
              <Input
                label="Retailer name"
                placeholder="e.g. Sharma General Store"
                hint="Shown on the order receipt."
              />
              <Input
                label="Order value"
                placeholder="0.00"
                leading="₹"
                trailing="INR"
                defaultValue="18,400"
              />
              <Select
                label="Distributor"
                placeholder="Select a distributor"
                options={distributors.slice(0, 4).map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
              <Input
                label="Beat code"
                defaultValue="BE-99X"
                error="This beat code is already assigned."
              />
              <Input label="Locked field" defaultValue="North zone" disabled />
              <Textarea
                label="Visit notes"
                placeholder="Stock feedback, competitor activity…"
                rows={3}
              />
            </div>
            <Demo title="Toggles & choices">
              <div className="sg-choices">
                <Switch
                  label="Offline capture"
                  checked={switchOn}
                  onChange={(e) => setSwitchOn(e.target.checked)}
                />
                <Switch label="GPS required" defaultChecked />
                <Switch label="Disabled" disabled />
              </div>
              <div className="sg-choices">
                <Checkbox label="Primary sales" defaultChecked />
                <Checkbox label="Secondary sales" hint="Distributor → shop" />
                <Checkbox label="Indeterminate" indeterminate />
                <Checkbox label="Disabled" disabled />
              </div>
              <div className="sg-choices">
                <Radio name="cadence" label="Daily" defaultChecked />
                <Radio name="cadence" label="Weekly" />
                <Radio name="cadence" label="Monthly" />
              </div>
            </Demo>
          </Section>

          {/* ---------------- BADGES & CHIPS ---------------- */}
          <Section
            id="status"
            eyebrow="Components"
            title="Badges & Chips"
            description="Low-saturation status pills pulled from the same scale as the charts. Chips are interactive — selectable and removable."
          >
            <Demo title="Badge tones">
              <Badge tone="neutral">Draft</Badge>
              <Badge tone="primary">New</Badge>
              <Badge tone="success" dot>
                On track
              </Badge>
              <Badge tone="warning" dot>
                At risk
              </Badge>
              <Badge tone="danger" dot>
                Off target
              </Badge>
              <Badge tone="info">Syncing</Badge>
            </Demo>
            <Demo title="Variants">
              <Badge tone="primary" variant="solid">
                Solid
              </Badge>
              <Badge tone="primary" variant="soft">
                Soft
              </Badge>
              <Badge tone="primary" variant="outline">
                Outline
              </Badge>
              <Badge tone="success" variant="solid">
                +12.4%
              </Badge>
            </Demo>
            <Demo title="Filter chips (selectable · removable)">
              {["North", "South", "East", "West"].map((r) => (
                <Chip
                  key={r}
                  selected={chips.includes(r)}
                  onClick={() => toggleChip(r)}
                  leadingIcon={<FiMapPin />}
                >
                  {r}
                </Chip>
              ))}
              <Chip onRemove={() => toast.info("Filter removed")}>Biscuits</Chip>
            </Demo>
          </Section>

          {/* ---------------- AVATARS & TABS ---------------- */}
          <Section
            id="people"
            eyebrow="Components"
            title="Avatars & Tabs"
            description="Deterministic initials fallbacks, status dots and stacked groups. Tabs come in underline and segmented variants with an animated indicator."
          >
            <Demo title="Avatars">
              <Avatar name="Ravi Menon" status="online" />
              <Avatar name="Priya Nair" status="busy" />
              <Avatar name="Anand Kumar" src="https://i.pravatar.cc/80?img=13" />
              <Avatar name="Sunrise Traders" shape="rounded" size="lg" />
              <AvatarGroup max={4}>
                <Avatar name="Ravi Menon" />
                <Avatar name="Priya Nair" />
                <Avatar name="Anand Kumar" />
                <Avatar name="Deepa Rao" />
                <Avatar name="Karan Shah" />
                <Avatar name="Meera Iyer" />
              </AvatarGroup>
            </Demo>
            <Demo title="Underline tabs">
              <Tabs
                items={[
                  { value: "overview", label: "Overview" },
                  { value: "orders", label: "Orders", badge: 24 },
                  { value: "schemes", label: "Schemes" },
                  { value: "settings", label: "Settings", disabled: true },
                ]}
                value={tab}
                onChange={setTab}
              />
            </Demo>
            <Demo title="Segmented">
              <Tabs
                variant="segmented"
                items={[
                  { value: "week", label: "Week" },
                  { value: "month", label: "Month" },
                  { value: "quarter", label: "Quarter" },
                ]}
                value={segTab}
                onChange={setSegTab}
              />
            </Demo>
          </Section>

          {/* ---------------- DATA TABLE ---------------- */}
          <Section
            id="data"
            eyebrow="Components"
            title="Data table"
            description="Sortable, paginated, with tabular figures, inline sparklines and status pills. Sort carets reveal on hover; click a header to sort."
          >
            <div className="sg-table-toolbar">
              <Button
                size="sm"
                variant="secondary"
                leadingIcon={<FiDownload />}
                onClick={runTableLoading}
              >
                Reload
              </Button>
              <span className="sg-table-toolbar__hint">
                Secondary sales by distributor · this week
              </span>
            </div>
            <Table
              columns={columns}
              data={distributors}
              rowKey={(r) => r.id}
              pageSize={5}
              loading={tableLoading}
              onRowClick={(r) =>
                toast.info(r.name, { description: `${r.region} · ${r.id}` })
              }
            />
          </Section>

          {/* ---------------- CHARTS ---------------- */}
          <Section
            id="charts"
            eyebrow="Components"
            title="Charts"
            description="A consistent SVG chart layer — shared axis, grid, legend and hover tooltip, drawing from the same 8-series palette. Hover to inspect."
          >
            <div className="sg-charts">
              <Card elevated>
                <CardHeader
                  title="Primary vs secondary"
                  subtitle="₹ lakh · last 7 days"
                  actions={
                    <Tabs
                      size="sm"
                      variant="segmented"
                      items={[
                        { value: "week", label: "7d" },
                        { value: "month", label: "30d" },
                      ]}
                      defaultValue="week"
                    />
                  }
                />
                <CardBody>
                  <AreaChart
                    categories={salesTrend.categories}
                    series={salesTrend.series}
                    valueFormat={(n) => `₹${n}L`}
                  />
                </CardBody>
              </Card>

              <div className="sg-charts__col">
                <Card elevated>
                  <CardHeader title="Secondary by region" subtitle="₹ lakh" />
                  <CardBody>
                    <BarChart
                      categories={regionSales.categories}
                      series={regionSales.series}
                      showLegend={false}
                      valueFormat={(n) => `${n}`}
                    />
                  </CardBody>
                </Card>
                <Card elevated>
                  <CardHeader title="SKU mix" subtitle="Share of secondary" />
                  <CardBody>
                    <Donut
                      data={skuMix}
                      centerValue="₹4.2Cr"
                      centerLabel="Total"
                      valueFormat={(n) => `${n}%`}
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </Section>

          {/* ---------------- OVERLAYS ---------------- */}
          <Section
            id="overlays"
            eyebrow="Components"
            title="Overlays"
            description="Modal, drawer, tooltip and toast — all focus-trapped, Esc-dismissable and reduced-motion aware."
          >
            <Demo title="Triggers">
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                Open drawer
              </Button>
              <Tooltip content="Booked orders in the last 24 hours" side="top">
                <Button variant="outline">Hover for tooltip</Button>
              </Tooltip>
              <Button
                variant="ghost"
                onClick={() =>
                  toast.warning("Sync delayed", {
                    description: "Northgate Wholesale hasn't uploaded since 09:12.",
                  })
                }
              >
                Warning toast
              </Button>
            </Demo>
          </Section>

          {/* ---------------- FEEDBACK ---------------- */}
          <Section
            id="feedback"
            eyebrow="Components"
            title="Feedback & Empty states"
            description="Every screen ships its loading, empty and error states. Skeletons mirror the real layout; empty states carry an illustration slot and a clear next action."
          >
            <div className="sg-grid-2">
              <Card elevated padding="none">
                <div className="sg-skel">
                  <div className="sg-skel__head">
                    <Skeleton variant="circle" width={40} height={40} />
                    <div style={{ flex: 1 }}>
                      <Skeleton variant="text" width="55%" />
                      <Skeleton variant="text" width="35%" />
                    </div>
                  </div>
                  <Skeleton variant="block" height={96} />
                  <Skeleton variant="text" lines={3} />
                </div>
              </Card>
              <Card elevated>
                <EmptyState
                  size="sm"
                  icon={<FiInbox />}
                  title="No orders yet today"
                  description="Orders booked by sales officers on their beats will appear here in real time."
                  actions={
                    <>
                      <Button size="sm" leadingIcon={<FiPlus />}>
                        Assign beat
                      </Button>
                      <Button size="sm" variant="ghost">
                        Learn more
                      </Button>
                    </>
                  }
                />
              </Card>
              <Card elevated>
                <EmptyState
                  size="sm"
                  tone="danger"
                  icon={<FiAlertTriangle />}
                  title="Upload validation failed"
                  description="14 rows in the distributor sales file didn't match the expected columns."
                  actions={
                    <Button size="sm" variant="danger">
                      View error report
                    </Button>
                  }
                />
              </Card>
              <Card elevated>
                <CardHeader title="Breadcrumbs" />
                <CardBody>
                  <Breadcrumbs
                    items={[
                      { label: "Dashboard", href: "#", icon: <FiHome /> },
                      { label: "Distributors", href: "#" },
                      { label: "Sunrise Traders" },
                    ]}
                  />
                </CardBody>
              </Card>
            </div>
          </Section>

          {/* ---------------- IN CONTEXT ---------------- */}
          <Section
            id="dashboard"
            eyebrow="Patterns"
            title="In context"
            description="The system composed the way it actually ships — a slice of the manager dashboard, built entirely from these components."
          >
            <div className="sg-dash">
              <div className="sg-dash__stats">
                <StatCard
                  label="Secondary sales"
                  value="₹4.24"
                  unit="Cr"
                  delta={12.4}
                  deltaLabel="vs last week"
                  icon={<FiTrendingUp />}
                  chart={
                    <Sparkline
                      data={[28, 31, 30, 34, 38, 41, 43]}
                      height={44}
                      color="var(--viz-2)"
                    />
                  }
                />
                <StatCard
                  label="Productive calls"
                  value="82.6"
                  unit="%"
                  delta={3.1}
                  deltaLabel="vs last week"
                  icon={<FiTarget />}
                />
                <StatCard
                  label="Active sales officers"
                  value="148"
                  delta={-4}
                  deltaLabel="on leave: 6"
                  icon={<FiUsers />}
                />
                <StatCard
                  label="Fill rate"
                  value="94.2"
                  unit="%"
                  delta={-1.2}
                  deltaLabel="target 96%"
                  icon={<FiPackage />}
                />
              </div>

              <div className="sg-dash__main">
                <Card elevated className="sg-dash__chart">
                  <CardHeader
                    title="Sell-through trend"
                    subtitle="Primary vs secondary · ₹ lakh"
                    actions={
                      <Badge tone="success" variant="soft" dot>
                        Live
                      </Badge>
                    }
                  />
                  <CardBody>
                    <AreaChart
                      categories={salesTrend.categories}
                      series={salesTrend.series}
                      valueFormat={(n) => `₹${n}L`}
                      height={220}
                    />
                  </CardBody>
                </Card>

                <Card elevated className="sg-dash__side">
                  <CardHeader title="Beat coverage" subtitle="Today" />
                  <CardBody>
                    <Donut
                      size={148}
                      data={[
                        { label: "Visited", value: 62 },
                        { label: "In progress", value: 18 },
                        { label: "Pending", value: 20 },
                      ]}
                      centerValue="80%"
                      centerLabel="Covered"
                      valueFormat={(n) => `${n}`}
                    />
                  </CardBody>
                  <CardFooter>
                    <Button variant="ghost" size="sm" trailingIcon={<FiArrowRight />}>
                      Open field map
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </Section>

          <footer className="sg-footer">
            <span>RetailConnect SIP · Platform / Core</span>
            <span className="rc-mono">design-system · v1.0</span>
          </footer>
        </main>

        {/* ---------- Right TOC ---------- */}
        <aside className="sg-toc">
          <span className="sg-toc__title">On this page</span>
          <ul>
            {flatNav.map((n) => (
              <li key={n.id}>
                <button
                  className={active === n.id ? "is-active" : ""}
                  onClick={() => goTo(n.id)}
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* ---------- Overlays ---------- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Approve scheme"
        description="This offer will go live for all retailers on the selected beats."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false);
                toast.success("Scheme approved", {
                  description: "‘Monsoon combo’ is live on 42 beats.",
                });
              }}
            >
              Approve &amp; publish
            </Button>
          </>
        }
      >
        <div className="sg-modal-body">
          <p>
            <strong>Monsoon combo</strong> — buy 10 cases, get 1 free. Valid for 14
            days across the North and West zones.
          </p>
          <Input label="Approval note (optional)" placeholder="Add context…" />
          <Checkbox label="Notify distributors by email" defaultChecked />
        </div>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Sunrise Traders"
        description="D-104 · North zone"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            <Button trailingIcon={<FiArrowRight />}>Open full profile</Button>
          </>
        }
      >
        <div className="sg-drawer-body">
          <div className="sg-drawer-stats">
            <StatCard label="Secondary" value="₹42.8" unit="L" delta={6.2} />
            <StatCard label="Target" value="108" unit="%" delta={8} />
          </div>
          <h4 className="sg-sub">Recent orders</h4>
          <ul className="sg-drawer-list">
            {["Sharma General Store", "New Bombay Kirana", "Green Valley Mart"].map(
              (s, i) => (
                <li key={s}>
                  <Avatar name={s} size="sm" shape="rounded" />
                  <div className="sg-drawer-list__text">
                    <span>{s}</span>
                    <span className="rc-mono">₹{(9 - i) * 1240}</span>
                  </div>
                  <Badge tone="success" size="sm">
                    Booked
                  </Badge>
                </li>
              )
            )}
          </ul>
        </div>
      </Drawer>
    </div>
  );
}
