export default function CaraTopUp() {
  const steps = [
    "Pilih Game",
    "Masukkan User ID",
    "Pilih Nominal",
    "Bayar",
    "Selesai",
  ];

  return (
    <section id="bantuan" className="wrap pt-14 md:pt-20">
      <h2 className="font-display font-bold text-[24px] sm:text-[30px]">
        Cara Top Up
      </h2>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
        {steps.map((s, i) => (
          <div
            key={s}
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              gridColumn: i === 4 ? "span 2 / span 2" : undefined,
            }}
          >
            <span
              className="font-display font-bold text-[13px]"
              style={{ color: "var(--lime)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-display font-semibold text-[14.5px] mt-2">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}