import { Property, Booking } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    owner_id: 'owner_1',
    name: 'Metropolitan Loft',
    description: 'A sleek, industrial loft in the heart of downtown. High ceilings and panoramic city views.',
    images: ['https://picsum.photos/seed/loft/800/600'],
    base_price: 245,
    cleaning_fee: 75,
    ota_links: {
      airbnb: 'https://airbnb.com/rooms/1',
      vrbo: 'https://vrbo.com/1'
    },
    amenities: ['WiFi', 'Kitchen', 'Workspace', 'Gym'],
    location: {
      address: '123 Main St',
      city: 'Fort Lauderdale',
      state: 'FL',
      country: 'USA',
      zip: '33301'
    },
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_2',
    owner_id: 'owner_1',
    name: 'Serene Garden Cottage',
    description: 'Charming cottage surrounded by lush greenery. Perfect for a quiet weekend getaway.',
    images: ['https://picsum.photos/seed/cottage/800/600'],
    base_price: 180,
    cleaning_fee: 50,
    ota_links: {
      airbnb: 'https://airbnb.com/rooms/2'
    },
    amenities: ['WiFi', 'Garden', 'Parking', 'Fireplace'],
    location: {
      address: '456 Oak Lane',
      city: 'Fort Lauderdale',
      state: 'FL',
      country: 'USA',
      zip: '33304'
    },
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    status: 'active',
    created_at: new Date().toISOString()
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book_1',
    property_id: 'prop_1',
    owner_id: 'owner_1',
    guest_email: 'guest@example.com',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    nights: 3,
    base_total: 735,
    cleaning_fee: 75,
    platform_fee_savings: 150,
    pay_now_discount: 0,
    total_price: 660,
    status: 'confirmed',
    source: 'direct',
    payment_status: 'paid',
    created_at: new Date().toISOString()
  }
];
