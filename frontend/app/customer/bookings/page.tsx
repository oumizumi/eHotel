"use client";

import { useState, useEffect } from "react";
import { getBookings, cancelBooking } from "@/lib/api";
import type { Booking } from "@/types";

const DEMO_CUSTOMER_ID = 1;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setBookings(await getBookings(DEMO_CUSTOMER_ID));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCancel(id: number) {
    setCancelling(id);
    await cancelBooking(id);
    setCancelling(null);
    load();
  }

  const active   = bookings.filter((b) => b.status === "active");
  const archived = bookings.filter((b) => b.status !== "active");

  if (loading) return <Centered><Spinner /></Centered>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-moss-900 mb-7">My Bookings</h1>

      <Section title="Active" count={active.length}>
        {active.length === 0
          ? <Empty text="No active bookings." />
          : active.map((b) => (
            <BookingCard key={b.booking_ID} booking={b}
              onCancel={() => handleCancel(b.booking_ID)}
              cancelling={cancelling === b.booking_ID}
            />
          ))
        }
      </Section>

      <Section title="Past" count={archived.length}>
        {archived.length === 0
          ? <Empty text="No past bookings." />
          : archived.map((b) => <BookingCard key={b.booking_ID} booking={b} />)
        }
      </Section>
    </div>
  );
}

function BookingCard({ booking, onCancel, cancelling }: {
  booking: Booking; onCancel?: () => void; cancelling?: boolean;
}) {
  const statusMap: Record<string, string> = {
    active:   "bg-moss-50 text-moss-700 border-moss-200",
    archived: "bg-moss-100 text-moss-700 border-moss-200",
    cancelled:"bg-red-50 text-red-600 border-red-200",
  };
  const cls = statusMap[booking.status] ?? statusMap.archived;

  return (
    <div className="bg-white border border-moss-200 rounded-xl p-5 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-moss-900 text-sm">{booking.hotel_name}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
            {booking.status}
          </span>
        </div>
        <p className="text-sm text-moss-700 mb-0.5">Room {booking.room_num}</p>
        <p className="text-sm text-moss-600 font-medium">{booking.start_date} &rarr; {booking.end_date}</p>
        <p className="text-xs text-moss-600 mt-1">Booking #{booking.booking_ID}</p>
      </div>
      {booking.status === "active" && onCancel && (
        <button
          onClick={onCancel} disabled={cancelling}
          className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg px-3 py-1.5 disabled:opacity-50 transition-colors"
        >
          {cancelling ? "Cancelling..." : "Cancel"}
        </button>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xs font-semibold text-moss-600 uppercase tracking-wider">{title}</h2>
        <span className="text-xs text-moss-300 font-medium">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="text-sm text-moss-600 py-3">{text}</p>;
}
function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center py-24">{children}</div>;
}
function Spinner() {
  return <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" />;
}
