import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const revalidate = 30;

export async function GET() {
  const { data: methods, error } = await supabaseAdmin
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by category
  const categoryMap = new Map<string, { key: string; label: string; methods: any[] }>();

  const CAT_LABELS: Record<string, string> = {
    ewallet: "E-Wallet",
    va: "Virtual Account",
    bank: "Transfer Bank",
    pulsa: "Pulsa",
  };

  for (const m of methods || []) {
    if (!categoryMap.has(m.category)) {
      categoryMap.set(m.category, {
        key: m.category,
        label: CAT_LABELS[m.category] || m.category,
        methods: [],
      });
    }
    categoryMap.get(m.category)!.methods.push({
      id: m.id,
      methodId: m.label.toLowerCase().replace(/\s+/g, "-"),
      label: m.label,
      accountNumber: m.account_number,
      accountName: m.account_name,
      qrImageUrl: m.qr_image_url,
    });
  }

  const categories = Array.from(categoryMap.values()).filter((c) => c.methods.length > 0);

  return NextResponse.json({ categories });
}
