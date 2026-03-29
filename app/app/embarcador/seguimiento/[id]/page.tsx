import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2, Camera, Shield, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seedShipments, seedTrackingEvents } from "@/lib/seed-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const eventLabels: Record<string, string> = {
  escrow_funded: "Pago en custodia confirmado",
  carrier_confirmed: "Transportista confirmó recolección",
  pickup_completed: "Carga recolectada con evidencia",
  in_transit: "En tránsito",
  delivered: "Entregado y confirmado",
};

export default function SeguimientoPage({ params }: { params: { id: string } }) {
  const shipment = seedShipments.find(s => s.id === params.id) ?? seedShipments[2];
  const events = seedTrackingEvents.filter(e => e.shipmentId === shipment.id);

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href="/app/embarcador"><ArrowLeft className="w-4 h-4" />Dashboard</Link>
      </Button>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Seguimiento en tiempo real</h1>
          <p className="text-sm text-ink-500">{shipment.originCity} → {shipment.destinationCity}</p>
        </div>
        <div className="flex items-center gap-2 bg-trust-greenLight border border-green-200 rounded-full px-4 py-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-trust-green animate-pulse" />
          <span className="text-sm font-semibold text-trust-green">En tránsito</span>
        </div>
      </div>
      {/* Map placeholder */}
      <div className="bg-ink-800 rounded-2xl h-52 mb-6 flex items-center justify-center border border-ink-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #0EA5E9 0%, transparent 50%), radial-gradient(circle at 70% 30%, #10B981 0%, transparent 40%)" }} />
        <div className="relative z-10 text-center">
          <MapPin className="w-7 h-7 text-accent-400 mx-auto mb-1" />
          <p className="text-white text-sm font-medium">GPS en tiempo real</p>
          <p className="text-ink-400 text-xs mt-0.5">Última posición: San Luis Potosí · hace 4 min</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Historial de eventos</CardTitle></CardHeader>
          <CardContent className="px-6 pb-5">
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-0 w-px bg-surface-200" />
              <div className="space-y-4">
                {events.map((event, i) => {
                  const isLast = i === events.length - 1;
                  const Icon = event.eventType === "escrow_funded" ? Shield : event.eventType === "pickup_completed" ? Camera : MapPin;
                  return (
                    <div key={event.id} className="flex gap-4 relative">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border", isLast ? "bg-trust-green border-trust-green" : "bg-white border-surface-200")}>
                        <Icon className={cn("w-3.5 h-3.5", isLast ? "text-white" : "text-ink-400")} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={cn("text-sm font-medium", isLast ? "text-ink-900" : "text-ink-700")}>{eventLabels[event.eventType] ?? event.eventType}</p>
                        {event.city && <p className="text-xs text-ink-400">{event.city}, {event.state}</p>}
                        {event.notes && <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{event.notes}</p>}
                        <p className="text-xs text-ink-300 mt-0.5">{new Date(event.createdAt).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card><CardContent className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Detalles del envío</p>
            <div className="flex justify-between"><span className="text-ink-500">Carga</span><span className="font-medium text-ink-800 text-right text-xs max-w-[55%]">{shipment.cargoDescription.slice(0, 35)}…</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Peso</span><span className="font-medium">{shipment.weightKg.toLocaleString("es-MX")} kg</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Valor declarado</span><span className="font-medium">{formatCurrency(shipment.declaredValue)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">En custodia</span><span className="font-semibold text-trust-green">{formatCurrency(shipment.estimatedPrice ?? 0)}</span></div>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Transportista</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center font-semibold text-ink-700 text-sm">CR</div>
              <div><p className="text-sm font-semibold text-ink-900">Trans Ramírez</p><p className="text-xs text-ink-400">Torton · JLA-123-B</p></div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-surface-50 rounded-lg border border-surface-200">
              <Phone className="w-3.5 h-3.5 text-trust-green" />
              <span className="text-xs text-ink-600 font-medium">+52 33 1234 5678 (desbloqueado)</span>
            </div>
          </CardContent></Card>
          <Button variant="outline" className="w-full gap-2 text-trust-red border-red-200 hover:bg-red-50">
            <AlertCircle className="w-4 h-4" />Reportar incidente
          </Button>
        </div>
      </div>
    </div>
  );
}
