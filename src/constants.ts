import { Property, Booking } from './types';

const IMGS = {
  loft: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
  ],
  crew: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=800&h=600&fit=crop',
  ],
  beach: [
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=600&fit=crop',
  ],
  wynwood: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
  ],
  brickell: [
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
  ],
  hollywood: [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  ],
  shared: [
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
  ],
  lasolas: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  ],
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1', owner_id: 'owner_1',
    name: 'Metropolitan Loft',
    description: 'Industrial loft in downtown Fort Lauderdale. High ceilings, panoramic views. Perfect for yacht crew between contracts.',
    images: IMGS.loft,
    base_price: 245, cleaning_fee: 75,
    ota_links: { airbnb: 'https://airbnb.com/rooms/1', vrbo: 'https://vrbo.com/1' },
    amenities: ['WiFi','Kitchen','Workspace','Gym','Parking','Laundry','Pool','AC'],
    location: { address: '123 SE 3rd Ave', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33301', lat: 26.1224, lng: -80.1373 },
    bedrooms: 2, bathrooms: 2, max_guests: 4, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_2', owner_id: 'owner_1',
    name: 'Riverside Crew House',
    description: 'Shared crew housing near the marina. Walking distance to Port Everglades. Flexible weekly stays.',
    images: IMGS.crew,
    base_price: 180, cleaning_fee: 50,
    ota_links: { airbnb: 'https://airbnb.com/rooms/2' },
    amenities: ['WiFi','Garden','Parking','Laundry','Shared Kitchen','AC'],
    location: { address: '456 SW 30th Ter', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33312', lat: 26.1008, lng: -80.1894 },
    bedrooms: 4, bathrooms: 3, max_guests: 8, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_3', owner_id: 'owner_1',
    name: 'Beachfront Studio',
    description: 'Steps from the sand in Fort Lauderdale Beach. Fully furnished with kitchenette and ocean views.',
    images: IMGS.beach,
    base_price: 195, cleaning_fee: 60,
    ota_links: { airbnb: 'https://airbnb.com/rooms/3', vrbo: 'https://vrbo.com/3' },
    amenities: ['WiFi','Beach Access','Kitchenette','AC','Parking'],
    location: { address: '789 N Ocean Blvd', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33304', lat: 26.1892, lng: -80.0994 },
    bedrooms: 1, bathrooms: 1, max_guests: 2, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_4', owner_id: 'owner_1',
    name: 'Wynwood Private Room',
    description: 'Private room in shared Wynwood house. Walk to art district, cafes, transit. Perfect for young professionals.',
    images: IMGS.wynwood,
    base_price: 160, cleaning_fee: 40,
    ota_links: { airbnb: 'https://airbnb.com/rooms/4' },
    amenities: ['WiFi','Shared Kitchen','Workspace','Laundry','AC'],
    location: { address: '321 NW 24th St', city: 'Miami', state: 'FL', country: 'USA', zip: '33127', lat: 25.8008, lng: -80.2016 },
    bedrooms: 1, bathrooms: 1, max_guests: 2, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_5', owner_id: 'owner_1',
    name: 'Brickell Executive',
    description: 'Modern 2BR in Brickell. Full amenities: gym, pool, concierge. Close to PortMiami.',
    images: IMGS.brickell,
    base_price: 340, cleaning_fee: 90,
    ota_links: { airbnb: 'https://airbnb.com/rooms/5', vrbo: 'https://vrbo.com/5' },
    amenities: ['WiFi','Kitchen','Gym','Pool','Parking','Doorman','AC'],
    location: { address: '888 Brickell Ave', city: 'Miami', state: 'FL', country: 'USA', zip: '33131', lat: 25.7617, lng: -80.1918 },
    bedrooms: 2, bathrooms: 2, max_guests: 4, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_6', owner_id: 'owner_1',
    name: 'Hollywood Beach Bungalow',
    description: 'Charming bungalow near Hollywood Beach Broadwalk. Quiet street with parking. Great for short stays near FLL.',
    images: IMGS.hollywood,
    base_price: 220, cleaning_fee: 65,
    ota_links: { airbnb: 'https://airbnb.com/rooms/6' },
    amenities: ['WiFi','Garden','Parking','Laundry','Kitchen','AC'],
    location: { address: '654 Polk St', city: 'Hollywood', state: 'FL', country: 'USA', zip: '33019', lat: 26.0093, lng: -80.1255 },
    bedrooms: 3, bathrooms: 2, max_guests: 6, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_7', owner_id: 'owner_1',
    name: 'Downtown Miami Shared',
    description: 'Shared house with private rooms. Walk to Metrorail. Budget-friendly for crew and students.',
    images: IMGS.shared,
    base_price: 145, cleaning_fee: 35,
    ota_links: { airbnb: 'https://airbnb.com/rooms/7' },
    amenities: ['WiFi','Shared Kitchen','Laundry','AC','Parking'],
    location: { address: '1010 NE 2nd Ave', city: 'Miami', state: 'FL', country: 'USA', zip: '33132', lat: 25.7751, lng: -80.1884 },
    bedrooms: 5, bathrooms: 3, max_guests: 10, status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_8', owner_id: 'owner_1',
    name: 'Las Olas Waterfront',
    description: 'Luxury studio on Las Olas Riverfront. Walk to restaurants, water taxi. Upscale crew accommodation.',
    images: IMGS.lasolas,
    base_price: 295, cleaning_fee: 80,
    ota_links: { airbnb: 'https://airbnb.com/rooms/8', vrbo: 'https://vrbo.com/8' },
    amenities: ['WiFi','Kitchen','Pool','Gym','Parking','AC','River View'],
    location: { address: '300 SW 1st Ave', city: 'Fort Lauderdale', state: 'FL', country: 'USA', zip: '33301', lat: 26.1194, lng: -80.1425 },
    bedrooms: 1, bathrooms: 1, max_guests: 2, status: 'active',
    created_at: new Date().toISOString()
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book_1', property_id: 'prop_1', owner_id: 'owner_1',
    guest_email: 'guest@example.com',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    nights: 3, base_total: 735, cleaning_fee: 75, platform_fee_savings: 150,
    pay_now_discount: 0, total_price: 660,
    status: 'confirmed', source: 'direct', payment_status: 'paid',
    created_at: new Date().toISOString()
  }
];
