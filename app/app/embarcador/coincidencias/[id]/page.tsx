import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, Star, Package, Truck, Calendar, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteDisplay } from "@/components/shared/route-display";
import { createClient } from "@/lib/supabase/server";
import { getMatchById } from "@/lib/supabase/queries";
import { formatCurrency, formatWeight, formatDate } from "@/lib/utils";
import { MatchActions } from "./actions";
import { MatchChat } from "@/components/shared/match-chat";

const tierLabel: Record<string, string> = {
  nuevo: "Nuevo", verificado: "Verificado", confiable: "Confiable", elite: "Élite",
};
const tierVariant: Record<string, "default" | "success" | "warning" | "elite" | "secondary"> = {
  nuevo: "secondary", verificado: "default", confiable: "success", elite: "elite",
};

export default async function EmbarcadorMatchDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const match = await getMatchById(supabase, params.id);

  if (!match) notFound();

  const shipment = match.shipment_requests as unknown as Record<string, unknown> | null;
  const route    = match.return_routes    as unknown as Record<string, unknown> | null;
  const carrier  = match.carrier_profile;

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href="/app/embarcador"><ArrowLeft className="w-4 h-4" />Volver al dashboard</Link>
      </Button>

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Coincidencia encontrada</h1>
          <p className="text-sm text-ink-500">Revisa los datos y decide si aceptas la propuesta.</p>
        </div>
        <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3 flex-shrink-0">
          <span className="text-2xl font-bold text-accent-700">{Number(match.match_score).toFixed(0)}</span>
          <span className="text-xs text-accent-600 font-medium leading-tight">pts de<br />100</span>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-center">
          <p className="text-xs text-ink-400 mb-1">Precio estimado</p>
          <p className="text-lg font-bold text-ink-900">{formatCurrency(match.estimated_price)}</p>
          <p className="text-xs text-ink-400">MXN</p>
        </div>
        <div className="bg-trust-greenLight border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-700 mb-1">Tu ahorro</p>
          <p className="text-lg font-bold text-trust-green">{formatCurrency(match.shipper_savings)}</p>
          <p className="text-xs text-green-600">vs flete dedicado</p>
        </div>
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-center">
          <p className="text-xs text-ink-400 mb-1">Expira en</p>
          <p className="text-lg font-bold text-ink-900">48h</p>
          <p className="text-xs text-ink-400">si no respondes</p>
        </div>
      </div>

      {/* Tu envío */}
      {shipment && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />Tu envío
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RouteDisplay
              originCity={String(shipment.origin_city ?? "")}
              originState={String(shipment.origin_state ?? "")}
              destinationCity={String(shipment.destination_city ?? "")}
              destinationState={String(shipment.destination_state ?? "")}
              size="md"
              className="mb-3"
            />
            <div className="flex flex-wrap gap-4 text-sm text-ink-600">
              <span className="flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-ink-400" />{formatWeight(Number(shipment.weight_kg ?? 0))}</span>
              <span>{String(shipment.cargo_type ?? "")}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-ink-400" />{formatDate(String(shipment.required_date ?? ""))}</span>
              <span className="font-medium text-ink-800">Valor: {formatCurrency(Number(shipment.declared_value ?? 0))}</span>
            </div>
            {shipment.cargo_description != null && (
              <p className="text-xs text-ink-400 mt-2 leading-relaxed">{String(shipment.cargo_description)}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ruta del transportista */}
      {route && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" />Ruta de retorno disponible
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RouteDisplay
              originCity={String(route.origin_city ?? "")}
              originState={String(route.origin_state ?? "")}
              destinationCity={String(route.destination_city ?? "")}
              destinationState={String(route.destination_state ?? "")}
              size="md"
              className="mb-3"
            />
            <div className="flex flex-wrap gap-4 text-sm text-ink-600">
              <span>Salida: {formatDate(String(route.departure_date_from ?? ""))}
                {route.departure_date_to !== route.departure_date_from
                  ? ` – ${formatDate(String(route.departure_date_to ?? ""))}`
                  : ""}
              </span>
              <span>Capacidad: {formatWeight(Number(route.available_capacity_kg ?? 0))}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Perfil del transportista */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium">
              Perfil del transportista
            </CardTitle>
            {carrier && (
              <Badge variant={tierVariant[carrier.reputation_tier] ?? "secondary"}>
                {tierLabel[carrier.reputation_tier] ?? carrier.reputation_tier}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-ink-100 flex items-center justify-center text-ink-700 font-bold text-lg flex-shrink-0">
              {match.carrier_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink-900 mb-1">{match.carrier_name}</p>
              {carrier && (
                <div className="flex flex-wrap gap-4 text-sm text-ink-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    {Number(carrier.avg_rating).toFixed(1)}/5
                  </span>
                  <span>{carrier.total_trips} viajes</span>
                  <span>{carrier.on_time_rate}% a tiempo</span>
                  <span>{carrier.claim_rate}% incidencias</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso contacto protegido */}
      <div className="bg-ink-50 border border-ink-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Lock className="w-4 h-4 text-ink-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-ink-800">Contacto protegido hasta confirmar escrow</p>
          <p className="text-xs text-ink-500 mt-0.5">
            El teléfono y WhatsApp del transportista se revelan automáticamente cuando aceptes y los fondos estén en custodia.
          </p>
        </div>
      </div>

      <MatchChat matchId={params.id} currentUserId={user?.id ?? ""} />

      <MatchActions matchId={params.id} />
    </div>
  );
}
