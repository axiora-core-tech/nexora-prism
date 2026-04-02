# Nexora Prism — Design System & Architecture Document

**Version:** 3.2 — April 2026  
**Status:** Living document — single source of truth for design system and existing codebase  
**Companion docs:** SKILL.md (UI/UX conventions), PRODUCT_ARCHITECTURE_v3.md (v3 AI platform specs)  
**Stack:** React 19 · TypeScript · Vite 6.3 · Tailwind CSS v4 · Motion (Framer Motion) · React Router v7

---

## 1. Product Overview

### 1.1 What Prism Is

Nexora Prism is an AI-powered Chief Operating Officer. It surfaces six dimensions of employee health — Output, Growth, Motivation, Wellbeing, Return, and Risk — and decomposes a CEO's vision into a company roadmap, auto-allocates tasks, and runs daily standups through an AI avatar manager called **Luminary**.

**Prism is not 10 products. It is ONE product — an AI COO — with 10 views into the same intelligence layer.** The screens are windows into a unified data model. The value is the end-to-end chain from vision to execution, not any individual screen.

### 1.2 Vision

> Every person carries more than their job title. Prism brings together every signal — reviews, growth, wellbeing, output — so leaders can see each person whole, and act accordingly.

The core philosophy: **"One score compresses six signals. This page holds them apart."**

### 1.3 Target Users

| User | Need | Primary Pages |
|------|------|---------------|
| CEO / Entrepreneur | Upload vision, review roadmap, monitor revenue, calibrate system | Genesis, Meridian, Spectrum, Synthesis, Calibration |
| Department Head | Department strategy, team performance, budget allocation | Meridian (dept view), Spectrum, Checkpoint, The Race |
| VP/Director of People | Strategic workforce decisions, retention planning | Spectrum, The Race, Meridian |
| Engineering Manager | Team health, 1:1 prep, reviews, approvals | Team, Employee Detail, KPIs, Checkpoint |
| HR Business Partner | Reviews, attendance, wellbeing programs | 360° Resonance, Orbital Presence |
| Employee | Daily standups, task management, self-view | Luminary, Tasks, KPIs |

### 1.4 The Six Dimensions

| # | Dimension | Field | Color | Unit | Invert | Meaning |
|---|-----------|-------|-------|------|--------|---------|
| 01 | Output | `performanceScore` | `#f43f5e` (Rose) | pt | No | Delivery velocity, KPI achievement |
| 02 | Growth | `learningProgress` | `#10b981` (Emerald) | % | No | Learning modules, skill acquisition |
| 03 | Motivation | `motivationScore` | `#f59e0b` (Amber) | pt | No | Engagement level, initiative |
| 04 | Wellbeing | `welfareScore` | `#c084fc` (Purple) | pt | No | Burnout probability, stress index |
| 05 | Return | `roi` | `#38bdf8` (Cyan) | % | No | Revenue contribution vs cost |
| 06 | Risk | `attritionRiskPercentage` | `#fb923c` (Orange) | % | Yes | Flight probability (lower = better) |

### 1.5 Design Language

**"Cinematic data"** — observatory instruments, signal processing displays, editorial typography. Not corporate dashboards. Dark by default (`#030303`) with a warm off-white light mode (`#f2f0eb`).

---

## 2. Information Architecture

### 2.1 Route Map

```
/ ........................ Landing Page (marketing site)
/sign-in ................. Authentication
/enter ................... Threshold Transition (cinematic app entry)
/demo .................... Interactive product demo

EXISTING APP SCREENS:
/app ..................... The Spectrum — THE Hub (index route)
/app/spectrum ............ The Spectrum (alias)
/app/team ................ Team Directory + 1:1 Prep
/app/employee/:id ........ Employee Detail (split-panel editorial)
/app/kpis ................ KPI Goals
/app/leaderboard ......... The Race — Animated Rankings
/app/attendance .......... Orbital Presence — Temporal Patterns
/app/review .............. 360° Resonance — Performance Reviews
/app/reviews ............. 360° Resonance (alias)
/app/tasks ............... Tasks — Kanban + Timers
/app/settings ............ Settings — Preferences

v3 NEW SCREENS:
/app/onboard ............. Genesis — CEO Vision Onboard Wizard (CEO-only)
/app/roadmap ............. Meridian — Company Roadmap (timeline/cascade/kanban)
/app/approvals ........... Checkpoint — Approval Queue + Negotiations
/app/reports ............. Synthesis — NL Report Generation
/app/admin ............... Calibration — System Configuration (CEO-only)

v3 FLOATING:
Luminary ................. AI Manager Overlay (full-screen / compact)
                          Entry animation codename: Dawn Sequence

REDIRECTS:
/app/analytics ........... → redirects to /app
/app/roi ................. → redirects to /app
/app/* ................... 404 — "Signal lost"
```

### 2.2 Navigation — The Dock

macOS-style floating bottom dock. The **only** navigation element.

**Primary Nav (5 items):** Team | KPIs | ✦ Spectrum ✦ | The Race | Tasks

**Feature Nav (expanded tray):** 360° Resonance | Orbital Presence | Meridian | Checkpoint | Synthesis | Settings

**v3 Floating elements:**
- Luminary button — bottom-right, above dock. Triggers Dawn Sequence.
- Notification bell — in-app notifications.

**Role-based visibility:** See PRODUCT_ARCHITECTURE_v3.md §5 for full role matrix.

**Dock behaviour:**
- Spring entrance: `{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }`
- Fixed at `bottom: 2rem`, centered, `backdrop-blur-2xl`
- Labels hidden below `sm`. TV: 1.3× scale. iOS safe area handled.

### 2.3 Page Transition Choreography

| Direction | Animation | Use Case |
|-----------|-----------|----------|
| Lateral | Slide left/right + 2px blur | Same-depth pages |
| Dive | Scale up from 94% + 6px blur | Going deeper |
| Surface | Scale down from 106% + 4px blur | Coming back |
| Fade | Vertical fade 16px | Same position or fallback |

Depth/position maps in `Layout.tsx`:
```typescript
// Depth: 0 = hub level, 1 = feature level, 2 = detail level
'/app': 0, '/app/spectrum': 0, '/app/team': 0, '/app/tasks': 0,
'/app/kpis': 1, '/app/attendance': 1, '/app/leaderboard': 1,
'/app/review': 1, '/app/settings': 1,
// v3 additions:
'/app/onboard': 1, '/app/roadmap': 1, '/app/approvals': 1,
'/app/reports': 1, '/app/admin': 1,
'/app/employee/*': 2
```

### 2.4 Provider Hierarchy

```
ThemeProvider          ← Dark/light CSS class on <html>
  └─ AuthProvider      ← User session { email, name, role_level }
       └─ RouterProvider
            ├─ LandingPage, SignIn, Demo    (public)
            └─ ProtectedRoute
                 ├─ EnterApp               (threshold transition)
                 └─ Layout                 (app shell + dock + cursor + Luminary button)
                      ├─ Spectrum           (with Illuminations + Meridian Pulse)
                      ├─ Team, EmployeeDetail (with Echo Trail + Work Stream)
                      ├─ Tasks, KPIGoals
                      ├─ Attendance (Orbital Presence), Leaderboard (The Race)
                      ├─ PerformanceReview (360° Resonance), Settings
                      ├─ Genesis, Meridian, Checkpoint, Synthesis, Calibration  [v3]
                      ├─ Luminary overlay  [v3, floating]
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
| Notifications | Sonner | 2.0.3 |
| v3: AI | Anthropic Claude API (client-side) | `/v1/messages` |
| v3: Avatar | D-ID or HeyGen (photo-driven animation) | API |
| v3: Voice | ElevenLabs (voice cloning + TTS) | API |
| v3: STT | Web Speech API → Whisper (upgrade path) | Browser / API |
| v3: Email | SendGrid or Resend | API |

### 3.2 Project Structure

```
nexora-prism/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx, routes.tsx, mockData.ts
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx, ThemeContext.tsx, ProtectedRoute.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx, Spectrum.tsx, Team.tsx, EmployeeDetail.tsx,
│   │   │   ├── Tasks.tsx, KPIGoals.tsx, Attendance.tsx, Leaderboard.tsx,
│   │   │   ├── PerformanceReview.tsx, Settings.tsx, ThresholdTransition.tsx,
│   │   │   ├── EnterApp.tsx, Demo.tsx
│   │   │   ├── landing/ (LandingPage, Loader, Navbar, Hero, Features, Journey, CTA, Footer)
│   │   │   ├── ui/ (Dock, DockIcons, CustomCursor, EmptyState, ROIWaveChart, ~40 shadcn)
│   │   │   │
│   │   │   ├── [v3 PLANNED NEW FILES:]
│   │   │   ├── Genesis.tsx              # CEO onboard wizard
│   │   │   ├── Meridian.tsx             # Roadmap (timeline/cascade/kanban)
│   │   │   ├── Luminary.tsx             # AI Manager overlay
│   │   │   ├── Checkpoint.tsx           # Approval queue
│   │   │   ├── Synthesis.tsx            # NL report generation
│   │   │   ├── Calibration.tsx          # Admin / system config
│   │   │   └── ui/
│   │   │       ├── LuminaryButton.tsx   # Floating trigger button
│   │   │       ├── DawnSequence.tsx      # 5-stage entry animation
│   │   │       ├── HUDPanel.tsx         # Floating context panels
│   │   │       ├── ConversationThread.tsx # Hybrid message display
│   │   │       ├── NotificationBell.tsx  # In-app notifications
│   │   │       └── VoiceInput.tsx       # STT microphone component
│   │   ├── [v3 PLANNED:]
│   │   │   ├── services/
│   │   │   │   ├── aiClient.ts          # Anthropic API wrapper
│   │   │   │   ├── avatarService.ts     # D-ID/HeyGen integration
│   │   │   │   ├── voiceService.ts      # ElevenLabs TTS + clone
│   │   │   │   └── notificationService.ts # Email + in-app
│   │   │   └── stores/
│   │   │       ├── companyConfig.ts, conversationStore.ts, roadmapStore.ts
│   └── styles/ (index.css, prism-theme.css, theme.css, responsive.css, fonts.css, tailwind.css)
├── index.html, package.json, vite.config.ts
```

### 3.3 Code Splitting & Loading

Every page lazy-loaded via `React.lazy()`. Two skeleton variants: `PageSkeleton`, `EmployeeSkeleton`. `NotFound` catches unmatched routes.

### 3.4 Authentication

Client-side mock: `localStorage` key `prism_auth_user` storing `{ email, name }`. v3 extends to `{ email, name, role_level }` with 4 roles: `ceo`, `department_head`, `manager`, `employee`.

**v3 Privacy model** (CEO configures per company):
- `full_transparency` — manager sees full transcripts + AI summaries
- `summary_only` — manager sees AI-generated summaries, not raw transcripts
- `layered` — employee can tag topics as "private/HR-only", manager sees everything else

**v3 Conversation memory** (CEO configures per company):
Luminary retains conversation context for: 7 / 30 / 90 days / full history (`-1`). Older conversations are summarised into key facts. See PRODUCT_ARCHITECTURE_v3.md §8 for `CompanyConfig.conversationMemoryDays`.

### 3.5 Theming

Dual-layer: **Prism tokens** (`--p-*`) + **shadcn tokens**. Toggle `.prism-dark`/`.prism-light` on `<html>`. Applied immediately by `ThemeContext`.

---

## 4. Design System

*(Complete token tables, patterns, and copy-paste JSX in SKILL.md. This section covers architectural decisions.)*

### 4.1 Token Architecture

All colours as `--p-*` CSS custom properties in `prism-theme.css`. Seven-level text ladder, three-tier borders, six accent colours with full/low/border tiers, chart tokens, motion tokens.

### 4.2 Light Mode Strategy

Three layers: token redefinition in `.prism-light`, CSS overrides for hardcoded Tailwind classes, component-level `isLight` checks. Warm off-white `#f2f0eb`, deepened accents, 60% grayscale on avatars, `multiply` blend on blobs.

---

## 5. UI/UX Design Principles

1. **Signal, not noise.** Every element must earn its space.
2. **Feel, don't read.** Correlations through interaction.
3. **Editorial, not dashboard.** Magazine profiles.
4. **Dark-first, light-capable.** Data pops on dark.
5. **One score compresses, the page holds apart.** Composite only in The Prism.
6. **Progressive disclosure.** Start quiet, reveal on interaction.

*(Full visual language, interaction patterns, card system, button/control patterns documented in SKILL.md.)*

---

## 6. Page-by-Page Specification — Existing Screens

### 6.1 Landing Page (`/`)

Visual layers: `bg-[#010101]` + fractalNoise (5%) + 12-col grid (3%) + vignette + registration marks.

Sections: Loader (2s, once/session, exploding ring) → Hero (parallax, 3 CSS blobs, 3D text, two CTAs) → Features (4 stacking sticky cards, HUD reticle) → Journey (220vh, SVG path draws on scroll, 3 milestone nodes) → CTA → Footer (18vw "PRISM", `mix-blend-difference`).

### 6.2 The Spectrum — Intelligence Nexus (`/app`)

**THE Hub.** No back button. "The *Spectrum*".

Sections: The Prism (SVG 440×440, 6 concentric rings) → Team Constellation (horizontal scroll, 260×370px cards) → Dimension Rows (6 expandable, TeamScatter) → Illuminations [v3: AI-generated insight cards replacing static Intelligence] → Meridian Pulse [v3: roadmap progress widget] → Deep Analytics (4 tabs: Overview, Capital Dynamics, Wellbeing, Simulation Lab).

### 6.3 Team (`/app/team`)

4 org stat cards + dept bars → filterable grid → employee cards with 1:1 prep (SVG MiniRadar). v3: AI-generated prep from Luminary conversation history. Cards show standup status.

### 6.4 Employee Detail (`/app/employee/:id`)

Split-panel: Left 40% sticky photo, Right 60% scrollable. 8 sections: Telemetry → KPI Goals → Capital Matrix → Neural Pathways → Temporal Dynamics → Impact Nodes → Bio-Rhythms → 360° Resonance.

v3 adds: **Echo Trail** tab (conversation timeline dots) + **Work Stream** tab (task pipeline) + AI performance recommendations.

### 6.5 Tasks (`/app/tasks`)

Kanban: Backlog|Active|Review|Resolved. react-dnd. v3: AI tasks arrive with fading "AI suggested" badge + non-editable `source` field. Negotiation via quick-action dropdown → Luminary.

### 6.6 KPI Goals (`/app/kpis`)

OKR nodes + KPI vectors. `isLowerBetter` flag. v3: AI Recommendations panel + inline suggestion chips.

### 6.7 Orbital Presence (`/app/attendance`)

7 pattern detection algorithms (all implemented): consecutive absences, high absence count, heavy WFH, Monday/Friday, mass bunking, WFH surge, org-wide low presence. v3: standup patterns integrated into detection panel.

### 6.8 The Race (`/app/leaderboard`)

8-quarter bar race. Layout spring animations. 5 metrics + v3: **Meridian Alignment** (6th metric, AI-judged). Play 850ms/step. Winner 👑.

### 6.9 360° Resonance (`/app/review`)

Reviews mode (SVG RadarWeb) + Write mode (4-phase wizard). v3: Progressive AI draft — manager highlights sections to regenerate.

### 6.10 Settings (`/app/settings`)

Theme toggle, notifications, security, sign-out. v3: Luminary preferences (voice/text, immersive/compact, mute default). CEO users → replaced by Calibration.

---

## 7. Page Specification — v3 New Screens

*(Full specifications in PRODUCT_ARCHITECTURE_v3.md §6. Summary here for cross-reference.)*

**UI cohesion rules:** Every new screen follows Prism DNA — hero section (overline + serif italic title), card-based layout, section markers (11px mono uppercase ghost), ambient glow (never box-shadow), spring physics. Two disclosure models:
- **Analytics screens** (Spectrum, Employee Detail, The Race): hover→reveal progressive disclosure.
- **Operations screens** (Checkpoint, Tasks active view): **focus-dim** — all actions visible by default, on hover dim everything EXCEPT the focused card to 60% opacity.

### 7.1 Genesis (`/app/onboard`)
CEO-only cinematic vertical scroll (not a stepped wizard). **Voice-first:** large mic button centered ("Tell us your vision"), upload secondary, text tertiary. 4 sections that transition cinematically: Voice/Upload → AI Summary (split-panel, editable entity cards) → Deep-Dive (avatar conversation, mini-Luminary) → Meridian Preview. SVG progress path draws along right edge. Dock hidden. First-run shows a choice screen: "Begin your Genesis" or "Explore Prism first."

### 7.2 Meridian (`/app/roadmap`)
3 view modes via sub-tab toggle. **Signal Path** (default): glowing milestone nodes on a **true linear proportional time axis** — dates are readable, duration is comparable. Department swim lanes as ambient depth-separated bands. Dependencies as light threads. Toggle-able duration bars and critical path highlighting. **Cascade**: vertical tree of cards. **Kanban**: column layout. All views use Prism card pattern. Filter chips for department/status/date.

### 7.3 Luminary (floating overlay)
**Three experience modes** (employee chooses in Settings, default: cinematic): Always cinematic (full Dawn Sequence) / Quick mode (skip Dawn Sequence, instant room) / Ask each time. Layout: immersive full-screen (default) or compact drawer. Dawn Sequence is **two-phase**: Phase A (0-800ms, client-side animation + API calls fire in parallel) → Warm Hold (breathing glow while APIs respond, 2-5s) → Phase B (avatar materialises + speaks, 1.4s). HUD panels are Prism cards positioned absolutely at screen edges. Default avatar (Prism geometric form + curated voice) when manager avatar not configured. Voice configurable: clone manager OR Prism branded voice.

### 7.4 Checkpoint (`/app/approvals`)
**Card grid** (2-column). Each approval is a full Prism card. **Focus-dim model:** all action buttons (Approve/Reject/Reassign) visible on every card by default. On hover: focused card at full opacity, all others dim to 60%. Multi-select via shift-click with floating action pill above dock. Hero section: "Signal *Checkpoint*." **Fast-track:** simple deadline extensions (≤5 days) skip Luminary — one-line card routes directly to manager. Complex negotiations through Luminary.

### 7.5 Synthesis (`/app/reports`)
Template gallery as Prism cards (3-column grid). Past reports as searchable card grid. Custom reports via text + VoiceInput. **Prism-styled document viewer** (dark background, Prism typography, accent-colored charts). Export generates properly formatted light-background documents. **Execution Velocity** replaces "Revenue Prediction" — three layers: Velocity Score (0-100, primary), Revenue Estimate (secondary, caveated), AI Narrative (contextual).

### 7.6 Calibration (`/app/admin`)
CEO-only. **Scroll-spy sections** (not horizontal tabs) — same vertical scroll + floating dot sidebar as Employee Detail. 7 sections as Prism cards. Avatar setup includes voice choice: "Clone manager voice" or "Use Prism voice" with A/B comparison. Task allocation threshold configurable per manager (all/high+critical/critical/trust AI, default: medium+critical). Privacy as radio cards. Integrations as service cards.

---

## 8. Interaction Design Catalogue

### 8.1 Custom Cursor

Dot (4px, fast spring) + Ring (28→48px, trailing spring). `data-cursor` labels. `mix-blend-mode: difference`/`multiply`. Hidden on touch.

### 8.2 Novel Interactions

| Name | Location | Mechanic |
|------|----------|----------|
| **Prism Orbital** | Spectrum | 6 SVG rings, animated dashoffset, hover isolate, click scroll |
| **TeamScatter** | Dimension rows | Avatars on gradient track, ±9px jitter |
| **Magnetic Data Points** | Capital Dynamics | 12% cursor pull within 100px |
| **Ghost Horizon** | Capital Dynamics | Forecast + growth slider |
| **Cost of Departure** | Capital Dynamics | Click → replacement cost model |
| **Correlation Engine** | Simulation Lab | 6 sliders with physics resistance |
| **Signal Scatter** | Simulation Lab | Any 2 dims → animated scatter |
| **Temporal Rewind** | Simulation Lab | Quarter slider, all 6 dims animate |
| **ROI Bar Race** | The Race | Layout spring animations trade positions |
| **MiniRadar** | Team 1:1 panel | SVG spider, 4 axes |
| **TemporalGrid** | Orbital Presence | 7-col calendar, colour-coded |
| **RadarWeb** | 360° Resonance | 5-axis SVG radar |
| **Dawn Sequence** | Luminary entry | 5-stage, 2.2s: Breath → Warmth → Presence → Greeting → Room [v3] |
| **Echo Trail** | Employee Detail | Timeline dots per standup, sentiment-coloured [v3] |

---

## 9. Data Model

### 9.1 Employee Schema (existing)

```typescript
interface Employee {
  id: string; name: string; role: string; department: string;
  stage: string; avatar: string; skills: string[];
  performanceScore: number; learningProgress: number;
  motivationScore: number; welfareScore: number;
  roi: number; attritionRiskPercentage: number;
  attritionRisk: 'Low'|'Medium'|'High'; trend: 'up'|'down'|'stable';
  revenueContribution: number; costInvestment: number;
  compensation: {...}; roiQuarterly: {...}[];
  engagementLevel: string; recentFeedback: string;
  dailyPerformance: {...}[]; timesheets: {...}[];
  workLogFeedback: {...}[]; okrs: {...}[]; kpis: {...}[];
  projectedPromotions: {...}[]; lmsModules: {...}[];
  reviews360: {...}[]; attendance: {...}; leaveBalance: {...};
  bioRhythm: {...};
  // PLANNED: peerReviews[], equipment[]
}
```

*(Full field definitions in PRODUCT_ARCHITECTURE_v3.md §8. v3 extends with role_level, managerId, assignedAvatarId, standupStreak, strengthTags, weaknessTags, personalityProfile, etc.)*

### 9.2 Global Data Exports

Implemented: `employees` (8), `performanceData`, `globalRevenueForecast`, `globalLearningData`, `orgROIData`, `departmentROI`.
Planned: `alerts`, `globalKPIData`.

### 9.3 v3 New Entities (summary)

`CompanyConfig`, `VisionDocument`, `Roadmap`, `Milestone`, `RoadmapOKR`, `TaskV3` (with negotiation + source), `Conversation`, `ConversationMessage`, `ConversationExtract`, `AvatarConfig`, `PerformanceRecommendation`, `StandupRecord`, `ExecutionVelocity`.

*(Full TypeScript interfaces in PRODUCT_ARCHITECTURE_v3.md §8.)*

---

## 10. Component Library

### 10.1 Existing Components

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
| `EmptyState` | ui/EmptyState.tsx | 7 existing + 5 v3 planned branded empty states |
| `ROIWaveChart` | ui/ROIWaveChart.tsx | Catmull-Rom wave |
| `ThresholdTransition` | ThresholdTransition.tsx | Cinematic entry |
| `Loader` | landing/Loader.tsx | Landing intro |

### 10.2 v3 Planned Components

| Component | Planned File | Purpose |
|-----------|-------------|---------|
| `DawnSequence` | ui/DawnSequence.tsx | 5-stage Luminary entry animation |
| `LuminaryButton` | ui/LuminaryButton.tsx | Floating trigger button with pulse dot |
| `HUDPanel` | ui/HUDPanel.tsx | Floating context panel (tasks, KPIs) |
| `ConversationThread` | ui/ConversationThread.tsx | Hybrid message display |
| `VoiceInput` | ui/VoiceInput.tsx | STT microphone + waveform |
| `NotificationBell` | ui/NotificationBell.tsx | In-app notification center |
| `EchoTrail` | ui/EchoTrail.tsx | Timeline dots for standup history |

Utility classes: See SKILL.md §1.

---

## 11. Glossary — Complete Prism Vocabulary

### v3 New Names

| Name | Type | Route/Location | Meaning |
|------|------|----------------|---------|
| **Genesis** | Screen | `/app/onboard` | The origin of all signals |
| **Meridian** | Screen | `/app/roadmap` | The guiding reference line |
| **Luminary** | Overlay | Floating | A source of light that inspires |
| **Checkpoint** | Screen | `/app/approvals` | Verified before moving forward |
| **Synthesis** | Screen | `/app/reports` | Combining signals into unified output |
| **Calibration** | Screen | `/app/admin` | Tuning the instrument |
| **Illuminations** | Section | Spectrum | Light revealing hidden patterns |
| **Meridian Pulse** | Section | Spectrum | Heartbeat of the roadmap |
| **Echo Trail** | Section | Employee Detail | Echoes of past conversations |
| **Work Stream** | Section | Employee Detail | Flow of work through a person |
| **Meridian Alignment** | Metric | The Race | Alignment to the roadmap |
| **Dawn Sequence** | Animation | Luminary entry | Light filling the room |

### Existing Names

| Name | Location | Meaning |
|------|----------|---------|
| The Spectrum | `/app` | Full decomposition of light; the hub |
| The Prism | Spectrum hero | Instrument that decomposes a beam |
| Constellation | Spectrum | Employee gallery — stars in formation |
| The Race | `/app/leaderboard` | Animated bar-race rankings |
| Orbital Presence | `/app/attendance` | Who is in orbit |
| 360° Resonance | `/app/review` | Signals resonating between peers |
| Telemetry | Employee Detail | Remote measurement of signals |
| Neural Pathways | Employee Detail | Learning — neural connections forming |
| Bio-Rhythms | Employee Detail | Biological rhythms |
| Capital Matrix | Employee Detail | ROI / compensation |
| Impact Nodes | Employee Detail | Points of impact (OKRs) |
| In Orbit / Dark / Standby | Attendance | Present / Absent / Weekend |
| Protocol | Attendance | Leave type ("PTO Protocol") |
| Burnout Corridor | Insight | High output + low wellbeing |
| Flight Risk | Insight | High attrition + high ROI |
| Threshold Transition | Entry | Cinematic app loading |

**Naming rule:** Always evocative, never generic. Draw from optics, light, signal processing, navigation, space/physics.

---

## 12. Performance Architecture

- Lazy loading: all routes code-split
- `useMemo`/`useCallback` for expensive computations
- `requestAnimationFrame` with pending flag for scroll-spy
- CSS `@keyframes` for ambient blobs (GPU compositor)
- `will-change: transform` on blobs, `prefers-reduced-motion` respected
- Images: `loading="lazy" decoding="async"` (hero: `eager`)
- Known areas: extract large components, add virtualisation, replace mock data with API

---

## 13. AI & Agentic Features (v3)

*(Full specifications, AI prompt architecture, data models, phased build plan, and risk mitigations in PRODUCT_ARCHITECTURE_v3.md.)*

### Summary

| Feature | Prism Name | Location |
|---------|-----------|----------|
| CEO vision → roadmap | Genesis → Meridian | New screens |
| AI daily standups | Luminary | Floating overlay |
| Task auto-allocation | Meridian → Tasks | Integrated |
| Approval queue | Checkpoint | New screen |
| AI insight generation | Illuminations | Spectrum section |
| AI performance reviews | Progressive draft | 360° Resonance |
| AI OKR suggestions | Inline chips | KPI Goals |
| AI roadmap contribution | Meridian Alignment | The Race |
| NL report generation | Synthesis | New screen |
| System configuration | Calibration | New screen (CEO-only) |

**Architecture:** Anthropic API (Sonnet for speed, Opus for depth). D-ID/HeyGen for avatar animation. ElevenLabs for voice cloning + TTS. Progressive rendering (full video → voice + static → waveform → text). Web Speech API for STT (Whisper upgrade path).

---

## 14. Appendices

### A. Browser Support

Chrome/Edge 90+, Safari 15+, Firefox 90+, Mobile Safari/Chrome Android.

### B. Accessibility (planned v3)

`aria-label` on SVG, keyboard nav, focus-visible rings, skip-nav, screen reader announcements.

---

*For design tokens, copy-paste patterns, and UI conventions: see SKILL.md.*  
*For v3 AI platform specs, data models, and build plan: see PRODUCT_ARCHITECTURE_v3.md.*
