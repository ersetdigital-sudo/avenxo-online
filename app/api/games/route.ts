import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const revalidate = 30;

export async function GET() {
  const { data: games, error } = await supabaseAdmin
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch denominations for each game
  const gamesWithDenoms = await Promise.all(
    (games || []).map(async (game) => {
      const { data: denoms } = await supabaseAdmin
        .from("denominations")
        .select("*")
        .eq("game_id", game.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      const minPrice = denoms && denoms.length > 0
        ? Math.min(...denoms.map((d) => d.price))
        : 0;

      return {
        slug: game.slug,
        name: game.name,
        publisher: game.publisher,
        cover: game.cover_url,
        banner: game.banner_url,
        shortDesc: game.short_desc,
        longDesc: game.long_desc,
        fields: game.fields,
        tags: game.tags,
        badge: game.badge ? { text: game.badge, cls: getBadgeCls(game.badge) } : undefined,
        is_active: game.is_active,
        minPrice,
        rating: game.rating,
        ratingCount: game.rating_count,
        denominations: (denoms || []).map((d) => ({
          id: d.id,
          amount: d.amount,
          bonus: d.bonus,
          price: d.price,
          popular: d.is_popular,
        })),
      };
    })
  );

  return NextResponse.json({ games: gamesWithDenoms });
}

function getBadgeCls(badge: string): string {
  switch (badge) {
    case "BEST SELLER": return "badge-best";
    case "HOT": return "badge-hot";
    case "POPULER": return "badge-pop";
    default: return "badge-pop";
  }
}
