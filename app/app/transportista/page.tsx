import Link from "next/link";
import { Plus, Route, Package, DollarSign, Star, ArrowRight, TruckIcon, MapPin, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { RouteDisplay } from "@/components/shared/route-display";
import { TrustBadge } from "@/components/shared/trust-badge";
import { seedRoutes, seedShipments, seedNotifications, seedCarrierProfiles } from "@/lib/seed-data";
import { formatCurrency, formatDate, formatWeight } from "@/lib/utils";

const routeStatusVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  published: "default", matched: "warning", in_transit: "success", completed: "success", draft: "secondary", cancelled: "secondary",
};
const routeStatusLabel: Record<string, string> = {
  published: "Publicada", matched: "Coincidencia", in_transit: "En tránsito", completed: "Completada", draft: "Borrador", cancelled: "Cancelada",
};

export default function TransportistaDashboard() {
  const carrier = seedCarrierProfiles[0];
  const carrierNotifications = seedNotifications.filter(n => n.userId === "u-2");

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Star className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">Nivel Élite — {carrier.avgRating}/5 · {carrier.totalTrips} viajes completados</p>
          <p className="text-xs text-amber-600">{carrier.onTimeRate}% a tiempo · Tasa de incidencias: {carrier.claimRate}%</p>
        </div>
        <TrustBadge status="approved" label="Verificado · Élite" size="md" />
      </div>

      <PageHeader title="Dashboard" description="Bienvenido, Carlos. Aquí está tu operación y las cargas disponibles.">
        <Button asChild><Link href="/app/transportista/rutas/nueva"><Plus className="w-4 h-4" />Nueva ruta</Link></Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Rutas activas" value="2" subtitle="1 publicada, 1 con coincidencia" icon={Route} />
        <StatCard title="Cargas disponibles" value="5" subtitle="Compatibles con tus rutas" icon={Package} accent />
        <StatCard title="Ganancia este mes" value={formatCurrency(28125)} subtitle="vs $21,400 el mes pasado" icon={DollarSign} trend={{ value: 31, positive: true }} />
        <StatCard title="Calificación" value="4.8 / 5" subtitle="Basado en 142 viajes" icon={Star} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Mis rutas de retorno</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-accent-600">
                <Link href="/app/transportista/rutas">Ver todas <ArrowRight className="w-3 h-3" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {seedRoutes.map((route) => (
                  <div key={route.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50">
                    <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                      <TruckIcon className="w-4 h-4 text-ink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <RouteDisplay originCity={route.originCity} originState={route.originState} destinationCity={route.destinationCity} destinationState={route.destinationState} size="sm" />
                      <div className="flex items-center gap-3 text-xs text-ink-400 mt-1">
                        <span>{formatWeight(route.availableCapacityKg)} disponibles</span>
                        <span>·</span>
                        <span>{formatDate(route.departureDateFrom)}</span>
                        {route.potentialEarnings && <><span>·</span><span className="text-trust-green font-medium">{formatCurrency(route.potentialEarnings)}</span></>}
                      </div>
                    </div>
                    <Badge variant={routeStatusVariant[route.status] ?? "secondary"}>{routeStatusLabel[route.status] ?? route.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Cargas disponibles para ti</CardTitle>
              <Badge variant="default" className="text-xs">5 compatibles</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {seedShipments.filter(s => s.status === "published" || s.status === "matching").map((shipment) => (
                  <div key={shipment.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50">
                    <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <RouteDisplay originCity={shipment.originCity} originState={shipment.originState} destinationCity={shipment.destinationCity} destinationState={shipment.destinationState} size="sm" />
                      <div className="flex items-center gap-3 text-xs text-ink-400 mt-1">
                        <span>{formatWeight(shipment.weightKg)}</span>
                        <span>·</span>
                        <span>{shipment.cargoType}</span>
                        <span>·</span>
                        <span>{formatDate(shipment.requiredDate)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-ink-800">{formatCurrency(shipment.estimatedPrice ?? 0)}</p>
                      <p className="text-xs text-trust-green">~{formatCurrency(Math.round((shipment.estimatedPrice ?? 0) * 0.9))} neto</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Actividad reciente</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {carrierNotifications.map((notif) => (
                  <div key={notif.id} className={`px-6 py-4 ${!notif.read ? "bg-accent-50" : ""}`}>
                    <div className="flex items-start gap-2">
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0 mt-1.5" />}
                      <div>
                        <p className="text-sm font-medium text-ink-800">{notif.title}</p>
                        <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{notif.body}</p>
                        {notif.link && <Link href={notif.link} className="text-xs text-accent-600 hover:underline mt-1 inline-block">Ver →</Link>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Acciones rápidas</CardTitle></CardHeader>
            <CardContent className="space-y-2 pb-4">
              <Button asChild variant="outline" className="w-full justify-start gap-3">
                <Link href="/app/transportista/rutas/nueva"><Plus className="w-4 h-4 text-accent-500" />Publicar ruta de retorno</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3">
                <Link href="/app/transportista/cobros"><DollarSign className="w-4 h-4 text-trust-green" />Ver mis cobros</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3">
                <Link href="/app/verificacion"><CheckCircle2 className="w-4 h-4 text-trust-green" />Mi verificación</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
