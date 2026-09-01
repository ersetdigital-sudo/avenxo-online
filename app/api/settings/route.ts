import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const revalidate = 30;

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  for (const s of data || []) {
    settings[s.key] = s.value;
  }

  return NextResponse.json({ settings });
}
