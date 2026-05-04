import { LayoutDashboard, Building2, CalendarDays, BarChart3, Globe, BookOpen, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const NAV = [
  { id: 'dashboard',  icon: LayoutDashboard, label: 'Overview' },
  { id: 'properties', icon: Building2,      label: 'Properties' },
  { id: 'bookings',   icon: CalendarDays,     label: 'Bookings' },
  { id: 'analytics',  icon: BarChart3,        label: 'Analytics' },
  { id: 'storefront', icon: Globe,            label: 'Storefront' },
  { id: 'guidebooks', icon: BookOpen,         label: 'Guidebooks' },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200 shrink-0 z-50">
      {/* Collapsible width */}
      <motion.div
        animate={{ width: isOpen ? 220 : 64 }}
        transition={{ duration: 0.2 }}
        className="h-full flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-gray-200">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold mr-3">FS</div>
          {isOpen && <span className="font-bold text-sm tracking-tight text-gray-900">FloorStay</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV.map(item => (
            <NavItem
              key={item.id}
              icon={<item.icon size={18} strokeWidth={1.5} />}
              label={item.label}
              active={activeTab === item.id}
              collapsed={!isOpen}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-gray-200">
          <NavItem
            icon={<Settings size={18} strokeWidth={1.5} />}
            label="Settings"
            collapsed={!isOpen}
            onClick={() => {}}
          />
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center h-8 mt-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </motion.div>
    </aside>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
