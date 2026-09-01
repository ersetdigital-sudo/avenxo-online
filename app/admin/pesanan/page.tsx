"use client";

import { useState, useEffect, useCallback } from "react";

type Order = {
  id: string;
  order_id: string;
  game_name: string;
  publisher: string;
  cover_url: string;
  user_id: string;
  zone_id: string | null;
  denom_amount: string;
  total: number;
  method_label: string;
  cat_key: string;
  status: string;
  payment_proof_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "rgba(255,180,61,.12)", color: "var(--amber)", border: "rgba(255,180,61,.28)" },
  dibayar: { bg: "rgba(100,180,255,.12)", color: "#64b5ff", border: "rgba(100,180,255,.28)" },
  diproses: { bg: "rgba(198,242,78,.12)", color: "var(--lime)", border: "rgba(198,242,78,.28)" },
  selesai: { bg: "rgba(80,220,130,.12)", color: "#50dc82", border: "rgba(80,220,130,.28)" },
  dibatalkan: { bg: "rgba(255,80,80,.12)", color: "#ff5050", border: "rgba(255,80,80,.28)" },
};

const STATUSES = ["pending", "dibayar", "diproses", "selesai", "dibatalkan"];

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

function formatDate(s: string) {
  return new Date(s).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const [stats, setStats] = useState({ today: 0, pending: 0, todayRevenue: 0, monthRevenue: 0 });
  const [saving, setSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (search) params.set("q", search);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setStats(data.stats || { today: 0, pending: 0, todayRevenue: 0, monthRevenue: 0 });
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleStatus = async (orderId: string, newStatus: string) => {
    setSaving(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      loadOrders();
      if (detail?.id === orderId) setDetail({ ...detail!, status: newStatus });
    } catch {}
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] sm:text-[26px] mb-6">Kelola Pesanan</h1>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pesanan Hari Ini" value={String(stats.today)} />
        <StatCard label="Pending" value={String(stats.pending)} highlight />
        <StatCard label="Omset Hari Ini" value={rupiah(stats.todayRevenue)} />
        <StatCard label="Omset Bulan Ini" value={rupiah(stats.monthRevenue)} />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-[360px]"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-3.2-3.2"></path>
          </svg>
          <input
            type="search"
            placeholder="Cari invoice / User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-[13.5px] outline-none placeholder:text-[#7A8798]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>Semua</FilterBtn>
          {STATUSES.map((s) => (
            <FilterBtn key={s} active={filter === s} onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </FilterBtn>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Tidak ada pesanan ditemukan.</div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Invoice</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Game</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Nominal</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Total</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Status</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Waktu</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const sc = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="px-4 py-3 font-display font-semibold text-[12.5px]">{o.order_id}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{o.game_name}</span>
                        <span className="block text-[11.5px]" style={{ color: "var(--muted)" }}>{o.method_label}</span>
                      </td>
                      <td className="px-4 py-3">{o.denom_amount}</td>
                      <td className="px-4 py-3 font-display font-bold" style={{ color: "var(--lime)" }}>{rupiah(o.total)}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-1 rounded-lg text-[11.5px] font-bold capitalize"
                          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: "var(--muted)" }}>{formatDate(o.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDetail(o)}
                          className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDetail(null)}>
          <div
            className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-[17px]">Detail Pesanan</h2>
              <button onClick={() => setDetail(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <InfoRow label="Invoice" value={detail.order_id} />
              <InfoRow label="Game" value={`${detail.game_name} — ${detail.publisher}`} />
              <InfoRow label="User ID" value={detail.zone_id ? `${detail.user_id} (${detail.zone_id})` : detail.user_id} />
              <InfoRow label="Nominal" value={detail.denom_amount} />
              <InfoRow label="Metode Bayar" value={detail.method_label} />
              <InfoRow label="Total" value={rupiah(detail.total)} highlight />
              <InfoRow label="Status" value={detail.status.toUpperCase()} />
              <InfoRow label="Dibuat" value={formatDate(detail.created_at)} />
              <InfoRow label="Diupdate" value={formatDate(detail.updated_at)} />
              {detail.notes && <InfoRow label="Catatan" value={detail.notes} />}
              {detail.payment_proof_url && (
                <div>
                  <span className="block text-[12.5px] mb-1.5" style={{ color: "var(--muted)" }}>Bukti Bayar</span>
                  <img src={detail.payment_proof_url} alt="Bukti Bayar" className="w-full max-w-[300px] rounded-xl" />
                </div>
              )}
            </div>

            <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
              <p className="text-[12.5px] font-semibold mb-2" style={{ color: "var(--muted)" }}>Ubah Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => {
                  const sc = STATUS_COLORS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatus(detail.id, s)}
                      disabled={saving || detail.status === s}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold capitalize disabled:opacity-40"
                      style={{
                        background: detail.status === s ? sc.bg : "var(--surface-2)",
                        color: detail.status === s ? sc.color : "var(--muted)",
                        border: detail.status === s ? `1px solid ${sc.border}` : "1px solid var(--line)",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      <span className="block text-[11.5px] font-semibold" style={{ color: "var(--muted)" }}>{label}</span>
      <span
        className="font-display font-extrabold text-[20px] mt-1 block"
        style={{ color: highlight ? "var(--amber)" : "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
      style={{
        background: active ? "rgba(198,242,78,.12)" : "transparent",
        color: active ? "var(--lime)" : "var(--muted)",
        border: active ? "1px solid rgba(198,242,78,.28)" : "1px solid var(--line)",
      }}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>{label}</span>
      <span
        className="text-[13.5px] font-display font-semibold text-right"
        style={{ color: highlight ? "var(--lime)" : "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}
