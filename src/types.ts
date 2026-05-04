export enum UserRole {
  OWNER = 'owner',
  GUEST = 'guest',
  ADMIN = 'admin',
}

export interface OwnerProfile {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
  headline?: string;
  knowledge_base?: string;
  commission_rate: number;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  images: string[];
  base_price: number;
  cleaning_fee?: number;
  ota_links: {
    airbnb?: string;
    vrbo?: string;
    booking_com?: string;
  };
  amenities: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  status: 'active' | 'hidden' | 'maintenance';
  ical_urls?: string[];
  created_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  guest_email: string;
  guest_name?: string;
  guest_phone?: string;
  start_date: string;
  end_date: string;
  nights: number;
  base_total: number;
  cleaning_fee: number;
  platform_fee_savings: number;
  pay_now_discount: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  source: 'direct' | 'airbnb' | 'vrbo' | 'booking_com' | 'referral';
  payment_status: 'pending' | 'paid' | 'deposit' | 'refunded';
  notes?: string;
  created_at: string;
}

export interface OtaPriceCache {
  property_id: string;
  ota: 'airbnb' | 'vrbo' | 'booking_com';
  price: number;
  fees: number;
  total: number;
  last_fetched: string;
}

export interface SyncLog {
  property_id: string;
  channel: string;
  status: 'success' | 'failure';
  message: string;
  timestamp: string;
}

export type ComparisonData = {
  direct: number;
  directTotal: number;
  airbnb: number;
  airbnbTotal: number;
  airbnbFees: number;
  vrbo: number;
  vrboTotal: number;
  vrboFees: number;
  savings: number;
  nights: number;
};

// ─── HOUSEKEEPING & OPERATIONS ────────────────────────────────────

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Housekeeper {
  id: string;
  name: string;
  role: 'lead' | 'standard' | 'deep_clean';
  phone: string;
  rate_per_hour: number;
  assigned_property_ids: string[];
  active: boolean;
}

export interface CleaningSchedule {
  id: string;
  property_id: string;
  type: 'checkout_turn' | 'mid_stay' | 'deep_clean' | 'linen_swap';
  scheduled_date: string;
  duration_min: number;
  staff_count: number;
  estimated_cost: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  notes?: string;
}

export interface Expense {
  id: string;
  property_id: string;
  category:
    | 'cleaning_labor'
    | 'cleaning_supplies'
    | 'maintenance'
    | 'utilities'
    | 'amenities'
    | 'inspection'
    | 'other';
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
}

export interface PropertyOpsSummary {
  property_id: string;
  week_start: string;
  // Staffing
  cleaners_needed: number;
  cleaners_scheduled: number;
  // Financial
  labor_cost: number;
  supply_cost: number;
  maintenance_cost: number;
  utilities_cost: number;
  total_ops_cost: number;
  // Operational
  cleanliness_score: number; // 0-100
  issues_open: number;
  last_serviced_date: string;
  next_turnover_date: string;
}
