import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { key, value } = body;
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key, value: value || "" }, { onConflict: "key" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ setting: data });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { key } = body;
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("site_settings").delete().eq("key", key);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
