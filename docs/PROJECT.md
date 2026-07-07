# RetailConnect SIP — Project Reference

> The single source of truth for what we are building. CLAUDE.md points here.
> When building a module, read only the relevant section below rather than the whole file.

---

## 1. Project brief (short)

RetailConnect SIP is a **field-sales and distribution platform for FMCG businesses** (manufacturers, regional brands, super-stockists). It digitises the supply chain: **Manufacturer → Distributor → Sales Officer → Retailer**.

It has **7 modules and 63 features**: a mobile Field Sales App (for Sales Officers), a Manager Dashboard, a Distributor Portal, a Management Dashboard, a Manufacturing Planner, a Projection Engine (demand forecasting), and a shared Platform/Core layer.

The closed loop: the **Projection Engine** forecasts demand and auto-generates targets → **managers** turn those into beats, schemes and incentive plans → **Sales Officers** execute on the street (GPS-verified, offline-capable) → **distributors** fulfil orders and upload their sales data → the **factory** plans production → and the **dashboards** measure what worked, feeding the next forecast.

**Build order:** the full-stack **web app first** (Next.js), then the **mobile app** (React Native + Expo) in the same repo. In v1, distributor data comes in via **manual file upload** (with column-mapping + validation); automated sync is a later version.

---

## 2. The business, in plain terms

Running example: a biscuit company, "Sunshine Biscuits."

- **Sales Officer (SO)** — walks a fixed daily route of shops taking orders.
- **Area Sales Manager** — the SO's boss; designs routes, sets offers and targets, monitors the field.
- **Distributor** — a regional warehouse that holds stock and delivers to shops.
- **Retailer** — a shop the SO visits.
- **Management (GM / National Sales Head)** — watches the whole country.
- **Manufacturing / Plant** — makes the goods.

Two key terms:

- **Primary sale** = factory → distributor.
- **Secondary sale** = distributor → shop (created by the SO's orders).
- The gap between the two shows whether stock is actually selling through or just piling up in warehouses.

Other terms: **Beat** = the SO's planned shop list for the day. **SKU** = one exact product. **Scheme** = a short-term offer to a shop. **Incentive** = a performance reward (to an SO, or to a shop).

---

## 3. Users & roles (7)

1. **Sales Officer (SO)** — mobile app only.
2. **Area Sales Manager** — web dashboard.
3. **Distributor Admin** — web portal.
4. **Management (GM / National Sales Head)** — web dashboard.
5. **Manufacturing / Plant Head** — web dashboard.
6. **System Admin** — web, full access.
7. **(Regional)** — an optional layer between area and national.

Access is **role-based and territory-scoped** — e.g. a manager sees only their own area; an SO can't open the national dashboard; a distributor can't see an SO's incentives.

---

## 4. The 7 modules & 63 features (summary)

Full feature list is in `Feature List v1.1`. Summary:

1. **Field Sales App** (mobile, 12 features) — beat route, GPS check-in, background GPS pings, order entry, GPS-verified booking, offline capture, personal performance, order history, beat map, live scheme display, retailer incentive tracker, SO incentive dashboard.
2. **Manager Dashboard** (web, 13) — live field map, beat designer, adherence report, productive-calls chart, secondary sales view, target gauges, distributor inventory heatmap, travel-time, scheme builder, SO incentive builder, retailer incentive builder, offer performance, uplift chart.
3. **Distributor Portal** (web, 7) — order inbox, inventory dashboard, **ERP sales upload**, upload error report, stock forecast, purchase-order placement, primary invoice reconciliation.
4. **Management Dashboard** (web, 10) — territory P&L heatmap, primary-vs-secondary gap, distributor performance matrix, SKU velocity heatmap, SO leaderboard, forecast accuracy, offer ROI, expansion map, national scheme view, incentive payout summary.
5. **Manufacturing Planner** (web, 5) — demand signal, production schedule, raw-material requirements, supplier lead-time tracker, capacity-vs-demand.
6. **Projection Engine** (backend, 7) — weighted-average forecast, Prophet, XGBoost, offer-uplift factor, manual override, MAPE tracking, auto-target generation.
7. **Platform / Core** (shared, 9) — role-based access, JWT auth, bulk upload, Google Maps, push notifications, ERP sync adapters, offline sync, audit logging, PII encryption.

---

## 5. Technology stack (confirmed, end-to-end)

**Web app (frontend + backend):** Next.js (latest, App Router) — full-stack — deployed on **Vercel**.
**Web UI:** Pure JSX + SCSS, ShadCN UI (see note), Framer Motion, GSAP, react-icons.
**Mobile app:** React Native + **Expo** (Dev Client + EAS Build) — in the `mobile/` folder.

- Offline: WatermelonDB · GPS: expo-location + expo-task-manager · Biometric: expo-local-authentication · Secure storage: expo-secure-store · Maps: react-native-maps.
  **Database:** **MongoDB Atlas** (via Mongoose).
  **Auth:** NextAuth v5 (web) + JWT/refresh-token flow (mobile), 7-role RBAC.
  **AI text features:** **OpenRouter** (forecast explanations, smart search — NOT the forecasting maths).
  **Forecasting engine:** separate **Python service (FastAPI + Prophet / XGBoost / LightGBM)** on **Render** — later phase.
  **Background automation:** worker service + job queue (BullMQ) + **Redis** on Render — later phase.
  **Maps:** **Google Maps Platform** (web JS + mobile SDK + Routes + Places). Mobile SDK is free.
  **File storage:** Cloudflare R2 (uploads, report PDFs, assets).
  **Login OTP:** MSG91 (with India DLT). **Push:** Firebase Cloud Messaging (free). **Email:** Resend / Amazon SES.
  **Monitoring:** Sentry. **Shared data layer:** Zod (validation) + TanStack Query (data fetching).
  **Repo & tooling:** single repo, GitHub + GitHub Actions, Claude Code.

> **ShadCN + Tailwind note:** ShadCN is built on Tailwind. Since we avoid Tailwind, either use **Radix UI primitives** styled with SCSS (that is what ShadCN wraps), or allow Tailwind only for ShadCN. Decide before building UI components.

> **Architecture reality:** Vercel hosts the web app. The **Python forecasting service** and **always-on background workers** cannot run on Vercel and live on Render — but those are later phases. **v1 is web + MongoDB only.** OpenRouter is text-AI only; the demand numbers come from the Python ML libraries.

---

## 6. Project structure & conventions

Single repo. Next.js full-stack app at root; mobile app in `mobile/`.

```
retail-connect/
├── src/
│   └── app/                 # App Router ONLY (pages + /api routes). Nothing else here.
│       ├── api/             # backend route handlers
│       ├── layout.js
│       └── page.js
├── components/              # all React components (root level)
├── models/                  # Mongoose schema files (root level)
├── utils/                   # helpers, db connection, etc. (root level)
├── lib/                     # shared libs / clients (root level, optional)
├── public/                  # static assets
├── mobile/                  # React Native + Expo app (self-contained; own package.json/node_modules)
├── docs/                    # PROJECT.md and any module specs
├── CLAUDE.md                # lean rules + brief + pointer to docs
├── next.config.mjs
├── jsconfig.json
└── package.json
```

**Conventions (from CLAUDE.md):** JavaScript only (no TypeScript), SCSS only (no Tailwind), NPM only (no Yarn), imports via relative paths (`../../../`), `"use client"` only on components using client-side code, Mongoose schemas in `models/`, no duplicate files or empty folders, never break existing code, security is paramount.

**Mobile isolation (when built):** `mobile/` has its own `package.json` + `node_modules`; configure Metro `watchFolders`/`blockList` to avoid the root `node_modules`; exclude `mobile/` from web ESLint/build/jsconfig; gitignore `mobile/node_modules`.

---

## 7. Architecture overview

- **v1 (now):** Next.js on Vercel (web UI + API routes) ↔ MongoDB Atlas. Google Maps for maps. NextAuth for auth. File uploads → Cloudflare R2. That's the whole v1 runtime.
- **Later:** a Python service on Render for forecasting; a worker + Redis on Render for background jobs and (v2) automated distributor sync; OpenRouter for text-AI features; MSG91 for OTP; Firebase for push (mobile phase).
- **Data flow (v1):** SOs' orders (mobile, later) and distributors' uploaded sales land in MongoDB via API routes → dashboards read aggregated data. Heavy dashboards read **pre-computed rollup collections** (refreshed on a schedule) rather than aggregating raw data live.

---

## 8. Data model overview (high level — no code)

Core collections (Mongoose): **users** (with role + territory), **territories/hierarchy**, **distributors**, **retailers** (with GPS + A/B/C tier), **products/SKUs**, **beats** (ordered retailer list per SO per day), **orders** (secondary), **inventory** (per distributor per SKU), **schemes**, **incentivePlans** (SO + retailer), **gpsPings** (time-series), **auditLogs** (before/after), **forecasts** & **targets** (later), **rollups** (pre-computed dashboard summaries).

Principles: use **multi-document transactions** for anything touching money (orders, payouts, reconciliation); **validate every write** (Zod / Mongoose validation); store **PII encrypted** (phone, GPS); key uploaded records on **distributor + invoice number + date** to prevent double-counting; index for the dashboard queries you actually run.

---

## 9. Distributor data — v1 (manual upload)

For v1, distributors export their sales from their own software (Tally/SAP/Excel) and **upload the file** into the Distributor Portal. It must sync cleanly regardless of format. The upload feature needs:

1. **Column mapping (saved per distributor):** on first upload, map their columns to our fields ("their 'Party Name' = our 'Retailer'"). Save it so future uploads are automatic.
2. **Validation + error report:** check every row (known SKU? known retailer? valid dates/numbers?) and flag bad rows in plain language for re-upload.
3. **Staging-first + de-duplication:** land the raw file first, then transform into clean data; key on distributor + invoice no + date so the same file can't double-count.
4. **Downloadable template:** a standard Excel template distributors can paste into to skip mapping entirely.

> This is a deliberate v1 scope choice. The automated "Connect your system" sync (agent / API) is planned for v2 and will feed the **same** staging pipeline, so none of this is throwaway.

---

## 10. Security requirements (critical)

The product handles sales, money, and personal data, so security is a first-class requirement, not an afterthought:

- **Auth:** NextAuth v5, short-lived access tokens + refresh tokens, biometric on mobile, secure token storage.
- **RBAC:** enforce role + territory on **every** API route (server-side, never trust the client).
- **Input validation:** validate and sanitise every input (Zod); never build queries from raw user input.
- **PII encryption:** encrypt phone numbers and GPS at rest.
- **Audit logging:** log every create/update/delete with user, timestamp, before/after.
- **Rate limiting & abuse protection:** on auth and upload endpoints; bot/attack protection.
- **Secrets:** all keys in environment variables, never in code or the repo.
- **File uploads:** validate type/size, scan/parse safely, store in R2 (not the web server).
- **Transport:** HTTPS everywhere; secure headers.

---

## 11. Build phases (implementation plan)

- **Phase 0 — Foundation:** confirm structure, base config, global SCSS, layout shell, MongoDB connection, env setup.
- **Phase 1 — Platform/Core:** auth (NextAuth v5), 7-role RBAC, app shell/navigation per role, audit logging.
- **Phase 2 — Master data & models:** Mongoose models + admin CRUD + seed data (users, distributors, retailers, SKUs, territories).
- **Phase 3 — Distributor Portal (v1 priority):** order inbox, inventory, **upload + mapping + validation + staging + dedup**, error report.
- **Phase 4 — Manager Dashboard:** beat designer (Google Maps), live map, adherence, productive calls, secondary sales, gauges, scheme builder, incentive builders, offer performance, uplift chart.
- **Phase 5 — Management Dashboard:** all national analytics (heatmaps, gaps, matrices, leaderboard, ROI, payouts).
- **Phase 6 — Manufacturing Planner:** demand signal, production schedule, RM requirements, lead times, capacity.
- **Phase 7 — Projection Engine (Python on Render):** forecasting models, MAPE, auto-targets, OpenRouter explanations.
- **Phase 8 — Mobile app (Field Sales App):** Expo setup, auth, beat, GPS check-in, order entry, offline sync, scheme display, incentives, push.
- **Phase 9 — Hardening & launch:** security review, testing, Sentry, performance (rollups), deployment.

Ship the web core (Phases 0–5) as the first usable release; mobile and forecasting follow.

---

## 12. External services — setup checklist (what YOU set up, and when)

| When        | Service             | What you do                                                                         |
| ----------- | ------------------- | ----------------------------------------------------------------------------------- |
| Phase 0     | MongoDB Atlas       | Create cluster (M0/Flex for dev), get connection string → `.env`                    |
| Phase 1     | NextAuth            | Generate `AUTH_SECRET` → `.env`                                                     |
| Phase 3     | Cloudflare R2       | Create bucket + access keys → `.env`                                                |
| Phase 4     | Google Cloud / Maps | Create project, enable Maps JS + Routes + Places, get key, **restrict it** → `.env` |
| Phase 7     | Render              | Create Python web service + Redis; deploy forecasting service                       |
| Phase 7     | OpenRouter          | Create account, get API key → `.env`                                                |
| Phase 8     | Apple + Google Play | Company developer accounts (long lead time — start early)                           |
| Phase 8     | Expo EAS            | Account for builds                                                                  |
| Phase 8     | Firebase            | Project + FCM for push; APNs key for iOS                                            |
| Near launch | MSG91               | Account + India DLT registration + sender ID → `.env`                               |
| Phase 9     | Sentry              | Project + DSN → `.env`                                                              |
| Deploy      | Vercel              | Connect repo, set env vars, deploy                                                  |
