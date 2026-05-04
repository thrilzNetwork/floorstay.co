import { useState } from 'react';
import { LayoutDashboard, Building2, CalendarDays, BarChart3, Globe, BookOpen, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'storefront', label: 'Storefront', icon: Globe },
  { id: 'guidebooks', label: 'Guidebooks', icon: BookOpen },
];

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  userRole: 'admin' | 'owner';
}

export default function Sidebar({ active, onNavigate, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[240px]'} shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-slate-200 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
          FS
        </div>
        {!collapsed && <span className="ml-2.5 font-bold text-lg tracking-tight text-slate-900 truncate">FloorStay</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-slate-300 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
