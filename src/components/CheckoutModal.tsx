import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Settings, Home, CheckCircle, Loader2 } from 'lucide-react';
import type { Property } from '../types';
import { getOtaComparison } from '../services/propertyService';
import { supabase } from '../lib/supabase';

export default function CheckoutModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [payNow, setPayNow] = useState(true);
  const [comparison, setComparison] = useState<any>(null);
  const [nights, setNights] = useState(2);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Guest info
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState('2026-05-12');
  const [checkOut, setCheckOut] = useState('2026-05-14');

  useEffect(() => {
    getOtaComparison(property.id, nights).then(setComparison);
  }, [property.id, nights]);

  async function handleCreateBooking() {
    if (!guestName || !guestEmail) return;
    
    setLoading(true);
    try {
      const baseTotal = property.base_price * nights;
      const cleaningFee = property.cleaning_fee || 0;
      const directSavings = comparison?.savings || 0;
      const payNowDiscount = payNow ? Math.round(baseTotal * 0.05) : 0;
      const finalTotal = baseTotal + cleaningFee - payNowDiscount;

      const booking = {
        property_id: property.id,
        owner_id: property.owner_id,
        guest_email: guestEmail,
        guest_name: guestName,
        guest_phone: guestPhone || null,
        start_date: checkIn,
        end_date: checkOut,
        nights,
        base_total: baseTotal,
        cleaning_fee: cleaningFee,
        platform_fee_savings: directSavings,
        pay_now_discount: payNowDiscount,
        total_price: finalTotal,
        status: payNow ? 'confirmed' : 'pending',
        source: 'direct',
        payment_status: payNow ? 'paid' : 'pending'
      };

      const { data: insertedBooking, error } = await supabase
        .from('bookings')
        .insert(booking as any)
        .select('id')
        .single();

      if (error) throw error;
      if (!insertedBooking) throw new Error('Booking insert returned no data');
      
      setBookingId((insertedBooking as any).id);
      setStep(3);
    } catch (err) {
      console.error('Booking creation failed:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!comparison) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <div className="bg-white rounded-[40px] p-8 z-10 flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-blue-600" />
          Loading pricing...
        </div>
      </motion.div>
    );
  }

  const baseTotal = property.base_price * nights;
  const cleaningFee = property.cleaning_fee || 0;
  const directSavings = comparison?.savings || 0;
  const payNowDiscount = payNow ? Math.round(baseTotal * 0.05) : 0;
  const finalTotal = baseTotal + cleaningFee - payNowDiscount;

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
        className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col h-auto max-h-[90vh]"
      >
        <div className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-600 text-white text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Official Channel</span>
              </div>
              <h3 className="text-3xl font-medium tracking-tighter">{step === 3 ? 'Booking Confirmed!' : 'Direct Reserve.'}</h3>
              <p className="text-sm text-gray-400 font-serif italic">
                {step === 3 ? `Booking #${bookingId?.slice(0, 8)}` : `Secure your stay at ${property.name}`}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Full Name</label>
                <input
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#141414]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#141414]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Phone</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder="+1 (305) 555-0101"
                    className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#141414]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full bg-[#F5F5F0] border-none rounded-2xl px-4 py-3 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex p-1 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => setPayNow(true)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${payNow ? 'bg-white shadow-sm text-[#141414]' : 'text-gray-400'}`}
                >
                  Pay Now (-5%)
                </button>
                <button
                  onClick={() => setPayNow(false)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!payNow ? 'bg-white shadow-sm text-[#141414]' : 'text-gray-400'}`}
                >
                  Pay at Arrival
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!guestName || !guestEmail}
                className="w-full bg-[#141414] text-white py-4 rounded-3xl font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all text-lg disabled:opacity-30"
              >
                Review Booking
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="bg-[#141414] text-white p-8 rounded-[32px] space-y-4 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center opacity-60">
                    <span className="text-sm font-serif italic">{nights} Night Base Stay</span>
                    <span className="font-mono">${baseTotal}</span>
                  </div>
                  {cleaningFee > 0 && (
                    <div className="flex justify-between items-center opacity-60">
                      <span className="text-sm font-serif italic">Cleaning Fee</span>
                      <span className="font-mono">${cleaningFee}</span>
                    </div>
                  )}
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

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-[#141414]/5">
                  <span className="text-gray-500">Guest</span>
                  <span className="font-medium">{guestName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#141414]/5">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{guestEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#141414]/5">
                  <span className="text-gray-500">Dates</span>
                  <span className="font-medium">{checkIn} → {checkOut}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#141414]/5">
                  <span className="text-gray-500">Property</span>
                  <span className="font-medium">{property.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium">{payNow ? 'Pay Now (-5%)' : 'Pay at Arrival'}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-3xl text-sm font-bold border border-[#141414]/10 hover:bg-gray-50 transition-all"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleCreateBooking}
                  disabled={loading}
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-3xl font-bold tracking-tight shadow-xl hover:opacity-90 active:scale-95 transition-all text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? 'Processing...' : payNow ? 'Pay & Confirm' : 'Confirm Reservation'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[9px] font-bold tracking-widest uppercase text-gray-300">
                <span className="flex items-center gap-1"><Settings size={12} /> SSL Secured</span>
                <span className="flex items-center gap-1"><Home size={12} /> Best Rate Guarantee</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 py-6 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} />
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-bold tracking-tighter">Direct Stay Booked!</h4>
                <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
                  You saved <span className="text-[#141414] font-bold">${directSavings + payNowDiscount}</span> by booking direct.
                </p>
                <p className="text-sm text-gray-400">
                  Booking confirmation sent to {guestEmail}
                </p>
              </div>

              <div className="bg-[#F5F5F0] rounded-2xl p-6 space-y-3 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-mono font-bold">{bookingId?.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Property</span>
                  <span className="font-medium">{property.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold">${finalTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600 font-bold">{payNow ? 'Confirmed & Paid' : 'Confirmed (Pay on Arrival)'}</span>
                </div>
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
