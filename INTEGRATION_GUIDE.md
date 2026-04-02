# Prism v3 Integration Guide

## Codebase Integration Blueprint for AI COO Platform

This guide provides exact, file-level instructions for integrating v3 features into the existing Nexora Prism codebase. Every change is mapped to a specific file, with before/after patterns and dependency order.

---

## 1. Architecture Summary — What Changes

The existing codebase is a React 19 + TypeScript + Vite 6.3 SPA with 15 page components, a Dock navigation system, Layout-level transition choreography, and a mock data layer. v3 adds 6 new page components, extends the auth model, adds new data stores, and introduces AI service integration.

**Existing files that need modification (8):**

| File | Change |
|------|--------|
| `src/app/routes.tsx` | Add 6 new routes + Genesis skeleton, update aliases |
| `src/app/components/Layout.tsx` | Add v3 routes to depthMap/posMap, Luminary button, conditional dock hiding for Genesis |
| `src/app/components/ui/Dock.tsx` | Add Meridian, Checkpoint, Synthesis to featureNav. Rename "Rankings" to "The Race". Add Luminary floating button. |
| `src/app/components/ui/DockIcons.tsx` | Add icons: IconMeridian, IconCheckpoint, IconSynthesis, IconCalibration, IconLuminary |
| `src/app/auth/AuthContext.tsx` | Extend AuthUser with `role_level` field |
| `src/app/mockData.ts` | Add v3 entities: CompanyConfig, VisionDocument, Roadmap, Conversations, StandupRecords, ConversationExtracts |
| `src/app/components/Spectrum.tsx` | Add Illuminations section + Meridian Pulse widget + Execution Velocity to Capital Dynamics |
| `src/app/components/EmployeeDetail.tsx` | Add Echo Trail tab + Work Stream tab + AI Performance Recommendations |

**New files to create (18):**

| File | Purpose |
|------|---------|
| `src/app/components/Genesis.tsx` | CEO onboard — voice-first cinematic scroll |
| `src/app/components/Meridian.tsx` | Signal Path roadmap + Cascade + Kanban views |
| `src/app/components/Luminary.tsx` | AI Manager overlay — Dawn Sequence + conversation |
| `src/app/components/Checkpoint.tsx` | Approvals queue — focus-dim card grid |
| `src/app/components/Synthesis.tsx` | Report generation + Execution Velocity |
| `src/app/components/Calibration.tsx` | System config — scroll-spy sections |
| `src/app/stores/companyConfigStore.ts` | CompanyConfig React context + localStorage |
| `src/app/stores/roadmapStore.ts` | Roadmap, Milestone, OKR state management |
| `src/app/stores/conversationStore.ts` | Conversations, StandupRecords, Extracts |
| `src/app/stores/avatarStore.ts` | AvatarConfig + voice config state |
| `src/app/services/aiService.ts` | Anthropic API client with streaming |
| `src/app/services/voiceService.ts` | ElevenLabs TTS integration |
| `src/app/services/avatarService.ts` | D-ID video generation integration |
| `src/app/components/ui/VoiceInput.tsx` | Shared mic button + waveform + transcript |
| `src/app/components/ui/NotificationBell.tsx` | In-app notification component |
| `src/app/components/ui/AISourceBadge.tsx` | Fading "AI suggested" badge |
| `src/app/components/ui/LuminaryButton.tsx` | Floating Luminary trigger button |
| `.env` | API keys for Anthropic, ElevenLabs, D-ID |

---

## 2. Prerequisites and Dependencies

### New npm packages required

```bash
npm install @anthropic-ai/sdk    # Anthropic Claude API (streaming)
npm install elevenlabs            # ElevenLabs TTS
npm install zustand               # Lightweight state management (alternative to context for stores)
```

**Note:** `zustand` is recommended over raw React Context for the v3 stores because it avoids prop drilling and re-render cascading. The existing `AuthContext` pattern works for auth (single value, rarely changes), but v3 stores (conversations, roadmap) update frequently. If you prefer to stay with the existing Context pattern for consistency, that works too — just wrap each store in its own Context + Provider.

### Environment variables

Create `.env` in the project root:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_ELEVENLABS_API_KEY=...
VITE_ELEVENLABS_PRISM_VOICE_ID=...     # Pre-selected Prism branded voice
VITE_DID_API_KEY=...
VITE_AI_MODEL=claude-sonnet-4-20250514  # Default model for all pipelines
```

Vite exposes these via `import.meta.env.VITE_*`. They are embedded at build time — acceptable for a controlled demo, not for production deployment (see PA.md §13.1 for the server-side proxy architecture).

---

## 3. Integration Order — Phase by Phase

**Critical rule: integrate in this exact order.** Each phase depends on the previous one. Do NOT skip ahead.

### Phase 0: Foundation (modify existing files first)

This phase touches only existing files. No new pages yet. The app should still work identically after this phase — just with new routes that show empty states.

#### Step 0.1: Extend AuthContext

**File:** `src/app/auth/AuthContext.tsx`

Add `role_level` to the AuthUser interface. This is the single most important foundational change — every v3 feature checks role_level.

```typescript
// BEFORE
interface AuthUser {
  email: string;
  name?: string;
}

// AFTER
interface AuthUser {
  email: string;
  name?: string;
  role_level: 'ceo' | 'department_head' | 'manager' | 'employee';
}
```

Update the `login` function to accept role_level:

```typescript
// BEFORE
const login = useCallback((email: string, name?: string) => {
  setUser({ email, name });
}, []);

// AFTER
const login = useCallback((email: string, name?: string, role_level: AuthUser['role_level'] = 'ceo') => {
  setUser({ email, name, role_level });
}, []);
```

Update the localStorage restoration to handle legacy sessions without role_level:

```typescript
const [user, setUser] = useState<AuthUser | null>(() => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as AuthUser;
    // Legacy sessions may not have role_level — default to 'ceo' for demo
    if (!parsed.role_level) parsed.role_level = 'ceo';
    return parsed;
  } catch { return null; }
});
```

**Backward compatibility:** Existing login flows (SignIn, Demo, EnterApp) continue to work. They now default to 'ceo' role_level. For the demo, add a role selector to the SignIn component later.

#### Step 0.2: Add v3 routes

**File:** `src/app/routes.tsx`

Add lazy imports for the 6 new pages:

```typescript
// Add below existing lazy imports
const Genesis     = lazy(() => import("./components/Genesis").then(m => ({ default: m.Genesis })));
const MeridianPage = lazy(() => import("./components/Meridian").then(m => ({ default: m.MeridianPage })));
const Checkpoint  = lazy(() => import("./components/Checkpoint").then(m => ({ default: m.Checkpoint })));
const Synthesis   = lazy(() => import("./components/Synthesis").then(m => ({ default: m.Synthesis })));
const Calibration = lazy(() => import("./components/Calibration").then(m => ({ default: m.Calibration })));
```

Add the new routes inside the `/app` children array, before the `*` catch-all:

```typescript
// Add BEFORE { path: "*", element: <NotFound /> }
{ path: "onboard",    element: withSuspense(Genesis) },
{ path: "roadmap",    element: withSuspense(MeridianPage) },
{ path: "approvals",  element: withSuspense(Checkpoint) },
{ path: "reports",    element: withSuspense(Synthesis) },
{ path: "admin",      element: withSuspense(Calibration) },
```

**Note:** Luminary is NOT a route — it is a floating overlay rendered inside Layout.tsx, triggered by a button. It does not have its own URL path.

#### Step 0.3: Update Layout.tsx depth/position maps

**File:** `src/app/components/Layout.tsx`

Add v3 routes to both maps:

```typescript
// Add to depthMap
'/app/onboard': 0,     // Genesis — same depth as Spectrum (top-level)
'/app/roadmap': 1,     // Meridian — feature depth
'/app/approvals': 1,   // Checkpoint — feature depth
'/app/reports': 1,     // Synthesis — feature depth
'/app/admin': 1,       // Calibration — feature depth

// Add to posMap
'/app/onboard': -1,    // Genesis — before everything (leftmost)
'/app/roadmap': 8,     // After settings in the lateral order
'/app/approvals': 9,
'/app/reports': 10,
'/app/admin': 11,
```

**Genesis dock hiding:** Genesis should hide the Dock during the onboarding flow. Add this to the Layout component:

```typescript
// Inside the Layout function, before the return
const location = useLocation();
const hideDocK = location.pathname === '/app/onboard';
```

Then conditionally render the Dock:

```tsx
{/* Replace <Dock /> with: */}
{!hideDock && <Dock />}
```

#### Step 0.4: Update Dock navigation

**File:** `src/app/components/ui/Dock.tsx`

**Change 1:** Rename "Rankings" to "The Race" in primaryNav:

```typescript
// BEFORE
{ Icon: IconLeaderboard, path: '/app/leaderboard', label: 'Rankings' },

// AFTER
{ Icon: IconLeaderboard, path: '/app/leaderboard', label: 'The Race' },
```

**Change 2:** Add v3 items to featureNav:

```typescript
const featureNav = [
  { Icon: IconReviews,    path: '/app/review',     label: '360° Reviews', color: '#c084fc' },
  { Icon: IconAttendance, path: '/app/attendance',  label: 'Attendance',   color: '#38bdf8' },
  { Icon: IconMeridian,   path: '/app/roadmap',     label: 'Meridian',     color: '#10b981' },
  { Icon: IconCheckpoint, path: '/app/approvals',   label: 'Checkpoint',   color: '#f59e0b' },
  { Icon: IconSynthesis,  path: '/app/reports',     label: 'Synthesis',    color: '#f43f5e' },
  { Icon: IconSettings,   path: '/app/settings',    label: 'Settings',     color: '#94a3b8' },
  // Calibration replaces Settings position for CEO — role check added in Phase 1
];
```

**Change 3:** Add the Luminary floating button. This is rendered OUTSIDE the dock bar, positioned above it:

```tsx
// Add before the {/* Main dock */} section
<LuminaryButton />
```

Create the LuminaryButton component (see Phase 1 for the full implementation). For now, create a placeholder file.

#### Step 0.5: Create placeholder page components

Create minimal skeleton files for each new page so the routes resolve without errors. Each follows the exact same pattern as existing pages:

```typescript
// src/app/components/Genesis.tsx
import React from 'react';
import { motion } from 'motion/react';
import { EmptyState } from './ui/EmptyState';

export function Genesis() {
  return (
    <div className="page-wrap">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
           style={{ color: 'var(--p-text-lo)' }}>
          CEO Onboard
        </p>
        <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
          Your <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Genesis</span>
        </h1>
      </motion.div>
      <EmptyState variant="genesis" />
    </div>
  );
}
```

Repeat this pattern for: `Meridian.tsx` (title: "The *Meridian*"), `Checkpoint.tsx` ("Signal *Checkpoint*"), `Synthesis.tsx` ("Signal *Synthesis*"), `Calibration.tsx` ("System *Calibration*").

#### Step 0.6: Add v3 mock data

**File:** `src/app/mockData.ts`

Add new entity data at the bottom of the file. This does NOT modify existing employee data — it adds alongside it.

```typescript
// ═══ V3 ENTITIES ═══

export const companyConfig = {
  id: 'c1',
  name: 'Nexora',
  privacyLevel: 'layered' as const,
  conversationMemoryDays: 30,
  annualRevenueTarget: 3200000,
  departmentBudgets: [
    { departmentId: 'core-arch', budget: 800000 },
    { departmentId: 'ux', budget: 600000 },
    { departmentId: 'data-infra', budget: 700000 },
    { departmentId: 'growth', budget: 500000 },
  ],
  financialDataSource: 'manual' as const,
  standupReminderTime: '09:00',
  standupTimezone: 'Asia/Kolkata',
  missedStandupEscalationHours: 4,
};

export const visionDocument = {
  id: 'v1',
  uploadedAt: '2026-01-15T10:00:00Z',
  rawText: 'We are building an AI-powered workforce management platform...',
  mission: 'Empower every CEO with an AI Chief Operating Officer',
  revenueTargets: [
    { period: 'Q1 2026', target: 600000 },
    { period: 'Q2 2026', target: 800000 },
    { period: 'Q3 2026', target: 900000 },
    { period: 'Q4 2026', target: 900000 },
  ],
  resources: { money: 2000000, headcount: 8, timeMonths: 12 },
  targetAudience: 'CEOs of 10-50 person companies',
  constraints: ['No external funding', 'Remote-first team', 'Ship MVP in 6 months'],
};

export const roadmap = {
  id: 'r1',
  visionId: 'v1',
  status: 'active' as const,
  milestones: [
    { id: 'm1', title: 'Authentication System', description: 'Complete auth with SSO', departmentId: 'core-arch',
      targetDate: '2026-03-15', status: 'completed' as const, progress: 100, okrs: [], dependencies: [] },
    { id: 'm2', title: 'Design System v2', description: 'Component library refresh', departmentId: 'ux',
      targetDate: '2026-04-01', status: 'completed' as const, progress: 100, okrs: [], dependencies: ['m1'] },
    { id: 'm3', title: 'API Gateway', description: 'Rate limiting, caching, auth proxy', departmentId: 'core-arch',
      targetDate: '2026-05-10', status: 'in_progress' as const, progress: 65, okrs: [], dependencies: ['m1'] },
    { id: 'm4', title: 'User Research Phase 2', description: 'Enterprise customer interviews', departmentId: 'growth',
      targetDate: '2026-05-25', status: 'in_progress' as const, progress: 40, okrs: [], dependencies: [] },
    { id: 'm5', title: 'Beta Launch', description: 'Invite-only beta with 10 companies', departmentId: 'growth',
      targetDate: '2026-06-30', status: 'not_started' as const, progress: 0, okrs: [], dependencies: ['m3', 'm4'] },
    { id: 'm6', title: 'Scale Infrastructure', description: 'Multi-tenant, CDN, monitoring', departmentId: 'data-infra',
      targetDate: '2026-07-15', status: 'not_started' as const, progress: 0, okrs: [], dependencies: ['m3'] },
    { id: 'm7', title: 'GA Release', description: 'Public launch with self-serve onboard', departmentId: 'growth',
      targetDate: '2026-08-30', status: 'not_started' as const, progress: 0, okrs: [], dependencies: ['m5', 'm6'] },
  ],
  risks: [
    { id: 'rk1', title: 'Beta feedback may require scope change', severity: 'medium', mitigation: 'Build modular — any component can be swapped' },
    { id: 'rk2', title: 'Infrastructure costs at scale', severity: 'high', mitigation: 'Usage-based pricing, aggressive caching' },
  ],
  gaps: [],
};

// Conversation history for employee e1 (Arjun) — 14 days of standups
export const conversations = [
  {
    id: 'conv-1', employeeId: 'e1', date: '2026-03-20',
    type: 'daily_standup' as const,
    messages: [
      { id: 'msg-1', role: 'ai_manager' as const, content: 'Good morning Arjun. How\'s the API gateway work going?', timestamp: '2026-03-20T09:01:00Z', isPrivate: false },
      { id: 'msg-2', role: 'employee' as const, content: 'Making good progress. Rate limiter is done, working on the caching layer now. Should be done by Thursday.', timestamp: '2026-03-20T09:02:00Z', isPrivate: false },
      { id: 'msg-3', role: 'ai_manager' as const, content: 'Great. Any blockers?', timestamp: '2026-03-20T09:02:30Z', isPrivate: false },
      { id: 'msg-4', role: 'employee' as const, content: 'Need access to the staging Redis cluster. Ravi said he\'d set it up but hasn\'t yet.', timestamp: '2026-03-20T09:03:00Z', isPrivate: false },
    ],
    aiSummary: 'Arjun is on track with API gateway. Blocker: waiting for Ravi to provision staging Redis.',
    sentiment: 'positive' as const,
    topicsDiscussed: ['API gateway', 'caching', 'Redis access'],
    actionItems: [{ description: 'Follow up with Ravi on staging Redis', taskId: undefined }],
    blockers: ['Staging Redis not provisioned'],
    wins: ['Rate limiter completed ahead of schedule'],
    hasPrivateContent: false,
    privateMessageIds: [],
  },
  // ... add 13 more conversation records for a 14-day history
  // Pattern: alternate between positive/neutral/concerned sentiments
  // Include 2 missed days (red dots in Echo Trail)
];

// Extracted context (persists beyond memory window)
export const conversationExtracts = [
  {
    employeeId: 'e1', extractedAt: '2026-03-20',
    ongoingBlockers: ['Staging Redis access pending from Ravi'],
    commitmentsMade: ['API gateway caching layer by Thursday'],
    winsNoted: ['Rate limiter completed ahead of schedule'],
    concernsRaised: [],
    keyTopics: ['API gateway', 'infrastructure'],
    sentimentTrend: 'stable' as const,
  },
];
```

**Tip:** Generate 14 conversation records for a realistic Echo Trail. Vary sentiments. Include 2 missed days. This seed data makes every v3 screen look populated during development.

#### Step 0.7: Create v3 stores

Create the store directory and foundational stores. Each store follows the AuthContext pattern (React Context + localStorage) but manages a specific entity type.

**File:** `src/app/stores/companyConfigStore.ts`

```typescript
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { companyConfig as defaultConfig } from '../mockData';

// Type matches PA.md §8.1
interface CompanyConfig {
  id: string;
  name: string;
  privacyLevel: 'full_transparency' | 'summary_only' | 'layered';
  conversationMemoryDays: 7 | 30 | 90 | -1;
  annualRevenueTarget: number;
  departmentBudgets: { departmentId: string; budget: number }[];
  financialDataSource: 'manual' | 'quickbooks' | 'xero';
  standupReminderTime: string;
  standupTimezone: string;
  missedStandupEscalationHours: number;
}

interface CompanyConfigContextType {
  config: CompanyConfig;
  updateConfig: (partial: Partial<CompanyConfig>) => void;
}

const STORAGE_KEY = 'prism_company_config';
const CompanyConfigContext = createContext<CompanyConfigContextType | null>(null);

export function CompanyConfigProvider({ children }) {
  const [config, setConfig] = useState<CompanyConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultConfig;
    } catch { return defaultConfig; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback((partial: Partial<CompanyConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  return (
    <CompanyConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </CompanyConfigContext.Provider>
  );
}

export function useCompanyConfig() {
  const ctx = useContext(CompanyConfigContext);
  if (!ctx) throw new Error('useCompanyConfig must be used within CompanyConfigProvider');
  return ctx;
}
```

Create similar stores for `roadmapStore.ts`, `conversationStore.ts`, and `avatarStore.ts`. Same pattern, different entity types.

**Wire the providers into App.tsx:**

```tsx
// src/app/App.tsx — wrap the RouterProvider with store providers
<AuthProvider>
  <ThemeProvider>
    <CompanyConfigProvider>
      <RoadmapProvider>
        <ConversationProvider>
          <RouterProvider router={router} />
        </ConversationProvider>
      </RoadmapProvider>
    </CompanyConfigProvider>
  </ThemeProvider>
</AuthProvider>
```

#### Step 0.8: Create .env file

```env
# API Keys — demo use only, not production-safe
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_ELEVENLABS_API_KEY=your-key-here
VITE_ELEVENLABS_PRISM_VOICE_ID=your-voice-id
VITE_DID_API_KEY=your-key-here
VITE_AI_MODEL=claude-sonnet-4-20250514
```

Add `.env` to `.gitignore` if not already there.

---

### Phase 0 Verification

After Phase 0, verify:
- App boots without errors
- All existing routes still work
- New routes (`/app/onboard`, `/app/roadmap`, `/app/approvals`, `/app/reports`, `/app/admin`) show skeleton pages
- Dock shows "The Race" instead of "Rankings"
- Dock feature tray includes Meridian, Checkpoint, Synthesis
- AuthContext includes role_level (check in React DevTools)
- No console errors

---

### Phase 1-7: Build New Screens

Each phase builds one or more screens. Refer to `PRODUCT_ARCHITECTURE_v3.md` §6 for the complete screen specification. Below are the key integration patterns.

### Phase 1: AI Service Layer

**File:** `src/app/services/aiService.ts`

This is the foundation for every AI feature. Build it before any screen that uses AI.

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Demo only — production uses server proxy
});

// Streaming chat for Luminary conversations
export async function* streamChat(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  onText?: (text: string) => void,
) {
  const stream = await client.messages.stream({
    model: import.meta.env.VITE_AI_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      onText?.(fullText);
      yield event.delta.text;
    }
  }
  return fullText;
}

// One-shot generation (for Genesis parsing, Illuminations, Synthesis reports)
export async function generate(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await client.messages.create({
    model: import.meta.env.VITE_AI_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}
```

**File:** `src/app/services/voiceService.ts`

```typescript
// ElevenLabs TTS integration
export async function textToSpeech(
  text: string,
  voiceId?: string, // If undefined, uses Prism default voice
): Promise<ArrayBuffer> {
  const id = voiceId || import.meta.env.VITE_ELEVENLABS_PRISM_VOICE_ID;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  return response.arrayBuffer();
}

export function playAudio(buffer: ArrayBuffer): Promise<void> {
  return new Promise((resolve) => {
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.play();
  });
}
```

### Phase 2-7: Screen-by-Screen Build

For each screen, follow this pattern:

1. Read the screen spec in PA.md §6.x
2. Read the design patterns in SKILL.md §3
3. Copy the hero pattern from an existing page (Leaderboard.tsx is the cleanest example)
4. Build the screen content using Prism card patterns
5. Wire the screen to its store
6. Connect AI service calls where needed
7. Test the transition choreography (lateral slides vs dive)

**Key patterns to copy from existing code:**

| Pattern | Copy from | Used in |
|---------|-----------|---------|
| Page hero + back button | `Leaderboard.tsx` lines 1-20 of the return JSX | All new pages |
| Card with ambient glow | `Spectrum.tsx` line 365 (overview card) | All new pages |
| Pill-style sub-tabs | `Spectrum.tsx` line 355 (analytics tabs) | Meridian view toggle, Checkpoint tabs |
| Section marker | `Spectrum.tsx` line 222 | Every section on every page |
| Avatar grayscale | `Spectrum.tsx` line 253 (constellation cards) | Checkpoint employee avatars |
| AnimatePresence expand | `Spectrum.tsx` dimension row expansion | Checkpoint card expand, Meridian milestone drill-down |
| Spring layout animation | `Leaderboard.tsx` bar animations | Focus-dim card transitions |
| EmptyState | `src/app/components/ui/EmptyState.tsx` | All screens when no data |

---

## 4. Potential Challenges and Mitigations

### Challenge 1: Luminary is NOT a route — it's an overlay

Unlike every other new screen, Luminary does not have a URL path. It is rendered as a floating overlay from within `Layout.tsx`, triggered by a button. This means:

- The Luminary component lives INSIDE the Layout, not as an Outlet child
- It uses a portal or absolute positioning to cover the viewport
- Dawn Sequence animations affect the existing page (blur, scale down)
- The Luminary state must persist across route changes (user can open Luminary on Tasks, navigate to Team, and Luminary stays open)

**Recommendation:** Render `<Luminary />` as a sibling of `<main>` and `<Dock />` inside Layout.tsx. Use a LuminaryContext (open/close state, current conversation) that persists across route changes.

```tsx
// Layout.tsx return
<div className="prism-shell ...">
  <CustomCursor />
  {/* Ambient background ... */}
  <main>
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} ...>
        <Outlet />
      </motion.div>
    </AnimatePresence>
  </main>
  {!hideDock && <Dock />}
  <LuminaryButton />
  <Luminary />  {/* Portal-style overlay, rendered when open */}
</div>
```

### Challenge 2: Dawn Sequence must affect the underlying page

The Dawn Sequence blurs and dims the current page content. This requires the animation to target the `<main>` element and the `<Dock>` — both of which are siblings, not children. Use a shared state (LuminaryContext) that Layout reads:

```tsx
const { isLuminaryOpen, dawnPhase } = useLuminary();

// Apply Dawn Sequence to main + dock
<main style={{
  filter: isLuminaryOpen ? 'blur(8px)' : 'none',
  transform: isLuminaryOpen ? 'scale(0.96)' : 'scale(1)',
  opacity: isLuminaryOpen ? 0.4 : 1,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
}}>
```

### Challenge 3: Focus-dim requires sibling awareness

The Checkpoint focus-dim model (hover one card, dim all others) requires each card to know whether ANY card is hovered. This is solved with a single state at the grid level:

```tsx
const [hoveredId, setHoveredId] = useState<string | null>(null);

{approvals.map(a => (
  <Card key={a.id}
    onMouseEnter={() => setHoveredId(a.id)}
    onMouseLeave={() => setHoveredId(null)}
    style={{
      opacity: hoveredId && hoveredId !== a.id ? 0.4 : 1,
      transform: hoveredId === a.id ? 'scale(1.01)' : 'scale(1)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
  >
```

### Challenge 4: Signal Path SVG is complex

The Meridian Signal Path view requires a hand-crafted SVG with:
- Linear time axis (proportional positioning by date)
- Department swim lanes
- Glowing nodes with status colors
- Bézier dependency curves
- Click-to-expand with AnimatePresence

**Recommendation:** Build the Signal Path as its own component (`src/app/components/meridian/SignalPath.tsx`). Calculate milestone X positions as: `((milestoneDate - startDate) / (endDate - startDate)) * 100` percent of the SVG width. Use the existing Prism hand-crafted SVG patterns (see ThePrism in Spectrum.tsx for the exact SVG + motion approach).

### Challenge 5: Voice input via Web Speech API

The VoiceInput component uses the Web Speech API (`webkitSpeechRecognition`). This has browser compatibility limitations:
- Chrome: full support
- Firefox: limited (no continuous mode)
- Safari: partial support
- Edge: full support (Chromium-based)

For the demo, target Chrome. Add a browser check that shows "Voice input requires Chrome" on unsupported browsers.

### Challenge 6: D-ID avatar video streaming

D-ID's Talks API generates a video file (not a real-time stream). The workflow is:
1. Send: manager photo + audio (from ElevenLabs TTS)
2. Wait: D-ID processes (2-5 seconds)
3. Receive: video URL
4. Play: render in a `<video>` element

This means the avatar cannot lip-sync in real-time during streaming text responses. The solution (as specced in PA.md): text streams to UI first, voice plays alongside (from ElevenLabs), avatar video plays AFTER both are ready. The Dawn Sequence Warm Hold covers this latency.

### Challenge 7: Preserving existing page functionality

Every change to existing files (mockData, AuthContext, Layout, Dock) must be backward-compatible. Test these specific flows after each modification:
- Sign in → ThresholdTransition → Spectrum loads
- Navigate between all existing pages (Team, KPIs, Attendance, etc.)
- Employee Detail page loads with existing data
- Tasks kanban drag-and-drop still works
- Theme toggle still works
- Custom cursor still works
- Landing page and Demo page still work
- All route aliases (spectrum, reviews, analytics, roi) still redirect correctly

---

## 5. Testing Checklist

After full integration, verify each screen:

| Screen | Key Test | Pass Criteria |
|--------|----------|--------------|
| Genesis | Voice dictation records and shows transcript | Mic activates, words stream in, upload zone works |
| Meridian | Signal Path shows milestones on time axis | Nodes positioned by date, dependency threads visible, zoom works |
| Luminary | Dawn Sequence plays on first open | Breath → Warmth → Hold → Presence → Room in sequence |
| Checkpoint | Focus-dim works on hover | Hovered card bright, others dim, actions always visible |
| Synthesis | Template gallery renders 6 cards | Cards clickable, Execution Velocity shows 3 layers |
| Calibration | Scroll-spy sidebar highlights | Dot follows scroll position, sections are Prism cards |
| Spectrum | Illuminations section present | AI insight cards below Prism orbital |
| Employee Detail | Echo Trail dots render | 30 days of dots with color coding |
| Dock | All nav items present | "The Race" label, Meridian/Checkpoint/Synthesis in tray |
| Transitions | New routes animate correctly | Lateral slide between same-depth, dive into detail |

---

## 6. File Dependency Graph

Build files in this order to avoid import errors:

```
.env
  ↓
AuthContext.tsx (modify)
  ↓
mockData.ts (modify — add v3 entities)
  ↓
stores/ (create all 4 store files)
  ↓
App.tsx (wrap with store providers)
  ↓
services/aiService.ts
services/voiceService.ts
services/avatarService.ts
  ↓
ui/VoiceInput.tsx
ui/LuminaryButton.tsx
ui/AISourceBadge.tsx
ui/NotificationBell.tsx
  ↓
DockIcons.tsx (add new icons)
Dock.tsx (modify — add nav items)
Layout.tsx (modify — add depth/posMap, Luminary, dock hiding)
routes.tsx (modify — add routes)
  ↓
Genesis.tsx
Meridian.tsx
Luminary.tsx
Checkpoint.tsx
Synthesis.tsx
Calibration.tsx
  ↓
Spectrum.tsx (modify — add Illuminations, Meridian Pulse, Execution Velocity)
EmployeeDetail.tsx (modify — add Echo Trail, Work Stream)
Leaderboard.tsx (modify — add Meridian Alignment metric)
```

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| `PRODUCT_ARCHITECTURE_v3.md` | Complete spec for all 51 decisions, screen specs, data model, build plan |
| `DESIGN_DOCUMENT.md` | Design system, token architecture, existing page specs, v3 summaries |
| `SKILL.md` | Copy-paste JSX patterns, two disclosure models, 33 Do NOT rules, naming universe |
