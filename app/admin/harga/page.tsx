"use client";

import { useState, useEffect, useCallback } from "react";

type Game = {
  id: string;
  slug: string;
  name: string;
  cover_url: string;
  is_active: boolean;
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

export default function AdminHargaPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [allDenoms, setAllDenoms] = useState<Record<string, Denom[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formGameId, setFormGameId] = useState("");
  const [editingDenom, setEditingDenom] = useState<Denom | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/games");
    const data = await res.json();
    const g: Game[] = data.games || [];
    setGames(g);

    const denomsMap: Record<string, Denom[]> = {};
    await Promise.all(
      g.map(async (game) => {
        const r = await fetch(`/api/admin/denoms?game_id=${game.id}`);
        const d = await r.json();
        denomsMap[game.id] = d.denoms || [];
      })
    );
    setAllDenoms(denomsMap);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (form: Partial<Denom>) => {
    setSaving(true);
    try {
      const method = editingDenom ? "PUT" : "POST";
      const body = editingDenom
        ? { ...form, id: editingDenom.id }
        : { ...form, game_id: formGameId };
      const res = await fetch("/api/admin/denoms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      flash("ok", editingDenom ? "Harga diperbarui." : "Harga ditambahkan.");
      setShowForm(false);
      setEditingDenom(null);
      loadAll();
    } catch {
      flash("err", "Gagal menyimpan.");
    }
    setSaving(false);
  };

  const handleDelete = async (gameId: string, denomId: string) => {
    if (!confirm("Hapus nominal ini?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/denoms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: denomId }),
      });
      if (!res.ok) throw new Error();
      flash("ok", "Nominal dihapus.");
      loadAll();
    } catch {
      flash("err", "Gagal menghapus.");
    }
    setSaving(false);
  };

  const handleToggle = async (gameId: string, denom: Denom) => {
    setSaving(true);
    try {
      await fetch("/api/admin/denoms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: denom.id, is_active: !denom.is_active }),
      });
      loadAll();
    } catch {}
    setSaving(false);
  };

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleGames = selectedGame === "all"
    ? filteredGames
    : filteredGames.filter((g) => g.id === selectedGame);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-[22px] sm:text-[26px]">Kelola Harga</h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--muted)" }}>
            Atur semua nominal & harga per game
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDenom(null);
            setFormGameId(games[0]?.id || "");
            setShowForm(true);
          }}
          className="btn-primary px-5 py-2.5 text-[13.5px]"
        >
          + Tambah Harga
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

      {showForm && (
        <HargaForm
          denom={editingDenom}
          games={games}
          defaultGameId={formGameId}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingDenom(null); }}
          saving={saving}
          onChangeGame={setFormGameId}
        />
      )}

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari game..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 px-4 rounded-xl text-[13.5px] outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text)" }}
        />
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="h-10 px-4 rounded-xl text-[13.5px] outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text)" }}
        >
          <option value="all">Semua Game</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading...</div>
      ) : visibleGames.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>
          {search ? "Game tidak ditemukan." : "Belum ada game."}
        </div>
      ) : (
        <div className="space-y-6">
          {visibleGames.map((g) => {
            const denoms = (allDenoms[g.id] || []).sort((a, b) => a.sort_order - b.sort_order);
            const prices = denoms.map((d) => d.price).filter((p) => p > 0);
            const minPrice = prices.length ? Math.min(...prices) : 0;
            const maxPrice = prices.length ? Math.max(...prices) : 0;

            return (
              <div
                key={g.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  opacity: g.is_active ? 1 : 0.55,
                }}
              >
                {/* GAME HEADER */}
                <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
                  <img
                    src={g.cover_url}
                    alt={g.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    style={{ border: "1px solid var(--line)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-bold text-[14.5px]">{g.name}</span>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                      {denoms.length} nominal
                      {prices.length > 0 && (
                        <> · {rupiah(minPrice)} — {rupiah(maxPrice)}</>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingDenom(null);
                      setFormGameId(g.id);
                      setShowForm(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold shrink-0"
                    style={{
                      background: "rgba(198,242,78,.1)",
                      color: "var(--lime)",
                      border: "1px solid rgba(198,242,78,.25)",
                    }}
                  >
                    + Tambah
                  </button>
                </div>

                {/* DENOMS TABLE */}
                {denoms.length === 0 ? (
                  <div className="px-5 py-6 text-center text-[13px]" style={{ color: "var(--amber)" }}>
                    Belum ada nominal
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr style={{ color: "var(--muted)" }}>
                          <th className="text-left px-5 py-2.5 font-semibold">Nominal</th>
                          <th className="text-left px-5 py-2.5 font-semibold">Harga</th>
                          <th className="text-left px-5 py-2.5 font-semibold hidden sm:table-cell">Bonus</th>
                          <th className="text-center px-5 py-2.5 font-semibold">Status</th>
                          <th className="text-right px-5 py-2.5 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {denoms.map((d) => (
                          <tr
                            key={d.id}
                            style={{
                              borderTop: "1px solid var(--line)",
                              opacity: d.is_active ? 1 : 0.5,
                            }}
                          >
                            <td className="px-5 py-3">
                              <span className="font-semibold text-[13.5px]">{d.amount}</span>
                              {d.is_popular && (
                                <span
                                  className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded align-middle"
                                  style={{ background: "var(--lime)", color: "#0B1207" }}
                                >
                                  POPULER
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 font-semibold" style={{ color: "var(--lime)" }}>
                              {rupiah(d.price)}
                            </td>
                            <td className="px-5 py-3 hidden sm:table-cell" style={{ color: d.bonus ? "var(--text)" : "var(--muted)" }}>
                              {d.bonus ? `+${d.bonus}` : "—"}
                            </td>
                            <td className="px-5 py-3 text-center">
                              <button
                                onClick={() => handleToggle(g.id, d)}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded"
                                style={{
                                  background: d.is_active ? "rgba(198,242,78,.12)" : "rgba(255,180,61,.12)",
                                  color: d.is_active ? "var(--lime)" : "var(--amber)",
                                }}
                              >
                                {d.is_active ? "Aktif" : "Off"}
                              </button>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => { setEditingDenom(d); setFormGameId(g.id); setShowForm(true); }}
                                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                                  style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(g.id, d.id)}
                                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                                  style={{ background: "rgba(255,80,80,.1)", color: "#ff5050" }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HargaForm({
  denom,
  games,
  defaultGameId,
  onSave,
  onClose,
  saving,
  onChangeGame,
}: {
  denom: Denom | null;
  games: Game[];
  defaultGameId: string;
  onSave: (f: Partial<Denom>) => void;
  onClose: () => void;
  saving: boolean;
  onChangeGame: (id: string) => void;
}) {
  const [gameId, setGameId] = useState(defaultGameId);
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
        <h2 className="font-display font-bold text-[17px] mb-5">
          {denom ? "Edit Harga" : "Tambah Harga Baru"}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
              Pilih Game
            </label>
            <select
              value={gameId}
              onChange={(e) => { setGameId(e.target.value); onChangeGame(e.target.value); }}
              disabled={!!denom}
              className="w-full h-10 px-3 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)", opacity: denom ? 0.5 : 1 }}
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <Field label="Nominal (misal: 60 UC)" value={amount} onChange={setAmount} />
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
              Tandai Populer
            </label>
          </div>
          <Field label="Urutan" value={sortOrder} onChange={setSortOrder} type="number" />
        </div>
        <div className="flex items-center justify-end gap-3 mt-5">
          <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-[13px]">Batal</button>
          <button
            onClick={() => onSave({
              amount,
              price: parseInt(price) || 0,
              bonus: bonus || null,
              is_popular: isPopular,
              sort_order: parseInt(sortOrder) || 0,
            })}
            disabled={saving || !amount || !price || !gameId}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
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
    </div>
  );
}
