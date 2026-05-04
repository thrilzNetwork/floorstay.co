import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Bed, Bath, Users, ChevronRight, MoreHorizontal, Plus, Filter } from 'lucide-react';
import type { Property } from '../types';
import { getAllProperties } from '../services/propertyService';
import CheckoutModal from './CheckoutModal';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    getAllProperties().then(p => { setProperties(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-gray-500">
            <Filter size={16} />
          </button>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} properties</span>
      </div>

      {/* Empty */}
      {filtered.length === 0 && !loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-md mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">No properties found</p>
          <p className="text-xs text-gray-500 mt-1">Try adjusting your search or add a new property.</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Property', 'Location', 'Details', 'Rate', 'Status', ''].map(h => (
                  <th key={h} className="py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-11 h-11 rounded-md object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.location.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={13} />
                      <span>{p.location.city}, {p.location.state}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4 text-gray-600 text-xs">
                      <div className="flex items-center gap-1"><Bed size={13} /> {p.bedrooms}</div>
                      <div className="flex items-center gap-1"><Bath size={13} /> {p.bathrooms}</div>
                      <div className="flex items-center gap-1"><Users size={13} /> {p.max_guests}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">${p.base_price}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <CheckoutModal property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
