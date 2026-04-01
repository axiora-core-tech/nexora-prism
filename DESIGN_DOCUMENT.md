# Nexora Prism — Design System & Architecture Document

**Version:** 3.0 — April 2026  
**Status:** Living document — single source of truth for architecture, design, and specifications  
**Stack:** React 19 · TypeScript · Vite 6.3 · Tailwind CSS v4 · Motion (Framer Motion) · React Router v7

---

## 1. Product Overview

### 1.1 What Prism Is

Nexora Prism is a people analytics platform that surfaces six dimensions of employee health: Output (performance), Growth (learning), Motivation (engagement), Wellbeing (burnout risk), Return (ROI), and Risk (attrition probability). Unlike traditional HR dashboards that present data in flat tables, Prism treats each metric as a living signal and uses novel interaction paradigms to let leaders *feel* correlations between dimensions rather than merely reading them.

### 1.2 Vision

> Every person carries more than their job title. Prism brings together every signal — reviews, growth, wellbeing, output — so leaders can see each person whole, and act accordingly.

The core philosophy is captured in one line: **"One score compresses six signals. This page holds them apart."** Traditional HR platforms reduce people to a performance rating. Prism deliberately decompresses that into a spectrum of independent, sometimes-contradictory signals — because a person scoring 90 on output while burning out is not the same as a person scoring 90 across the board.

### 1.3 Target Users

| User | Need | Primary Pages |
|------|------|---------------|
| VP/Director of People | Strategic workforce decisions, retention planning | Spectrum (hub), Leaderboard |
| Engineering Manager | Team health, 1:1 prep, performance reviews | Team, Employee Detail, KPIs |
| CHRO/CPO | Board-level reporting, capital allocation | Spectrum (Capital Dynamics tab) |
| HR Business Partner | Reviews, attendance, wellbeing programs | PerformanceReview, Attendance |

### 1.4 The Six Dimensions

| # | Dimension | Field | Color | Unit | Invert | Meaning |
|---|-----------|-------|-------|------|--------|---------|
| 01 | Output | `performanceScore` | `#f43f5e` (Rose) | pt | No | Delivery velocity, KPI achievement |
| 02 | Growth | `learningProgress` | `#10b981` (Emerald) | % | No | Learning modules, skill acquisition |
| 03 | Motivation | `motivationScore` | `#f59e0b` (Amber) | pt | No | Engagement level, initiative |
| 04 | Wellbeing | `welfareScore` | `#c084fc` (Purple) | pt | No | Burnout probability, stress index |
| 05 | Return | `roi` | `#38bdf8` (Cyan) | % | No | Revenue contribution vs cost |
| 06 | Risk | `attritionRiskPercentage` | `#fb923c` (Orange) | % | Yes | Flight probability (lower = better) |

The `invert` flag on Risk means lower is better. This affects bar fill direction, sorting order, colour thresholds, and the Prism orbital ring fill calculation.

### 1.5 Design Language

Prism's visual identity is **"cinematic data"** — observatory instruments, signal processing displays, editorial typography. Not corporate dashboards. Dark by default (`#030303`) with a warm off-white light mode (`#f2f0eb`). Every number is treated as a living signal, not a static label.

---

## 2. Information Architecture

### 2.1 Route Map

```
/ ........................ Landing Page (marketing site)
/sign-in ................. Authentication
/enter ................... Threshold Transition (cinematic app entry)
/demo .................... Interactive product demo

/app ..................... Spectrum — THE Hub (index route)
/app/spectrum ............ Spectrum (alias)
/app/team ................ Team Directory + 1:1 Prep
/app/employee/:id ........ Employee Detail (split-panel editorial)
/app/kpis ................ KPI Goals (health strip + OKR stream)
/app/leaderboard ......... Animated Race (8-quarter bar race)
/app/attendance .......... Temporal Patterns (heatmap + pattern detection)
/app/review .............. 360° Performance Review (write + score)
/app/reviews ............. 360° (alias)
/app/tasks ............... Task Management (kanban + timers)
/app/settings ............ Preferences (theme, profile, sign-out)
/app/analytics ........... → redirects to /app
/app/roi ................. → redirects to /app
/app/* ................... 404 — "Signal lost"
```

### 2.2 Navigation — The Dock

macOS-style floating bottom dock. This is the **only** navigation element — there is no sidebar, no top nav bar inside the app shell.

**Primary Nav (always visible):** Team | KPIs | ✦ Spectrum ✦ | Rankings | Tasks

- Spectrum icon is visually elevated: 44px circular button, cyan-to-purple gradient ring when active, floats above the dock bar with `-my-3`
- Active indicator: `layoutId`-animated pill behind active icon (primary or feature)

**Feature Nav (expandable tray via "More" chevron):** 360° Reviews | Attendance | Settings

**Dock behaviour:**
- Spring entrance: `{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }`
- Fixed at `bottom: 2rem`, centered via `left-1/2 -translate-x-1/2`
- Backdrop blur: `backdrop-blur-2xl`
- Labels hidden below `sm` breakpoint
- TV (1920px+): Dock scales up 1.3× for distance legibility
- iOS safe area: `bottom: max(2rem, calc(1rem + env(safe-area-inset-bottom)))`

### 2.3 Page Transition Choreography

Navigation type determines animation style, computed automatically by `Layout.tsx`:

| Direction | Animation | Use Case |
|-----------|-----------|----------|
| Lateral | Slide left/right + 2px blur | Same-depth pages (Team → Tasks) |
| Dive | Scale up from 94% + 6px blur | Going deeper (Team → Employee) |
| Surface | Scale down from 106% + 4px blur | Coming back (Employee → Team) |
| Fade | Vertical fade 16px | Same position or fallback |

Every route has a numeric `depth` (0–2) and lateral `position` in static maps:

```typescript
// Depth map
'/app': 0, '/app/spectrum': 0, '/app/team': 0, '/app/tasks': 0, '/app/analytics': 0,
'/app/kpis': 1, '/app/attendance': 1, '/app/roi': 1, '/app/leaderboard': 1,
'/app/review': 1, '/app/settings': 1,
'/app/employee/*': 2

// Position map (lateral ordering)
'/app': 0, '/app/team': 1, '/app/tasks': 2, '/app/kpis': 3,
'/app/attendance': 4, '/app/leaderboard': 5, '/app/review': 6, '/app/settings': 7
```

### 2.4 Provider Hierarchy

```
ThemeProvider          ← Dark/light CSS class on <html>, persisted to localStorage
  └─ AuthProvider      ← User session { email, name } via localStorage
       └─ RouterProvider
            ├─ LandingPage       (public)
            ├─ SignIn             (public)
            ├─ Demo              (public)
            └─ ProtectedRoute
                 ├─ EnterApp      (threshold transition)
                 └─ Layout        (app shell: ambient blobs, cursor, transitions, dock)
                      ├─ Spectrum, Team, EmployeeDetail, Tasks,
                      ├─ KPIGoals, Attendance, Leaderboard,
                      ├─ PerformanceReview, Settings
                      └─ NotFound (404)
```

---

## 3. Technical Architecture

### 3.1 Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React (SPA) | 19 |
| Routing | React Router | 7.13.0 |
| Build | Vite | 6.3.5 |
| Styling | Tailwind CSS v4 + CSS custom properties | 4.1.12 |
| Animation | Motion (Framer Motion) | 12.23.24 |
| Charts | Recharts + custom SVG | 2.15.2 |
| UI primitives | Radix UI (via shadcn/ui) | Various |
| Drag and drop | react-dnd + HTML5 backend | 16.0.1 |
| Icons | Lucide React | 0.487.0 |
| Date utilities | date-fns | 3.6.0 |
| Carousel | Embla Carousel | 8.6.0 |
| Notifications | Sonner | 2.0.3 |
| Utilities | clsx, tailwind-merge, class-variance-authority | Latest |

### 3.2 Project Structure

```
nexora-prism/
├── src/
│   ├── main.tsx                        # Entry point
│   ├── app/
│   │   ├── App.tsx                     # Root: ThemeProvider → AuthProvider → RouterProvider
│   │   ├── routes.tsx                  # All routes + lazy loading + suspense skeletons (~200 lines)
│   │   ├── mockData.ts                # Centralised mock data store (~845 lines)
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx         # Auth state + localStorage persistence
│   │   │   ├── ThemeContext.tsx        # Dark/light toggle + immediate CSS class switching
│   │   │   └── ProtectedRoute.tsx     # Auth gate → redirects to /sign-in
│   │   └── components/
│   │       ├── Layout.tsx              # App shell (~188 lines)
│   │       ├── Spectrum.tsx            # THE Hub (~417 lines)
│   │       ├── Team.tsx                # Directory + 1:1 prep (~351 lines)
│   │       ├── EmployeeDetail.tsx      # Deep-dive split-panel (~879 lines)
│   │       ├── Tasks.tsx               # Kanban + drag-and-drop (~1070 lines)
│   │       ├── KPIGoals.tsx            # OKR + KPI tracking (~311 lines)
│   │       ├── Attendance.tsx          # Calendar + 7 pattern algorithms (~467 lines)
│   │       ├── Leaderboard.tsx         # Animated bar-race (~195 lines)
│   │       ├── PerformanceReview.tsx   # 360° read + write wizard (~558 lines)
│   │       ├── Settings.tsx            # Theme, notifications, system config (~473 lines)
│   │       ├── ThresholdTransition.tsx # Cinematic entry animation (~344 lines)
│   │       ├── EnterApp.tsx            # Post-sign-in gate
│   │       ├── Demo.tsx                # Product demo walkthrough (~331 lines)
│   │       ├── landing/               # Marketing site
│   │       │   ├── LandingPage.tsx, Loader.tsx, Navbar.tsx, HeroSection.tsx,
│   │       │   ├── FeatureSection.tsx, JourneySection.tsx, CTASection.tsx,
│   │       │   ├── Footer.tsx, CustomCursor.tsx
│   │       ├── ui/                    # Shared primitives
│   │       │   ├── Dock.tsx, DockIcons.tsx (~251 lines), CustomCursor.tsx,
│   │       │   ├── EmptyState.tsx (~164 lines, 7 variants), ROIWaveChart.tsx (~325 lines),
│   │       │   └── [~40 shadcn Radix primitives]
│   │       └── figma/ImageWithFallback.tsx
│   └── styles/
│       ├── index.css, prism-theme.css (~509 lines), theme.css,
│       ├── responsive.css (~178 lines), fonts.css, tailwind.css
├── index.html, package.json, vite.config.ts
```

### 3.3 Code Splitting & Loading

Every page lazy-loaded via `React.lazy()` + named exports + `<Suspense>`. Two skeleton variants: `PageSkeleton` (generic) and `EmployeeSkeleton` (split-panel). Skeletons use inline CSS `@keyframes` (no theme dependency during chunk load). `NotFound` catches unmatched `/app/*` routes.

### 3.4 Authentication

Client-side mock: React Context + `localStorage` key `prism_auth_user`. Stores `{ email, name }`. Exposes `login()`, `logout()`, `isAuthenticated`. `ProtectedRoute` redirects to `/sign-in`. **Future:** Replace with OAuth/SSO — only `AuthContext.tsx` and `ProtectedRoute.tsx` need changes.

### 3.5 Theming

Dual-layer: **Prism tokens** (`--p-*`) in `prism-theme.css` + **shadcn tokens** in `theme.css`. Toggle `.prism-dark`/`.prism-light` on `<html>`. `ThemeContext` applies immediately (not waiting for React) and persists to `localStorage` key `prism_theme`.

---

## 4. Design System

*(Complete token tables, typography rules, spacing system, responsive breakpoints, and colour system are documented in the companion SKILL.md file. This section covers the architectural decisions.)*

### 4.1 Token Architecture

All colours defined as `--p-*` CSS custom properties in `prism-theme.css`. Both `.prism-dark` and `.prism-light` variants. Components NEVER use raw hex — they reference tokens via utility classes (`p-text-hi`, `p-bg-card`, etc.) or inline `var()`.

Seven-level text opacity ladder, three-tier border system, six accent colours each with full/low-opacity/border variants, chart-specific tokens, motion tokens.

### 4.2 Light Mode Strategy

Retrofitted onto dark-first codebase via three layers:
1. Token redefinition in `.prism-light` (automatic for token-using components)
2. CSS selector overrides for hardcoded Tailwind classes (`bg-white/5` etc.)
3. Component-level `isLight` checks for ambient effects (blobs, cursor blend mode)

Key: warm off-white `#f2f0eb` (not pure white), deepened accents for legibility, avatar grayscale 60% (not 100%), blobs use `mix-blend-mode: multiply` instead of `screen`.

---

## 5. UI/UX Design Principles

### 5.1 Core Philosophy

1. **Signal, not noise.** Every element must earn its space.
2. **Feel, don't read.** Correlations felt through interaction (sliders resist, dots attract, bars race).
3. **Editorial, not dashboard.** Magazine profiles, not spreadsheet summaries.
4. **Dark-first, light-capable.** Data visualization pops on dark.
5. **One score compresses, the page holds apart.** Composite only in The Prism; everywhere else, dimensions separated.
6. **Progressive disclosure.** Start quiet, reveal on interaction.

### 5.2 Visual Language

| Principle | Implementation |
|-----------|---------------|
| Grayscale portraits, color on hover | `grayscale` default → `group-hover:grayscale-0` over 500ms |
| Ambient glow, not hard shadows | `blur-[120px]` soft blobs, NEVER `box-shadow` |
| Borders as whispers | 5% → 10–20% on hover/active |
| Typography hierarchy through weight, not size | Serif/sans pairing, font-weight, not dramatic size jumps |

### 5.3 Interaction Patterns

| Pattern | Rule |
|---------|------|
| Hover → Reveal | Information appears on proximity, not by default |
| Click → Expand | In-place with AnimatePresence, never navigate unless profile link |
| Drag → Physics | Spring-connected correlated data |
| Scroll → Parallax | Hero backgrounds: scale, opacity, blur |
| Navigate → Choreograph | Transitions match navigation intent |

---

## 6. Page-by-Page Specification

### 6.1 Landing Page (`/`)

**Visual layers:** `bg-[#010101]` + fractalNoise (5%) + 12-col grid (3%) + radial vignette + corner registration marks + custom cursor.

**Sections:**
1. **Loader** — 2s percentage counter (Space Mono, indigo→rose gradient). Once per session (`sessionStorage`). Exploding ring (10vw→150vw) on completion.
2. **Hero** — Full viewport parallax. Three CSS blobs (GPU, `will-change`). 3D text (`perspective:1000px`). "People, understood." (4rem→11rem fluid). Two CTAs.
3. **Features** — 4 stacking sticky cards. Scale down as next stacks. Content (5/12) + parallax image (7/12) with HUD reticle. RotateX tilt ±5°.
4. **Journey** — 220vh. SVG path draws on scroll (indigo→purple→rose gradient `pathLength`). 3 milestone nodes at 9%/43%/77%, alternating left/right. Diamond dots with glow. Glassmorphic cards with registration marks. Mobile: straight vertical line.
5. **CTA** — Conversion section.
6. **Footer** — 3 link columns. "PRISM" at 18vw, `mix-blend-difference`. Identifier + copyright in 10px mono.

### 6.2 Spectrum — The Intelligence Nexus (`/app`)

**THE Hub.** No back button. Personalised greeting. Title: "The *Spectrum*".

**Sections:**
1. **The Prism** — SVG 440×440. 6 concentric rings (base 48px, gap 27px). Animated `stroke-dashoffset` (1.6s, staggered 0.1s). Gradient stroke. Hover: isolate ring (18% opacity others), show label/value at arc endpoint, glow filter. Click: expand dimension row + scroll. Centre: composite score 42px.

2. **Team Constellation** — Horizontal scroll. 260×370px cards. Photo with `from-black via-black/50 to-transparent` gradient. Risk dot (top-left), ROI badge (top-right). Names: first (sans light) + last (serif italic). Hover: `y:-20, scale:1.02`, grayscale→colour. Entrance: staggered `x:50, rotateY:-10`. Snap scroll. Right-edge fade.

3. **Dimension Rows** — 6 full-bleed expandable rows. Large stat (`clamp(2rem,4.5vw,3.5rem)`), progress bar, top-3 avatars. Active: accent left border, glow gradient, others 25% opacity. Expanded: insight quote (serif italic), action card, TeamScatter (avatars on gradient track, ±9px jitter), top/bottom-3 ranked lists.

4. **Intelligence** — Auto-generated cross-dimensional patterns. 4 max. Severity-sorted cards: type badge, icon, narrative, employee link.

5. **Deep Analytics** — 4 tabs:
   - **Overview**: ComposedChart (area/line/bar), attrition bars, performance sparkline, employee matrix table.
   - **Capital Dynamics**: Magnetic chart (12% cursor pull within 100px) + Ghost Horizon (growth slider -5→20%) + Cost of Departure (1.5× comp) + Department Vectors.
   - **Wellbeing**: Radar (6 axes), learning bars (stacked), burnout matrix (employee cards).
   - **Simulation Lab**: Correlation Engine (6 sliders with physics: Output↑→Wellbeing↓0.45×, Motivation→Risk inverse, Wellbeing<65→Risk↑0.5×, Learning→ROI↑1.2×) + Signal Scatter (any X/Y, spring 0.7s stagger 0.06s) + Temporal Rewind (4-quarter slider, all dims animate).

### 6.3 Team (`/app/team`)

4 org stat cards + department performance bars → filterable grid (search/dept/risk) → employee cards. Cards: avatar+risk dot, name/role/dept(colour), perf score, 3 mini-metrics, skills (max 3), trend. Click → 1:1 prep panel: topics + hand-crafted SVG MiniRadar (4 axes). Zero recharts.

### 6.4 Employee Detail (`/app/employee/:id`)

Split-panel: **Left 40%** sticky photo column (parallax scale/y, gradient overlay, name/role/dept, engagement badge). **Right 60%** scrollable with floating dot sidebar (scroll-spy via RAF on `<main>`).

8 sections: Telemetry (6 stat rings, daily perf) → KPI Goals (OKRs + KPI vectors) → Capital Matrix (quarterly ROI, compensation, leave) → Neural Pathways (LMS modules) → Temporal Dynamics (TemporalGrid, timesheets, feedback) → Impact Nodes (promotions) → Bio-Rhythms (stress/burnout/sleep/cognitive) → 360° Resonance (review cards with 5-axis radar).

### 6.5 Tasks (`/app/tasks`)

Kanban: Backlog|Active|Review|Resolved. react-dnd HTML5 backend. Task card: title, priority badge, owner avatar, story points, timer, comments, attachments. Detail slide-out panel. Create/edit modal. Branded empty states.

### 6.6 KPI Goals (`/app/kpis`)

Per-employee: OKR nodes (progress + status badge: Nominal/Degraded/Critical/Resolved) + KPI vectors (current vs target, colour-coded). `isLowerBetter` flag for inverted metrics.

### 6.7 Attendance (`/app/attendance`)

Hero: Org Presence Rate + Remote Ratio. **7 pattern detection algorithms** (all implemented): consecutive absences (≥2, critical), high absence count (≥3, watch), heavy WFH (>50%, watch), Monday/Friday pattern (≥3 combined, watch), mass bunking (≥2 same date, critical), WFH surge (≥3 same date, watch), org-wide low presence (<85%, watch). Max 6 cards, severity-sorted.

Node selector (2×4 grid) → detail panel: TemporalGrid (7-col calendar, colour-coded, hover tooltips), breakdown bars, leave balance, location donut (SVG ring).

### 6.8 Leaderboard (`/app/leaderboard`)

8-quarter bar race (Q1'24→Q4'25). `motion.div layout` with `spring: {damping:25, stiffness:200}`. 5 metrics (Output/Return/Growth/Motivation/Wellbeing). Play: 850ms/step from Q1. Winner: 👑 emoji. Manual scrubber + clickable labels. Summary stats: Average, Leader, Spread, Above target.

### 6.9 Performance Review (`/app/review`)

**Reviews mode:** Per-employee cards, hand-crafted SVG RadarWeb (5 axes), scores/strengths/improvements. **Write mode:** 4-phase wizard: Select → Score (5 sliders) → Write (text areas) → Confirm.

### 6.10 Settings (`/app/settings`)

Theme toggle (dark/light, sun/moon). Notification prefs. Security. Integrations. Sign-out.

---

## 7. Interaction Design Catalogue

### 7.1 Custom Cursor

Dot (4px, `spring: damping:30, stiffness:500, mass:0.2`) + Ring (28→48px on hover, `spring: damping:28, stiffness:150, mass:0.6`). Contextual labels via `data-cursor`. `mix-blend-mode: difference`/`multiply`. Hidden on `(pointer: coarse)`.

### 7.2 Novel Interactions

| Name | Location | Mechanic |
|------|----------|----------|
| **Prism Orbital** | Spectrum | 6 concentric SVG rings, animated `stroke-dashoffset`, hover isolate, click scroll |
| **TeamScatter** | Dimension rows | Avatar dots on gradient track, ±9px jitter, hover tooltip |
| **Magnetic Data Points** | Capital Dynamics | 12% cursor pull within 100px radius, closest auto-labels |
| **Ghost Horizon** | Capital Dynamics | Real→forecast zone, confidence envelope, growth slider |
| **Cost of Departure** | Capital Dynamics | Click employee → replacement cost (1.5× comp), lost value, time to replace |
| **Correlation Engine** | Simulation Lab | 6 sliders with physics resistance between correlated dimensions |
| **Signal Scatter** | Simulation Lab | Any 2 dims → animated scatter, spring 0.7s staggered 0.06s |
| **Temporal Rewind** | Simulation Lab | Quarter slider, all 6 dims animate simultaneously |
| **ROI Bar Race** | Leaderboard | 8-quarter race, layout spring animations trade positions |
| **MiniRadar** | Team 1:1 panel | Hand-crafted SVG, 4 axes, grid rings + data polygon |
| **TemporalGrid** | Attendance | 7-col calendar, colour-coded, animated cell entrance (staggered 0.015s) |
| **RadarWeb** | Reviews | 5-axis radar, hand-crafted SVG |

---

## 8. Data Model

### 8.1 Employee Schema

```typescript
interface Employee {
  id: string;                     // "e1"–"e8"
  name: string; role: string; department: string;
  stage: string;                  // "Established", "Rising", etc.
  avatar: string;                 // Unsplash URL
  skills: string[];

  // Six Dimensions
  performanceScore: number;       // 0–100
  learningProgress: number;       // 0–100 (%)
  motivationScore: number;        // 0–100
  welfareScore: number;           // 0–100
  roi: number;                    // 80–350 (%)
  attritionRiskPercentage: number;// 0–100
  attritionRisk: 'Low' | 'Medium' | 'High';
  trend: 'up' | 'down' | 'stable';

  // Financial
  revenueContribution: number; costInvestment: number;
  compensation: { base, bonus, equityVested, equityUnvested, nextVestDate, wellnessStipend, utilizedStipend };
  roiQuarterly: { quarter, investment, value, roi }[];

  // Performance
  engagementLevel: string; recentFeedback: string; nextPromotionEligibility: string;
  dailyPerformance: { day, score, hours }[];
  timesheets: { week, hoursLogged, utilizationRate, billable }[];
  workLogFeedback: { date, comment, sentiment }[];

  // Goals
  okrs: { objective, progress, status, weight }[];
  kpis: { name, target, current, unit, trend, weight }[];
  projectedPromotions: { role, timeframe, probability }[];

  // Learning
  lmsModules: { id, title, status, progress, score, date }[];

  // Reviews
  reviews360: { reviewer, relation, date, scores:{communication,technical,leadership,collaboration,innovation}, strengths, improvements, overall }[];

  // Attendance
  attendance: { present, wfh, leave, absent, calendar: { date, type, checkIn?, checkOut?, leaveType? }[] };
  leaveBalance: { ptoTotal, ptoUsed, sickTotal, sickUsed, sabbaticalEligible };

  // Wellbeing
  bioRhythm: { stressIndex, burnoutProbability, sleepQuality, cognitiveLoad };

  // PLANNED: peerReviews[], equipment[]
}
```

### 8.2 Global Data Exports

Implemented: `employees` (8), `performanceData`, `globalRevenueForecast`, `globalLearningData`, `orgROIData`, `departmentROI`.
Planned: `alerts`, `globalKPIData`.

### 8.3 Insight Detection

Spectrum: burnout corridor (perf>85 + welfare<65), flight risk (attrition>50 + roi>150), scaling past role (learn>perf+5 + motiv>75), motivation decoupling (motiv<60 + perf>70).
Attendance: 7 algorithms (see §6.7). Always severity-sorted: critical → watch → opportunity.

---

## 9. Component Library

| Component | File | Purpose |
|-----------|------|---------|
| `ThePrism` | Spectrum.tsx | Orbital ring visualization |
| `TeamScatter` | Spectrum.tsx | Avatar distribution track |
| `MagneticChart` | Spectrum.tsx | Cursor-proximity SVG chart |
| `GhostHorizon` | Spectrum.tsx | Forecast with growth slider |
| `CostOfDeparture` | Spectrum.tsx | Departure cost modeler |
| `CorrelationEngine` | Spectrum.tsx | 6-slider physics lab |
| `SignalScatter` | Spectrum.tsx | 2-dim scatter plot |
| `TemporalRewind` | Spectrum.tsx | Quarter time travel |
| `MiniRadar` | Team.tsx | SVG spider chart (4 axes) |
| `TemporalGrid` | Attendance.tsx | 7-col calendar heatmap |
| `RadarWeb` | PerformanceReview.tsx | 5-axis review radar |
| `Dock` | ui/Dock.tsx | Bottom navigation |
| `CustomCursor` | ui/CustomCursor.tsx | Dot + ring cursor |
| `EmptyState` | ui/EmptyState.tsx | 7 branded empty states |
| `ROIWaveChart` | ui/ROIWaveChart.tsx | Catmull-Rom wave |
| `ThresholdTransition` | ThresholdTransition.tsx | Cinematic entry |
| `Loader` | landing/Loader.tsx | Landing intro animation |

Utility classes: See SKILL.md §1.

---

## 10. Glossary — Prism Vocabulary

| Prism Term | Generic Equivalent | Context |
|---|---|---|
| Spectrum | Dashboard / Home | Main hub page |
| The Prism | Overview chart | Orbital ring visualization |
| Constellation | Employee gallery | Horizontal card track |
| Dimension | Metric category | One of the 6 core signals |
| Signal | Data point | Any metric value |
| Composite | Average score | Combined score at Prism centre |
| Node | Employee / person | Used in data contexts |
| Vector | KPI progress bar | Directional metric display |
| Temporal | Time-based | Attendance, timesheets |
| Correlation Engine | What-if sliders | 6-slider physics simulation |
| Signal Scatter | Scatter plot | 2-dimension comparison |
| Temporal Rewind | Time slider | Quarter playback |
| Magnetic | Cursor-attracted | Chart with proximity physics |
| Ghost Horizon | Forecast chart | Predictive with growth slider |
| The Race | Leaderboard | Animated bar race |
| Orbital Presence | Attendance | Attendance page title |
| Neural Pathways | Learning modules | Employee learning section |
| Bio-Rhythms | Wellbeing metrics | Stress / burnout / sleep |
| Resonance | 360° Reviews | Review section |
| Capital Matrix | Financial summary | ROI / compensation |
| Impact Nodes | OKR achievements | Goals section |
| Telemetry | Performance overview | Top stats section |
| In Orbit | Present | Office attendance |
| Dark | Absent | Unexplained absence |
| Standby | Weekend | Non-working day |
| Protocol | Leave type / process | "PTO Protocol" |
| Burnout Corridor | Burnout risk pattern | High output + low wellbeing |
| Flight Risk | Attrition danger | High risk + high ROI |
| Threshold Transition | App entry animation | Cinematic loading |

**Rule:** Always use evocative names, not generic. New features must follow this pattern.

---

## 11. Performance Architecture

- Lazy loading: all routes code-split
- `useMemo`/`useCallback` for expensive computations and event handlers
- `requestAnimationFrame` with pending flag for scroll-spy
- CSS `@keyframes` for ambient blobs (GPU compositor, not JS-driven)
- `will-change: transform` on blobs, `prefers-reduced-motion` respected
- Images: `loading="lazy" decoding="async"` (except landing hero: `eager` + `fetchPriority="high"`)
- Known areas: extract large components, add virtualisation, replace mock data with API

---

## 12. AI & Agentic Features Roadmap (v3)

1. **AI Narrative Intelligence** — LLM daily briefings synthesizing cross-dimensional patterns
2. **Conversational Analytics** — Chat overlay on Spectrum ("Who is most likely to leave?")
3. **Automated 1:1 Prep** — AI reads KPIs/reviews/attendance → structured agenda
4. **Predictive Attrition Agent** — Background monitoring with configurable thresholds
5. **Smart OKR Suggestions** — Stretch targets for high performers, reduced scope for burnout risks
6. **NL Report Generation** — "Generate a board-ready Q4 summary" → doc with charts
7. **Anomaly Detection** — Unsupervised pattern detection surfaced as intelligence cards

**Architecture:** Anthropic API (`/v1/messages`), Sonnet for speed, Opus for depth. Streaming for chat. JSON-mode for structured output. All advisory — no automated actions.

---

## 13. Appendices

### A. Browser Support

Chrome/Edge 90+, Safari 15+, Firefox 90+, Mobile Safari/Chrome Android.

### B. Accessibility (planned v3)

`aria-label` on SVG, keyboard nav, focus-visible rings, skip-nav, screen reader announcements.

---

*Single source of truth. For component-level UI/UX conventions and copy-paste patterns, see SKILL.md.*
