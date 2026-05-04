import { useState } from 'react';
import { ChevronRight, BarChart3 } from 'lucide-react';

export default function StorefrontSettings() {
  const [slug, setSlug] = useState('quantum-hospitality');
  const [headline, setHeadline] = useState('Premium Fort Lauderdale Stays for Crew & Travelers');
  const [kb, setKb] = useState(
    'We specialize in housing airline crews, yacht crews, and traveling professionals in Fort Lauderdale. All properties are fully furnished with high-speed WiFi, workspaces, and fully equipped kitchens. Check-in is self-service via smart lock. Quiet hours 10PM-6AM. No smoking indoors. Pet-friendly properties available upon request.'
  );

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white rounded-3xl border border-[#141414]/10 p-8 space-y-6">
        <h3 className="text-xl font-medium tracking-tight">Direct Booking Storefront</h3>
        <p className="text-sm text-gray-500 font-serif italic">Configure how your brand appears to guests when they book direct.</p>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Custom URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-mono">floorstay.co/s/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-white border border-[#141414]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Hero Headline</label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-white border border-[#141414]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Tenant Knowledge Base (AI Memory)</label>
            <textarea
              value={kb}
              onChange={(e) => {
                setKb(e.target.value);
                (window as any).merchantKB = e.target.value;
              }}
              rows={4}
              placeholder="e.g. Our brand voice is professional and welcoming..."
              className="w-full bg-white border border-[#141414]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]/20 resize-none"
            />
            <p className="text-[10px] text-gray-400 font-serif italic">The AI Agent learns from this text to represent your brand accurately.</p>
          </div>

          <div className="pt-6 flex gap-4">
            <button className="bg-[#141414] text-white px-6 py-2 rounded-full text-sm font-bold active:scale-95 transition-transform">
              Save Strategy
            </button>
            <a
              href={`/s/${slug}`}
              target="_blank"
              className="flex items-center gap-2 border border-[#141414]/10 px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-50 active:scale-95 transition-transform"
            >
              Preview Live <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#141414] text-white rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-400" />
          <h4 className="font-bold text-xs tracking-widest uppercase">SEO Impact</h4>
        </div>
        <p className="text-gray-400 text-sm italic font-serif">
          Your current storefront slug <span className="text-white font-mono">/s/{slug}</span> targets Fort Lauderdale
          crew housing keywords. The price comparison engine increases direct booking visibility.
        </p>
      </div>
    </div>
  );
}
