import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(req: NextRequest, { params }: { params: { matchId: string } }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const admin = getAdminClient();

  const { data: match } = await admin
    .from("matches")
    .select("shipper_id, carrier_id")
    .eq("id", params.matchId)
    .single();

  if (!match) return NextResponse.json({ error: "Match no encontrado" }, { status: 404 });

  // Verify user is involved
  const { data: carrierProfile } = await admin
    .from("carrier_profiles")
    .select("user_id")
    .eq("id", match.carrier_id)
    .single();

  const isInvolved = match.shipper_id === user.id || carrierProfile?.user_id === user.id;
  if (!isInvolved) return NextResponse.json({ error: "Sin permiso" }, { status: 403 });

  const { data: messages, error } = await admin
    .from("match_messages")
    .select("id, sender_id, message, created_at")
    .eq("match_id", params.matchId)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error?.code === "42P01") {
    // Table doesn't exist yet
    return NextResponse.json({ messages: null, unavailable: true });
  }

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: { matchId: string } }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json();
  const message = body?.message?.trim();
  if (!message || message.length > 1000) {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
  }

  const admin = getAdminClient();

  // Verify user is involved in this match
  const { data: match } = await admin
    .from("matches")
    .select("shipper_id, carrier_id")
    .eq("id", params.matchId)
    .single();

  if (!match) return NextResponse.json({ error: "Match no encontrado" }, { status: 404 });

  const { data: carrierProfile } = await admin
    .from("carrier_profiles")
    .select("user_id")
    .eq("id", match.carrier_id)
    .single();

  const isInvolved = match.shipper_id === user.id || carrierProfile?.user_id === user.id;
  if (!isInvolved) return NextResponse.json({ error: "Sin permiso" }, { status: 403 });

  const { error } = await admin
    .from("match_messages")
    .insert({ match_id: params.matchId, sender_id: user.id, message });

  if (error?.code === "42P01") {
    return NextResponse.json({ error: "Mensajería no disponible aún" }, { status: 503 });
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
