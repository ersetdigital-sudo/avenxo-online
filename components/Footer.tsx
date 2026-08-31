export default function Footer() {
  const games = [
    { name: "Top Up Mobile Legends", slug: "mobile-legends" },
    { name: "Top Up Free Fire", slug: "free-fire" },
    { name: "Top Up PUBG Mobile", slug: "pubg-mobile" },
    { name: "Top Up Genshin Impact", slug: "genshin-impact" },
    { name: "Top Up Magic Chess: Go Go", slug: "magic-chess" },
    { name: "Top Up Call of Duty Mobile", slug: "call-of-duty-mobile" },
  ];

  return (
    <footer
      className="mt-16 md:mt-24 pt-12 pb-10"
      style={{ borderTop: "1px solid var(--line)", background: "var(--surface)" }}
    >
      <div className="wrap grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="grid place-items-center w-9 h-9 rounded-xl font-display font-extrabold text-[15px]"
              style={{ background: "var(--lime)", color: "#0B1207" }}
            >
              A
            </span>
            <span className="font-display font-bold text-[15px]">AVENXO ONLINE</span>
          </div>
          <p
            className="mt-4 text-[13.5px] leading-relaxed max-w-[380px]"
            style={{ color: "var(--muted)" }}
          >
            Marketplace top up game online untuk Mobile Legends, Free Fire, PUBG
            Mobile, Genshin Impact, Magic Chess: Go Go, dan Call of Duty Mobile.
          </p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-[14px]">Top Up Game</h3>
          <ul className="mt-4 space-y-2.5 text-[13.5px]" style={{ color: "var(--muted)" }}>
            {games.map((g) => (
              <li key={g.slug}>
                <a
                  href={`/top-up/${g.slug}`}
                  className="hover:text-white transition"
                >
                  {g.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display font-semibold text-[14px]">Navigasi</h3>
          <ul className="mt-4 space-y-2.5 text-[13.5px]" style={{ color: "var(--muted)" }}>
            <li>
              <a href="/#beranda" className="hover:text-white transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="/#topup" className="hover:text-white transition">
                Top Up Game
              </a>
            </li>
            <li>
              <a href="/#bantuan" className="hover:text-white transition">
                Bantuan
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-10">
        <div className="hairline"></div>
        <p
          className="mt-6 text-[12.5px]"
          style={{ color: "var(--muted)" }}
        >
          © 2026 AVENXO ONLINE — avenxoonline.net. Seluruh nama game dan merek
          dagang adalah milik pemegang haknya masing-masing.
        </p>
      </div>
    </footer>
  );
}