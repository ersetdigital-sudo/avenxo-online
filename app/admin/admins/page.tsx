"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  user_metadata: { display_name?: string; role?: string };
  created_at: string;
  last_sign_in_at: string | null;
};

export default function AdminsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleCreate = async (form: { email: string; password: string; display_name: string }) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      flash("ok", "Admin berhasil ditambahkan.");
      setShowForm(false);
      load();
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Gagal menambahkan admin.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal");
      }
      flash("ok", `Akses ${deleteTarget.email} berhasil dicabut.`);
      setDeleteTarget(null);
      load();
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Gagal menghapus admin.");
    }
    setSaving(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-[22px] sm:text-[26px]">Admins</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary px-4 py-2 text-[13px]"
        >
          + Tambah Admin
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

      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading...</div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Nama</th>
                  <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Email</th>
                  <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Role</th>
                  <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Dibuat</th>
                  <th className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  const name = u.user_metadata?.display_name || "—";
                  const role = u.user_metadata?.role || "admin";
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: "1px solid var(--line)" }}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-[13.5px] font-semibold" style={{ color: "var(--text)" }}>
                          {name}
                        </span>
                        {isSelf && (
                          <span
                            className="ml-2 inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold uppercase"
                            style={{ background: "rgba(198,242,78,.15)", color: "var(--lime)" }}
                          >
                            Kamu
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[13px]" style={{ color: "var(--muted)" }}>
                        {u.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize"
                          style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--line)" }}
                        >
                          {role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12.5px]" style={{ color: "var(--muted)" }}>
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        {!isSelf && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold"
                            style={{ background: "rgba(255,80,80,.1)", color: "#ff5050" }}
                          >
                            Cabut Akses
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-[13px]" style={{ color: "var(--muted)" }}>
                      Belum ada admin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD ADMIN MODAL */}
      {showForm && (
        <AddAdminForm
          onSave={handleCreate}
          onClose={() => setShowForm(false)}
          saving={saving}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDeleteTarget(null)}>
          <div
            className="w-full max-w-[400px] rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-[16px] mb-2">Cabut Akses Admin</h3>
            <p className="text-[13.5px] mb-5" style={{ color: "var(--muted)" }}>
              Yakin mau cabut akses <strong style={{ color: "var(--text)" }}>{deleteTarget.email}</strong>? Admin ini tidak akan bisa login lagi.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-ghost px-5 py-2.5 text-[13px]"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-5 py-2.5 text-[13px] font-semibold rounded-xl disabled:opacity-60"
                style={{ background: "rgba(255,80,80,.15)", color: "#ff5050", border: "1px solid rgba(255,80,80,.3)" }}
              >
                {saving ? "Menghapus..." : "Ya, Cabut Akses"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddAdminForm({
  onSave,
  onClose,
  saving,
}: {
  onSave: (f: { email: string; password: string; display_name: string }) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-[440px] rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-[17px] mb-5">Tambah Admin Baru</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@avenxoonline.net"
              className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Nama Tampil</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="misal: Budi Admin"
              className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Password (min 6 karakter)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full h-10 px-3.5 rounded-xl text-[13.5px] outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-5">
          <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-[13px]">Batal</button>
          <button
            onClick={() => onSave({ email, password, display_name: displayName })}
            disabled={saving || !email || !password}
            className="btn-primary px-5 py-2.5 text-[13px] disabled:opacity-60"
          >
            {saving ? "Menambahkan..." : "Tambah Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
