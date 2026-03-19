import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./components/Landing";
import { EnterApp } from "./components/EnterApp";
import { Dashboard } from "./components/Dashboard";
import { EmployeeDetail } from "./components/EmployeeDetail";
import { Analytics } from "./components/Analytics";
import { Tasks } from "./components/Tasks";
import { Settings } from "./components/Settings";
import { KPIGoals } from "./components/KPIGoals";
import { Reviews360 } from "./components/Reviews360";
import { Attendance } from "./components/Attendance";
import { ROIInvestment } from "./components/ROIInvestment";
import { Leaderboard } from "./components/Leaderboard";
import { PerformanceReview } from "./components/PerformanceReview";

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────
  { path: "/", Component: Landing },

  // ── The threshold — paper into void ─────────────────────────
  { path: "/enter", Component: EnterApp },

  // ── App shell ───────────────────────────────────────────────
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true,              Component: Dashboard        },
      { path: "team",             Component: Dashboard        },
      { path: "employee/:id",     Component: EmployeeDetail   },
      { path: "analytics",        Component: Analytics        },
      { path: "kpis",             Component: KPIGoals         },
      { path: "reviews",          Component: Reviews360       },
      { path: "attendance",       Component: Attendance       },
      { path: "roi",              Component: ROIInvestment    },
      { path: "leaderboard",      Component: Leaderboard      },
      { path: "review",           Component: PerformanceReview},
      { path: "tasks",            Component: Tasks            },
      { path: "settings",         Component: Settings         },
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
