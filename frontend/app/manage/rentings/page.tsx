"use client";

import { useState, useEffect } from "react";
import { getRentings } from "@/lib/api";
import { PageHeader, SearchBar } from "@/app/manage/customers/page";
import type { Renting } from "@/types";

export default function RentingsPage() {
  const [data, setData]     = useState<Renting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getRentings().then((r) => { setData(r); setLoading(false); });
  }, []);

  const filtered = data.filter(
    (r) =>
      r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.hotel_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(r.renting_ID).includes(search)
  );

  const walkin   = filtered.filter((r) => r.booking_ID == null);
  const fromBook = filtered.filter((r) => r.booking_ID != null);

  return (
    <div>
      <PageHeader title="All Rentings" count={filtered.length} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search by guest name, hotel, or renting ID..." />

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-moss-100 rounded-xl p-12 text-center">
          <p className="text-sm text-moss-600">No rentings found.</p>
        </div>
      ) : (
        <div className="bg-white border border-moss-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-moss-100 bg-moss-50">
                {["#", "Guest", "Hotel", "Room", "Employee", "Check-in", "Check-out", "Payment", "Source"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-moss-700 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-moss-50">
              {filtered.map((r) => (
                <tr key={r.renting_ID} className="hover:bg-moss-50/50 transition-colors">
                  <td className="px-4 py-3 text-moss-500 font-mono text-xs">#{r.renting_ID}</td>
                  <td className="px-4 py-3 font-medium text-moss-900">{r.customer_name ?? `Customer #${r.customer_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{r.hotel_name ?? `Hotel #${r.hotel_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{r.room_num != null ? `Room ${r.room_num}` : `#${r.room_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{r.employee_name ?? `Emp #${r.employee_ID}`}</td>
                  <td className="px-4 py-3 text-moss-700">{r.start_date}</td>
                  <td className="px-4 py-3 text-moss-700">{r.end_date}</td>
                  <td className="px-4 py-3">
                    {r.payment != null ? (
                      <span className="text-moss-700 font-semibold">${r.payment}</span>
                    ) : (
                      <span className="text-xs text-moss-400">Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.booking_ID != null ? (
                      <span className="text-xs bg-moss-50 text-moss-700 border border-moss-100 font-medium px-2 py-0.5 rounded-full">
                        Booking #{r.booking_ID}
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 font-medium px-2 py-0.5 rounded-full">
                        Walk-in
                      </span>
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
