import { useState, useEffect, useMemo } from 'react';
import type React from 'react';
import { Search, MapPin, Bed, Bath, Users, ChevronDown, Heart, Phone, MessageSquare, Check, ArrowRight, Star, Shield, ChevronLeft, ChevronRight, Home, Calendar, Filter, X, Menu, ChevronUp } from 'lucide-react';
import type { Property } from '../types';
import { getStorefrontBySlug, getOtaComparison } from '../services/propertyService';
import CheckoutModal from './CheckoutModal';

export default function PublicStorefront() {
  const slug = window.location.pathname.split('/s/')[1] || 'quantum-hospitality';
  const [storefront, setStorefront] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingProperty, setSelectedBookingProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [bedFilter, setBedFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularidad' | 'precio-asc' | 'precio-desc'>('popularidad');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparisons, setComparisons] = useState<Record<string, any>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        data.properties.forEach((p: Property) => {
          getOtaComparison(p.id, 1).then(comp => {
            setComparisons(prev => ({ ...prev, [p.id]: comp }));
          });
        });
      }
    } catch (err) {
      console.error('Storefront load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function updateSEO() {
    document.title = `${storefront?.business_name || 'FloorStay'} | Crew Housing FTL & Miami`;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Crew housing in Fort Lauderdale & Miami. ${properties.length}+ verified apartments near marinas & ports. Weekly & monthly stays.`);
  }

  const filteredProperties = useMemo(() => {
    let result = [...properties];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q) ||
        p.amenities.some(a => a.toLowerCase().includes(q))
      );
    }
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => p.base_price >= min && (!max || p.base_price <= max));
    }
    if (bedFilter !== 'all') {
      const beds = parseInt(bedFilter);
      result = result.filter(p => p.bedrooms >= beds);
    }
    if (cityFilter !== 'all') {
      result = result.filter(p => p.location.city === cityFilter);
    }
    if (sortBy === 'precio-asc') {
      result.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'precio-desc') {
      result.sort((a, b) => b.base_price - a.base_price);
    }
    return result;
  }, [properties, searchQuery, priceRange, bedFilter, cityFilter, sortBy]);

  const cities = useMemo(() => {
    const set = new Set(properties.map(p => p.location.city));
    return Array.from(set);
  }, [properties]);

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const owner = storefront || { business_name: 'FloorStay', headline: 'Crew Housing & Short-Term Rentals' };

  const activeFilters = [
    cityFilter !== 'all' ? cityFilter : null,
    priceRange !== 'all' ? priceRangeLabel(priceRange) : null,
    bedFilter !== 'all' ? `${bedFilter}+ beds` : null,
  ].filter(Boolean);

  function priceRangeLabel(v: string) {
    const map: Record<string, string> = {
      '0-150': 'Under $150',
      '150-250': '$150 – $250',
      '250-400': '$250 – $400',
      '400-9999': '$400+',
    };
    return map[v] || v;
  }

  function clearFilters() {
    setSearchQuery('');
    setPriceRange('all');
    setBedFilter('all');
    setCityFilter('all');
    setShowMobileFilters(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-slate-400 gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-teal-700 animate-spin rounded-full" />
        <p className="text-sm font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <a href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white">
                <Home size={18} />
              </div>
              <div className="leading-tight hidden sm:block">
                <span className="font-bold text-sm tracking-tight text-slate-900 block">{owner.business_name}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Crew Housing</span>
              </div>
              <span className="font-bold text-sm text-slate-900 sm:hidden">{owner.business_name}</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-teal-700 transition-colors">About</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Homes</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Locations</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Book</a>
            </nav>

            <div className="flex items-center gap-2">
              <a href="tel:+19545550100" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden">
                <Phone size={18} />
              </a>
              <a href="https://wa.me/19545550100" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden">
                <MessageSquare size={18} />
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <button className="hidden lg:block bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-800 transition-colors">
                Ingresar
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-sm">
            <a href="#" className="block py-2 text-sm font-medium text-slate-600">About Us</a>
            <a href="#" className="block py-2 text-sm font-medium text-slate-600">Full House Rentals</a>
            <a href="#" className="block py-2 text-sm font-medium text-slate-600">Our Homes</a>
            <a href="#" className="block py-2 text-sm font-medium text-slate-600">Locations</a>
            <a href="#" className="block py-2 text-sm font-medium text-slate-600">Book Now</a>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=600&fit=crop"
            alt="Crew housing"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              {owner.headline}
            </h1>
            <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
              Crew housing for yacht crew, maritime students, and professionals in Fort Lauderdale & Miami. Flexible stays, no long-term leases.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a href="https://wa.me/19545550100" className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">
                <MessageSquare size={16} /> Message Us on WhatsApp
              </a>
              <button
                onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <Calendar size={16} /> Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR (Mobile: compact row + expand) ===== */}
      <section className="bg-white border-b border-slate-200 sticky top-14 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile compact bar */}
          <div className="lg:hidden py-2.5 flex items-center gap-2">
            <div className="flex-1 relative min-w-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-slate-50"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors shrink-0 ${
                activeFilters.length > 0
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="ml-0.5 w-5 h-5 bg-white text-teal-700 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile expanded filters */}
          {showMobileFilters && (
            <div className="lg:hidden pb-3 space-y-2">
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
              >
                <option value="all">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
              >
                <option value="all">All Prices</option>
                <option value="0-150">Under $150</option>
                <option value="150-250">$150 – $250</option>
                <option value="250-400">$250 – $400</option>
                <option value="400-9999">$400+</option>
              </select>
              <select
                value={bedFilter}
                onChange={e => setBedFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
              >
                <option value="all">All Beds</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-teal-700 text-white"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}

          {/* Desktop filter bar */}
          <div className="hidden lg:flex items-center gap-2 py-2.5">
            <div className="flex-1 relative min-w-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by city, neighborhood, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium outline-none cursor-pointer min-w-[140px]"
            >
              <option value="all">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium outline-none cursor-pointer min-w-[120px]"
            >
              <option value="all">All Prices</option>
              <option value="0-150">Under $150</option>
              <option value="150-250">$150 – $250</option>
              <option value="250-400">$250 – $400</option>
              <option value="400-9999">$400+</option>
            </select>
            <select
              value={bedFilter}
              onChange={e => setBedFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium outline-none cursor-pointer min-w-[110px]"
            >
              <option value="all">All Beds</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0">
              <Search size={16} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* ===== RESULTS HEADER ===== */}
      <div id="results" className="max-w-7xl mx-auto px-4 pt-5 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            <strong className="text-slate-900">{filteredProperties.length}</strong>
            <span> result{filteredProperties.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 pr-7 text-sm font-medium outline-none cursor-pointer"
            >
              <option value="popularidad">Popularidad</option>
              <option value="precio-asc">Price: Low → High</option>
              <option value="precio-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {activeFilters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                {f}
                <button onClick={clearFilters} className="hover:text-teal-600"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ===== RESULTS ===== */}
      <main className="max-w-7xl mx-auto px-4 py-3 pb-12">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-1 text-slate-900">No matches</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-teal-700 font-semibold text-sm hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-4">
            {filteredProperties.map(p => (
              <ApartmentCard
                key={p.id}
                property={p}
                comparison={comparisons[p.id]}
                isFavorite={favorites.has(p.id)}
                onToggleFavorite={() => toggleFavorite(p.id)}
                onReserve={() => setSelectedBookingProperty(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2.5">
              <Home size={18} className="text-teal-400" />
              <span className="font-bold text-lg">{owner.business_name}</span>
            </div>
            <p className="text-slate-400 text-sm">Crew housing in Fort Lauderdale & Miami for yacht crew and maritime professionals.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2.5 text-slate-300">Locations</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Fort Lauderdale</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Miami</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hollywood</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pompano Beach</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2.5 text-slate-300">Rooms</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Shared</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Private</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Studios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Full House</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2.5 text-slate-300">Contact</h4>
            <p className="text-sm text-slate-400 mb-0.5">(954) 555-0100</p>
            <p className="text-sm text-slate-400 mb-2.5">hello@floorstay.co</p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><MessageSquare size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Phone size={18} /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-5 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {owner.business_name}. All rights reserved.
        </div>
      </footer>

      {selectedBookingProperty && (
        <CheckoutModal property={selectedBookingProperty} onClose={() => setSelectedBookingProperty(null)} />
      )}
    </div>
  );
}

/* ====== CARD: Vertical on mobile, Horizontal on md+ ====== */
function ApartmentCard({
  property,
  comparison,
  isFavorite,
  onToggleFavorite,
  onReserve
}: {
  key?: React.Key;
  property: Property;
  comparison: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReserve: () => void;
}) {
  const savings = comparison?.savings || Math.round(property.base_price * 0.15);
  const [imgIndex, setImgIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextImg = (e: any) => {
    e.stopPropagation();
    setImgIndex(i => (i + 1) % property.images.length);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevImg = (e: any) => {
    e.stopPropagation();
    setImgIndex(i => (i - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 rounded-xl">
      {/* Mobile: vertical stack | Desktop: horizontal flex */}
      <div className="flex flex-col md:flex-row">
        {/* ===== IMAGE CAROUSEL ===== */}
        <div className="md:w-[320px] lg:w-[380px] shrink-0 relative group">
          <img
            src={property.images[imgIndex]}
            alt={property.name}
            className="w-full h-[220px] md:h-[240px] object-cover"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'; }}
          />

          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
              >
                <ChevronLeft size={14} className="text-slate-700" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
              >
                <ChevronRight size={14} className="text-slate-700" />
              </button>
              {/* Mobile swipe indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 md:hidden">
                {property.images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className="bg-teal-700 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Verified
            </span>
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Available
            </span>
          </div>

          <button
            onClick={onToggleFavorite}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
          >
            <Heart size={15} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'} />
          </button>

          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-[11px] font-semibold hidden md:block">
            {imgIndex + 1} / {property.images.length}
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="flex-1 p-3.5 md:p-5 flex flex-col justify-between">
          <div className="space-y-2 md:space-y-2.5">
            {/* Price + Rating */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900">${property.base_price}</span>
                  <span className="text-sm text-slate-400 font-medium">/night</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded ring-1 ring-emerald-100">
                    Save ${savings}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">vs. Airbnb</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700">4.9</span>
              </div>
            </div>

            {/* Name + Address */}
            <div>
              <h3 className="font-bold text-sm md:text-base text-slate-900 leading-tight">
                {property.name}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                {property.location.address}, {property.location.city}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-2.5 text-xs md:text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Bed size={13} className="text-slate-400" />
                <strong className="text-slate-900">{property.bedrooms}</strong> {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <Bath size={13} className="text-slate-400" />
                <strong className="text-slate-900">{property.bathrooms}</strong> {property.bathrooms === 1 ? 'Bath' : 'Baths'}
              </span>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <Users size={13} className="text-slate-400" />
                <strong className="text-slate-900">Sleeps {property.max_guests}</strong>
              </span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1 md:gap-1.5">
              {property.amenities.slice(0, 4).map(a => (
                <span key={a} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] md:text-[11px] text-slate-600 font-semibold">
                  {a}
                </span>
              ))}
              {property.amenities.length > 4 && (
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] md:text-[11px] text-slate-400 font-semibold">
                  +{property.amenities.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* ===== CTA ROW ===== */}
          <div className="flex items-center gap-2 mt-3 md:mt-3.5">
            <button
              onClick={onReserve}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Check size={15} /> Book Direct
            </button>
            <a
              href={`https://wa.me/19545550100?text=Hi, I'm interested in ${encodeURIComponent(property.name)} at ${property.location.address}`}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MessageSquare size={15} />
            </a>
            <a
              href={`tel:+19545550100`}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Phone size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
