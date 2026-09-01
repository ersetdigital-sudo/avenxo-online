"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nav = [
  {
    label: "Produk",
    href: "/admin/produk",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    label: "Harga",
    href: "/admin/harga",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    label: "Pesanan",
    href: "/admin/pesanan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    ),
  },
  {
    label: "Pembayaran",
    href: "/admin/pembayaran",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // Login page doesn't use admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--ink)" }}>
      {/* SIDEBAR — desktop */}
      <aside
        className="hidden lg:flex flex-col w-[240px] shrink-0 sticky top-0 h-screen"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--line)",
        }}
      >
        <div className="px-5 py-5 flex items-center gap-2.5">
          <span
            className="grid place-items-center w-9 h-9 rounded-xl font-display font-extrabold text-[15px]"
            style={{ background: "var(--lime)", color: "#0B1207" }}
          >
            A
          </span>
          <span className="font-display font-bold text-[15px]">
            AVENXO
            <span style={{ color: "var(--muted)", fontWeight: 500 }}> ADMIN</span>
          </span>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors"
                style={{
                  background: active ? "rgba(198,242,78,.1)" : "transparent",
                  color: active ? "var(--lime)" : "var(--muted)",
                  border: active ? "1px solid rgba(198,242,78,.2)" : "1px solid transparent",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold"
            style={{ color: "var(--muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Lihat Situs
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold w-full text-left"
            style={{ color: "var(--amber)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid place-items-center w-9 h-9 rounded-xl"
            style={{ border: "1px solid var(--line)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="#EAF0F6" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
          </button>
          <span className="font-display font-bold text-[15px]">
            AVENXO <span style={{ color: "var(--muted)", fontWeight: 500 }}>ADMIN</span>
          </span>
        </header>

        {/* MOBILE SIDEBAR OVERLAY */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="w-[260px] h-full flex flex-col"
              style={{ background: "var(--surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-5 flex items-center justify-between">
                <span className="font-display font-bold text-[15px]">
                  AVENXO <span style={{ color: "var(--muted)", fontWeight: 500 }}>ADMIN</span>
                </span>
                <button onClick={() => setSidebarOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {nav.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors"
                      style={{
                        background: active ? "rgba(198,242,78,.1)" : "transparent",
                        color: active ? "var(--lime)" : "var(--muted)",
                        border: active ? "1px solid rgba(198,242,78,.2)" : "1px solid transparent",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-3 pb-4 space-y-2">
                <a
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold"
                  style={{ color: "var(--muted)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Lihat Situs
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold w-full text-left"
                  style={{ color: "var(--amber)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Keluar
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
