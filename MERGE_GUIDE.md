# Prism — Merged Codebase
## LandingPage → main-app Integration Guide

---

## What Was Done

The new marketing Landing Page project has been merged into the main-app as the new public-facing entry point. Every decision below was confirmed before implementation.

---

## Route Map

| Route | Component | Auth? |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/sign-in` | `SignIn` | Public |
| `/demo` | `Demo` | Public |
| `/enter` | `EnterApp` | **Protected** |
| `/app/*` | `Layout` + children | **Protected** |

---

## New Files

### `src/app/auth/AuthContext.tsx`
Simple React context providing `user`, `isAuthenticated`, `login()`, and `logout()`. Wraps the entire app in `App.tsx`. This is **in-memory only** — replace the `login()` body with your real API call when integrating a backend.

### `src/app/auth/ProtectedRoute.tsx`
Route guard component. Redirects unauthenticated users to `/sign-in`, preserving the intended destination in `location.state.from` so they land back where they were trying to go after signing in.

### `src/app/components/SignIn.tsx`
The auth modal from the old `Landing.tsx` (65KB) extracted and rebuilt as a dedicated full-page route at `/sign-in`. Handles Login / Create Account / Org Setup / Invite flows. On success:
- Calls `login()` on the `AuthContext`
- Navigates to `/enter` (ThresholdTransition) then `/app`
- If the user was redirected from a protected route, returns them there instead

### `src/app/components/Demo.tsx`
New dedicated `/demo` route. Collects: name, work email, company, team size, phone, website. Shows a success confirmation screen. Wire up the submit handler to your CRM/email backend.

### `src/app/components/landing/` (directory)
All new landing page components live here, isolated from the app shell:
- `LandingPage.tsx` — root component, mounted at `/`
- `Navbar.tsx` — auto-hides on scroll down, Sign In → `/sign-in`, Request Demo → `/demo`
- `HeroSection.tsx`
- `FeatureSection.tsx`
- `JourneySection.tsx`
- `CTASection.tsx` — "Request Early Access" → `/demo`
- `Footer.tsx`
- `CustomCursor.tsx` — landing page's dark/indigo cursor (separate from app shell's cursor)
- `Loader.tsx` — cinematic intro, fires every visit

---

## Modified Files

### `src/app/App.tsx`
Wrapped `<RouterProvider>` in `<AuthProvider>` so auth state is available everywhere.

### `src/app/routes.tsx`
Complete rewrite:
- `/` now serves `LandingPage` instead of the old monolithic `Landing.tsx`
- Added `/sign-in` and `/demo` as public routes
- `/enter` and `/app/*` are now wrapped in `<ProtectedRoute>`

### `src/app/components/EnterApp.tsx`
Now reads from `AuthContext` — the ThresholdTransition personalises using the signed-in user's first name. Falls back to the first mock employee if no name is available.

### `src/styles/fonts.css`
Cleaned up. All fonts are loaded via `index.html` (preconnect + Google Fonts link) for performance.

### `src/styles/theme.css`
The landing page's base heading/input/button typography rules appended at the bottom.

### `index.html`
Added **Inter** to the Google Fonts link (used by the landing page's body copy). All four families now load in one request: Cormorant Garamond, Inter, Outfit, Space Mono.

### `package.json`
Added all dependencies from the landing page that were missing from main-app:
- `@emotion/react`, `@emotion/styled` (MUI peer deps)
- `@mui/material`, `@mui/icons-material`
- `@popperjs/core`, `react-popper`
- `canvas-confetti`
- `react-slick`, `slick-carousel`
- `react-responsive-masonry`
- Dev: `@types/canvas-confetti`, `@types/react-slick`

---

## Archived / Removed

| File | Action | Reason |
|---|---|---|
| `src/app/components/Landing.tsx` | **Removed** | Replaced by `landing/LandingPage.tsx` + new `SignIn.tsx`. The sign-in modal was extracted into `SignIn.tsx`. |
| `src/app/mockData.ts.bak` | **Removed** | Stale backup file |

---

## What to Do Next

### 1. Install dependencies
```bash
npm install
# or
pnpm install
```

### 2. Wire up real authentication
In `src/app/components/SignIn.tsx`, replace the `handleSuccess()` body:
```ts
const handleSuccess = async () => {
  // TODO: call your auth API
  const response = await authApi.login(email, pass);
  login(response.user.email, response.user.name);
  setDone(true);
};
```

### 3. Wire up the Demo form
In `src/app/components/Demo.tsx`, replace the submit handler:
```ts
// TODO: POST to your CRM / email backend
await fetch('/api/demo-request', {
  method: 'POST',
  body: JSON.stringify({ name, email, company, size, phone, website }),
});
setDone(true);
```

### 4. Activate Navbar scroll-to-section anchors
The four Navbar items (Intelligence, Forecasting, Feedback, Platform) are currently placeholders. When you're ready to wire them up to landing page sections, add `id` attributes to the section elements and update the Navbar buttons to use smooth-scroll or `react-scroll`.

### 5. Persist auth across page refreshes (when ready)
The current `AuthContext` is in-memory only — a refresh logs the user out. When you add a backend, store a JWT in `localStorage` or a secure cookie and restore it in a `useEffect` inside `AuthProvider`.

### 6. Logout
Call `logout()` from `useAuth()` wherever you want to add a sign-out button (e.g. in `Settings.tsx` or the `Dock`).

---

## Component Diagram

```
App (AuthProvider)
└── RouterProvider
    ├── / → LandingPage
    │   ├── Loader (cinematic intro, every visit)
    │   ├── Navbar → /sign-in, /demo
    │   ├── HeroSection
    │   ├── FeatureSection
    │   ├── JourneySection
    │   ├── CTASection → /demo
    │   └── Footer
    │
    ├── /sign-in → SignIn
    │   └── on success → /enter → /app
    │
    ├── /demo → Demo
    │
    ├── /enter → ProtectedRoute → EnterApp (ThresholdTransition)
    │
    └── /app → ProtectedRoute → Layout
        ├── /app          → Dashboard
        ├── /app/team     → Dashboard
        ├── /app/employee/:id → EmployeeDetail
        ├── /app/analytics    → Analytics
        ├── /app/kpis         → KPIGoals
        ├── /app/reviews      → Reviews360
        ├── /app/attendance   → Attendance
        ├── /app/roi          → ROIInvestment
        ├── /app/leaderboard  → Leaderboard
        ├── /app/review       → PerformanceReview
        ├── /app/tasks        → Tasks
        └── /app/settings     → Settings
```
