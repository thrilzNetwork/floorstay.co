import { useState, useEffect, useMemo } from 'react';
import type React from 'react';
import { Search, MapPin, Bed, Bath, Users, Heart, Phone, MessageSquare, Check, Star, Filter, X, Menu, Home, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparisons, setComparisons] = useState<Record<string, any>>({});

  useEffect(() => {
    loadStorefront();
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

  useEffect(() => {
    document.title = `${storefront?.business_name || 'FloorStay'} | Crew Housing FTL & Miami`;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Crew housing in Fort Lauderdale & Miami. ${properties.length}+ verified apartments near marinas & ports. Weekly & monthly stays.`);
  }, [storefront, properties]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q)
      );
    }
    if (cityFilter !== 'all') {
      result = result.filter(p => p.location.city === cityFilter);
    }
    return result;
  }, [properties, searchQuery, cityFilter]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-teal-700 animate-spin rounded-full" />
        <p className="text-sm font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white">
              <Home size={18} />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-sm tracking-tight text-slate-900 block">{owner.business_name}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:block">Crew Housing</span>
            </div>
          </a>

          <div className="flex items-center gap-1">
            <a href="tel:+19545550100" className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500">
              <Phone size={18} />
            </a>
            <a href="https://wa.me/19545550100" className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500">
              <MessageSquare size={18} />
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-sm">
            <a href="#" className="block py-2.5 text-sm font-medium text-slate-600">About Us</a>
            <a href="#" className="block py-2.5 text-sm font-medium text-slate-600">Our Homes</a>
            <a href="#" className="block py-2.5 text-sm font-medium text-slate-600">Locations</a>
            <a href="#" className="block py-2.5 text-sm font-medium text-slate-600">Book Now</a>
          </div>
        )}
      </header>

      {/* ===== COMPACT HERO ===== */}
      <section className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-2 leading-tight">
            {owner.headline}
          </h1>
          <p className="text-teal-100 text-sm md:text-base mb-4 max-w-xl">
            Verified crew housing in Fort Lauderdale & Miami. Flexible stays near marinas & ports.
          </p>
          <a
            href="https://wa.me/19545550100"
            className="inline-flex items-center gap-2 bg-white text-teal-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors"
          >
            <MessageSquare size={16} /> Message on WhatsApp
          </a>
        </div>
      </section>

      {/* ===== SEARCH + CITY PILLS ===== */}
      <section className="bg-white border-b border-slate-200 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search city, neighborhood..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-slate-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setCityFilter('all')}
              className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border transition-colors ${
                cityFilter === 'all'
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              All Cities
            </button>
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setCityFilter(cityFilter === c ? 'all' : c)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border transition-colors ${
                  cityFilter === c
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESULTS COUNT ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <p className="text-sm text-slate-500 font-medium">
          <strong className="text-slate-900">{filteredProperties.length}</strong> properties
        </p>
      </div>

      {/* ===== PROPERTY CARDS ===== */}
      <main className="max-w-7xl mx-auto px-4 space-y-5">
        {filteredProperties.map(p => (
          <PropertyCard
            key={p.id}
            property={p}
            comparison={comparisons[p.id]}
            isFavorite={favorites.has(p.id)}
            onToggleFavorite={() => toggleFavorite(p.id)}
            onReserve={() => setSelectedBookingProperty(p)}
          />
        ))}

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold mb-1">No matches</h3>
            <p className="text-slate-400 text-sm mb-4">Try adjusting your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setCityFilter('all'); }}
              className="text-teal-700 font-semibold text-sm hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-white py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Home size={18} className="text-teal-400" />
              <span className="font-bold text-lg">{owner.business_name}</span>
            </div>
            <p className="text-slate-400 text-sm">Crew housing in Fort Lauderdale & Miami.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2 text-slate-300">Locations</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>Fort Lauderdale</li>
              <li>Miami</li>
              <li>Hollywood</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2 text-slate-300">Contact</h4>
            <p className="text-sm text-slate-400">(954) 555-0100</p>
            <p className="text-sm text-slate-400">hello@floorstay.co</p>
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

/* ====== PROPERTY CARD: True vertical mobile-first ====== */
function PropertyCard({
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

  const nextImg = (e: any) => {
    e.stopPropagation();
    setImgIndex(i => (i + 1) % property.images.length);
  };
  const prevImg = (e: any) => {
    e.stopPropagation();
    setImgIndex(i => (i - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* ===== IMAGE (full width, clean) ===== */}
      <div className="relative">
        <img
          src={property.images[imgIndex]}
          alt={property.name}
          className="w-full h-[200px] sm:h-[220px] object-cover"
        />

        {/* Fallback bg if image fails */}
        <div className="absolute inset-0 bg-slate-200 -z-10" />

        {/* Dots for mobile */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {/* Desktop arrows */}
        {property.images.length > 1 && (
          <>
            <button onClick={prevImg} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-sm">
              <ChevronLeft size={16} className="text-slate-700" />
            </button>
            <button onClick={nextImg} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-sm">
              <ChevronRight size={16} className="text-slate-700" />
            </button>
          </>
        )}

        {/* Favorite */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
        >
          <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'} />
        </button>

        {/* Verified badge */}
        <div className="absolute top-2.5 left-2.5 bg-teal-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          Verified
        </div>
      </div>

      {/* ===== CARD CONTENT ===== */}
      <div className="p-4 space-y-3">
        {/* Title + Location */}
        <div>
          <h3 className="font-bold text-base text-slate-900 leading-snug">{property.name}</h3>
          <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
            <MapPin size={13} />
            {property.location.city}, FL
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Bed size={14} className="text-slate-400" />
            {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} className="text-slate-400" />
            {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} className="text-slate-400" />
            {property.max_guests} guests
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-slate-900">${property.base_price}</span>
            <span className="text-sm text-slate-400 font-medium"> /night</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700">4.9</span>
          </div>
        </div>

        {/* Savings badge */}
        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
          Save ${savings} vs Airbnb
        </div>

        {/* Amenities (compact) */}
        <p className="text-xs text-slate-500">
          {property.amenities.slice(0, 5).join(' · ')}
          {property.amenities.length > 5 && ` +${property.amenities.length - 5} more`}
        </p>

        {/* CTA */}
        <button
          onClick={onReserve}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Check size={16} /> Book Direct — ${property.base_price}/night
        </button>
      </div>
    </div>
  );
}
