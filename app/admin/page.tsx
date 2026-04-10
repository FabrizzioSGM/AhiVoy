import { Shield, TruckIcon, AlertCircle, CheckCircle2, Clock, Users, Package, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { RouteDisplay } from "@/components/shared/route-display";
import { getAdminStats, getPendingVerifications, getRecentShipments, getOpenClaims } from "@/lib/supabase/admin-queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { VerificationActions } from "./verification-actions";

const verifStatusVariant: Record<string, "default" | "warning" | "success" | "danger" | "secondary"> = {
  pending: "warning", in_review: "default", approved: "success", rejected: "danger", needs_action: "warning",
};
const verifStatusLabel: Record<string, string> = {
  pending: "Pendiente", in_review: "En revisión", approved: "Aprobado", rejected: "Rechazado", needs_action: "Acción requerida",
};
const shipmentStatusLabel: Record<string, string> = {
  draft: "Borrador", published: "Publicado", matching: "Buscando", matched: "Con match",
  confirmed: "Confirmado", escrow_funded: "En custodia", in_transit: "En tránsito",
  delivered: "Entregado", completed: "Completado", cancelled: "Cancelado", disputed: "En disputa",
};

export default async function AdminPage() {
  const [stats, pendingVerifs, recentShipments, openClaims] = await Promise.all([
    getAdminStats(),
    getPendingVerifications(),
    getRecentShipments(8),
    getOpenClaims(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Panel de operaciones</h1>
        <p className="text-sm text-ink-500">Verificaciones, envíos activos y disputas en tiempo real.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Usuarios" value={String(stats.totalUsers)} subtitle="registrados" icon={Users} />
        <StatCard title="Verificaciones" value={String(stats.pendingVerifications)} subtitle="pendientes" icon={Clock} accent />
        <StatCard title="En tránsito" value={String(stats.activeShipments)} subtitle="envíos activos" icon={TruckIcon} />
        <StatCard title="Disputas" value={String(stats.openClaims)} subtitle="abiertas" icon={AlertCircle} />
        <StatCard title="Matches" value={String(stats.totalMatches)} subtitle="generados" icon={Zap} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Verificaciones pendientes */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-500" />Verificaciones pendientes
            </CardTitle>
            {stats.pendingVerifications > 0 && (
              <Badge variant="warning">{stats.pendingVerifications}</Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {pendingVerifs.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="w-8 h-8 text-trust-green mx-auto mb-3" />
                <p className="text-sm text-ink-500">Sin verificaciones pendientes.</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-100">
                {pendingVerifs.map((carrier) => {
                  const profile = carrier.profiles as unknown as Record<string, unknown> | null;
                  const name = String(profile?.name ?? "Sin nombre");
                  const email = String(profile?.email ?? "");
                  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={carrier.id} className="px-6 py-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center text-xs font-bold text-ink-600 flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink-900">{name}</p>
                          <p className="text-xs text-ink-400 truncate">{email}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant={verifStatusVariant[carrier.verification_status] ?? "secondary"} className="text-xs">
                              {verifStatusLabel[carrier.verification_status] ?? carrier.verification_status}
                            </Badge>
                            <span className="text-xs text-ink-400 capitalize">{carrier.operator_type}</span>
                            <span className="text-xs text-ink-400">· {formatDate(carrier.created_at)}</span>
                          </div>
                          {carrier.operating_states?.length > 0 && (
                            <p className="text-xs text-ink-400 mt-1">
                              Estados: {carrier.operating_states.slice(0, 3).join(", ")}
                              {carrier.operating_states.length > 3 ? ` +${carrier.operating_states.length - 3}` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <VerificationActions carrierId={carrier.id} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disputas abiertas */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-trust-amber" />Disputas abiertas
            </CardTitle>
            {stats.openClaims > 0 && <Badge variant="danger">{stats.openClaims}</Badge>}
          </CardHeader>
          <CardContent className="p-0">
            {openClaims.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="w-8 h-8 text-trust-green mx-auto mb-3" />
                <p className="text-sm text-ink-500">Sin disputas activas.</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-100">
                {openClaims.map((claim) => (
                  <div key={claim.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="danger" className="text-xs">Abierta</Badge>
                          <span className="text-xs text-ink-400 capitalize">{claim.claimant_role}</span>
                        </div>
                        <p className="text-sm font-medium text-ink-800">{claim.reason}</p>
                        <p className="text-xs text-ink-500 mt-1 leading-relaxed line-clamp-2">{claim.description}</p>
                        <p className="text-xs text-ink-300 mt-1">{formatDate(claim.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Envíos recientes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-ink-500" />Envíos recientes en la plataforma
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentShipments.length === 0 ? (
            <p className="px-6 py-10 text-sm text-ink-400 text-center">Sin envíos registrados.</p>
          ) : (
            <div className="divide-y divide-surface-100">
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <RouteDisplay
                      originCity={shipment.origin_city}
                      originState={shipment.origin_state}
                      destinationCity={shipment.destination_city}
                      destinationState={shipment.destination_state}
                      size="sm"
                    />
                    <div className="flex items-center gap-3 text-xs text-ink-400 mt-1">
                      <span>{shipment.cargo_type}</span>
                      <span>·</span>
                      <span>{Number(shipment.weight_kg).toLocaleString("es-MX")} kg</span>
                      <span>·</span>
                      <span>{formatCurrency(Number(shipment.declared_value))}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-ink-400">{formatDate(shipment.created_at)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {shipmentStatusLabel[shipment.status] ?? shipment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
