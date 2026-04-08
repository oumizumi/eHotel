-- e-Hotels: 2a DDL

DROP TABLE IF EXISTS RentingArchive CASCADE;
DROP TABLE IF EXISTS BookingArchive CASCADE;
DROP TABLE IF EXISTS Payment CASCADE;
DROP TABLE IF EXISTS Renting CASCADE;
DROP TABLE IF EXISTS ReservedFor CASCADE;
DROP TABLE IF EXISTS Booking CASCADE;
DROP TABLE IF EXISTS RoomDamage CASCADE;
DROP TABLE IF EXISTS RoomAmenity CASCADE;
DROP TABLE IF EXISTS Room CASCADE;
DROP TABLE IF EXISTS HotelPhone CASCADE;
DROP TABLE IF EXISTS HotelEmail CASCADE;
DROP TABLE IF EXISTS Employee CASCADE;
DROP TABLE IF EXISTS Hotel CASCADE;
DROP TABLE IF EXISTS ChainPhone CASCADE;
DROP TABLE IF EXISTS ChainEmail CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;
DROP TABLE IF EXISTS HotelChain CASCADE;


CREATE TABLE HotelChain (
    chain_ID    INTEGER         PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    num_hotels  INTEGER         DEFAULT 0 CHECK (num_hotels >= 0),
    address     VARCHAR(255)    NOT NULL
);

CREATE TABLE ChainEmail (
    chain_ID    INTEGER         NOT NULL REFERENCES HotelChain(chain_ID) ON DELETE CASCADE,
    email       VARCHAR(100)    NOT NULL,
    PRIMARY KEY (chain_ID, email)
);

CREATE TABLE ChainPhone (
    chain_ID    INTEGER         NOT NULL REFERENCES HotelChain(chain_ID) ON DELETE CASCADE,
    phone       VARCHAR(20)     NOT NULL,
    PRIMARY KEY (chain_ID, phone)
);

CREATE TABLE Customer (
    customer_ID INTEGER         PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    address     VARCHAR(255)    NOT NULL,
    ID_type     VARCHAR(50),
    ID_num      VARCHAR(100)    NOT NULL,
    date        DATE            CHECK (date <= CURRENT_DATE)
);

-- manager_ID FK added after Employee is created
CREATE TABLE Hotel (
    hotel_ID    INTEGER         PRIMARY KEY,
    chain_ID    INTEGER         NOT NULL REFERENCES HotelChain(chain_ID) ON DELETE CASCADE,
    name        VARCHAR(100)    NOT NULL,
    address     VARCHAR(255)    NOT NULL,
    star_cat    INTEGER         CHECK (star_cat BETWEEN 1 AND 5),
    num_rooms   INTEGER         DEFAULT 0 CHECK (num_rooms >= 0),
    manager_ID  INTEGER
);

CREATE TABLE HotelEmail (
    hotel_ID    INTEGER         NOT NULL REFERENCES Hotel(hotel_ID) ON DELETE CASCADE,
    email       VARCHAR(100)    NOT NULL,
    PRIMARY KEY (hotel_ID, email)
);

CREATE TABLE HotelPhone (
    hotel_ID    INTEGER         NOT NULL REFERENCES Hotel(hotel_ID) ON DELETE CASCADE,
    phone       VARCHAR(20)     NOT NULL,
    PRIMARY KEY (hotel_ID, phone)
);

CREATE TABLE Employee (
    employee_ID INTEGER         PRIMARY KEY,
    hotel_ID    INTEGER         NOT NULL REFERENCES Hotel(hotel_ID) ON DELETE CASCADE,
    name        VARCHAR(100)    NOT NULL,
    address     VARCHAR(255)    NOT NULL,
    SSN         VARCHAR(20)     NOT NULL UNIQUE,
    position    VARCHAR(100)    NOT NULL CHECK (position <> '')
);

ALTER TABLE Hotel
    ADD CONSTRAINT fk_hotel_manager
    FOREIGN KEY (manager_ID) REFERENCES Employee(employee_ID)
    ON DELETE SET NULL;

ALTER TABLE Hotel
    ADD CONSTRAINT unique_manager UNIQUE (manager_ID);

CREATE TABLE Room (
    room_ID     INTEGER         PRIMARY KEY,
    hotel_ID    INTEGER         NOT NULL REFERENCES Hotel(hotel_ID) ON DELETE CASCADE,
    room_num    INTEGER         NOT NULL,
    capacity    VARCHAR(20),
    view_type   VARCHAR(20)     CHECK (view_type IN ('sea', 'mountain', 'none')),
    damaged     BOOLEAN         NOT NULL DEFAULT FALSE,
    extendable  BOOLEAN         NOT NULL DEFAULT FALSE,
    price       DECIMAL(10,2)   NOT NULL CHECK (price > 0),
    UNIQUE (hotel_ID, room_num)
);

CREATE TABLE RoomAmenity (
    room_ID     INTEGER         NOT NULL REFERENCES Room(room_ID) ON DELETE CASCADE,
    amenity     VARCHAR(100)    NOT NULL,
    PRIMARY KEY (room_ID, amenity)
);

-- Multi-valued: a room may have multiple damages
CREATE TABLE RoomDamage (
    room_ID     INTEGER         NOT NULL REFERENCES Room(room_ID) ON DELETE CASCADE,
    description VARCHAR(255)    NOT NULL,
    PRIMARY KEY (room_ID, description)
);

CREATE TABLE Booking (
    booking_ID      INTEGER         PRIMARY KEY,
    customer_ID     INTEGER         NOT NULL REFERENCES Customer(customer_ID),
    booking_date    DATE            NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'active'
                                    CHECK (status IN ('active', 'cancelled', 'completed')),
    "start"         DATE            NOT NULL,
    "end"           DATE            NOT NULL,
    CHECK ("end" > "start"),
    CHECK ("start" >= booking_date)
);

CREATE TABLE ReservedFor (
    room_ID     INTEGER         NOT NULL REFERENCES Room(room_ID) ON DELETE CASCADE,
    booking_ID  INTEGER         NOT NULL UNIQUE REFERENCES Booking(booking_ID) ON DELETE CASCADE,
    PRIMARY KEY (room_ID, booking_ID)
);

CREATE TABLE Renting (
    renting_ID      INTEGER         PRIMARY KEY,
    customer_ID     INTEGER         NOT NULL REFERENCES Customer(customer_ID),
    room_ID         INTEGER         NOT NULL REFERENCES Room(room_ID),
    booking_ID      INTEGER         UNIQUE REFERENCES Booking(booking_ID),
    employee_ID     INTEGER         REFERENCES Employee(employee_ID),
    renting_date    DATE            NOT NULL,
    "start"         DATE            NOT NULL,
    "end"           DATE            NOT NULL,
    CHECK ("end" > "start")
);

CREATE TABLE Payment (
    payment_ID  INTEGER         PRIMARY KEY,
    renting_ID  INTEGER         NOT NULL UNIQUE REFERENCES Renting(renting_ID),
    amount      DECIMAL(10,2)   NOT NULL CHECK (amount > 0),
    method      VARCHAR(20)     NOT NULL CHECK (method IN ('cash', 'credit', 'debit', 'online')),
    date        DATE            NOT NULL
);

-- No foreign keys: archive records must survive deletion of rooms and customers
CREATE TABLE BookingArchive (
    archive_ID          INTEGER         PRIMARY KEY,
    customer_name       VARCHAR(100),
    customer_ID         INTEGER,
    original_booking    INTEGER,
    hotel_name          VARCHAR(100),
    chain_name          VARCHAR(100),
    room_number         INTEGER,
    "start"             DATE,
    "end"               DATE
);

CREATE TABLE RentingArchive (
    archive_ID          INTEGER         PRIMARY KEY,
    customer_name       VARCHAR(100),
    customer_ID         INTEGER,
    original_renting    INTEGER,
    hotel_name          VARCHAR(100),
    chain_name          VARCHAR(100),
    room_number         INTEGER,
    employee            VARCHAR(100),
    "start"             DATE,
    "end"               DATE
);


-- Trigger 0: once a manager is assigned to a hotel, manager_ID cannot be set back to NULL
-- This enforces the requirement that every hotel must have a manager.
-- manager_ID starts NULL only during initial population (before employees are inserted).
CREATE OR REPLACE FUNCTION prevent_manager_unset()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.manager_ID IS NOT NULL AND NEW.manager_ID IS NULL THEN
        RAISE EXCEPTION
            'Hotel % already has a manager assigned; manager_ID cannot be removed.',
            OLD.hotel_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_manager_unset
BEFORE UPDATE ON Hotel
FOR EACH ROW EXECUTE FUNCTION prevent_manager_unset();


-- Trigger 1: manager must belong to the hotel they manage
CREATE OR REPLACE FUNCTION check_manager_hotel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.manager_ID IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM Employee
        WHERE employee_ID = NEW.manager_ID
          AND hotel_ID = NEW.hotel_ID
    ) THEN
        RAISE EXCEPTION
            'Manager (employee_ID=%) does not belong to hotel_ID=%',
            NEW.manager_ID, NEW.hotel_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_manager_belongs_to_hotel
BEFORE INSERT OR UPDATE ON Hotel
FOR EACH ROW EXECUTE FUNCTION check_manager_hotel();


-- Trigger 2: no double-booking a room for overlapping dates
CREATE OR REPLACE FUNCTION check_no_overlap_booking()
RETURNS TRIGGER AS $$
DECLARE
    new_start DATE;
    new_end   DATE;
BEGIN
    SELECT "start", "end" INTO new_start, new_end
    FROM Booking WHERE booking_ID = NEW.booking_ID;

    IF EXISTS (
        SELECT 1
        FROM ReservedFor rf
        JOIN Booking b ON rf.booking_ID = b.booking_ID
        WHERE rf.room_ID = NEW.room_ID
          AND b.status = 'active'
          AND b.booking_ID <> NEW.booking_ID
          AND b."start" < new_end
          AND b."end"   > new_start
    ) THEN
        RAISE EXCEPTION
            'Room % is already booked for overlapping dates', NEW.room_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_double_booking
BEFORE INSERT ON ReservedFor
FOR EACH ROW EXECUTE FUNCTION check_no_overlap_booking();


-- Trigger 3: damaged rooms cannot be booked
CREATE OR REPLACE FUNCTION check_room_not_damaged_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT damaged FROM Room WHERE room_ID = NEW.room_ID) THEN
        RAISE EXCEPTION 'Room % is marked as damaged and cannot be booked', NEW.room_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_damaged_room_booking
BEFORE INSERT ON ReservedFor
FOR EACH ROW EXECUTE FUNCTION check_room_not_damaged_booking();


-- Trigger 3b: damaged rooms cannot be rented
CREATE OR REPLACE FUNCTION check_room_not_damaged_renting()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT damaged FROM Room WHERE room_ID = NEW.room_ID) THEN
        RAISE EXCEPTION 'Room % is marked as damaged and cannot be rented', NEW.room_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_damaged_room_renting
BEFORE INSERT ON Renting
FOR EACH ROW EXECUTE FUNCTION check_room_not_damaged_renting();


-- Trigger 4: archive a booking before it is deleted
CREATE OR REPLACE FUNCTION archive_booking()
RETURNS TRIGGER AS $$
DECLARE
    h_name  VARCHAR(100);
    c_name  VARCHAR(100);
    ch_name VARCHAR(100);
    r_num   INTEGER;
BEGIN
    SELECT r.room_num, h.name, hc.name
    INTO r_num, h_name, ch_name
    FROM ReservedFor rf
    JOIN Room r        ON rf.room_ID   = r.room_ID
    JOIN Hotel h       ON r.hotel_ID   = h.hotel_ID
    JOIN HotelChain hc ON h.chain_ID   = hc.chain_ID
    WHERE rf.booking_ID = OLD.booking_ID
    LIMIT 1;

    SELECT name INTO c_name FROM Customer WHERE customer_ID = OLD.customer_ID;

    INSERT INTO BookingArchive (
        archive_ID, customer_name, customer_ID, original_booking,
        hotel_name, chain_name, room_number, "start", "end"
    ) VALUES (
        nextval('booking_archive_seq'),
        c_name, OLD.customer_ID, OLD.booking_ID,
        h_name, ch_name, r_num, OLD."start", OLD."end"
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS booking_archive_seq START 1;

CREATE TRIGGER trg_archive_booking
BEFORE DELETE ON Booking
FOR EACH ROW EXECUTE FUNCTION archive_booking();


-- Trigger 5: archive a renting before it is deleted
CREATE OR REPLACE FUNCTION archive_renting()
RETURNS TRIGGER AS $$
DECLARE
    h_name  VARCHAR(100);
    c_name  VARCHAR(100);
    ch_name VARCHAR(100);
    r_num   INTEGER;
    e_name  VARCHAR(100);
BEGIN
    SELECT r.room_num, h.name, hc.name
    INTO r_num, h_name, ch_name
    FROM Room r
    JOIN Hotel h       ON r.hotel_ID = h.hotel_ID
    JOIN HotelChain hc ON h.chain_ID = hc.chain_ID
    WHERE r.room_ID = OLD.room_ID;

    SELECT name INTO c_name FROM Customer WHERE customer_ID = OLD.customer_ID;

    e_name := '';

    INSERT INTO RentingArchive (
        archive_ID, customer_name, customer_ID, original_renting,
        hotel_name, chain_name, room_number, employee, "start", "end"
    ) VALUES (
        nextval('renting_archive_seq'),
        c_name, OLD.customer_ID, OLD.renting_ID,
        h_name, ch_name, r_num, e_name, OLD."start", OLD."end"
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS renting_archive_seq START 1;

CREATE TRIGGER trg_archive_renting
BEFORE DELETE ON Renting
FOR EACH ROW EXECUTE FUNCTION archive_renting();
