// Queries de administración — usan service role key para bypasear RLS
// SOLO usar en server components, API routes y server actions.
// NUNCA exponer al cliente.

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables de entorno de admin no configuradas");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Stats generales ──────────────────────────────────────────────────────────

export async function getAdminStats() {
  const supabase = getAdminClient();

  const [
    { count: totalUsers },
    { count: pendingVerifications },
    { count: activeShipments },
    { count: openClaims },
    { count: totalMatches },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("carrier_profiles").select("*", { count: "exact", head: true })
      .in("verification_status", ["pending", "in_review"]),
    supabase.from("shipment_requests").select("*", { count: "exact", head: true })
      .eq("status", "in_transit"),
    supabase.from("claims").select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase.from("matches").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    pendingVerifications: pendingVerifications ?? 0,
    activeShipments: activeShipments ?? 0,
    openClaims: openClaims ?? 0,
    totalMatches: totalMatches ?? 0,
  };
}

// ─── Verificaciones pendientes ────────────────────────────────────────────────

export async function getPendingVerifications() {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("carrier_profiles")
    .select(`
      id,
      operator_type,
      license_number,
      operating_states,
      verification_status,
      reputation_tier,
      created_at,
      profiles:user_id ( name, email )
    `)
    .in("verification_status", ["pending", "in_review"])
    .order("created_at", { ascending: true })
    .limit(20);
  return data ?? [];
}

// ─── Envíos recientes (feed de operaciones) ───────────────────────────────────

export async function getRecentShipments(limit = 10) {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("shipment_requests")
    .select("id, origin_city, origin_state, destination_city, destination_state, cargo_type, weight_kg, declared_value, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ─── Disputas abiertas ────────────────────────────────────────────────────────

export async function getOpenClaims() {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("claims")
    .select("id, reason, description, status, created_at, claimant_role")
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .limit(10);
  return data ?? [];
}

// ─── Acciones de verificación ─────────────────────────────────────────────────

export async function approveCarrier(carrierId: string) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("carrier_profiles")
    .update({
      verification_status: "approved",
      reputation_tier: "verificado",
    })
    .eq("id", carrierId);
  if (error) throw error;
}

export async function rejectCarrier(carrierId: string) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("carrier_profiles")
    .update({ verification_status: "rejected" })
    .eq("id", carrierId);
  if (error) throw error;
}
