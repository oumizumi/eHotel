"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getHotelChains, createHotelChain, updateHotelChain, deleteHotelChain } from "@/lib/api";
import { CrudTable } from "@/components/CrudTable";
import { PageHeader, SearchBar, Modal, FormField, ModalActions, inputCls, btnPrimary } from "@/app/manage/customers/page";
import type { HotelChain } from "@/types";

const EMPTY: Omit<HotelChain, "chain_ID"> = {
  name: "", num_hotels: 0, address: "", emails: [], phones: [],
};

function tagsToStr(arr: string[]) { return arr.join(", "); }
function strToTags(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

export default function ChainsPage() {
  const [data, setData]       = useState<HotelChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | null>(null);
  const [form, setForm]       = useState<Omit<HotelChain, "chain_ID">>(EMPTY);
  const [emailsStr, setEmailsStr] = useState("");
  const [phonesStr, setPhonesStr] = useState("");
  const [editID, setEditID]   = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    setData(await getHotelChains());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY); setEmailsStr(""); setPhonesStr("");
    setEditID(null); setModal("add");
  }
  function openEdit(c: HotelChain) {
    setForm({ name: c.name, num_hotels: c.num_hotels, address: c.address, emails: c.emails, phones: c.phones });
    setEmailsStr(tagsToStr(c.emails));
    setPhonesStr(tagsToStr(c.phones));
    setEditID(c.chain_ID); setModal("edit");
  }

  async function handleSave() {
    if (!form.name || !form.address) return toast.error("Name and address are required.");
    const payload = { ...form, emails: strToTags(emailsStr), phones: strToTags(phonesStr) };
    setSaving(true);
    try {
      if (modal === "add")      await createHotelChain(payload);
      else if (editID !== null) await updateHotelChain(editID, payload);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function handleDelete(c: HotelChain) {
    if (!confirm(`Delete chain "${c.name}"? All hotels and rooms in this chain will also be removed.`)) return;
    await deleteHotelChain(c.chain_ID); load();
  }

  const filtered = data.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Hotel Chains" count={filtered.length}>
        <button onClick={openAdd} className={btnPrimary}>Add Chain</button>
      </PageHeader>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or address..." />
      <CrudTable
        columns={[
          { key: "chain_ID",   label: "#" },
          { key: "name",       label: "Chain Name" },
          { key: "num_hotels", label: "Hotels" },
          { key: "address",    label: "Address" },
          { key: "emails",     label: "Emails",  render: (c) => c.emails.join(", ") || "—" },
          { key: "phones",     label: "Phones",  render: (c) => c.phones.join(", ") || "—" },
        ]}
        data={filtered} keyField="chain_ID" loading={loading} onEdit={openEdit} onDelete={handleDelete}
      />

      {modal && (
        <Modal title={modal === "add" ? "Add Chain" : "Edit Chain"} onClose={() => setModal(null)}>
          <FormField label="Chain Name">
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Marriott International" />
          </FormField>
          <FormField label="Head Office Address">
            <input type="text" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className={inputCls} placeholder="e.g. 10 Main St, Ottawa, ON" />
          </FormField>
          <FormField label="Emails (comma-separated)">
            <input type="text" value={emailsStr} onChange={(e) => setEmailsStr(e.target.value)} className={inputCls} placeholder="e.g. info@chain.com, support@chain.com" />
          </FormField>
          <FormField label="Phone Numbers (comma-separated)">
            <input type="text" value={phonesStr} onChange={(e) => setPhonesStr(e.target.value)} className={inputCls} placeholder="e.g. 613-555-0100, 800-555-0199" />
          </FormField>
          <ModalActions saving={saving} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
