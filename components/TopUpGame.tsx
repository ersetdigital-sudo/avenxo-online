"use client";

import { useEffect, useRef, useState } from "react";

type Game = {
  slug: string;
  name: string;
  publisher: string;
  cover: string;
  tags: string;
  minPrice: number;
  badge?: { text: string; cls: string };
};

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

const tabs = [
  { label: "Semua", filter: "all" },
  { label: "Populer", filter: "populer" },
  { label: "Best Seller", filter: "best" },
  { label: "MOBA", filter: "moba" },
  { label: "Battle Royale", filter: "br" },
  { label: "RPG", filter: "rpg" },
  { label: "Strategy", filter: "strategy" },
];

export default function TopUpGame() {
  const [games, setGames] = useState<Game[]>([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const emptyRef = useRef<HTMLParagraphElement>(null);

  // Fetch games from API
  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then((data) => setGames(data.games || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onSearch = (e: Event) => {
      const v = (e as CustomEvent<string>).detail || "";
      setQuery(v);
      setFilter("all");
    };
    window.addEventListener("avenxo:search", onSearch);
    return () => window.removeEventListener("avenxo:search", onSearch);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    grid.querySelectorAll(".reveal").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = (i % 6) * 60 + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
  }, [games]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let shown = 0;
    const q = query.trim().toLowerCase();
    grid.querySelectorAll<HTMLElement>(".gcard").forEach((c) => {
      const tags = c.dataset.tags || "";
      const name = c.dataset.name || "";
      const ok =
        (filter === "all" || tags.includes(filter)) && (!q || name.includes(q));
      c.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    if (countRef.current) countRef.current.textContent = String(shown);
    if (emptyRef.current)
      emptyRef.current.classList.toggle("hidden", shown > 0);
  }, [filter, query, games]);

  return (
    <section id="topup" className="wrap pt-10 md:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-[24px] sm:text-[30px]">
            Top Up Game
          </h2>
          <p
            className="mt-1.5 text-[14px]"
            style={{ color: "var(--muted)" }}
          >
            Pilih game yang ingin kamu top up. Harga mulai transparan, tanpa
            biaya tersembunyi.
          </p>
        </div>
        <span className="text-[13px]" style={{ color: "var(--muted)" }}>
          <span ref={countRef}>{games.length}</span> game tersedia
        </span>
      </div>

      <div className="mt-5 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto noscroll">
        <div
          className="flex gap-2 w-max md:w-auto"
          role="tablist"
          id="catTabs"
        >
          {tabs.map((t) => (
            <button
              key={t.filter}
              className="tab"
              role="tab"
              aria-selected={t.filter === filter}
              data-filter={t.filter}
              onClick={() => setFilter(t.filter)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={gridRef}
        id="gameGrid"
        className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
      >
        {games.map((g) => (
          <a
            href={`/top-up/${g.slug}`}
            key={g.slug}
            className="gcard reveal"
            data-tags={g.tags}
            data-name={`${g.name} ${g.publisher}`.toLowerCase()}
          >
            <span className="cover">
              <img src={g.cover} alt={`${g.name} — top up di AVENXO ONLINE`} />
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
                  <span className="gprice block mt-1.5">{rupiah(g.minPrice)}</span>
                </span>
                <span className="gtag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C6F24E"
                    strokeWidth="2.2"
                  >
                    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"></path>
                  </svg>
                  Instan
                </span>
              </span>
              <span className="gbtn">Top Up Sekarang</span>
            </span>
          </a>
        ))}
      </div>

      <p
        ref={emptyRef}
        className="hidden mt-8 text-center text-[14px]"
        style={{ color: "var(--muted)" }}
      >
        Game tidak ditemukan pada kategori ini.
      </p>
    </section>
  );
}
