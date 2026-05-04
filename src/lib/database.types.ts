export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      owners: {
        Row: {
          id: string;
          auth_id: string | null;
          email: string;
          full_name: string;
          business_name: string | null;
          slug: string | null;
          logo_url: string | null;
          primary_color: string | null;
          headline: string | null;
          knowledge_base: string | null;
          commission_rate: number;
          phone: string | null;
          status: 'active' | 'pending' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['owners']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['owners']['Insert']>;
      };
      properties: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          images: string[];
          base_price: number;
          cleaning_fee: number;
          ota_links: { airbnb?: string; vrbo?: string; booking_com?: string };
          amenities: string[];
          location: { address: string; city: string; state: string; country: string; zip?: string; lat?: number; lng?: number };
          bedrooms: number;
          bathrooms: number;
          max_guests: number;
          status: 'active' | 'hidden' | 'maintenance';
          ical_urls: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          property_id: string;
          owner_id: string;
          guest_email: string;
          guest_name: string | null;
          guest_phone: string | null;
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
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      ota_price_cache: {
        Row: {
          id: string;
          property_id: string;
          ota: 'airbnb' | 'vrbo' | 'booking_com';
          price: number;
          fees: number;
          total: number;
          last_fetched: string;
        };
        Insert: Omit<Database['public']['Tables']['ota_price_cache']['Row'], 'id' | 'last_fetched'> & { id?: string; last_fetched?: string };
        Update: Partial<Database['public']['Tables']['ota_price_cache']['Insert']>;
      };
      sync_logs: {
        Row: {
          id: string;
          property_id: string;
          channel: string;
          status: 'success' | 'failure';
          message: string | null;
          timestamp: string;
        };
        Insert: Omit<Database['public']['Tables']['sync_logs']['Row'], 'id' | 'timestamp'> & { id?: string; timestamp?: string };
        Update: Partial<Database['public']['Tables']['sync_logs']['Insert']>;
      };
    };
  };
}
