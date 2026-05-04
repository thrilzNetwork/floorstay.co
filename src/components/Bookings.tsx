import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Home, DollarSign, CheckCircle, Clock, XCircle, ChevronRight, Search } from 'lucide-react';
import type { Booking, Property } from '../types';
import { supabase } from '../lib/supabase';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, name, images');
      
      const propsMap: Record<string, Property> = {};
      propertiesData?.forEach(p => {
        propsMap[p.id] = p as Property;
      });
      
      setProperties(propsMap);
      setBookings((bookingsData || []) as Booking[]);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = !searchQuery || 
      b.guest_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      properties[b.property_id]?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.total_price, 0),
    pending: bookings.filter(b => b.status === 'pending').length,
    directRate: bookings.length > 0 
      ? Math.round((bookings.filter(b => b.source === 'direct').length / bookings.length) * 100) 
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 animate-pulse">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Bookings" value={stats.total} icon={<Calendar size={18} />} />
        <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<DollarSign size={18} />} color="text-green-600" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock size={18} />} color="text-orange-500" />
        <StatCard label="Direct Rate" value={`${stats.directRate}%`} icon={<CheckCircle size={18} />} color="text-blue-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-[#141414] text-white'
                  : 'bg-white border border-[#141414]/10 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-white border border-[#141414]/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl border border-[#141414]/5 overflow-hidden">
        <div className="p-6 border-b border-[#141414]/5">
          <h3 className="font-medium font-serif italic text-lg">{filteredBookings.length} Bookings</h3>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-serif italic">No bookings found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#141414]/5">
            {filteredBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Home size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-tighter">{booking.guest_name || booking.guest_email}</span>
                      <StatusBadge status={booking.status} />
                      <SourceBadge source={booking.source} />
                    </div>
                    <p className="text-gray-400 text-sm">
                      {properties[booking.property_id]?.name || 'Unknown Property'} · {booking.nights} nights
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {booking.start_date} → {booking.end_date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${booking.total_price}</p>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">
                    {booking.payment_status}
                  </p>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#141414] transition-colors ml-auto mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = 'text-[#141414]' }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#141414]/5 shadow-sm">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 w-fit mb-3">{icon}</div>
      <p className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{label}</p>
      <p className={`text-xl md:text-3xl font-medium tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[status as keyof typeof colors] || colors.pending}`}>
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const colors = {
    direct: 'bg-blue-100 text-blue-700',
    airbnb: 'bg-red-100 text-red-700',
    vrbo: 'bg-purple-100 text-purple-700',
    booking_com: 'bg-indigo-100 text-indigo-700',
    referral: 'bg-green-100 text-green-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[source as keyof typeof colors] || colors.direct}`}>
      {source}
    </span>
  );
}
