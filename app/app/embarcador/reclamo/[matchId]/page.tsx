import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClaimForm } from "./claim-form";

export default async function ReclamoPage({ params }: { params: { matchId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: match } = await supabase
    .from("matches")
    .select(`
      id, shipper_id,
      shipment_requests(id, origin_city, destination_city, cargo_type)
    `)
    .eq("id", params.matchId)
    .single();

  if (!match || match.shipper_id !== user.id) notFound();

  const shipment = match.shipment_requests as unknown as Record<string, unknown> | null;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Reportar incidente</h1>
      <p className="text-sm text-ink-500 mb-6">
        {shipment ? `${shipment.origin_city} → ${shipment.destination_city}` : "Envío"}
      </p>
      <ClaimForm
        shipmentId={(shipment?.id as string) ?? ""}
      />
    </div>
  );
}
