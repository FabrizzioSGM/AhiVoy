import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json();
  const { shipmentId, revieweeId, overall, punctuality, communication, documentation, cargoCondition, comment } = body;

  if (!shipmentId || !revieweeId || !overall || !punctuality || !communication || !documentation) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  if (overall < 1 || overall > 5) {
    return NextResponse.json({ error: "Calificación inválida" }, { status: 400 });
  }

  const admin = getAdminClient();

  // Check user hasn't already rated this shipment
  const { data: existing } = await admin
    .from("ratings")
    .select("id")
    .eq("shipment_id", shipmentId)
    .eq("reviewer_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Ya calificaste este envío" }, { status: 409 });
  }

  // Get user role
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { error } = await admin
    .from("ratings")
    .insert({
      shipment_id: shipmentId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      reviewer_role: profile?.role ?? "embarcador",
      overall,
      punctuality,
      communication,
      documentation,
      cargo_condition: cargoCondition || null,
      comment: comment || null,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
