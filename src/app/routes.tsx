import { createBrowserRouter } from "react-router";
import { Layout }         from "./components/Layout";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import React, { lazy, Suspense } from "react";

// ─── Lazy-loaded pages ──────────────────────────────────────────────────────
const LandingPage       = lazy(() => import("./components/landing/LandingPage").then(m => ({ default: m.LandingPage })));
const SignIn            = lazy(() => import("./components/SignIn").then(m => ({ default: m.SignIn })));
const Demo              = lazy(() => import("./components/Demo").then(m => ({ default: m.Demo })));
const EnterApp          = lazy(() => import("./components/EnterApp").then(m => ({ default: m.EnterApp })));
const Dashboard         = lazy(() => import("./components/Dashboard").then(m => ({ default: m.Dashboard })));
const EmployeeDetail    = lazy(() => import("./components/EmployeeDetail").then(m => ({ default: m.EmployeeDetail })));
const Analytics         = lazy(() => import("./components/Analytics").then(m => ({ default: m.Analytics })));
const Tasks             = lazy(() => import("./components/Tasks").then(m => ({ default: m.Tasks })));
const Settings          = lazy(() => import("./components/Settings").then(m => ({ default: m.Settings })));
const KPIGoals          = lazy(() => import("./components/KPIGoals").then(m => ({ default: m.KPIGoals })));
const Attendance        = lazy(() => import("./components/Attendance").then(m => ({ default: m.Attendance })));
const ROIInvestment     = lazy(() => import("./components/ROIInvestment").then(m => ({ default: m.ROIInvestment })));
const Leaderboard       = lazy(() => import("./components/Leaderboard").then(m => ({ default: m.Leaderboard })));
const PerformanceReview = lazy(() => import("./components/PerformanceReview").then(m => ({ default: m.PerformanceReview })));
const Team               = lazy(() => import("./components/Team").then(m => ({ default: m.Team })));
const Spectrum           = lazy(() => import("./components/Spectrum").then(m => ({ default: m.Spectrum })));

// ─── v3 new pages ──────────────────────────────────────────────────────
const Genesis        = lazy(() => import("./components/Genesis").then(m => ({ default: m.Genesis })));
const MeridianPage   = lazy(() => import("./components/Meridian").then(m => ({ default: m.MeridianPage })));
const Checkpoint     = lazy(() => import("./components/Checkpoint").then(m => ({ default: m.Checkpoint })));
const Synthesis      = lazy(() => import("./components/Synthesis").then(m => ({ default: m.Synthesis })));
const Calibration    = lazy(() => import("./components/Calibration").then(m => ({ default: m.Calibration })));
const AvatarPage     = lazy(() => import("./components/Sanctum").then(m => ({ default: m.SanctumPage })));

// ─── Loading skeleton — mimics page structure with pulsing blocks ───────────
// Inline styles for CSS animation (no dependency on theme CSS during chunk load)
const pulseStyle = `
  @keyframes prism-skeleton-pulse {
    0%, 100% { opacity: 0.04; }
    50% { opacity: 0.08; }
  }
  .sk-pulse {
    animation: prism-skeleton-pulse 1.8s ease-in-out infinite;
    background: currentColor;
    border-radius: 8px;
  }
  .sk-pulse-delay { animation-delay: 0.3s; }
  .sk-pulse-delay-2 { animation-delay: 0.6s; }
`;

function PageSkeleton() {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
      background: '#050810', zIndex: 9999,
    }}>
      <style>{`
        @keyframes prismSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes prismPulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.08); } }
        @keyframes prismFade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06), rgba(192,132,252,0.03), transparent)',
        filter: 'blur(60px)',
      }} />

      {/* Spinner ring */}
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid rgba(56,189,248,0.06)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'rgba(56,189,248,0.5)',
          borderRightColor: 'rgba(192,132,252,0.3)',
          animation: 'prismSpin 1.2s linear infinite',
        }} />
        {/* Inner orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.8), rgba(56,189,248,0.2))',
          boxShadow: '0 0 12px rgba(56,189,248,0.3)',
          animation: 'prismPulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* Loading text */}
      <div style={{
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
        fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'rgba(56,189,248,0.35)',
        animation: 'prismFade 2s ease-in-out infinite',
      }}>
        Loading
      </div>
    </div>
  );
}

// Employee detail gets its own skeleton — split layout
function EmployeeSkeleton() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', color: 'rgba(255,255,255,0.5)' }}>
      <style>{pulseStyle}</style>
      {/* Left panel */}
      <div style={{ width: '40%', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
        <div className="sk-pulse" style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.02 }} />
        <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
          <div className="sk-pulse" style={{ width: 120, height: 14, marginBottom: 16 }} />
          <div className="sk-pulse sk-pulse-delay" style={{ width: 240, height: 48, marginBottom: 8 }} />
          <div className="sk-pulse sk-pulse-delay-2" style={{ width: 200, height: 40 }} />
        </div>
      </div>
      {/* Right panel */}
      <div style={{ flex: 1, padding: '48px 48px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`sk-pulse ${i > 1 ? 'sk-pulse-delay' : ''}`} style={{ width: 80, height: 80, borderRadius: 16 }} />
          ))}
        </div>
        <div className="sk-pulse" style={{ height: 200, borderRadius: 20, marginBottom: 24 }} />
        <div className="sk-pulse sk-pulse-delay" style={{ height: 160, borderRadius: 20, marginBottom: 24 }} />
        <div className="sk-pulse sk-pulse-delay-2" style={{ height: 140, borderRadius: 20 }} />
      </div>
    </div>
  );
}

// ─── 404 page with personality ──────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
      <div style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 200, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>
        404
      </div>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>
        Signal lost
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontWeight: 300, textAlign: 'center', maxWidth: 320, lineHeight: 1.7, marginTop: 8 }}>
        This dimension doesn't exist yet. The page you're looking for may have been moved or collapsed into another signal.
      </p>
      <a href="/app" style={{ marginTop: 16, fontSize: 12, fontFamily: "'Space Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38bdf8', textDecoration: 'none', padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.04)', transition: 'all 0.3s' }}>
        ← Return to overview
      </a>
    </div>
  );
}

// ─── Suspense wrappers ──────────────────────────────────────────────────────
function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  );
}

function withEmployeeSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<EmployeeSkeleton />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  { path: "/",        element: withSuspense(LandingPage) },
  { path: "/sign-in", element: withSuspense(SignIn) },
  { path: "/demo",    element: withSuspense(Demo) },
  {
    path: "/enter",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageSkeleton />}>
          <EnterApp />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,          element: withSuspense(Spectrum) },
      { path: "spectrum",     element: withSuspense(Spectrum) },
      { path: "team",         element: withSuspense(Team) },
      { path: "employee/:id", element: withEmployeeSuspense(EmployeeDetail) },
      { path: "analytics",    element: withSuspense(Analytics) },
      { path: "kpis",         element: withSuspense(KPIGoals) },
      { path: "attendance",   element: withSuspense(Attendance) },
      { path: "roi",          element: withSuspense(ROIInvestment) },
      { path: "leaderboard",  element: withSuspense(Leaderboard) },
      { path: "review",       element: withSuspense(PerformanceReview) },
      { path: "reviews",      element: withSuspense(PerformanceReview) },
      { path: "tasks",        element: withSuspense(Tasks) },
      { path: "settings",     element: withSuspense(Settings) },
      // v3 new routes
      { path: "onboard",     element: withSuspense(Genesis) },
      { path: "roadmap",     element: withSuspense(MeridianPage) },
      { path: "approvals",   element: withSuspense(Checkpoint) },
      { path: "reports",     element: withSuspense(Synthesis) },
      { path: "admin",       element: withSuspense(Calibration) },
      { path: "avatar",      element: withSuspense(AvatarPage) },
      { path: "*",            element: <NotFound /> },
    ],
  },
]);
