import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Unable to load leads" }, { status: 400 });
  return NextResponse.json({ leads: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Lead name is required." }, { status: 400 });
  }
  const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) || null : null;
  const { data, error } = await supabase.rpc("create_lead_for_current_user", {
    p_name: body.name.trim().slice(0, 120),
    p_email: clean(body.email, 254),
    p_phone: clean(body.phone, 40),
    p_service: clean(body.service, 160),
    p_notes: clean(body.notes, 3000)
  });
  if (error) return NextResponse.json({ error: "Unable to create lead" }, { status: 400 });
  return NextResponse.json({ lead: data }, { status: 201 });
}
