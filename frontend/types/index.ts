// ─── Hotel Chain ─────────────────────────────────────────────────────────────

export interface HotelChain {
  chain_ID: number;
  name: string;
  num_hotels: number;
  address: string;
  emails: string[];
  phones: string[];
}

// ─── Hotel ────────────────────────────────────────────────────────────────────

export interface Hotel {
  hotel_ID: number;
  chain_ID: number;
  name: string;
  address: string;
  area: string; // derived from address (city)
  star_cat: number; // 1–5
  num_rooms: number;
  manager_ID: number | null;
  emails: string[];
  phones: string[];
}

// ─── Room ─────────────────────────────────────────────────────────────────────

export type RoomCapacity = "single" | "double" | "triple" | "quad" | "suite";
export type ViewType = "sea" | "mountain" | "none";

export interface Room {
  room_ID: number;
  hotel_ID: number;
  room_num: number;
  price: number;
  capacity: RoomCapacity;
  view_type: ViewType;
  damaged: boolean;
  extendable: boolean;
  amenities: string[];
  damages:   string[];
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export type IDType = "SIN" | "Passport" | "DL";

export interface Customer {
  customer_ID: number;
  name: string;
  address: string;
  ID_type: IDType;
  ID_num: string;
  date: string; // ISO date string
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface Employee {
  employee_ID: number;
  hotel_ID: number;
  name: string;
  address: string;
  SSN: string;
  position: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export type BookingStatus = "active" | "archived" | "completed" | "cancelled";

export interface Booking {
  booking_ID: number;
  customer_ID: number;
  room_ID: number;
  hotel_ID: number;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  // joined fields for display
  customer_name?: string;
  room_num?: number;
  hotel_name?: string;
}

// ─── Renting ──────────────────────────────────────────────────────────────────

export interface Renting {
  renting_ID: number;
  booking_ID: number | null; // null = walk-in
  customer_ID: number;
  room_ID: number;
  hotel_ID: number;
  employee_ID: number;
  start_date: string;
  end_date: string;
  payment: number | null;
  // joined fields
  customer_name?: string;
  room_num?: number;
  hotel_name?: string;
  employee_name?: string;
}

// ─── Search Filters ───────────────────────────────────────────────────────────

export interface SearchFilters {
  start_date: string;
  end_date: string;
  capacity: RoomCapacity | "";
  area: string;
  chain_ID: number | "";
  star_cat: number | "";
  min_rooms: number | "";
  max_price: number | "";
}

// ─── Views ────────────────────────────────────────────────────────────────────

export interface AvailableRoomsPerArea {
  area: string;
  available_rooms: number;
}

export interface HotelCapacity {
  hotel_ID: number;
  hotel_name: string;
  chain_name: string;
  star_cat: number;
  total_capacity: number; // sum of all room capacities (as numbers)
  room_count: number;
}

// ─── Search Result ────────────────────────────────────────────────────────────

export interface RoomSearchResult extends Room {
  hotel_name: string;
  hotel_area: string;
  chain_name: string;
  chain_ID: number;
  star_cat: number;
  hotel_num_rooms: number;
}
