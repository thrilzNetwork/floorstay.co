import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingDown, ChevronRight, Home, X, BarChart3, Settings } from 'lucide-react';
import type { Property } from '../types';
import { getStorefrontBySlug, getOtaComparison } from '../services/propertyService';
import CheckoutModal from './CheckoutModal';

export default function PublicStorefront() {
  const slug = window.location.pathname.split('/s/')[1] || 'quantum-hospitality';
  const [storefront, setStorefront] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingProperty, setSelectedBookingProperty] = useState<Property | null>(null);

  useEffect(() => {
    loadStorefront();
    updateSEO();
  }, [slug]);

  async function loadStorefront() {
    try {
      const data = await getStorefrontBySlug(slug);
      if (data) {
        setStorefront(data.owner);
        setProperties(data.properties);
      }
    } catch (err) {
      console.error('Storefront load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function updateSEO() {
    document.title = `${storefront?.business_name || 'FloorStay'} | Direct Booking Storefront | Fort Lauderdale`;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Book directly with ${storefront?.business_name || 'us'} in Fort Lauderdale and save 15% on OTA fees. Best price guaranteed on all properties.`);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading storefront...</div>;
  }

  const owner = storefront || {
    business_name: 'FloorStay Network',
    headline: 'Premium Fort Lauderdale Stays',
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans pb-32">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          alt="Luxury Stay"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase opacity-80">Official Direct Booking</span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">{owner.business_name}.</h1>
            <p className="text-lg md:text-2xl font-serif italic opacity-90 max-w-2xl mx-auto">{owner.headline}</p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-3">
                <TrendingDown size={18} className="text-green-400" />
                <span className="text-sm font-medium">Always Winning: Direct Prices Are 15% Lower</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-y border-[#141414]/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee items-center gap-12 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <span>Fort Lauderdale Verified Properties</span>
          <span>•</span>
          <span>$50K Protection Shield</span>
          <span>•</span>
          <span>Crew Housing Specialists</span>
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

      {/* Properties */}
      <main className="px-4 md:px-8 py-16 md:py-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter">Our Properties</h2>
            <p className="text-gray-500 font-serif italic text-lg">Select a residence to compare market rates and book direct.</p>
          </div>
          <div className="flex gap-2 font-mono text-[10px] text-gray-400 uppercase tracking-widest bg-white p-3 rounded-2xl border border-[#141414]/5 shadow-sm">
            <span>Filtering:</span>
            <span className="text-[#141414] font-bold">ALL AVAILABLE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map(p => (
            <div key={p.id}>
              <PropertyCard property={p} onReserve={() => setSelectedBookingProperty(p)} />
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t border-[#141414]/5 text-center px-4 space-y-10">
        <div className="max-w-md mx-auto space-y-4">
          <p className="font-bold tracking-tighter text-3xl">FloorStay.</p>
          <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
            Empowering Fort Lauderdale property owners to reclaim their brand from the platform economy.
            Book direct, save fees, live better.
          </p>
          <p className="text-gray-400 text-[10px] font-medium tracking-widest uppercase py-4">Powered by Thrilz Network 2026</p>
        </div>
        <div className="flex justify-center gap-8 text-[10px] font-bold tracking-widest uppercase text-gray-300">
          <a href="#" className="hover:text-[#141414] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#141414] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#141414] transition-colors">Support</a>
        </div>
      </footer>

      {selectedBookingProperty && (
        <CheckoutModal property={selectedBookingProperty} onClose={() => setSelectedBookingProperty(null)} />
      )}
    </div>
  );
}

function PropertyCard({ property, onReserve }: { property: Property; onReserve: () => void }) {
  const [comparison, setComparison] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      getOtaComparison(property.id, 1)
        .then(data => {
          setComparison(data);
          setIsSyncing(false);
        })
        .catch(() => setIsSyncing(false));
    }, 1500 + Math.random() * 1000);
    return () => clearTimeout(timer);
  }, [property.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] border border-[#141414]/5 overflow-hidden flex flex-col h-full group hover:shadow-2xl hover:shadow-[#141414]/5 transition-all duration-500"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={property.images[0]}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          alt={property.name}
        />
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

      <div className="p-8 flex-1 flex flex-col space-y-8">
        <div>
          <h3 className="text-2xl font-medium tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{property.name}</h3>
          <p className="text-gray-400 text-sm font-serif italic">{property.location.city}, {property.location.state}</p>
        </div>

        {/* Price Grid */}
        <div className="bg-[#141414] rounded-3xl p-6 space-y-4 relative overflow-hidden text-white shadow-xl shadow-[#141414]/10">
          {isSyncing && (
            <div className="absolute inset-0 bg-[#141414]/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-t-2 border-blue-500 animate-spin rounded-full" />
              <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em]">Auditing OTA Prices...</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 border-b border-white/10 pb-3">
            <span>Marketplace Rate</span>
            <span>Est. Total</span>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between bg-blue-600/10 border border-blue-500/30 p-3 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              <span className="text-sm font-bold tracking-tight">Direct (Official Rate)</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white tracking-tighter">${property.base_price}</span>
              <p className="text-[7px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Primary Winner</p>
            </div>
          </motion.div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between opacity-40">
              <div className="flex flex-col">
                <span className="text-[12px] font-medium tracking-tight">Airbnb (Incl. Fees)</span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-red-400">+${Math.round(property.base_price * 0.20)} Platform Tax</span>
              </div>
              <span className="text-[12px] font-medium line-through decoration-white/30">${isSyncing ? '...' : (comparison?.airbnb || Math.round(property.base_price * 1.20))}</span>
            </div>
            <div className="flex items-center justify-between opacity-40">
              <div className="flex flex-col">
                <span className="text-[12px] font-medium tracking-tight">VRBO (Incl. Fees)</span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-red-400">+${Math.round(property.base_price * 0.15)} Platform Tax</span>
              </div>
              <span className="text-[12px] font-medium line-through decoration-white/30">${isSyncing ? '...' : (comparison?.vrbo || Math.round(property.base_price * 1.15))}</span>
            </div>
          </div>

          {!isSyncing && comparison && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-green-400 font-bold tracking-widest uppercase">
                  Net Saving: ${comparison.savings}
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
              <div key={i} title={a} className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                {a[0]}
              </div>
            ))}
            {property.amenities.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                +{property.amenities.length - 3}
              </div>
            )}
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
