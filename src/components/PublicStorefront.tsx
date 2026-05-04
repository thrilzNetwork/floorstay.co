import { useState, useEffect, useMemo } from 'react';
import type React from 'react';
import { Search, MapPin, Bed, Bath, Users, ChevronDown, Sliders, Heart, Phone, MessageSquare, Check, ArrowRight, Star, Shield, ChevronLeft, ChevronRight, Home, Calendar, Filter } from 'lucide-react';
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
    document.title = `${storefront?.business_name || 'FloorStay'} | Crew Housing Fort Lauderdale & Miami`;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Find crew housing and short-term apartments in Fort Lauderdale and Miami. Browse ${properties.length}+ verified properties near marinas, ports, and training centers. Weekly and monthly stays available.`);
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
    // Sort
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

  const owner = storefront || { business_name: 'FloorStay', headline: 'Crew Housing & Short-Term Rentals in Fort Lauderdale & Miami' };

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
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                <Home size={18} />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm tracking-tight text-slate-900 block">{owner.business_name}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Crew Housing</span>
              </div>
            </a>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-teal-700 transition-colors">About Us</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Full House Rentals</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Our Homes</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Locations</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Room Options</a>
              <a href="#" className="hover:text-teal-700 transition-colors">Book Now</a>
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
                <Phone size={14} /> (954) 555-0100
              </span>
              <button className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-800 transition-colors">
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=1920&h=500&fit=crop"
            alt="Crew housing"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              {owner.headline}
            </h1>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Short-term crew housing designed for yacht crew, maritime students, and traveling professionals in Fort Lauderdale and Miami. Flexible stays, no long-term leases.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/19545550100" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors">
                <MessageSquare size={16} /> Message Us on WhatsApp
              </a>
              <button
                onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <Calendar size={16} /> Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Search */}
            <div className="flex-1 relative min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by city, neighborhood, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all bg-slate-50 hover:bg-white"
              />
            </div>

            {/* City */}
            <div className="relative min-w-[140px]">
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 pr-8 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none cursor-pointer"
              >
                <option value="all">All Cities</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Price */}
            <div className="relative min-w-[120px]">
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 pr-8 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="0-150">Under $150</option>
                <option value="150-250">$150 – $250</option>
                <option value="250-400">$250 – $400</option>
                <option value="400-9999">$400+</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Beds */}
            <div className="relative min-w-[110px]">
              <select
                value={bedFilter}
                onChange={e => setBedFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 pr-8 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none cursor-pointer"
              >
                <option value="all">All Beds</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 min-w-[100px]">
              <Search size={16} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* ===== RESULTS HEADER ===== */}
      <div id="results" className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-slate-500">
            <span>Showing </span>
            <strong className="text-slate-900">1 – {filteredProperties.length}</strong>
            <span> of </span>
            <strong className="text-slate-900">{filteredProperties.length}</strong>
            <span> results</span>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:border-teal-500 outline-none cursor-pointer"
            >
              <option value="popularidad">Popularidad</option>
              <option value="precio-asc">Price: Low to High</option>
              <option value="precio-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-4 pb-12">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search size={28} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2 text-slate-900">No matches found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setSearchQuery(''); setPriceRange('all'); setBedFilter('all'); setCityFilter('all'); }}
              className="mt-5 text-teal-700 font-semibold text-sm hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
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
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Home size={18} className="text-teal-400" />
              <span className="font-bold text-lg">{owner.business_name}</span>
            </div>
            <p className="text-slate-400 text-sm">Crew housing and short-term rentals for yacht crew, maritime students, and professionals in Fort Lauderdale and Miami.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-slate-300">Locations</h4>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Fort Lauderdale</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Miami</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hollywood</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pompano Beach</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-slate-300">Room Options</h4>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Shared Rooms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Private Rooms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Studios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Full House Rentals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-slate-300">Contact</h4>
            <p className="text-sm text-slate-400 mb-1">(954) 555-0100</p>
            <p className="text-sm text-slate-400 mb-3">hello@floorstay.co</p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><MessageSquare size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Phone size={18} /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {owner.business_name}. All rights reserved.
        </div>
      </footer>

      {selectedBookingProperty && (
        <CheckoutModal property={selectedBookingProperty} onClose={() => setSelectedBookingProperty(null)} />
      )}
    </div>
  );
}

/* ====== HORIZONTAL CARD (InfoCasas style) ====== */
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
    <div className="bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row">
        {/* ===== IMAGE CAROUSEL ===== */}
        <div className="md:w-[360px] lg:w-[400px] shrink-0 relative group">
          <img
            src={property.images[imgIndex]}
            alt={property.name}
            className="w-full h-[240px] md:h-[260px] object-cover"
          />

          {/* Nav arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={16} className="text-slate-700" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={16} className="text-slate-700" />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-teal-700 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Verified
            </span>
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Available
            </span>
          </div>

          {/* Favorite */}
          <button
            onClick={onToggleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
          >
            <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'} />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
            {imgIndex + 1} / {property.images.length}
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Price + Rating */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">${property.base_price}</span>
                  <span className="text-sm text-slate-400 font-medium">/night</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded ring-1 ring-emerald-100">
                    Save ${savings}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">vs. Airbnb/VRBO</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700">4.9</span>
              </div>
            </div>

            {/* Name + Address */}
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                {property.name}
              </h3>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                <MapPin size={13} />
                {property.location.address}, {property.location.city}, {property.location.state}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Bed size={14} className="text-slate-400" />
                <strong className="text-slate-900">{property.bedrooms}</strong> {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <Bath size={14} className="text-slate-400" />
                <strong className="text-slate-900">{property.bathrooms}</strong> {property.bathrooms === 1 ? 'Bath' : 'Baths'}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <Users size={14} className="text-slate-400" />
                <strong className="text-slate-900">Sleeps {property.max_guests}</strong>
              </span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 6).map(a => (
                <span key={a} className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600 font-semibold">
                  {a}
                </span>
              ))}
              {property.amenities.length > 6 && (
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-400 font-semibold">
                  +{property.amenities.length - 6} more
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
              {property.description}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={onReserve}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Contactar
            </button>
            <a
              href={`tel:+19545550100`}
              className="flex items-center gap-2 border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Phone size={14} /> Llamar
            </a>
            <a
              href="https://wa.me/19545550100"
              className="flex items-center gap-2 border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <MessageSquare size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
