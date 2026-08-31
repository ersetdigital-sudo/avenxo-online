"use client";

import { useEffect, useRef, useState } from "react";

type Game = {
  name: string;
  publisher: string;
  tags: string;
  img: string;
  alt: string;
  price: string;
  slug: string;
  badge?: { text: string; cls: string };
};

const games: Game[] = [
  {
    name: "Mobile Legends",
    publisher: "Moonton",
    tags: "populer best moba",
    img: "/images/8d346431-48aa-4414-9125-9d2d7e78fd44.png",
    alt: "Cover Mobile Legends — top up Mobile Legends di AVENXO ONLINE",
    price: "Rp3.000",
    slug: "mobile-legends",
    badge: { text: "BEST SELLER", cls: "badge-best" },
  },
  {
    name: "Free Fire",
    publisher: "Garena",
    tags: "populer br",
    img: "/images/697ea9d0-5cc7-4726-9a87-8108b0c6789d.png",
    alt: "Cover Free Fire — top up Free Fire di AVENXO ONLINE",
    price: "Rp2.500",
    slug: "free-fire",
    badge: { text: "HOT", cls: "badge-hot" },
  },
  {
    name: "PUBG Mobile",
    publisher: "Level Infinite",
    tags: "br",
    img: "/images/1cab02ab-4465-4cdf-b715-649267c7076e.png",
    alt: "Cover PUBG Mobile — top up PUBG Mobile di AVENXO ONLINE",
    price: "Rp15.000",
    slug: "pubg-mobile",
  },
  {
    name: "Genshin Impact",
    publisher: "HoYoverse",
    tags: "populer rpg",
    img: "/images/26a5b02c-d21f-4296-a694-11ab7a2a2413.png",
    alt: "Cover Genshin Impact — top up Genshin Impact di AVENXO ONLINE",
    price: "Rp16.000",
    slug: "genshin-impact",
    badge: { text: "POPULER", cls: "badge-pop" },
  },
  {
    name: "Magic Chess: Go Go",
    publisher: "Moonton",
    tags: "strategy",
    img: "/images/a250d7d9-fac4-4731-8a84-640cd30dc99b.png",
    alt: "Cover Magic Chess: Go Go — top up Magic Chess: Go Go di AVENXO ONLINE",
    price: "Rp5.000",
    slug: "magic-chess",
  },
  {
    name: "Call of Duty Mobile",
    publisher: "Activision",
    tags: "br",
    img: "/images/9dc7563b-96ae-4439-bb24-dfc5324695d9.png",
    alt: "Cover Call of Duty Mobile — top up Call of Duty Mobile di AVENXO ONLINE",
    price: "Rp10.000",
    slug: "call-of-duty-mobile",
  },
];

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
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const emptyRef = useRef<HTMLParagraphElement>(null);

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
  }, []);

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
  }, [filter, query]);

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
            key={g.name}
            className="gcard reveal"
            data-tags={g.tags}
            data-name={`${g.name} ${g.publisher}`.toLowerCase()}
          >
            <span className="cover">
              <img src={g.img} alt={g.alt} />
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
                  <span className="gprice block mt-1.5">{g.price}</span>
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