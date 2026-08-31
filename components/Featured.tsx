export default function Featured() {
  return (
    <section className="wrap pt-14 md:pt-20">
      <div
        className="rounded-[22px] overflow-hidden grid md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-0"
        style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
      >
        <div className="relative">
          <img
            src="/images/8d346431-48aa-4414-9125-9d2d7e78fd44.png"
            alt="Mobile Legends — game best seller di AVENXO ONLINE"
            className="w-full h-[260px] md:h-full object-cover"
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
            <span
              className="font-display text-[10.5px] font-bold tracking-[.09em] px-2.5 py-1.5 rounded-md"
              style={{ background: "var(--lime)", color: "#0B1207" }}
            >
              BEST SELLER
            </span>
            <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>
              Game unggulan minggu ini
            </span>
          </div>
          <h2 className="font-display font-extrabold text-[26px] sm:text-[36px] leading-[1.06] mt-4">
            Mobile Legends:
            <br />
            Bang Bang
          </h2>
          <p className="text-[13.5px] mt-2" style={{ color: "var(--muted)" }}>
            Moonton
          </p>
          <p
            className="mt-4 text-[15px] leading-relaxed max-w-[460px]"
            style={{ color: "var(--muted)" }}
          >
            Top up Mobile Legends langsung ke User ID kamu tanpa login akun.
            Pilih nominal diamond, bayar, dan lanjut push rank tanpa menunggu
            lama.
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
                Rp3.000
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
            href="/top-up/mobile-legends"
            className="btn-primary mt-7 px-6 py-3.5 text-[14.5px] text-center sm:self-start"
          >
            Top Up Mobile Legends
          </a>
        </div>
      </div>
    </section>
  );
}