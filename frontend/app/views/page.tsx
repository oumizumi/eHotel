"use client";

import { useState, useEffect } from "react";
import { getAvailableRoomsPerArea, getHotelCapacities } from "@/lib/api";
import type { AvailableRoomsPerArea, HotelCapacity } from "@/types";
import { PageHeader } from "@/app/manage/customers/page";
import { CrudTable } from "@/components/CrudTable";
import { AnimatedNumber } from "@/components/AnimatedNumber";

export default function ViewsPage() {
  const [areaData, setAreaData]         = useState<AvailableRoomsPerArea[]>([]);
  const [capacityData, setCapacityData] = useState<HotelCapacity[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<"availability" | "capacity">("availability");

  useEffect(() => {
    Promise.all([getAvailableRoomsPerArea(), getHotelCapacities()]).then(([a, c]) => {
      setAreaData(a); setCapacityData(c); setLoading(false);
    });
  }, []);

  const maxRooms = Math.max(...areaData.map((a) => a.available_rooms), 1);
  const maxCap   = Math.max(...capacityData.map((h) => h.total_capacity), 1);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <PageHeader title="Reports" />

      {/* Tabs */}
      <div className="flex border-b border-moss-200 mb-6">
        {(["availability", "capacity"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t
                ? "border-moss-800 text-moss-700"
                : "border-transparent text-moss-600 hover:text-moss-800"
            }`}
          >
            {t === "availability" ? "View 1 — Available Rooms per Area" : "View 2 — Hotel Capacity"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" />
        </div>
      ) : tab === "availability" ? (
        <>
          {/* Cards row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {areaData.map((row) => (
              <div key={row.area} className="bg-white border border-moss-200 rounded-xl p-5">
                <p className="text-3xl font-bold font-mono tabular-nums text-moss-900 mb-1"><AnimatedNumber end={row.available_rooms} duration={1800} /></p>
                <p className="text-sm text-moss-700 font-medium">{row.area}</p>
                <div className="mt-3 h-1.5 bg-moss-100 rounded-full">
                  <div
                    className="h-1.5 bg-moss-800 rounded-full transition-all"
                    style={{ width: `${(row.available_rooms / maxRooms) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <CrudTable
            columns={[
              { key: "area", label: "City", render: (r) => r.area },
              { key: "available_rooms", label: "Available Rooms", render: (r) => <span className="text-2xl font-bold font-mono tabular-nums text-moss-700"><AnimatedNumber end={r.available_rooms} duration={1800} /></span> },
              { key: "chart", label: "", render: (r) => (
                  <div className="w-64 h-2 bg-moss-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-moss-800 rounded-full transition-all" style={{ width: `${(r.available_rooms / maxRooms) * 100}%` }} />
                  </div>
              )}
            ]}
            data={areaData}
            keyField="area"
          />
        </>
      ) : (
        <>
          <CrudTable
            columns={[
              { key: "hotel_name", label: "Hotel", render: (r) => <span className="max-w-xs truncate block">{r.hotel_name}</span> },
              { key: "chain_name", label: "Chain", render: (r) => <span className="text-xs text-moss-600">{r.chain_name}</span> },
              { key: "star_cat", label: "Stars", render: (r) => (
                  <div className="text-sm leading-none flex gap-0.5">
                    {"★".repeat(r.star_cat).split("").map((_, i) => <span key={i} style={{ color: "#F59E0B" }}>★</span>)}
                    {"★".repeat(5 - r.star_cat).split("").map((_, i) => <span key={i} style={{ color: "#D1D5DB" }}>★</span>)}
                  </div>
              )},
              { key: "room_count", label: "Rooms", render: (r) => <span className="text-moss-600 font-mono tabular-nums"><AnimatedNumber end={r.room_count} duration={1800} /></span> },
              { key: "total_capacity", label: "Total Capacity", render: (r) => <span className="text-xl font-bold font-mono tabular-nums text-moss-700"><AnimatedNumber end={r.total_capacity} duration={1800} /></span> },
              { key: "chart", label: "", render: (r) => (
                  <div className="w-40 h-2 bg-moss-100 rounded-full ml-auto overflow-hidden">
                    <div className="h-2 bg-moss-800 rounded-full transition-all" style={{ width: `${(r.total_capacity / maxCap) * 100}%` }} />
                  </div>
              )}
            ]}
            data={capacityData}
            keyField="hotel_ID"
          />
        </>
      )}
    </div>
  );
}

