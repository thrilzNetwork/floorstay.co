import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Upload, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Property } from '../types';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ownerId?: string;
}

export default function AddPropertyModal({ isOpen, onClose, onSuccess, ownerId = '11111111-1111-1111-1111-111111111111' }: AddPropertyModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Partial<Property>>({
    owner_id: ownerId,
    name: '',
    description: '',
    base_price: 150,
    cleaning_fee: 50,
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    images: [],
    amenities: [],
    location: { address: '', city: 'Fort Lauderdale', state: 'FL', country: 'USA' },
    ota_links: {},
    status: 'active'
  });

  const amenitiesList = [
    'WiFi', 'Kitchen', 'Workspace', 'Parking', 'Laundry', 'Pool', 'Gym',
    'Balcony', 'Waterfront', 'Smart Lock', 'BBQ', 'Fireplace', 'Netflix',
    'Beach Access', 'Outdoor Shower', 'Concierge', 'Garden', 'Rooftop'
  ];

  async function handleSubmit() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to OTA price cache
      await supabase.from('ota_price_cache').insert({
        property_id: data.id,
        ota: 'airbnb',
        price: property.base_price,
        fees: Math.round((property.base_price || 150) * 0.20),
        total: Math.round((property.base_price || 150) * 1.20)
      });
      
      setStep(4); // Success
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add property:', err);
      alert('Failed to add property. Check console.');
    } finally {
      setLoading(false);
    }
  }

  const toggleAmenity = (amenity: string) => {
    setProperty(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-[#141414]/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium tracking-tight">Add Property</h3>
                <p className="text-xs text-gray-500">Step {step} of 3</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Property Name</label>
                    <input
                      value={property.name}
                      onChange={e => setProperty(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Las Olas Crew House"
                      className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#141414]/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Description</label>
                    <textarea
                      value={property.description}
                      onChange={e => setProperty(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe the property, target guests, unique features..."
                      rows={3}
                      className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#141414]/20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Base Price/Night</label>
                      <input
                        type="number"
                        value={property.base_price}
                        onChange={e => setProperty(p => ({ ...p, base_price: Number(e.target.value) }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Cleaning Fee</label>
                      <input
                        type="number"
                        value={property.cleaning_fee}
                        onChange={e => setProperty(p => ({ ...p, cleaning_fee: Number(e.target.value) }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Bedrooms</label>
                      <input
                        type="number"
                        value={property.bedrooms}
                        onChange={e => setProperty(p => ({ ...p, bedrooms: Number(e.target.value) }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Bathrooms</label>
                      <input
                        type="number"
                        step="0.5"
                        value={property.bathrooms}
                        onChange={e => setProperty(p => ({ ...p, bathrooms: Number(e.target.value) }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Max Guests</label>
                      <input
                        type="number"
                        value={property.max_guests}
                        onChange={e => setProperty(p => ({ ...p, max_guests: Number(e.target.value) }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Address</label>
                    <input
                      value={property.location?.address}
                      onChange={e => setProperty(p => ({ ...p, location: { ...p.location, address: e.target.value } }))}
                      placeholder="123 Main St"
                      className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">City</label>
                      <input
                        value={property.location?.city}
                        onChange={e => setProperty(p => ({ ...p, location: { ...p.location, city: e.target.value } }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">State</label>
                      <input
                        value={property.location?.state}
                        onChange={e => setProperty(p => ({ ...p, location: { ...p.location, state: e.target.value } }))}
                        className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            property.amenities?.includes(amenity)
                              ? 'bg-[#141414] text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">OTA Links (optional)</label>
                    <input
                      value={property.ota_links?.airbnb || ''}
                      onChange={e => setProperty(p => ({ ...p, ota_links: { ...p.ota_links, airbnb: e.target.value } }))}
                      placeholder="Airbnb listing URL"
                      className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm mb-2"
                    />
                    <input
                      value={property.ota_links?.vrbo || ''}
                      onChange={e => setProperty(p => ({ ...p, ota_links: { ...p.ota_links, vrbo: e.target.value } }))}
                      placeholder="VRBO listing URL"
                      className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Property Photos</label>
                    <div className="border-2 border-dashed border-[#141414]/10 rounded-2xl p-8 text-center space-y-3">
                      <Upload size={32} className="mx-auto text-gray-300" />
                      <p className="text-sm text-gray-500">Drag photos here or click to upload</p>
                      <p className="text-[10px] text-gray-400">For now, paste image URLs below</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Image URLs (comma-separated)</label>
                    <textarea
                      value={property.images?.join(', ')}
                      onChange={e => setProperty(p => ({ ...p, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                      rows={3}
                      className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm resize-none"
                    />
                  </div>

                  <div className="bg-[#141414] text-white rounded-2xl p-6 space-y-3">
                    <h4 className="font-bold text-xs tracking-widest uppercase">Preview</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">Name:</span> {property.name || '—'}</p>
                      <p><span className="text-gray-400">Price:</span> ${property.base_price}/night</p>
                      <p><span className="text-gray-400">Location:</span> {property.location?.city}, {property.location?.state}</p>
                      <p><span className="text-gray-400">Amenities:</span> {property.amenities?.length || 0} selected</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Plus size={32} />
                  </div>
                  <h4 className="text-2xl font-bold tracking-tighter">Property Added!</h4>
                  <p className="text-gray-500">{property.name} is now live on the network.</p>
                  <button
                    onClick={() => { setStep(1); onClose(); }}
                    className="bg-[#141414] text-white px-6 py-2 rounded-full text-sm font-bold"
                  >
                    Add Another
                  </button>
                </div>
              )}
            </div>

            {step < 4 && (
              <div className="p-6 border-t border-[#141414]/5 flex justify-between">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#141414] disabled:opacity-30"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (step === 3) handleSubmit();
                    else setStep(step + 1);
                  }}
                  disabled={loading || !property.name}
                  className="bg-[#141414] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                >
                  {loading ? 'Saving...' : step === 3 ? 'Launch Property' : 'Next'}
                  {!loading && <ChevronRight size={14} />}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
