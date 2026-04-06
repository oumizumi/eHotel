"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api";
import { CrudTable } from "@/components/CrudTable";
import type { Customer, IDType } from "@/types";
import { CustomSelect } from "@/components/CustomSelect";

const EMPTY: Omit<Customer, "customer_ID"> = {
  name: "", address: "", ID_type: "SIN", ID_num: "", date: new Date().toISOString().split("T")[0],
};

export default function CustomersPage() {
  const [data, setData]       = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | null>(null);
  const [form, setForm]       = useState<Omit<Customer, "customer_ID">>(EMPTY);
  const [editID, setEditID]   = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    setData(await getCustomers());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd()             { setForm(EMPTY); setEditID(null); setModal("add"); }
  function openEdit(c: Customer) { setForm({ name: c.name, address: c.address, ID_type: c.ID_type, ID_num: c.ID_num, date: c.date }); setEditID(c.customer_ID); setModal("edit"); }

  async function handleSave() {
    if (!form.name || !form.ID_num) return toast.error("Name and ID number are required.");
    setSaving(true);
    try {
      if (modal === "add")      await createCustomer(form);
      else if (editID !== null) await updateCustomer(editID, form);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function handleDelete(c: Customer) {
    if (!confirm(`Delete ${c.name}?`)) return;
    await deleteCustomer(c.customer_ID); load();
  }

  const filtered = data.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.ID_num.includes(search)
  );

  return (
    <div>
      <PageHeader title="Customers" count={filtered.length}>
        <button onClick={openAdd} className={btnPrimary}>Add Customer</button>
      </PageHeader>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID number..." />
      <CrudTable
        columns={[
          { key: "customer_ID", label: "#" },
          { key: "name",        label: "Full Name" },
          { key: "address",     label: "Address" },
          { key: "ID_type",     label: "ID Type" },
          { key: "ID_num",      label: "ID Number" },
          { key: "date",        label: "Registered" },
        ]}
        data={filtered} keyField="customer_ID" loading={loading} onEdit={openEdit} onDelete={handleDelete}
      />

      {modal && (
        <Modal title={modal === "add" ? "Add Customer" : "Edit Customer"} onClose={() => setModal(null)}>
          <FormField label="Full Name">
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Alice Martin" />
          </FormField>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className={inputCls} placeholder="e.g. 12 Maple St, Ottawa, ON" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="ID Type">
              <CustomSelect
                value={form.ID_type}
                onChange={(v) => setForm((p) => ({ ...p, ID_type: v as IDType }))}
                options={[{ value: "SIN", label: "SIN" }, { value: "Passport", label: "Passport" }, { value: "DL", label: "Driver's Licence" }]}
              />
            </FormField>
            <FormField label="ID Number">
              <input type="text" value={form.ID_num} onChange={(e) => setForm((p) => ({ ...p, ID_num: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
          <FormField label="Registration Date">
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={inputCls} />
          </FormField>
          <ModalActions saving={saving} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Shared UI primitives (imported by other manage pages) ────────────────────

export function PageHeader({ title, count, children }: { title: string; count?: number; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-baseline gap-2">
        <h1 className="text-xl font-semibold text-moss-900">{title}</h1>
        {count !== undefined && <span className="text-sm text-moss-600">{count}</span>}
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative mb-4">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-moss-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-moss-100 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent bg-white placeholder:text-moss-500"
      />
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-moss-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-moss-950/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-moss-100">
          <h3 className="text-base font-semibold text-moss-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-moss-600 hover:text-moss-700 hover:bg-moss-50 transition-colors text-lg leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-moss-700 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function ModalActions({ saving, onSave, onCancel }: { saving: boolean; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-3 pt-2 border-t border-moss-100 mt-2">
      <button onClick={onCancel} className={btnSecondary + " flex-1"}>Cancel</button>
      <button onClick={onSave} disabled={saving} className={btnPrimary + " flex-1 justify-center disabled:opacity-50"}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export const inputCls =
  "w-full border border-moss-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent bg-white transition-colors text-moss-900 placeholder:text-moss-600";

export const btnPrimary =
  "inline-flex items-center gap-1.5 bg-moss-800 hover:bg-moss-700 text-white hover:text-white focus:outline-none text-sm font-semibold px-4 py-2 rounded-lg transition-colors";

export const btnSecondary =
  "inline-flex items-center gap-1.5 border border-moss-200 bg-white hover:bg-moss-50 text-moss-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors";
