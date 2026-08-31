"use client";

import { useEffect, useRef, useState } from "react";

const slides = [
  {
    badge: { text: "BEST SELLER MINGGU INI", bg: "rgba(198,242,78,.14)", color: "var(--lime)" },
    title: (
      <>
        Push Rank Tanpa
        <br />
        Kehabisan <span style={{ color: "var(--lime)" }}>Diamond</span>
      </>
    ),
    desc: (
      <>
        Top up Mobile Legends cukup pakai User ID. Masuk dalam hitungan
        detik, harga mulai{" "}
        <span style={{ color: "var(--amber)", fontWeight: 700 }}>
          Rp3.000
        </span>
        .
      </>
    ),
    cta: "Top Up Sekarang",
    mobileImg: "/images/e858aec1-d682-4111-8fdc-08d7e50ebdc4.png",
    desktopImg: "/images/27522459-50c5-4023-96b4-359a9aba0052.png",
    altMobile: "Banner promo top up Mobile Legends di AVENXO ONLINE",
    href: "#topup",
    isLink: true,
  },
  {
    badge: { text: "KATALOG GAME", bg: "rgba(255,180,61,.14)", color: "var(--amber)" },
    title: (
      <>
        Semua game favoritmu
        <br />
        di satu tempat
      </>
    ),
    desc: "Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Magic Chess: Go Go, dan Call of Duty Mobile.",
    cta: "Jelajahi Katalog",
    img: "/images/035e2d72-564c-42fb-90f5-a41c73174b50.png",
    alt: "Banner koleksi game populer AVENXO ONLINE",
    objectPos: "78% 50%",
    href: "#topup",
    isLink: false,
  },
  {
    mobileImg: "/images/f410374d-5ce6-4825-9cd9-2c895f8c65f4.png",
    desktopImg: "/images/634a2254-b184-4adb-abe8-7ea7d15ab94f.png",
    altMobile: "Promo top up spesial di AVENXO ONLINE",
    href: "#topup",
    isLink: true,
    promoOnly: true,
  },
] as const;

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const go = (i: number) => {
    if (!trackRef.current) return;
    const n = slides.length;
    const next = (i + n) % n;
    setIdx(next);
    trackRef.current.scrollTo({
      left: next * trackRef.current.clientWidth + next * 14,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    const dots = dotsRef.current;
    if (!track || !dots) return;
    dots.innerHTML = "";
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "dot" + (i === 0 ? " on" : "");
      d.setAttribute("aria-label", "Slide " + (i + 1));
      d.onclick = () => go(i);
      dots.appendChild(d);
    });

    const onScroll = () => {
      const i = Math.round(
        track.scrollLeft / (track.clientWidth + 14)
      );
      setIdx((prev) => (prev === i ? prev : (() => {
        [...dots.children].forEach((d, j) =>
          d.classList.toggle("on", j === i)
        );
        return i;
      })()));
    };

    let timer = setInterval(() => go(idx + 1), 6000);
    const onPointerDown = () => clearInterval(timer);

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => go(idx);
    window.addEventListener("resize", onResize);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNav = (dir: number) => () => go(idx + dir);

  return (
    <section id="beranda" className="wrap pt-5 md:pt-7">
      <div className="relative">
        <div ref={trackRef} className="track noscroll rounded-[22px]">
          {slides.map((s, i) => (
            <div className="slide" key={i}>
              {s.promoOnly ? (
                <a
                  href={s.href}
                  className="block relative rounded-[22px] overflow-hidden"
                  style={{ border: "1px solid var(--line)" }}
                  aria-label="Promo top up spesial AVENXO ONLINE"
                >
                  <img
                    src={s.mobileImg!}
                    alt={s.altMobile!}
                    className="block sm:hidden w-full h-[250px] object-cover"
                  />
                  <img
                    src={s.desktopImg!}
                    alt=""
                    aria-hidden="true"
                    className="hidden sm:block w-full sm:h-[320px] lg:h-[440px] object-cover"
                  />
                </a>
              ) : s.isLink ? (
                <a
                  href={s.href}
                  className="block relative rounded-[22px] overflow-hidden"
                  style={{ border: "1px solid var(--line)" }}
                  aria-label="Top up Mobile Legends di AVENXO ONLINE"
                >
                  {i === 0 && (
                    <h1 className="sr-only">
                      Top Up Mobile Legends — marketplace top up game AVENXO
                      ONLINE
                    </h1>
                  )}
                  <img
                    src={s.mobileImg!}
                    alt={s.altMobile!}
                    className="block sm:hidden w-full h-[250px] object-cover"
                  />
                  <img
                    src={s.desktopImg!}
                    alt=""
                    aria-hidden="true"
                    className="hidden sm:block w-full sm:h-[320px] lg:h-[440px] object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(100deg,rgba(8,12,17,.95) 4%,rgba(8,12,17,.72) 42%,rgba(8,12,17,.05) 78%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-6 sm:px-10 lg:px-14 max-w-[620px]">
                      <span
                        className="inline-block font-display text-[10.5px] font-bold tracking-[.13em] px-2.5 py-1.5 rounded-md"
                        style={{ background: s.badge.bg, color: s.badge.color }}
                      >
                        {s.badge.text}
                      </span>
                      <h2 className="font-display font-extrabold text-[25px] sm:text-[36px] lg:text-[46px] leading-[1.04] mt-3">
                        {s.title}
                      </h2>
                      <p
                        className="mt-3 text-[13.5px] sm:text-[15.5px] leading-relaxed max-w-[420px]"
                        style={{ color: "var(--muted)" }}
                      >
                        {s.desc}
                      </p>
                      <span className="btn-primary inline-block mt-5 px-5 py-3 text-[14px]">
                        {s.cta}
                      </span>
                    </div>
                  </div>
                </a>
              ) : (
                <div
                  className="relative rounded-[22px] overflow-hidden"
                  style={{ border: "1px solid var(--line)" }}
                >
                  <img
                    src={s.img!}
                    alt={s.alt!}
                    className="w-full h-[250px] sm:h-[320px] lg:h-[440px] object-cover"
                    style={{ objectPosition: s.objectPos }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(100deg,rgba(8,12,17,.96) 6%,rgba(8,12,17,.76) 44%,rgba(8,12,17,.1) 82%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-6 sm:px-10 lg:px-14 max-w-[600px]">
                      <span
                        className="inline-block font-display text-[10.5px] font-bold tracking-[.13em] px-2.5 py-1.5 rounded-md"
                        style={{ background: s.badge.bg, color: s.badge.color }}
                      >
                        {s.badge.text}
                      </span>
                      <h2 className="font-display font-extrabold text-[24px] sm:text-[34px] lg:text-[42px] leading-[1.06] mt-3">
                        {s.title}
                      </h2>
                      <p
                        className="mt-3 text-[13.5px] sm:text-[15.5px] leading-relaxed max-w-[430px]"
                        style={{ color: "var(--muted)" }}
                      >
                        {s.desc}
                      </p>
                      <a
                        href={s.href}
                        className="btn-primary inline-block mt-5 px-5 py-3 text-[14px]"
                      >
                        {s.cta}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleNav(-1)}
          className="navbtn hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Sebelumnya"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EAF0F6"
            strokeWidth="2"
          >
            <path d="m15 5-7 7 7 7"></path>
          </svg>
        </button>
        <button
          onClick={handleNav(1)}
          className="navbtn hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Berikutnya"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EAF0F6"
            strokeWidth="2"
          >
            <path d="m9 5 7 7-7 7"></path>
          </svg>
        </button>
        <div ref={dotsRef} className="flex justify-center gap-2 mt-4"></div>
      </div>
    </section>
  );
}