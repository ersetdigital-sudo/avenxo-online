"use client";

import { useState, useEffect } from "react";

type FeaturedGame = {
  slug: string;
  name: string;
  publisher: string;
  cover: string;
  banner: string;
  shortDesc: string;
  badge?: { text: string };
  minPrice: number;
};

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export default function Featured() {
  const [game, setGame] = useState<FeaturedGame | null>(null);

  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then((data) => {
        const games = data.games || [];
        const featured = games.find((g: FeaturedGame) => g.badge?.text === "BEST SELLER") || games[0];
        setGame(featured || null);
      })
      .catch(() => {});
  }, []);

  if (!game) return null;

  return (
    <section className="wrap pt-14 md:pt-20">
      <div
        className="rounded-[22px] overflow-hidden grid md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-0"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div className="relative">
          <img
            src={game.cover || game.banner}
            alt={`${game.name} — game best seller di AVENXO ONLINE`}
            className="w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-auto md:h-full object-contain md:object-cover"
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                "linear-gradient(to top,rgba(14,20,27,1),rgba(14,20,27,0) 55%)",
            }}
          ></div>
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg,rgba(14,20,27,0) 62%,rgba(14,20,27,.98) 100%)",
            }}
          ></div>
        </div>
        <div className="p-7 sm:p-9 lg:p-11 flex flex-col justify-center">
          <div className="flex items-center gap-2 flex-wrap">
            {game.badge && (
              <span
                className="font-display text-[10.5px] font-bold tracking-[.09em] px-2.5 py-1.5 rounded-md"
                style={{ background: "var(--lime)", color: "#0B1207" }}
              >
                {game.badge.text}
              </span>
            )}
            <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>
              Game unggulan minggu ini
            </span>
          </div>
          <h2 className="font-display font-extrabold text-[26px] sm:text-[36px] leading-[1.06] mt-4">
            {game.name}
          </h2>
          <p className="text-[13.5px] mt-2" style={{ color: "var(--muted)" }}>
            {game.publisher}
          </p>
          <p
            className="mt-4 text-[15px] leading-relaxed max-w-[460px]"
            style={{ color: "var(--muted)" }}
          >
            {game.shortDesc}
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div>
              <span className="block text-[11.5px]" style={{ color: "var(--muted)" }}>
                Mulai dari
              </span>
              <span
                className="font-display font-extrabold text-[26px]"
                style={{ color: "var(--lime)" }}
              >
                {rupiah(game.minPrice)}
              </span>
            </div>
            <div className="w-px self-stretch" style={{ background: "var(--line)" }}></div>
            <div>
              <span className="block text-[11.5px]" style={{ color: "var(--muted)" }}>
                Proses
              </span>
              <span className="font-display font-bold text-[15px]">Otomatis</span>
            </div>
          </div>
          <a
            href={`/top-up/${game.slug}`}
            className="btn-primary mt-7 px-6 py-3.5 text-[14.5px] text-center sm:self-start"
          >
            Top Up {game.name}
          </a>
        </div>
      </div>
    </section>
  );
}
