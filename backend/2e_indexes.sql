-- e-Hotels: 2e Indexes

-- Index 1: room search by hotel and price
-- Used by the availability search when filtering rooms by hotel and price range
CREATE INDEX idx_room_hotel_price
    ON Room (hotel_ID, price);

-- Index 2: booking lookup by customer and status
-- Used when a customer views their active bookings and when employees filter by status
CREATE INDEX idx_booking_customer_status
    ON Booking (customer_ID, status);

-- Index 3: room search by hotel, capacity, and damaged flag
-- Used by the search form which always filters by hotel, capacity, and excludes damaged rooms
CREATE INDEX idx_room_search_filters
    ON Room (hotel_ID, capacity, damaged);

-- Index 4: ReservedFor lookup by room
-- Used by the double-booking trigger on every insert into ReservedFor
CREATE INDEX idx_reservedfor_room
    ON ReservedFor (room_ID);

-- Index 5: hotel lookup by chain and star category
-- Used when users filter hotels by chain and star rating in the search form
CREATE INDEX idx_hotel_chain_star
    ON Hotel (chain_ID, star_cat);
