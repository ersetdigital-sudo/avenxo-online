import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const q = req.nextUrl.searchParams.get("q");

  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.or(`order_id.ilike.%${q}%,user_id.ilike.%${q}%,game_name.ilike.%${q}%`);
  }

  const { data, error, count } = await query.limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [todayRes, pendingRes, todayRevRes, monthRevRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total").gte("created_at", todayStart),
    supabase.from("orders").select("total").gte("created_at", monthStart),
  ]);

  const todayRevenue = (todayRevRes.data || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const monthRevenue = (monthRevRes.data || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  return NextResponse.json({
    orders: data,
    stats: {
      today: todayRes.count || 0,
      pending: pendingRes.count || 0,
      todayRevenue,
      monthRevenue,
    },
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
