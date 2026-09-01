"use client";

import { useState, useEffect, useCallback } from "react";

type Game = {
  id: string;
  slug: string;
  name: string;
  publisher: string;
  cover_url: string;
  banner_url: string;
  short_desc: string;
  long_desc: string[];
  fields: { id: string; label: string; placeholder: string; zone?: boolean }[];
  tags: string;
  badge: string | null;
  is_active: boolean;
  sort_order: number;
  rating: number;
  rating_count: string;
};

type Denom = {
  id: string;
  game_id: string;
  amount: string;
  bonus: string | null;
  price: number;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
};

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export default function AdminProdukPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [denomGame, setDenomGame] = useState<Game | null>(null);
  const [denoms, setDenoms] = useState<Denom[]>([]);
  const [showDenomForm, setShowDenomForm] = useState(false);
  const [editingDenom, setEditingDenom] = useState<Denom | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadGames = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/games");
    const data = await res.json();
    setGames(data.games || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadGames(); }, [loadGames]);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSaveGame = async (form: Partial<Game>) => {
    setSaving(true);
    try {
      const method = editingGame ? "PUT" : "POST";
      const body = editingGame ? { ...form, id: editingGame.id } : form;
      const res = await fetch("/api/admin/games", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Gagal simpan");
      flash("ok", editingGame ? "Game diperbarui." : "Game ditambahkan.");
      setShowForm(false);
      setEditingGame(null);
      loadGames();
    } catch {
      flash("err", "Gagal menyimpan game.");
    }
    setSaving(false);
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Hapus game ini? Semua nominal ikut terhapus.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/games", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Gagal hapus");
      flash("ok", "Game dihapus.");
      loadGames();
    } catch {
      flash("err", "Gagal menghapus game.");
    }
    setSaving(false);
  };

  const handleToggleActive = async (game: Game) => {
    setSaving(true);
    try {
      await fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: game.id, is_active: !game.is_active }),
      });
      loadGames();
    } catch {}
    setSaving(false);
  };

  const loadDenoms = async (game: Game) => {
    setDenomGame(game);
    const res = await fetch(`/api/admin/denoms?game_id=${game.id}`);
    const data = await res.json();
    setDenoms(data.denoms || []);
    setShowDenomForm(false);
    setEditingDenom(null);
  };

  const handleSaveDenom = async (form: Partial<Denom>) => {
    setSaving(true);
    try {
      const method = editingDenom ? "PUT" : "POST";
      const body = editingDenom
        ? { ...form, id: editingDenom.id }
        : { ...form, game_id: denomGame!.id };
      const res = await fetch("/api/admin/denoms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Gagal simpan");
      flash("ok", editingDenom ? "Nominal diperbarui." : "Nominal ditambahkan.");
      setShowDenomForm(false);
      setEditingDenom(null);
      loadDenoms(denomGame!);
    } catch {
      flash("err", "Gagal menyimpan nominal.");
    }
    setSaving(false);
  };

  const handleDeleteDenom = async (id: string) => {
    if (!confirm("Hapus nominal ini?")) return;
    setSaving(true);
    try {
      await fetch("/api/admin/denoms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      flash("ok", "Nominal dihapus.");
      loadDenoms(denomGame!);
    } catch {
      flash("err", "Gagal menghapus nominal.");
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-[22px] sm:text-[26px]">Kelola Produk</h1>
        <button
          onClick={() => { setEditingGame(null); setShowForm(true); }}
          className="btn-primary px-5 py-2.5 text-[13.5px]"
        >
          + Tambah Game
        </button>
      </div>

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

      {/* GAME FORM MODAL */}
      {showForm && (
        <GameForm
          game={editingGame}
          onSave={handleSaveGame}
          onClose={() => { setShowForm(false); setEditingGame(null); }}
          saving={saving}
        />
      )}

      {/* DENOM FORM MODAL */}
      {showDenomForm && denomGame && (
        <DenomForm
          denom={editingDenom}
          gameName={denomGame.name}
          onSave={handleSaveDenom}
          onClose={() => { setShowDenomForm(false); setEditingDenom(null); }}
          saving={saving}
        />
      )}

      {/* GAME LIST */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading...</div>
      ) : games.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Belum ada game.</div>
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                opacity: g.is_active ? 1 : 0.55,
              }}
            >
              <img
                src={g.cover_url}
                alt={g.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
                style={{ border: "1px solid var(--line)" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-[15px]">{g.name}</span>
                  {g.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--lime)", color: "#0B1207" }}>
                      {g.badge}
                    </span>
                  )}
                  {!g.is_active && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(255,180,61,.2)", color: "var(--amber)" }}>
                      NONAKTIF
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {g.publisher} · Urutan: {g.sort_order}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => loadDenoms(g)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--muted)" }}
                >
                  Nominal
                </button>
                <button
                  onClick={() => handleToggleActive(g)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{
                    background: g.is_active ? "rgba(255,180,61,.12)" : "rgba(198,242,78,.12)",
                    color: g.is_active ? "var(--amber)" : "var(--lime)",
                    border: g.is_active ? "1px solid rgba(255,180,61,.25)" : "1px solid rgba(198,242,78,.25)",
                  }}
                >
                  {g.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  onClick={() => { setEditingGame(g); setShowForm(true); }}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGame(g.id)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                  style={{ background: "rgba(255,80,80,.1)", color: "#ff5050", border: "1px solid rgba(255,80,80,.2)" }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DENOM PANEL */}
      {denomGame && !showDenomForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setDenomGame(null)}
        >
          <div
            className="w-full max-w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-[18px]">
                Nominal — {denomGame.name}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingDenom(null); setShowDenomForm(true); }}
                  className="btn-primary px-4 py-2 text-[13px]"
                >
                  + Tambah
                </button>
                <button onClick={() => setDenomGame(null)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            {denoms.length === 0 ? (
              <p className="text-center py-10" style={{ color: "var(--muted)" }}>Belum ada nominal.</p>
            ) : (
              <div className="space-y-2">
                {denoms.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      opacity: d.is_active ? 1 : 0.5,
                    }}
                  >
                    <div>
                      <span className="font-display font-semibold text-[13.5px]">{d.amount}</span>
                      {d.is_popular && (
                        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--lime)", color: "#0B1207" }}>
                          POPULER
                        </span>
                      )}
                      <span className="block text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                        {rupiah(d.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingDenom(d); setShowDenomForm(true); }}
                        className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                        style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text)" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDenom(d.id)}
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
        </div>
      )}
    </div>
  );
}

function GameForm({
  game,
  onSave,
  onClose,
  saving,
}: {
  game: Game | null;
  onSave: (f: Partial<Game>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(game?.name || "");
  const [publisher, setPublisher] = useState(game?.publisher || "");
  const [slug, setSlug] = useState(game?.slug || "");
  const [shortDesc, setShortDesc] = useState(game?.short_desc || "");
  const [longDesc, setLongDesc] = useState((game?.long_desc || []).join("\n"));
  const [coverUrl, setCoverUrl] = useState(game?.cover_url || "");
  const [bannerUrl, setBannerUrl] = useState(game?.banner_url || "");
  const [badge, setBadge] = useState(game?.badge || "");
  const [tags, setTags] = useState(game?.tags || "");
  const [sortOrder, setSortOrder] = useState(String(game?.sort_order ?? 0));
  const [rating, setRating] = useState(String(game?.rating ?? 0));
  const [ratingCount, setRatingCount] = useState(game?.rating_count || "0");
  const [uploading, setUploading] = useState(false);

  const autoSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "cover_url" | "banner_url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "games");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      if (field === "cover_url") setCoverUrl(data.url);
      else setBannerUrl(data.url);
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-[18px] mb-5">
          {game ? "Edit Game" : "Tambah Game"}
        </h2>
        <div className="space-y-4">
          <Field label="Nama Game" value={name} onChange={setName} />
          <Field label="Publisher" value={publisher} onChange={setPublisher} />
          <Field label="Slug" value={slug || autoSlug} onChange={setSlug} hint="Otomatis dari nama" />
          <Field label="Short Description" value={shortDesc} onChange={setShortDesc} />
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
              Long Description (satu paragraf per baris)
            </label>
            <textarea
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl text-[13.5px] outline-none resize-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "cover_url")}
                className="text-[12px]"
                style={{ color: "var(--muted)" }}
              />
              {coverUrl && <img src={coverUrl} alt="Cover" className="mt-2 w-16 h-16 rounded-lg object-cover" />}
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "banner_url")}
                className="text-[12px]"
                style={{ color: "var(--muted)" }}
              />
              {bannerUrl && <img src={bannerUrl} alt="Banner" className="mt-2 w-16 h-16 rounded-lg object-cover" />}
            </div>
          </div>
          {uploading && <p className="text-[12px]" style={{ color: "var(--lime)" }}>Uploading...</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full h-10 px-3 rounded-xl text-[13.5px] outline-none"
                style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
              >
                <option value="">Tanpa Badge</option>
                <option value="BEST SELLER">BEST SELLER</option>
                <option value="HOT">HOT</option>
                <option value="POPULER">POPULER</option>
                <option value="BARU">BARU</option>
              </select>
            </div>
            <Field label="Tags" value={tags} onChange={setTags} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Urutan" value={sortOrder} onChange={setSortOrder} type="number" />
            <Field label="Rating" value={rating} onChange={setRating} type="number" />
            <Field label="Rating Count" value={ratingCount} onChange={setRatingCount} />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
              Fields (JSON)
            </label>
            <textarea
              value={JSON.stringify(game?.fields || [{ id: "userId", label: "User ID", placeholder: "Masukkan User ID" }], null, 2)}
              onChange={() => {}}
              readOnly
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl text-[12px] font-mono outline-none resize-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--muted)" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-[13.5px]">
            Batal
          </button>
          <button
            onClick={() =>
              onSave({
                name,
                publisher,
                slug: slug || autoSlug,
                short_desc: shortDesc,
                long_desc: longDesc.split("\n").filter(Boolean),
                cover_url: coverUrl,
                banner_url: bannerUrl,
                badge: badge || null,
                tags,
                sort_order: parseInt(sortOrder) || 0,
                rating: parseFloat(rating) || 0,
                rating_count: ratingCount,
              })
            }
            disabled={saving || !name}
            className="btn-primary px-6 py-2.5 text-[13.5px] disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DenomForm({
  denom,
  gameName,
  onSave,
  onClose,
  saving,
}: {
  denom: Denom | null;
  gameName: string;
  onSave: (f: Partial<Denom>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [amount, setAmount] = useState(denom?.amount || "");
  const [price, setPrice] = useState(String(denom?.price || ""));
  const [bonus, setBonus] = useState(denom?.bonus || "");
  const [isPopular, setIsPopular] = useState(denom?.is_popular || false);
  const [sortOrder, setSortOrder] = useState(String(denom?.sort_order ?? 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-[440px] rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-[17px] mb-1">
          {denom ? "Edit Nominal" : "Tambah Nominal"}
        </h2>
        <p className="text-[12.5px] mb-5" style={{ color: "var(--muted)" }}>{gameName}</p>
        <div className="space-y-3">
          <Field label="Jumlah (misal: 60 UC)" value={amount} onChange={setAmount} />
          <Field label="Harga (Rp)" value={price} onChange={setPrice} type="number" />
          <Field label="Bonus (opsional)" value={bonus} onChange={setBonus} />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="accent-[#c6f24e]"
              />
              Tandai sebagai Populer
            </label>
          </div>
          <Field label="Urutan" value={sortOrder} onChange={setSortOrder} type="number" />
        </div>
        <div className="flex items-center justify-end gap-3 mt-5">
          <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-[13px]">Batal</button>
          <button
            onClick={() => onSave({ amount, price: parseInt(price) || 0, bonus: bonus || null, is_popular: isPopular, sort_order: parseInt(sortOrder) || 0 })}
            disabled={saving || !amount || !price}
            className="btn-primary px-5 py-2.5 text-[13px] disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
        style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
      />
      {hint && <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>{hint}</p>}
    </div>
  );
}
