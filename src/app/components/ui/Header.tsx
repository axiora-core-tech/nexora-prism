import React from 'react';
import { Bell, Search, UserCircle, ChevronDown, AlignLeft } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500 hover:text-slate-700">
          <AlignLeft size={24} />
        </button>
        <div className="relative hidden md:block w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employee, tasks, or reports..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border border-indigo-200">
             M
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Emily Director</div>
            <div className="text-xs text-slate-500">VP of Engineering</div>
          </div>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
}
