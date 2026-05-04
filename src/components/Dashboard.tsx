import { DollarSign, TrendingDown, Settings, BookOpen, Home, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Booking, Property } from '../types';
import { getAllProperties, getBookingsByOwner } from '../services/propertyService';
import { MOCK_PROPERTIES } from '../constants';

interface DashboardStats {
  revenue: number;
  directPercent: number;
  syncHealth: string;
  activeProperties: number;
  totalBookings: number;
  pendingBookings: number;
  avgNightlyRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    directPercent: 0,
    syncHealth: 'Healthy',
    activeProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    avgNightlyRate: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const props = await getAllProperties();
      setProperties(props);

      const bks: any[] = [];

      const totalRevenue = bks
        .filter((b: any) => b.status === 'confirmed')
        .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0);
      
      const directBookings = bks.filter((b: any) => b.source === 'direct').length;
      const directPercent = bks.length > 0 ? Math.round((directBookings / bks.length) * 100) : 0;
      
      const confirmed = bks.filter((b: any) => b.status === 'confirmed');
      const avgRate = confirmed.length > 0 
        ? Math.round(confirmed.reduce((sum: number, b: any) => sum + ((b.total_price || 0) / (b.nights || 1)), 0) / confirmed.length)
        : 0;

      setStats({
        revenue: totalRevenue,
        directPercent,
        syncHealth: 'Healthy',
        activeProperties: props.length,
        totalBookings: bks.length,
        pendingBookings: bks.filter((b: any) => b.status === 'pending').length,
        avgNightlyRate: avgRate
      });

      const recent = bks.slice(0, 5).map((b: any) => ({
        ...b,
        property_name: props.find((p: Property) => p.id === b.property_id)?.name || 'Unknown'
      }));
      setRecentBookings(recent);

    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 font-sans">
        <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} change="+12%" icon={<DollarSign size={18} />} />
        <StatCard label="Direct %" value={`${stats.directPercent}%`} change="+5%" icon={<TrendingDown size={18} />} trend="up" color="text-green-600" />
        <StatCard label="Properties" value={`${stats.activeProperties}`} change="Active" icon={<Settings size={18} />} color="text-green-600" />
        <StatCard label="Bookings" value={`${stats.totalBookings}`} change={`${stats.pendingBookings} pending`} icon={<BookOpen size={18} />} color="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Direct Engine Teaser */}
        <div className="lg:col-span-2 bg-[#141414] rounded-2xl md:rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="max-w-md space-y-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Direct Engine Active.</h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Your network has <span className="text-white font-bold">{stats.activeProperties}</span> active properties
              with an average rate of <span className="text-white font-bold">${stats.avgNightlyRate}/night</span>.
              {stats.directPercent > 0 && (
                <> <span className="text-white font-bold">{stats.directPercent}%</span> of bookings are direct. </>
              )}
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-[#141414] px-5 py-2 rounded-full text-[10px] md:text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform">
                View Analytics <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 opacity-20 blur-3xl bg-blue-500 w-48 h-48 rounded-full" />
        </div>

        {/* Sync Center */}
        <div className="bg-white rounded-3xl border border-[#141414]/5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[10px] tracking-widest uppercase text-gray-400">Channel Sync</h4>
            <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-4">
            <SyncRow name="Airbnb" status="Synced" time="2m ago" />
            <SyncRow name="VRBO" status="Synced" time="5m ago" />
            <SyncRow name="Booking.com" status="Connecting" time="--" />
          </div>
        </div>
      </div>

      {/* Active Properties Preview */}
      <div className="bg-white rounded-3xl border border-[#141414]/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium font-serif italic text-lg text-[#141414]">Active Properties</h3>
          <span className="text-sm text-gray-500">{properties.length} total</span>
        </div>
        {loading ? (
          <div className="py-8 text-center text-gray-400 animate-pulse">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No properties found. Add your first property to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 6).map(p => (
              <div key={p.id} className="bg-[#F5F5F0] rounded-2xl p-4 space-y-2">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-sm tracking-tight">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.location?.city}, {p.location?.state}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">${p.base_price}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{p.bedrooms}BR · {p.bathrooms}BA · {p.max_guests} guests</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-3xl border border-[#141414]/5 overflow-hidden">
        <div className="p-6 border-b border-[#141414]/5 flex justify-between items-center">
          <h3 className="font-medium font-serif italic text-lg text-[#141414]">Recent Bookings</h3>
          <button className="text-sm text-gray-500 underline underline-offset-4">View All</button>
        </div>
        <div className="divide-y divide-[#141414]/5 font-mono text-xs">
          {recentBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-serif italic">No bookings yet.</div>
          ) : (
            recentBookings.map((b: any, i: number) => (
              <div key={b.id || i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Home size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-tighter">{b.guest_name || b.guest_email?.split('@')[0] || 'Guest'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        b.source === 'direct' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {b.source?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400">{b.property_name} · {b.nights} nights · {b.start_date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${b.total_price}</p>
                  <p className="text-gray-400">{b.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, trend, color = 'text-[#141414]' }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#141414]/5 shadow-sm">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="p-1.5 md:p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
        {change && (
          <span className={`text-[10px] md:text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-[10px] md:text-sm text-gray-400 font-medium mb-0.5 tracking-tight uppercase md:normal-case">{label}</p>
      <p className={`text-xl md:text-3xl font-medium tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function SyncRow({ name, status, time }: { name: string; status: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#141414]/5 last:border-none">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'Synced' ? 'bg-green-500' : 'bg-orange-400'}`} />
        <span className="text-xs font-medium tracking-tight text-gray-700">{name}</span>
      </div>
      <span className="text-[10px] text-gray-400 font-mono italic">{time}</span>
    </div>
  );
}
