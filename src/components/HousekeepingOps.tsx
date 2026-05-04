import { useState } from 'react';
import {
  Users, Wrench, Droplets, Sparkles, Calendar, DollarSign, AlertTriangle,
  CheckCircle2, Clock, ChevronDown, Plus, Trash2, TrendingUp, TrendingDown,
  Minus, Search, Filter, ArrowUpRight
} from 'lucide-react';
import type { Property, Housekeeper, CleaningSchedule, Expense, PropertyOpsSummary } from '../types';

/* ─── MOCK DATA ───────────────────────────────────────────────── */

const MOCK_HOUSEKEEPERS: Housekeeper[] = [
  { id: 'hk_1', name: 'Maria Gonzalez', role: 'lead', phone: '(954) 111-2233', rate_per_hour: 22, assigned_property_ids: ['prop_1','prop_3','prop_8'], active: true },
  { id: 'hk_2', name: 'Carlos Ruiz', role: 'standard', phone: '(954) 444-5566', rate_per_hour: 18, assigned_property_ids: ['prop_2','prop_6','prop_7'], active: true },
  { id: 'hk_3', name: 'Diana Lopez', role: 'deep_clean', phone: '(954) 777-8899', rate_per_hour: 25, assigned_property_ids: ['prop_4','prop_5'], active: true },
  { id: 'hk_4', name: 'Jose Martinez', role: 'standard', phone: '(954) 000-1122', rate_per_hour: 18, assigned_property_ids: ['prop_1','prop_2'], active: false },
];

const MOCK_SCHEDULES: CleaningSchedule[] = [
  { id: 'sch_1', property_id: 'prop_1', type: 'checkout_turn', scheduled_date: '2026-05-05', duration_min: 90, staff_count: 2, estimated_cost: 66, status: 'scheduled' },
  { id: 'sch_2', property_id: 'prop_2', type: 'mid_stay', scheduled_date: '2026-05-06', duration_min: 45, staff_count: 1, estimated_cost: 18, status: 'scheduled' },
  { id: 'sch_3', property_id: 'prop_3', type: 'deep_clean', scheduled_date: '2026-05-04', duration_min: 180, staff_count: 2, estimated_cost: 75, status: 'completed' },
  { id: 'sch_4', property_id: 'prop_5', type: 'checkout_turn', scheduled_date: '2026-05-07', duration_min: 120, staff_count: 2, estimated_cost: 84, status: 'scheduled' },
  { id: 'sch_5', property_id: 'prop_6', type: 'linen_swap', scheduled_date: '2026-05-05', duration_min: 30, staff_count: 1, estimated_cost: 13.5, status: 'scheduled' },
  { id: 'sch_6', property_id: 'prop_1', type: 'mid_stay', scheduled_date: '2026-05-08', duration_min: 60, staff_count: 1, estimated_cost: 22, status: 'scheduled' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'exp_1', property_id: 'prop_1', category: 'cleaning_labor', amount: 440, description: 'Weekly cleaning labor (5 turns)', date: '2026-05-01', recurring: true },
  { id: 'exp_2', property_id: 'prop_1', category: 'cleaning_supplies', amount: 85, description: 'Detergent, bleach, trash bags, PPE', date: '2026-05-01', recurring: true },
  { id: 'exp_3', property_id: 'prop_1', category: 'maintenance', amount: 120, description: 'Plumbing fix - guest bathroom', date: '2026-04-28', recurring: false },
  { id: 'exp_4', property_id: 'prop_2', category: 'cleaning_labor', amount: 520, description: 'Weekly cleaning labor (6 turns)', date: '2026-05-01', recurring: true },
  { id: 'exp_5', property_id: 'prop_2', category: 'utilities', amount: 210, description: 'Electric + water', date: '2026-05-01', recurring: true },
  { id: 'exp_6', property_id: 'prop_3', category: 'cleaning_labor', amount: 310, description: 'Weekly cleaning labor (4 turns)', date: '2026-05-01', recurring: true },
  { id: 'exp_7', property_id: 'prop_5', category: 'amenities', amount: 65, description: 'Toiletries, coffee pods, soap', date: '2026-05-02', recurring: true },
  { id: 'exp_8', property_id: 'prop_6', category: 'maintenance', amount: 340, description: 'AC compressor repair', date: '2026-04-25', recurring: false },
  { id: 'exp_9', property_id: 'prop_7', category: 'inspection', amount: 45, description: 'Monthly walkthrough inspection', date: '2026-05-01', recurring: true },
  { id: 'exp_10', property_id: 'prop_8', category: 'cleaning_labor', amount: 380, description: 'Weekly cleaning labor (4 turns)', date: '2026-05-01', recurring: true },
];

const OPS_SUMMARIES: Record<string, PropertyOpsSummary> = {
  prop_1: { property_id:'prop_1', week_start:'2026-05-04', cleaners_needed:3, cleaners_scheduled:3, labor_cost:440, supply_cost:85, maintenance_cost:120, utilities_cost:180, total_ops_cost:825, cleanliness_score:94, issues_open:1, last_serviced_date:'2026-05-03', next_turnover_date:'2026-05-05' },
  prop_2: { property_id:'prop_2', week_start:'2026-05-04', cleaners_needed:4, cleaners_scheduled:4, labor_cost:520, supply_cost:110, maintenance_cost:0, utilities_cost:210, total_ops_cost:840, cleanliness_score:91, issues_open:0, last_serviced_date:'2026-05-03', next_turnover_date:'2026-05-06' },
  prop_3: { property_id:'prop_3', week_start:'2026-05-04', cleaners_needed:2, cleaners_scheduled:2, labor_cost:310, supply_cost:65, maintenance_cost:0, utilities_cost:140, total_ops_cost:515, cleanliness_score:97, issues_open:0, last_serviced_date:'2026-05-04', next_turnover_date:'2026-05-07' },
  prop_4: { property_id:'prop_4', week_start:'2026-05-04', cleaners_needed:2, cleaners_scheduled:2, labor_cost:280, supply_cost:55, maintenance_cost:0, utilities_cost:120, total_ops_cost:455, cleanliness_score:89, issues_open:1, last_serviced_date:'2026-05-02', next_turnover_date:'2026-05-08' },
  prop_5: { property_id:'prop_5', week_start:'2026-05-04', cleaners_needed:2, cleaners_scheduled:2, labor_cost:390, supply_cost:95, maintenance_cost:0, utilities_cost:220, total_ops_cost:705, cleanliness_score:96, issues_open:0, last_serviced_date:'2026-05-03', next_turnover_date:'2026-05-07' },
  prop_6: { property_id:'prop_6', week_start:'2026-05-04', cleaners_needed:3, cleaners_scheduled:3, labor_cost:420, supply_cost:90, maintenance_cost:340, utilities_cost:175, total_ops_cost:1025, cleanliness_score:88, issues_open:2, last_serviced_date:'2026-05-02', next_turnover_date:'2026-05-09' },
  prop_7: { property_id:'prop_7', week_start:'2026-05-04', cleaners_needed:4, cleaners_scheduled:4, labor_cost:580, supply_cost:130, maintenance_cost:0, utilities_cost:240, total_ops_cost:950, cleanliness_score:85, issues_open:1, last_serviced_date:'2026-05-03', next_turnover_date:'2026-05-06' },
  prop_8: { property_id:'prop_8', week_start:'2026-05-04', cleaners_needed:2, cleaners_scheduled:2, labor_cost:380, supply_cost:80, maintenance_cost:0, utilities_cost:190, total_ops_cost:650, cleanliness_score:93, issues_open:0, last_serviced_date:'2026-05-03', next_turnover_date:'2026-05-08' },
};

/* ─── UTILS ─────────────────────────────────────────────────────── */

const typeLabel: Record<CleaningSchedule['type'], string> = {
  checkout_turn: 'Checkout Turn',
  mid_stay: 'Mid-Stay Refresh',
  deep_clean: 'Deep Clean',
  linen_swap: 'Linen Swap',
};

const typeColor: Record<CleaningSchedule['type'], string> = {
  checkout_turn: 'bg-rose-50 text-rose-700 ring-rose-100',
  mid_stay: 'bg-sky-50 text-sky-700 ring-sky-100',
  deep_clean: 'bg-violet-50 text-violet-700 ring-violet-100',
  linen_swap: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

const statusBadge = (s: CleaningSchedule['status']) => {
  const map: Record<string, string> = {
    scheduled: 'bg-slate-100 text-slate-600',
    'in_progress': 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
    missed: 'bg-red-50 text-red-700',
  };
  return map[s] || map.scheduled;
};

const categoryLabel: Record<Expense['category'], string> = {
  cleaning_labor: 'Cleaning Labor',
  cleaning_supplies: 'Supplies',
  maintenance: 'Maintenance',
  utilities: 'Utilities',
  amenities: 'Amenities',
  inspection: 'Inspection',
  other: 'Other',
};

const categoryIcon = (c: Expense['category']) => {
  switch (c) {
    case 'cleaning_labor': return <Users size={14} />;
    case 'cleaning_supplies': return <Sparkles size={14} />;
    case 'maintenance': return <Wrench size={14} />;
    case 'utilities': return <Droplets size={14} />;
    case 'amenities': return <CheckCircle2 size={14} />;
    case 'inspection': return <Search size={14} />;
    default: return <Minus size={14} />;
  }
};

const weekTotal = (propId: string) => {
  const s = OPS_SUMMARIES[propId];
  if (!s) return null;
  return {
    labor: s.labor_cost,
    supplies: s.supply_cost,
    maint: s.maintenance_cost,
    utils: s.utilities_cost,
    total: s.total_ops_cost,
  };
};

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */

export default function HousekeepingOps({ properties }: { properties: Property[] }) {
  const [tab, setTab] = useState<'staff' | 'schedule' | 'expenses' | 'status'>('status');
  const [selectedProp, setSelectedProp] = useState<string>(properties[0]?.id || 'prop_1');
  const [search, setSearch] = useState('');

  const selectedProperty = properties.find(p => p.id === selectedProp);

  return (
    <div className="space-y-5">
      {/* Header + Property selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Housekeeping & Operations</h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedProp}
            onChange={e => setSelectedProp(e.target.value)}
            className="appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 text-sm font-medium outline-none cursor-pointer"
          >
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.location.city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Weekly Labor Cost" value={`$${weekTotal(selectedProp)?.labor || 0}`} icon=<Users size={16} /> tone="indigo" />
        <Kpi label="Supplies" value={`$${weekTotal(selectedProp)?.supplies || 0}`} icon=<Sparkles size={16} /> tone="emerald" />
        <Kpi label="Maintenance" value={`$${weekTotal(selectedProp)?.maint || 0}`} icon=<Wrench size={16} /> tone="amber" />
        <Kpi label="Total Ops Cost" value={`$${weekTotal(selectedProp)?.total || 0}`} icon=<DollarSign size={16} /> tone="rose" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {([
          { k: 'status', label: 'Unit Status' },
          { k: 'staff', label: 'Staff' },
          { k: 'schedule', label: 'Schedule' },
          { k: 'expenses', label: 'Expenses' },
        ] as const).map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'status' && <UnitStatusTab propId={selectedProp} property={selectedProperty} />}
      {tab === 'staff' && <StaffTab />}
      {tab === 'schedule' && <ScheduleTab propId={selectedProp} />}
      {tab === 'expenses' && <ExpensesTab propId={selectedProp} />}
    </div>
  );
}

/* ─── UNIT STATUS TAB ──────────────────────────────────────────── */

function UnitStatusTab({ propId, property }: { propId: string; property?: Property }) {
  const s = OPS_SUMMARIES[propId];
  if (!s || !property) return <div className="text-slate-400 text-sm py-8 text-center">No data for this unit.</div>;

  const revenue = property.base_price * 7; // rough weekly revenue
  const margin = ((revenue - s.total_ops_cost) / revenue * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Financial Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Weekly Financials</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${parseFloat(margin) > 30 ? 'bg-emerald-50 text-emerald-700' : parseFloat(margin) > 15 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
            {margin}% margin
          </span>
        </div>

        <div className="space-y-3">
          <Bar label="Labor" amount={s.labor_cost} total={s.total_ops_cost} color="bg-indigo-500" />
          <Bar label="Supplies" amount={s.supply_cost} total={s.total_ops_cost} color="bg-emerald-500" />
          <Bar label="Maintenance" amount={s.maintenance_cost} total={s.total_ops_cost} color="bg-amber-500" />
          <Bar label="Utilities" amount={s.utilities_cost} total={s.total_ops_cost} color="bg-sky-500" />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Total Ops Cost</span>
          <span className="text-lg font-extrabold text-slate-900">${s.total_ops_cost}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Est. Weekly Revenue</span>
          <span className="text-sm font-bold text-slate-900">${revenue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Est. Net</span>
          <span className={`text-sm font-bold ${revenue - s.total_ops_cost >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${revenue - s.total_ops_cost}
          </span>
        </div>
      </div>

      {/* Operational Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Operational Status</h3>

        <div className="grid grid-cols-2 gap-3">
          <StatBox label="Cleanliness Score" value={`${s.cleanliness_score}`} suffix="/100" good={s.cleanliness_score >= 90} />
          <StatBox label="Issues Open" value={`${s.issues_open}`} suffix="" good={s.issues_open === 0} />
          <StatBox label="Cleaners Needed" value={`${s.cleaners_needed}`} suffix="" good={true} />
          <StatBox label="Cleaners Scheduled" value={`${s.cleaners_scheduled}`} suffix="" good={s.cleaners_scheduled >= s.cleaners_needed} />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Last Serviced</span>
            <span className="font-semibold text-slate-900">{s.last_serviced_date}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Next Turnover</span>
            <span className="font-semibold text-slate-900">{s.next_turnover_date}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Property Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
              <CheckCircle2 size={12} /> Active
            </span>
          </div>
        </div>
      </div>

      {/* Issues / Alerts */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Alerts & Issues</h3>
        {s.issues_open === 0 ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold py-2">
            <CheckCircle2 size={16} /> No open issues. Unit is operationally healthy.
          </div>
        ) : (
          <div className="space-y-2">
            <IssueRow severity="medium" text="Deep clean overdue — last full clean was 10 days ago" />
            {s.issues_open > 1 && <IssueRow severity="low" text="Inventory check: 2 towel sets missing from unit" />}
          </div>
        )}

        <div className="pt-2">
          <button className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
            + Log New Issue
          </button>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = total > 0 ? (amount / total * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">${amount} <span className="text-slate-400 font-normal">({pct.toFixed(0)}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatBox({ label, value, suffix, good }: { label: string; value: string; suffix: string; good: boolean }) {
  return (
    <div className={`rounded-xl p-3 border ${good ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'}`}>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-extrabold text-slate-900">
        {value}<span className="text-sm font-medium text-slate-400">{suffix}</span>
      </p>
    </div>
  );
}

function IssueRow({ severity, text }: { severity: 'low' | 'medium' | 'high'; text: string }) {
  const colors = { low: 'bg-amber-50 text-amber-700 border-amber-100', medium: 'bg-orange-50 text-orange-700 border-orange-100', high: 'bg-red-50 text-red-700 border-red-100' };
  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${colors[severity]}`}>
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

/* ─── STAFF TAB ────────────────────────────────────────────────── */

function StaffTab() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900">Housekeeping Team</h3>
        <button className="text-xs font-bold text-teal-700 hover:text-teal-800">+ Add Housekeeper</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-3 px-5 text-left font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-left font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Rate</th>
              <th className="py-3 px-4 text-left font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Assigned Units</th>
              <th className="py-3 px-4 text-left font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_HOUSEKEEPERS.map(h => (
              <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-5">
                  <div className="font-semibold text-slate-900">{h.name}</div>
                  <div className="text-xs text-slate-400">{h.phone}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                    {h.role === 'lead' && <Users size={10} />}
                    {h.role === 'deep_clean' && <Sparkles size={10} />}
                    {h.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">${h.rate_per_hour}/hr</td>
                <td className="py-3 px-4 text-slate-500">{h.assigned_property_ids.length} units</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${h.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {h.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── SCHEDULE TAB ─────────────────────────────────────────────── */

function ScheduleTab({ propId }: { propId: string }) {
  const filtered = MOCK_SCHEDULES.filter(s => s.property_id === propId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900">Cleaning Schedule</h3>
        <button className="text-xs font-bold text-teal-700 hover:text-teal-800">+ Add Task</button>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">No scheduled tasks for this unit.</div>
      ) : (
        <div className="divide-y divide-slate-50">
          {filtered.map(s => (
            <div key={s.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColor[s.type]}`}>
                  {s.type === 'checkout_turn' && <Clock size={16} />}
                  {s.type === 'mid_stay' && <Sparkles size={16} />}
                  {s.type === 'deep_clean' && <Droplets size={16} />}
                  {s.type === 'linen_swap' && <CheckCircle2 size={16} />}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{typeLabel[s.type]}</div>
                  <div className="text-xs text-slate-400">
                    {s.scheduled_date} · {s.duration_min} min · {s.staff_count} staff · est. ${s.estimated_cost}
                  </div>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-1 rounded ${statusBadge(s.status)}`}>
                {s.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── EXPENSES TAB ─────────────────────────────────────────────── */

function ExpensesTab({ propId }: { propId: string }) {
  const filtered = MOCK_EXPENSES.filter(e => e.property_id === propId);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Total Weekly Expenses</p>
          <p className="text-2xl font-extrabold text-slate-900">${total}</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5">
          <Plus size={14} /> Log Expense
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Expense Log</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">No expenses logged for this unit.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(e => (
              <div key={e.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    {categoryIcon(e.category)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{e.description}</div>
                    <div className="text-xs text-slate-400">
                      {categoryLabel[e.category]} · {e.date} {e.recurring && <span className="text-teal-600 font-medium">· Recurring</span>}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-sm text-slate-900">${e.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── KPI PRIMITIVE ────────────────────────────────────────────── */

function Kpi({ label, value, icon, tone }: { label: string; value: string; icon: any; tone: string }) {
  const toneMap: Record<string, string> = {
    indigo: 'text-indigo-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    rose: 'text-rose-500',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className={toneMap[tone]}>{icon}</span>
      </div>
      <p className="text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
