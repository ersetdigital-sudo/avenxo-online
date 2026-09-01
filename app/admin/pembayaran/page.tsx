"use client";

import { useState, useEffect, useCallback } from "react";

type PayMethod = {
  id: string;
  category: string;
  label: string;
  icon_url: string | null;
  account_number: string | null;
  account_name: string | null;
  qr_image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

type Setting = { key: string; value: string };

const CAT_LABELS: Record<string, string> = {
  ewallet: "E-Wallet",
  va: "Virtual Account",
  bank: "Transfer Bank",
  pulsa: "Pulsa",
};

const CAT_ORDER = ["ewallet", "va", "bank", "pulsa"];

export default function AdminPembayaranPage() {
  const [methods, setMethods] = useState<PayMethod[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PayMethod | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [settingVal, setSettingVal] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [mRes, sRes] = await Promise.all([
      fetch("/api/admin/payment-methods"),
      fetch("/api/admin/settings"),
    ]);
    const mData = await mRes.json();
    const sData = await sRes.json();
    setMethods(mData.methods || []);
    setSettings(sData.settings || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleToggle = async (m: PayMethod) => {
    setSaving(true);
    try {
      await fetch("/api/admin/payment-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, is_active: !m.is_active }),
      });
      load();
    } catch {}
    setSaving(false);
  };

  const handleSaveMethod = async (form: Partial<PayMethod>) => {
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      const res = await fetch("/api/admin/payment-methods", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Gagal");
      flash("ok", editing ? "Metode diperbarui." : "Metode ditambahkan.");
      setShowForm(false);
      setEditing(null);
      load();
    } catch {
      flash("err", "Gagal menyimpan metode.");
    }
    setSaving(false);
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Hapus metode pembayaran ini?")) return;
    setSaving(true);
    try {
      await fetch("/api/admin/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      flash("ok", "Metode dihapus.");
      load();
    } catch {
      flash("err", "Gagal menghapus.");
    }
    setSaving(false);
  };

  const handleSaveSetting = async () => {
    if (!editingSetting) return;
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: editingSetting.key, value: settingVal }),
      });
      flash("ok", "Setting disimpan.");
      setEditingSetting(null);
      load();
    } catch {
      flash("err", "Gagal menyimpan setting.");
    }
    setSaving(false);
  };

  const handleUploadQR = async (m: PayMethod, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "payment-qr");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      await fetch("/api/admin/payment-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, qr_image_url: data.url }),
      });
      flash("ok", "QR IS diupload.");
      load();
    }
    setSaving(false);
  };

  const grouped = CAT_ORDER.map((cat) => ({
    cat,
    label: CAT_LABELS[cat] || cat,
    items: methods.filter((m) => m.category === cat),
  }));

  const settingLabels: Record<string, string> = {
    wa_number: "Nomor WhatsApp CS",
    wa_link: "Link WhatsApp",
    payment_timeout_minutes: "Batas Waktu Pembayaran (menit)",
    cs_email: "Email CS",
  };

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] sm:text-[26px] mb-6">Setting Pembayaran</h1>

      {msg && (
        <div
          className="mb-4 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
          style={{
            background: msg.type === "ok" ? "rgba(198,242,78,.12)" : "rgba(255,180,61,.12)",
            color: msg.type === "ok" ? "var(--lime)" : "var(--amber)",
            border: msg.type === "ok" ? "1px solid rgba(198,242,78,.3)" : "1px solid rgba(255,180,61,.3)",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* SITE SETTINGS */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <h2 className="font-display font-bold text-[16px] mb-4">Setting Situs</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {settings.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
            >
              <div className="min-w-0 flex-1 mr-3">
                <span className="block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
                  {settingLabels[s.key] || s.key}
                </span>
                <span className="block text-[13.5px] truncate mt-0.5" style={{ color: "var(--text)" }}>
                  {s.value}
                </span>
              </div>
              <button
                onClick={() => { setEditingSetting(s); setSettingVal(s.value); }}
                className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold shrink-0"
                style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text)" }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SETTING EDIT MODAL */}
      {editingSetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setEditingSetting(null)}>
          <div
            className="w-full max-w-[400px] rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-[16px] mb-4">
              Edit — {settingLabels[editingSetting.key] || editingSetting.key}
            </h3>
            <input
              type="text"
              value={settingVal}
              onChange={(e) => setSettingVal(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl text-[14px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditingSetting(null)} className="btn-ghost px-5 py-2.5 text-[13px]">Batal</button>
              <button onClick={handleSaveSetting} disabled={saving} className="btn-primary px-5 py-2.5 text-[13px] disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT METHODS BY CATEGORY */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading...</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, label, items }) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-[16px]">{label}</h2>
                <button
                  onClick={() => { setEditing(null); setShowForm(true); }}
                  className="btn-primary px-4 py-1.5 text-[12px]"
                >
                  + Tambah
                </button>
              </div>
              {items.length === 0 ? (
                <p className="text-[13px] py-4" style={{ color: "var(--muted)" }}>Belum ada metode.</p>
              ) : (
                <div className="space-y-2">
                  {items.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--line)",
                        opacity: m.is_active ? 1 : 0.5,
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                        {m.qr_image_url ? (
                          <img src={m.qr_image_url} alt="QR" className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <span className="text-[16px]">
                            {cat === "ewallet" ? "💰" : cat === "va" ? "🏦" : cat === "bank" ? "🏛️" : "📶"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-display font-semibold text-[13.5px]">{m.label}</span>
                        {m.account_number && (
                          <span className="block text-[12px]" style={{ color: "var(--muted)" }}>
                            {m.account_number} {m.account_name ? `— ${m.account_name}` : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {cat === "ewallet" && m.label === "QRIS" && (
                          <label className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold cursor-pointer"
                            style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}>
                            Upload QR
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadQR(m, e)} />
                          </label>
                        )}
                        <button
                          onClick={() => handleToggle(m)}
                          className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                          style={{
                            background: m.is_active ? "rgba(255,180,61,.12)" : "rgba(198,242,78,.12)",
                            color: m.is_active ? "var(--amber)" : "var(--lime)",
                          }}
                        >
                          {m.is_active ? "Nonaktif" : "Aktif"}
                        </button>
                        <button
                          onClick={() => { setEditing(m); setShowForm(true); }}
                          className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMethod(m.id)}
                          className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                          style={{ background: "rgba(255,80,80,.1)", color: "#ff5050" }}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* METHOD FORM MODAL */}
      {showForm && (
        <MethodForm
          method={editing}
          onSave={handleSaveMethod}
          onClose={() => { setShowForm(false); setEditing(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}

function MethodForm({
  method,
  onSave,
  onClose,
  saving,
}: {
  method: PayMethod | null;
  onSave: (f: Partial<PayMethod>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [category, setCategory] = useState(method?.category || "ewallet");
  const [label, setLabel] = useState(method?.label || "");
  const [accountNumber, setAccountNumber] = useState(method?.account_number || "");
  const [accountName, setAccountName] = useState(method?.account_name || "");
  const [sortOrder, setSortOrder] = useState(String(method?.sort_order ?? 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-[440px] rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-[17px] mb-5">
          {method ? "Edit Metode" : "Tambah Metode"}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            >
              <option value="ewallet">E-Wallet</option>
              <option value="va">Virtual Account</option>
              <option value="bank">Transfer Bank</option>
              <option value="pulsa">Pulsa</option>
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="misal: QRIS, DANA, BCA VA"
              className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>
          {category !== "ewallet" && (
            <>
              <div>
                <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
                  Nomor Tujuan / VA
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
                />
              </div>
              {category === "bank" && (
                <div>
                  <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
                  />
                </div>
              )}
            </>
          )}
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Urutan</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-5">
          <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-[13px]">Batal</button>
          <button
            onClick={() => onSave({ category, label, account_number: accountNumber || null, account_name: accountName || null, sort_order: parseInt(sortOrder) || 0 })}
            disabled={saving || !label}
            className="btn-primary px-5 py-2.5 text-[13px] disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
