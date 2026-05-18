import Link from "next/link";
import { Plus, Package, TruckIcon, CheckCircle2, ArrowRight, MapPin, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { RouteDisplay } from "@/components/shared/route-display";
import { createClient } from "@/lib/supabase/server";
import { getShipmentsByShipper, getMatchesByShipper, getNotifications } from "@/lib/supabase/queries";
import { formatCurrency, formatDate, formatWeight, getShipmentStatusLabel } from "@/lib/utils";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "secondary"> = {
  draft: "secondary", published: "default", matching: "default", matched: "warning",
  confirmed: "default", escrow_funded: "success", in_transit: "default",
  delivered: "success", completed: "success", cancelled: "danger", disputed: "danger",
};

export default async function EmbarcadorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [shipments, matches, notifications] = await Promise.all([
    user ? getShipmentsByShipper(supabase, user.id) : [],
    user ? getMatchesByShipper(supabase, user.id) : [],
    user ? getNotifications(supabase, user.id) : [],
  ]);

  const activeShipments = shipments.filter(s => !["completed", "cancelled"].includes(s.status));
  const inTransit = shipments.filter(s => s.status === "in_transit");
  const profile = user ? await supabase.from("profiles").select("name").eq("id", user.id).single() : null;
  const firstName = profile?.data?.name?.split(" ")[0] ?? "allí";

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Bienvenido, ${firstName}. Aquí tienes un resumen de tu operación.`}
      >
        <Button asChild>
          <Link href="/app/embarcador/envios/nuevo"><Plus className="w-4 h-4" /> Nuevo envío</Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Envíos activos" value={String(activeShipments.length)} subtitle={`${inTransit.length} en tránsito`} icon={Package} />
        <StatCard title="En tránsito" value={String(inTransit.length)} subtitle={inTransit[0] ? `${inTransit[0].origin_city} → ${inTransit[0].destination_city}` : "Ninguno activo"} icon={TruckIcon} accent />
        <StatCard title="Total envíos" value={String(shipments.length)} subtitle="en tu cuenta" icon={CheckCircle2} />
        <StatCard title="Coincidencias" value={String(matches.length)} subtitle="pendientes de revisar" icon={Banknote} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Envíos recientes</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-accent-600">
                <Link href="/app/embarcador/envios">Ver todos <ArrowRight className="w-3 h-3" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {shipments.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Package className="w-8 h-8 text-ink-200 mx-auto mb-3" />
                  <p className="text-sm text-ink-400">Aún no tienes envíos.</p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/app/embarcador/envios/nuevo">Crear tu primer envío</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
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
                          <span>{formatDate(shipment.required_date)}</span>
                          {shipment.estimated_price && (
                            <><span>·</span><span className="text-ink-600 font-medium">{formatCurrency(shipment.estimated_price)}</span></>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant={statusVariant[shipment.status] ?? "secondary"}>
                          {getShipmentStatusLabel(shipment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Coincidencias pendientes</CardTitle>
              {matches.length > 0 && <Badge variant="warning">{matches.length} nueva{matches.length !== 1 ? "s" : ""}</Badge>}
            </CardHeader>
            <CardContent className="p-0">
              {matches.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-ink-400">No hay coincidencias pendientes.</p>
                  <p className="text-xs text-ink-300 mt-1">Cuando publiques un envío, ZzingRush buscará rutas compatibles.</p>
                </div>
              ) : (
                matches.map((match) => {
                  const shipment = match.shipment_requests as unknown as Record<string, unknown> | null;
                  return (
                    <div key={match.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 border-b border-surface-100 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-accent-700">{match.match_score}%</span>
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
                          <span>Desvío: {match.detour_km} km</span>
                          <span>·</span>
                          <span className="text-trust-green font-medium">Ahorro: {formatCurrency(match.shipper_savings)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-ink-800">{formatCurrency(match.estimated_price)}</span>
                        <Button asChild size="sm">
                          <Link href={`/app/embarcador/coincidencias/${match.id}`}>Ver detalle</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })
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
                <Link href="/app/embarcador/envios/nuevo"><Plus className="w-4 h-4 text-accent-500" />Crear nuevo envío</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3">
                <Link href="/app/embarcador/seguimiento"><MapPin className="w-4 h-4 text-accent-500" />Ver seguimiento activo</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3">
                <Link href="/app/verificacion"><CheckCircle2 className="w-4 h-4 text-trust-green" />Estado de verificación</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
