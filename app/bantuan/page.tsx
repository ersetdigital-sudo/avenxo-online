"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

type FaqItem = { q: string; a: string };
type FaqCategory = { title: string; icon: React.ReactNode; items: FaqItem[] };

const faqData: FaqCategory[] = [
  {
    title: "Seputar Pemesanan",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    ),
    items: [
      {
        q: "Bagaimana cara top up game di AVENXO ONLINE?",
        a: "Pilih game yang ingin kamu top up dari katalog, masukkan User ID (dan Zone ID jika diperlukan), pilih nominal, lalu bayar. Setelah pembayaran terkonfirmasi, diamond/UC/CP akan langsung masuk ke akun game kamu secara otomatis.",
      },
      {
        q: "Apakah perlu login/daftar akun untuk top up?",
        a: "Tidak perlu. AVENXO ONLINE tidak memerlukan registrasi akun. Cukup masukkan User ID game kamu, pilih nominal, bayar, dan selesai. Prosesnya cepat dan tanpa ribet.",
      },
      {
        q: "Berapa lama proses top up setelah pembayaran?",
        a: "Proses top up biasanya otomatis dan instan dalam 1-5 menit setelah pembayaran terkonfirmasi. Untuk metode QRIS dan e-wallet, proses biasanya lebih cepat. Jika lebih dari 10 menit belum masuk, silakan hubungi CS kami.",
      },
      {
        q: "Apa yang harus dilakukan jika User ID/Server salah dimasukkan?",
        a: "Sayangnya, pesanan yang sudah dibayar tidak dapat diubah atau dibatalkan. Pastikan User ID dan Server/Zone ID benar sebelum menyelesaikan pembayaran. Jika terjadi kesalahan, hubungi CS kami untuk bantuan lebih lanjut.",
      },
    ],
  },
  {
    title: "Seputar Pembayaran",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
    items: [
      {
        q: "Metode pembayaran apa saja yang tersedia?",
        a: "Kami menyediakan berbagai metode pembayaran: E-Wallet (QRIS, DANA, OVO, GoPay, ShopeePay), Virtual Account (BCA, BRI, BNI, Mandiri, CIMB), Transfer Bank (BCA, BRI, BNI), dan Pulsa (Telkomsel, XL, Tri).",
      },
      {
        q: "Apakah pembayaran QRIS aman?",
        a: "Ya, pembayaran QRIS sangat aman. QRIS adalah standar pembayaran nasional yang diawasi oleh Bank Indonesia. Semua transaksi di AVENXO ONLINE menggunakan koneksi terenkripsi dan tidak menyimpan data kartu kredit kamu.",
      },
      {
        q: "Berapa lama batas waktu pembayaran sebelum pesanan dibatalkan?",
        a: "Batas waktu pembayaran adalah 15 menit sejak pesanan dibuat. Jika tidak melakukan pembayaran dalam waktu tersebut, pesanan akan otomatis dibatalkan. Kamu bisa membuat pesanan baru kapan saja.",
      },
      {
        q: "Bagaimana jika sudah bayar tapi status masih pending?",
        a: "Tunggu beberapa menit karena proses verifikasi bisa memakan waktu. Jika sudah lebih dari 10 menit masih pending, screenshot bukti pembayaran dan hubungi CS kami melalui WhatsApp atau email.",
      },
    ],
  },
  {
    title: "Kendala & Komplain",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    items: [
      {
        q: "Diamond/UC/CP belum masuk padahal sudah bayar, harus bagaimana?",
        a: " Pertama, pastikan User ID yang dimasukkan benar. Jika benar dan sudah lebih dari 10 menit, silakan hubungi CS kami via WhatsApp dengan menyertakan: ID Pesanan, bukti pembayaran, dan screenshot profil game kamu. Tim kami akan segera memproses.",
      },
      {
        q: "Bagaimana cara refund jika pesanan gagal?",
        a: "Jika pesanan gagal diproses karena kesalahan sistem, dana akan dikembalikan secara otomatis ke metode pembayaran yang digunakan dalam 1×24 jam. Jika lebih dari 24 jam belum diterima, hubungi CS kami.",
      },
      {
        q: "Bagaimana cara menghubungi CS?",
        a: "Kamu bisa menghubungi CS kami melalui WhatsApp di nomor 0812-3456-7890 (chat only) atau email ke support@avenxoonline.net. Jam operasional: 24/7. Kami biasanya merespon dalam hitungan menit.",
      },
    ],
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--surface-2)",
        border: isOpen ? "1px solid rgba(198,242,78,.3)" : "1px solid var(--line)",
        transition: "border-color 0.25s",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span
          className="font-display font-semibold text-[14px] leading-snug"
          style={{ color: isOpen ? "var(--text)" : "var(--muted)" }}
        >
          {item.q}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? "var(--lime)" : "var(--muted)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? "300px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p
          className="px-5 pb-5 text-[13.5px] leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function BantuanPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return faqData;
    const q = search.toLowerCase();
    return faqData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search]);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="wrap pt-10 md:pt-16 pb-4">
        <div className="max-w-[640px] mx-auto text-center">
          <span
            className="inline-block font-display text-[10.5px] font-bold tracking-[.12em] px-3 py-1.5 rounded-md mb-5"
            style={{ background: "var(--lime)", color: "#0B1207" }}
          >
            BANTUAN
          </span>
          <h1 className="font-display font-extrabold text-[28px] sm:text-[36px] md:text-[42px] leading-[1.08]">
            Butuh{" "}
            <span style={{ color: "var(--lime)" }}>Bantuan?</span>
          </h1>
          <p
            className="mt-3 text-[14.5px] sm:text-[15.5px] leading-relaxed max-w-[480px] mx-auto"
            style={{ color: "var(--muted)" }}
          >
            Tim kami siap membantu kamu soal top up game, pembayaran, dan
            kendala transaksi lainnya.
          </p>

          {/* SEARCH */}
          <div className="mt-7 max-w-[480px] mx-auto">
            <div
              className="flex items-center gap-3 px-4 h-12 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-3.2-3.2"></path>
              </svg>
              <input
                type="search"
                placeholder="Cari pertanyaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent w-full text-[14px] outline-none placeholder:text-[#7A8798]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[12px] font-semibold shrink-0 px-2 py-1 rounded-lg"
                  style={{ color: "var(--muted)" }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap pt-8 md:pt-12">
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center gap-2.5 mb-4">
                {cat.icon}
                <h2 className="font-display font-bold text-[17px]">
                  {cat.title}
                </h2>
                <span
                  className="text-[11.5px] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--muted)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {cat.items.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {cat.items.map((item) => {
                  const key = `${cat.title}-${item.q}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={openItems.has(key)}
                      onToggle={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[15px]" style={{ color: "var(--muted)" }}>
              Tidak ada pertanyaan yang cocok dengan pencarian kamu.
            </p>
            <button
              onClick={() => setSearch("")}
              className="btn-ghost mt-4 px-6 py-2.5 text-[13.5px]"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>

      {/* KONTAK */}
      <section className="wrap pt-14 md:pt-20">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-[22px] sm:text-[26px]">
            Hubungi Kami
          </h2>
          <p
            className="mt-2 text-[14px] max-w-[400px] mx-auto"
            style={{ color: "var(--muted)" }}
          >
            Belum ketemu jawaban? Tim support kami siap membantu.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center mx-auto transition-colors duration-300"
              style={{
                background: "rgba(37,211,102,.12)",
                border: "1px solid rgba(37,211,102,.25)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-[15px] mt-4">
              WhatsApp CS
            </h3>
            <p className="text-[12.5px] mt-1.5" style={{ color: "var(--muted)" }}>
              Chat langsung dengan tim support kami
            </p>
            <span
              className="inline-block mt-4 px-5 py-2 rounded-xl text-[13px] font-display font-semibold transition-colors duration-300"
              style={{
                background: "rgba(37,211,102,.12)",
                color: "#25D366",
                border: "1px solid rgba(37,211,102,.3)",
              }}
            >
              Chat Sekarang
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:support@avenxoonline.net"
            className="group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center mx-auto"
              style={{
                background: "rgba(198,242,78,.1)",
                border: "1px solid rgba(198,242,78,.25)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--lime)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <h3 className="font-display font-bold text-[15px] mt-4">
              Email Support
            </h3>
            <p className="text-[12.5px] mt-1.5" style={{ color: "var(--muted)" }}>
              Kirim pertanyaan via email
            </p>
            <span
              className="inline-block mt-4 px-5 py-2 rounded-xl text-[13px] font-display font-semibold"
              style={{
                background: "rgba(198,242,78,.1)",
                color: "var(--lime)",
                border: "1px solid rgba(198,242,78,.25)",
              }}
            >
              support@avenxoonline.net
            </span>
          </a>

          {/* Jam Operasional */}
          <div
            className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center mx-auto"
              style={{
                background: "rgba(255,180,61,.1)",
                border: "1px solid rgba(255,180,61,.25)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--amber)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="font-display font-bold text-[15px] mt-4">
              Jam Operasional
            </h3>
            <p className="text-[12.5px] mt-1.5" style={{ color: "var(--muted)" }}>
              Customer support kami
            </p>
            <span
              className="inline-block mt-4 px-5 py-2 rounded-xl text-[13px] font-display font-bold"
              style={{
                background: "rgba(255,180,61,.1)",
                color: "var(--amber)",
                border: "1px solid rgba(255,180,61,.25)",
              }}
            >
              24 / 7
            </span>
          </div>
        </div>
      </section>

      {/* CTA PENUTUP */}
      <section className="wrap pt-14 md:pt-20 pb-12">
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
          }}
        >
          <h2 className="font-display font-bold text-[22px] sm:text-[26px]">
            Masih Bingung?{" "}
            <span style={{ color: "var(--lime)" }}>Top Up Aja</span>
          </h2>
          <p
            className="mt-2 text-[14.5px] max-w-[420px] mx-auto"
            style={{ color: "var(--muted)" }}
          >
            Proses cepat, harga transparan, tanpa ribet. Pilih game favorit kamu
            dan mulai top up sekarang.
          </p>
          <Link
            href="/#topup"
            className="btn-primary inline-block mt-6 px-8 py-3.5 text-[14.5px]"
          >
            Lihat Semua Game
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
