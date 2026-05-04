import { Layout, Home, Calendar, BarChart3, Settings, Plus, BookOpen, MessageSquare, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: Layout, label: 'Dashboard' },
  { id: 'properties', icon: Home, label: 'Properties' },
  { id: 'bookings', icon: Calendar, label: 'Bookings' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'storefront', icon: Plus, label: 'Storefront' },
  { id: 'guidebooks', icon: BookOpen, label: 'Guidebooks' },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 80 }}
        className="hidden md:flex bg-white border-r border-[#141414]/10 flex-col z-50 shrink-0"
      >
        <div className="p-6 flex items-center justify-between border-bottom">
          {isOpen && <span className="font-bold text-xl tracking-tighter">FloorStay.</span>}
          <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              icon={<item.icon size={20} />}
              label={item.label}
              active={activeTab === item.id}
              collapsed={!isOpen}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-[#141414]/5 space-y-1">
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            collapsed={!isOpen}
            onClick={() => {}}
          />
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onMobileClose} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl tracking-tighter">FloorStay.</span>
                <button onClick={onMobileClose} className="p-2">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-2">
                {NAV_ITEMS.map(item => (
                  <NavItem
                    key={item.id}
                    icon={<item.icon size={20} />}
                    label={item.label}
                    active={activeTab === item.id}
                    onClick={() => { onTabChange(item.id); onMobileClose(); }}
                  />
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
        active ? 'bg-[#141414] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-[#141414]'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      {!collapsed && <span className="font-medium text-sm tracking-tight">{label}</span>}
    </button>
  );
}
