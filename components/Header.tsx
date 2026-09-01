"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const dispatchSearch = (v: string) => {
    window.dispatchEvent(
      new CustomEvent("avenxo:search", { detail: v.toLowerCase() })
    );
  };

  return (
    <header
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="wrap">
        <div className="flex items-center gap-4 h-[64px]">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <span
              className="grid place-items-center w-9 h-9 rounded-xl font-display font-extrabold text-[15px]"
              style={{ background: "var(--lime)", color: "#0B1207" }}
            >
              A
            </span>
            <span className="font-display font-bold text-[15px] leading-none">
              AVENXO
              <span
                className="hidden sm:inline"
                style={{ color: "var(--muted)", fontWeight: 500 }}
              >
                {" "}
                ONLINE
              </span>
            </span>
          </a>
          <nav
            className="hidden lg:flex items-center gap-1 ml-1 text-[14px]"
            style={{ color: "var(--muted)" }}
          >
            <a
              href="#beranda"
              className="px-3 py-2 rounded-lg hover:text-white transition"
            >
              Beranda
            </a>
            <a
              href="#topup"
              className="px-3 py-2 rounded-lg hover:text-white transition"
            >
              Top Up Game
            </a>
            <a
              href="/bantuan"
              className="px-3 py-2 rounded-lg hover:text-white transition"
            >
              Bantuan
            </a>
          </nav>
          <form
            className="hidden md:flex flex-1 max-w-[430px] items-center gap-2 px-4 h-10 rounded-xl"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              document
                .getElementById("topup")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#93A2B4"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.2-3.2"></path>
            </svg>
            <input
              type="search"
              placeholder="Cari game yang ingin kamu top up..."
              className="bg-transparent w-full text-[14px] outline-none placeholder:text-[#7A8798]"
              onInput={(e) =>
                dispatchSearch((e.target as HTMLInputElement).value)
              }
            />
          </form>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden grid place-items-center w-9 h-9 rounded-xl"
              style={{ border: "1px solid var(--line)" }}
              aria-label="Menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                stroke="#EAF0F6"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <form
          className="md:hidden pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            document
              .getElementById("topup")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div
            className="flex items-center gap-2 px-4 h-11 rounded-xl"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#93A2B4"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.2-3.2"></path>
            </svg>
            <input
              type="search"
              placeholder="Cari game yang ingin kamu top up..."
              className="bg-transparent w-full text-[14px] outline-none placeholder:text-[#7A8798]"
              onInput={(e) =>
                dispatchSearch((e.target as HTMLInputElement).value)
              }
            />
          </div>
        </form>
        <div
          className={`${
            open ? "grid" : "hidden"
          } lg:hidden pb-4 grid-cols-2 gap-2 text-[14px]`}
        >
          <a
            href="#beranda"
            onClick={() => {
              setOpen(false);
              document.getElementById("beranda")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-3 py-2.5 rounded-xl"
            style={{ background: "var(--surface-2)" }}
          >
            Beranda
          </a>
          <a
            href="#topup"
            onClick={() => {
              setOpen(false);
              document.getElementById("topup")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-3 py-2.5 rounded-xl"
            style={{ background: "var(--surface-2)" }}
          >
            Top Up Game
          </a>
          <a
            href="/bantuan"
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 rounded-xl"
            style={{ background: "var(--surface-2)" }}
          >
            Bantuan
          </a>
        </div>
      </div>
    </header>
  );
}