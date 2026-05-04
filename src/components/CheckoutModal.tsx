import { useState } from 'react';
import { motion } from 'motion/react';
import { X, BarChart3, Settings, Home } from 'lucide-react';
import type { Property } from '../types';
import { getOtaComparison } from '../services/propertyService';
import { useEffect } from 'react';

export default function CheckoutModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [payNow, setPayNow] = useState(true);
  const [comparison, setComparison] = useState<any>(null);
  const [nights, setNights] = useState(2);

  useEffect(() => {
    getOtaComparison(property.id, nights).then(setComparison);
  }, [property.id, nights]);

  if (!comparison) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <div className="bg-white rounded-[40px] p-8 z-10">Loading pricing...</div>
      </motion.div>
    );
  }

  const baseTotal = property.base_price * nights;
  const cleaningFee = property.cleaning_fee || 0;
  const directSavings = comparison?.savings || 52;
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
              <h3 className="text-3xl font-medium tracking-tighter">Direct Reserve.</h3>
              <p className="text-sm text-gray-400 font-serif italic">Secure your stay at {property.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
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
            <div className="space-y-8 py-10 text-center">
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
