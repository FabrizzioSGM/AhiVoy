import Link from "next/link";
import { Shield, CheckCircle2, Clock, AlertCircle, FileText, TruckIcon, Building2, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrustBadge } from "@/components/shared/trust-badge";

const verificationItems = [
  { label: "Identidad personal (INE)", status: "approved", icon: User, note: "Verificado el 1 Nov 2024" },
  { label: "Correo electrónico", status: "approved", icon: CheckCircle2, note: "Confirmado" },
  { label: "Teléfono", status: "approved", icon: CheckCircle2, note: "Confirmado" },
  { label: "Empresa / RFC", status: "approved", icon: Building2, note: "Grupo BIMSA S.A. de C.V." },
  { label: "Situación fiscal SAT", status: "approved", icon: FileText, note: "Al corriente · Verificado" },
  { label: "Datos de facturación", status: "approved", icon: FileText, note: "RFC: GBI9901154S3" },
];

const tiers = [
  { name: "Nuevo", desc: "Cuenta recién creada, sin historial.", active: false },
  { name: "Verificado", desc: "Identidad y empresa aprobadas.", active: false },
  { name: "Confiable", desc: "10+ operaciones completadas, sin incidencias.", active: false },
  { name: "Élite", desc: "50+ operaciones, 4.7+ rating, < 1% incidencias.", active: true },
];

export default function VerificacionPage() {
  const approvedCount = verificationItems.filter(i => i.status === "approved").length;
  const totalCount = verificationItems.length;
  const progress = (approvedCount / totalCount) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Estado de verificación</h1>
        <p className="text-sm text-ink-500">Revisa el estado de tus documentos y nivel de reputación.</p>
      </div>

      <div className="bg-trust-greenLight border border-green-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-trust-green flex items-center justify-center flex-shrink-0">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-trust-green">Perfil completamente verificado</h2>
            <TrustBadge status="approved" label="Verificado" size="md" />
          </div>
          <p className="text-sm text-green-700">{approvedCount} de {totalCount} verificaciones completadas</p>
          <Progress value={progress} className="mt-2 h-1.5" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3"><CardTitle className="text-base">Checklist de verificación</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-100">
            {verificationItems.map(({ label, status, icon: Icon, note }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${status === "approved" ? "bg-trust-greenLight" : status === "pending" ? "bg-trust-amberLight" : "bg-surface-100"}`}>
                  <Icon className={`w-4 h-4 ${status === "approved" ? "text-trust-green" : status === "pending" ? "text-trust-amber" : "text-ink-400"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-800">{label}</p>
                  <p className="text-xs text-ink-400">{note}</p>
                </div>
                <TrustBadge status={status as any} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Niveles de reputación</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-100">
            {tiers.map(({ name, desc, active }) => (
              <div key={name} className={`flex items-center gap-4 px-6 py-4 ${active ? "bg-amber-50" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${active ? "bg-amber-500 text-white" : "bg-surface-100 text-ink-400"}`}>
                  {active ? "★" : "○"}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${active ? "text-amber-800" : "text-ink-600"}`}>{name}</p>
                  <p className="text-xs text-ink-400">{desc}</p>
                </div>
                {active && <Badge variant="elite">Nivel actual</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
