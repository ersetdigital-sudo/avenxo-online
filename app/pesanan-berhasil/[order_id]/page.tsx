"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
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

function parseOrder(search: URLSearchParams): OrderData | null {
  try {
    const raw = search.get("order");
    if (!raw) return null;
    return JSON.parse(raw) as OrderData;
  } catch {
    return null;
  }
}

export default function PesananBerhasilPage({
  params,
}: {
  params: Promise<{ order_id: string }>;
}) {
  const { order_id } = use(params);
  const search = useSearchParams();
  const order = parseOrder(search);

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
      <section className="wrap py-10 md:py-16">
        <div className="max-w-[560px] mx-auto text-center">
          {/* SUCCESS ICON */}
          <div className="relative inline-block mb-6">
            <div
              className="w-20 h-20 rounded-full grid place-items-center"
              style={{
                background: "rgba(198,242,78,.12)",
                border: "2px solid rgba(198,242,78,.4)",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--lime)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div
              className="absolute -inset-3 rounded-full animate-ping opacity-20"
              style={{ background: "var(--lime)" }}
            />
          </div>

          <h1 className="font-display font-extrabold text-[24px] sm:text-[28px] leading-tight">
            Pesanan Diterima!
          </h1>
          <p
            className="mt-3 text-[14.5px] max-w-[420px] mx-auto"
            style={{ color: "var(--muted)" }}
          >
            Terima kasih! Pesanan kamu sedang kami proses. Diamond / item akan
            masuk ke akun game dalam beberapa menit.
          </p>

          {/* ORDER CARD */}
          <div
            className="mt-8 rounded-2xl p-5 sm:p-6 text-left"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <div className="flex items-start gap-4">
              <img
                src={order.cover}
                alt={order.gameName}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
                style={{ border: "1px solid var(--line)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[15px]">
                  {order.gameName}
                </p>
                <p className="text-[12.5px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {order.publisher}
                </p>
              </div>
            </div>

            <div
              className="mt-4 pt-4 space-y-2.5"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <InfoRow
                label="ID Pesanan"
                value={order.orderId}
                highlight
              />
              <InfoRow
                label="User ID"
                value={
                  order.zoneId
                    ? `${order.userId} (${order.zoneId})`
                    : order.userId
                }
              />
              <InfoRow label="Nominal" value={order.denomAmount} />
              <InfoRow label="Metode Bayar" value={order.methodLabel} />
              <div className="h-px" style={{ background: "var(--line)" }} />
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--muted)" }}
                >
                  Total Bayar
                </span>
                <span
                  className="font-display font-extrabold text-[18px]"
                  style={{ color: "var(--lime)" }}
                >
                  {rupiah(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div
            className="mt-5 rounded-xl p-4 flex items-start gap-3"
            style={{
              background: "rgba(255,180,61,.08)",
              border: "1px solid rgba(255,180,61,.25)",
              textAlign: "left",
            }}
          >
            <span className="text-[20px] shrink-0 mt-0.5">⏳</span>
            <div>
              <p
                className="font-display font-bold text-[13.5px]"
                style={{ color: "var(--amber)" }}
              >
                Status: Menunggu Proses
              </p>
              <p
                className="text-[12.5px] mt-1 leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                Pembayaran kamu sedang diverifikasi. Diamond / item akan masuk
                otomatis dalam 1-5 menit. Jika lebih dari 10 menit belum masuk,
                silakan hubungi CS kami.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="btn-primary px-8 py-3.5 text-[14px]"
            >
              Kembali ke Katalog
            </Link>
            <Link
              href={`/top-up/${order.gameSlug}`}
              className="btn-ghost px-8 py-3.5 text-[14px]"
            >
              Top Up Lagi
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span
        className="text-[13.5px] font-display font-semibold text-right"
        style={{ color: highlight ? "var(--lime)" : "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}
