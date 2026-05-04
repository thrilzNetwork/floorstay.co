import { useState, useEffect } from 'react';
import { Menu, Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PropertyList from './components/PropertyList';
import StorefrontSettings from './components/StorefrontSettings';
import Bookings from './components/Bookings';
import PublicStorefront from './components/PublicStorefront';
import AIConcierge from './components/AIConcierge';
import AddPropertyModal from './components/AddPropertyModal';
import { AuthProvider } from './hooks/useAuth';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStorefrontView, setIsStorefrontView] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  useEffect(() => {
    const checkPath = () => {
      setIsStorefrontView(window.location.pathname.startsWith('/s/'));
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  if (isStorefrontView) {
    return (
      <>
        <div className="fixed top-4 left-4 z-[70] hidden md:block">
          <a href="/" className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#141414]/10 shadow-sm hover:bg-[#141414] hover:text-white transition-all">
            ← Back to Admin
          </a>
        </div>
        <PublicStorefront />
        <AIConcierge />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-[#F5F5F0] text-[#141414] font-sans overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto relative">
          <header className="sticky top-0 bg-[#F5F5F0]/80 backdrop-blur-md z-30 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-[#141414]/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 bg-white border border-[#141414]/10 rounded-lg"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-medium tracking-tight capitalize leading-tight">{activeTab}</h1>
                <p className="hidden md:block text-sm text-gray-500 italic font-serif">Welcome back, Merchant.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsAddPropertyOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-white rounded-full text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus size={16} className="shrink-0" />
                <span className="hidden sm:inline">Add Property</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </header>

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'properties' && <PropertyList />}
            {activeTab === 'bookings' && <Bookings />}
            {activeTab === 'storefront' && <StorefrontSettings />}
            {(activeTab === 'analytics' || activeTab === 'guidebooks') && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="font-serif italic">Advanced {activeTab} logic in development.</p>
              </div>
            )}
          </div>

          <AIConcierge />
        </main>
      </div>

      <AddPropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onSuccess={() => setActiveTab('properties')}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
