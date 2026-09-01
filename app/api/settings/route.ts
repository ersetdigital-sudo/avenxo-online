import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const revalidate = 30;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  for (const s of data || []) {
    settings[s.key] = s.value;
  }

  return NextResponse.json({ settings });
}
