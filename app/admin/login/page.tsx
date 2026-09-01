"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }
    router.push("/admin/produk");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--ink)" }}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl p-8"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl grid place-items-center mx-auto font-display font-extrabold text-[18px]"
            style={{ background: "var(--lime)", color: "#0B1207" }}
          >
            A
          </div>
          <h1 className="font-display font-bold text-[20px] mt-4">
            Admin AVENXO
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ color: "var(--muted)" }}
          >
            Masuk ke dashboard admin
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              className="block text-[12.5px] font-semibold mb-1.5"
              style={{ color: "var(--muted)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@avenxoonline.net"
              required
              className="w-full h-11 px-3.5 rounded-xl text-[14px] outline-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                color: "var(--text)",
              }}
            />
          </div>
          <div>
            <label
              className="block text-[12.5px] font-semibold mb-1.5"
              style={{ color: "var(--muted)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 px-3.5 rounded-xl text-[14px] outline-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                color: "var(--text)",
              }}
            />
          </div>

          {error && (
            <div
              className="px-3.5 py-2.5 rounded-xl text-[13px]"
              style={{
                background: "rgba(255,180,61,.12)",
                color: "var(--amber)",
                border: "1px solid rgba(255,180,61,.28)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[14.5px] disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center mt-5 text-[13px] font-semibold"
          style={{ color: "var(--muted)" }}
        >
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
