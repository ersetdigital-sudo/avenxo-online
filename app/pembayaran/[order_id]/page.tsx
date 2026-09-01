"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { rupiah } from "@/lib/games";

type OrderData = {
  orderId: string;
  gameSlug: string;
  gameName: string;
  publisher: string;
  cover: string;
  userId: string;
  zoneId?: string;
  denomAmount: string;
  denomId: string;
  total: number;
  methodId: string;
  methodLabel: string;
  catKey: string;
  createdAt: string;
};

const TIMER_MINUTES = 15;

function parseOrder(search: URLSearchParams): OrderData | null {
  try {
    const raw = search.get("order");
    if (!raw) return null;
    return JSON.parse(raw) as OrderData;
  } catch {
    return null;
  }
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function copyText(t: string) {
  navigator.clipboard.writeText(t).catch(() => {});
}

export default function PembayaranPage({
  params,
}: {
  params: Promise<{ order_id: string }>;
}) {
  const { order_id } = use(params);
  const search = useSearchParams();
  const router = useRouter();
  const order = parseOrder(search);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [timeoutMin, setTimeoutMin] = useState(TIMER_MINUTES);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      const m = parseInt(d.settings?.payment_timeout_minutes);
      if (m > 0) setTimeoutMin(m);
    }).catch(() => {});
    fetch("/api/payment-methods").then((r) => r.json()).then((d) => {
      for (const cat of d.categories || []) {
        for (const m of cat.methods || []) {
          if (m.label.toLowerCase() === "qris" && m.qrImageUrl) {
            setQrUrl(m.qrImageUrl);
          }
        }
      }
    }).catch(() => {});
  }, []);

  const secondsLeft = useMemo(() => {
    if (!order) return 0;
    const elapsed = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / 1000
    );
    return Math.max(0, timeoutMin * 60 - elapsed);
  }, [order, timeoutMin]);

  const [remaining, setRemaining] = useState(secondsLeft);

  useEffect(() => {
    if (remaining <= 0 && order) {
      router.replace(`/pesanan-berhasil/${order.orderId}?order=${search.get("order")}`);
      return;
    }
    const id = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, order, router, search]);

  const handleCopy = (text: string) => {
    copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <SiteShell>
        <section className="wrap py-20 text-center">
          <h1 className="font-display font-bold text-[22px]">
            Pesanan tidak ditemukan
          </h1>
          <p className="mt-3 text-[14px]" style={{ color: "var(--muted)" }}>
            Silakan lakukan pemesanan ulang dari katalog game.
          </p>
          <Link
            href="/"
            className="btn-primary inline-block mt-6 px-8 py-3 text-[14px]"
          >
            Kembali ke Beranda
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      {/* HEADER BAR */}
      <section className="wrap pt-6 md:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11.5px] font-semibold tracking-[.08em] uppercase" style={{ color: "var(--muted)" }}>
              ID Pesanan
            </p>
            <p className="font-display font-bold text-[16px] sm:text-[18px] mt-1" style={{ color: "var(--lime)" }}>
              {order.orderId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold" style={{ color: remaining <= 300 ? "var(--amber)" : "var(--muted)" }}>
              Sisa Waktu
            </span>
            <span
              className="font-display font-bold text-[18px] tabular-nums px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                color: remaining <= 300 ? "var(--amber)" : "var(--text)",
              }}
            >
              {formatTime(remaining)}
            </span>
          </div>
        </div>

        {remaining <= 300 && remaining > 0 && (
          <div
            className="mt-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
            style={{
              background: "rgba(255,180,61,.1)",
              color: "var(--amber)",
              border: "1px solid rgba(255,180,61,.28)",
            }}
          >
            ⚠️ Waktu pembayaran hampir habis. Silakan selesaikan pembayaran sekarang.
          </div>
        )}
      </section>

      {/* MAIN */}
      <section className="wrap pt-5 pb-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-5">
          {/* LEFT: PAYMENT INSTRUCTIONS */}
          <div className="space-y-4">
            {/* ORDER SUMMARY */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <h2 className="font-display font-bold text-[15px] mb-4">Ringkasan Pesanan</h2>
              <div className="flex items-start gap-4">
                <img
                  src={order.cover}
                  alt={order.gameName}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                  style={{ border: "1px solid var(--line)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[15px] leading-tight">{order.gameName}</p>
                  <p className="text-[12.5px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {order.publisher}
                  </p>
                </div>
              </div>
              <div
                className="mt-4 pt-4 space-y-2.5"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <InfoRow label="User ID" value={order.zoneId ? `${order.userId} (${order.zoneId})` : order.userId} />
                <InfoRow label="Nominal" value={order.denomAmount} />
                <InfoRow label="Metode Bayar" value={order.methodLabel} />
                <div className="h-px" style={{ background: "var(--line)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--muted)" }}>Total Bayar</span>
                  <span className="font-display font-extrabold text-[20px]" style={{ color: "var(--lime)" }}>
                    {rupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT INSTRUCTIONS */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <h2 className="font-display font-bold text-[15px] mb-4">Instruksi Pembayaran</h2>
              <PaymentInstruction
                methodId={order.methodId}
                methodLabel={order.methodLabel}
                catKey={order.catKey}
                total={order.total}
                copied={copied}
                onCopy={handleCopy}
                qrUrl={qrUrl}
              />
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:sticky lg:top-[80px] self-start space-y-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <h3 className="font-display font-bold text-[14px] mb-3">Metode Pembayaran</h3>
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
              >
                <span
                  className="w-10 h-10 rounded-lg grid place-items-center text-[18px] shrink-0"
                  style={{ background: "var(--lime)", color: "#0B1207" }}
                >
                  {order.catKey === "ewallet" && order.methodLabel.toLowerCase() === "qris" && "📱"}
                  {order.catKey === "ewallet" && order.methodLabel.toLowerCase() !== "qris" && "💰"}
                  {order.catKey === "va" && "🏦"}
                  {order.catKey === "bank" && "🏛️"}
                  {order.catKey === "pulsa" && "📶"}
                </span>
                <div>
                  <p className="font-display font-bold text-[14px]">{order.methodLabel}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {order.catKey === "ewallet" && order.methodLabel.toLowerCase() === "qris"
                      ? "Scan QRIS di bawah"
                      : `Bayar via ${order.methodLabel}`}
                  </p>
                </div>
              </div>

              <div
                className="mt-4 pt-4 space-y-2"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <InfoRow label="Total" value={rupiah(order.total)} />
                <InfoRow label="Status" value="Menunggu Pembayaran" />
                <InfoRow label="Batas Waktu" value={formatTime(remaining)} />
              </div>

              <Link
                href={`/pesanan-berhasil/${order.orderId}?order=${encodeURIComponent(JSON.stringify(order))}`}
                className="btn-primary block w-full mt-5 py-3.5 text-center text-[14.5px]"
              >
                Saya Sudah Bayar
              </Link>
              <Link
                href={`/top-up/${order.gameSlug}`}
                className="btn-ghost block w-full mt-2 py-3 text-center text-[13.5px]"
              >
                Batalkan Pesanan
              </Link>
            </div>

            <div
              className="rounded-2xl p-5 text-[12.5px] space-y-2"
              style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--muted)" }}
            >
              <h4 className="font-display font-semibold text-[13px] mb-1" style={{ color: "var(--text)" }}>
                Tips Pembayaran
              </h4>
              <p>· Selesaikan pembayaran sebelum waktu habis.</p>
              <p>· Setelah bayar, klik &quot;Saya Sudah Bayar&quot; untuk konfirmasi.</p>
              <p>· Proses otomatis setelah pembayaran dikonfirmasi.</p>
              <p>· Hubungi CS bila ada kendala pembayaran.</p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="text-[13.5px] font-display font-semibold" style={{ color: "var(--text)" }}>{value}</span>
    </div>
  );
}

function PaymentInstruction({
  methodId,
  methodLabel,
  catKey,
  total,
  copied,
  onCopy,
  qrUrl,
}: {
  methodId: string;
  methodLabel: string;
  catKey: string;
  total: number;
  copied: boolean;
  onCopy: (t: string) => void;
  qrUrl: string | null;
}) {
  const [tab, setTab] = useState(methodId);

  const isQRIS = methodLabel.toLowerCase() === "qris";

  if (catKey === "ewallet") {
    return (
      <div>
        {/* QRIS */}
        {isQRIS && (
          <div className="text-center">
            {qrUrl ? (
              <>
                <div
                  className="inline-block rounded-2xl p-4"
                  style={{ background: "#fff", padding: "16px" }}
                >
                  <img
                    src={qrUrl}
                    alt="QRIS Code"
                    className="w-[220px] h-[220px] object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className="mt-3 text-[13px]" style={{ color: "var(--muted)" }}>
                  Scan kode QR ini menggunakan aplikasi e-wallet atau mobile banking kamu.
                </p>
              </>
            ) : (
              <div
                className="inline-block rounded-2xl p-8"
                style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                  <line x1="21" y1="14" x2="21" y2="14.01"></line>
                  <line x1="21" y1="21" x2="21" y2="21.01"></line>
                  <line x1="14" y1="21" x2="14" y2="21.01"></line>
                  <line x1="21" y1="7" x2="21" y2="7.01"></line>
                </svg>
                <p className="mt-3 text-[13px] font-semibold" style={{ color: "var(--amber)" }}>
                  QR Code belum tersedia
                </p>
                <p className="mt-1 text-[12px]" style={{ color: "var(--muted)" }}>
                  Hubungi admin untuk upload QRIS.
                </p>
              </div>
            )}
            <div
              className="mt-4 rounded-xl p-3 flex items-center justify-between gap-3"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
            >
              <span className="text-[13px] font-mono" style={{ color: "var(--text)" }}>
                QRIS-AVX-081234567890
              </span>
              <button
                onClick={() => onCopy("QRIS-AVX-081234567890")}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold shrink-0"
                style={{
                  background: copied ? "rgba(198,242,78,.15)" : "var(--surface)",
                  border: "1px solid var(--line)",
                  color: copied ? "var(--lime)" : "var(--muted)",
                }}
              >
                {copied ? "✓ Tersalin" : "Salin Kode"}
              </button>
            </div>
            <ol className="mt-4 text-[13px] text-left space-y-2" style={{ color: "var(--muted)" }}>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>01</span>
                Buka aplikasi e-wallet / mobile banking.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>02</span>
                Pilih menu Scan QR / QRIS.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>03</span>
                Scan kode QR di atas.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>04</span>
                Konfirmasi pembayaran sebesar {rupiah(total)}.
              </li>
            </ol>
          </div>
        )}

        {/* DANA / OVO / GoPay / ShopeePay */}
        {!isQRIS && (
          <div>
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
            >
              <p className="text-[12px] mb-2" style={{ color: "var(--muted)" }}>Nomor Tujuan</p>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-[18px] tracking-wide" style={{ color: "var(--text)" }}>
                  0812-3456-7890
                </span>
                <button
                  onClick={() => onCopy("081234567890")}
                  className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold shrink-0"
                  style={{
                    background: copied ? "rgba(198,242,78,.15)" : "var(--surface)",
                    border: "1px solid var(--line)",
                    color: copied ? "var(--lime)" : "var(--muted)",
                  }}
                >
                  {copied ? "✓ Tersalin" : "Salin"}
                </button>
              </div>
              <p className="text-[12px] mt-2" style={{ color: "var(--muted)" }}>
                Transfer ke nomor ini sebesar {rupiah(total)}
              </p>
            </div>
            <ol className="mt-4 text-[13px] text-left space-y-2" style={{ color: "var(--muted)" }}>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>01</span>
                Buka aplikasi {methodLabel}.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>02</span>
                Pilih menu Transfer / Kirim.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>03</span>
                Masukkan nomor tujuan di atas.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>04</span>
                Masukkan jumlah {rupiah(total)}.
              </li>
              <li className="flex gap-2">
                <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>05</span>
                Konfirmasi pembayaran.
              </li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  /* VA / Bank Transfer / Pulsa */
  return (
    <div>
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
      >
        {catKey === "va" && (
          <>
            <p className="text-[12px] mb-2" style={{ color: "var(--muted)" }}>Nomor Virtual Account</p>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-[18px] tracking-wide" style={{ color: "var(--text)" }}>
                8808-1234-5678-9012
              </span>
              <button
                onClick={() => onCopy("8808123456789012")}
                className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold shrink-0"
                style={{
                  background: copied ? "rgba(198,242,78,.15)" : "var(--surface)",
                  border: "1px solid var(--line)",
                  color: copied ? "var(--lime)" : "var(--muted)",
                }}
              >
                {copied ? "✓ Tersalin" : "Salin"}
              </button>
            </div>
          </>
        )}
        {catKey === "bank" && (
          <>
            <p className="text-[12px] mb-2" style={{ color: "var(--muted)" }}>Rekening Tujuan</p>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-[18px] tracking-wide" style={{ color: "var(--text)" }}>
                1234-5678-9012
              </span>
              <button
                onClick={() => onCopy("123456789012")}
                className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold shrink-0"
                style={{
                  background: copied ? "rgba(198,242,78,.15)" : "var(--surface)",
                  border: "1px solid var(--line)",
                  color: copied ? "var(--lime)" : "var(--muted)",
                }}
              >
                {copied ? "✓ Tersalin" : "Salin"}
              </button>
            </div>
            <p className="text-[12px] mt-2" style={{ color: "var(--muted)" }}>
              a.n. PT Avenxo Digital Indonesia
            </p>
          </>
        )}
        {catKey === "pulsa" && (
          <>
            <p className="text-[12px] mb-2" style={{ color: "var(--muted)" }}>Nomor Pengirim Pulsa</p>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-[18px] tracking-wide" style={{ color: "var(--text)" }}>
                0812-3456-7890
              </span>
              <button
                onClick={() => onCopy("081234567890")}
                className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold shrink-0"
                style={{
                  background: copied ? "rgba(198,242,78,.15)" : "var(--surface)",
                  border: "1px solid var(--line)",
                  color: copied ? "var(--lime)" : "var(--muted)",
                }}
              >
                {copied ? "✓ Tersalin" : "Salin"}
              </button>
            </div>
            <p className="text-[12px] mt-2" style={{ color: "var(--muted)" }}>
              Kirim pulsa senilai {rupiah(total)} ke nomor di atas.
            </p>
          </>
        )}
      </div>
      <ol className="mt-4 text-[13px] text-left space-y-2" style={{ color: "var(--muted)" }}>
        {catKey === "va" && (
          <>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>01</span>
              Buka aplikasi mobile banking atau ATM {methodLabel.replace(" VA", "")}.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>02</span>
              Pilih menu Virtual Account / Transfer VA.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>03</span>
              Masukkan nomor VA di atas.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>04</span>
              Konfirmasi pembayaran sebesar {rupiah(total)}.
            </li>
          </>
        )}
        {catKey === "bank" && (
          <>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>01</span>
              Buka mobile banking / ATM {methodLabel}.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>02</span>
              Pilih menu Transfer ke Rekening Bank Lain.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>03</span>
              Masukkan rekening tujuan di atas.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>04</span>
              Masukkan jumlah {rupiah(total)}.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>05</span>
              Simpan bukti transfer.
            </li>
          </>
        )}
        {catKey === "pulsa" && (
          <>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>01</span>
              Buka menu panggilan di hp kamu.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>02</span>
              Ketik kode transfer pulsa {methodLabel === "Telkomsel" ? "*123*" : methodLabel === "XL" ? "*123*" : "*862*"} dan nomor tujuan.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>03</span>
              Kirim pulsa senilai {rupiah(total)}.
            </li>
            <li className="flex gap-2">
              <span className="font-display font-bold shrink-0" style={{ color: "var(--lime)" }}>04</span>
              Simpan bukti pengiriman pulsa.
            </li>
          </>
        )}
      </ol>
    </div>
  );
}
