import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle2, Lock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrustBadge } from "@/components/shared/trust-badge";
import { RouteDisplay } from "@/components/shared/route-display";
import { seedMatches, seedShipments, seedCarrierProfiles, seedVehicles } from "@/lib/seed-data";
import { formatCurrency, formatWeight } from "@/lib/utils";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = seedMatches.find(m => m.id === params.id) ?? seedMatches[0];
  const shipment = seedShipments.find(s => s.id === match.shipmentId) ?? seedShipments[0];
  const carrier = seedCarrierProfiles[0];
  const vehicle = seedVehicles[0];

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href="/app/embarcador"><ArrowLeft className="w-4 h-4" />Coincidencias</Link>
      </Button>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Coincidencia encontrada</h1>
          <p className="text-sm text-ink-500">Revisa el perfil del transportista y acepta o rechaza la propuesta.</p>
        </div>
        <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 rounded-xl px-4 py-2 flex-shrink-0">
          <span className="text-2xl font-bold text-accent-700">{match.matchScore}%</span>
          <span className="text-xs text-accent-600 font-medium">Score de<br />coincidencia</span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-center">
          <p className="text-xs text-ink-400 mb-1">Precio acordado</p>
          <p className="text-xl font-bold text-ink-900">{formatCurrency(match.estimatedPrice)}</p>
        </div>
        <div className="bg-trust-greenLight border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-trust-green mb-1">Tu ahorro</p>
          <p className="text-xl font-bold text-trust-green">{formatCurrency(match.shipperSavings)}</p>
          <p className="text-xs text-green-600">vs flete dedicado</p>
        </div>
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-center">
          <p className="text-xs text-ink-400 mb-1">Desvío</p>
          <p className="text-xl font-bold text-ink-900">{match.detourKm} km</p>
          <p className="text-xs text-ink-400">extra del transportista</p>
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium">Tu envío</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <RouteDisplay originCity={shipment.originCity} originState={shipment.originState} destinationCity={shipment.destinationCity} destinationState={shipment.destinationState} size="md" className="mb-3" />
          <div className="flex flex-wrap gap-4 text-sm text-ink-600">
            <span>{formatWeight(shipment.weightKg)}</span>
            <span>{shipment.cargoType}</span>
            <span>{shipment.requiredDate}</span>
            <span className="font-medium text-ink-800">Valor: {formatCurrency(shipment.declaredValue)}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium">Perfil del transportista</CardTitle>
            <TrustBadge status="approved" label="Verificado · Élite" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-ink-100 flex items-center justify-center text-ink-700 font-bold flex-shrink-0">CR</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-ink-900">Trans Ramírez</p>
                <Badge variant="elite">Élite</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-ink-600 mb-2">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" />{carrier.avgRating}/5</span>
                <span>{carrier.totalTrips} viajes</span>
                <span>{carrier.onTimeRate}% a tiempo</span>
              </div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-ink-400">Unidad: </span><span className="font-medium text-ink-800">{vehicle.brand} {vehicle.model} {vehicle.year}</span></div>
            <div><span className="text-ink-400">Placas: </span><span className="font-mono font-medium text-ink-800">{vehicle.plates}</span></div>
            <div><span className="text-ink-400">Capacidad: </span><span className="font-medium text-ink-800">{formatWeight(vehicle.capacityKg)}</span></div>
            <div><span className="text-ink-400">Seguro: </span><span className="font-medium text-trust-green">Vigente</span></div>
          </div>
        </CardContent>
      </Card>
      <div className="bg-ink-50 border border-ink-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Lock className="w-4 h-4 text-ink-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-ink-800">Contacto protegido hasta confirmar escrow</p>
          <p className="text-xs text-ink-500 mt-0.5">El teléfono y WhatsApp del transportista se desbloquean cuando confirmes y los fondos estén en custodia.</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="flex-1 gap-2">
          <Link href={`/app/embarcador/pago/${match.id}`}><Shield className="w-4 h-4" />Aceptar y depositar en custodia</Link>
        </Button>
        <Button variant="outline" size="lg">Rechazar</Button>
      </div>
    </div>
  );
}
