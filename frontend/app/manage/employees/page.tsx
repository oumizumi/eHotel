"use client";

import { useState, useEffect } from "react";
import { getEmployees, getHotels, createEmployee, updateEmployee, deleteEmployee } from "@/lib/api";
import { CrudTable } from "@/components/CrudTable";
import { PageHeader, SearchBar, Modal, FormField, ModalActions, inputCls, btnPrimary } from "@/app/manage/customers/page";
import type { Employee, Hotel } from "@/types";
import { CustomSelect } from "@/components/CustomSelect";

const EMPTY: Omit<Employee, "employee_ID"> = { hotel_ID: 0, name: "", address: "", SSN: "", position: "" };

export default function EmployeesPage() {
  const [data, setData]       = useState<Employee[]>([]);
  const [hotels, setHotels]   = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | null>(null);
  const [form, setForm]       = useState<Omit<Employee, "employee_ID">>(EMPTY);
  const [editID, setEditID]   = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    const [e, h] = await Promise.all([getEmployees(), getHotels()]);
    setData(e); setHotels(h); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd()             { setForm(EMPTY); setEditID(null); setModal("add"); }
  function openEdit(e: Employee) { setForm({ hotel_ID: e.hotel_ID, name: e.name, address: e.address, SSN: e.SSN, position: e.position }); setEditID(e.employee_ID); setModal("edit"); }

  async function handleSave() {
    if (!form.name || !form.SSN || !form.position || !form.hotel_ID) return alert("All fields are required.");
    setSaving(true);
    try {
      if (modal === "add")      await createEmployee(form);
      else if (editID !== null) await updateEmployee(editID, form);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function handleDelete(e: Employee) {
    if (!confirm(`Delete ${e.name}?`)) return;
    await deleteEmployee(e.employee_ID); load();
  }

  const hotelName = (id: number) => hotels.find((h) => h.hotel_ID === id)?.name ?? `Hotel #${id}`;
  const filtered = data.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Employees" count={filtered.length}>
        <button onClick={openAdd} className={btnPrimary}>Add Employee</button>
      </PageHeader>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or position..." />
      <CrudTable
        columns={[
          { key: "employee_ID", label: "#" },
          { key: "name",        label: "Full Name" },
          { key: "hotel_ID",    label: "Hotel", render: (e) => hotelName(e.hotel_ID) },
          { key: "position",    label: "Position" },
          { key: "address",     label: "Address" },
          { key: "SSN",         label: "SSN" },
        ]}
        data={filtered} keyField="employee_ID" loading={loading} onEdit={openEdit} onDelete={handleDelete}
      />

      {modal && (
        <Modal title={modal === "add" ? "Add Employee" : "Edit Employee"} onClose={() => setModal(null)}>
          <FormField label="Full Name">
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Hotel">
            <CustomSelect
              value={form.hotel_ID}
              onChange={(v) => setForm((p) => ({ ...p, hotel_ID: Number(v) }))}
              options={[{ value: 0, label: "Select hotel..." }, ...hotels.map((h) => ({ value: h.hotel_ID, label: h.name }))]}
            />
          </FormField>
          <FormField label="Position">
            <input type="text" value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} className={inputCls} placeholder="Manager, Front Desk, Housekeeping..." />
          </FormField>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="SSN">
            <input type="text" value={form.SSN} onChange={(e) => setForm((p) => ({ ...p, SSN: e.target.value }))} className={inputCls} />
          </FormField>
          <ModalActions saving={saving} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
