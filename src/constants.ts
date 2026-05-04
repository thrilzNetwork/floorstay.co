import { Property, Booking } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    owner_id: 'owner_1',
    name: 'Metropolitan Loft',
    description: 'A sleek, industrial loft in the heart of downtown Fort Lauderdale. High ceilings and panoramic city views. Perfect for yacht crew between contracts.',
    images: [
      'https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=800&h=600&fit=crop&sat=-100',
      'https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 245,
    cleaning_fee: 75,
    ota_links: { airbnb: 'https://airbnb.com/rooms/1', vrbo: 'https://vrbo.com/1' },
    amenities: ['WiFi', 'Kitchen', 'Workspace', 'Gym', 'Parking', 'Laundry', 'Pool', 'Air Conditioning'],
    location: { address: '123 SE 3rd Ave', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33301', lat: 26.1224, lng: -80.1373 },
    bedrooms: 2, bathrooms: 2, max_guests: 4, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_2',
    owner_id: 'owner_1',
    name: 'Riverside Crew House',
    description: 'Shared crew housing near the marina. Walking distance to Port Everglades and yacht training centers. Flexible weekly stays.',
    images: [
      'https://images.unsplash.com/photo-1522708323594-d1a58c7a4f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323594-d1a58c7a4f71?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1522708323594-d1a58c7a4f71?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 180,
    cleaning_fee: 50,
    ota_links: { airbnb: 'https://airbnb.com/rooms/2' },
    amenities: ['WiFi', 'Garden', 'Parking', 'Laundry', 'Shared Kitchen', 'Air Conditioning'],
    location: { address: '456 SW 30th Ter', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33312', lat: 26.1008, lng: -80.1894 },
    bedrooms: 4, bathrooms: 3, max_guests: 8, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_3',
    owner_id: 'owner_1',
    name: 'Beachfront Studio',
    description: 'Steps from the sand in Fort Lauderdale Beach. Ideal for short-term crew stays. Fully furnished with kitchenette and ocean views.',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 195,
    cleaning_fee: 60,
    ota_links: { airbnb: 'https://airbnb.com/rooms/3', vrbo: 'https://vrbo.com/3' },
    amenities: ['WiFi', 'Beach Access', 'Kitchenette', 'Air Conditioning', 'Parking'],
    location: { address: '789 N Ocean Blvd', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33304', lat: 26.1892, lng: -80.0994 },
    bedrooms: 1, bathrooms: 1, max_guests: 2, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_4',
    owner_id: 'owner_1',
    name: 'Wynwood Private Room',
    description: 'Private room in a shared Wynwood house. Walking distance to art district, cafes, and transportation. Perfect for young professionals.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 160,
    cleaning_fee: 40,
    ota_links: { airbnb: 'https://airbnb.com/rooms/4' },
    amenities: ['WiFi', 'Shared Kitchen', 'Workspace', 'Laundry', 'Air Conditioning'],
    location: { address: '321 NW 24th St', city: 'Miami', state: 'FL', country: 'USA', zip: '33127', lat: 25.8008, lng: -80.2016 },
    bedrooms: 1, bathrooms: 1, max_guests: 2, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_5',
    owner_id: 'owner_1',
    name: 'Brickell Executive Apartment',
    description: 'Modern 2BR in Brickell. Full amenities building with gym, pool, and concierge. Close to PortMiami and downtown financial district.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3a10e0e9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3a10e0e9?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1545324418-cc1a3a10e0e9?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 340,
    cleaning_fee: 90,
    ota_links: { airbnb: 'https://airbnb.com/rooms/5', vrbo: 'https://vrbo.com/5' },
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Pool', 'Parking', 'Doorman', 'Air Conditioning'],
    location: { address: '888 Brickell Ave', city: 'Miami', state: 'FL', country: 'USA', zip: '33131', lat: 25.7617, lng: -80.1918 },
    bedrooms: 2, bathrooms: 2, max_guests: 4, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_6',
    owner_id: 'owner_1',
    name: 'Hollywood Beach Bungalow',
    description: 'Charming bungalow just minutes from Hollywood Beach Broadwalk. Quiet residential street with parking. Great for short stays near FLL airport.',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a1970225859c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a1970225859c?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1484154218962-a1970225859c?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 220,
    cleaning_fee: 65,
    ota_links: { airbnb: 'https://airbnb.com/rooms/6' },
    amenities: ['WiFi', 'Garden', 'Parking', 'Laundry', 'Kitchen', 'Air Conditioning'],
    location: { address: '654 Polk St', city: 'Hollywood', state: 'FL', country: 'USA', zip: '33019', lat: 26.0093, lng: -80.1255 },
    bedrooms: 3, bathrooms: 2, max_guests: 6, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_7',
    owner_id: 'owner_1',
    name: 'Downtown Miami Shared House',
    description: 'Shared house with private rooms available. Walking distance to Metrorail and bus stops. Budget-friendly for crew and students.',
    images: [
      'https://images.unsplash.com/photo-1556912173-3db996e8db8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912173-3db996e8db8e?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1556912173-3db996e8db8e?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 145,
    cleaning_fee: 35,
    ota_links: { airbnb: 'https://airbnb.com/rooms/7' },
    amenities: ['WiFi', 'Shared Kitchen', 'Laundry', 'Air Conditioning', 'Parking'],
    location: { address: '1010 NE 2nd Ave', city: 'Miami', state: 'FL', country: 'USA', zip: '33132', lat: 25.7751, lng: -80.1884 },
    bedrooms: 5, bathrooms: 3, max_guests: 10, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_8',
    owner_id: 'owner_1',
    name: 'Las Olas Waterfront',
    description: 'Luxury studio on the Las Olas Riverfront. Walking distance to restaurants, bars, and the water taxi. Perfect for upscale crew accommodations.',
    images: [
      'https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=800&h=600&fit=crop&sat=-50',
      'https://images.unsplash.com/photo-1502672262016-1c1c450f464f?w=800&h=600&fit=crop&blur=2'
    ],
    base_price: 295,
    cleaning_fee: 80,
    ota_links: { airbnb: 'https://airbnb.com/rooms/8', vrbo: 'https://vrbo.com/8' },
    amenities: ['WiFi', 'Kitchen', 'Pool', 'Gym', 'Parking', 'Air Conditioning', 'River View'],
    location: { address: '300 SW 1st Ave', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33301', lat: 26.1194, lng: -80.1425 },
    bedrooms: 1, bathrooms: 1, max_guests: 2, status: 'active',
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
