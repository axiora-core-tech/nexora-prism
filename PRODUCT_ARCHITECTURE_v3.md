# Nexora Prism v3 — Product Architecture Document

**Version:** 3.2 — April 2026  
**Status:** All decisions locked — ready for build  
**Companion docs:** DESIGN_DOCUMENT.md (design system), SKILL.md (UI/UX conventions)

---

## 1. Product Thesis

**Before:** Prism is a people analytics dashboard — you look at data.  
**After:** Prism is an AI-powered Chief Operating Officer — it acts on data.

**Prism is not 10 products.** It is ONE product — an AI COO — with 10 views into the same intelligence layer. The screens are windows, not features. The value is the chain:

```
CEO's Vision Document
        ↓
   Genesis              ←── voice-first upload, parse, guided deep-dive
        ↓
   Meridian             ←── actionable roadmap, department-level
        ↓
   Department OKRs      ←── auto-generated, weighted by priority
        ↓
   Individual Tasks     ←── allocated by strength + capacity → Checkpoint
        ↓
   Luminary Standups    ←── avatar-driven, voice-enabled, tracked
        ↓
   Intelligence Loop    ←── Illuminations, auto-calibrate, Synthesis
        ↓
   Execution Velocity   ←── feeds back to CEO for Meridian recalibration
```

The goal: **CEO focuses on vision. Prism runs operations.**

---

## 2. Decisions Register

All product decisions locked during brainstorming.

### 2.1 Foundation Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Product identity | Prism evolves — same product, same brand |
| 2 | Role hierarchy | 4 roles: CEO, Dept Head, Manager, Employee. Start CEO + Employee, add others incrementally |
| 3 | Avatar visual | Full realistic animated face/body of actual manager, photo-driven (HeyGen/Synthesia style) |
| 4 | CEO onboarding | Hybrid: quick summary of uploaded doc, then guided deep-dive conversation |
| 5 | Bot personality | Adaptive — adjusts tone based on employee's performance level and personality |
| 6 | Privacy model | Configurable per company — CEO chooses transparency level |
| 7 | Financial data | All sources: mock now → manual CEO input → API integrations (QuickBooks, Xero, BambooHR, Workday) |
| 8 | Task allocation | Threshold-based: small auto-assign, large need approval. Employees negotiate → auto-triggers approval |
| 9 | MVP scope | Full system — architect everything, build in functional layers |
| 10 | Avatar animation | Photo-driven — manager uploads photo, AI animates lip-sync + expressions |
| 11 | Avatar voice | Configurable per avatar: clone manager's actual voice OR use curated Prism branded voice. CEO chooses in Calibration. |
| 12 | Avatar response | Default: text + voice + animated avatar simultaneously. User can mute voice. Text + avatar always show. |
| 13 | Device support | Progressive — full avatar on capable, voice + static fallback on weak |
| 14 | Speech-to-text | Browser Web Speech API now, upgrade to Whisper later |
| 15 | Conversation memory | Configurable per company: 7 / 30 / 90 days / full history |
| 16 | Notifications | Email + in-app notifications |

### 2.2 Screen-Specific Decisions

| # | Screen | Decision | Choice |
|---|--------|----------|--------|
| 17 | Genesis | Document upload | Single default + "Add more documents" for multi-doc |
| 18 | Genesis | Voice input | First-class — voice dictation alongside upload and text paste |
| 19 | Genesis | AI summary editing | Both — inline edit for obvious fixes + conversation for nuance |
| 20 | Meridian | Visualization | Multiple views — user toggles between timeline, cascade, and kanban |
| 21 | Meridian | Visibility | CEO + Dept Heads full, Managers dept, Employees see parent OKRs. Also configurable per company. |
| 22 | Luminary | Spatial concept | Full-screen immersive (default) OR compact overlay (user choice) |
| 23 | Luminary | Ambient context | HUD-style — floating context panels that avatar actively references |
| 24 | Luminary | Transcript | Hybrid — latest 2-3 messages as floating cards, full history in expandable panel |
| 25 | Luminary | Entry animation | "Dawn Sequence" — 5-stage, 2.2s choreographed sequence (see §6.3.1) |
| 26 | Luminary | Employee speaking | Avatar listening pose + live word-by-word transcript (real-time STT) |
| 27 | Luminary | Action creation | Live card + confirmation. No significant deviation → auto-create. Otherwise → Checkpoint. |
| 28 | Checkpoint | Layout | Card grid with hover→reveal actions, shift-click multi-select (Prism-native, no list/checkbox) |
| 29 | Checkpoint | Negotiation | Bot-mediated — negotiation goes through Luminary (bot mediates between employee and manager) |
| 30 | Synthesis | Output | In-app rendered document for review, then one-click export to PDF/DOCX |
| 31 | Calibration | Avatar setup | Live animated preview essential — manager sees themselves animated before going live |
| 32 | Spectrum | AI briefing (Illuminations) | Structured cards — same layout as today but AI-generated and richer |
| 33 | Employee Detail | Echo Trail (conversations) | Timeline — visual dots per standup, hover/click for detail |
| 34 | Tasks | AI task badge | Badge shows "AI suggested" initially, fades after accept. Non-editable `source` field always auditable. |
| 35 | Tasks | Negotiation flow | Quick action first (inline pill buttons for request type), then Luminary opens for discussion |
| 36 | KPIs | AI suggestions | Both — panel for overview at top, inline chips on specific OKRs. Panel links to relevant OKR. |
| 37 | Orbital Presence | Missed standups | Integrated into pattern detection only — calendar unchanged, flagged in AI patterns panel |
| 38 | The Race | Meridian Alignment | Structured 5-sub-score rubric (task completion 25%, revenue 20%, standup 20%, peer 15%, initiative 20%). Consistency check: re-run if variance > 8 pts. |
| 39 | 360° Resonance | AI draft | Progressive — AI shows draft, manager highlights sections to regenerate or accepts whole thing |

### 2.3 Design Philosophy Decisions (from critical review)

| # | Area | Decision | Choice |
|---|------|----------|--------|
| 40 | Luminary | Experience modes | Employee chooses: Always cinematic / Quick mode / Ask each time. Default: cinematic. |
| 41 | Operations | Disclosure model | Focus-dim: all actions visible by default. On hover, dim everything EXCEPT focused card. Applies to Checkpoint and active Tasks. |
| 42 | Theme | Default mode | Dark for demo. Light mode exists but not fully polished. Production: consider role-based defaults. |
| 43 | Meridian | Signal Path time axis | True linear proportional time axis with glowing nodes and light threads. Beauty WITH utility. Milestone duration bars toggle-able. Critical path highlight toggle. |
| 44 | Tasks | Negotiation fast-track | Simple requests (≤5 day extension, no scope change) skip Luminary — one-line card to Checkpoint. Complex requests (reassign, scope, >5 days) go through Luminary. |
| 45 | Tasks | Allocation threshold | Configurable per manager: "All need approval" / "High+Critical" / "Critical only" / "Trust AI." Default: medium+critical. New managers: "All" for first 30 days. |
| 46 | Luminary | Voice option | Configurable per avatar: "Clone manager voice" OR "Prism branded voice." CEO chooses in Calibration. A/B comparison available during setup. |
| 47 | Genesis | Input hierarchy | Voice-first: large mic centered ("Tell us your vision"). Upload secondary. Text paste tertiary. Matches entrepreneur thinking style. |
| 48 | Mobile | Strategy | Document for production only. Demo is laptop-only. Production needs: mobile-first standup, swipe-approve, pulse-check views. |
| 49 | Product | Identity frame | Prism is 1 product (AI COO) with 10 views into the same intelligence layer. The pitch is the chain, not the screens. |
| 50 | Dimensions | v3 signal placement | 6 dimensions sacred. v3 signals (standup, roadmap, task) are leading indicators distributed across their natural screens. No new rings. No forced mappings. |
| 51 | Revenue | Execution Velocity | Three layers: Velocity Score (0-100, primary), Revenue Estimate (secondary, caveated), AI Narrative (contextual). Not a "revenue prediction" — an operational momentum measure. |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     PRISM CLIENT (React SPA)                      │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Existing  │ │ Genesis  │ │ Luminary │ │ Task     │ │Check-  │ │
│  │ Prism     │ │ (CEO     │ │ (AI Mgr  │ │ Engine   │ │point   │ │
│  │ Pages     │ │ Onboard) │ │ Overlay) │ │ (AI)     │ │        │ │
│  └─────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│        └────────────┴────────────┴─────────────┴───────────┘      │
│                              │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐ │
│  │                 AI Service Layer (client-side)                 │ │
│  │  Anthropic API │ Voice Pipeline │ Avatar Pipeline │ Doc Parse │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                      Data Layer                                │ │
│  │  Mock Data │ Conversation Store │ Meridian Store │ Company Config│ │
│  └───────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

External Services:
  Anthropic Claude API ── D-ID / HeyGen (Avatar) ── ElevenLabs (Voice Clone)
  SendGrid/Resend (Email)

Future Integrations (placeholders built):
  QuickBooks/Xero ── BambooHR/Workday ── Slack/Teams ── Google Calendar
```

### 3.2 Three AI Pipelines

**Pipeline 1: Strategic Intelligence (CEO-facing)**
Vision doc → parse → Claude Opus deep analysis → roadmap + OKRs + risks + gaps → present → guided Q&A → refined roadmap → CEO approves → roadmap becomes system north star.

**Pipeline 2: Operational Orchestration (system-level)**
Roadmap OKRs → Claude Sonnet task decomposition → match to employees (skills + capacity + growth opportunity) → threshold check → auto-assign or route to Checkpoint → notify → daily re-evaluate from standup data.

**Task allocation threshold (configurable per manager in Settings):**
- Each manager sets their comfort level: "All tasks need my approval" | "High + Critical only" | "Critical only" | "Trust the AI (exceptions only)"
- **Default: Medium + Critical need approval** (high and critical tasks route to Checkpoint; low and medium auto-assign)
- CEO can set a company-wide default in Calibration. Individual managers override in their Settings.
- New managers default to "All tasks need approval" for the first 30 days, then switch to the company default. This builds trust gradually.

**Pipeline 3: Luminary (employee-facing)**
Employee profile + conversation history + tasks + KPIs → build context window (configurable depth) → Claude Sonnet conversational response (adaptive personality) → text streams first → ElevenLabs TTS (cloned voice) → D-ID avatar animation → store transcript + extract action items + sentiment.

**Context window construction (critical for conversation quality):**
Claude receives three tiers of context, in order of priority:
1. **Permanent context:** Employee personalityProfile, strengthTags, weaknessTags, current role, department, active tasks, KPI targets. Always included regardless of memory settings.
2. **Extracted key facts:** After each conversation, the system extracts and stores: ongoing blockers, commitments made, wins celebrated, concerns raised, goals discussed. These extracted facts persist **permanently** even when raw transcripts are deleted per conversationMemoryDays. Stored as `ConversationExtract[]` on the Employee entity.
3. **Recent raw transcripts:** Full conversation text within the memory window (7/30/90/all days). Included for conversational continuity ("you mentioned yesterday…").

This three-tier approach means: even if conversationMemoryDays = 7, the AI remembers that "Arjun has been blocked on the auth module for 3 weeks" (extracted fact from week 1, persists) while not having access to the raw transcript of what Arjun said on day 1.

```typescript
interface ConversationExtract {
  employeeId: string;
  extractedAt: string; // date of the conversation this was extracted from
  ongoingBlockers: string[];
  commitmentsMade: string[];
  winsNoted: string[];
  concernsRaised: string[];
  keyTopics: string[];
  sentimentTrend: 'improving' | 'stable' | 'declining';
}
```

### 3.3 Avatar Technology Stack

**Setup (one-time per manager):**
- Photo upload → D-ID/HeyGen avatar generation → live preview with sample phrase → CEO approves
- Voice sample (2-5 min recording) → ElevenLabs voice clone generation → test playback

**Runtime (every conversation turn):**
- Claude text response → ElevenLabs TTS (cloned voice) → D-ID lip-sync animation
- Text streams to UI first (instant), voice plays alongside, avatar animates in sync
- User can mute voice — text + avatar always visible

**Progressive rendering tiers:**
- Capable device: Full animated avatar video
- Medium device: Avatar image + voice audio
- Weak device: Waveform visual + voice
- No audio: Text chat only

### 3.4 Voice Pipeline

```
EMPLOYEE SPEAKS                    BOT RESPONDS
Microphone capture                 Claude generates text
       ↓                                  ↓
Web Speech API (STT)               Text streams to UI (instant)
       ↓                                  ↓
Live word-by-word transcript       ElevenLabs TTS (cloned voice)
       ↓                                  ↓
Complete text → Claude prompt      Audio + D-ID avatar animation
                                          ↓
                                   All three arrive: text + voice + face
                                   (User can mute voice; text + avatar always show)
```

---

## 4. Role-Based Access Control

### 4.1 Permission Matrix

| Feature | CEO | Dept Head | Manager | Employee |
|---------|-----|-----------|---------|----------|
| Upload vision document | ✅ | ❌ | ❌ | ❌ |
| View/edit company roadmap | ✅ | Own dept | ❌ | Parent OKRs |
| Configure privacy/memory/avatar | ✅ | ❌ | ❌ | ❌ |
| View all employee data | ✅ | Own dept | Own reports | Own only |
| View conversation transcripts | ✅ per privacy | Own dept per privacy | Own reports per privacy | Own always |
| Approve tasks | ✅ | Own dept | Own reports | ❌ |
| Negotiate tasks | ❌ | ❌ | ❌ | ✅ (own) |
| Talk to Luminary | ❌ | ❌ | ❌ | ✅ |
| View AI insights/reports | ✅ All | ✅ Dept | ✅ Team | ✅ Personal |
| Salary/promotion suggestions | ✅ | View dept | View reports | ❌ |
| Financial data / revenue | ✅ | Dept budget | ❌ | ❌ |
| System admin | ✅ | ❌ | ❌ | ❌ |

### 4.2 Privacy Configuration (CEO sets)

| Level | Employee Sees | Manager Sees |
|-------|---------------|-------------|
| **Full Transparency** | Everything | Full transcripts + AI summaries |
| **Summary Only** | Own full transcripts | AI-generated theme summaries only |
| **Layered** | Everything, can tag topics as "private" | Full minus private-tagged (HR-only) |

---

## 5. Navigation — Updated Dock

**Primary Nav (5 items):** Team | KPIs | ✦ Spectrum ✦ | The Race | Tasks

**Note on dock labels vs page titles:** The dock icon label for The Race currently reads "Rankings" in the existing codebase (`Dock.tsx`). v3 code update required: change dock label to "The Race" to match the page hero title. All docs use "The Race" — code must be aligned.

**Feature Nav (expanded tray — 6 items):** 360° Resonance | Orbital Presence | Meridian | Checkpoint | Synthesis | Settings

**Floating elements (not in dock):**
- Luminary button — bottom-right, above dock. Pulsing accent dot when pending items. Opens full-screen immersive (default) or compact overlay (user preference). Triggers Dawn Sequence on open.
- Notification bell — integrated near dock or top area.

**Role-based visibility:**
- Employee: Primary nav + Luminary button. No Checkpoint, no Synthesis, no Calibration.
- Manager: Primary nav + Checkpoint in feature tray.
- CEO: Everything + Calibration in feature tray (replaces Settings position).

**Route aliases and redirects** (carried from existing system):
- `/app/spectrum` → alias for `/app` (Spectrum)
- `/app/reviews` → alias for `/app/review` (360° Resonance)
- `/app/analytics` → redirects to `/app`
- `/app/roi` → redirects to `/app`

**Transition depth/position maps:** v3 routes are added to the existing maps in `Layout.tsx`. See DESIGN_DOCUMENT.md §2.3 for the complete depth map including all v3 routes (Genesis, Meridian, Checkpoint, Synthesis, Calibration all at depth 1).

---

## 6. Screen Specifications — New Screens

### 6.1 Genesis — CEO Onboard Wizard (`/app/onboard`)

CEO-only. **Cinematic vertical scroll** — not a stepped wizard with numbered tabs.

**First-run detection:** After ThresholdTransition, `Layout.tsx` checks: if `user.role_level === 'ceo'` AND no `VisionDocument` exists in store → show a **choice screen** (not a hard redirect):

- Full-screen, cinematic. Two large Prism cards side by side:
  - Left card: "Begin your *Genesis*" — "Upload your vision and let Prism build your roadmap." CTA → `/app/onboard`. Primary card, ambient glow, prominent.
  - Right card: "Explore *Prism* first" — "See the analytics platform with sample data before onboarding." CTA → `/app` (Spectrum loads with mock/sample data). Secondary card, dimmer.
- A persistent but non-intrusive banner appears on Spectrum: "AI features require Genesis. [Start Genesis →]" — dismissible but returns on next visit until Genesis is complete.
- This allows demo flexibility: show Spectrum first ("here's the analytics"), then Genesis ("now watch the CEO onboard").
- All other roles skip this choice entirely — they land on Spectrum as normal.

**Empty state:** If CEO navigates to Genesis after completing it, show "Genesis Complete" state with option to "Re-run Genesis" (archives current Meridian, starts fresh).

**Overall structure:** Genesis is a single page with 4 sections that transition cinematically. No numbered step indicators. Instead, a minimal SVG progress path draws along the right edge as the CEO advances (inspired by the landing page Journey path — a vertical line with 4 milestone dots that glow as sections complete). Each section fades in when the previous completes. The Dock is hidden during Genesis — this is a focused, distraction-free experience.

**Section 1: "Share your *Vision*"**
Hero section with serif italic title. Below: a single large Prism card (`rounded-[2rem]`, `p-bg-card`, ambient glow blob top-right) with **voice as the primary input**:
- **Voice dictation (PRIMARY — centered, largest element):** A large mic button (`w-20 h-20`, centered in the card), surrounded by a subtle animated ring (Prism ring motif, pulse). Below: "Tell us your vision" in serif italic (`p-text-dim`). On tap: VoiceInput activates, live transcript streams below the mic as CEO speaks. The card transforms — mic shrinks to corner, transcript takes the full card area. CEO speaks for 2-10 minutes. "Done" button when finished.
- **Upload (SECONDARY — below voice):** "Or upload a document" as a text link below the voice area. On click, expands to show the Prism-styled upload card with animated border pulse. "PDF, DOCX, or text." Collapses back when not needed.
- **Text paste (TERTIARY — below upload):** "Or type it directly" as a smaller text link. Expands to a text area (`p-bg-input`). For CEOs who prefer writing.
- **"Add more documents":** Subtle text link, expands additional upload slots.
- On any input complete: section subtly fades to 80% and Section 2 animates in below with a spring entrance.

**Section 2: "Here's what we *Understood*"**
Split panel layout (same pattern as Employee Detail: left 40%, right 60%):
- **Left (40%):** Original document rendered in a scrollable Prism card. If voice dictation, shows the transcript. Section marker: `SOURCE DOCUMENT`.
- **Right (60%):** AI-extracted entities, each as a Prism card:
  - Mission card: large serif italic quote, with an Edit (pencil) icon that appears on hover. Click → inline edit (text transforms to `p-bg-input` textarea). Spring animation on transition.
  - Revenue targets card: font-mono numbers in a mini table (same pattern as Capital Matrix in Employee Detail). Editable on click.
  - Resources card: 3 stat values (money / headcount / months) as large font-mono numbers with unit labels. Click any to edit.
  - Constraints card: pill chips (same as department pills). Click to edit, `+` to add.
  - Unknowns card: amber-tinted insight cards (same pattern as Illuminations watch-level cards) for items the AI couldn't determine. Each has a "Clarify" CTA.
- "Looks right? Let's refine." — CTA button at bottom triggers Section 3. Button uses primary CTA pattern (`bg-white text-black` or accent-filled).

**Section 3: "Let's go *Deeper*"**
Conversational interface with the avatar (CEO's own configured avatar, or default Prism avatar if not yet set up). This section uses a simplified version of the Luminary layout:
- Avatar video (smaller than full Luminary — `w-32 h-32` circular, centered at top of section)
- Conversation thread below (same floating card pattern from Luminary §6.3)
- VoiceInput at bottom
- AI asks 3-5 clarifying questions at a time, referencing specific unknowns from Section 2
- "I have enough to generate your roadmap" — AI says this when satisfied. CTA appears: "Generate Meridian"

**Section 4: "Your *Meridian*"**
Full Meridian preview (renders the Meridian component inline). Milestones, department OKRs, risks, gaps, revenue forecast — all generated by AI. CEO can click milestones to edit. "Activate Meridian" CTA at bottom — large, prominent, emerald accent.

**Task decomposition flow (triggered by "Activate Meridian"):**
- **Async with progress:** Full-screen overlay (same blur/dim as Dawn Sequence Stage 1). SVG animation: a prism splitting a beam of light into multiple colored rays — one ray per milestone. Each ray lights up as its milestone decomposes. Text: "Decomposing milestone 3 of 12… Creating tasks for Engineering OKRs…"
- **Duration estimate:** ~3-5 seconds per milestone. A 12-milestone roadmap takes ~45-60 seconds.
- **Error handling:** If decomposition fails for a specific milestone: that ray turns amber. "Could not generate tasks for [milestone name]. [Retry] [Skip]." Partial success is allowed.
- **Completion:** All rays complete. "Your Meridian is live. [n] tasks created across [m] departments." CTA: "View Meridian" → navigates to `/app/roadmap`. Dock reappears.

### 6.2 Meridian — Company Roadmap (`/app/roadmap`)

**Empty state:** If no active Roadmap exists, show `meridian` EmptyState: "No roadmap active. Complete Genesis to generate your Meridian." CTA → `/app/onboard`.

**Meridian state machine:**
- `draft` — Created by Genesis. CEO can edit freely. Not visible to non-CEO roles.
- `approved` — CEO clicks "Approve Roadmap" in Genesis Step 4. Visible to all (role-scoped). Tasks not yet created.
- `active` — CEO clicks "Activate Roadmap." Task decomposition runs. Tasks created and assigned. This is the operational state.
- `archived` — CEO creates a new roadmap (re-runs Genesis). Previous roadmap archived. Existing tasks from archived roadmap are marked `orphaned` and appear in a "Legacy Tasks" filter on Tasks page. Only one `active` roadmap at a time.

**Hero section:**
```
Back button → Overline: Map icon + "Company roadmap"
Title: "The *Meridian*"
Hero stats: Milestones (total), On track (%), At risk (count), Completion (% ring)
Border-bottom
```

Three view modes. Toggle uses the **sub-tab pattern** (accent-colored with icons, `rounded-xl`, cyan border on active):
- Signal Path icon (horizontal wave) | Cascade icon (vertical tree) | Kanban icon (3 columns)

**Signal Path View (default):** Reimagined Gantt — Prism aesthetic with true project management utility. A horizontal SVG visualization:
- **Linear time axis (top):** A true proportional time scale — NOT just labels. Months/quarters as section markers (`font-mono p-text-ghost`) with gridlines (`0.5px p-border`) at regular intervals. Milestone node position is EXACTLY proportional to its date on the axis. This means the CEO can visually compare duration and spot scheduling gaps. Current date shown as a bright vertical line (`p-cyan`, 80% opacity, subtle glow) labeled "Today."
- **Department swim lanes** as ambient horizontal bands separated by blur depth (subtle `p-bg-card` strips with 60px height, `blur-[2px]` gap between lanes). Department name as section marker (`11px mono uppercase ghost`) at left edge.
- **Milestones as glowing nodes** positioned ON the time axis per their deadline date. Node: circular (`w-10 h-10`), filled with status color (emerald on-track, amber at-risk, rose blocked, cyan completed). Ambient glow halo around each node (`blur-[20px]`, same color at 15% opacity). Milestone title as `text-xs p-text-mid` below the node. **Date shown on hover** in a tooltip: "Mar 15, 2026 — 12 days remaining."
- **Milestone duration bars** (optional, toggle-able): thin horizontal bar (`h-2`, accent color at 20% opacity) extending from milestone start date to end date. Shows duration visually like a Gantt bar, but thin and ambient — not the chunky colored blocks of traditional Gantt charts.
- **Dependencies as light threads** — thin lines (`0.5px`, accent color at 30% opacity) curving between connected milestones. Bézier curves that arc gently. On hover of a milestone: its dependency threads brighten to full opacity, unconnected nodes dim. **Critical path** (longest dependency chain) shown with slightly thicker threads (`1px`) and brighter opacity when "Show critical path" toggle is active.
- **Zoom:** Scroll to zoom (quarter → month → week). Pinch on touch. At week zoom, individual task nodes appear within milestones.
- **Click milestone** → in-place expansion (AnimatePresence): child OKRs appear as smaller nodes below, connected by leader lines. Click OKR → expand to see child tasks as pill chips.

**Cascade View:** Vertical tree flowing downward. Vision at top (large card) → Milestones (medium cards, indented) → OKRs (smaller cards, further indented) → Tasks (pill chips). Each level uses a different card size but same Prism card pattern (`rounded-[2rem]`, `p-bg-card`). Connecting lines as thin leader lines (same `0.5px` as dependency threads). Collapsible at each level — click to expand/collapse with spring animation.

**Kanban View:** Four columns: Not Started | In Progress | At Risk | Completed. Column headers as section markers. Milestone cards in each column — same Prism card pattern. Drag to change status (react-dnd, spring physics on drop). Same card as Signal Path's expand view — just arranged in columns instead of on a timeline.

**Filtering and search (all views):**
- Filter by: department (multi-select), status (not started / in progress / at risk / completed), date range (start/end pickers)
- Search: text search across milestone titles, OKR titles, and task titles
- Default: completed milestones collapsed (expandable). At-risk milestones highlighted.
- Pagination: virtual scroll for roadmaps with 50+ milestones. Load 20 at a time.

**Common elements across all views:**
- Milestone cards: progress ring, status badge, assigned department, task count, deadline
- Risk panel (slide-out): severity-sorted risk cards with mitigation suggestions
- Gap analysis panel: skill gaps, resource gaps, process gaps with AI suggestions
- Execution Velocity integration (from Spectrum Capital Dynamics + Execution Velocity widget)

**Visibility by role:**
- CEO: Full roadmap, all departments. Can edit everything (see editing permissions below).
- Dept Heads: Full roadmap visible, but can only edit milestones assigned to their department. See cross-department milestones as read-only context.
- Managers: Their department's milestones and OKRs. Other departments hidden.
- Employees: Only the OKRs that are parents of their assigned tasks. Provides "why this task matters" context.
- All configurable per company (CEO can make roadmap fully visible for maximum alignment)

**Editing permissions (CEO/Dept Head only):**
- Drag milestone to reschedule → AI recalculates downstream task deadlines + warns about dependency conflicts. Affected employees notified.
- Edit milestone title/description → allowed at any time. No cascade effect.
- Add milestone post-activation → triggers decomposition for new milestone only. Existing tasks unaffected.
- Remove milestone post-activation → milestone archived (soft delete). Child tasks marked `orphaned`, appear in Legacy Tasks filter. Checkpoint approvals for those tasks auto-cancelled.
- Edit OKR targets → AI flags affected tasks. "Recalculate tasks for this OKR?" confirmation prompt.
- Audit trail: every edit logged with timestamp, user, before/after values. Visible in milestone detail panel → "History" tab.

### 6.3 Luminary — "The Room" (Floating overlay, accessible from any `/app/*` page)

This is the **flagship screen** — the product's signature experience.

**Trigger:** Floating button bottom-right, above dock. Pulsing accent dot when employee has pending standup or tasks.

**Luminary experience modes** (employee configurable in Settings):
- **Always cinematic (DEFAULT):** Full Dawn Sequence + avatar + voice on every open. The immersive experience.
- **Quick mode:** Skips Dawn Sequence entirely. Opens directly to the conversation room (no warm hold, no avatar materialise animation). Avatar is already present. Text input focused. For employees who prioritise speed over spectacle.
- **Ask me each time:** On open, a brief choice appears over the warm void: "Full experience" (→ Dawn Sequence) or "Quick update" (→ instant room). Two pill buttons, fades out in 3s if no selection (defaults to cinematic).

**Layout modes** (also in Settings): Immersive full-screen (default) or Compact drawer. Independent of experience mode — employee can use "quick mode + immersive" or "cinematic + compact."

**Default Luminary (when manager avatar is not yet configured):**
If the assigned manager has no `AvatarConfig` in the system (photo not uploaded, voice not cloned), Luminary uses a default:
- **Default avatar:** A Prism-branded abstract visual — a softly animated geometric form (concentric rings resembling The Prism, gently pulsing with warm ambient light). Not a generic human silhouette. The geometric form lip-syncs by pulsing its rings in rhythm with speech.
- **Default voice:** A high-quality standard TTS voice from ElevenLabs (pre-selected, warm and professional, not robotic). Not a clone — a curated stock voice.
- **Greeting adaptation:** "Hi [name], I'm your Luminary. Your manager's avatar is being set up — in the meantime, I'll look a little different, but I work the same way."
- **Transition:** When the manager's avatar IS configured later, the next Luminary session shows the real avatar with a brief intro: "I have a new look! Your manager's avatar is now live."

#### 6.3.1 Dawn Sequence — Entry Animation (Two-Phase)

Designed to make the employee feel warm, welcomed, and valued. Split into two phases to account for real API latency.

**Phase A — Client-Side (0–800ms, no API dependency):**

**Stage 1: The Breath (0–400ms)**
The Prism UI exhales. Every element on the current page gently scales to 0.96 + blur 8px + fades to 40% opacity. Ambient blobs slow to half speed. Dock sinks 20px below viewport. The room is making space for someone to arrive.
Ease: `cubic-bezier(0.4, 0, 0.2, 1)`

**Stage 2: The Warmth (300–800ms, overlaps Stage 1 by 100ms)**
A warm radial gradient blooms from centre — soft amber/rose at 3% opacity. Like a lamp turning on in a dark room. Two concentric circles pulse once outward (Prism's signature ring motif) then dissolve. Screen is now a warm, quiet void.

**API calls fire in parallel at 200ms** (during Stage 1): Claude greeting generation + ElevenLabs TTS + D-ID avatar video. All three fire simultaneously, not sequentially.

**The Warm Hold (800ms → API ready, typically 3–5 seconds):**
The warm void holds. A gentle breathing animation — the ambient glow expands and contracts subtly (scale 1.0→1.02→1.0, 2s cycle). Three soft dots pulse at the centre, like a heartbeat. This isn't a "loading spinner" — it's an anticipation state. The room is warm and waiting. The feeling: "someone is about to walk in."

If API responds in < 2s (fast connection, cached responses): the warm hold is barely noticeable — feels like one smooth 3s animation. If API takes 5s: the hold feels intentional, like a beat before a curtain rises. If API takes > 8s: text appears first ("Good morning, Arjun…") as a floating card, avatar follows when video is ready.

**Phase B — API-Dependent (API ready → +1.4 seconds):**

**Stage 3: The Presence (0–700ms after API ready)**
The avatar materialises from centre: opacity 0→1, scale 0.92→1.0, y +30→0. A subtle light sweep crosses the avatar's face left-to-right, like morning sun through a window. Avatar's eyes make "contact" — idle animation begins (micro-movements, blinks). Feels like someone just looked up and saw you walk in.

**Stage 4: The Greeting (400–1000ms after API ready)**
Avatar speaks the pre-generated greeting. Text appears as floating card below avatar. Voice plays simultaneously. The greeting was generated during the Warm Hold — it plays immediately once the avatar is visible.

**Stage 5: The Room Forms (800–1400ms after API ready)**
HUD context panels glide in from edges (spring stagger 80ms apart):
- Task summary panel (left edge)
- KPI snapshot (right edge)
- Deadline pill (top area)
- Mic input area fades in at bottom with soft pulse — "I'm listening."
Full Luminary room is now live.

**Total perceived time:** 0.8s animation + 2-5s warm anticipation + 1.4s avatar reveal = **4–7 seconds realistic**. Every second is intentional and warm — never a blank screen, never a spinner.

**Exit:** Reverse phases B→A in 0.8s (fast). Skip the warm hold on exit.

**Stage 5: The Room Forms (1600–2200ms)**
HUD context panels glide in from edges (spring stagger 80ms apart):
- Task summary panel (left edge)
- KPI snapshot (right edge)
- Deadline pill (top area)
- Mic input area fades in at bottom with soft pulse — "I'm listening."
Full Luminary room is now live.

**Exit:** Reverse stages 5→1 in 0.8s (3× faster out). Quick and clean — returning to work shouldn't feel ceremonial.

#### 6.3.2 Immersive Mode Layout (default)

Full-screen takeover. The existing Prism UI is blurred behind.

**Top half (~55%):** Avatar video feed, large and central. The avatar is the focal point. Warm ambient glow behind the avatar. Manager name + department shown subtly.

**HUD Context Panels:** Prism cards positioned absolutely at screen edges — same visual DNA as every other card in the app (`rounded-2xl`, `p-bg-card`, `backdrop-blur-xl`, `1px solid var(--p-border)`), just floating instead of in the page flow. Section markers (`11px mono uppercase p-text-ghost`) as panel headers. Ambient glow blob optional. The avatar actively references these panels during conversation ("I see your API task is 3 days overdue…" while the task panel subtly pulses).
- Left: Current tasks (title, status pill, due date) — 3-4 visible, scrollable within the panel
- Right: KPI snapshot (top 3 KPIs with current/target, accent-colored progress bars)
- Top: Next deadline countdown pill + standup streak counter (font-mono, emerald accent)
- Panels can be dismissed individually (fade out with spring); reappear next session

**Conversation area (bottom ~45%):**
- Latest 2-3 messages visible as floating cards (hybrid transcript style)
- Employee messages: right-aligned, card style
- AI manager messages: left-aligned, with mini avatar circle
- Voice messages show waveform + play button + transcript text
- Full history: expandable panel, pull up from bottom or dedicated button

**Input area (bottom edge):**
- Large microphone button (hold to talk or toggle)
- Text input field alongside
- Mode toggle: "Voice" / "Text"
- When employee is speaking: avatar shows listening pose (head tilt, eye contact, subtle nods) + live word-by-word transcript appears in the conversation area

#### 6.3.3 Compact Mode Layout (user choice)

Right-side drawer. **Desktop:** 40% viewport width, slides in from right edge. **Mobile:** full-screen (identical to immersive). **Tablet:** 55% width.

- **Avatar:** Smaller circular video (120×120px) in the drawer header, centred. No Dawn Sequence — instant slide-in with spring animation.
- **Chat thread:** Standard scrollable conversation below avatar. Full message history visible (not limited to 2-3 floating cards).
- **HUD panels:** Not floating at screen edges. Instead, condensed into a collapsible "Context" accordion section at the top of the drawer, above the chat thread. Collapsed by default — employee taps to expand.
- **Input:** Same mic button + text input at drawer bottom.
- **Voice:** Avatar lip-syncs in the small circle. Text streams simultaneously.
- **Entry/Exit:** Slide in from right (0.4s, spring). No blur/dim on the Prism UI behind — the user can see both the app and the conversation.

#### 6.3.4 Action Creation During Conversation

When the bot identifies an action item ("I'll create a task for the API refactor"):
1. A task card animates into the conversation thread
2. Employee can tap to view, modify title/description/deadline
3. If modification has **no significant deviation** from AI's intent → auto-created and assigned
4. If modification is **significant** → routes to Checkpoint approval queue
5. Non-editable `source: 'ai_standup'` field on the task is always auditable

**"Significant deviation" definition** — any ONE of these triggers Checkpoint routing:
- Title similarity < 70% (measured by word overlap, not string match)
- Deadline moved by > 3 business days from AI's suggestion
- Assigned owner changed to a different employee
- Weightage changed (e.g., AI said "high", employee changed to "low")
- Scope keywords changed (AI checks: does the modified description still address the same OKR?)

If none of these thresholds are crossed, the task is auto-created. The employee sees a brief "Task created" confirmation. The threshold values are configurable in Calibration → Company tab (future).

#### 6.3.5 Manager View of Conversations

Managers access via Employee Detail → Echo Trail tab. What they see depends on company privacy config:
- **Full Transparency:** Complete transcripts, same as employee sees
- **Summary Only:** AI-generated daily summary (2-3 sentences + topics + sentiment + action items)
- **Layered:** Full transcripts minus employee-tagged "private" messages

#### 6.3.6 Employee First Luminary — Onboarding Flow

First time an employee opens Luminary (no prior `Conversation` records exist for this employee):

1. **Dawn Sequence plays** as normal — avatar appears, greets by name
2. **Introduction:** "Hi [name], I'm your AI manager. I'm here to help you stay on track, unblock problems, and grow. We'll have a short standup every day — usually 3-5 minutes."
3. **Voice consent:** "I can listen and respond by voice, or we can text. Voice conversations are recorded and transcribed for your manager. [Use voice] [Text only]" — employee must explicitly choose. Choice saved to Settings, changeable anytime.
4. **Recording indicator:** If voice mode chosen, a persistent red dot + "Recording" badge appears in the Luminary header for every future voice session.
5. **Personality calibration:** Bot asks 3-4 questions: "Do you prefer direct feedback or gentle suggestions?", "Do you like detailed check-ins or quick updates?", "What motivates you most — recognition, growth, autonomy, or impact?" Responses populate `personalityProfile` on the Employee entity.
6. **First standup:** Bot runs a lightweight first standup: "What are you working on today? Any blockers?" — establishing the rhythm.

Subsequent sessions skip steps 2-5. If personalityProfile is empty for a returning employee (data migration), Luminary adds calibration questions to the next standup naturally.

#### 6.3.7 Graceful Degradation — API Failures

Luminary depends on three external APIs. Failures are handled with progressive fallback:

| Failure | Fallback | User Sees |
|---------|----------|-----------|
| D-ID/HeyGen avatar API down | Voice + static avatar image (manager's uploaded photo) | "Avatar is temporarily unavailable. Voice mode active." |
| ElevenLabs voice API down | Text + animated avatar (lip-sync to text timing) | "Voice is temporarily unavailable. Text mode active." |
| Both avatar + voice down | Text-only chat with Prism-branded placeholder | Clean chat interface, no avatar, no voice |
| Anthropic Claude API down | Luminary unavailable | "Luminary is taking a break. Your standup has been saved as a note — we'll catch up tomorrow." Employee can still type a text update that gets stored as a `partial` StandupRecord. |
| Network drops mid-conversation | Auto-save last message + reconnect attempt (3 retries, 5s apart) | "Connection lost. Reconnecting..." → if fails: "Session saved. You can resume later." |

All fallback states maintain the warm Prism aesthetic — no raw error messages or broken layouts.

#### 6.3.8 Concurrency

- **Same employee, multiple devices:** Last write wins. Conversation state syncs on each message send (pull latest before push). No split-brain — both devices see the same thread.
- **Manager viewing Echo Trail during active standup:** Manager sees a "Live" badge on the current day's dot. Transcript updates in near-real-time (poll every 10s or WebSocket in API phase). Manager cannot interfere with the active standup.
- **Mock data phase:** All state in localStorage — true concurrency impossible. Note in build: "Replace with server-synced state in API phase."

### 6.4 Checkpoint — Approvals Queue (`/app/approvals`)

Manager/Dept Head/CEO view. Handles AI-generated tasks requiring approval + employee negotiations.

**Empty state:** Show `checkpoint` EmptyState: "All clear. No items pending approval."

**Hero section:**
```
Back button → Overline: Shield icon + "Approval queue"
Title: "Signal *Checkpoint*"
Hero stats (3 large font-mono values): Pending (count), Avg response (hours), This week (approved count)
Border-bottom
```

**Tabs:** Pending | Approved | Rejected | Negotiated — using the primary pill-style tab pattern (rounded-lg, bg-white/10 on active, text-white/40 inactive).

**Filter bar** (below tabs): Sub-tab style filter chips for department, weightage, source. Search input (p-bg-input) for task titles and employee names.

**Card grid layout** (not a list/table):
- Desktop: 2-column grid (`grid-cols-1 md:grid-cols-2 gap-4`)
- Each approval is a full Prism card (`rounded-[2rem]`, `p-bg-card`, `1px solid var(--p-border)`)
- Card contents:
  - Employee avatar (grayscale, `w-10`, top-left) + employee name + department badge
  - Task title (`text-lg font-light p-text-hi`)
  - Weightage badge (insight badge pattern: `text-[11px] font-mono uppercase` with accent background)
  - AI reasoning summary (1-2 lines, `text-sm p-text-dim`)
  - Source OKR link (`text-xs p-text-ghost font-mono`)
  - Negotiation indicator: if negotiated, amber dot + "Negotiation pending" label

**Actions — focus-dim model (operations disclosure pattern):**
- Default: ALL action buttons visible on every card — Approve (emerald icon), Reject (rose icon), Reassign (cyan icon). Always present at card bottom. No hiding, no hover required.
- On hover/focus on any card: the hovered card stays full opacity + slight scale(1.01). ALL OTHER cards dim to 60% opacity. This creates focus without hiding information — the manager's eye is drawn to the focused card while context remains visible.
- On mobile: all actions visible. Tap card to expand detail. No dimming — mobile uses standard tap interaction.
- This is the **operations disclosure pattern** — the inverse of the analytics disclosure pattern (hover→reveal). Used on Checkpoint and Tasks active view where speed of action matters more than visual quietness.

**Card expansion (click anywhere on card):**
Full detail opens in-place (AnimatePresence, same as Spectrum Dimension Row expansion):
- Complete AI allocation reasoning (card within card, `p-bg-card-2`)
- Employee profile snapshot (avatar color, role, capacity ring, skill tags)
- Capacity percentage (progress bar with dimension color)
- Skill match score (font-mono, accent-colored)
- Estimated milestone impact (text summary)
- Negotiation thread (if applicable): summary card + bot assessment + approve/reject/counter actions

**Multi-select (replaces checkboxes):**
- Desktop: hold Shift + click cards to select multiple. Selected cards show a subtle cyan border glow (`border-color: var(--p-cyan)`, `box-shadow: none` — use `outline` with blur).
- Mobile: long-press a card to enter selection mode. Tap additional cards to add/remove.
- When 2+ cards selected: floating pill appears above the dock: "[n] selected — Approve all | Reject all | Clear". Pill uses `p-bg-surface`, `backdrop-blur-xl`, spring entrance from bottom.

**Role-specific views:**
- **CEO:** Sees ALL pending approvals across all departments.
- **Dept Head:** Sees approvals for their department only. Cross-department tasks visible as dimmed read-only cards if they affect shared milestones.
- **Manager:** Sees approvals for their direct reports only.

**Negotiation handling:** Negotiations are mediated by Luminary. When an employee negotiates, the manager sees a negotiation card (amber-tinted insight card pattern):
- Summary: "Arjun is requesting to extend deadline on 'API Refactor' by 1 week because..."
- Bot's assessment: "Recommendation: Approve. Impact on milestone: minimal — 2-day buffer remains."
- Manager responds via the expanded card interface (approve/reject/counter). Response relayed through next Luminary standup.

### 6.5 Synthesis — Report Generation (`/app/reports`)

**Empty state:** Show `synthesis` EmptyState: "No reports generated yet. Choose a template or describe what you need."

**Hero section:**
```
Back button → Overline: FileText icon + "Report generation"
Title: "Signal *Synthesis*"
Hero stats: Reports generated (total count), Last report (date, font-mono ghost)
Border-bottom
```

**Template gallery:** Pre-built report types as Prism cards (`rounded-[2rem]`, `p-bg-card`). Each card: report type icon (Lucide), title, 1-line description, accent color per type. 3-column grid. Hover: subtle scale + border glow. Click → generates report.
- Board Summary (quarterly)
- Department Review
- Performance Overview
- Revenue Forecast
- Attrition Risk Report
- Meridian Progress

**Past reports:** Below the template gallery. Section marker: `GENERATED REPORTS`. Card grid (2-column) — each past report as a smaller card showing: type badge (insight badge pattern), title, generated date (font-mono ghost), generated-by name. Filter chips above: report type, date range. Search input (p-bg-input). Click card → reopens in the Prism document viewer.

**Custom:** "Describe the report you need" — text area (`p-bg-input`, generous padding) + VoiceInput component alongside. Examples shown as ghost placeholder text. Voice input is a Prism-wide input enhancement available wherever text input benefits from dictation (Genesis, Luminary, and here).

**Generation:** Claude produces report. Rendered in-app in a **Prism-styled document viewer** — NOT a white-background document renderer. The viewer uses:
- `p-bg-card-2` background (elevated card surface)
- Prism typography: Outfit for headings, Space Mono for data values, Cormorant Garamond for editorial pull-quotes
- Accent colors for chart elements and data highlights (same 6 dimension colors)
- Section markers (11px mono uppercase ghost) for report sections
- Data tables styled with `p-bg-card`, `p-border` — same table aesthetic as Spectrum deep analytics
- Ambient glow behind key charts and graphs
- The report looks like a Spectrum Deep Analytics tab, not a Google Doc.
- Report sections are editable — click any section to enter edit mode (text transforms to `p-bg-input`).

**Export:** One-click to PDF or DOCX. Export generates a **properly formatted light-background document** (standard business document styling) — distinct from the in-app dark Prism viewer. This is intentional: in-app viewing matches the Prism aesthetic, exported documents are professional for external sharing.

### 6.6 Calibration — System Configuration (`/app/admin`)

CEO-only. Replaces Settings for CEO role.

**Hero section:**
```
Back button → Overline: Settings icon + "System configuration"
Title: "System *Calibration*"
Hero stats: Active employees (count), Meridian status badge, Privacy level badge
Border-bottom
```

**Navigation: Scroll-spy sections (not horizontal tabs).** Calibration is a single vertical scroll page with a floating dot sidebar (same pattern as Employee Detail). Each section is a Prism card. Dot sidebar highlights the current section. Sections:

**Section 1 — Company** (card: `rounded-[2rem]`, `p-bg-card`)
- Section marker: `COMPANY IDENTITY`
- Company name: large serif italic display. Click to edit inline.
- Mission: pulled from Genesis. Displayed as an editorial quote block (`p-text-dim`, serif italic). Click to edit.
- Meridian status: badge (active/draft/archived) with link to Meridian.
- "Re-run Genesis" as a subtle text link, not a primary button. Warns: "This will archive your current Meridian."

**Section 2 — People** (card)
- Section marker: `ROLES & DEPARTMENTS`
- Department list: horizontal pill chips (department name + employee count). Click pill → expand to show employees in that department.
- "Add Department" as a `+` icon button at end of pill row.
- Employee grid within expanded department: same card pattern as Team page. Avatar (grayscale) + name + role badge + status dot.
- **Add Employee:** Button opens a Prism modal (`rounded-2xl`, `backdrop-blur-xl`, `p-bg-surface`). Modal fields use `p-bg-input` with subtle border. Role selector: 3 pill buttons (Employee | Manager | Dept Head), not a dropdown.
- **Bulk import:** "Import CSV" link below the grid. Opens file picker. Preview table in a Prism card before confirming.

**Section 3 — Avatars** (card)
- Section marker: `AVATAR CONFIGURATION`
- Grid of manager cards (3-column, `md:grid-cols-3`). Each card: manager photo (grayscale), name, department, status badge (configured / pending / not set).
- Click card → expand in-place (AnimatePresence) to reveal the setup flow:
  1. Photo upload: drag zone styled as a Prism card (ambient pulse border, not dashed lines). "Place the face of *[name]*" in serif italic.
  2. Live preview: avatar video in a circular frame (`rounded-full`, `w-48 h-48`), centered. Sample phrase playing. Approve/Retry buttons below.
  3. Voice configuration: **two options as radio cards** — "Clone manager's voice" (record/upload 2-5 min sample → ElevenLabs clone → test playback) OR "Use Prism voice" (curated warm AI voice, pre-selected, no recording needed). If clone chosen: waveform visualization (hand-crafted SVG). Record button (same VoiceInput pattern). Play-back with animated waveform. A/B comparison: play clone vs Prism voice side-by-side before confirming.
  4. Personality: 4 sliders (not text areas) — one per performance level (high performer, steady, under, new). Each slider: label left, slider center, current-tone preview right. Slider uses Prism accent colors.
  5. Assignment: department multi-select as pill chips.

**Section 4 — Privacy & Memory** (card)
- Section marker: `SIGNAL PRIVACY`
- Privacy level: 3 large radio cards (not a dropdown). Each card: level name in bold, 2-line description, icon. Active card: cyan border glow. Inactive: default border.
- Conversation memory: horizontal slider with snap points at 7 / 30 / 90 / ∞ days. Current value shown as large font-mono number. Sliding animates the value with spring physics.

**Section 5 — Notifications** (card)
- Section marker: `ALERT THRESHOLDS`
- Standup reminder time: clock face visual (small SVG) with draggable hand, OR a time picker styled with p-bg-input. Current time shown in large font-mono.
- Escalation threshold: slider (1h → 24h), snaps to whole hours. Label: "Alert manager after [n] hours of no standup."
- Email frequency: 3 pill radio buttons (Instant | Daily digest | Weekly digest).

**Section 6 — Integrations** (card)
- Section marker: `EXTERNAL SIGNALS`
- Each integration as a sub-card within the section card:
  - Service logo (small, grayscale → color on hover, same avatar pattern) + service name + status dot (green pulse = connected, gray = disconnected)
  - Connected state: "Last sync: 2h ago" in ghost mono. "Disconnect" as dim text link on hover.
  - Disconnected state: "Connect [Service Name]" button (cyan accent). Click opens Prism modal for API key entry. Key field masked after entry.
  - "Coming soon" services: same card but 30% opacity, no button. "Coming soon" badge.

**Section 7 — Financial** (card)
- Section marker: `CAPITAL CONFIGURATION`
- Annual revenue target: large editable number (click to edit, font-mono, emerald accent). Inline edit with p-bg-input.
- Department budgets: small cards per department (pill-style), each showing department name + budget as font-mono value. Click to edit inline.
- Note: "Connect QuickBooks or Xero in Integrations for automatic financial data." in ghost text.

---

## 7. Screen Specifications — Evolved Existing Screens

### 7.1 Spectrum (`/app`) — Evolved

**New section: "Illuminations"** replaces the static Intelligence cards.
- Same card layout structure as current cross-dimensional patterns
- Content is now AI-generated by Claude (richer, more contextual, references trends over time)
- Generated on page load (cached for the day, refresh button to regenerate)
- Still uses the same insight types: Critical (Flame) / Watch (Eye) / Opportunity (Sparkles)
- AI can now reference standup data, task completion rates, and Meridian progress in addition to the 6 dimensions

**New section: "Meridian Pulse"** after Illuminations.
- Compact progress bar showing overall Meridian (roadmap) completion
- Top 3 at-risk milestones with status badges
- Link to full Meridian page

**Execution Velocity widget** added to the Capital Dynamics tab. Three layers of insight:

**Layer 1 — Execution Velocity Score (PRIMARY):**
- Large font-mono number (0-100), accent-colored by threshold (emerald ≥80, amber 60-79, rose <60)
- Measures: operational momentum against the Meridian plan
- Inputs: roadmap milestone completion rate (weighted by priority), task completion velocity (tasks/week vs planned), standup engagement consistency, blocker resolution speed
- 4-quarter trend line (hand-crafted SVG): current + 3 historical quarters. Shows acceleration/deceleration of execution.
- Tooltip on score: breakdown of sub-components

**Layer 2 — Revenue Estimate (SECONDARY, lower prominence):**
- Shown below the Velocity score in smaller, dimmer text (`p-text-dim`, `font-mono`)
- Dollar figure: CEO's annual revenue target from Genesis × (execution velocity / 100) = "On track for ~$X"
- **Strong caveat** (always visible, not dismissable): "Estimated from operational data only. Actual revenue depends on market, sales, and pricing factors beyond operational control."
- When QuickBooks/Xero connected: caveat changes to "Correlated with financial data — accuracy: ±15%" and the estimate gains prominence (moves to `p-text-mid`)

**Layer 3 — AI Narrative (contextual):**
- Below the numbers, a 2-3 sentence AI-generated assessment (same insight card pattern as Illuminations):
- Example: "Engineering is 2 weeks ahead on the auth milestone, but marketing's content roadmap is 40% behind plan. The sales pipeline gap in Q2 OKRs is the largest risk to the revenue target. Recommendation: reallocate 1 headcount from engineering to marketing for 3 weeks."
- Generated weekly. Cached. Refresh button.

**Meridian summary card:** Compact version appears on the Meridian page — Execution Velocity score + trend arrow + 1-line narrative. Click → navigates to Spectrum Capital Dynamics.

### 7.2 Team (`/app/team`) — Evolved

**1:1 prep panel now AI-generated:**
- Instead of static `oneOnOneTopics` map, Claude generates talking points based on: recent standup conversations, task completion, KPIs, wellbeing signals, upcoming deadlines
- MiniRadar SVG chart remains (hand-crafted, not recharts)

**Employee cards enhanced:**
- Current task status indicator (e.g., "3 active, 1 overdue")
- Last standup timestamp ("Standup 2h ago" or "No standup today ⚠")
- Negotiation alert badge if employee has pending negotiations

### 7.3 Employee Detail (`/app/employee/:id`) — Evolved

**New tab: "Echo Trail"** (conversation history)
- Timeline visualization: horizontal line with dots for each standup
- Dot colour: green (completed, positive sentiment), amber (completed, concerned), red (missed), gray (weekend/leave)
- Hover over dot: tooltip with date, duration, sentiment, top topic
- Click dot: expand to show full conversation detail (transcript, action items, blockers, wins)
- Respects privacy config (manager sees summary or full per company setting)

**Time grouping for scalability:**
- **Last 30 days:** Individual dots per standup (full resolution). This is the default view.
- **31–90 days:** Grouped by week. Each dot = 1 week. Dot size proportional to standup count that week (3/5 = smaller, 5/5 = full size). Dot colour = average sentiment for the week. Hover: "Week of Mar 3 — 4/5 standups, mostly positive."
- **90+ days:** Grouped by month. Each dot = 1 month. Same size/colour logic.
- **Zoom control:** Three pill buttons above the timeline: "Last 30 days | Last quarter | All time" — toggles the resolution. Transition animates dots merging/splitting with spring physics.
- This ensures the visualization stays readable whether the employee has been at the company for 2 weeks or 2 years.

**New tab: "Work Stream"** (task pipeline)
- Three sections: Active tasks, Completed tasks, Negotiated tasks
- Each task shows source (manual / AI Meridian / AI standup), weightage, completion status

**AI Performance Recommendation section** (visible to Manager/CEO):
- Promotion / salary increase / PIP / role change / skill development suggestions
- Evidence panel showing data points that support the recommendation
- "Implement" button triggers the relevant workflow:

**Implementation sub-flows by recommendation type:**
- **Promotion:** Creates a proposal record: new title, new salary band, justification. Routes to CEO for approval via Checkpoint. On approval: Employee record updated (title, role), notification sent, Luminary mentions it in next standup.
- **Salary increase:** Creates adjustment record: current vs proposed, reasoning, budget impact. Routes to CEO via Checkpoint. On approval: compensation data updated, employee notified.
- **PIP (Performance Improvement Plan):** Generates 3-5 remediation tasks with clear milestones and a review date (30/60/90 days). Tasks auto-created in employee's Work Stream with source `ai_review`. Luminary tracks progress in daily standups. At review date, AI generates PIP outcome assessment.
- **Role change:** Proposal with current role, suggested role, skill gaps to close. Routes to CEO. On approval: title updated, new OKRs generated from Meridian alignment.
- **Skill development:** Generates learning tasks (courses, mentoring, stretch assignments) with source `ai_review`. Auto-assigned to employee. No CEO approval needed — manager can approve directly.

### 7.4 Tasks (`/app/tasks`) — Evolved

**AI task integration:**
- AI-generated tasks arrive in Backlog (from roadmap decomposition) or Active (from standup action items)
- "AI suggested" badge visible on creation, fades after employee accepts the task
- Non-editable `source` field on every task: `manual` | `ai_roadmap` | `ai_standup` | `ai_review` — always auditable regardless of badge state

**Approval queue integration:**
- Tasks with `allocationMethod: 'approval_required'` show a "Pending approval" state
- Manager sees these highlighted in a special section or filter

**Negotiation flow — two paths based on complexity:**

**Fast-track (simple requests):** For deadline extensions ≤5 business days with no scope or owner change:
1. Employee clicks "Negotiate" → pill buttons: Reassign | Extend deadline | Reduce scope | Split task
2. Employee selects "Extend deadline" → date picker appears inline (within the task card)
3. Employee picks new date (≤5 days from current deadline)
4. System auto-generates a one-line approval card: "Arjun requests 3 more days on API Refactor. Original: Mar 15 → New: Mar 18." Routes directly to Checkpoint.
5. Manager sees a compact card with [Approve] [Discuss] buttons. Taps Approve → done in 2 seconds. Taps Discuss → Luminary opens with context pre-loaded.
No Luminary conversation required. Total time: ~15 seconds.

**Full negotiation (complex requests):** For reassignment, scope changes, deadline extensions >5 days, or task splits:
1. Employee clicks "Negotiate" → selects request type
2. Luminary overlay opens with context pre-loaded (task details, current assignment, related OKRs)
3. Bot collects employee's reasoning, assesses impact on milestone, generates recommendation
4. Routes to manager's Checkpoint queue with bot's detailed assessment + impact analysis

**Weightage labels:** Each task shows its weightage badge (low/medium/high/critical) and allocation method (auto/approval).

**Task deletion (soft delete only):**
- Tasks are never hard-deleted — always archived (soft delete) for audit trail
- **Who can archive:** Task creator, assigned employee (own tasks only), manager (direct reports' tasks), CEO (any task)
- **Archive effects:** Task moves to "Archived" filter (hidden from default kanban view, accessible via filter). Linked Checkpoint approvals auto-cancelled. Task source and history preserved indefinitely.
- **Orphaned tasks:** When a Meridian milestone is removed, its child tasks are marked `orphaned` and appear in a "Legacy Tasks" filter. Employees can still complete them or request archival.

### 7.5 KPIGoals (`/app/kpis`) — Evolved

**AI Recommendations panel** at top of page — a Prism card (`rounded-[2rem]`, `p-bg-card`) with section marker: `AI RECOMMENDATIONS`. Contains insight/action cards (same pattern as Illuminations on Spectrum):
- Each suggestion uses the insight card pattern: severity icon + type badge + narrative + action recommendation
- Suggestion severity colors: emerald (stretch target — opportunity), amber (reduce scope — watch), rose (underperformance — critical)
- Employee avatar (grayscale) + name + current OKR → suggested change → reasoning
- Click suggestion → page scrolls to the relevant OKR and highlights it with a brief cyan border pulse (1s, fade out)

**Inline chips** on individual OKRs:
- Small "AI suggests" chip: uses the existing badge pattern (`text-[11px] font-mono uppercase`, `bg-cyan-500/8`, `text-cyan-400`). Appears next to OKRs that Claude wants to adjust.
- Chip shows brief summary ("Stretch target → 95%")
- Click chip → detail popover (`p-bg-surface`, `rounded-xl`, `backdrop-blur-xl`) with full reasoning + accept/reject buttons

**Suggestion types:**
- High performers: Stretch targets to keep them challenged
- Burnout risks: Reduced scope to protect wellbeing
- Growth candidates: Skill-gap-filling objectives
- Underperformers: Clearer, more measurable targets

### 7.6 Orbital Presence (`/app/attendance`) — Evolved

**Calendar (TemporalGrid) unchanged** — no new day types added.

**Pattern detection panel enhanced** with standup-related algorithms:
- New pattern: "Missed standup streak" — N consecutive working days without standup completion → critical
- New pattern: "Low standup engagement" — employee completes standups but with minimal content (< 30 seconds or < 50 words) → watch
- These integrate alongside the existing 7 algorithms in the AI patterns panel
- Sorted by severity with all other patterns

### 7.7 The Race (`/app/leaderboard`) — Evolved

**New metric: "Meridian Alignment"**
- Added as 6th option alongside Output, Return, Growth, Motivation, Wellbeing
- **Structured scoring rubric** (not a single narrative prompt — ensures consistency across weeks):

| Sub-score | Weight | What Claude evaluates | Scale |
|-----------|--------|----------------------|-------|
| Task completion vs roadmap weight | 25% | % of assigned roadmap tasks completed, weighted by task weightage (critical > high > medium > low) | 0-25 |
| Revenue attribution | 20% | Estimated revenue impact of completed work relative to department budget | 0-20 |
| Standup quality | 20% | Consistency (streak), depth of updates (word count + specificity), proactive blocker reporting | 0-20 |
| Peer signal | 15% | Sentiment from conversations mentioning this employee + 360° review scores if available | 0-15 |
| Initiative | 20% | Tasks completed beyond assigned scope, suggestions made in standups, self-initiated improvements | 0-20 |

- Claude evaluates each sub-score independently via separate prompts (5 calls, not 1 — reduces non-deterministic variance)
- Total = sum of sub-scores (0-100)
- **Consistency check:** If week-over-week total changes by > 8 points with no underlying data change, re-run evaluation. If second run also differs by > 8, take the average. This caps random LLM variance.
- When selected in The Race, each bar shows a tooltip with the 5 sub-scores + brief narrative justification per sub-score
- Sub-score breakdown visible on click/expand
- Updated weekly (not real-time)

**Predictive performance curve:**
- New toggle: "Show prediction" overlays a dashed line showing Claude's forecast for next quarter
- Based on current trajectory, standup engagement, and Meridian alignment

### 7.8 360° Resonance (`/app/review`) — Evolved

**AI pre-filled drafts (Progressive mode):**

When a manager enters the Write Review wizard:
1. **Step 2 (Score):** After scoring dimensions, AI generates a complete review draft
2. **Draft presentation:** Full draft shown in a rich text view. Each paragraph/section is individually selectable.
3. **Manager interaction options:**
   - Accept entire draft → moves to confirm step
   - Highlight any section → "Regenerate this section" button appears. Manager can optionally provide guidance ("make this more specific about the Q3 incident")
   - Click into any section → edit inline freely
   - "Regenerate entire draft" button available
4. **AI draft sources:** Conversation history, task completion data, KPIs, attendance patterns, peer reviews, wellbeing signals — all cited in the draft where relevant

### 7.9 Settings (`/app/settings`) — Evolved

For non-CEO users (Manager/Employee), Settings remains with:
- Theme toggle (dark/light)
- Luminary preferences: voice/text mode default, immersive/compact mode preference, voice mute default
- Notification preferences: standup reminder time, email frequency
- Profile information

For CEO users: Settings is replaced by Calibration (`/app/admin`) which is a superset.

---

## 8. Data Model

### 8.1 New Entities

**Storage strategy:** All v3 entities are stored in client-side stores (React context + `localStorage` persistence) during the mock data phase. Pattern: each entity type gets a dedicated store file (`companyConfig.ts`, `conversationStore.ts`, `roadmapStore.ts`) that mirrors the `AuthContext` pattern — React context for reactivity, `localStorage` for persistence across sessions. Migration to API backend is a future phase — store interfaces are designed to be swappable.

```typescript
interface CompanyConfig {
  id: string; name: string;
  privacyLevel: 'full_transparency' | 'summary_only' | 'layered';
  conversationMemoryDays: 7 | 30 | 90 | -1;
  annualRevenueTarget: number;
  departmentBudgets: { departmentId: string; budget: number; }[];
  financialDataSource: 'manual' | 'quickbooks' | 'xero' | 'bamboohr' | 'workday';
  standupReminderTime: string; // "09:00" in company timezone
  standupTimezone: string; // IANA timezone e.g. "Asia/Kolkata". All reminders relative to this. Future: per-employee timezone override in Settings.
  missedStandupEscalationHours: number;
}

interface VisionDocument {
  id: string; uploadedAt: string; rawText: string; aiSummary: string;
  mission: string; problemStatements: string[];
  revenueTargets: { period: string; target: number; }[];
  resources: { money: number; headcount: number; timeMonths: number; };
  targetAudience: string; techApproach: string; constraints: string[];
}

interface Roadmap {
  id: string; visionId: string;
  status: 'draft' | 'approved' | 'active' | 'archived';
  milestones: Milestone[]; risks: RoadmapRisk[]; gaps: Gap[];
}

interface Milestone {
  id: string; title: string; description: string;
  departmentId: string; targetDate: string;
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
  progress: number; okrs: RoadmapOKR[]; dependencies: string[];
}

interface TaskV3 extends Task {
  source: 'manual' | 'ai_roadmap' | 'ai_standup' | 'ai_review';
  // ai_roadmap = generated from Meridian OKR decomposition
  // ai_standup = action item extracted from Luminary conversation
  // ai_review  = improvement action generated from 360° Resonance AI draft (e.g., "Complete advanced React course" from a review noting skill gap)
  sourceOKRId?: string;
  allocationMethod: 'auto' | 'approval_required';
  allocationReason: string;
  weightage: 'low' | 'medium' | 'high' | 'critical';
  revenueImpactEstimate?: number;
  negotiation?: {
    employeeRequestType: 'reassign' | 'extend_deadline' | 'reduce_scope' | 'split_task';
    botMediationSummary: string;
    botRecommendation: 'approve' | 'reject' | 'counter';
    status: 'pending' | 'approved' | 'rejected';
    resolvedAt?: string;
  };
}

interface Conversation {
  id: string; employeeId: string; date: string;
  type: 'daily_standup' | 'task_update' | 'growth_discussion' | 'concern' | 'negotiation';
  messages: ConversationMessage[];
  aiSummary: string; sentiment: 'positive' | 'neutral' | 'concerned' | 'frustrated';
  topicsDiscussed: string[]; actionItems: { description: string; taskId?: string; }[];
  blockers: string[]; wins: string[];
  hasPrivateContent: boolean; privateMessageIds: string[];
}

interface ConversationMessage {
  id: string; role: 'employee' | 'ai_manager';
  content: string; timestamp: string;
  audioUrl?: string; transcriptionConfidence?: number;
  isPrivate: boolean;
}

interface AvatarConfig {
  id: string; managerId: string; departmentId?: string;
  photoUrl: string; animatedAvatarId: string;
  voiceSampleUrl: string; clonedVoiceId: string;
  adaptiveRules: {
    highPerformer: string; steadyPerformer: string;
    underperformer: string; newEmployee: string;
  };
}

interface PerformanceRecommendation {
  employeeId: string; generatedAt: string;
  type: 'promotion' | 'salary_increase' | 'pip' | 'role_change' | 'skill_development';
  recommendation: string;
  evidence: { performanceScore: number; taskCompletionRate: number;
    revenueContribution: number; standupConsistency: number; sentimentTrend: string; };
  suggestedSalaryChange?: { current: number; suggested: number; reasoning: string; };
  suggestedTasks?: string[];
  status: 'pending_review' | 'approved' | 'rejected' | 'implemented';
}

interface StandupRecord {
  employeeId: string; date: string;
  status: 'completed' | 'missed' | 'partial';
  conversationId?: string; completedAt?: string;
  reminderSentAt?: string; managerAlertedAt?: string;
}

interface ExecutionVelocity {
  id: string; generatedAt: string; period: string; // "Q2 2026"
  velocityScore: number; // 0-100 composite
  subScores: {
    milestoneCompletionRate: number; // weighted by priority
    taskVelocity: number; // tasks/week vs planned
    standupEngagement: number; // consistency across org
    blockerResolutionSpeed: number; // avg hours to resolve
  };
  revenueEstimate?: number; // CEO target × (velocity / 100), optional
  revenueEstimateCaveated: boolean; // true until financial API connected
  aiNarrative: string; // 2-3 sentence assessment
  trend: 'accelerating' | 'stable' | 'decelerating';
}
```

### 8.2 Extended Employee Fields

**`role_level` dual storage:** `role_level` exists in TWO places:
1. **AuthContext** (`{ email, name, role_level }`) — source of truth for route guards and UI visibility. Set during login from the invite/provisioning flow. Available immediately on sign-in.
2. **EmployeeV3 entity** (`role_level` field) — source of truth for data queries and AI context. Synced with AuthContext on login. Used when Claude needs to understand org hierarchy.

Both must always agree. If a CEO changes someone's role in Calibration, both the Employee record AND the auth session must update (force re-login or session refresh).

```typescript
interface EmployeeV3 extends Employee {
  role_level: 'ceo' | 'department_head' | 'manager' | 'employee';
  managerId?: string; departmentHeadId?: string;
  assignedAvatarId: string;
  standupStreak: number; standupCompletionRate: number; lastStandupDate?: string;
  currentCapacity: number;
  strengthTags: string[]; weaknessTags: string[];
  measuredRevenueContribution: number; taskCompletionRate: number;
  personalityProfile: {
    communicationStyle: 'direct' | 'supportive' | 'analytical' | 'collaborative';
    motivators: string[]; stressSignals: string[];
  };
}
```

---

## 9. Notification System

| Type | Recipient | Trigger |
|------|-----------|---------|
| Standup reminder | Employee | Daily at configured time |
| Missed standup alert | Employee + Manager | N hours after reminder, no standup |
| Task assigned | Employee | AI or manual assignment |
| Task negotiation | Manager (via Checkpoint) | Employee negotiates through bot |
| Negotiation resolved | Employee (via bot) | Manager approves/rejects |
| Approval needed | Manager | High-weightage AI task |
| Performance flag | Manager + CEO | Underperformance threshold crossed |
| Roadmap milestone | CEO + Dept Head | Milestone status change |
| AI recommendation | CEO / Manager | New promotion/PIP/salary suggestion |

Channels: In-app notification bell + Email (SendGrid/Resend).

**Employee notification preferences** (configurable in Settings):
- Per notification type: employee can choose channel (in-app only / email only / both / muted)
- **Mandatory notifications** (cannot be muted by employee): missed standup alert, task assigned, performance flag
- **Mutable notifications:** standup reminder (can change time or mute), negotiation resolved, AI recommendation
- Reminder time: employee can override company default with their own preferred time (in their timezone, future feature)
- CEO sets company defaults in Calibration → Notifications tab. Employee overrides in Settings.

---

## 10. Phased Build Plan

### Phase 0: Foundation (Week 1-2)
- Role-based auth (extend AuthContext with role hierarchy)
- Company config store + Calibration page skeleton
- Extended data model (mockData v3)
- Notification system (in-app bell + store)
- AI service layer (Anthropic API client with streaming)
- Document parser (PDF/DOCX text extraction)

### Phase 1: Strategic Intelligence (Week 3-4)
- Genesis wizard (4 steps: upload → summary → conversation → Meridian)
- Voice dictation input (Web Speech API)
- Vision document parsing pipeline (Claude prompts)
- Meridian generation + 3 view modes (timeline/cascade/kanban)
- Meridian page with milestone/OKR/risk/gap panels

### Phase 2: Task Engine (Week 5-6)
- AI task decomposition from Meridian OKRs
- Skill matching + capacity-based allocation
- Threshold routing (auto vs Checkpoint)
- Checkpoint page (list + expand + Luminary-mediated negotiation)
- Enhanced Tasks page (AI source badges, weightage, negotiation flow)
- Email notifications (SendGrid/Resend)

### Phase 3: Luminary — Text Mode (Week 7-8)
- Conversation data model + store
- Adaptive personality prompt system
- Luminary overlay (immersive + compact modes)
- HUD context panels (tasks, KPIs, deadlines)
- Conversation thread (hybrid: floating cards + expandable history)
- Standup tracking + missed standup alerts
- Manager conversation view (privacy-aware)
- Employee Detail: Echo Trail tab (timeline dots)

### Phase 4: Voice Pipeline (Week 9-10)
- Web Speech API integration (STT, live word-by-word transcript)
- ElevenLabs TTS integration (synthetic voice first)
- Voice message recording + playback in conversation
- Voice/text mode toggle
- Avatar listening animation (while employee speaks)

### Phase 5: Avatar System (Week 11-13)
- Calibration: photo upload + D-ID/HeyGen avatar generation
- Calibration: live animated preview with sample phrase
- Calibration: voice sample upload + ElevenLabs clone
- Avatar video rendering in Luminary overlay
- Dawn Sequence entry animation (5-stage, 2.2s)
- Progressive rendering (GPU detection + fallback tiers)
- Avatar personality configuration

### Phase 6: Intelligence Loop (Week 14-16)
- Illuminations: AI-generated structured insight cards on Spectrum
- AI performance recommendation engine
- Salary/promotion/PIP suggestion cards
- Execution Velocity model (3-layer: score + revenue estimate + AI narrative)
- The Race: Meridian Alignment metric (AI-judged)
- KPIs: AI recommendation panel + inline suggestion chips
- 360° Resonance: Progressive AI draft mode
- Team: AI-generated 1:1 prep
- Orbital Presence: Standup patterns in detection panel

### Phase 7: Synthesis & Polish (Week 17-18)
- Synthesis page (report templates + custom NL generation)
- In-app rendered report + PDF/DOCX export
- Financial data manual input forms
- Integration API stubs (QuickBooks, BambooHR, etc.)
- Meridian Pulse widget on Spectrum
- Employee Detail: Work Stream tab
- Comprehensive role-based testing
- Performance optimisation

---

## 11. Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Avatar API costs (D-ID/HeyGen) | $0.10–0.50/sec | Cache common phrases. Stream text first, render video async. Offer text-only tier. |
| Voice cloning ethics | Legal exposure | Require explicit consent. Manager approves own clone. Watermark cloned audio. |
| Context window limits | Can't fit all history | Summarise old conversations. Rolling window + key-fact extraction. |
| Response latency (Claude + TTS + Avatar) | 5-10s per turn | Stream text immediately. Voice async. Avatar idles while generating. |
| Web Speech API accuracy | Poor for accents | Live transcript for correction. Whisper upgrade path. Confidence threshold. |
| Bot-mediated negotiation quality | Bad recommendations damage trust | Manager always has final say. Bot shows reasoning + confidence. Easy override. |
| AI task allocation accuracy | Wrong person, wrong task | Fading badge signals AI origin. Easy negotiate flow. Non-editable source for audit. |
| **UI designed for <50 employees** | Constellation, TeamScatter, TemporalGrid break at scale | Known limitation. Pagination, virtualisation, search required for >50 orgs. Build for 8-50 now, scale in dedicated phase. |
| **Claude context window for large orgs** | Can't pass 800 employees × 50 fields to any model | Pass aggregates + department summaries for org-wide features (Illuminations, Synthesis). Individual employee data only for in-focus features (Luminary, Echo Trail). |
| **Demo page outdated** | /demo shows v2 features only. Visitors see outdated product. | Phase 7: Update Demo to showcase Genesis → Luminary → Meridian flow, or redirect to landing page with video. |

---

## 12. Success Metrics

| Metric | Target |
|--------|--------|
| Standup completion rate | > 85% daily |
| Genesis → Meridian time | < 30 minutes |
| Task negotiation rate | < 15% (signals good allocation) |
| Manager time saved | 5+ hours/week |
| Attrition prediction accuracy | > 70% on 90-day window |
| Revenue forecast accuracy | Within 15% of actual |
| Employee satisfaction with Luminary | > 4.0 / 5.0 |
| Dawn Sequence completion (no skip) | > 90% |

---

## 13. Production Readiness — Deferred Items

These items are **not needed for the demo** (single-browser, mock data, controlled environment) but are **required before any real user deployment**. Each has a defined solution — implementation deferred to the production build phase.

### 13.1 API Key Security — Server-Side Proxy
**Demo:** API keys stored in `.env` file, loaded via `import.meta.env` at build time. Acceptable for controlled demo.
**Production:** Deploy a lightweight server-side proxy (Vercel serverless function or Cloudflare Worker) that holds Anthropic, ElevenLabs, and D-ID API keys. Client sends requests to proxy endpoint. Proxy forwards to external APIs with keys attached. This prevents key exposure in browser DevTools. Rate limiting and per-user billing enforced at proxy layer.
**Architecture:** Client → `/api/ai/chat` (proxy) → Anthropic API. Client → `/api/voice/tts` (proxy) → ElevenLabs. Client → `/api/avatar/generate` (proxy) → D-ID.

### 13.2 Multi-User Shared State — Backend Database
**Demo:** All state in localStorage per-browser. CEO and employee are the same person switching roles. Mock data pre-loaded in `mockData.ts`.
**Production:** Replace localStorage stores with a shared backend. Recommended: Supabase (PostgreSQL + real-time subscriptions + auth) or Firebase (Firestore + Auth). The v3 store interfaces (`companyConfig.ts`, `conversationStore.ts`, `roadmapStore.ts`) are designed to be swappable — replace the localStorage persistence layer with API calls. Same React context for reactivity.
**Migration path:** Each store file exports `get()`, `set()`, `subscribe()`. Switch the implementation from localStorage to Supabase client. Zero component changes needed.

### 13.3 Genesis Re-Run Safety Net
**Demo:** Re-run Genesis won't be demonstrated. Mock data resets handle this.
**Production:** "Re-run Genesis" must show an impact preview modal: "This will archive: 1 active Meridian, [n] milestones, [n] tasks ([n] in progress), [n] pending approvals. All active tasks will be marked as legacy. Employees will be notified." Require CEO to type "ARCHIVE" to confirm. Option to "Keep active tasks as legacy" vs "Archive everything." Notification sent to all employees: "Your company roadmap is being updated. Ongoing tasks remain in your Work Stream."

### 13.4 Task Source Dispute Mechanism
**Demo:** AI-created tasks are predictable with mock data. No disputes will occur.
**Production:** Add a `disputed` boolean flag to TaskV3. Employee can mark any AI-created task as disputed: "I didn't agree to this." Disputed tasks get flagged in Checkpoint for manager review. The `source` field remains non-editable (audit integrity preserved), but the dispute adds context: "Employee note: 'This was a casual comment, not a commitment.'" Manager can archive the task or confirm it.

### 13.5 The Race — Separate AI-Judged Metrics Visually
**Demo:** Meridian Alignment appears alongside the 5 data-driven metrics. Acceptable for demo.
**Production:** Visual separation recommended. The 5 data-driven metrics (Output, Return, Growth, Motivation, Wellbeing) display as today's bar race. Meridian Alignment gets a distinct section below: "AI Assessment" with a different visual treatment — narrative cards per employee rather than bars. This makes clear that Meridian Alignment is a different KIND of evaluation (AI judgment vs structured data).

### 13.6 Progressive Rendering Detection
**Demo:** High-performance laptop. Default to full video avatar (tier 1). No detection needed.
**Production:** Detect device capability at first Luminary open: check `navigator.gpu` (WebGPU support), estimate bandwidth from initial page load timing, respect `prefers-reduced-motion` media query, check battery level via Battery API. Default to tier 2 (voice + static avatar image) and upgrade to tier 1 (full video) only after confirming device capability. User can always override in Settings → Luminary preferences. Tier selection persisted in localStorage.

### 13.7 Philosophy — Editorial for Understanding, Instrumental for Acting
**Demo:** Not a build concern — affects design review during production polish.
**Production design principle evolution:** Prism v3 has two modes of interaction: **reading** (Spectrum, Employee Detail, The Race) and **acting** (Checkpoint, Genesis, Calibration, Luminary). The original "editorial, not dashboard" philosophy applies fully to reading screens. Acting screens adopt an **"instrument panel"** metaphor — same aesthetic DNA (cards, glow, dark theme, section markers) but with interactive controls (sliders, buttons, confirmations) that feel like adjusting observatory instruments, not filling out corporate forms. Both modes share the same visual language; they differ only in interaction density.

### 13.8 Role-Based Dock Progressive Disclosure
**Demo:** Full dock shown for all roles. Demo operator switches roles to show different perspectives.
**Production:** Dock items gated by role_level:
- **Employee:** Spectrum (personal) + Tasks + KPIs + Luminary button. 3 primary + Luminary = minimal, focused.
- **Manager:** + Team + Checkpoint + The Race in feature tray.
- **Dept Head:** + Meridian (dept view) in feature tray.
- **CEO:** Everything + Synthesis + Calibration.
The Dock grows with your role. An employee never sees features they can't use.

### 13.9 Six Dimensions vs v3 Signals — Framework Architecture
**Demo:** The 6-dimension Prism orbital ring stays at 6. v3 signals live in their natural screens. No framework conflict in demo.
**Production architecture:** v3 signals are **leading indicators** that correlate with the 6 dimensions but are NOT forced into them. They live distributed:
- Standup consistency → **Orbital Presence** (standup patterns panel)
- Roadmap contribution → **The Race** (Meridian Alignment metric)
- Task velocity → **Tasks** (completion rate badge)
- Conversation sentiment → **Echo Trail** (dot colours) + **Illuminations** (AI insight cards when trends emerge)
- Negotiation rate → **Checkpoint** (tracked per employee)

The Prism orbital stays at 6 rings. v3 signals INFORM the 6 dimension scores over time (higher standup consistency may correlate with higher Motivation scores) but this is an observed correlation, not a forced input. The AI can reference v3 signals in Illuminations narratives ("Arjun's standup engagement has dropped 30% this month — this may be an early Motivation signal") without mathematically injecting them into dimension calculations.

**Future consideration (v4+):** If the product validates that v3 signals are genuinely predictive of dimension scores, build a formal correlation model. Until then, keep them separate — intellectual honesty over forced integration.

---

## 14. Prism Naming Glossary — Complete Reference

The Prism universe draws from three domains: **optics/light**, **signal processing**, and **space/physics**. All new features must use evocative names from these domains.

### New Screens

| Name | Route | Meaning | Domain |
|------|-------|---------|--------|
| **Genesis** | `/app/onboard` | The origin of all signals — where light first enters the prism | Origin/creation |
| **Meridian** | `/app/roadmap` | A principal line of longitude; the guiding reference line | Navigation |
| **Luminary** | Floating overlay | A person who inspires; literally a source of light | Light/guidance |
| **Checkpoint** | `/app/approvals` | A point where things are verified before moving forward | Signal processing |
| **Synthesis** | `/app/reports` | Combining multiple signals into a unified output | Signal processing |
| **Calibration** | `/app/admin` | Tuning an instrument to produce accurate readings | Optics |

### New Sections Within Existing Screens

| Name | Location | Meaning | Domain |
|------|----------|---------|--------|
| **Illuminations** | Spectrum page | Light revealing what was hidden in the data | Optics |
| **Meridian Pulse** | Spectrum page | The heartbeat of the Meridian (roadmap progress) | Navigation |
| **Echo Trail** | Employee Detail | Echoes of past conversations, visible as a trail | Signal processing |
| **Work Stream** | Employee Detail | The stream of work flowing to and through a person | Physics/flow |
| **Meridian Alignment** | The Race (Leaderboard) | How aligned a person's work was to the Meridian | Navigation |
| **Dawn Sequence** | Luminary entry | Light gradually filling the room; a new day beginning | Light/time |

### Existing Names (unchanged, for completeness)

| Name | Route / Location | Meaning |
|------|------------------|---------|
| **The Spectrum** | `/app` | The full decomposition of light; the hub |
| **The Prism** | Spectrum hero | The instrument that decomposes a single beam into a spectrum |
| **Constellation** | Spectrum section | Employee gallery — stars in a formation |
| **The Race** | `/app/leaderboard` | Animated bar-race rankings |
| **Orbital Presence** | `/app/attendance` | Attendance — who is in orbit |
| **360° Resonance** | `/app/review` | Performance reviews — signals resonating between peers |
| **Telemetry** | Employee Detail | Performance overview — remote measurement of signals |
| **Neural Pathways** | Employee Detail | Learning modules — neural connections forming |
| **Bio-Rhythms** | Employee Detail | Wellbeing metrics — biological rhythms |
| **Capital Matrix** | Employee Detail | Financial summary — ROI/compensation |
| **Impact Nodes** | Employee Detail | OKR achievements — points of impact |
| **In Orbit** | Attendance status | Present (in office) |
| **Dark** | Attendance status | Absent (unexplained) |
| **Standby** | Attendance status | Weekend |

### Naming Rules for Future Features

1. Draw from: optics, light, signal processing, navigation, space/physics
2. Never use generic names: "Dashboard", "Settings Panel", "Data View", "Chart Page"
3. The name should hint at the *function* through the *metaphor*
4. Test: "Would this name feel native next to Spectrum, Luminary, and Meridian?"
5. Prefer single words or two-word compounds. No three-word names.

---

*No code should be written that isn't traceable to this document. Update as decisions evolve.*
