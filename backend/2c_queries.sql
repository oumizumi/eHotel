-- e-Hotels: 2c Queries

-- ============================================================
-- QUERY 1: Available rooms for a given date range (nested query)
-- Returns all non-damaged rooms that have no active booking
-- overlapping the requested stay dates.
-- Replace the date literals to search any date range.
-- ============================================================
SELECT
    r.room_ID,
    r.room_num,
    r.capacity,
    r.view_type,
    r.price,
    r.extendable,
    h.name      AS hotel_name,
    h.star_cat,
    hc.name     AS chain_name,
    TRIM(SPLIT_PART(h.address, ',', 2)) AS area
FROM Room r
JOIN Hotel h       ON r.hotel_ID = h.hotel_ID
JOIN HotelChain hc ON h.chain_ID = hc.chain_ID
WHERE r.damaged = FALSE
  AND r.room_ID NOT IN (
      SELECT rf.room_ID
      FROM ReservedFor rf
      JOIN Booking b ON rf.booking_ID = b.booking_ID
      WHERE b.status = 'active'
        AND b.start < '2026-04-30'   -- requested end date
        AND b.end   > '2026-04-10'   -- requested start date
  )
ORDER BY r.price;


-- ============================================================
-- QUERY 2: Total revenue per hotel chain (aggregation)
-- Sums all payments grouped by chain, showing number of
-- rentings paid and the total amount collected.
-- ============================================================
SELECT
    hc.name                     AS chain_name,
    COUNT(p.payment_ID)         AS total_payments,
    SUM(p.amount)               AS total_revenue,
    ROUND(AVG(p.amount), 2)     AS avg_payment
FROM Payment p
JOIN Renting rt    ON p.renting_ID  = rt.renting_ID
JOIN Room r        ON rt.room_ID    = r.room_ID
JOIN Hotel h       ON r.hotel_ID    = h.hotel_ID
JOIN HotelChain hc ON h.chain_ID    = hc.chain_ID
GROUP BY hc.name
ORDER BY total_revenue DESC;


-- ============================================================
-- QUERY 3: Customers who have made more than one booking
-- (aggregation + nested query)
-- First aggregates bookings per customer, then filters to
-- those with more than one using a nested query.
-- ============================================================
SELECT
    c.customer_ID,
    c.name,
    c.address,
    booking_counts.total_bookings
FROM Customer c
JOIN (
    SELECT customer_ID, COUNT(*) AS total_bookings
    FROM Booking
    GROUP BY customer_ID
    HAVING COUNT(*) > 1
) AS booking_counts ON c.customer_ID = booking_counts.customer_ID
ORDER BY booking_counts.total_bookings DESC;


-- ============================================================
-- QUERY 4: Hotels that have no active bookings right now
-- (nested query with NOT EXISTS)
-- Useful for identifying hotels with full current availability.
-- ============================================================
SELECT
    h.hotel_ID,
    h.name          AS hotel_name,
    hc.name         AS chain_name,
    h.star_cat,
    h.num_rooms,
    TRIM(SPLIT_PART(h.address, ',', 2)) AS area
FROM Hotel h
JOIN HotelChain hc ON h.chain_ID = hc.chain_ID
WHERE NOT EXISTS (
    SELECT 1
    FROM Room r
    JOIN ReservedFor rf ON r.room_ID    = rf.room_ID
    JOIN Booking b      ON rf.booking_ID = b.booking_ID
    WHERE r.hotel_ID  = h.hotel_ID
      AND b.status    = 'active'
      AND b.start     <= CURRENT_DATE
      AND b.end       >= CURRENT_DATE
)
ORDER BY hc.name, h.name;


-- ============================================================
-- QUERY 5: Room capacity breakdown per area (aggregation)
-- Counts how many rooms of each capacity type exist per city,
-- useful for understanding inventory distribution.
-- ============================================================
SELECT
    TRIM(SPLIT_PART(h.address, ',', 2))  AS area,
    r.capacity,
    COUNT(r.room_ID)                      AS room_count,
    ROUND(AVG(r.price), 2)               AS avg_price,
    MIN(r.price)                          AS min_price,
    MAX(r.price)                          AS max_price
FROM Room r
JOIN Hotel h ON r.hotel_ID = h.hotel_ID
WHERE r.damaged = FALSE
GROUP BY TRIM(SPLIT_PART(h.address, ',', 2)), r.capacity
ORDER BY area, r.capacity;


-- ============================================================
-- QUERY 6: Top spending customers (aggregation + nested query)
-- Finds total amount spent per customer across all rentings,
-- only including customers who have actually paid something.
-- ============================================================
SELECT
    c.customer_ID,
    c.name,
    spend.total_spent,
    spend.num_rentings
FROM Customer c
JOIN (
    SELECT
        rt.customer_ID,
        COUNT(p.payment_ID)     AS num_rentings,
        SUM(p.amount)           AS total_spent
    FROM Renting rt
    JOIN Payment p ON p.renting_ID = rt.renting_ID
    GROUP BY rt.customer_ID
) AS spend ON c.customer_ID = spend.customer_ID
ORDER BY spend.total_spent DESC;