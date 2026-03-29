import Link from "next/link";
import { Star, TruckIcon, CheckCircle2, AlertCircle, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { seedRatings, seedCarrierProfiles } from "@/lib/seed-data";

export default function ReputacionPage() {
  const carrier = seedCarrierProfiles[0];

  const metrics = [
    { label: "Viajes completados", value: carrier.totalTrips, max: 200, icon: TruckIcon, color: "bg-accent-500" },
    { label: "Entregas a tiempo", value: carrier.onTimeRate, max: 100, icon: Clock, unit: "%", color: "bg-trust-green" },
    { label: "Calidad documental", value: 97, max: 100, icon: CheckCircle2, unit: "%", color: "bg-accent-500" },
    { label: "Tasa de incidencias", value: carrier.claimRate, max: 5, icon: AlertCircle, unit: "%", color: "bg-trust-amber", invert: true },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Reputación y calificaciones" description="Tu historial de operaciones y calificaciones de embarcadores." />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Award className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold text-amber-800">{carrier.avgRating}</span>
            <span className="text-amber-600 text-lg">/5</span>
            <Badge variant="elite">Élite</Badge>
          </div>
          <div className="flex items-center gap-1 mb-1">
            {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(carrier.avgRating) ? "text-amber-500 fill-amber-500" : "text-ink-200"}`} />)}
          </div>
          <p className="text-sm text-amber-700">Basado en {seedRatings.length} calificación{seedRatings.length !== 1 ? "es" : ""}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {metrics.map(({ label, value, max, icon: Icon, unit, color, invert }) => (
          <Card key={label}><CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-ink-500" />
              </div>
              <p className="text-sm font-medium text-ink-700">{label}</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-ink-900">{value}</span>
              {unit && <span className="text-ink-400 text-sm">{unit}</span>}
            </div>
            <Progress value={invert ? Math.max(0, 100 - (value / max * 100)) : (value / max * 100)} className="h-1.5" />
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Calificaciones recientes</CardTitle></CardHeader>
        <CardContent className="p-0">
          {seedRatings.map((rating) => (
            <div key={rating.id} className="px-6 py-5 border-b border-surface-100 last:border-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-ink-700 text-xs font-bold">RH</div>
                  <div>
                    <p className="text-sm font-medium text-ink-800">Ricardo Hernández</p>
                    <p className="text-xs text-ink-400">Grupo BIMSA · {new Date(rating.createdAt).toLocaleDateString("es-MX")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= rating.overall ? "text-amber-500 fill-amber-500" : "text-ink-200"}`} />)}
                  <span className="text-sm font-semibold text-ink-800 ml-1">{rating.overall}/5</span>
                </div>
              </div>
              {rating.comment && <p className="text-sm text-ink-600 leading-relaxed ml-11">{rating.comment}</p>}
              <div className="flex gap-4 mt-2 ml-11 text-xs text-ink-400">
                <span>Puntualidad: {rating.punctuality}/5</span>
                <span>Comunicación: {rating.communication}/5</span>
                <span>Documentación: {rating.documentation}/5</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
