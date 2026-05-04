import { supabase } from '../lib/supabase';
import type { Property, Booking, OwnerProfile, ComparisonData } from '../types';
import { MOCK_PROPERTIES } from '../constants';

const DEMO_OWNER: OwnerProfile = {
  id: 'demo',
  email: 'demo@floorstay.co',
  full_name: 'FloorStay Demo',
  business_name: 'FloorStay Network',
  slug: 'quantum-hospitality',
  status: 'active',
  commission_rate: 0,
  created_at: new Date().toISOString()
};

function isDemoMode(): boolean {
  const url = (supabase as any)?.supabaseUrl || '';
  return !url || url === 'undefined' || url.includes('placeholder') || url.includes('your-project');
}

function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

// ==========================================
// PROPERTIES
// ==========================================
export async function getAllProperties(): Promise<Property[]> {
  if (isDemoMode()) return MOCK_PROPERTIES;
  const { data, error } = await supabase
    .from('properties').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Property[];
}

export async function getPropertiesByOwner(ownerId: string): Promise<Property[]> {
  if (isDemoMode()) return MOCK_PROPERTIES.filter(p => p.owner_id === ownerId);
  const { data, error } = await supabase
    .from('properties').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (isDemoMode()) return MOCK_PROPERTIES.find(p => p.id === id) || null;
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error) return null;
  return data as Property;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (isDemoMode()) return MOCK_PROPERTIES.find(p => p.name.toLowerCase().replace(/ /g, '-') === slug) || null;
  const { data, error } = await supabase
    .from('properties').select('*')
    .ilike('name', `%${slug.replace(/-/g, ' ')}%`)
    .eq('status', 'active').limit(1).single();
  if (error) return null;
  return data as Property;
}

// ==========================================
// OWNERS / STOREFRONTS
// ==========================================
export async function getStorefrontBySlug(slug: string): Promise<{ owner: OwnerProfile; properties: Property[] } | null> {
  if (isDemoMode()) {
    return {
      owner: { ...DEMO_OWNER, slug, business_name: slug.replace(/-/g, ' ') },
      properties: MOCK_PROPERTIES
    };
  }
  const { data: owner, error: ownerError } = await supabase
    .from('owners').select('*').eq('slug', slug).eq('status', 'active').single();
  if (ownerError || !owner) return null;
  const ownerProfile = owner as unknown as OwnerProfile;
  const { data: properties } = await supabase
    .from('properties').select('*').eq('owner_id', ownerProfile.id).eq('status', 'active');
  return { owner: ownerProfile, properties: (properties || []) as Property[] };
}

// ==========================================
// BOOKINGS
// ==========================================
export async function createBooking(booking: any): Promise<Booking> {
  if (isDemoMode()) {
    return { id: 'demo-' + Date.now(), ...booking, created_at: new Date().toISOString() } as Booking;
  }
  const { data, error } = await supabase.from('bookings').insert(booking).select().single();
  if (error) throw error;
  return data as Booking;
}

export async function getBookingsByOwner(ownerId: string): Promise<Booking[]> {
  if (isDemoMode()) return [];
  const { data, error } = await supabase
    .from('bookings').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Booking[];
}

// ==========================================
// OTA PRICE COMPARISON
// ==========================================
export async function getOtaComparison(propertyId: string, nights = 1): Promise<ComparisonData> {
  try {
    const res = await fetch('/api/ota-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, nights })
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    const property = isDemoMode()
      ? MOCK_PROPERTIES.find(p => p.id === propertyId)
      : (await supabase.from('properties').select('base_price').eq('id', propertyId).single()).data;
    const base = (property as any)?.base_price ?? 245;
    const airbnbFee = Math.round(base * 0.20);
    const vrboFee = Math.round(base * 0.15);
    return {
      direct: base,
      directTotal: base * nights,
      airbnb: base + airbnbFee,
      airbnbTotal: (base + airbnbFee) * nights,
      airbnbFees: airbnbFee * nights,
      vrbo: base + vrboFee,
      vrboTotal: (base + vrboFee) * nights,
      vrboFees: vrboFee * nights,
      savings: Math.max(airbnbFee, vrboFee) * nights,
      nights
    };
  }
}

// ==========================================
// SYNC LOGS
// ==========================================
export async function getSyncLogs(propertyId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('sync_logs').select('*').eq('property_id', propertyId).order('timestamp', { ascending: false }).limit(10);
  if (error) throw error;
  return data || [];
}
