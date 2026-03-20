import { createBrowserRouter } from "react-router";
import { Layout }            from "./components/Layout";
import { LandingPage }       from "./components/landing/LandingPage";
import { SignIn }            from "./components/SignIn";
import { Demo }              from "./components/Demo";
import { EnterApp }          from "./components/EnterApp";
import { Dashboard }         from "./components/Dashboard";
import { EmployeeDetail }    from "./components/EmployeeDetail";
import { Analytics }         from "./components/Analytics";
import { Tasks }             from "./components/Tasks";
import { Settings }          from "./components/Settings";
import { KPIGoals }          from "./components/KPIGoals";
import { Reviews360 }        from "./components/Reviews360";
import { Attendance }        from "./components/Attendance";
import { ROIInvestment }     from "./components/ROIInvestment";
import { Leaderboard }       from "./components/Leaderboard";
import { PerformanceReview } from "./components/PerformanceReview";
import { ProtectedRoute }    from "./auth/ProtectedRoute";
import React                 from "react";

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────
  { path: "/",        Component: LandingPage },
  { path: "/sign-in", Component: SignIn      },
  { path: "/demo",    Component: Demo        },

  // ── The threshold — paper into void ─────────────────────────
  {
    path: "/enter",
    element: (
      <ProtectedRoute>
        <EnterApp />
      </ProtectedRoute>
    ),
  },

  // ── App shell ───────────────────────────────────────────────
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,              Component: Dashboard         },
      { path: "team",             Component: Dashboard         },
      { path: "employee/:id",     Component: EmployeeDetail    },
      { path: "analytics",        Component: Analytics         },
      { path: "kpis",             Component: KPIGoals          },
      { path: "reviews",          Component: Reviews360        },
      { path: "attendance",       Component: Attendance        },
      { path: "roi",              Component: ROIInvestment     },
      { path: "leaderboard",      Component: Leaderboard       },
      { path: "review",           Component: PerformanceReview },
      { path: "tasks",            Component: Tasks             },
      { path: "settings",         Component: Settings          },
      {
        path: "*",
        Component: () => (
          <div className="h-screen w-full flex items-center justify-center font-mono text-white/30 tracking-[0.5em] text-xs uppercase">
            404 // Signal Lost
          </div>
        ),
      },
    ],
  },
]);
