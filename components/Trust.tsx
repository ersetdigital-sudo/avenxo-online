export default function Trust() {
  const items = [
    {
      icon: (
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"></path>
      ),
      title: "Proses Cepat",
      desc: "Pesanan diproses otomatis setelah pembayaran terkonfirmasi.",
    },
    {
      icon: (
        <path d="M12 3 4 6v6c0 5 3.4 8.2 8 9 4.6-.8 8-4 8-9V6l-8-3z"></path>
      ),
      title: "Pembayaran Aman",
      desc: "Transaksi lewat kanal pembayaran resmi dengan koneksi terenkripsi.",
    },
    {
      icon: (
        <>
          <path d="M12 3v18"></path>
          <path d="M7 7h7a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h8"></path>
        </>
      ),
      title: "Harga Kompetitif",
      desc: "Harga mulai ditampilkan terbuka di setiap game, tanpa biaya tersembunyi.",
    },
    {
      icon: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a3 3 0 0 1 3-3h11a4 4 0 0 1 4 4v8z"></path>,
      title: "Customer Support",
      desc: "Tim bantuan siap membantu jika pesanan kamu bermasalah.",
    },
  ];

  return (
    <section className="wrap pt-14 md:pt-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C6F24E"
              strokeWidth="2"
            >
              {it.icon}
            </svg>
            <h3 className="font-display font-bold text-[16px] mt-4">{it.title}</h3>
            <p
              className="text-[13.5px] mt-2 leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {it.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}