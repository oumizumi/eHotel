"use client";

import { useState, useEffect } from "react";
import { getHotels, getHotelChains, createHotel, updateHotel, deleteHotel } from "@/lib/api";
import { CrudTable } from "@/components/CrudTable";
import { PageHeader, SearchBar, Modal, FormField, ModalActions, inputCls, btnPrimary } from "@/app/manage/customers/page";
import type { Hotel, HotelChain } from "@/types";
import { AREAS } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";

const EMPTY: Omit<Hotel, "hotel_ID"> = {
  chain_ID: 0, name: "", address: "", area: "", star_cat: 3, num_rooms: 5, manager_ID: null, emails: [], phones: [],
};

export default function HotelsPage() {
  const [data, setData]       = useState<Hotel[]>([]);
  const [chains, setChains]   = useState<HotelChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | null>(null);
  const [form, setForm]       = useState<Omit<Hotel, "hotel_ID">>(EMPTY);
  const [editID, setEditID]   = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    const [h, c] = await Promise.all([getHotels(), getHotelChains()]);
    setData(h); setChains(c); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd()           { setForm(EMPTY); setEditID(null); setModal("add"); }
  function openEdit(h: Hotel)  { setForm({ chain_ID: h.chain_ID, name: h.name, address: h.address, area: h.area, star_cat: h.star_cat, num_rooms: h.num_rooms, manager_ID: h.manager_ID, emails: h.emails, phones: h.phones }); setEditID(h.hotel_ID); setModal("edit"); }

  async function handleSave() {
    if (!form.name || !form.chain_ID || !form.area) return alert("Name, chain and area are required.");
    setSaving(true);
    try {
      if (modal === "add")      await createHotel(form);
      else if (editID !== null) await updateHotel(editID, form);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function handleDelete(h: Hotel) {
    if (!confirm(`Delete ${h.name}? All its rooms will also be removed.`)) return;
    await deleteHotel(h.hotel_ID); load();
  }

  const chainName = (id: number) => chains.find((c) => c.chain_ID === id)?.name ?? `Chain #${id}`;
  const filtered = data.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Hotels" count={filtered.length}>
        <button onClick={openAdd} className={btnPrimary}>Add Hotel</button>
      </PageHeader>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or city..." />
      <CrudTable
        columns={[
          { key: "hotel_ID",  label: "#" },
          { key: "name",      label: "Hotel Name" },
          { key: "chain_ID",  label: "Chain", render: (h) => chainName(h.chain_ID) },
          { key: "area",      label: "City" },
          { key: "star_cat",  label: "Stars", render: (h) => (
            <span className="text-sm leading-none">
              {"★".repeat(h.star_cat).split("").map((_, i) => <span key={i} style={{ color: "#F59E0B" }}>★</span>)}
              {"★".repeat(5 - h.star_cat).split("").map((_, i) => <span key={i} style={{ color: "#D1D5DB" }}>★</span>)}
            </span>
          )},
          { key: "num_rooms", label: "Rooms" },
        ]}
        data={filtered} keyField="hotel_ID" loading={loading} onEdit={openEdit} onDelete={handleDelete}
      />

      {modal && (
        <Modal title={modal === "add" ? "Add Hotel" : "Edit Hotel"} onClose={() => setModal(null)}>
          <FormField label="Hotel Name">
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Hotel Chain">
            <CustomSelect
              value={form.chain_ID}
              onChange={(v) => setForm((p) => ({ ...p, chain_ID: Number(v) }))}
              options={[{ value: 0, label: "Select chain..." }, ...chains.map((c) => ({ value: c.chain_ID, label: c.name }))]}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City">
              <CustomSelect
                value={form.area}
                onChange={(v) => setForm((p) => ({ ...p, area: v }))}
                options={[{ value: "", label: "Select city..." }, ...AREAS.map((a) => ({ value: a, label: a }))]}
              />
            </FormField>
            <FormField label="Star Category">
              <CustomSelect
                value={form.star_cat}
                onChange={(v) => setForm((p) => ({ ...p, star_cat: Number(v) }))}
                options={[1,2,3,4,5].map((s) => ({ value: s, label: `${s} Star${s > 1 ? "s" : ""}` }))}
              />
            </FormField>
          </div>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Number of Rooms">
            <input type="number" min={1} value={form.num_rooms} onChange={(e) => setForm((p) => ({ ...p, num_rooms: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <ModalActions saving={saving} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
