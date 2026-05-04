import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, TrendingDown, X, MapPin, Bed, Bath, Users, Wifi, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Property, ComparisonData } from '../types';
import { getAllProperties, getOtaComparison } from '../services/propertyService';
import CheckoutModal from './CheckoutModal';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const props = await getAllProperties();
      setProperties(props);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(property: Property) {
    setSelectedProperty(property);
    setGalleryIndex(0);
    const comp = await getOtaComparison(property.id, 2);
    setComparison(comp);
  }

  const nextImage = useCallback(() => {
    if (!selectedProperty) return;
    setGalleryIndex(i => (i + 1) % selectedProperty.images.length);
  }, [selectedProperty]);

  const prevImage = useCallback(() => {
    if (!selectedProperty) return;
    setGalleryIndex(i => (i - 1 + selectedProperty.images.length) % selectedProperty.images.length);
  }, [selectedProperty]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 animate-pulse">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">All Properties</h2>
          <p className="text-sm text-gray-500 font-serif italic">{properties.length} properties on the network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {properties.map(p => (
          <div key={p.id}>
            <PropertyCard property={p} onReserve={() => handleSelect(p)} />
          </div>
        ))}
      </div>

      {/* Property Detail Slide-over */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-3xl bg-[#F5F5F0] h-full shadow-2xl flex flex-col relative z-20 overflow-y-auto"
            >
              {/* Gallery */}
              <div className="relative h-[45vh] w-full overflow-hidden shrink-0 bg-[#141414]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={selectedProperty.images[galleryIndex]}
                    alt={`${selectedProperty.name} - ${galleryIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                >
                  <ArrowRight size={20} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedProperty.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === galleryIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full border border-[#141414]/10 hover:bg-gray-50 z-30"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={16} />
                    <span className="font-serif italic">{selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.state}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">{selectedProperty.name}</h2>
                  <p className="text-gray-500 font-serif italic text-base md:text-lg">{selectedProperty.description}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#141414]/5 text-center space-y-1">
                    <Bed size={20} className="mx-auto text-gray-400" />
                    <p className="font-bold text-lg">{selectedProperty.bedrooms}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Bedrooms</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#141414]/5 text-center space-y-1">
                    <Bath size={20} className="mx-auto text-gray-400" />
                    <p className="font-bold text-lg">{selectedProperty.bathrooms}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Bathrooms</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#141414]/5 text-center space-y-1">
                    <Users size={20} className="mx-auto text-gray-400" />
                    <p className="font-bold text-lg">{selectedProperty.max_guests}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Max Guests</p>
                  </div>
                </div>

                {/* Price Comparison */}
                {comparison && (
                  <div className="bg-white rounded-2xl md:rounded-3xl border border-[#141414]/10 p-5 md:p-8 space-y-4 md:space-y-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <TrendingDown className="text-green-600" size={20} />
                      <h4 className="font-bold text-xs tracking-widest uppercase text-gray-400">Live Price Comparison (2 nights)</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                      <PriceLine label="Direct" amount={`$${comparison.directTotal}`} active />
                      <PriceLine label="Airbnb" amount={`$${comparison.airbnbTotal}`} isOTA />
                      <PriceLine label="VRBO" amount={`$${comparison.vrboTotal}`} isOTA />
                    </div>

                    <div className="pt-4 md:pt-6 border-t border-[#141414]/5">
                      <div className="flex flex-col sm:flex-row justify-between items-center bg-green-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-green-100 gap-3">
                        <div className="space-y-0.5 text-center sm:text-left">
                          <span className="text-green-800 font-medium text-sm font-serif italic block">Direct Booking Advantage</span>
                          <p className="text-green-600 text-[10px] uppercase font-bold tracking-widest">Savings on this stay</p>
                        </div>
                        <span className="text-green-800 font-bold text-2xl md:text-3xl tracking-tighter">+${comparison.savings}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-bold text-xs tracking-widest uppercase text-gray-500">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map(a => (
                      <span key={a} className="px-3 py-1.5 bg-white border border-[#141414]/10 rounded-full text-xs font-medium flex items-center gap-1.5">
                        <Wifi size={12} className="text-gray-400" />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {}}
                  className="w-full bg-[#141414] text-white py-4 rounded-2xl font-bold tracking-tight hover:opacity-90 transition-opacity"
                >
                  Manage Property
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyCard({ property, onReserve }: { property: Property; onReserve: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-[#141414]/5 overflow-hidden cursor-pointer"
    >
      <div className="aspect-video relative overflow-hidden">
        <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase">
          {property.status}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-2 py-1 bg-black/60 backdrop-blur text-white rounded-full text-[10px] font-bold">
            {property.bedrooms} BR
          </span>
          <span className="px-2 py-1 bg-black/60 backdrop-blur text-white rounded-full text-[10px] font-bold">
            {property.bathrooms} BA
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-medium text-lg tracking-tight">{property.name}</h3>
          <p className="text-xs text-gray-500 font-serif italic">{property.location.city}, {property.location.state}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">${property.base_price}</span>
            <span className="text-[10px] text-gray-400 tracking-tighter font-mono">/night</span>
          </div>
          <div className="flex gap-2">
            {property.ota_links?.airbnb && (
              <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[8px] font-bold text-red-600 border border-red-100">A</span>
            )}
            {property.ota_links?.vrbo && (
              <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[8px] font-bold text-blue-600 border border-blue-100">V</span>
            )}
          </div>
        </div>
        <button
          onClick={onReserve}
          className="w-full bg-[#141414] text-white py-3 rounded-xl text-sm font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          View Details <ChevronRight size={14} className="inline ml-1" />
        </button>
      </div>
    </motion.div>
  );
}

function PriceLine({ label, amount, active, isOTA }: { label: string; amount: string; active?: boolean; isOTA?: boolean }) {
  return (
    <div className={`space-y-1 md:space-y-2 ${active ? 'scale-110 origin-left' : 'opacity-60'}`}>
      <span className="block text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <span className={`text-xl md:text-3xl font-medium tracking-tighter leading-none ${active ? 'text-[#141414]' : isOTA ? 'line-through decoration-red-400/50' : ''}`}>
        {amount}
      </span>
    </div>
  );
}
