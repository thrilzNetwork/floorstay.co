import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { OwnerProfile } from '../types';

interface AuthContextType {
  user: OwnerProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, businessName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<OwnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = user?.email === 'ales@quantumhospitality.co';

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadOwnerProfile(data.session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadOwnerProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadOwnerProfile(authId: string) {
    const { data } = await supabase
      .from('owners')
      .select('*')
      .eq('auth_id', authId)
      .single();
    
    if (data) {
      setUser(data as OwnerProfile);
    }
    setIsLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(email: string, password: string, fullName: string, businessName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    if (data.user) {
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await supabase.from('owners').insert({
        auth_id: data.user.id,
        email,
        full_name: fullName,
        business_name: businessName,
        slug,
        status: 'pending'
      });
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
