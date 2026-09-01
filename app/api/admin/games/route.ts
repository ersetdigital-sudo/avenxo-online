import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ games: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("games")
    .insert({
      name: body.name,
      slug: body.slug,
      publisher: body.publisher,
      cover_url: body.cover_url || "",
      banner_url: body.banner_url || "",
      short_desc: body.short_desc || "",
      long_desc: body.long_desc || [],
      fields: body.fields || [{ id: "userId", label: "User ID", placeholder: "Masukkan User ID" }],
      tags: body.tags || "",
      badge: body.badge || null,
      is_active: body.is_active ?? true,
      sort_order: body.sort_order ?? 0,
      rating: body.rating ?? 0,
      rating_count: body.rating_count || "0",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ game: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ game: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
