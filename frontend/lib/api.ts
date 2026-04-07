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

const BASE = "http://localhost:3001/api";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Hotel Chains ─────────────────────────────────────────────────────────────

export function getHotelChains(): Promise<HotelChain[]> {
  return req("/chains");
}

export function createHotelChain(data: Omit<HotelChain, "chain_ID">): Promise<HotelChain> {
  return req("/chains", { method: "POST", body: JSON.stringify(data) });
}

export function updateHotelChain(chain_ID: number, data: Partial<HotelChain>): Promise<HotelChain> {
  return req(`/chains/${chain_ID}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteHotelChain(chain_ID: number): Promise<void> {
  return req(`/chains/${chain_ID}`, { method: "DELETE" });
}

// ─── Hotels ───────────────────────────────────────────────────────────────────

export function getHotels(): Promise<Hotel[]> {
  return req("/hotels");
}

export function getHotelsByChain(chain_ID: number): Promise<Hotel[]> {
  return req(`/hotels?chain_id=${chain_ID}`);
}

export function createHotel(data: Omit<Hotel, "hotel_ID">): Promise<Hotel> {
  return req("/hotels", { method: "POST", body: JSON.stringify(data) });
}

export function updateHotel(hotel_ID: number, data: Partial<Hotel>): Promise<Hotel> {
  return req(`/hotels/${hotel_ID}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteHotel(hotel_ID: number): Promise<void> {
  return req(`/hotels/${hotel_ID}`, { method: "DELETE" });
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export function getRooms(hotel_ID?: number): Promise<Room[]> {
  return req(hotel_ID ? `/rooms?hotel_id=${hotel_ID}` : "/rooms");
}

export function createRoom(data: Omit<Room, "room_ID">): Promise<Room> {
  return req("/rooms", { method: "POST", body: JSON.stringify(data) });
}

export function updateRoom(room_ID: number, data: Partial<Room>): Promise<Room> {
  return req(`/rooms/${room_ID}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteRoom(room_ID: number): Promise<void> {
  return req(`/rooms/${room_ID}`, { method: "DELETE" });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function getCustomers(): Promise<Customer[]> {
  return req("/customers");
}

export function getCustomerById(customer_ID: number): Promise<Customer | null> {
  return req<Customer>(`/customers/${customer_ID}`).catch(() => null);
}

export function createCustomer(data: Omit<Customer, "customer_ID">): Promise<Customer> {
  return req("/customers", { method: "POST", body: JSON.stringify(data) });
}

export function updateCustomer(customer_ID: number, data: Partial<Customer>): Promise<Customer> {
  return req(`/customers/${customer_ID}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteCustomer(customer_ID: number): Promise<void> {
  return req(`/customers/${customer_ID}`, { method: "DELETE" });
}

// ─── Employees ────────────────────────────────────────────────────────────────

export function getEmployees(hotel_ID?: number): Promise<Employee[]> {
  return req(hotel_ID ? `/employees?hotel_id=${hotel_ID}` : "/employees");
}

export function createEmployee(data: Omit<Employee, "employee_ID">): Promise<Employee> {
  return req("/employees", { method: "POST", body: JSON.stringify(data) });
}

export function updateEmployee(employee_ID: number, data: Partial<Employee>): Promise<Employee> {
  return req(`/employees/${employee_ID}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteEmployee(employee_ID: number): Promise<void> {
  return req(`/employees/${employee_ID}`, { method: "DELETE" });
}

// ─── Room Search ──────────────────────────────────────────────────────────────

export function searchRooms(filters: SearchFilters): Promise<RoomSearchResult[]> {
  const params = new URLSearchParams();
  if (filters.start_date)        params.set("start_date", filters.start_date);
  if (filters.end_date)          params.set("end_date",   filters.end_date);
  if (filters.capacity)          params.set("capacity",   filters.capacity);
  if (filters.area)              params.set("area",       filters.area);
  if (filters.chain_ID !== "")   params.set("chain_id",  String(filters.chain_ID));
  if (filters.star_cat  !== "")  params.set("star_cat",  String(filters.star_cat));
  if (filters.min_rooms !== "")  params.set("min_rooms", String(filters.min_rooms));
  if (filters.max_price !== "")  params.set("max_price", String(filters.max_price));
  return req(`/rooms/search?${params.toString()}`);
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export function getBookings(customer_ID?: number): Promise<Booking[]> {
  return req(customer_ID ? `/bookings?customer_id=${customer_ID}` : "/bookings");
}

export function getActiveBookings(): Promise<Booking[]> {
  return req("/bookings?active=true");
}

export function createBooking(data: {
  customer_ID: number;
  room_ID: number;
  hotel_ID: number;
  start_date: string;
  end_date: string;
}): Promise<Booking> {
  return req("/bookings", { method: "POST", body: JSON.stringify(data) });
}

export function cancelBooking(booking_ID: number): Promise<void> {
  return req(`/bookings/${booking_ID}/cancel`, { method: "PUT" });
}

// ─── Rentings ─────────────────────────────────────────────────────────────────

export function getRentings(customer_ID?: number): Promise<Renting[]> {
  return req(customer_ID ? `/rentings?customer_id=${customer_ID}` : "/rentings");
}

export function convertBookingToRenting(booking_ID: number, employee_ID: number): Promise<Renting> {
  return req("/rentings/from-booking", {
    method: "POST",
    body: JSON.stringify({ booking_ID, employee_ID }),
  });
}

export function createWalkInRenting(data: {
  customer_ID: number;
  room_ID: number;
  hotel_ID: number;
  employee_ID: number;
  start_date: string;
  end_date: string;
}): Promise<Renting> {
  return req("/rentings", { method: "POST", body: JSON.stringify(data) });
}

export function addPayment(renting_ID: number, amount: number, paymentMethod: string): Promise<Renting> {
  return req(`/rentings/${renting_ID}/payment`, {
    method: "PUT",
    body: JSON.stringify({ amount, method: paymentMethod }),
  });
}

// ─── SQL Views ────────────────────────────────────────────────────────────────

export function getAvailableRoomsPerArea(): Promise<AvailableRoomsPerArea[]> {
  return req("/views/available-rooms-per-area");
}

export function getHotelCapacities(): Promise<HotelCapacity[]> {
  return req("/views/hotel-capacities");
}
