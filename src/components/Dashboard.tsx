import { DollarSign, Building2, TrendingUp, Calendar, Users, ArrowUpRight, MoreHorizontal, Plus, ExternalLink, RefreshCw, Home, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Property } from '../types';
import { getAllProperties } from '../services/propertyService';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];
const CHART_DATA = [35, 42, 28, 55, 48, 62];

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProperties().then(p => {
      setProperties(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activeCount = properties.length;
  const avgRate = activeCount > 0
    ? Math.round(properties.reduce((s, p) => s + p.base_price, 0) / activeCount)
    : 0;

  const maxChart = Math.max(...CHART_DATA);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          label="Estimated Revenue"
          value="$0"
          sub="+0%"
          icon={<DollarSign size={18} />}
          trend="neutral"
        />
        <KpiCard
          label="Active Properties"
          value={String(activeCount)}
          sub="Real-time"
          icon={<Building2 size={18} />}
          trend="up"
        />
        <KpiCard
          label="Avg Nightly Rate"
          value={`$${avgRate}`}
          sub={`${activeCount} units`}
          icon={<TrendingUp size={18} />}
          trend="up"
        />
        <KpiCard
          label="Direct Bookings"
          value="0"
          sub="No bookings yet"
          icon={<Calendar size={18} />}
          trend="neutral"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left — Chart + Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Revenue Overview</h3>
            </div>
            <div className="p-6">
              <svg viewBox="0 0 600 160" className="w-full h-40">
                {/* Grid lines */}
                {[40, 80, 120].map(y => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                {CHART_DATA.map((val, i) => {
                  const barWidth = 60;
                  const gap = (600 - CHART_DATA.length * barWidth) / (CHART_DATA.length + 1);
                  const x = gap + i * (barWidth + gap);
                  const barHeight = Math.max((val / maxChart) * 140, 20);
                  const y = 160 - barHeight;
                  return (
                    <g key={i} className="group">
                      <rect
                        x={x} y={y} width={barWidth} height={barHeight}
                        rx="4" fill="#4f46e5"
                        className="transition-all duration-300"
                        style={{ transition: 'fill 0.3s' }}
                      />
                      {/* Tooltip on hover */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <rect x={x - 10} y={y - 28} width={barWidth + 20} height="22" rx="4" fill="#0f172a" />
                        <text x={x + barWidth/2} y={y - 12} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">${(val * 120).toLocaleString()}</text>
                      </g>
                      <text x={x + barWidth/2} y={156} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">{MONTHS[i]}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Active Properties */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">Active Properties</h3>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={4} cols={5} />
                </div>
              ) : properties.length === 0 ? (
                <div className="py-12 text-center">
                  <Home size={28} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-600">No properties yet</p>
                  <p className="text-xs text-slate-400 mt-1">Add your first property to get started.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 px-6 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Property</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Location</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Beds</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Rate</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {properties.slice(0, 6).map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="py-2.5 px-6">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100 ring-1 ring-slate-200" />
                            <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">{p.location.city}, {p.location.state}</td>
                        <td className="py-2.5 px-4 text-slate-500">{p.bedrooms}BR / {p.bathrooms}BA</td>
                        <td className="py-2.5 px-4 text-slate-900 font-semibold">${p.base_price}<span className="text-slate-400 font-normal">/night</span></td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-6">
                          <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-300 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Quick Actions</h3>
            </div>
            <div className="p-2">
              <ActionRow icon={<Plus size={16} />} label="Add New Property" desc="List a new rental" />
              <ActionRow icon={<ExternalLink size={16} />} label="View Storefront" desc="Preview public page" />
              <ActionRow icon={<RefreshCw size={16} />} label="Sync Calendars" desc="Pull from Airbnb & VRBO" />
            </div>
          </div>

          {/* Channel Sync */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Channel Sync</h3>
            </div>
            <div className="p-4 space-y-1">
              <ChannelRow name="Airbnb" status="connected" />
              <ChannelRow name="VRBO" status="connected" />
              <ChannelRow name="Booking.com" status="connecting" />
            </div>
          </div>

          {/* Empty Bookings State */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
            <Users size={24} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-700">No bookings yet</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Reservations will appear here once guests start booking directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UI Primitives ──────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, trend }: { label: string; value: string; sub: string; icon: React.ReactNode; trend: 'up' | 'down' | 'neutral' }) {
  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    neutral: 'text-slate-400',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <span className="text-slate-300">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      <div className="flex items-center gap-1.5 mt-2">
        {trend === 'up' && <ArrowUpRight size={14} className="text-emerald-500" />}
        <span className={`text-xs font-semibold ${trendColors[trend]}`}>{sub}</span>
      </div>
    </div>
  );
}

function ActionRow({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-left group">
      <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

function ChannelRow({ name, status }: { name: string; status: 'connected' | 'connecting' | 'disconnected' }) {
  const config = {
    connected: { dot: 'bg-emerald-500', label: 'Synced', text: 'text-emerald-600' },
    connecting: { dot: 'bg-amber-400', label: 'Connecting...', text: 'text-amber-600' },
    disconnected: { dot: 'bg-slate-300', label: 'Inactive', text: 'text-slate-400' },
  };
  const c = config[status];
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${c.dot} ring-2 ring-offset-1 ring-offset-white ${status === 'connected' ? 'ring-emerald-100' : status === 'connecting' ? 'ring-amber-100' : 'ring-slate-100'}`} />
        <span className="text-sm font-semibold text-slate-700">{name}</span>
      </div>
      <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
    </div>
  );
}

function TableSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-9 h-9 bg-slate-100 rounded-lg" />
          <div className="flex-1 h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-3 bg-slate-100 rounded w-20" />
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-3 bg-slate-100 rounded w-12" />
        </div>
      ))}
    </div>
  );
}
