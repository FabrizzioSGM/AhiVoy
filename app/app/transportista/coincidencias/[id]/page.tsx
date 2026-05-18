import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Calendar, Weight, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteDisplay } from "@/components/shared/route-display";
import { createClient } from "@/lib/supabase/server";
import { getMatchById } from "@/lib/supabase/queries";
import { formatCurrency, formatWeight, formatDate } from "@/lib/utils";
import { CarrierMatchActions } from "./actions";
import { MatchChat } from "@/components/shared/match-chat";

const statusLabel: Record<string, string> = {
  suggested: "Nueva", viewed: "Vista", negotiating: "En negociación",
  accepted: "Aceptada", rejected: "Rechazada", expired: "Expirada",
};
const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "secondary"> = {
  suggested: "warning", viewed: "default", negotiating: "default",
  accepted: "success", rejected: "danger", expired: "secondary",
};

export default async function TransportistaMatchDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const match = await getMatchById(supabase, params.id);

  if (!match) notFound();

  const shipment = match.shipment_requests as unknown as Record<string, unknown> | null;
  const route    = match.return_routes    as unknown as Record<string, unknown> | null;
  const isActive = !["accepted", "rejected", "expired"].includes(match.status);

  // Calcular tiempo restante hasta expiración
  const expiresAt  = new Date(match.expires_at);
  const hoursLeft  = Math.max(0, Math.round((expiresAt.getTime() - Date.now()) / 3_600_000));

  return (
    <div className="max-w-3xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href="/app/transportista"><ArrowLeft className="w-4 h-4" />Volver al dashboard</Link>
      </Button>

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-ink-900">Carga disponible</h1>
            <Badge variant={statusVariant[match.status] ?? "secondary"}>
              {statusLabel[match.status] ?? match.status}
            </Badge>
          </div>
          <p className="text-sm text-ink-500">Hay un envío compatible con tu ruta de retorno.</p>
        </div>
        <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3 flex-shrink-0">
          <span className="text-2xl font-bold text-accent-700">{Number(match.match_score).toFixed(0)}</span>
          <span className="text-xs text-accent-600 font-medium leading-tight">pts de<br />100</span>
        </div>
      </div>

      {/* Métricas de ganancia */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-trust-greenLight border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-700 mb-1">Tu ganancia neta</p>
          <p className="text-lg font-bold text-trust-green">{formatCurrency(match.carrier_earnings)}</p>
          <p className="text-xs text-green-600">después de comisión</p>
        </div>
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-center">
          <p className="text-xs text-ink-400 mb-1">Precio total</p>
          <p className="text-lg font-bold text-ink-900">{formatCurrency(match.estimated_price)}</p>
          <p className="text-xs text-ink-400">flete acordado</p>
        </div>
        <div className={`rounded-xl p-4 text-center border ${hoursLeft <= 6 ? "bg-red-50 border-red-200" : "bg-surface-50 border-surface-200"}`}>
          <p className={`text-xs mb-1 ${hoursLeft <= 6 ? "text-red-600" : "text-ink-400"}`}>Tiempo restante</p>
          <p className={`text-lg font-bold ${hoursLeft <= 6 ? "text-red-700" : "text-ink-900"}`}>{hoursLeft}h</p>
          <p className={`text-xs ${hoursLeft <= 6 ? "text-red-500" : "text-ink-400"}`}>para responder</p>
        </div>
      </div>

      {/* Detalle del envío que necesita transporte */}
      {shipment && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />Envío a transportar
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
              <div className="flex items-center gap-1.5 text-ink-600">
                <Weight className="w-3.5 h-3.5 text-ink-400" />
                {formatWeight(Number(shipment.weight_kg ?? 0))}
              </div>
              <div className="flex items-center gap-1.5 text-ink-600">
                <Package className="w-3.5 h-3.5 text-ink-400" />
                {String(shipment.cargo_type ?? "")}
              </div>
              <div className="flex items-center gap-1.5 text-ink-600">
                <Calendar className="w-3.5 h-3.5 text-ink-400" />
                {formatDate(String(shipment.required_date ?? ""))}
              </div>
              <div className="flex items-center gap-1.5 text-ink-600">
                <DollarSign className="w-3.5 h-3.5 text-ink-400" />
                Valor: {formatCurrency(Number(shipment.declared_value ?? 0))}
              </div>
            </div>
            {shipment.cargo_description != null && (
              <p className="text-xs text-ink-500 bg-surface-50 rounded-lg p-3 leading-relaxed">
                {String(shipment.cargo_description)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tu ruta con la que coincide */}
      {route && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-ink-400 uppercase tracking-wide font-medium">
              Tu ruta de retorno compatible
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
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ink-400" />
                {formatDate(String(route.departure_date_from ?? ""))}
                {route.departure_date_to !== route.departure_date_from
                  ? ` – ${formatDate(String(route.departure_date_to ?? ""))}`
                  : ""}
              </span>
              <span>Capacidad: {formatWeight(Number(route.available_capacity_kg ?? 0))}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cómo funciona el pago */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-accent-800 mb-2">¿Cómo recibes el pago?</p>
        <ol className="text-xs text-accent-700 space-y-1.5">
          <li>1. Confirmas disponibilidad → el embarcador deposita en custodia</li>
          <li>2. Recoges la carga y la entregas en destino</li>
          <li>3. El embarcador confirma entrega → ZzingRush libera tu pago</li>
        </ol>
      </div>

      <MatchChat matchId={params.id} currentUserId={user?.id ?? ""} />

      {isActive
        ? <CarrierMatchActions matchId={params.id} />
        : (
          <div className="text-center py-4 bg-surface-50 rounded-xl border border-surface-200">
            <p className="text-sm text-ink-500">
              Esta coincidencia está en estado <strong>{statusLabel[match.status] ?? match.status}</strong> y no puede modificarse.
            </p>
          </div>
        )
      }
    </div>
  );
}
