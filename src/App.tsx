import { useState, useEffect } from 'react';
import { Plus, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PropertyList from './components/PropertyList';
import Bookings from './components/Bookings';
import Analytics from './components/Analytics';
import StorefrontSettings from './components/StorefrontSettings';
import PublicStorefront from './components/PublicStorefront';
import AIConcierge from './components/AIConcierge';
import AddPropertyModal from './components/AddPropertyModal';
import { AuthProvider } from './hooks/useAuth';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStorefront, setIsStorefront] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsStorefront(window.location.pathname.startsWith('/s/'));
    check();
    window.addEventListener('popstate', check);
    return () => window.removeEventListener('popstate', check);
  }, []);

  if (isStorefront) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-4 left-4 z-[70] hidden md:block">
          <a href="/" className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            ← Back to Admin
          </a>
        </div>
        <PublicStorefront />
        <AIConcierge />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar
        active={activeTab}
        onNavigate={setActiveTab}
        userRole="admin"
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 md:px-8 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-slate-700 capitalize">{activeTab === 'dashboard' ? 'Overview' : activeTab}</h1>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Property</span>
          </button>
        </header>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl flex flex-col p-5">
              <p className="font-bold text-lg mb-6 text-slate-900">FloorStay</p>
              {['dashboard','properties','bookings','analytics','storefront','guidebooks'].map(t => (
                <button
                  key={t}
                  onClick={() => { setActiveTab(t); setMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold capitalize mb-1 ${
                    activeTab === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t === 'dashboard' ? 'Overview' : t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'properties' && <PropertyList />}
            {activeTab === 'bookings' && <Bookings />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'storefront' && <StorefrontSettings />}
            {activeTab === 'guidebooks' && (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
                Guidebooks — coming soon.
              </div>
            )}
          </div>
        </div>
      </main>

      <AddPropertyModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => setActiveTab('properties')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
