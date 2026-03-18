import React from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  MessageSquare, 
  CalendarClock, 
  PieChart,
  Settings,
  Rocket
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'My Team', path: '/team' },
  { icon: Rocket, label: 'Onboarding', path: '/onboarding' },
  { icon: ClipboardCheck, label: 'Tasks & Quality', path: '/tasks' },
  { icon: GraduationCap, label: 'Learning Hub', path: '/learning' },
  { icon: MessageSquare, label: 'Feedback & Surveys', path: '/feedback' },
  { icon: CalendarClock, label: 'Timesheets', path: '/timesheets' },
  { icon: PieChart, label: 'Analytics', path: '/analytics' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
          <Rocket size={18} />
        </div>
        <span className="text-xl font-semibold text-white tracking-tight">EvolveHR</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Manager View</div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white">
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
