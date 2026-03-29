import Link from "next/link";
import { Shield, TruckIcon, AlertCircle, CheckCircle2, Clock, Users, Package, ArrowRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { TrustBadge } from "@/components/shared/trust-badge";
import { RouteDisplay } from "@/components/shared/route-display";
import { seedUsers, seedCarrierProfiles, seedShipments } from "@/lib/seed-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const pendingVerifications = [
  { id: "pv-1", name: "Luis Mendoza Ortega", company: "Fletes Mendoza S.A.", type: "transportista", submitted: "2025-02-08", docs: 5, docsOk: 4 },
  { id: "pv-2", name: "Fernanda López", company: "Operadora FLR", type: "transportista", submitted: "2025-02-09", docs: 5, docsOk: 5 },
  { id: "pv-3", name: "Importaciones Garza S.A.", company: "Importaciones Garza S.A.", type: "embarcador", submitted: "2025-02-09", docs: 3, docsOk: 3 },
];

const flaggedShipments = [
  { id: "fs-1", route: { originCity: "Tijuana", originState: "BC", destinationCity: "CDMX", destinationState: "CDMX" }, reason: "Valor declarado inusualmente alto ($4.2M MXN)", risk: "high" },
  { id: "fs-2", route: { originCity: "Culiacán", originState: "Sinaloa", destinationCity: "Monterrey", destinationState: "NL" }, reason: "Primer envío, transportista con 0 viajes anteriores", risk: "medium" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-ink-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">Z</span></div>
          <span className="font-semibold">ZzingRush Admin</span>
          <Badge className="bg-ink-700 text-ink-200 text-xs border-0">Operaciones internas</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-300">
          <div className="w-2 h-2 rounded-full bg-trust-green" />
          Admin ZzingRush
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Panel de operaciones</h1>
          <p className="text-sm text-ink-500">Verificaciones pendientes, envíos en riesgo y disputas activas.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Verificaciones pendientes" value="3" subtitle="2 transportistas, 1 embarcador" icon={Clock} />
          <StatCard title="Envíos activos" value={String(seedShipments.filter(s => s.status === "in_transit").length)} subtitle="En tránsito ahora" icon={TruckIcon} accent />
          <StatCard title="Disputas abiertas" value="0" subtitle="Sin disputas activas" icon={AlertCircle} />
          <StatCard title="Usuarios registrados" value={String(seedUsers.length)} subtitle="Total en plataforma" icon={Users} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-accent-500" />Verificaciones pendientes</CardTitle>
              <Badge variant="warning">{pendingVerifications.length}</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {pendingVerifications.map((v) => (
                  <div key={v.id} className="px-6 py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-xs font-bold text-ink-600 flex-shrink-0">
                        {v.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-800">{v.name}</p>
                        <p className="text-xs text-ink-400">{v.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={v.type === "transportista" ? "default" : "secondary"} className="text-xs">{v.type}</Badge>
                          <span className="text-xs text-ink-400">{v.docsOk}/{v.docs} docs OK</span>
                          <span className="text-xs text-ink-400">· {v.submitted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" className="text-xs text-trust-red border-red-200 hover:bg-red-50">Rechazar</Button>
                      <Button size="sm" className="text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3" />Aprobar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Flag className="w-4 h-4 text-trust-amber" />Envíos en revisión</CardTitle>
              <Badge variant="warning">{flaggedShipments.length}</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-100">
                {flaggedShipments.map((fs) => (
                  <div key={fs.id} className="px-6 py-4">
                    <RouteDisplay originCity={fs.route.originCity} originState={fs.route.originState} destinationCity={fs.route.destinationCity} destinationState={fs.route.destinationState} size="sm" className="mb-2" />
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${fs.risk === "high" ? "text-trust-red" : "text-trust-amber"}`} />
                      <p className="text-xs text-ink-500">{fs.reason}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs">Ver detalle</Button>
                      <Button size="sm" variant="outline" className="text-xs text-trust-red border-red-200">Suspender</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
