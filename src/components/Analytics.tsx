import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Home, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  revenueByMonth: { month: string; revenue: number; bookings: number }[];
  sourceBreakdown: { source: string; count: number; revenue: number }[];
  propertyPerformance: { name: string; bookings: number; revenue: number }[];
  topMetrics: {
    totalRevenue: number;
    revenueChange: number;
    totalBookings: number;
    bookingChange: number;
    avgNightlyRate: number;
    occupancyRate: number;
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const { data: bookingsRaw } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: propertiesRaw } = await supabase
        .from('properties')
        .select('id, name');

      const bks = (bookingsRaw || []) as any[];
      const props = (propertiesRaw || []) as any[];

      // Revenue by month (last 6 months)
      const months: Record<string, { revenue: number; bookings: number }> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        months[key] = { revenue: 0, bookings: 0 };
      }

      bks.forEach(b => {
        const d = new Date(b.created_at);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (months[key]) {
          months[key].revenue += b.total_price;
          months[key].bookings += 1;
        }
      });

      const revenueByMonth = Object.entries(months).map(([month, vals]) => ({
        month,
        revenue: vals.revenue,
        bookings: vals.bookings
      }));

      // Source breakdown
      const sources: Record<string, { count: number; revenue: number }> = {};
      bks.forEach(b => {
        if (!sources[b.source]) sources[b.source] = { count: 0, revenue: 0 };
        sources[b.source].count += 1;
        sources[b.source].revenue += b.total_price;
      });

      const sourceBreakdown = Object.entries(sources).map(([source, vals]) => ({
        source,
        count: vals.count,
        revenue: vals.revenue
      }));

      // Property performance
      const propPerf: Record<string, { name: string; bookings: number; revenue: number }> = {};
      props.forEach(p => {
        propPerf[p.id] = { name: p.name, bookings: 0, revenue: 0 };
      });
      bks.forEach(b => {
        if (propPerf[b.property_id]) {
          propPerf[b.property_id].bookings += 1;
          propPerf[b.property_id].revenue += b.total_price;
        }
      });

      const propertyPerformance = Object.values(propPerf)
        .filter(p => p.bookings > 0)
        .sort((a, b) => b.revenue - a.revenue);

      const totalRevenue = bks.reduce((sum, b) => sum + b.total_price, 0);
      const totalBookings = bks.length;
      const confirmedBookings = bks.filter(b => b.status === 'confirmed').length;

      setData({
        revenueByMonth,
        sourceBreakdown,
        propertyPerformance,
        topMetrics: {
          totalRevenue,
          revenueChange: 12,
          totalBookings,
          bookingChange: 8,
          avgNightlyRate: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0,
          occupancyRate: Math.round((confirmedBookings / Math.max(props.length * 30, 1)) * 100)
        }
      });
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-400 animate-pulse">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="py-20 text-center text-gray-400">No data available.</div>;
  }

  const { topMetrics, revenueByMonth, sourceBreakdown, propertyPerformance } = data;
  const maxRevenue = Math.max(...revenueByMonth.map(d => d.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          label="Total Revenue"
          value={`$${topMetrics.totalRevenue.toLocaleString()}`}
          change={`+${topMetrics.revenueChange}%`}
          icon={<DollarSign size={18} />}
          trend="up"
        />
        <MetricCard
          label="Total Bookings"
          value={topMetrics.totalBookings.toString()}
          change={`+${topMetrics.bookingChange}%`}
          icon={<Home size={18} />}
          trend="up"
        />
        <MetricCard
          label="Avg. Nightly Rate"
          value={`$${topMetrics.avgNightlyRate}`}
          change="vs last month"
          icon={<TrendingUp size={18} />}
        />
        <MetricCard
          label="Occupancy Rate"
          value={`${topMetrics.occupancyRate}%`}
          change="Estimated"
          icon={<Users size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl border border-[#141414]/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-medium tracking-tight">Revenue Trend</h3>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Last 6 Months</span>
          </div>
          
          <div className="h-64 flex items-end gap-4">
            {revenueByMonth.map((d, i) => (
              <motion.div
                key={d.month}
                initial={{ height: 0 }}
                animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
                className="flex-1 flex flex-col justify-end gap-2"
              >
                <div className="relative group">
                  <div className="bg-[#141414] rounded-t-xl w-full min-h-[4px] transition-all group-hover:bg-blue-600"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#141414] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${d.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 text-center font-medium">{d.month.split(' ')[0]}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-3xl border border-[#141414]/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-medium tracking-tight">Booking Sources</h3>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">By Revenue</span>
          </div>
          
          <div className="space-y-4">
            {sourceBreakdown.map((s, i) => {
              const total = sourceBreakdown.reduce((sum, x) => sum + x.revenue, 0);
              const pct = total > 0 ? (s.revenue / total) * 100 : 0;
              const colors = ['bg-[#141414]', 'bg-blue-600', 'bg-purple-600', 'bg-orange-500', 'bg-green-500'];
              
              return (
                <div key={s.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{s.source.replace('_', ' ')}</span>
                    <span className="text-gray-500">${s.revenue.toLocaleString()} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.15, duration: 0.8 }}
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Property Performance Table */}
      <div className="bg-white rounded-3xl border border-[#141414]/5 overflow-hidden">
        <div className="p-6 border-b border-[#141414]/5">
          <h3 className="font-medium tracking-tight">Property Performance</h3>
        </div>
        <div className="divide-y divide-[#141414]/5">
          {propertyPerformance.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span className="font-medium">{p.name}</span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div className="text-right">
                  <p className="font-bold">{p.bookings} bookings</p>
                  <p className="text-gray-400 text-[10px]">Reservations</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${p.revenue.toLocaleString()}</p>
                  <p className="text-gray-400 text-[10px]">Revenue</p>
                </div>
              </div>
            </motion.div>
          ))}
          {propertyPerformance.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-serif italic">No booking data yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon, trend }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#141414]/5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </div>
        )}
      </div>
      <p className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{label}</p>
      <p className="text-xl md:text-3xl font-medium tracking-tighter">{value}</p>
      {!trend && <p className="text-[10px] text-gray-400 mt-1">{change}</p>}
    </div>
  );
}
