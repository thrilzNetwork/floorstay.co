import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Bed, Bath, Users, ChevronDown, Sliders, Heart, Phone, MessageSquare, Check } from 'lucide-react';
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
        // Load OTA comparisons for all properties
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-gray-400 gap-4">
        <div className="w-10 h-10 border-t-2 border-blue-600 animate-spin rounded-full" />
        <p className="text-sm">Loading properties...</p>
      </div>
    );
  }

  const owner = storefront || {
    business_name: 'FloorStay',
    headline: 'Apartments for Rent in Fort Lauderdale',
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#141414] font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  FS
                </div>
                <span className="font-bold text-lg tracking-tight">{owner.business_name}</span>
              </a>
            </div>
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#141414] transition-colors">
                <Phone size={16} />
                <span className="hidden sm:inline">(954) 555-0100</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">{owner.headline}</h1>

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by city, neighborhood, or address..."
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Price Range */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-4 pr-10 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer min-w-[140px]"
              >
                <option value="all">All Prices</option>
                <option value="0-150">Under $150</option>
                <option value="150-250">$150 - $250</option>
                <option value="250-400">$250 - $400</option>
                <option value="400-9999">$400+</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Beds */}
            <div className="relative">
              <select
                value={bedFilter}
                onChange={e => setBedFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-4 pr-10 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer min-w-[120px]"
              >
                <option value="all">All Beds</option>
                <option value="1">1+ Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Button */}
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-w-[120px]">
              <Search size={18} />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
            >
              <Sliders size={16} />
              More Filters
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Clear search
              </button>
            )}
            <span className="ml-auto text-sm text-gray-500">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </span>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-8">
          {/* List */}
          <div className="flex-1">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">No properties match your search</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => { setSearchQuery(''); setPriceRange('all'); setBedFilter('all'); }}
                  className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
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

          {/* Right Sidebar — Promo / CTA */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Direct Booking Advantage */}
              <div className="bg-blue-600 text-white rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-lg tracking-tight">Book Direct Advantage</h3>
                <p className="text-blue-100 text-sm">Skip the platform fees. Book directly with property owners and save up to 15% on every stay.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-200" />
                    <span>No service fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-200" />
                    <span>Best price guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-200" />
                    <span>Direct owner contact</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-sm tracking-tight">Need Help?</h4>
                <p className="text-gray-500 text-sm">Our team can help you find the perfect place.</p>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                  <MessageSquare size={16} />
                  Message Us
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                  <Phone size={16} />
                  (954) 555-0100
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {owner.business_name}. All rights reserved.
          </p>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-[320px] shrink-0 relative">
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-[220px] md:h-full object-cover"
          />
          {/* Badges over image */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Verified
            </span>
            <span className="bg-green-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Available
            </span>
          </div>
          {/* Favorite */}
          <button
            onClick={onToggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors"
          >
            <Heart
              size={18}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}
            />
          </button>
          {/* Property count badge */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold">
            1 of {property.images.length} Photos
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Price + Savings */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight">${property.base_price}</span>
                  <span className="text-sm text-gray-500">/night</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded">Save ${savings}</span>
                  <span className="text-gray-400 text-xs">vs. Airbnb/VRBO</span>
                </div>
              </div>
            </div>

            {/* Name + Address */}
            <div>
              <h3 className="font-bold text-lg tracking-tight hover:text-blue-600 cursor-pointer transition-colors">
                {property.name}
              </h3>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                <MapPin size={14} />
                {property.location.address}, {property.location.city}, {property.location.state}
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Bed size={16} className="text-gray-400" />
                <span className="font-bold">{property.bedrooms}</span>
                <span className="text-gray-500">{property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Bath size={16} className="text-gray-400" />
                <span className="font-bold">{property.bathrooms}</span>
                <span className="text-gray-500">{property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Users size={16} className="text-gray-400" />
                <span className="font-bold">Sleeps {property.max_guests}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 5).map(a => (
                <span key={a} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                  {a}
                </span>
              ))}
              {property.amenities.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-medium">
                  +{property.amenities.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={onReserve}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Check Availability
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
              <Phone size={16} />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
