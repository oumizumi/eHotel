-- e-Hotels: 2f Views

-- ============================================================
-- VIEW 1: Number of available rooms per area
-- "Area" is derived from the city portion of the hotel address
-- (everything before the first comma).
-- A room is available if it is not damaged AND has no active
-- booking whose date range overlaps with today's date.
-- ============================================================
CREATE OR REPLACE VIEW AvailableRoomsPerArea AS
SELECT
    TRIM(SPLIT_PART(h.address, ',', 2)) AS area,
    COUNT(r.room_ID)                    AS available_rooms
FROM Room r
JOIN Hotel h ON r.hotel_ID = h.hotel_ID
WHERE r.damaged = FALSE
  AND r.room_ID NOT IN (
      SELECT rf.room_ID
      FROM ReservedFor rf
      JOIN Booking b ON rf.booking_ID = b.booking_ID
      WHERE b.status = 'active'
        AND b."start" <= CURRENT_DATE
        AND b."end"   >= CURRENT_DATE
  )
GROUP BY TRIM(SPLIT_PART(h.address, ',', 2))
ORDER BY area;


-- ============================================================
-- VIEW 2: Aggregated capacity of all rooms per hotel
-- Returns a count of rooms broken down by capacity type
-- for every hotel, along with the total room count.
-- ============================================================
CREATE OR REPLACE VIEW HotelRoomCapacitySummary AS
SELECT
    h.hotel_ID,
    h.name                                          AS hotel_name,
    hc.name                                         AS chain_name,
    COUNT(r.room_ID)                                AS total_rooms,
    COUNT(r.room_ID) FILTER (WHERE r.capacity = 'single')    AS single_rooms,
    COUNT(r.room_ID) FILTER (WHERE r.capacity = 'double')    AS double_rooms,
    COUNT(r.room_ID) FILTER (WHERE r.capacity = 'triple')    AS triple_rooms,
    COUNT(r.room_ID) FILTER (WHERE r.capacity = 'king')      AS king_rooms,
    COUNT(r.room_ID) FILTER (WHERE r.capacity = 'suite')     AS suite_rooms,
    COUNT(r.room_ID) FILTER (WHERE r.capacity = 'penthouse') AS penthouse_rooms
FROM Hotel h
JOIN HotelChain hc ON h.chain_ID = hc.chain_ID
LEFT JOIN Room r   ON h.hotel_ID = r.hotel_ID
GROUP BY h.hotel_ID, h.name, hc.name
ORDER BY hc.name, h.name;


-- ============================================================
-- BONUS VIEW 3: Available rooms per hotel with full details
-- Useful for the frontend search form — shows every currently
-- available (non-damaged, not actively booked for today) room
-- with its hotel, chain, price, capacity, and view type.
-- ============================================================
CREATE OR REPLACE VIEW AvailableRoomDetails AS
SELECT
    r.room_ID,
    r.room_num,
    r.capacity,
    r.view_type,
    r.extendable,
    r.price,
    h.hotel_ID,
    h.name      AS hotel_name,
    h.star_cat,
    h.address   AS hotel_address,
    TRIM(SPLIT_PART(h.address, ',', 2)) AS area,
    hc.chain_ID,
    hc.name     AS chain_name
FROM Room r
JOIN Hotel h       ON r.hotel_ID  = h.hotel_ID
JOIN HotelChain hc ON h.chain_ID  = hc.chain_ID
WHERE r.damaged = FALSE
  AND r.room_ID NOT IN (
      SELECT rf.room_ID
      FROM ReservedFor rf
      JOIN Booking b ON rf.booking_ID = b.booking_ID
      WHERE b.status = 'active'
        AND b."start" <= CURRENT_DATE
        AND b."end"   >= CURRENT_DATE
  )
ORDER BY hc.name, h.name, r.price;