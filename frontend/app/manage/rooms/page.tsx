"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getRooms, getHotels, createRoom, updateRoom, deleteRoom } from "@/lib/api";
import { CrudTable } from "@/components/CrudTable";
import { PageHeader, SearchBar, Modal, FormField, ModalActions, inputCls, btnPrimary } from "@/app/manage/customers/page";
import type { Room, Hotel, RoomCapacity, ViewType } from "@/types";
import { CAPACITIES } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";

const EMPTY: Omit<Room, "room_ID"> = {
  hotel_ID: 0, room_num: 1, price: 100, capacity: "single", view_type: "none",
  extendable: false, damaged: false, amenities: [], damages: [],
};

const ALL_AMENITIES = ["TV", "WiFi", "AC", "Fridge", "Minibar", "Jacuzzi", "Balcony", "Living room", "Kitchen"];

export default function RoomsPage() {
  const [data, setData]             = useState<Room[]>([]);
  const [hotels, setHotels]         = useState<Hotel[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [hotelFilter, setHotelFilter] = useState<number | "">("");
  const [modal, setModal]           = useState<"add" | "edit" | null>(null);
  const [form, setForm]             = useState<Omit<Room, "room_ID">>(EMPTY);
  const [editID, setEditID]         = useState<number | null>(null);
  const [saving, setSaving]         = useState(false);

  async function load() {
    setLoading(true);
    const [r, h] = await Promise.all([getRooms(), getHotels()]);
    setData(r); setHotels(h); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd()          { setForm(EMPTY); setEditID(null); setModal("add"); }
  function openEdit(r: Room)  { setForm({ hotel_ID: r.hotel_ID, room_num: r.room_num, price: r.price, capacity: r.capacity, view_type: r.view_type, extendable: r.extendable, damaged: r.damaged, amenities: [...r.amenities], damages: [...r.damages] }); setEditID(r.room_ID); setModal("edit"); }

  async function handleSave() {
    if (!form.hotel_ID || !form.room_num || !form.price) return toast.error("Hotel, room number and price are required.");
    setSaving(true);
    try {
      if (modal === "add")      await createRoom(form);
      else if (editID !== null) await updateRoom(editID, form);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function handleDelete(r: Room) {
    if (!confirm(`Delete Room ${r.room_num}?`)) return;
    await deleteRoom(r.room_ID); load();
  }

  function toggleAmenity(a: string) {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a],
    }));
  }

  const hotelName = (id: number) => hotels.find((h) => h.hotel_ID === id)?.name ?? `Hotel #${id}`;
  const filtered = data.filter((r) => {
    if (hotelFilter !== "" && r.hotel_ID !== hotelFilter) return false;
    if (search && !String(r.room_num).includes(search) && !hotelName(r.hotel_ID).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Rooms" count={filtered.length}>
        <button onClick={openAdd} className={btnPrimary}>Add Room</button>
      </PageHeader>
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by room number or hotel..." />
        </div>
        <CustomSelect
          value={hotelFilter}
          onChange={(v) => setHotelFilter(v === "" ? "" : Number(v))}
          options={[{ value: "", label: "All hotels" }, ...hotels.map((h) => ({ value: h.hotel_ID, label: h.name }))]}
          className="mb-4"
        />
      </div>
      <CrudTable
        columns={[
          { key: "room_ID",    label: "#" },
          { key: "hotel_ID",   label: "Hotel",    render: (r) => hotelName(r.hotel_ID) },
          { key: "room_num",   label: "Room" },
          { key: "capacity",   label: "Capacity", render: (r) => <span className="capitalize text-xs">{r.capacity}</span> },
          { key: "price",      label: "Price",    render: (r) => `$${r.price}` },
          { key: "view_type",  label: "View",     render: (r) => <span className="capitalize text-xs">{r.view_type}</span> },
          { key: "damaged",    label: "Status",   render: (r) => r.damaged
            ? <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Damaged</span>
            : <span className="text-xs font-medium text-moss-700 bg-moss-50 px-2 py-0.5 rounded-full">OK</span>
          },
        ]}
        data={filtered} keyField="room_ID" loading={loading} onEdit={openEdit} onDelete={handleDelete}
      />

      {modal && (
        <Modal title={modal === "add" ? "Add Room" : "Edit Room"} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hotel">
              <CustomSelect
                value={form.hotel_ID}
                onChange={(v) => setForm((p) => ({ ...p, hotel_ID: Number(v) }))}
                options={[{ value: 0, label: "Select hotel..." }, ...hotels.map((h) => ({ value: h.hotel_ID, label: h.name }))]}
              />
            </FormField>
            <FormField label="Room Number">
              <input type="number" min={1} value={form.room_num} onChange={(e) => setForm((p) => ({ ...p, room_num: Number(e.target.value) }))} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price / Night ($)">
              <input type="number" min={1} value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="Capacity">
              <CustomSelect
                value={form.capacity}
                onChange={(v) => setForm((p) => ({ ...p, capacity: v as RoomCapacity }))}
                options={CAPACITIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
              />
            </FormField>
          </div>
          <FormField label="View Type">
            <div className="flex gap-4 mt-0.5">
              {(["none", "sea", "mountain"] as ViewType[]).map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="view" value={v} checked={form.view_type === v} onChange={() => setForm((p) => ({ ...p, view_type: v }))} className="accent-moss-800" />
                  <span className="capitalize text-moss-700">{v}</span>
                </label>
              ))}
            </div>
          </FormField>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.extendable} onChange={(e) => setForm((p) => ({ ...p, extendable: e.target.checked }))} className="accent-moss-800 w-4 h-4 rounded" />
              <span className="text-moss-700">Extendable</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.damaged} onChange={(e) => setForm((p) => ({ ...p, damaged: e.target.checked }))} className="accent-red-500 w-4 h-4 rounded" />
              <span className="text-moss-700">Damaged</span>
            </label>
          </div>
          {form.damaged && (
            <FormField label="Damages">
              <div className="flex flex-col gap-2">
                {form.damages.map((d, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text" value={d}
                      onChange={(e) => setForm((p) => { const ds = [...p.damages]; ds[i] = e.target.value; return { ...p, damages: ds }; })}
                      className={inputCls + " flex-1"} placeholder="Describe damage..."
                    />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, damages: p.damages.filter((_, j) => j !== i) }))} className="text-red-500 text-sm px-2">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm((p) => ({ ...p, damages: [...p.damages, ""] }))} className="text-xs text-moss-700 underline text-left">+ Add damage</button>
              </div>
            </FormField>
          )}
          <FormField label="Amenities">
            <div className="flex flex-wrap gap-2 mt-1">
              {ALL_AMENITIES.map((a) => (
                <button
                  key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                    form.amenities.includes(a)
                      ? "bg-moss-800 text-white border-moss-800"
                      : "border-moss-200 text-moss-600 hover:border-zinc-400 bg-white"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </FormField>
          <ModalActions saving={saving} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
