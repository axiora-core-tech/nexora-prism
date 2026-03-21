import { createBrowserRouter } from "react-router";
import { Layout }         from "./components/Layout";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import React, { lazy, Suspense } from "react";

// ─── Lazy-loaded pages (each gets its own JS chunk) ──────────────────────────
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

// ─── Minimal fallback shown during chunk load ─────────────────────────────────
function PageFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border border-white/20 border-t-white/60 animate-spin" />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageFallback />}>
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
        <Suspense fallback={<PageFallback />}>
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
      { index: true,          element: withSuspense(Dashboard) },
      { path: "team",         element: withSuspense(Team) },
      { path: "employee/:id", element: withSuspense(EmployeeDetail) },
      { path: "analytics",    element: withSuspense(Analytics) },
      { path: "kpis",         element: withSuspense(KPIGoals) },
      { path: "attendance",   element: withSuspense(Attendance) },
      { path: "roi",          element: withSuspense(ROIInvestment) },
      { path: "leaderboard",  element: withSuspense(Leaderboard) },
      { path: "review",       element: withSuspense(PerformanceReview) },
      { path: "reviews",      element: withSuspense(PerformanceReview) },
      { path: "tasks",        element: withSuspense(Tasks) },
      { path: "settings",     element: withSuspense(Settings) },
      { path: "spectrum",     element: withSuspense(Spectrum) },
      {
        path: "*",
        element: (
          <div className="h-screen w-full flex items-center justify-center font-mono text-white/30 tracking-[0.5em] text-xs uppercase">
            404 // Signal Lost
          </div>
        ),
      },
    ],
  },
]);
