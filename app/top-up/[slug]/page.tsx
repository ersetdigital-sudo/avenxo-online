"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGames, getGame, rupiah, type Game } from "@/lib/games";
import SiteShell from "@/components/SiteShell";

const steps = [
  "Masukkan Data Akun",
  "Pilih Nominal",
  "Pilih Pembayaran",
  "Verifikasi Pesanan",
];

type Acc = { type: "success" | "error"; msg: string };

export default function TopUpDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const game = getGame(slug);
  if (!game) notFound();

  return <DetailClient game={game} />;
}

function DetailClient({ game }: { game: Game }) {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [payCat, setPayCat] = useState("ewallet");
  const [payMethod, setPayMethod] = useState("qris");
  const [promo, setPromo] = useState("");
  const [acc, setAcc] = useState<Acc | null>(null);

  const denom = useMemo(
    () => game.denominations.find((d) => d.id === selectedDenom),
    [game.denominations, selectedDenom]
  );

  const total = denom ? denom.price : 0;

  const cat = game.paymentCategories.find((c) => c.key === payCat);
  const methodLabel = cat?.methods.find((m) => m.id === payMethod)?.label;

  const validateStep1 = () => {
    if (!userId.trim()) {
      setAcc({ type: "error", msg: "User ID belum diisi." });
      return false;
    }
    if (game.fields.some((f) => f.zone) && !zoneId.trim()) {
      setAcc({ type: "error", msg: "Zone ID / Server belum diisi." });
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    if (!selectedDenom) {
      setAcc({ type: "error", msg: "Pilih nominal top up dulu." });
      return false;
    }
    return true;
  };

  const buy = () => {
    setAcc(null);
    if (!validateStep1()) return;
    if (!validateStep2()) return;
    setAcc({
      type: "success",
      msg: `Pesanan ${denom!.amount} untuk ${game.name} (${methodLabel}) berhasil dibuat. Pembayaran akan diproses setelah konfirmasi.`,
    });
  };

  return (
    <SiteShell>
      {/* BANNER */}
      <section
        className="wrap pt-5 md:pt-7"
        style={{ paddingBottom: 0 }}
      >
        <div
          className="relative rounded-[22px] overflow-hidden h-[280px] sm:h-[320px] md:h-[360px]"
          style={{ border: "1px solid var(--line)" }}
        >
          <img
            src={game.banner}
            alt={`Banner ${game.name} — top up di AVENXO ONLINE`}
            className="w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg,rgba(8,12,17,.96) 4%,rgba(8,12,17,.7) 50%,rgba(8,12,17,.05) 85%)",
            }}
          ></div>
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-10 lg:px-14 max-w-[680px]">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-display text-[10.5px] font-bold tracking-[.13em] px-2.5 py-1.5 rounded-md"
                  style={{
                    background: "var(--lime)",
                    color: "#0B1207",
                  }}
                >
                  TOP UP
                </span>
                <span
                  className="text-[12.5px]"
                  style={{ color: "var(--muted)" }}
                >
                  {game.publisher}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-[24px] sm:text-[34px] lg:text-[42px] leading-[1.05]">
                {game.name}
              </h1>
              <p
                className="mt-2 text-[13px] sm:text-[14.5px] max-w-[520px]"
                style={{ color: "var(--muted)" }}
              >
                {game.shortDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="wrap pt-6 md:pt-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-5">
          {/* LEFT: STEPS */}
          <div className="space-y-4">
            {/* STEP 1 */}
            <StepCard idx={0} title={steps[0]}>
              <div className="grid sm:grid-cols-2 gap-3">
                {game.fields.map((f) => (
                  <div key={f.id}>
                    <label
                      className="block text-[12px] font-display font-semibold mb-1.5"
                      style={{ color: "var(--muted)" }}
                    >
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={f.id === "userId" ? userId : zoneId}
                      onChange={(e) =>
                        f.id === "userId"
                          ? setUserId(e.target.value)
                          : setZoneId(e.target.value)
                      }
                      placeholder={f.placeholder}
                      className="w-full h-11 px-3.5 rounded-xl text-[14px] outline-none"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--line)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                ))}
              </div>
              <p
                className="mt-3 text-[12px]"
                style={{ color: "var(--muted)" }}
              >
                Untuk menemukan User ID, buka profil game kamu. Pastikan data
                benar — pesanan tidak dapat diubah setelah dibayar.
              </p>
            </StepCard>

            {/* STEP 2 */}
            <StepCard idx={1} title={steps[1]}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {game.denominations.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDenom(d.id)}
                    className="denom"
                    data-selected={selectedDenom === d.id}
                  >
                    {d.popular && (
                      <span className="denom-pop">POPULER</span>
                    )}
                    <span
                      className="font-display font-bold text-[13.5px] block"
                      style={{ color: "var(--text)" }}
                    >
                      {d.amount}
                    </span>
                    {d.bonus && (
                      <span
                        className="text-[10.5px] mt-0.5 block"
                        style={{ color: "var(--muted)" }}
                      >
                        {d.bonus}
                      </span>
                    )}
                    <span
                      className="font-display font-extrabold text-[14.5px] mt-2 block"
                      style={{ color: "var(--lime)" }}
                    >
                      {rupiah(d.price)}
                    </span>
                  </button>
                ))}
              </div>
            </StepCard>

            {/* STEP 3 */}
            <StepCard idx={2} title={steps[2]}>
              <div className="flex gap-2 overflow-x-auto noscroll -mx-1 px-1 pb-2">
                {game.paymentCategories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setPayCat(c.key);
                      setPayMethod(c.methods[0].id);
                    }}
                    className="pay-tab"
                    data-selected={payCat === c.key}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {cat?.methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="pay-method"
                    data-selected={payMethod === m.id}
                  >
                    <span
                      className="w-4 h-4 rounded-full grid place-items-center"
                      style={{
                        border:
                          payMethod === m.id
                            ? "5px solid var(--lime)"
                            : "1.5px solid var(--line-strong)",
                        background: "var(--surface-2)",
                      }}
                    ></span>
                    <span
                      className="text-[13.5px] font-display font-semibold"
                      style={{
                        color:
                          payMethod === m.id ? "var(--text)" : "var(--muted)",
                      }}
                    >
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </StepCard>

            {/* STEP 4: VERIFIKASI */}
            <StepCard idx={3} title={steps[3]}>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--line)",
                }}
              >
                <Row label="Game" value={`${game.name} — ${game.publisher}`} />
                <Row
                  label="User ID"
                  value={
                    userId
                      ? zoneId
                        ? `${userId} (${zoneId})`
                        : userId
                      : "—"
                  }
                />
                <Row
                  label="Nominal"
                  value={denom ? denom.amount : "—"}
                />
                <Row label="Pembayaran" value={methodLabel || "—"} />
                <div
                  className="my-3 h-px"
                  style={{ background: "var(--line)" }}
                ></div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12.5px]"
                    style={{ color: "var(--muted)" }}
                  >
                    Total Bayar
                  </span>
                  <span
                    className="font-display font-extrabold text-[20px]"
                    style={{ color: "var(--lime)" }}
                  >
                    {denom ? rupiah(total) : "—"}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Punya kode promo?"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="flex-1 h-11 px-3.5 rounded-xl text-[14px] outline-none"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                  }}
                />
                <button className="btn-ghost px-4 text-[13.5px]">Pakai</button>
              </div>

              {acc && (
                <div
                  className="mt-3 px-3.5 py-2.5 rounded-xl text-[13px]"
                  style={{
                    background:
                      acc.type === "success"
                        ? "rgba(198,242,78,.12)"
                        : "rgba(255,180,61,.14)",
                    color: acc.type === "success" ? "var(--lime)" : "var(--amber)",
                    border:
                      acc.type === "success"
                        ? "1px solid rgba(198,242,78,.32)"
                        : "1px solid rgba(255,180,61,.32)",
                  }}
                >
                  {acc.msg}
                </div>
              )}
            </StepCard>
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:sticky lg:top-[80px] self-start space-y-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={game.cover}
                  alt={game.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h3
                    className="font-display font-bold text-[15px] leading-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {game.name}
                  </h3>
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--muted)" }}
                  >
                    {game.publisher}
                  </p>
                </div>
              </div>

              <div
                className="mt-4 pt-4 grid grid-cols-2 gap-3"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <div>
                  <span
                    className="block text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    Rating
                  </span>
                  <span
                    className="font-display font-bold text-[15px] flex items-center gap-1"
                    style={{ color: "var(--text)" }}
                  >
                    ★ {game.rating?.toFixed(2)}
                    <span
                      className="text-[11.5px] font-normal"
                      style={{ color: "var(--muted)" }}
                    >
                      ({game.ratingCount})
                    </span>
                  </span>
                </div>
                <div>
                  <span
                    className="block text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    Mulai dari
                  </span>
                  <span
                    className="font-display font-extrabold text-[15px]"
                    style={{ color: "var(--lime)" }}
                  >
                    {rupiah(game.minPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={buy}
                className="btn-primary w-full mt-5 py-3.5 text-[14.5px]"
              >
                Beli Sekarang
              </button>
              <Link
                href="/#topup"
                className="btn-ghost block w-full mt-2 py-3 text-center text-[13.5px]"
              >
                Kembali ke Katalog
              </Link>
            </div>

            <div
              className="rounded-2xl p-5 text-[12.5px] space-y-2"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                color: "var(--muted)",
              }}
            >
              <h4
                className="font-display font-semibold text-[13px] mb-1"
                style={{ color: "var(--text)" }}
              >
                Informasi Penting
              </h4>
              <p>· Pesanan diproses otomatis 24/7 setelah pembayaran.</p>
              <p>· Diamond / UC / CP akan langsung masuk ke akun game.</p>
              <p>· Pastikan User ID dan Server benar sebelum bayar.</p>
              <p>· Hubungi CS bila pesanan belum masuk setelah 10 menit.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* DESKRIPSI + CARA ORDER */}
      <section className="wrap pt-12 md:pt-16">
        <h2 className="font-display font-bold text-[22px] sm:text-[26px]">
          Cara Order {game.name}
        </h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            "Masukkan User ID",
            "Pilih Nominal",
            "Pilih Pembayaran",
            "Bayar",
            "Diamond Masuk",
          ].map((s, i) => (
            <div
              key={s}
              className="rounded-2xl p-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              <span
                className="font-display font-bold text-[12.5px]"
                style={{ color: "var(--lime)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display font-semibold text-[14px] mt-1.5">
                {s}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pt-10 md:pt-14">
        <h2 className="font-display font-bold text-[22px] sm:text-[26px]">
          Deskripsi {game.name}
        </h2>
        <div
          className="mt-5 rounded-2xl p-6 sm:p-7 text-[14px] leading-relaxed space-y-3"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          {game.longDesc.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* LAINNYA */}
      <section className="wrap pt-12 md:pt-16">
        <h2 className="font-display font-bold text-[22px] sm:text-[26px]">
          Top Up Game Lainnya
        </h2>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {getAllGames()
            .filter((g) => g.slug !== game.slug)
            .map((g) => (
              <Link
                key={g.slug}
                href={`/top-up/${g.slug}`}
                className="gcard"
              >
                <span className="cover">
                  <img src={g.cover} alt={g.name} />
                  {g.badge && (
                    <span className={`badge ${g.badge.cls}`}>
                      {g.badge.text}
                    </span>
                  )}
                </span>
                <span className="ginfo block">
                  <span className="block font-display font-bold text-[14px] leading-tight">
                    {g.name}
                  </span>
                  <span
                    className="block text-[11.5px] mt-0.5 mb-3"
                    style={{ color: "var(--muted)" }}
                  >
                    {g.publisher}
                  </span>
                  <span className="flex items-end justify-between gap-2">
                    <span className="block">
                      <span
                        className="block text-[10.5px] tracking-[.09em] font-display font-bold"
                        style={{ color: "var(--muted)" }}
                      >
                        MULAI DARI
                      </span>
                      <span className="gprice block mt-1.5">
                        {rupiah(g.minPrice)}
                      </span>
                    </span>
                  </span>
                  <span className="gbtn">Lihat Detail</span>
                </span>
              </Link>
            ))}
        </div>
      </section>
    </SiteShell>
  );
}

function StepCard({
  idx,
  title,
  children,
}: {
  idx: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
      }}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <span
          className="grid place-items-center w-7 h-7 rounded-lg font-display font-bold text-[12.5px] shrink-0"
          style={{
            background: "var(--lime)",
            color: "#0B1207",
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
        <h2
          className="font-display font-bold text-[15px] flex-1"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>
      </div>
      <div
        className="px-5 pb-5 pt-1"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span
        className="text-[13.5px] font-display font-semibold"
        style={{ color: "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}