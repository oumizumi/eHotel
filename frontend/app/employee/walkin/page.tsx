"use client";

import { useState, useEffect } from "react";
import { getCustomers, getEmployees, getHotels, getRooms, createWalkInRenting } from "@/lib/api";
import type { Customer, Employee, Hotel, Room, Renting } from "@/types";
import { CustomSelect } from "@/components/CustomSelect";

const sel = "w-full border border-moss-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent bg-white disabled:bg-moss-50 disabled:text-moss-600";
const inp = "w-full border border-moss-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent bg-white";

export default function WalkInPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [hotels, setHotels]       = useState<Hotel[]>([]);
  const [rooms, setRooms]         = useState<Room[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState<Renting | null>(null);
  const [form, setForm] = useState({
    customer_ID: "", employee_ID: "", hotel_ID: "", room_ID: "", start_date: "", end_date: "",
  });

  useEffect(() => {
    Promise.all([getCustomers(), getEmployees(), getHotels()]).then(([c, e, h]) => {
      setCustomers(c); setEmployees(e); setHotels(h); setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!form.hotel_ID) { setRooms([]); return; }
    getRooms(Number(form.hotel_ID)).then((r) => setRooms(r.filter((rm) => !rm.damaged)));
  }, [form.hotel_ID]);

  function set(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { customer_ID, employee_ID, hotel_ID, room_ID, start_date, end_date } = form;
    if (!customer_ID || !employee_ID || !hotel_ID || !room_ID || !start_date || !end_date)
      return alert("All fields are required.");
    setSubmitting(true);
    try {
      const renting = await createWalkInRenting({
        customer_ID: Number(customer_ID), employee_ID: Number(employee_ID),
        hotel_ID: Number(hotel_ID), room_ID: Number(room_ID), start_date, end_date,
      });
      setDone(renting);
      setForm({ customer_ID: "", employee_ID: "", hotel_ID: "", room_ID: "", start_date: "", end_date: "" });
    } finally { setSubmitting(false); }
  }

  const selectedRoom  = rooms.find((r) => r.room_ID === Number(form.room_ID));
  const nights = form.start_date && form.end_date
    ? Math.max(1, Math.ceil((new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / 86400000))
    : null;

  if (loading) return <div className="flex justify-center py-24"><div className="w-7 h-7 border-[3px] border-moss-200 border-t-moss-800 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-moss-900 mb-1">Walk-In Renting</h1>
        <p className="text-sm text-moss-700">Create a direct renting for a guest without a prior booking.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-moss-200 rounded-xl divide-y divide-moss-100">
        <FormSection title="Guest & Staff">
          <Field label="Customer">
            <CustomSelect
              value={form.customer_ID}
              onChange={(v) => set("customer_ID", v)}
              options={[{ value: "", label: "Select customer..." }, ...customers.map((c) => ({ value: c.customer_ID, label: `${c.name} (${c.ID_type}: ${c.ID_num})` }))]}
            />
          </Field>
          <Field label="Employee Handling Check-In">
            <CustomSelect
              value={form.employee_ID}
              onChange={(v) => set("employee_ID", v)}
              options={[{ value: "", label: "Select employee..." }, ...employees.map((e) => ({ value: e.employee_ID, label: `${e.name} — ${e.position}` }))]}
            />
          </Field>
        </FormSection>

        <FormSection title="Room">
          <Field label="Hotel">
            <CustomSelect
              value={form.hotel_ID}
              onChange={(v) => { set("hotel_ID", v); set("room_ID", ""); }}
              options={[{ value: "", label: "Select hotel..." }, ...hotels.map((h) => ({ value: h.hotel_ID, label: `${h.name} (${h.area}) — ${h.star_cat} stars` }))]}
            />
          </Field>
          <Field label="Room">
            <CustomSelect
              value={form.room_ID}
              onChange={(v) => set("room_ID", v)}
              disabled={!form.hotel_ID}
              options={[{ value: "", label: "Select room..." }, ...rooms.map((r) => ({ value: r.room_ID, label: `Room ${r.room_num} — ${r.capacity} — $${r.price}/night — ${r.view_type} view` }))]}
            />
          </Field>
        </FormSection>

        <FormSection title="Dates">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Check-In">
              <input type="date" value={form.start_date} min={today()} onChange={(e) => set("start_date", e.target.value)} className={inp} />
            </Field>
            <Field label="Check-Out">
              <input type="date" value={form.end_date} min={form.start_date || today()} onChange={(e) => set("end_date", e.target.value)} className={inp} />
            </Field>
          </div>
        </FormSection>

        {selectedRoom && nights && (
          <div className="px-5 py-4 bg-white">
            <p className="text-xs font-semibold text-moss-600 uppercase tracking-wider mb-3">Summary</p>
            <div className="space-y-1.5 text-sm">
              <SummaryRow label="Room" value={`#${selectedRoom.room_num} — ${cap(selectedRoom.capacity)}`} />
              <SummaryRow label="View" value={cap(selectedRoom.view_type)} />
              <SummaryRow label="Nights" value={String(nights)} />
              <SummaryRow label="Rate" value={`$${selectedRoom.price}/night`} />
              <div className="border-t border-moss-200 pt-1.5">
                <SummaryRow label="Total" value={`$${selectedRoom.price * nights}`} bold />
              </div>
            </div>
          </div>
        )}

        <div className="px-5 py-4">
          <button type="submit" disabled={submitting} className="w-full bg-moss-800 hover:bg-moss-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
            {submitting ? "Creating Renting..." : "Create Renting"}
          </button>
        </div>
      </form>

      {done && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 text-center">
            <div className="w-12 h-12 bg-moss-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-moss-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-moss-900 mb-2">Renting Created</h3>
            <p className="text-sm text-moss-700 mb-1">{done.customer_name} &middot; Room {done.room_num}</p>
            <p className="text-sm text-moss-700 mb-5">{done.start_date} &rarr; {done.end_date}</p>
            <p className="text-xs text-moss-600 mb-5">Renting ID: #{done.renting_ID}</p>
            <button onClick={() => setDone(null)} className="bg-moss-800 hover:bg-moss-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-5 space-y-4">
      <p className="text-xs font-semibold text-moss-700 uppercase tracking-wider">{title}</p>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-moss-700 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-moss-700">{label}</span>
      <span className={bold ? "font-bold text-moss-900" : "text-moss-700"}>{value}</span>
    </div>
  );
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function today() { return new Date().toISOString().split("T")[0]; }
