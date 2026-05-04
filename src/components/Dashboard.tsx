import { DollarSign, Building2, TrendingUp, Calendar, Users, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Property } from '../types';
import { getAllProperties } from '../services/propertyService';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];

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

  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Estimated Revenue" value="$0" change="+0%" icon={<DollarSign size={16} />} neutral />
        <KpiCard label="Active Properties" value={String(activeCount)} change="Real-time" icon={<Building2 size={16} />} neutral />
        <KpiCard label="Avg Nightly Rate" value={`$${avgRate}`} change={`Across ${activeCount} unit${activeCount === 1 ? '' : 's'}`} icon={<TrendingUp size={16} />} neutral />
        <KpiCard label="Direct Bookings" value="0" change="Data available on connect" icon={<Calendar size={16} />} neutral />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <ChartCard title="Revenue Overview">
            <div className="flex items-end gap-3 h-48 px-4">
              {[0,0,0,0,0,0].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: `${20 + i * 15}px` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-blue-600 rounded-t-md opacity-30" style={{ height: `${10 + i * 8}px` }} />
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Properties Table */}
          <Card title="Active Properties" action="View All">
            {loading ? (
              <table className="w-full text-left"><tbody><TableSkeleton rows={4} cols={5} /></tbody></table>
            ) : properties.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">No properties yet. Add your first property.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Property</th>
                      <th className="py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Location</th>
                      <th className="py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Beds/Baths</th>
                      <th className="py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Rate</th>
                      <th className="py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {properties.slice(0, 6).map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                            <span className="font-medium text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{p.location.city}, {p.location.state}</td>
                        <td className="py-3 px-4 text-gray-500">{p.bedrooms}BR / {p.bathrooms}BA</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">${p.base_price}/night</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400"><MoreHorizontal size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <ActionRow label="Add New Property" desc="List a new rental on your storefront" />
              <ActionRow label="View Storefront" desc="Preview your public listing page" />
              <ActionRow label="Sync Calendars" desc="Pull availability from Airbnb & VRBO" />
            </div>
          </Card>

          {/* Channel Status */}
          <Card title="Channel Sync">
            <div className="space-y-3">
              <ChannelRow name="Airbnb" status="connected" />
              <ChannelRow name="VRBO" status="connected" />
              <ChannelRow name="Booking.com" status="connecting" />
            </div>
          </Card>

          {/* Empty State Helper */}
          <div className="bg-gray-100 rounded-lg p-5 text-center">
            <Users size={24} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700">No bookings yet</p>
            <p className="text-xs text-gray-500 mt-1">Bookings will appear here once guests start reserving.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UI Primitives ──────────────────────────────────────────────

function KpiCard({ label, value, change, icon, neutral }: { label: string; value: string; change: string; icon: React.ReactNode; neutral?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1.5 ${neutral ? 'text-gray-400' : 'text-green-600'}`}>
        {neutral ? null : <ArrowUpRight size={12} />}
        {change}
      </span>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        {action && (
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700">{action}</button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="font-semibold text-sm text-gray-900 mb-6">{title}</h3>
      {children}
    </div>
  );
}

function ActionRow({ label, desc }: { label: string; desc: string }) {
  return (
    <button className="w-full text-left px-3.5 py-3 rounded-md hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </button>
  );
}

function ChannelRow({ name, status }: { name: string; status: 'connected' | 'connecting' | 'disconnected' }) {
  const colors = {
    connected: 'bg-green-500',
    connecting: 'bg-amber-400',
    disconnected: 'bg-gray-300',
  };
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
      <span className="text-xs text-gray-400">
        {status === 'connected' ? 'Synced' : status === 'connecting' ? 'Connecting...' : 'Inactive'}
      </span>
    </div>
  );
}

function TableSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="py-3 px-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}
