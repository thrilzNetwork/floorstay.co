import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Bed, Bath, Users, ChevronDown, Sliders, Heart, Phone, MessageSquare, Check, ArrowRight, Star, Shield } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
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
    document.title = `${storefront?.business_name || 'FloorStay'} | Apartments for Rent | Fort Lauderdale, FL`;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Find apartments for rent in Fort Lauderdale, FL. Browse ${properties.length}+ verified properties. View photos, floor plans, pricing and availability.`);
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
    return result;
  }, [properties, searchQuery, priceRange, bedFilter]);

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const owner = storefront || { business_name: 'FloorStay', headline: 'Apartments for Rent in Fort Lauderdale' };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-slate-400 gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 animate-spin rounded-full" />
        <p className="text-sm font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">FS</div>
              <span className="font-bold text-lg tracking-tight text-slate-900">{owner.business_name}</span>
            </a>
            <div className="flex items-center gap-5">
              <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500">
                <Phone size={15} /> (954) 555-0100
              </span>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">{owner.headline}</h1>
          <p className="text-slate-500 text-sm mb-8">{properties.length} verified properties in Fort Lauderdale, FL</p>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search city, neighborhood, or address..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-slate-50/50 hover:bg-white"
              />
            </div>

            <div className="relative">
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Prices</option>
                <option value="0-150">Under $150</option>
                <option value="150-250">$150 – $250</option>
                <option value="250-400">$250 – $400</option>
                <option value="400-9999">$400+</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={bedFilter}
                onChange={e => setBedFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer min-w-[130px]"
              >
                <option value="all">All Beds</option>
                <option value="1">1+ Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 min-w-[120px]">
              <Search size={18} /> Search
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-300 text-slate-600 hover:border-slate-400'}`}
            >
              <Sliders size={15} /> More Filters
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Clear search
              </button>
            )}
            <span className="ml-auto text-sm text-slate-400 font-medium">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Search size={28} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-slate-900">No matches found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => { setSearchQuery(''); setPriceRange('all'); setBedFilter('all'); }}
                  className="mt-5 text-indigo-600 font-semibold text-sm hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
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
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 space-y-5">
              {/* Direct Booking CTA */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-indigo-400" />
                  <h3 className="font-bold text-base tracking-tight">Book Direct</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">Skip platform fees. Book directly with verified owners and save up to 15%.</p>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-slate-200">No service fees</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Best price guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Direct owner contact</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h4 className="font-bold text-sm tracking-tight text-slate-900">Need Help?</h4>
                <p className="text-slate-500 text-sm">Our team can help you find the right place.</p>
                <button className="w-full flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700">
                  <MessageSquare size={16} /> Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
                  <Phone size={16} /> (954) 555-0100
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {owner.business_name}. All rights reserved.</p>
        </div>
      </footer>

      {selectedBookingProperty && (
        <CheckoutModal property={selectedBookingProperty} onClose={() => setSelectedBookingProperty(null)} />
      )}
    </div>
  );
}

function ApartmentCard({
  property,
  comparison,
  isFavorite,
  onToggleFavorite,
  onReserve
}: {
  property: Property;
  comparison: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReserve: () => void;
}) {
  const savings = comparison?.savings || Math.round(property.base_price * 0.15);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-[300px] shrink-0 relative">
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-[200px] md:h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-slate-900/90 backdrop-blur text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Verified
            </span>
            <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Available
            </span>
          </div>
          <button
            onClick={onToggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors shadow-sm"
          >
            <Heart size={17} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'} />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-lg text-[11px] font-semibold">
            1 / {property.images.length} Photos
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900">${property.base_price}</span>
                  <span className="text-sm text-slate-400 font-medium">/night</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded ring-1 ring-emerald-100">Save ${savings}</span>
                  <span className="text-slate-400 text-xs font-medium">vs. OTA platforms</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700">4.9</span>
              </div>
            </div>

            {/* Name + Address */}
            <div>
              <h3 className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                {property.name}
              </h3>
              <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                <MapPin size={14} />
                {property.location.address}, {property.location.city}, {property.location.state}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Bed size={15} className="text-slate-400" />
                <span className="font-bold text-slate-900">{property.bedrooms}</span>
                <span className="text-slate-500">{property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              <span className="text-slate-200">|</span>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Bath size={15} className="text-slate-400" />
                <span className="font-bold text-slate-900">{property.bathrooms}</span>
                <span className="text-slate-500">{property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
              <span className="text-slate-200">|</span>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users size={15} className="text-slate-400" />
                <span className="font-bold text-slate-900">Sleeps {property.max_guests}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 5).map(a => (
                <span key={a} className="px-2.5 py-1 bg-slate-100 rounded-md text-xs text-slate-600 font-semibold">
                  {a}
                </span>
              ))}
              {property.amenities.length > 5 && (
                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs text-slate-400 font-semibold">
                  +{property.amenities.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
            <button
              onClick={onReserve}
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Check Availability
              <ArrowRight size={15} />
            </button>
            <button className="flex items-center gap-2 border border-slate-300 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Phone size={15} />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
