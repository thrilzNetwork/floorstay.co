import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Vite injects env vars at build time
// @ts-ignore
const supabaseUrl: string = import.meta.env?.VITE_SUPABASE_URL || '';
// @ts-ignore
const supabaseAnonKey: string = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables — using demo mode');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
