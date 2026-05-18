import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RatingForm } from "./rating-form";

export default async function CalificarPage({ params }: { params: { matchId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: match } = await supabase
    .from("matches")
    .select(`
      id, carrier_id, shipper_id, status,
      shipment_requests(id, origin_city, destination_city, cargo_type)
    `)
    .eq("id", params.matchId)
    .single();

  if (!match || match.shipper_id !== user.id) notFound();

  // Get carrier name
  const { data: carrierProfile } = await supabase
    .from("carrier_profiles")
    .select("user_id")
    .eq("id", match.carrier_id)
    .single();

  let carrierName = "Transportista";
  let carrierUserId = "";
  if (carrierProfile?.user_id) {
    carrierUserId = carrierProfile.user_id;
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", carrierProfile.user_id)
      .single();
    if (profile?.name) carrierName = profile.name;
  }

  const shipment = match.shipment_requests as unknown as Record<string, unknown> | null;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Calificar transportista</h1>
      <p className="text-sm text-ink-500 mb-6">
        {shipment ? `${shipment.origin_city} → ${shipment.destination_city}` : "Envío completado"}
      </p>
      <RatingForm
        matchId={params.matchId}
        shipmentId={(shipment?.id as string) ?? ""}
        revieweeId={carrierUserId}
        carrierName={carrierName}
      />
    </div>
  );
}
