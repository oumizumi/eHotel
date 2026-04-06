"use client";

import { useState, useEffect } from "react";
import { getActiveBookings, convertBookingToRenting, getEmployees } from "@/lib/api";
import type { Booking, Employee, Renting } from "@/types";
import { CustomSelect } from "@/components/CustomSelect";

export default function CheckInPage() {
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [employees, setEmployees]   = useState<Employee[]>([]);
  const [loading, setLoading]       = useState(true);
  const [employeeID, setEmployeeID] = useState<number | "">("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [done, setDone]             = useState<Renting | null>(null);
  const [search, setSearch]         = useState("");

  async function load() {
    setLoading(true);
    const [b, e] = await Promise.all([getActiveBookings(), getEmployees()]);
    setBookings(b); setEmployees(e); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCheckIn(booking_ID: number) {
    if (!employeeID) return alert("Select the employee performing the check-in.");
    setProcessing(booking_ID);
    try {
      const renting = await convertBookingToRenting(booking_ID, Number(employeeID));
      setDone(renting); load();
    } finally { setProcessing(null); }
  }

  const filtered = bookings.filter(
    (b) =>
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.hotel_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(b.booking_ID).includes(search)
  );

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-moss-900 mb-1">Guest Check-In</h1>
        <p className="text-sm text-moss-700">Convert an active booking to a renting when the guest arrives.</p>
      </div>

      {/* Employee selector */}
      <div className="bg-white border border-moss-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-4">
        <span className="text-xs font-semibold text-moss-700 uppercase tracking-widest shrink-0">Employee on duty</span>
        <CustomSelect
          value={employeeID}
          onChange={(v) => setEmployeeID(v === "" ? "" : Number(v))}
          options={[{ value: "", label: "Select employee..." }, ...employees.map((e) => ({ value: e.employee_ID, label: `${e.name} — ${e.position}` }))]}
          className="flex-1"
          variant="tight"
        />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-moss-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by guest name, hotel, or booking ID..."
          className="w-full border border-moss-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent bg-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-moss-200 rounded-xl p-12 text-center">
          <p className="text-sm text-moss-600">No active bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.booking_ID} className="bg-white border border-moss-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-moss-900 text-sm">{b.customer_name}</span>
                  <span className="text-xs bg-moss-50 text-moss-700 border border-moss-100 font-medium px-2 py-0.5 rounded-full">
                    #{b.booking_ID}
                  </span>
                </div>
                <p className="text-sm text-moss-600">{b.hotel_name} &middot; Room {b.room_num}</p>
                <p className="text-xs text-moss-600 mt-0.5">{b.start_date} &rarr; {b.end_date}</p>
              </div>
              <button
                onClick={() => handleCheckIn(b.booking_ID)}
                disabled={processing === b.booking_ID || !employeeID}
                className="bg-moss-800 hover:bg-moss-700 disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors shrink-0"
              >
                {processing === b.booking_ID ? "Processing..." : "Check In"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Success modal */}
      {done && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 text-center">
            <div className="w-12 h-12 bg-moss-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-moss-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-moss-900 mb-2">Check-In Complete</h3>
            <p className="text-sm text-moss-700 mb-1">{done.customer_name} has been checked in.</p>
            <p className="text-sm text-moss-700 mb-5">Room {done.room_num} &middot; {done.hotel_name}</p>
            <p className="text-xs text-moss-600 mb-5">Renting ID: #{done.renting_ID}</p>
            <button onClick={() => setDone(null)} className="bg-moss-800 hover:bg-moss-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
