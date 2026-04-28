# Security Specification - FloorStay

## Data Invariants
1. A Property must always have an `ownerId` matching the creator's UID.
2. A Booking must have a `startDate` before `endDate`.
3. A Booking can only be created if the Property exists.
4. Users can only edit their own `User` profile and `Property` listings.
5. `PricingCache` and `SyncLog` are managed by the system (server), but readable by the property owner.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a property with another user's `ownerId`.
2. **Price Manipulation**: Attempt to update a booking's `totalPrice` after creation as a guest.
3. **Privilege Escalation**: Attempt to set `role: 'admin'` (if it existed) or change someone else's role.
4. **Orphaned Booking**: Attempt to create a booking for a non-existent `propertyId`.
5. **Backdated Booking**: Attempt to create a booking with `startDate` in the past.
6. **Shadow Fields**: Adding an `isVerified: true` field to a property update.
7. **Cross-Tenant Access**: User A attempts to read User B's `SyncLog`.
8. **Malicious ID**: Use an extremely long string as a property ID to cause resource exhaustion.
9. **Status Jumping**: Attempt to move a booking from `cancelled` back to `confirmed` directly.
10. **Email Spoofing**: Attempt to create a user profile with an email that doesn't match the auth token.
11. **System Field Injection**: Attempt to write to `PricingCache` directly from the client.
12. **Unbounded Array**: Sending a property update with 10,000 amenities to crash the client/store.

## Test Runner Design
A test suite will be implemented using `@firebase/rules-unit-testing` to verify these payloads are rejected.
