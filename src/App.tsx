import { useState, useEffect } from 'react';
import { Layout, Home, Calendar, BarChart3, Settings, Menu, X, Plus, ChevronRight, MessageSquare, TrendingDown, DollarSign, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, ComparisonData } from './types';
import { MOCK_PROPERTIES } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'bookings' | 'analytics' | 'storefront'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isStorefrontView, setIsStorefrontView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsStorefrontView(window.location.pathname.startsWith('/s/'));
    };
    
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isStorefrontView) {
    return (
      <>
        <div className="fixed top-4 left-4 z-[70] hidden md:block">
           <a href="/" className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#141414]/10 shadow-sm hover:bg-[#141414] hover:text-white transition-all">
             ← Back to Admin
           </a>
        </div>
        <PublicStorefrontView />
        <AIConcierge />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F0] text-[#141414] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="hidden md:flex bg-white border-r border-[#141414]/10 flex-col z-50 shrink-0"
      >
        <div className="p-6 flex items-center justify-between border-bottom">
          {isSidebarOpen && <span className="font-bold text-xl tracking-tighter">FloorStay.</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          <NavItem 
            icon={<Layout size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<Home size={20} />} 
            label="Properties" 
            active={activeTab === 'properties'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab('properties')}
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Bookings" 
            active={activeTab === 'bookings'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab('bookings')}
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab('analytics')}
          />
          <NavItem 
            icon={<Plus size={20} />} 
            label="Storefront" 
            active={activeTab === 'storefront'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab('storefront')}
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Guidebooks" 
            active={activeTab === 'bookings'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveTab('bookings')}
          />
        </nav>

        <div className="p-4 mt-auto border-t border-[#141414]/5 space-y-1">
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            collapsed={!isSidebarOpen}
          />
        </div>
      </motion.aside>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl tracking-tighter">FloorStay.</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-2">
                <NavItem icon={<Layout size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Home size={20} />} label="Properties" active={activeTab === 'properties'} onClick={() => { setActiveTab('properties'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Calendar size={20} />} label="Bookings" active={activeTab === 'bookings'} onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<BarChart3 size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Plus size={20} />} label="Storefront" active={activeTab === 'storefront'} onClick={() => { setActiveTab('storefront'); setIsMobileMenuOpen(false); }} />
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
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
            <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-white rounded-full text-xs md:text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus size={16} className="shrink-0" /> <span className="hidden sm:inline">Add Property</span><span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'properties' && <PropertyListView onSelect={setSelectedProperty} />}
          {activeTab === 'storefront' && <StorefrontSettingsView />}
          {(activeTab === 'bookings' || activeTab === 'analytics') && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <TrendingDown size={48} className="mb-4 opacity-20" />
              <p className="font-serif italic">Advanced {activeTab} logic in development.</p>
            </div>
          )}
        </div>

        {/* AI Concierge Overlay */}
        <AIConcierge />
      </main>

      {/* Property Detail Slide-over */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetailScreen 
            property={selectedProperty} 
            onClose={() => setSelectedProperty(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StorefrontSettingsView() {
  const [slug, setSlug] = useState('elite-collection');
  const [headline, setHeadline] = useState('Modern Living in the Heart of the City');
  const [kb, setKb] = useState('Our brand is minimalist luxury. We focus on business travelers who want home-like comfort with hotel-grade services. House rules: No parties, quiet hours after 10PM. Check-in is self-service.');

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white rounded-3xl border border-[#141414]/10 p-8 space-y-6">
        <h3 className="text-xl font-medium tracking-tight">Direct Booking Storefront</h3>
        <p className="text-sm text-gray-500 font-serif italic">Configure how your brand appears to guests when they book direct.</p>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Custom URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-mono">floorstay.com/s/</span>
              <input 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-white border border-[#141414]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20 font-mono" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Hero Headline</label>
            <input 
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-white border border-[#141414]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Tenant Knowledge Base (AI Memory)</label>
            <textarea 
              value={kb}
              onChange={(e) => {
                setKb(e.target.value);
                // In real app, we'd persist this to context or Firestore
                (window as any).merchantKB = e.target.value;
              }}
              rows={4}
              placeholder="e.g. Our brand voice is fun and energetic. We provide coffee for guests..."
              className="w-full bg-white border border-[#141414]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20 resize-none" 
            />
            <p className="text-[10px] text-gray-400 font-serif italic">The AI Agent learns from this text to represent your brand accurately.</p>
          </div>

          <div className="pt-6 flex gap-4">
            <button className="bg-[#141414] text-white px-6 py-2 rounded-full text-sm font-bold active:scale-95 transition-transform">Save Strategy</button>
            <a 
              href={`/s/${slug}`} 
              target="_blank" 
              className="flex items-center gap-2 border border-[#141414]/10 px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-50 active:scale-95 transition-transform"
            >
              Preview Live <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#141414] text-white rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-400" />
          <h4 className="font-bold text-xs tracking-widest uppercase">SEO Impact</h4>
        </div>
        <p className="text-gray-400 text-sm italic font-serif">
          Your current storefront slug <span className="text-white font-mono">/s/{slug}</span> is indexing for 12 local keywords. 
          The price comparison engine is currently visibility on Google Search.
        </p>
      </div>
    </div>
  );
}

function PublicStorefrontView() {
  const slug = window.location.pathname.split('/s/')[1];
  const [selectedBookingProperty, setSelectedBookingProperty] = useState<Property | null>(null);

  // Dynamic SEO Logic
  useEffect(() => {
    const property = MOCK_PROPERTIES.find(p => 
      p.name.toLowerCase().replace(/ /g, '-') === slug
    );

    if (property) {
      document.title = `${property.name} | Official Storefront | ${property.location.city}`;
      
      // Meta description update
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      
      const amenitiesText = property.amenities.slice(0, 3).join(', ');
      metaDesc.setAttribute('content', `Book ${property.name} in ${property.location.city} directly and save 15% on OTA fees. Features ${amenitiesText}, and more. Official site best price guaranteed.`);

      // OG Tags
      const updateTag = (selector: string, attr: string, value: string) => {
        let tag = document.querySelector(selector);
        if (!tag) {
          tag = document.createElement('meta');
          const parts = selector.split('[');
          const prop = parts[1].split('=')[1].replace(/["'\]]/g, '');
          tag.setAttribute(attr, prop);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', value);
      };

      updateTag('meta[property="og:title"]', 'property', `${property.name} - Direct Booking`);
      updateTag('meta[property="og:description"]', 'property', `Stay at ${property.name} in ${property.location.city}. Official direct booking storefront with no platform fees.`);
      updateTag('meta[property="og:image"]', 'property', property.images[0]);

      // Schema.org Structured Data (JSON-LD)
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": property.name,
        "description": `Luxury stay at ${property.name} in ${property.location.city}.`,
        "url": window.location.href,
        "image": property.images,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.location.city,
          "addressCountry": property.location.country
        },
        "priceRange": `$$$`,
        "offers": {
          "@type": "Offer",
          "price": property.basePrice,
          "priceCurrency": "USD",
          "description": "Direct Booking Best Price Guarantee",
          "url": window.location.href
        }
      };

      let scriptTag = document.getElementById('json-ld-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);

    } else {
      // Default Storefront SEO
      document.title = "The Elite Collection | Direct Booking Storefront";
      // Cleanup schema if not on a specific property page
      const scriptTag = document.getElementById('json-ld-schema');
      if (scriptTag) scriptTag.remove();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#141414] selection:text-white pb-32">
      {/* Immersive Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover scale-105" 
          alt="Luxury Stay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase opacity-80">Official Storefront</span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">The Elite Collection.</h1>
            <p className="text-lg md:text-2xl font-serif italic opacity-90 max-w-2xl mx-auto">Modern Living in the Heart of the City, Curated for the Discerning Traveler.</p>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-3">
                <TrendingDown size={18} className="text-green-400" />
                <span className="text-sm font-medium">Always Winning: Direct Prices Are 15% Lower</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & SEO Bar */}
      <div className="bg-white border-y border-[#141414]/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee items-center gap-12 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <span>Airbnb Verified Properties</span>
          <span>•</span>
          <span>$50K Protection Shield</span>
          <span>•</span>
          <span>Digital Guidebooks Included</span>
          <span>•</span>
          <span>Best Price Guarantee</span>
          <span>•</span>
          <span>Direct-to-Owner Connection</span>
          <span>•</span>
          <span>Secure AES-256 Encryption</span>
          <span>•</span>
          <span>No Platform Service Fees</span>
          <span>•</span>
          <span>24/7 Digital Concierge</span>
        </div>
      </div>

      {/* Immersive Gallery Section */}
      <section className="px-4 md:px-8 py-10 md:py-20 max-w-7xl mx-auto">
        <div className="mb-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600">The Visuals</span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter">Curated Spaces.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 h-[500px] md:h-[700px]">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-[32px] md:rounded-[48px] relative group">
            <img src={MOCK_PROPERTIES[0].images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Gallery 1" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="col-span-1 row-span-1 overflow-hidden rounded-[32px] md:rounded-[48px] relative group">
            <img src={MOCK_PROPERTIES[1].images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Gallery 2" referrerPolicy="no-referrer" />
          </div>
          <div className="col-span-1 row-span-2 overflow-hidden rounded-[32px] md:rounded-[48px] relative group">
            <img src={MOCK_PROPERTIES[2].images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Gallery 3" referrerPolicy="no-referrer" />
          </div>
          <div className="col-span-1 row-span-1 overflow-hidden rounded-[32px] md:rounded-[48px] relative group">
            <img src={MOCK_PROPERTIES[0].images[1]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Gallery 4" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      <main className="px-4 md:px-8 py-16 md:py-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter">Our Properties</h2>
            <p className="text-gray-500 font-serif italic text-lg">Select a residence to compare market rates and book direct.</p>
          </div>
          <div className="flex gap-2 font-mono text-[10px] text-gray-400 uppercase tracking-widest bg-white p-3 rounded-2xl border border-[#141414]/5 shadow-sm">
            <span>Filtering:</span>
            <span className="text-[#141414] font-bold">ALL AVAIALABLE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_PROPERTIES.map(p => (
            <div key={p.id}>
              <PropertyCard property={p} onReserve={() => setSelectedBookingProperty(p)} />
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t border-[#141414]/5 text-center px-4 space-y-10">
        <div className="max-w-md mx-auto space-y-4">
          <p className="font-bold tracking-tighter text-3xl">FloorStay.</p>
          <p className="text-gray-400 text-sm leading-relaxed font-serif italic">Empowering property owners to reclaim their brand from the platform economy. Book direct, save fees, live better.</p>
          <p className="text-gray-400 text-[10px] font-medium tracking-widest uppercase py-4">Powered by thirlz network 2026</p>
        </div>
        <div className="flex justify-center gap-8 text-[10px] font-bold tracking-widest uppercase text-gray-300">
          <a href="#" className="hover:text-[#141414] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#141414] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#141414] transition-colors">Support</a>
        </div>
      </footer>

      {/* Booking Checkout Modal */}
      <AnimatePresence>
        {selectedBookingProperty && (
          <CheckoutModal property={selectedBookingProperty} onClose={() => setSelectedBookingProperty(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyCard({ property, onReserve }: { property: Property, onReserve: () => void }) {
  const [comparison, setComparison] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Simulate real-time scraping/syncing delay
    const timer = setTimeout(() => {
      fetch('/api/ota-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id })
      })
      .then(res => res.json())
      .then(data => {
        setComparison(data);
        setIsSyncing(false);
      });
    }, 1500 + Math.random() * 1000); // Random delay for "realism"

    return () => clearTimeout(timer);
  }, [property.id]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] border border-[#141414]/5 overflow-hidden flex flex-col h-full group hover:shadow-2xl hover:shadow-[#141414]/5 transition-all duration-500"
    >
      {/* Media Layer */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={property.images[0]} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <button 
            onClick={(e) => { e.stopPropagation(); onReserve(); }}
            className="w-full bg-white text-[#141414] py-4 rounded-2xl font-bold tracking-tight shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Instant Direct Reserve <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          {isSyncing ? (
            <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              Syncing Prices...
            </span>
          ) : (
            <>
              <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg backdrop-blur-md">
                -15% BEST PRICE FOUND
              </span>
              <span className="bg-white/90 text-[#141414] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm border border-gray-100 italic">
                Verified Direct Site
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content Layer */}
      <div className="p-8 flex-1 flex flex-col space-y-8">
        <div>
          <h3 className="text-2xl font-medium tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{property.name}</h3>
          <p className="text-gray-400 text-sm font-serif italic">{property.location.city}, {property.location.country}</p>
        </div>

        {/* Global Price Grid (SEO Friendly) */}
        <div className="bg-[#141414] rounded-3xl p-6 space-y-4 relative overflow-hidden text-white shadow-xl shadow-[#141414]/10">
          {isSyncing && (
            <div className="absolute inset-0 bg-[#141414]/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-1 border-t-2 border-blue-500 animate-spin rounded-full" />
              <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em]">Auditing OTA Prices...</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 border-b border-white/10 pb-3">
            <span>Marketplace Rate</span>
            <span>Est. Total</span>
          </div>
          
          {/* Direct Option */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between bg-blue-600/10 border border-blue-500/30 p-3 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              <span className="text-sm font-bold tracking-tight">Direct (Official Rate)</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white tracking-tighter">${property.basePrice}</span>
              <p className="text-[7px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Primary Winner</p>
            </div>
          </motion.div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between opacity-40">
              <div className="flex flex-col">
                <span className="text-[12px] font-medium tracking-tight">Airbnb (Incl. Fees)</span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-red-400">+$45 Platform Tax</span>
              </div>
              <span className="text-[12px] font-medium line-through decoration-white/30">
                ${isSyncing ? "..." : (comparison?.airbnb || property.basePrice + 45)}
              </span>
            </div>
            <div className="flex items-center justify-between opacity-40">
              <div className="flex flex-col">
                <span className="text-[12px] font-medium tracking-tight">VRBO (Incl. Fees)</span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-red-400">+$38 Platform Tax</span>
              </div>
              <span className="text-[12px] font-medium line-through decoration-white/30">
                ${isSyncing ? "..." : (comparison?.vrbo || property.basePrice + 38)}
              </span>
            </div>
          </div>

          {!isSyncing && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-green-400 font-bold tracking-widest uppercase">
                  Net Saving: ${comparison?.savings}
                </p>
                <button 
                  onClick={onReserve}
                  className="bg-white text-[#141414] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-tighter active:scale-95 transition-transform"
                >
                  Claim Discount
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#141414]/5">
          <div className="flex -space-x-2">
            {property.amenities.slice(0, 3).map((a, i) => (
              <div key={i} title={a} className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase tracking-tighter cursor-help">
                {a[0]}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
              +{property.amenities.length - 3}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`/s/${property.name.toLowerCase().replace(/ /g, '-')}`}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', `/s/${property.name.toLowerCase().replace(/ /g, '-')}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-[11px] font-black tracking-tighter text-[#141414] underline underline-offset-4 decoration-2 decoration-blue-500 hover:text-blue-600 transition-colors"
            >
              Book Direct
            </a>
            <button className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1 hover:text-[#141414] transition-all">
              Details <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutModal({ property, onClose }: { property: Property, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [payNow, setPayNow] = useState(true);

  const baseTotal = property.basePrice * 2;
  const directSavings = 52; // Market Platform Fees
  const payNowDiscount = payNow ? Math.round(baseTotal * 0.05) : 0;
  const finalTotal = baseTotal - directSavings - payNowDiscount;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]"
      >
        <div className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <span className="bg-blue-600 text-white text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Official Channel</span>
              </div>
              <h3 className="text-3xl font-medium tracking-tighter">Direct Reserve.</h3>
              <p className="text-sm text-gray-400 font-serif italic">Secure your stay at {property.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Check-In</label>
                  <input type="date" defaultValue="2026-05-12" className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Check-Out</label>
                  <input type="date" defaultValue="2026-05-14" className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium" />
                </div>
              </div>

              {/* Pay Now vs Pay Later */}
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                <button 
                  onClick={() => setPayNow(true)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${payNow ? 'bg-white shadow-sm text-[#141414]' : 'text-gray-400'}`}
                >
                  Pay Now (-5% Extra)
                </button>
                <button 
                  onClick={() => setPayNow(false)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!payNow ? 'bg-white shadow-sm text-[#141414]' : 'text-gray-400'}`}
                >
                  Pay at Arrival
                </button>
              </div>

              <div className="bg-[#141414] text-white p-8 rounded-[32px] space-y-4 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center opacity-60">
                    <span className="text-sm font-serif italic">2 Night Base Stay</span>
                    <span className="font-mono">${baseTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-400 font-bold text-xs uppercase tracking-widest">
                    <span>Direct Advantage (No OTA Tax)</span>
                    <span>-${directSavings}</span>
                  </div>
                  {payNow && (
                    <div className="flex justify-between items-center text-blue-400 font-bold text-xs uppercase tracking-widest">
                      <span>Early Payment Discount</span>
                      <span>-${payNowDiscount}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center font-black">
                    <span className="text-sm tracking-tighter">TOTAL PRICE</span>
                    <span className="text-3xl tracking-tighter">${finalTotal}</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold tracking-tight shadow-xl hover:opacity-90 active:scale-95 transition-all text-xl"
              >
                Complete Reservation
              </button>
              
              <div className="flex items-center justify-center gap-4 text-[9px] font-bold tracking-widest uppercase text-gray-300">
                <span className="flex items-center gap-1"><Settings size={12} /> SSL Secured</span>
                <span className="flex items-center gap-1"><Home size={12} /> Best Rate Guarantee</span>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-10 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="relative">
                  <BarChart3 size={48} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-bold tracking-tighter">Success! Direct Stay Booked.</h4>
                <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
                  You just saved <span className="text-[#141414] font-bold">${directSavings + payNowDiscount}</span> by avoiding marketplace service fees. 
                  A confirmation has been sent to your email.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-[#141414] text-white py-4 rounded-2xl font-bold tracking-tight hover:opacity-90 transition-all"
              >
                Return to Storefront
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


function SyncRow({ name, status, time }: { name: string, status: string, time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#141414]/5 last:border-none">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'Synced' ? 'bg-green-500' : 'bg-orange-400'}`} />
        <span className="text-xs font-medium tracking-tight text-gray-700">{name}</span>
      </div>
      <span className="text-[10px] text-gray-400 font-mono italic">{time}</span>
    </div>
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

function DashboardView() {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 font-sans">
        <StatCard label="Revenue" value="$24,850" change="+12%" icon={<DollarSign size={18} />} />
        <StatCard label="Direct %" value="68%" change="+5%" icon={<TrendingDown size={18} />} trend="up" />
        <StatCard label="Sync Health" value="Healthy" change="14 Nodes" icon={<Settings size={18} />} color="text-green-600" />
        <StatCard label="Guidebook Views" value="1.2k" change="+18%" icon={<BookOpen size={18} />} color="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Engine Teaser */}
        <div className="lg:col-span-2 bg-[#141414] rounded-2xl md:rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="max-w-md space-y-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Direct Engine Active.</h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Your storefront is currently undercutting Airbnb by an average of <span className="text-white font-bold">14%</span>. 
              The SEO Engine is leeching traffic from 12 OTA listing IDs.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-[#141414] px-5 py-2 rounded-full text-[10px] md:text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform">
                View Analytics <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 opacity-20 blur-3xl bg-blue-500 w-48 h-48 rounded-full" />
        </div>

        {/* Sync Center */}
        <div className="bg-white rounded-3xl border border-[#141414]/5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[10px] tracking-widest uppercase text-gray-400">Channel Sync</h4>
            <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-4">
             <SyncRow name="Airbnb" status="Synced" time="2m ago" />
             <SyncRow name="VRBO" status="Synced" time="5m ago" />
             <SyncRow name="Booking.com" status="Connecting" time="--" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-[#141414]/5 overflow-hidden">
        <div className="p-6 border-b border-[#141414]/5 flex justify-between items-center">
          <h3 className="font-medium font-serif italic text-lg text-[#141414]">Recent Bookings</h3>
          <button className="text-sm text-gray-500 underline underline-offset-4">View All</button>
        </div>
        <div className="divide-y divide-[#141414]/5 font-mono text-xs">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Home size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tighter">BK-8902{i}</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">DIRECT</span>
                  </div>
                  <p className="text-gray-400">Metropolitan Loft · 3 nights</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">$735.00</p>
                <p className="text-gray-400">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, trend, color = 'text-[#141414]' }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#141414]/5 shadow-sm">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="p-1.5 md:p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
        {change && (
          <span className={`text-[10px] md:text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-[10px] md:text-sm text-gray-400 font-medium mb-0.5 tracking-tight uppercase md:normal-case">{label}</p>
      <p className={`text-xl md:text-3xl font-medium tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function PropertyListView({ onSelect }: { onSelect: (p: Property) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PROPERTIES.map((property) => (
        <motion.div 
          key={property.id}
          whileHover={{ y: -4 }}
          onClick={() => onSelect(property)}
          className="bg-white rounded-3xl border border-[#141414]/5 overflow-hidden cursor-pointer"
        >
          <div className="aspect-video relative overflow-hidden">
            <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase">
              {property.status}
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-medium text-lg tracking-tight">{property.name}</h3>
              <p className="text-xs text-gray-500 font-serif italic text-gray-500">{property.location.city}, {property.location.country}</p>
            </div>
            <div className="flex items-center justify-between text-[#141414]">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[#141414]">${property.basePrice}</span>
                <span className="text-[10px] text-gray-400 tracking-tighter font-mono">/NIGHT</span>
              </div>
              <div className="flex gap-2">
                {property.otaLinks.airbnb && <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[8px] font-bold text-red-600 border border-red-100">A</span>}
                {property.otaLinks.vrbo && <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[8px] font-bold text-blue-600 border border-blue-100">V</span>}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PropertyDetailScreen({ property, onClose }: { property: Property, onClose: () => void }) {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);

  useEffect(() => {
    // Simulate Fetching Comparison Data
    const base = property.basePrice;
    setComparison({
      direct: base,
      airbnb: Math.round(base * 1.15),
      vrbo: Math.round(base * 1.12),
      savings: Math.round(base * 0.15 * 3) // Example for 3 nights
    });
  }, [property]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-end"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl bg-[#F5F5F0] h-full shadow-2xl flex flex-col relative z-20 overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white rounded-full border border-[#141414]/10 hover:bg-gray-50 flex items-center justify-center z-30"
        >
          <X size={20} />
        </button>

        <div className="h-80 w-full overflow-hidden shrink-0">
          <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter mb-1 md:mb-2 leading-none">{property.name}</h2>
            <p className="text-gray-500 font-serif italic text-base md:text-lg leading-relaxed">{property.description}</p>
          </div>

          {/* SEO Comparison Engine UI */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-[#141414]/10 p-5 md:p-8 space-y-4 md:space-y-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <TrendingDown className="text-green-600" size={18} md:size={20} />
              <h4 className="font-bold text-[8px] md:text-xs tracking-widest uppercase text-gray-400">Live Price Comparison</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <PriceLine label="Direct" amount={`$${comparison?.direct}`} active />
              <PriceLine label="Airbnb" amount={`$${comparison?.airbnb}`} isOTA />
              <PriceLine label="VRBO" amount={`$${comparison?.vrbo}`} isOTA />
            </div>

            <div className="pt-4 md:pt-6 border-t border-[#141414]/5">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-green-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-green-100 gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-green-800 font-medium text-sm font-serif italic block leading-none">Direct Booking Advantage</span>
                  <p className="text-green-600 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Savings per 3-night stay</p>
                </div>
                <span className="text-green-800 font-bold text-2xl md:text-3xl tracking-tighter leading-none">+${comparison?.savings}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs tracking-widest uppercase text-gray-500">Inventory Logic</h4>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-white p-6 rounded-2xl border border-[#141414]/5 space-y-2 shadow-sm">
                <p className="text-gray-400 uppercase tracking-widest text-[8px]">iCal Sync Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold">ACTIVE</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#141414]/5 space-y-2 shadow-sm">
                <p className="text-gray-400 uppercase tracking-widest text-[8px]">Last Feed Sync</p>
                <p className="font-bold tracking-tighter">6 MINUTES AGO</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PriceLine({ label, amount, active, isOTA }: any) {
  return (
    <div className={`space-y-1 md:space-y-2 ${active ? 'scale-110 origin-left transition-transform' : 'opacity-60'}`}>
      <span className="block text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <span className={`text-xl md:text-3xl font-medium tracking-tighter leading-none ${active ? 'text-[#141414]' : isOTA ? 'line-through decoration-red-400/50 scale-90 origin-left inline-block' : ''}`}>
        {amount}
      </span>
    </div>
  );
}

function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isPublic = window.location.pathname.startsWith('/s/');
  
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: isPublic 
        ? 'Hi there! I am the property concierge. How can I help you with your stay today?' 
        : 'Greeting merchant. I am your FloorStay concierge. I handle guest FAQs and upsells automatically. Ask me anything about your current inventory or comparison strategy.' 
    }
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const { getConciergeResponse } = await import('./services/geminiService');
      const merchantKB = (window as any).merchantKB || "Minimalist luxury, focused on business travelers.";
      const isPublic = window.location.pathname.startsWith('/s/');
      const context = isPublic 
        ? `Property/Brand Rules: ${merchantKB}`
        : `Merchant Strategy Memory: ${merchantKB}. Inventory: Metropolitan Loft, Serene Garden Cottage. Direct savings average is 14%.`;
      
      const response = await getConciergeResponse(userMsg, context, isPublic ? 'guest' : 'owner');
      setMessages(prev => [...prev, { role: 'ai', content: response || 'I couldn\'t process that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to concierge service.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-80 bg-[#141414] text-white rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[400px] md:h-[480px]"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Concierge AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`p-4 rounded-2xl text-[13px] leading-relaxed ${m.role === 'ai' ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-white text-black ml-8 font-medium'}`}>
                  {m.content}
                </div>
              ))}
              {isLoading && (
                <div className="p-4 rounded-2xl text-[13px] bg-white/5 border border-white/10 text-gray-500 animate-pulse">
                  Concierge is thinking...
                </div>
              )}
            </div>
            <div className="p-5 bg-white/5">
              <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your assistant..." 
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#141414] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-white/20 group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
