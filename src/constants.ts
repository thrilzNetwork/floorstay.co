import { Property, Booking } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    ownerId: 'owner_1',
    name: 'Metropolitan Loft',
    description: 'A sleek, industrial loft in the heart of downtown. High ceilings and panoramic city views.',
    images: ['https://picsum.photos/seed/loft/800/600'],
    basePrice: 245,
    otaLinks: {
      airbnb: 'https://airbnb.com/rooms/1',
      vrbo: 'https://vrbo.com/1'
    },
    amenities: ['Wifi', 'Kitchen', 'Workspace', 'Gym'],
    location: {
      address: '123 Main St',
      city: 'New York',
      country: 'USA'
    },
    status: 'active'
  },
  {
    id: 'prop_2',
    ownerId: 'owner_1',
    name: 'Serene Garden Cottage',
    description: 'Charming cottage surrounded by lush greenery. Perfect for a quiet weekend getaway.',
    images: ['https://picsum.photos/seed/cottage/800/600'],
    basePrice: 180,
    otaLinks: {
      airbnb: 'https://airbnb.com/rooms/2'
    },
    amenities: ['Wifi', 'Garden', 'Parking', 'Fireplace'],
    location: {
      address: '456 Oak Lane',
      city: 'Austin',
      country: 'USA'
    },
    status: 'active'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book_1',
    propertyId: 'prop_1',
    ownerId: 'owner_1',
    guestEmail: 'guest@example.com',
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000 * 3),
    totalPrice: 735,
    status: 'confirmed',
    source: 'direct',
    createdAt: new Date()
  } as any
];
