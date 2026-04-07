-- e-Hotels: 2d Additional Triggers

-- ============================================================
-- TRIGGER 1: Auto-update Hotel.num_rooms on Room insert/delete
-- The num_rooms column in Hotel should always reflect the real
-- count of rooms in that hotel. Rather than relying on manual
-- updates, this trigger keeps it in sync automatically.
-- ============================================================
CREATE OR REPLACE FUNCTION update_num_rooms()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE Hotel
        SET num_rooms = num_rooms + 1
        WHERE hotel_ID = NEW.hotel_ID;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE Hotel
        SET num_rooms = num_rooms - 1
        WHERE hotel_ID = OLD.hotel_ID;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_num_rooms
AFTER INSERT OR DELETE ON Room
FOR EACH ROW EXECUTE FUNCTION update_num_rooms();


-- ============================================================
-- TRIGGER 2: Auto-update HotelChain.num_hotels on Hotel insert/delete
-- Same logic as above but at the chain level. When a hotel is
-- added or removed from a chain, the chain's num_hotels count
-- is automatically kept accurate.
-- ============================================================
CREATE OR REPLACE FUNCTION update_num_hotels()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE HotelChain
        SET num_hotels = num_hotels + 1
        WHERE chain_ID = NEW.chain_ID;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE HotelChain
        SET num_hotels = num_hotels - 1
        WHERE chain_ID = OLD.chain_ID;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_num_hotels
AFTER INSERT OR DELETE ON Hotel
FOR EACH ROW EXECUTE FUNCTION update_num_hotels();


-- ============================================================
-- TRIGGER 3: Prevent booking a room that is already rented
-- for overlapping dates (walk-in rentings are not captured
-- in ReservedFor, so the existing double-booking trigger on
-- ReservedFor does not catch this case).
-- This trigger fires before INSERT on Renting and checks
-- whether the room already has an active renting with
-- overlapping dates.
-- ============================================================
CREATE OR REPLACE FUNCTION check_no_overlap_renting()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Renting rt
        WHERE rt.room_ID    = NEW.room_ID
          AND rt.renting_ID <> NEW.renting_ID
          AND rt."start"    < NEW."end"
          AND rt."end"      > NEW."start"
    ) THEN
        RAISE EXCEPTION
            'Room % is already rented for overlapping dates (% to %)',
            NEW.room_ID, NEW."start", NEW."end";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_overlap_renting
BEFORE INSERT ON Renting
FOR EACH ROW EXECUTE FUNCTION check_no_overlap_renting();


-- ============================================================
-- TRIGGER 4: Prevent cancelling a booking that has already
-- been converted to a renting.
-- Once a booking is checked in (i.e. a Renting row references
-- it), the booking status must not be set to 'cancelled'.
-- This protects data integrity between Booking and Renting.
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_cancel_checked_in()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'cancelled' AND EXISTS (
        SELECT 1 FROM Renting
        WHERE booking_ID = NEW.booking_ID
    ) THEN
        RAISE EXCEPTION
            'Booking % cannot be cancelled because it has already been checked in as a renting.',
            NEW.booking_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_cancel_checked_in
BEFORE UPDATE ON Booking
FOR EACH ROW EXECUTE FUNCTION prevent_cancel_checked_in();