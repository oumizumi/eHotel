"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { searchRooms, getHotelChains, createBooking, getCustomers } from "@/lib/api";
import type { RoomSearchResult, SearchFilters, HotelChain, Customer } from "@/types";
import { AREAS, CAPACITIES } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";

const DEFAULT_FILTERS: SearchFilters = {
  start_date: "", end_date: "", capacity: "", area: "",
  chain_ID: "", star_cat: "", min_rooms: "", max_price: "",
};

export default function SearchPage() {
  const [filters, setFilters]       = useState<SearchFilters>(DEFAULT_FILTERS);
  const [results, setResults]       = useState<RoomSearchResult[]>([]);
  const [chains, setChains]         = useState<HotelChain[]>([]);
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [loading, setLoading]       = useState(false);
  const [bookingRoom, setBookingRoom] = useState<RoomSearchResult | null>(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    getHotelChains().then(setChains);
    getCustomers().then((c) => { setCustomers(c); if (c.length > 0) setSelectedCustomer(c[0].customer_ID); });
  }, []);

  const runSearch = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    try { setResults(await searchRooms(f)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { runSearch(filters); }, [filters, runSearch]);

  function set<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  async function handleBook() {
    if (!bookingRoom || !filters.start_date || !filters.end_date || selectedCustomer === "") return;
    setBookingLoading(true);
    setBookingError(null);
    try {
      await createBooking({
        customer_ID: selectedCustomer,
        room_ID: bookingRoom.room_ID,
        hotel_ID: bookingRoom.hotel_ID,
        start_date: filters.start_date,
        end_date: filters.end_date,
      });
      setBookingDone(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  const nights =
    filters.start_date && filters.end_date
      ? Math.max(1, Math.ceil((new Date(filters.end_date).getTime() - new Date(filters.start_date).getTime()) / 86400000))
      : null;

  return (
    <div className="flex gap-7">
      {/* ── Filter sidebar ── */}
      <aside className="w-64 shrink-0">
        <div className="bg-white border border-moss-200 rounded-xl p-5 sticky top-20 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-moss-900">Filters</h2>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs text-moss-800 hover:underline font-medium"
            >
              Clear all
            </button>
          </div>

          <FilterSection label="Dates">
            <input
              type="date" value={filters.start_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("start_date", e.target.value)}
              className={inp}
            />
            <input
              type="date" value={filters.end_date}
              min={filters.start_date || new Date().toISOString().split("T")[0]}
              onChange={(e) => set("end_date", e.target.value)}
              className={inp}
            />
          </FilterSection>

          <FilterSection label="City">
            <CustomSelect
              value={filters.area}
              onChange={(v) => set("area", v)}
              options={[{ value: "", label: "All cities" }, ...AREAS.map((a) => ({ value: a, label: a }))]}
              variant="tight"
            />
          </FilterSection>

          <FilterSection label="Hotel Chain">
            <CustomSelect
              value={filters.chain_ID}
              onChange={(v) => set("chain_ID", v === "" ? "" : Number(v))}
              options={[{ value: "", label: "All chains" }, ...chains.map((c) => ({ value: c.chain_ID, label: c.name }))]}
              variant="tight"
            />
          </FilterSection>

          <FilterSection label="Star Category">
            <div className="flex flex-wrap gap-1.5">
              {["", 1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => set("star_cat", s === "" ? "" : Number(s))}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    filters.star_cat === (s === "" ? "" : Number(s))
                      ? "bg-moss-800 text-white border-moss-800"
                      : "border-moss-300 text-moss-600 hover:border-moss-400 bg-white"
                  }`}
                >
                  {s === "" ? "Any" : `${s}★`}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection label="Capacity">
            <CustomSelect
              value={filters.capacity}
              onChange={(v) => set("capacity", v as SearchFilters["capacity"])}
              options={[{ value: "", label: "Any" }, ...CAPACITIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))]}
              variant="tight"
            />
          </FilterSection>

          <FilterSection label={`Max price${filters.max_price !== "" ? ` — $${filters.max_price}/night` : ""}`}>
            <input
              type="range" min={50} max={1000} step={10}
              value={filters.max_price === "" ? 1000 : Number(filters.max_price)}
              onChange={(e) => set("max_price", Number(e.target.value) === 1000 ? "" : Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-moss-600">
              <span>$50</span><span>$1000+</span>
            </div>
          </FilterSection>

          <FilterSection label="Min rooms in hotel">
            <input
              type="number" min={1} max={20} placeholder="Any"
              value={filters.min_rooms}
              onChange={(e) => set("min_rooms", e.target.value === "" ? "" : Number(e.target.value))}
              className={inp}
            />
          </FilterSection>
        </div>
      </aside>

      {/* ── Results ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-semibold text-moss-900">Available Rooms</h1>
          <span className="text-sm text-moss-600">
            {loading ? "Searching..." : `${results.length} room${results.length !== 1 ? "s" : ""} found`}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white border border-moss-200 rounded-xl p-16 text-center">
            <p className="text-sm text-moss-600 mb-1">No rooms match your filters.</p>
            <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-sm text-moss-800 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((room) => (
              <RoomCard
                key={room.room_ID}
                room={room}
                onBook={() => { setBookingRoom(room); setBookingDone(false); setBookingError(null); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Booking modal ── */}
      {bookingRoom && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {bookingDone ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-moss-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-moss-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-moss-900 mb-2">Booking Confirmed</h3>
                <p className="text-sm text-moss-700 mb-6">
                  Room {bookingRoom.room_num} at {bookingRoom.hotel_name} —{" "}
                  {filters.start_date} to {filters.end_date}<br />
                  <span className="text-moss-600">for {customers.find(c => c.customer_ID === selectedCustomer)?.name ?? `Customer #${selectedCustomer}`}</span>
                </p>
                <button
                  onClick={() => setBookingRoom(null)}
                  className="bg-moss-800 hover:bg-moss-700 text-white hover:text-white focus:outline-none font-semibold px-6 py-2.5 rounded-lg text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-moss-100 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-moss-900">Confirm Booking</h3>
                  <button onClick={() => setBookingRoom(null)} className="text-moss-600 hover:text-moss-600 text-xl leading-none">&times;</button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-moss-700 uppercase tracking-widest mb-1.5">Customer</p>
                    <CustomSelect
                      value={selectedCustomer}
                      onChange={(v) => setSelectedCustomer(v === "" ? "" : Number(v))}
                      options={[{ value: "", label: "Select customer..." }, ...customers.map((c) => ({ value: c.customer_ID, label: `${c.name} (ID ${c.customer_ID})` }))]}
                    />
                  </div>
                  <div className="bg-moss-50 rounded-lg p-4 space-y-2.5 text-sm">
                    <Row label="Hotel"    value={bookingRoom.hotel_name} />
                    <Row label="Room"     value={`#${bookingRoom.room_num}`} />
                    <Row label="Capacity" value={cap(bookingRoom.capacity)} />
                    <Row label="View"     value={cap(bookingRoom.view_type)} />
                    {filters.start_date && <Row label="Check-In"  value={filters.start_date} />}
                    {filters.end_date   && <Row label="Check-Out" value={filters.end_date} />}
                    <div className="border-t border-moss-200 pt-2.5">
                      <Row
                        label="Total"
                        value={`$${bookingRoom.price * (nights ?? 1)} ${nights ? `(${nights} night${nights > 1 ? "s" : ""})` : ""}`}
                        bold
                      />
                    </div>
                  </div>
                  {(!filters.start_date || !filters.end_date) && (
                    <p className="text-xs text-moss-600 bg-moss-50 border border-moss-200 rounded-lg px-3 py-2">
                      Select check-in and check-out dates in the filter panel first.
                    </p>
                  )}
                  {bookingError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {bookingError}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setBookingRoom(null)} className="flex-1 border border-moss-300 rounded-lg py-2.5 text-sm font-medium hover:bg-moss-50">Cancel</button>
                    <button
                      onClick={handleBook}
                      disabled={!filters.start_date || !filters.end_date || selectedCustomer === "" || bookingLoading}
                      className="flex-1 bg-moss-800 hover:bg-moss-900 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-semibold"
                    >
                      {bookingLoading ? "Booking..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function RoomCard({ room, onBook }: { room: RoomSearchResult; onBook: () => void }) {
  return (
    <div className="bg-white border border-moss-200 rounded-xl p-5 flex items-start justify-between gap-6 hover:border-moss-300 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-moss-900 text-sm">{room.hotel_name}</span>
          <Stars n={room.star_cat} />
          <span className="text-moss-600 text-xs font-medium">{room.chain_name}</span>
        </div>
        <p className="text-xs text-moss-700 font-medium mb-3">
          {room.hotel_area} &middot; Room {room.room_num} &middot; {room.hotel_num_rooms} rooms in hotel
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge>{cap(room.capacity)}</Badge>
          {room.view_type !== "none" && <Badge color="blue">{cap(room.view_type)} View</Badge>}
          {room.extendable && <Badge color="violet">Extendable</Badge>}
          {room.amenities.map((a) => <Badge key={a}>{a}</Badge>)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-moss-900">${room.price}</p>
        <p className="text-xs text-moss-600 font-medium mb-3">per night</p>
        <button
          onClick={onBook}
          className="bg-moss-800 hover:bg-moss-700 text-white hover:text-white focus:outline-none text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Book
        </button>
      </div>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-moss-700 uppercase tracking-widest">{label}</p>
      {children}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-sm leading-none" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n).split("").map((_, i) => (
        <span key={i} style={{ color: "#F59E0B" }}>★</span>
      ))}
      {"★".repeat(5 - n).split("").map((_, i) => (
        <span key={i} style={{ color: "#D1D5DB" }}>★</span>
      ))}
    </span>
  );
}

function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: "gray" | "blue" | "violet" }) {
  const cls = {
    gray:   "bg-moss-100 text-moss-600",
    blue:   "bg-moss-50 text-moss-700",
    violet: "bg-moss-50 text-moss-700",
  }[color];
  return <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${cls}`}>{children}</span>;
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-moss-700">{label}</span>
      <span className={bold ? "font-bold text-moss-900" : "font-medium text-moss-700"}>{value}</span>
    </div>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

const inp = "w-full border border-moss-300 rounded-lg px-3 py-2 text-sm font-medium text-moss-900 focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent bg-white placeholder:text-moss-500";
