-- FloorStay Seed Data
-- Fort Lauderdale crew houses and vacation rentals

INSERT INTO owners (id, email, full_name, business_name, slug, headline, knowledge_base, commission_rate, status, created_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'ales@quantumhospitality.co', 'Alejandro Soria', 'Quantum Hospitality Solutions', 'quantum-hospitality', 'Premium Fort Lauderdale Stays for Crew & Travelers', 
'We specialize in housing airline crews, yacht crews, and traveling professionals in Fort Lauderdale. All properties are fully furnished with high-speed WiFi, workspaces, and fully equipped kitchens. Check-in is self-service via smart lock. Quiet hours 10PM-6AM. No smoking indoors. Pet-friendly properties available upon request.', 
15.00, 'active', NOW()),
('22222222-2222-2222-2222-222222222222', 'maria@ftlstays.com', 'Maria Gonzalez', 'FTL Stays', 'ftl-stays', 
'Downtown Fort Lauderdale Living', 
'Boutique properties in the heart of Fort Lauderdale. Walking distance to Las Olas, beaches, and the airport. Modern design, premium linens, and local recommendations included.', 
12.00, 'active', NOW()),
('33333333-3333-3333-3333-333333333333', 'capt.james@maritimecrew.com', 'James Sullivan', 'Maritime Crew Housing', 'maritime-crew', 
'Crew Housing by the Harbor', 
'Purpose-built for yacht and maritime crew. Multiple bedrooms, shared common areas, laundry facilities, and parking. Located near Port Everglades and 17th Street Causeway. Flexible lease terms.', 
10.00, 'active', NOW());

INSERT INTO properties (id, owner_id, name, description, images, base_price, cleaning_fee, ota_links, amenities, location, bedrooms, bathrooms, max_guests, status, created_at)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
'Las Olas Crew House', 
'Spacious 4-bedroom home just minutes from Fort Lauderdale-Hollywood International Airport and Port Everglades. Perfect for airline crews and yacht staff. Fully equipped kitchen, high-speed fiber internet, dedicated workstations in each room, and covered parking. Walking distance to Las Olas Boulevard dining and entertainment.', 
ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
], 
185.00, 85.00, 
'{"airbnb": "https://airbnb.com/rooms/las-olas-crew", "vrbo": "https://vrbo.com/las-olas-crew"}'::jsonb,
ARRAY['WiFi', 'Kitchen', 'Workspace', 'Parking', 'Laundry', 'Smart Lock', 'Pool', 'BBQ'],
'{"address": "1234 SE 3rd Ave", "city": "Fort Lauderdale", "state": "FL", "country": "USA", "zip": "33316"}'::jsonb,
4, 2.5, 8, 'active', NOW()),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 
'Harbor View Executive Suite', 
'Luxury 2-bedroom executive apartment with panoramic views of the Intracoastal Waterway. Floor-to-ceiling windows, marble finishes, and a private balcony. Ideal for pilots, captains, and executives. Building features a rooftop pool, gym, and concierge service.', 
ARRAY[
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600585154526-991dceda5ce0?auto=format&fit=crop&q=80&w=1200'
], 
245.00, 95.00, 
'{"airbnb": "https://airbnb.com/rooms/harbor-view-exec", "vrbo": "https://vrbo.com/harbor-view-exec"}'::jsonb,
ARRAY['WiFi', 'Kitchen', 'Workspace', 'Gym', 'Pool', 'Balcony', 'Waterfront', 'Concierge'],
'{"address": "789 N Birch Rd", "city": "Fort Lauderdale", "state": "FL", "country": "USA", "zip": "33304"}'::jsonb,
2, 2, 4, 'active', NOW()),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
'Downtown Loft on Las Olas', 
'Industrial-chic loft in the heart of downtown Fort Lauderdale. Exposed brick, 14-foot ceilings, and a rooftop terrace. Steps from the best restaurants, bars, and the Riverwalk. Perfect for short-term corporate stays or weekend getaways.', 
ARRAY[
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1200'
], 
195.00, 75.00, 
'{"airbnb": "https://airbnb.com/rooms/downtown-loft-las-olas"}'::jsonb,
ARRAY['WiFi', 'Kitchen', 'Workspace', 'Rooftop', 'Gym', 'Smart Lock', 'Netflix'],
'{"address": "456 E Las Olas Blvd", "city": "Fort Lauderdale", "state": "FL", "country": "USA", "zip": "33301"}'::jsonb,
1, 1.5, 2, 'active', NOW()),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 
'Beachside Bungalow', 
'Charming 3-bedroom bungalow just two blocks from Fort Lauderdale Beach. Private courtyard with tropical garden, outdoor shower, and surfboard storage. Fully renovated with coastal-modern design. Perfect for families or small groups.', 
ARRAY[
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
], 
165.00, 65.00, 
'{"airbnb": "https://airbnb.com/rooms/beachside-bungalow", "vrbo": "https://vrbo.com/beachside-bungalow"}'::jsonb,
ARRAY['WiFi', 'Kitchen', 'Parking', 'Beach Access', 'Outdoor Shower', 'BBQ', 'Laundry'],
'{"address": "321 Seabreeze Blvd", "city": "Fort Lauderdale", "state": "FL", "country": "USA", "zip": "33316"}'::jsonb,
3, 2, 6, 'active', NOW()),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 
'Maritime Crew Villa', 
'Purpose-built 6-bedroom villa for large yacht crews. Shared living room, commercial-grade kitchen, and a massive dining table. Each bedroom has an en-suite bathroom. Located in the Rio Vista neighborhood, 5 minutes from the marinas. Laundry room with industrial machines.', 
ARRAY[
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80&w=1200'
], 
120.00, 45.00, 
'{"vrbo": "https://vrbo.com/maritime-crew-villa"}'::jsonb,
ARRAY['WiFi', 'Kitchen', 'Parking', 'Laundry', 'Workspace', 'Smart Lock', 'BBQ'],
'{"address": "567 Rio Vista Blvd", "city": "Fort Lauderdale", "state": "FL", "country": "USA", "zip": "33316"}'::jsonb,
6, 6.5, 12, 'active', NOW()),

('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 
'Portside Studio', 
'Compact but premium studio apartment designed for single crew members. Everything you need in 450 sq ft: Murphy bed, fold-out desk, kitchenette, and a rainfall shower. Located directly across from Port Everglades. Monthly rates available.', 
ARRAY[
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600585154526-991dceda5ce0?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80&w=1200'
], 
95.00, 35.00, 
'{"airbnb": "https://airbnb.com/rooms/portside-studio"}'::jsonb,
ARRAY['WiFi', 'Kitchenette', 'Workspace', 'Smart Lock', 'Gym'],
'{"address": "890 SE 17th St", "city": "Fort Lauderdale", "state": "FL", "country": "USA", "zip": "33316"}'::jsonb,
0, 1, 1, 'active', NOW());

-- Seed OTA Price Cache (so comparison engine shows real data)
INSERT INTO ota_price_cache (property_id, ota, price, fees, total, last_fetched)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'airbnb', 185.00, 45.00, 230.00, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'vrbo', 185.00, 38.00, 223.00, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'airbnb', 245.00, 58.00, 303.00, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'vrbo', 245.00, 50.00, 295.00, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'airbnb', 195.00, 47.00, 242.00, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'airbnb', 165.00, 40.00, 205.00, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'vrbo', 165.00, 33.00, 198.00, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'vrbo', 120.00, 24.00, 144.00, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'airbnb', 95.00, 23.00, 118.00, NOW());

-- Seed a few bookings
INSERT INTO bookings (property_id, owner_id, guest_email, guest_name, guest_phone, start_date, end_date, nights, base_total, cleaning_fee, platform_fee_savings, total_price, status, source, payment_status, created_at)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
'sarah.chen@airline.com', 'Sarah Chen', '+1-305-555-0101', '2026-05-10', '2026-05-14', 4, 740.00, 85.00, 180.00, 645.00, 'confirmed', 'direct', 'paid', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 
'capt.morales@yachtcrew.net', 'Captain Morales', '+1-954-555-0202', '2026-05-12', '2026-05-15', 3, 735.00, 95.00, 174.00, 656.00, 'confirmed', 'direct', 'deposit', NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
'jessica.taylor@corp.com', 'Jessica Taylor', '+1-212-555-0303', '2026-05-15', '2026-05-18', 3, 585.00, 75.00, 141.00, 519.00, 'pending', 'direct', 'pending', NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 
'crew.chief@maritime.io', 'Crew Chief', '+1-786-555-0404', '2026-05-20', '2026-05-27', 7, 840.00, 45.00, 196.00, 689.00, 'confirmed', 'referral', 'paid', NOW());

-- Seed sync logs
INSERT INTO sync_logs (property_id, channel, status, message, timestamp)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Airbnb iCal', 'success', 'Calendar synced successfully. 2 blocked dates imported.', NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'VRBO iCal', 'success', 'Calendar synced successfully. 1 blocked date imported.', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Airbnb iCal', 'success', 'Calendar synced successfully. 3 blocked dates imported.', NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Airbnb iCal', 'failure', 'iCal URL returned 404. Please check listing URL.', NOW() - INTERVAL '1 hour'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'VRBO iCal', 'success', 'Calendar synced successfully. 5 blocked dates imported.', NOW());
