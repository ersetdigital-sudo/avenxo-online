import Hero from "@/components/Hero";
import TopUpGame from "@/components/TopUpGame";
import Featured from "@/components/Featured";
import Trust from "@/components/Trust";
import CaraTopUp from "@/components/CaraTopUp";
import SiteShell from "@/components/SiteShell";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AVENXO ONLINE",
  url: "https://avenxoonline.net/",
  description:
    "Marketplace top up game online: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Magic Chess: Go Go, Call of Duty Mobile.",
};

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <TopUpGame />
      <Featured />
      <Trust />
      <CaraTopUp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SiteShell>
  );
}