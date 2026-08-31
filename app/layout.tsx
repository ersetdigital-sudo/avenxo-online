import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVENXO ONLINE — Top Up Game Online Murah, Cepat & Aman",
  description:
    "AVENXO ONLINE adalah marketplace top up game online. Top up Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Magic Chess: Go Go, dan Call of Duty Mobile dengan proses cepat, harga kompetitif, dan pembayaran aman.",
  keywords: [
    "top up game",
    "top up game murah",
    "top up game online",
    "top up Mobile Legends",
    "top up Free Fire",
    "top up PUBG Mobile",
    "top up Genshin Impact",
    "top up Magic Chess",
    "top up Call of Duty Mobile",
  ],
  alternates: {
    canonical: "https://avenxoonline.net/",
  },
  openGraph: {
    title: "AVENXO ONLINE — Top Up Game Online Murah, Cepat & Aman",
    description:
      "Marketplace top up game: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Magic Chess: Go Go, dan Call of Duty Mobile.",
    type: "website",
    url: "https://avenxoonline.net/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}