import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Shield, AlertCircle, Phone, Camera, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const eventLabels: Record<string, string> = {
  escrow_funded: "Pago en custodia confirmado",
  carrier_confirmed: "Transportista confirmó recolección",
  pickup_completed: "Carga recolectada con evidencia",
  in_transit: "En tránsito",
  delivered: "Entregado y confirmado",
};

export default async function SeguimientoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: match } = await supabase
    .from("matches")
    .select(`
      id, status, estimated_price, carrier_id, shipper_id,
      shipment_requests(
        id, origin_city, origin_state, destination_city, destination_state,
        cargo_description, cargo_type, weight_kg, declared_value, status
      )
    `)
    .eq("id", params.id)
    .single();

  if (!match) notFound();

  const shipment = match.shipment_requests as Record<string, unknown> | null;
  if (!shipment) notFound();

  // Fetch tracking events for this shipment
  const { data: events } = await supabase
    .from("tracking_events")
    .select("*")
    .eq("shipment_id", shipment.id as string)
    .order("created_at", { ascending: true });

  // Fetch carrier info
  const { data: carrierProfile } = await supabase
    .from("carrier_profiles")
    .select("id, user_id, operator_type")
    .eq("id", match.carrier_id)
    .single();

  let carrierName = "Transportista";
  if (carrierProfile?.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, phone")
      .eq("id", carrierProfile.user_id)
      .single();
    if (profile?.name) carrierName = profile.name;
  }

  const shipmentStatus = String(shipment.status ?? "published");
  const isInTransit = shipmentStatus === "in_transit";
  const isDelivered = shipmentStatus === "delivered";
  const isAccepted = match.status === "accepted" || isInTransit || isDelivered;

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href="/app/embarcador"><ArrowLeft className="w-4 h-4" />Dashboard</Link>
      </Button>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Seguimiento en tiempo real</h1>
          <p className="text-sm text-ink-500">{String(shipment.origin_city)} → {String(shipment.destination_city)}</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 flex-shrink-0 border",
          isDelivered ? "bg-green-50 border-green-200" :
          isInTransit ? "bg-trust-greenLight border-green-200" :
          isAccepted ? "bg-accent-50 border-accent-200" :
          "bg-surface-50 border-surface-200"
        )}>
          {isInTransit && <span className="w-2 h-2 rounded-full bg-trust-green animate-pulse" />}
          <span className={cn("text-sm font-semibold",
            isDelivered ? "text-green-700" :
            isInTransit ? "text-trust-green" :
            isAccepted ? "text-accent-700" :
            "text-ink-600"
          )}>
            {isDelivered ? "Entregado" : isInTransit ? "En tránsito" : isAccepted ? "Aceptado" : "Pendiente"}
          </span>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-ink-800 rounded-2xl h-52 mb-6 flex items-center justify-center border border-ink-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #0EA5E9 0%, transparent 50%), radial-gradient(circle at 70% 30%, #10B981 0%, transparent 40%)" }} />
        <div className="relative z-10 text-center">
          <MapPin className="w-7 h-7 text-accent-400 mx-auto mb-1" />
          <p className="text-white text-sm font-medium">GPS en tiempo real</p>
          <p className="text-ink-400 text-xs mt-0.5">
            {isInTransit ? "Seguimiento activo" : "Disponible cuando la carga esté en tránsito"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Events timeline */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Historial de eventos</CardTitle></CardHeader>
          <CardContent className="px-6 pb-5">
            {events && events.length > 0 ? (
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-0 w-px bg-surface-200" />
                <div className="space-y-4">
                  {events.map((event, i) => {
                    const isLast = i === events.length - 1;
                    const Icon = event.event_type === "escrow_funded" ? Shield : event.event_type === "pickup_completed" ? Camera : MapPin;
                    return (
                      <div key={event.id} className="flex gap-4 relative">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border", isLast ? "bg-trust-green border-trust-green" : "bg-white border-surface-200")}>
                          <Icon className={cn("w-3.5 h-3.5", isLast ? "text-white" : "text-ink-400")} />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={cn("text-sm font-medium", isLast ? "text-ink-900" : "text-ink-700")}>{eventLabels[event.event_type] ?? event.event_type}</p>
                          {event.city && <p className="text-xs text-ink-400">{event.city}, {event.state}</p>}
                          {event.notes && <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{event.notes}</p>}
                          <p className="text-xs text-ink-300 mt-0.5">{new Date(event.created_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="w-8 h-8 text-ink-200 mx-auto mb-2" />
                <p className="text-sm text-ink-400">Sin eventos aún</p>
                <p className="text-xs text-ink-300 mt-1">Los eventos aparecerán cuando el transportista actualice el estado.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details sidebar */}
        <div className="space-y-4">
          <Card><CardContent className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Detalles del envío</p>
            <div className="flex justify-between"><span className="text-ink-500">Carga</span><span className="font-medium text-ink-800 text-right text-xs max-w-[55%]">{String(shipment.cargo_description ?? shipment.cargo_type ?? "")}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Peso</span><span className="font-medium">{Number(shipment.weight_kg ?? 0).toLocaleString("es-MX")} kg</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Valor declarado</span><span className="font-medium">{formatCurrency(Number(shipment.declared_value ?? 0))}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">En custodia</span><span className="font-semibold text-trust-green">{formatCurrency(Number(match.estimated_price))}</span></div>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Transportista</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center font-semibold text-ink-700 text-sm">
                {carrierName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{carrierName}</p>
                <p className="text-xs text-ink-400">{carrierProfile?.operator_type === "empresa" ? "Empresa" : "Independiente"}</p>
              </div>
            </div>
            {isAccepted ? (
              <div className="flex items-center gap-2 p-3 bg-surface-50 rounded-lg border border-surface-200">
                <Phone className="w-3.5 h-3.5 text-trust-green" />
                <span className="text-xs text-ink-600 font-medium">Contacto desbloqueado al aceptar</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-ink-50 rounded-lg border border-ink-200">
                <Shield className="w-3.5 h-3.5 text-ink-400" />
                <span className="text-xs text-ink-500">Contacto protegido hasta confirmar pago</span>
              </div>
            )}
          </CardContent></Card>

          <Button asChild variant="outline" className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <Link href={`/app/embarcador/reclamo/${params.id}`}><AlertCircle className="w-4 h-4" />Reportar incidente</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
