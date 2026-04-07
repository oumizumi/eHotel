"use client";

import { useState, useEffect } from "react";
import { getBookings, cancelBooking } from "@/lib/api";
import { PageHeader, SearchBar } from "@/app/manage/customers/page";
import type { Booking, BookingStatus } from "@/types";

const STATUS_COLORS: Record<BookingStatus, string> = {
  active:    "bg-emerald-50 text-emerald-700 border-emerald-100",
  archived:  "bg-moss-50 text-moss-700 border-moss-100",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function BookingsPage() {
  const [data, setData]         = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [cancelling, setCancelling] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setData(await getBookings());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCancel(b: Booking) {
    if (!confirm(`Cancel booking #${b.booking_ID} for ${b.customer_name}?`)) return;
    setCancelling(b.booking_ID);
    try { await cancelBooking(b.booking_ID); load(); }
    finally { setCancelling(null); }
  }

  const filtered = data
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .filter((b) =>
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.hotel_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(b.booking_ID).includes(search)
    );

  return (
    <div>
      <PageHeader title="All Bookings" count={filtered.length}>
        <div className="flex gap-1 bg-moss-50 border border-moss-100 rounded-lg p-1">
          {(["all", "active", "archived", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? "bg-white text-moss-900 shadow-sm"
                  : "text-moss-600 hover:text-moss-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </PageHeader>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by guest name, hotel, or booking ID..." />

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-moss-100 rounded-xl p-12 text-center">
          <p className="text-sm text-moss-600">No bookings found.</p>
        </div>
      ) : (
        <div className="bg-white border border-moss-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-moss-100 bg-moss-50">
                {["#", "Guest", "Hotel", "Room", "Check-in", "Check-out", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-moss-700 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-moss-50">
              {filtered.map((b) => (
                <tr key={b.booking_ID} className="hover:bg-moss-50/50 transition-colors">
                  <td className="px-4 py-3 text-moss-500 font-mono text-xs">#{b.booking_ID}</td>
                  <td className="px-4 py-3 font-medium text-moss-900">{b.customer_name ?? `Customer #${b.customer_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{b.hotel_name ?? `Hotel #${b.hotel_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{b.room_num != null ? `Room ${b.room_num}` : `#${b.room_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{b.start_date}</td>
                  <td className="px-4 py-3 text-moss-700">{b.end_date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {b.status === "active" && (
                      <button
                        onClick={() => handleCancel(b)}
                        disabled={cancelling === b.booking_ID}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-40 transition-colors"
                      >
                        {cancelling === b.booking_ID ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
