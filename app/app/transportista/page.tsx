import Link from "next/link";
import { Plus, Route, Package, DollarSign, Star, ArrowRight, TruckIcon, MapPin, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { RouteDisplay } from "@/components/shared/route-display";
import { createClient } from "@/lib/supabase/server";
import {
  getCarrierProfileByUserId,
  getRoutesByCarrierId,
  getPublishedShipments,
  getMatchesByCarrier,
  getNotifications,
} from "@/lib/supabase/queries";
import { formatCurrency, formatDate, formatWeight } from "@/lib/utils";

const routeStatusVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  published: "default", matched: "warning", in_transit: "success", completed: "success", draft: "secondary", cancelled: "secondary",
};
const routeStatusLabel: Record<string, string> = {
  published: "Publicada", matched: "Coincidencia", in_transit: "En tránsito", completed: "Completada", draft: "Borrador", cancelled: "Cancelada",
};

export default async function TransportistaDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const carrierProfile = user ? await getCarrierProfileByUserId(supabase, user.id) : null;

  const [routes, carrierMatches, availableShipments, notifications] = await Promise.all([
    carrierProfile ? getRoutesByCarrierId(supabase, carrierProfile.id) : Promise.resolve([]),
    carrierProfile ? getMatchesByCarrier(supabase, carrierProfile.id) : Promise.resolve([]),
    getPublishedShipments(supabase),
    user ? getNotifications(supabase, user.id) : Promise.resolve([]),
  ]);

  const profile = user ? await supabase.from("profiles").select("name").eq("id", user.id).single() : null;
  const firstName = profile?.data?.name?.split(" ")[0] ?? "allí";
  const activeRoutes = routes.filter(r => !["completed", "cancelled"].includes(r.status));

  return (
    <div>
      {carrierProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {carrierProfile.reputation_tier === "nuevo" ? "Perfil en revisión" : `Nivel ${carrierProfile.reputation_tier}`}
              {" — "}{carrierProfile.avg_rating}/5 · {carrierProfile.total_trips} viajes completados
            </p>
            <p className="text-xs text-amber-600">
              {carrierProfile.on_time_rate}% a tiempo · Tasa de incidencias: {carrierProfile.claim_rate}%
            </p>
          </div>
        </div>
      )}

      <PageHeader
        title="Dashboard"
        description={`Bienvenido, ${firstName}. Aquí está tu operación y las cargas disponibles.`}
      >
        <Button asChild>
          <Link href="/app/transportista/rutas/nueva"><Plus className="w-4 h-4" />Nueva ruta</Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Rutas activas" value={String(activeRoutes.length)} subtitle={`${routes.length} en total`} icon={Route} />
        <StatCard title="Coincidencias" value={String(carrierMatches.length)} subtitle="con tus rutas de retorno" icon={Zap} accent />
        <StatCard title="Ganancia total" value={formatCurrency(0)} subtitle="Pagos completados" icon={DollarSign} />
        <StatCard title="Calificación" value={carrierProfile ? `${carrierProfile.avg_rating} / 5` : "—"} subtitle={carrierProfile ? `${carrierProfile.total_trips} viajes` : "Sin viajes aún"} icon={Star} />
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
              {routes.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <TruckIcon className="w-8 h-8 text-ink-200 mx-auto mb-3" />
                  <p className="text-sm text-ink-400">Aún no tienes rutas publicadas.</p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/app/transportista/rutas/nueva">Publicar tu primera ruta</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50">
                      <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                        <TruckIcon className="w-4 h-4 text-ink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <RouteDisplay
                          originCity={route.origin_city}
                          originState={route.origin_state}
                          destinationCity={route.destination_city}
                          destinationState={route.destination_state}
                          size="sm"
                        />
                        <div className="flex items-center gap-3 text-xs text-ink-400 mt-1">
                          <span>{formatWeight(route.available_capacity_kg)} disponibles</span>
                          <span>·</span>
                          <span>{formatDate(route.departure_date_from)}</span>
                          {route.potential_earnings && (
                            <><span>·</span><span className="text-trust-green font-medium">{formatCurrency(route.potential_earnings)}</span></>
                          )}
                        </div>
                      </div>
                      <Badge variant={routeStatusVariant[route.status] ?? "secondary"}>
                        {routeStatusLabel[route.status] ?? route.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coincidencias personalizadas (matching automático) */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Coincidencias con tus rutas</CardTitle>
              {carrierMatches.length > 0 && <Badge variant="warning">{carrierMatches.length} nueva{carrierMatches.length !== 1 ? "s" : ""}</Badge>}
            </CardHeader>
            <CardContent className="p-0">
              {carrierMatches.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Zap className="w-8 h-8 text-ink-200 mx-auto mb-3" />
                  <p className="text-sm text-ink-400">Sin coincidencias aún.</p>
                  <p className="text-xs text-ink-300 mt-1">Cuando publiques una ruta, ZzingRush buscará cargas compatibles automáticamente.</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {carrierMatches.map((match) => {
                    const shipment = match.shipment_requests as Record<string, unknown> | null;
                    return (
                      <div key={match.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50">
                        <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 flex-col">
                          <span className="text-xs font-bold text-accent-700 leading-none">{match.match_score}</span>
                          <span className="text-[9px] text-accent-500 leading-none">pts</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {shipment && (
                            <RouteDisplay
                              originCity={String(shipment.origin_city ?? "")}
                              originState={String(shipment.origin_state ?? "")}
                              destinationCity={String(shipment.destination_city ?? "")}
                              destinationState={String(shipment.destination_state ?? "")}
                              size="sm"
                            />
                          )}
                          <div className="flex items-center gap-3 text-xs text-ink-400 mt-1">
                            {shipment && <span>{formatWeight(Number(shipment.weight_kg ?? 0))}</span>}
                            {shipment && <><span>·</span><span>{String(shipment.cargo_type ?? "")}</span></>}
                            {shipment && <><span>·</span><span>{formatDate(String(shipment.required_date ?? ""))}</span></>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-trust-green">{formatCurrency(match.carrier_earnings)}</p>
                          <p className="text-xs text-ink-400">ganancia neta</p>
                          <Button asChild size="sm" className="mt-1">
                            <Link href={`/app/transportista/coincidencias/${match.id}`}>Ver</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feed general de cargas publicadas */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Todas las cargas disponibles</CardTitle>
              {availableShipments.length > 0 && (
                <Badge variant="default" className="text-xs">{availableShipments.length} publicadas</Badge>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {availableShipments.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-ink-400">No hay cargas disponibles en este momento.</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {availableShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50">
                      <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-ink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <RouteDisplay
                          originCity={shipment.origin_city}
                          originState={shipment.origin_state}
                          destinationCity={shipment.destination_city}
                          destinationState={shipment.destination_state}
                          size="sm"
                        />
                        <div className="flex items-center gap-3 text-xs text-ink-400 mt-1">
                          <span>{formatWeight(shipment.weight_kg)}</span>
                          <span>·</span>
                          <span>{shipment.cargo_type}</span>
                          <span>·</span>
                          <span>{formatDate(shipment.required_date)}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-ink-800">{formatCurrency(shipment.estimated_price ?? 0)}</p>
                        <p className="text-xs text-trust-green">~{formatCurrency(Math.round((shipment.estimated_price ?? 0) * 0.9))} neto</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Actividad reciente</CardTitle></CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <p className="px-6 py-6 text-sm text-ink-400 text-center">Sin actividad reciente.</p>
              ) : (
                <div className="divide-y divide-surface-100">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`px-6 py-4 ${!notif.read ? "bg-accent-50" : ""}`}>
                      <div className="flex items-start gap-2">
                        {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0 mt-1.5" />}
                        <div>
                          <p className="text-sm font-medium text-ink-800">{notif.title}</p>
                          <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{notif.body}</p>
                          {notif.link && (
                            <Link href={notif.link} className="text-xs text-accent-600 hover:underline mt-1 inline-block">Ver →</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
