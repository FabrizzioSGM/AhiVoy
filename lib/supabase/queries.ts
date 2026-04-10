// Central data access layer — all Supabase queries go here
import type { SupabaseClient } from "@supabase/supabase-js";

// ─── Profiles ────────────────────────────────────────────────────────────────

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function markOnboardingComplete(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", userId);
  if (error) throw error;
}

// ─── Companies ───────────────────────────────────────────────────────────────

export async function createCompany(
  supabase: SupabaseClient,
  data: {
    userId: string;
    legalName: string;
    tradeName?: string;
    rfc: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    industry?: string;
  }
) {
  // Idempotent: return existing if already created
  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", data.userId)
    .maybeSingle();

  if (existing) return existing;

  const { data: company, error } = await supabase
    .from("companies")
    .insert({
      user_id: data.userId,
      legal_name: data.legalName,
      trade_name: data.tradeName || null,
      rfc: data.rfc || "PENDIENTE",
      address: data.address || "Pendiente",
      city: data.city,
      state: data.state,
      postal_code: data.postalCode || "00000",
      industry: data.industry || null,
    })
    .select()
    .single();

  if (error) throw error;
  return company;
}

// ─── Carrier Profiles ─────────────────────────────────────────────────────────

export async function getCarrierProfileByUserId(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("carrier_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function createCarrierProfile(
  supabase: SupabaseClient,
  data: {
    userId: string;
    operatorType: "empresa" | "independiente";
    licenseNumber: string;
    operatingStates: string[];
  }
) {
  // Idempotent
  const { data: existing } = await supabase
    .from("carrier_profiles")
    .select("id")
    .eq("user_id", data.userId)
    .maybeSingle();

  if (existing) return existing;

  const { data: profile, error } = await supabase
    .from("carrier_profiles")
    .insert({
      user_id: data.userId,
      operator_type: data.operatorType,
      license_number: data.licenseNumber || "PENDIENTE",
      operating_states: data.operatingStates,
    })
    .select()
    .single();

  if (error) throw error;
  return profile;
}

// ─── Shipment Requests ────────────────────────────────────────────────────────

export async function createShipment(
  supabase: SupabaseClient,
  data: {
    shipperId: string;
    originCity: string;
    originState: string;
    destinationCity: string;
    destinationState: string;
    cargoDescription: string;
    cargoType: string;
    weightKg: number;
    volumeM3?: number;
    requiredDate: string;
    declaredValue: number;
    aiParsed?: boolean;
    rawInput?: string;
  }
) {
  const { data: shipment, error } = await supabase
    .from("shipment_requests")
    .insert({
      shipper_id: data.shipperId,
      origin_city: data.originCity,
      origin_state: data.originState,
      destination_city: data.destinationCity,
      destination_state: data.destinationState,
      cargo_description: data.cargoDescription,
      cargo_type: data.cargoType,
      weight_kg: data.weightKg,
      volume_m3: data.volumeM3 || null,
      required_date: data.requiredDate,
      declared_value: data.declaredValue,
      status: "published",
      is_fragile: false,
      requires_refrigeration: false,
      ai_parsed: data.aiParsed ?? false,
      raw_input: data.rawInput ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  // Disparar matching automático (best-effort — no bloquea si falla)
  if (shipment?.id) {
    supabase.rpc("find_matches_for_shipment", { p_shipment_id: shipment.id })
      .then(({ error: matchErr }) => {
        if (matchErr) console.warn("[matching] find_matches_for_shipment:", matchErr.message);
      });
  }

  return shipment;
}

export async function getShipmentsByShipper(supabase: SupabaseClient, shipperId: string) {
  const { data } = await supabase
    .from("shipment_requests")
    .select("*")
    .eq("shipper_id", shipperId)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

// ─── Return Routes ────────────────────────────────────────────────────────────

export async function createRoute(
  supabase: SupabaseClient,
  data: {
    carrierId: string;
    originCity: string;
    originState: string;
    destinationCity: string;
    destinationState: string;
    departureDateFrom: string;
    departureDateTo: string;
    availableCapacityKg: number;
    availableCapacityM3?: number;
    pricePerKm?: number;
    acceptedCargoTypes: string[];
  }
) {
  const { data: route, error } = await supabase
    .from("return_routes")
    .insert({
      carrier_id: data.carrierId,
      origin_city: data.originCity,
      origin_state: data.originState,
      destination_city: data.destinationCity,
      destination_state: data.destinationState,
      departure_date_from: data.departureDateFrom,
      departure_date_to: data.departureDateTo,
      available_capacity_kg: data.availableCapacityKg,
      available_capacity_m3: data.availableCapacityM3 || null,
      price_per_km: data.pricePerKm || null,
      accepted_cargo_types: data.acceptedCargoTypes,
      estimated_distance: 0, // placeholder — real distance calc es Phase 3
      status: "published",
    })
    .select()
    .single();

  if (error) throw error;

  // Disparar matching automático (best-effort)
  if (route?.id) {
    supabase.rpc("find_matches_for_route", { p_route_id: route.id })
      .then(({ error: matchErr }) => {
        if (matchErr) console.warn("[matching] find_matches_for_route:", matchErr.message);
      });
  }

  return route;
}

export async function getRoutesByCarrierId(supabase: SupabaseClient, carrierId: string) {
  const { data } = await supabase
    .from("return_routes")
    .select("*")
    .eq("carrier_id", carrierId)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export async function getMatchesByShipper(supabase: SupabaseClient, shipperId: string) {
  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      shipment_requests(*),
      return_routes(
        origin_city, origin_state, destination_city, destination_state,
        departure_date_from, departure_date_to, accepted_cargo_types
      )
    `)
    .eq("shipper_id", shipperId)
    .in("status", ["suggested", "viewed", "negotiating"])
    .order("match_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export async function getMatchesByCarrier(supabase: SupabaseClient, carrierId: string) {
  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      shipment_requests(
        origin_city, origin_state, destination_city, destination_state,
        cargo_type, weight_kg, volume_m3, required_date, cargo_description
      ),
      return_routes(origin_city, origin_state, destination_city, destination_state)
    `)
    .eq("carrier_id", carrierId)
    .in("status", ["suggested", "viewed", "negotiating"])
    .order("match_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export async function getMatchById(supabase: SupabaseClient, matchId: string) {
  const { data: match } = await supabase
    .from("matches")
    .select(`
      *,
      shipment_requests(*),
      return_routes(*)
    `)
    .eq("id", matchId)
    .single();

  if (!match) return null;

  // Fetch carrier profile + name separately (carrier_profiles.user_id → auth.users, not profiles directly)
  const { data: carrierProfile } = await supabase
    .from("carrier_profiles")
    .select("*")
    .eq("id", match.carrier_id)
    .single();

  const { data: carrierProfileData } = carrierProfile?.user_id
    ? await supabase.from("profiles").select("name").eq("id", carrierProfile.user_id).single()
    : { data: null };

  return {
    ...match,
    carrier_profile: carrierProfile ?? null,
    carrier_name: carrierProfileData?.name ?? "Transportista",
  };
}

export async function updateMatchStatus(
  supabase: SupabaseClient,
  matchId: string,
  status: "viewed" | "negotiating" | "accepted" | "rejected"
) {
  const { error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", matchId);
  if (error) throw error;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

// ─── Available Shipments (transportista feed) ─────────────────────────────────

export async function getPublishedShipments(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("shipment_requests")
    .select("*")
    .in("status", ["published", "matching"])
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}
