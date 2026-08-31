export type Denomination = {
  id: string;
  amount: string;
  bonus?: string;
  price: number;
  popular?: boolean;
};

export type PaymentCategory = {
  key: string;
  label: string;
  methods: { id: string; label: string; logo?: string }[];
};

export type Game = {
  slug: string;
  name: string;
  publisher: string;
  cover: string;
  banner: string;
  shortDesc: string;
  longDesc: string[];
  fields: { id: string; label: string; placeholder: string; zone?: boolean }[];
  denominations: Denomination[];
  paymentCategories: PaymentCategory[];
  tags: string;
  minPrice: number;
  badge?: { text: string; cls: string };
  rating?: number;
  ratingCount?: string;
};

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

const games: Game[] = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    publisher: "Moonton",
    cover: "/images/8d346431-48aa-4414-9125-9d2d7e78fd44.png",
    banner: "/images/27522459-50c5-4023-96b4-359a9aba0052.png",
    shortDesc:
      "Top up Mobile Legends langsung ke User ID kamu tanpa login akun.",
    longDesc: [
      "Mobile Legends: Bang Bang adalah game MOBA 5v5 terpopuler di Asia Tenggara. Top up Diamond ML di AVENXO ONLINE diproses otomatis setelah pembayaran — cukup masukkan User ID + Zone ID, pilih nominal Diamond, bayar, dan Diamond langsung masuk ke akun ML kamu.",
      "Diamond ML bisa dipakai untuk beli hero, skin, dan ikut event. Tanpa login akun, tanpa ribet, harga mulai dari Rp3.000.",
    ],
    fields: [
      { id: "userId", label: "User ID", placeholder: "Masukkan User ID" },
      { id: "zoneId", label: "Zone ID", placeholder: "Masukkan Zone ID", zone: true },
    ],
    denominations: [
      { id: "ml-3", amount: "3 Diamond", price: 3000 },
      { id: "ml-5", amount: "5 Diamond", price: 5000 },
      { id: "ml-12", amount: "12 Diamond", price: 12000, popular: true },
      { id: "ml-19", amount: "19 Diamond", price: 19000 },
      { id: "ml-28", amount: "28 Diamond", price: 28000 },
      { id: "ml-36", amount: "36 Diamond", price: 36000 },
      { id: "ml-44", amount: "44 Diamond", price: 44000 },
      { id: "ml-59", amount: "59 Diamond", price: 59000 },
      { id: "ml-86", amount: "86 Diamond", price: 86000 },
      { id: "ml-144", amount: "144 Diamond", price: 144000 },
      { id: "ml-172", amount: "172 Diamond", price: 172000 },
      { id: "ml-257", amount: "257 Diamond", price: 257000 },
      { id: "ml-344", amount: "344 Diamond", price: 344000 },
      { id: "ml-429", amount: "429 Diamond", price: 429000 },
      { id: "ml-514", amount: "514 Diamond", price: 514000 },
      { id: "ml-706", amount: "706 Diamond", price: 706000 },
      { id: "ml-1050", amount: "1.050 Diamond", price: 1050000 },
      { id: "ml-1412", amount: "1.412 Diamond", price: 1412000 },
      { id: "ml-2195", amount: "2.195 Diamond", price: 2195000 },
      { id: "ml-3688", amount: "3.688 Diamond", price: 3688000 },
    ],
    paymentCategories: defaultPayments(),
    tags: "populer best moba",
    minPrice: 3000,
    badge: { text: "BEST SELLER", cls: "badge-best" },
    rating: 4.99,
    ratingCount: "2.1jt+",
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    publisher: "Garena",
    cover: "/images/697ea9d0-5cc7-4726-9a87-8108b0c6789d.png",
    banner: "/images/697ea9d0-5cc7-4726-9a87-8108b0c6789d.png",
    shortDesc:
      "Top up Free Fire (FF) dengan memasukkan Player ID, Diamond langsung masuk ke akun.",
    longDesc: [
      "Free Fire adalah game Battle Royale 50-pemain yang dikembangkan Garena. Top up Diamond FF di AVENXO ONLINE diproses otomatis 24/7 — cukup masukkan Player ID, pilih nominal, bayar via QRIS / e-wallet / VA, dan Diamond FF langsung masuk ke akun kamu.",
      "Diamond FF bisa dipakai untuk beli karakter, skin senjata, dan Elite Pass. Harga mulai dari Rp2.500, proses instan tanpa login.",
    ],
    fields: [
      { id: "userId", label: "Player ID", placeholder: "Masukkan Player ID" },
    ],
    denominations: [
      { id: "ff-5", amount: "5 Diamond", price: 2500 },
      { id: "ff-12", amount: "12 Diamond", price: 6000 },
      { id: "ff-50", amount: "50 Diamond", price: 7000, popular: true },
      { id: "ff-70", amount: "70 Diamond", price: 10000 },
      { id: "ff-100", amount: "100 Diamond", price: 14000 },
      { id: "ff-140", amount: "140 Diamond", price: 20000 },
      { id: "ff-210", amount: "210 Diamond", price: 30000 },
      { id: "ff-355", amount: "355 Diamond", price: 50000 },
      { id: "ff-720", amount: "720 Diamond", price: 100000 },
      { id: "ff-1080", amount: "1.080 Diamond", price: 150000 },
      { id: "ff-1450", amount: "1.450 Diamond", price: 200000 },
      { id: "ff-2180", amount: "2.180 Diamond", price: 300000 },
      { id: "ff-3640", amount: "3.640 Diamond", price: 500000 },
    ],
    paymentCategories: defaultPayments(),
    tags: "populer br",
    minPrice: 2500,
    badge: { text: "HOT", cls: "badge-hot" },
    rating: 4.97,
    ratingCount: "1.4jt+",
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    publisher: "Level Infinite",
    cover: "/images/1cab02ab-4465-4cdf-b715-649267c7076e.png",
    banner: "/images/1cab02ab-4465-4cdf-b715-649267c7076e.png",
    shortDesc:
      "Top up UC PUBG Mobile dengan Player ID, UC langsung masuk ke akun.",
    longDesc: [
      "PUBG Mobile adalah game Battle Royale kelas dunia dari Level Infinite / Krafton. Top up UC (Unknown Cash) PUBG Mobile di AVENXO ONLINE diproses otomatis 24/7 — cukup masukkan Player ID, pilih nominal UC, dan bayar. UC akan langsung masuk ke akun PUBG Mobile kamu.",
      "UC PUBG bisa dipakai untuk membeli Royal Pass, skin senjata, outfit, dan crate. Harga mulai Rp15.000, proses cepat dan aman.",
    ],
    fields: [
      { id: "userId", label: "Player ID", placeholder: "Masukkan Player ID" },
    ],
    denominations: [
      { id: "pubg-60", amount: "60 UC", price: 15000 },
      { id: "pubg-300", amount: "300 UC", price: 75000, popular: true },
      { id: "pubg-600", amount: "600 UC", price: 150000 },
      { id: "pubg-1500", amount: "1.500 UC", price: 375000 },
      { id: "pubg-3000", amount: "3.000 UC", price: 750000 },
      { id: "pubg-6000", amount: "6.000 UC", price: 1500000 },
    ],
    paymentCategories: defaultPayments(),
    tags: "br",
    minPrice: 15000,
    rating: 4.95,
    ratingCount: "876rb+",
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    cover: "/images/26a5b02c-d21f-4296-a694-11ab7a2a2413.png",
    banner: "/images/26a5b02c-d21f-4296-a694-11ab7a2a2413.png",
    shortDesc:
      "Top up Genesis Crystal Genshin Impact via UID, crystal langsung masuk ke akun.",
    longDesc: [
      "Genshin Impact adalah game open-world RPG dari HoYoverse. Top up Genesis Crystal di AVENXO ONLINE diproses otomatis setelah pembayaran — cukup masukkan UID dan Server (Asia/EU/America), pilih nominal, dan bayar.",
      "Genesis Crystal bisa ditukar menjadi Primogem untuk Wish (gacha) karakter dan senjata baru. Harga mulai Rp16.000, proses instan.",
    ],
    fields: [
      { id: "userId", label: "UID", placeholder: "Masukkan UID" },
      {
        id: "server",
        label: "Server",
        placeholder: "Pilih server",
        zone: true,
      },
    ],
    denominations: [
      { id: "gi-60", amount: "60 Genesis Crystal", price: 16000 },
      { id: "gi-300", amount: "300 Genesis Crystal", price: 79000 },
      { id: "gi-980", amount: "980 Genesis Crystal", price: 249000, popular: true },
      { id: "gi-1980", amount: "1.980 Genesis Crystal", price: 499000 },
      { id: "gi-3280", amount: "3.280 Genesis Crystal", price: 799000 },
      { id: "gi-6560", amount: "6.560 Genesis Crystal", price: 1599000 },
    ],
    paymentCategories: defaultPayments(),
    tags: "populer rpg",
    minPrice: 16000,
    badge: { text: "POPULER", cls: "badge-pop" },
    rating: 4.96,
    ratingCount: "652rb+",
  },
  {
    slug: "magic-chess",
    name: "Magic Chess: Go Go",
    publisher: "Moonton",
    cover: "/images/a250d7d9-fac4-4731-8a84-640cd30dc99b.png",
    banner: "/images/a250d7d9-fac4-4731-8a84-640cd30dc99b.png",
    shortDesc:
      "Top up Magic Chess Go Go: Go Go Pass dan Diamond dengan User ID.",
    longDesc: [
      "Magic Chess: Go Go adalah game auto-battler dari Moonton. Top up Go Go Pass & Diamond di AVENXO ONLINE diproses otomatis — masukkan User ID, pilih nominal, bayar, dan item langsung masuk ke akun kamu.",
      "Go Go Pass & Diamond bisa dipakai untuk ikut event board dan beli hero. Harga mulai Rp5.000.",
    ],
    fields: [
      { id: "userId", label: "User ID", placeholder: "Masukkan User ID" },
    ],
    denominations: [
      { id: "mc-12", amount: "12 Diamond", price: 5000 },
      { id: "mc-30", amount: "30 Diamond", price: 12500 },
      { id: "mc-60", amount: "60 Diamond", price: 25000, popular: true },
      { id: "mc-120", amount: "120 Diamond", price: 50000 },
      { id: "mc-300", amount: "300 Diamond", price: 125000 },
      { id: "mc-600", amount: "600 Diamond", price: 250000 },
    ],
    paymentCategories: defaultPayments(),
    tags: "strategy",
    minPrice: 5000,
    rating: 4.92,
    ratingCount: "184rb+",
  },
  {
    slug: "call-of-duty-mobile",
    name: "Call of Duty Mobile",
    publisher: "Activision",
    cover: "/images/9dc7563b-96ae-4439-bb24-dfc5324695d9.png",
    banner: "/images/9dc7563b-96ae-4439-bb24-dfc5324695d9.png",
    shortDesc:
      "Top up CP Call of Duty Mobile dengan UID, CP langsung masuk ke akun.",
    longDesc: [
      "Call of Duty Mobile (CODM) adalah game FPS multiplatform dari Activision. Top up CP (Credit Point) di AVENXO ONLINE diproses otomatis — masukkan UID, pilih nominal, bayar, dan CP langsung masuk ke akun CODM kamu.",
      "CP bisa dipakai untuk beli Battle Pass, senjata, skin, dan crate. Harga mulai Rp10.000, proses cepat dan aman.",
    ],
    fields: [
      { id: "userId", label: "UID", placeholder: "Masukkan UID" },
    ],
    denominations: [
      { id: "cod-80", amount: "80 CP", price: 10000 },
      { id: "cod-400", amount: "400 CP", price: 50000, popular: true },
      { id: "cod-800", amount: "800 CP", price: 100000 },
      { id: "cod-1600", amount: "1.600 CP", price: 200000 },
      { id: "cod-4000", amount: "4.000 CP", price: 500000 },
      { id: "cod-8000", amount: "8.000 CP", price: 1000000 },
    ],
    paymentCategories: defaultPayments(),
    tags: "br",
    minPrice: 10000,
    rating: 4.94,
    ratingCount: "421rb+",
  },
];

function defaultPayments(): PaymentCategory[] {
  return [
    {
      key: "ewallet",
      label: "E-Wallet",
      methods: [
        { id: "qris", label: "QRIS" },
        { id: "dana", label: "DANA" },
        { id: "ovo", label: "OVO" },
        { id: "gopay", label: "GoPay" },
        { id: "shopeepay", label: "ShopeePay" },
      ],
    },
    {
      key: "va",
      label: "Virtual Account",
      methods: [
        { id: "bca", label: "BCA VA" },
        { id: "bri", label: "BRI VA" },
        { id: "bni", label: "BNI VA" },
        { id: "mandiri", label: "Mandiri VA" },
        { id: "cimb", label: "CIMB VA" },
      ],
    },
    {
      key: "bank",
      label: "Transfer Bank",
      methods: [
        { id: "bca-tf", label: "BCA" },
        { id: "bri-tf", label: "BRI" },
        { id: "bni-tf", label: "BNI" },
      ],
    },
    {
      key: "pulsa",
      label: "Pulsa",
      methods: [
        { id: "telkomsel", label: "Telkomsel" },
        { id: "xl", label: "XL" },
        { id: "tri", label: "Tri" },
      ],
    },
  ];
}

export function getGame(slug: string) {
  return games.find((g) => g.slug === slug);
}

export function getAllGames() {
  return games;
}

export { rupiah };