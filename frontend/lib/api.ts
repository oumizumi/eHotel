/**
 * Mock API layer — replace each function body with a real fetch() call
 * once the backend is ready. All signatures stay the same.
 */

import {
  hotelChains,
  hotels,
  rooms,
  customers,
  employees,
  bookings,
  rentings,
  CAPACITY_NUMERIC,
} from "@/lib/mockData";
import type {
  HotelChain,
  Hotel,
  Room,
  Customer,
  Employee,
  Booking,
  Renting,
  SearchFilters,
  RoomSearchResult,
  AvailableRoomsPerArea,
  HotelCapacity,
} from "@/types";

// ─── Utility ──────────────────────────────────────────────────────────────────

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms));
}

// Generate incrementing IDs (mock)
let nextCustomerID = 16;
let nextEmployeeID = 9100;
let nextRoomID = 200;
let nextBookingID = 10;
let nextRentingID = 5;

// ─── Hotel Chains ─────────────────────────────────────────────────────────────

export async function getHotelChains(): Promise<HotelChain[]> {
  await delay();
  return [...hotelChains];
}

export async function createHotelChain(data: Omit<HotelChain, "chain_ID">): Promise<HotelChain> {
  await delay();
  const newChain: HotelChain = { ...data, chain_ID: hotelChains.length + 10 };
  hotelChains.push(newChain);
  return newChain;
}

export async function updateHotelChain(chain_ID: number, data: Partial<HotelChain>): Promise<HotelChain> {
  await delay();
  const idx = hotelChains.findIndex((c) => c.chain_ID === chain_ID);
  if (idx === -1) throw new Error("Chain not found");
  hotelChains[idx] = { ...hotelChains[idx], ...data };
  return hotelChains[idx];
}

export async function deleteHotelChain(chain_ID: number): Promise<void> {
  await delay();
  const idx = hotelChains.findIndex((c) => c.chain_ID === chain_ID);
  if (idx !== -1) hotelChains.splice(idx, 1);
}

// ─── Hotels ───────────────────────────────────────────────────────────────────

export async function getHotels(): Promise<Hotel[]> {
  await delay();
  return [...hotels];
}

export async function getHotelsByChain(chain_ID: number): Promise<Hotel[]> {
  await delay();
  return hotels.filter((h) => h.chain_ID === chain_ID);
}

export async function createHotel(data: Omit<Hotel, "hotel_ID">): Promise<Hotel> {
  await delay();
  const newHotel: Hotel = { ...data, hotel_ID: hotels.length + 600 };
  hotels.push(newHotel);
  return newHotel;
}

export async function updateHotel(hotel_ID: number, data: Partial<Hotel>): Promise<Hotel> {
  await delay();
  const idx = hotels.findIndex((h) => h.hotel_ID === hotel_ID);
  if (idx === -1) throw new Error("Hotel not found");
  hotels[idx] = { ...hotels[idx], ...data };
  return hotels[idx];
}

export async function deleteHotel(hotel_ID: number): Promise<void> {
  await delay();
  const idx = hotels.findIndex((h) => h.hotel_ID === hotel_ID);
  if (idx !== -1) hotels.splice(idx, 1);
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export async function getRooms(hotel_ID?: number): Promise<Room[]> {
  await delay();
  return hotel_ID ? rooms.filter((r) => r.hotel_ID === hotel_ID) : [...rooms];
}

export async function createRoom(data: Omit<Room, "room_ID">): Promise<Room> {
  await delay();
  const newRoom: Room = { ...data, room_ID: nextRoomID++ };
  rooms.push(newRoom);
  return newRoom;
}

export async function updateRoom(room_ID: number, data: Partial<Room>): Promise<Room> {
  await delay();
  const idx = rooms.findIndex((r) => r.room_ID === room_ID);
  if (idx === -1) throw new Error("Room not found");
  rooms[idx] = { ...rooms[idx], ...data };
  return rooms[idx];
}

export async function deleteRoom(room_ID: number): Promise<void> {
  await delay();
  const idx = rooms.findIndex((r) => r.room_ID === room_ID);
  if (idx !== -1) rooms.splice(idx, 1);
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  await delay();
  return [...customers];
}

export async function getCustomerById(customer_ID: number): Promise<Customer | null> {
  await delay();
  return customers.find((c) => c.customer_ID === customer_ID) ?? null;
}

export async function createCustomer(data: Omit<Customer, "customer_ID">): Promise<Customer> {
  await delay();
  const newCustomer: Customer = { ...data, customer_ID: nextCustomerID++ };
  customers.push(newCustomer);
  return newCustomer;
}

export async function updateCustomer(customer_ID: number, data: Partial<Customer>): Promise<Customer> {
  await delay();
  const idx = customers.findIndex((c) => c.customer_ID === customer_ID);
  if (idx === -1) throw new Error("Customer not found");
  customers[idx] = { ...customers[idx], ...data };
  return customers[idx];
}

export async function deleteCustomer(customer_ID: number): Promise<void> {
  await delay();
  const idx = customers.findIndex((c) => c.customer_ID === customer_ID);
  if (idx !== -1) customers.splice(idx, 1);
}

// ─── Employees ────────────────────────────────────────────────────────────────

export async function getEmployees(hotel_ID?: number): Promise<Employee[]> {
  await delay();
  return hotel_ID
    ? employees.filter((e) => e.hotel_ID === hotel_ID)
    : [...employees];
}

export async function createEmployee(data: Omit<Employee, "employee_ID">): Promise<Employee> {
  await delay();
  const newEmployee: Employee = { ...data, employee_ID: nextEmployeeID++ };
  employees.push(newEmployee);
  return newEmployee;
}

export async function updateEmployee(employee_ID: number, data: Partial<Employee>): Promise<Employee> {
  await delay();
  const idx = employees.findIndex((e) => e.employee_ID === employee_ID);
  if (idx === -1) throw new Error("Employee not found");
  employees[idx] = { ...employees[idx], ...data };
  return employees[idx];
}

export async function deleteEmployee(employee_ID: number): Promise<void> {
  await delay();
  const idx = employees.findIndex((e) => e.employee_ID === employee_ID);
  if (idx !== -1) employees.splice(idx, 1);
}

// ─── Room Search ──────────────────────────────────────────────────────────────

export async function searchRooms(filters: SearchFilters): Promise<RoomSearchResult[]> {
  await delay(300);

  // Rooms already booked/rented in the date range
  const overlappingRoomIDs = new Set<number>();
  const filterStart = filters.start_date ? new Date(filters.start_date) : null;
  const filterEnd   = filters.end_date   ? new Date(filters.end_date)   : null;

  if (filterStart && filterEnd) {
    for (const b of bookings) {
      if (b.status === "active") {
        const bs = new Date(b.start_date);
        const be = new Date(b.end_date);
        if (bs < filterEnd && be > filterStart) {
          overlappingRoomIDs.add(b.room_ID);
        }
      }
    }
    for (const r of rentings) {
      const rs = new Date(r.start_date);
      const re = new Date(r.end_date);
      if (rs < filterEnd && re > filterStart) {
        overlappingRoomIDs.add(r.room_ID);
      }
    }
  }

  const results: RoomSearchResult[] = [];

  for (const room of rooms) {
    if (room.damaged) continue;
    if (overlappingRoomIDs.has(room.room_ID)) continue;
    if (filters.capacity && room.capacity !== filters.capacity) continue;
    if (filters.max_price !== "" && room.price > Number(filters.max_price)) continue;

    const hotel = hotels.find((h) => h.hotel_ID === room.hotel_ID);
    if (!hotel) continue;

    if (filters.area && hotel.area !== filters.area) continue;
    if (filters.chain_ID !== "" && hotel.chain_ID !== Number(filters.chain_ID)) continue;
    if (filters.star_cat !== "" && hotel.star_cat !== Number(filters.star_cat)) continue;
    if (filters.min_rooms !== "" && hotel.num_rooms < Number(filters.min_rooms)) continue;

    const chain = hotelChains.find((c) => c.chain_ID === hotel.chain_ID);

    results.push({
      ...room,
      hotel_name: hotel.name,
      hotel_area: hotel.area,
      chain_name: chain?.name ?? "",
      chain_ID: hotel.chain_ID,
      star_cat: hotel.star_cat,
      hotel_num_rooms: hotel.num_rooms,
    });
  }

  return results;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookings(customer_ID?: number): Promise<Booking[]> {
  await delay();
  return customer_ID
    ? bookings.filter((b) => b.customer_ID === customer_ID)
    : [...bookings];
}

export async function getActiveBookings(): Promise<Booking[]> {
  await delay();
  return bookings.filter((b) => b.status === "active");
}

export async function createBooking(data: {
  customer_ID: number;
  room_ID: number;
  hotel_ID: number;
  start_date: string;
  end_date: string;
}): Promise<Booking> {
  await delay();
  const customer = customers.find((c) => c.customer_ID === data.customer_ID);
  const room = rooms.find((r) => r.room_ID === data.room_ID);
  const hotel = hotels.find((h) => h.hotel_ID === data.hotel_ID);

  const newBooking: Booking = {
    ...data,
    booking_ID: nextBookingID++,
    status: "active",
    customer_name: customer?.name,
    room_num: room?.room_num,
    hotel_name: hotel?.name,
  };
  bookings.push(newBooking);
  return newBooking;
}

export async function cancelBooking(booking_ID: number): Promise<void> {
  await delay();
  const idx = bookings.findIndex((b) => b.booking_ID === booking_ID);
  if (idx !== -1) bookings[idx].status = "cancelled";
}

// ─── Rentings ─────────────────────────────────────────────────────────────────

export async function getRentings(customer_ID?: number): Promise<Renting[]> {
  await delay();
  return customer_ID
    ? rentings.filter((r) => r.customer_ID === customer_ID)
    : [...rentings];
}

/** Convert a booking to a renting (check-in) */
export async function convertBookingToRenting(
  booking_ID: number,
  employee_ID: number
): Promise<Renting> {
  await delay();
  const bookingIdx = bookings.findIndex((b) => b.booking_ID === booking_ID);
  if (bookingIdx === -1) throw new Error("Booking not found");

  const booking = bookings[bookingIdx];
  const customer = customers.find((c) => c.customer_ID === booking.customer_ID);
  const room = rooms.find((r) => r.room_ID === booking.room_ID);
  const hotel = hotels.find((h) => h.hotel_ID === booking.hotel_ID);
  const employee = employees.find((e) => e.employee_ID === employee_ID);

  const newRenting: Renting = {
    renting_ID: nextRentingID++,
    booking_ID: booking_ID,
    customer_ID: booking.customer_ID,
    room_ID: booking.room_ID,
    hotel_ID: booking.hotel_ID,
    employee_ID: employee_ID,
    start_date: booking.start_date,
    end_date: booking.end_date,
    payment: null,
    customer_name: customer?.name,
    room_num: room?.room_num,
    hotel_name: hotel?.name,
    employee_name: employee?.name,
  };

  // Archive the booking
  bookings[bookingIdx].status = "archived";
  rentings.push(newRenting);
  return newRenting;
}

/** Direct walk-in renting (no prior booking) */
export async function createWalkInRenting(data: {
  customer_ID: number;
  room_ID: number;
  hotel_ID: number;
  employee_ID: number;
  start_date: string;
  end_date: string;
}): Promise<Renting> {
  await delay();
  const customer = customers.find((c) => c.customer_ID === data.customer_ID);
  const room = rooms.find((r) => r.room_ID === data.room_ID);
  const hotel = hotels.find((h) => h.hotel_ID === data.hotel_ID);
  const employee = employees.find((e) => e.employee_ID === data.employee_ID);

  const newRenting: Renting = {
    ...data,
    renting_ID: nextRentingID++,
    booking_ID: null,
    payment: null,
    customer_name: customer?.name,
    room_num: room?.room_num,
    hotel_name: hotel?.name,
    employee_name: employee?.name,
  };
  rentings.push(newRenting);
  return newRenting;
}

/** Add / update payment for a renting */
export async function addPayment(renting_ID: number, amount: number): Promise<Renting> {
  await delay();
  const idx = rentings.findIndex((r) => r.renting_ID === renting_ID);
  if (idx === -1) throw new Error("Renting not found");
  rentings[idx].payment = amount;
  return rentings[idx];
}

// ─── SQL Views ────────────────────────────────────────────────────────────────

/** View 1 — number of available rooms per area */
export async function getAvailableRoomsPerArea(): Promise<AvailableRoomsPerArea[]> {
  await delay(300);

  const today = new Date();
  const occupiedRoomIDs = new Set<number>();

  for (const b of bookings) {
    if (b.status === "active") {
      const bs = new Date(b.start_date);
      const be = new Date(b.end_date);
      if (bs <= today && be >= today) occupiedRoomIDs.add(b.room_ID);
    }
  }
  for (const r of rentings) {
    const rs = new Date(r.start_date);
    const re = new Date(r.end_date);
    if (rs <= today && re >= today) occupiedRoomIDs.add(r.room_ID);
  }

  const areaMap: Record<string, number> = {};
  for (const room of rooms) {
    if (room.damaged) continue;
    if (occupiedRoomIDs.has(room.room_ID)) continue;
    const hotel = hotels.find((h) => h.hotel_ID === room.hotel_ID);
    if (!hotel) continue;
    areaMap[hotel.area] = (areaMap[hotel.area] ?? 0) + 1;
  }

  return Object.entries(areaMap)
    .map(([area, available_rooms]) => ({ area, available_rooms }))
    .sort((a, b) => b.available_rooms - a.available_rooms);
}

/** View 2 — aggregated room capacity per hotel */
export async function getHotelCapacities(): Promise<HotelCapacity[]> {
  await delay(200);

  return hotels.map((hotel) => {
    const hotelRooms = rooms.filter((r) => r.hotel_ID === hotel.hotel_ID);
    const totalCapacity = hotelRooms.reduce(
      (sum, r) => sum + CAPACITY_NUMERIC[r.capacity],
      0
    );
    const chain = hotelChains.find((c) => c.chain_ID === hotel.chain_ID);
    return {
      hotel_ID: hotel.hotel_ID,
      hotel_name: hotel.name,
      chain_name: chain?.name ?? "",
      star_cat: hotel.star_cat,
      total_capacity: totalCapacity,
      room_count: hotelRooms.length,
    };
  }).sort((a, b) => b.total_capacity - a.total_capacity);
}
