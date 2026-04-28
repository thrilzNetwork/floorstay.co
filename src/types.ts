export enum UserRole {
  OWNER = 'owner',
  GUEST = 'guest'
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  merchantProfile?: {
    businessName: string;
    logoUrl?: string;
    subdomain?: string;
  };
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  otaLinks: {
    airbnb?: string;
    vrbo?: string;
  };
  amenities: string[];
  location: {
    address: string;
    city: string;
    country: string;
  };
  status: 'active' | 'hidden';
}

export interface Booking {
  id: string;
  propertyId: string;
  ownerId: string;
  guestId?: string;
  guestEmail: string;
  startDate: any; // Firestore Timestamp
  endDate: any;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'direct' | 'airbnb' | 'vrbo';
}

export interface ComparisonData {
  direct: number;
  airbnb: number;
  vrbo: number;
  savings: number;
}
