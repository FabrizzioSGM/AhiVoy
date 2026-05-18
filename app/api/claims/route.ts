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
  const { shipmentId, reason, description } = body;

  if (!shipmentId || !reason || !description || description.length < 20) {
    return NextResponse.json({ error: "Faltan campos requeridos o descripción muy corta" }, { status: 400 });
  }

  const admin = getAdminClient();

  // Get user role
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Check no duplicate open claim
  const { data: existing } = await admin
    .from("claims")
    .select("id")
    .eq("shipment_id", shipmentId)
    .eq("claimant_id", user.id)
    .eq("status", "open")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Ya tienes un reclamo abierto para este envío" }, { status: 409 });
  }

  const { error } = await admin
    .from("claims")
    .insert({
      shipment_id: shipmentId,
      claimant_id: user.id,
      claimant_role: profile?.role ?? "embarcador",
      reason,
      description,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
