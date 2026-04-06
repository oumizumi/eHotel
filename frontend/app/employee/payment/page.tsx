"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getRentings, addPayment } from "@/lib/api";
import type { Renting } from "@/types";

export default function PaymentPage() {
  const [rentings, setRentings] = useState<Renting[]>([]);
  const [loading, setLoading]   = useState(true);
  const [amounts, setAmounts]   = useState<Record<number, string>>({});
  const [paying, setPaying]     = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setRentings(await getRentings());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handlePay(id: number) {
    const amt = Number(amounts[id]);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount.");
    setPaying(id);
    await addPayment(id, amt);
    setPaying(null);
    toast.success(`Payment of $${amt} recorded for Renting #${id}`);
    load();
  }

  const unpaid = rentings.filter((r) => r.payment === null);
  const paid   = rentings.filter((r) => r.payment !== null);

  if (loading) return <div className="flex justify-center py-24"><div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-moss-900 mb-1">Payments</h1>
        <p className="text-sm text-moss-700">Record payments for active rentings.</p>
      </div>

      <SectionLabel title="Awaiting Payment" count={unpaid.length} />
      {unpaid.length === 0 ? (
        <p className="text-sm text-moss-600 mb-8 py-3">All rentings are paid.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {unpaid.map((r) => (
            <div key={r.renting_ID} className="bg-white border border-moss-200 rounded-xl px-5 py-4 flex items-center gap-5">
              <div className="flex-1">
                <p className="font-semibold text-moss-900 text-sm mb-0.5">{r.customer_name}</p>
                <p className="text-sm text-moss-700">{r.hotel_name} &middot; Room {r.room_num}</p>
                <p className="text-xs text-moss-600 mt-0.5">
                  {r.start_date} &rarr; {r.end_date}
                  {r.booking_ID && ` &middot; From booking #${r.booking_ID}`}
                  &nbsp;&middot; Renting #{r.renting_ID}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-moss-600 text-sm font-medium">$</span>
                  <input
                    type="number" min={1} placeholder="0.00"
                    value={amounts[r.renting_ID] ?? ""}
                    onChange={(e) => setAmounts((p) => ({ ...p, [r.renting_ID]: e.target.value }))}
                    className="w-28 pl-7 border border-moss-200 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => handlePay(r.renting_ID)}
                  disabled={paying === r.renting_ID}
                  className="bg-moss-800 hover:bg-moss-900 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {paying === r.renting_ID ? "..." : "Pay"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionLabel title="Paid" count={paid.length} />
      {paid.length === 0 ? (
        <p className="text-sm text-moss-600 py-3">No paid rentings yet.</p>
      ) : (
        <div className="space-y-2">
          {paid.map((r) => (
            <div key={r.renting_ID} className="bg-white border border-moss-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-moss-800 text-sm">{r.customer_name}</p>
                <p className="text-xs text-moss-600">{r.hotel_name} &middot; Room {r.room_num} &middot; Renting #{r.renting_ID}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-moss-700">${r.payment}</p>
                <span className="text-xs bg-moss-50 text-moss-700 font-medium px-2 py-0.5 rounded-full">Paid</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function SectionLabel({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-xs font-semibold text-moss-700 uppercase tracking-wider">{title}</h2>
      <span className="text-xs text-moss-300">{count}</span>
    </div>
  );
}
