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
      estimated_distance: 0, // placeholder — real distance calc is Phase 2
      status: "published",
    })
    .select()
    .single();

  if (error) throw error;
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
    .select("*, shipment_requests(*)")
    .eq("shipper_id", shipperId)
    .in("status", ["suggested", "viewed", "negotiating"])
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
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
