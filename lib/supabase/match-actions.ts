"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables de entorno de admin no configuradas");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function updateMatchStatusAction(
  matchId: string,
  status: "viewed" | "negotiating" | "accepted" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "No autenticado" };

  const admin = getAdminClient();

  const { data: match } = await admin
    .from("matches")
    .select("shipper_id, carrier_id")
    .eq("id", matchId)
    .single();

  if (!match) return { success: false, error: "Match no encontrado" };

  const isShipper = match.shipper_id === user.id;

  let isCarrier = false;
  if (!isShipper) {
    const { data: carrierProfile } = await admin
      .from("carrier_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("id", match.carrier_id)
      .maybeSingle();
    isCarrier = !!carrierProfile;
  }

  if (!isShipper && !isCarrier) {
    return { success: false, error: "No tienes permiso para modificar este match" };
  }

  const { error } = await admin
    .from("matches")
    .update({ status })
    .eq("id", matchId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
