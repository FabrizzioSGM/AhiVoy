import { Shield, CheckCircle2, Clock, User, Building2, FileText, TruckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrustBadge } from "@/components/shared/trust-badge";
import { createClient } from "@/lib/supabase/server";

const tiers = [
  { name: "Nuevo", desc: "Cuenta recién creada, sin historial." },
  { name: "Verificado", desc: "Identidad y empresa aprobadas." },
  { name: "Confiable", desc: "10+ operaciones completadas, sin incidencias." },
  { name: "Élite", desc: "50+ operaciones, 4.7+ rating, < 1% incidencias." },
];

const tierOrder = ["nuevo", "verificado", "confiable", "elite"];

export default async function VerificacionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, phone, role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "embarcador";

  // Fetch company for embarcadores
  const { data: company } = await supabase
    .from("companies")
    .select("legal_name, rfc")
    .eq("user_id", user.id)
    .maybeSingle();

  // Fetch carrier profile for transportistas
  const { data: carrier } = role === "transportista"
    ? await supabase
        .from("carrier_profiles")
        .select("verification_status, reputation_tier, license_number")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const currentTier = carrier?.reputation_tier ?? (company ? "verificado" : "nuevo");
  const currentTierIdx = tierOrder.indexOf(currentTier);

  // Build verification items dynamically
  type VerifItem = { label: string; status: "approved" | "pending" | "missing"; icon: typeof User; note: string };
  const verificationItems: VerifItem[] = [
    {
      label: "Correo electrónico",
      status: user.email_confirmed_at ? "approved" : "pending",
      icon: CheckCircle2,
      note: user.email_confirmed_at ? "Confirmado" : "Pendiente de confirmar",
    },
    {
      label: "Teléfono",
      status: profile?.phone ? "approved" : "pending",
      icon: CheckCircle2,
      note: profile?.phone ? "Registrado" : "No registrado",
    },
    {
      label: "Identidad personal",
      status: (carrier?.verification_status === "approved" || company) ? "approved" : "pending",
      icon: User,
      note: (carrier?.verification_status === "approved" || company) ? "Verificado" : "Pendiente de verificación",
    },
  ];

  if (role === "embarcador") {
    verificationItems.push({
      label: "Empresa / RFC",
      status: company ? "approved" : "missing",
      icon: Building2,
      note: company ? `${company.legal_name} · RFC: ${company.rfc}` : "No registrada",
    });
  }

  if (role === "transportista") {
    verificationItems.push({
      label: "Licencia de operador",
      status: carrier?.license_number && carrier.license_number !== "PENDIENTE" ? "approved" : "pending",
      icon: TruckIcon,
      note: carrier?.license_number && carrier.license_number !== "PENDIENTE" ? carrier.license_number : "Pendiente",
    });
    verificationItems.push({
      label: "Verificación transportista",
      status: carrier?.verification_status === "approved" ? "approved" : carrier?.verification_status === "pending" ? "pending" : "missing",
      icon: FileText,
      note: carrier?.verification_status === "approved" ? "Aprobado" : carrier?.verification_status === "in_review" ? "En revisión" : "Pendiente",
    });
  }

  const approvedCount = verificationItems.filter(i => i.status === "approved").length;
  const totalCount = verificationItems.length;
  const progress = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;
  const isFullyVerified = approvedCount === totalCount;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Estado de verificación</h1>
        <p className="text-sm text-ink-500">Revisa el estado de tus documentos y nivel de reputación.</p>
      </div>

      <div className={`${isFullyVerified ? "bg-trust-greenLight border-green-200" : "bg-amber-50 border-amber-200"} border rounded-2xl p-6 mb-6 flex items-center gap-5`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isFullyVerified ? "bg-trust-green" : "bg-amber-400"}`}>
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className={`text-xl font-bold ${isFullyVerified ? "text-trust-green" : "text-amber-800"}`}>
              {isFullyVerified ? "Perfil completamente verificado" : "Verificación en progreso"}
            </h2>
            <TrustBadge status={isFullyVerified ? "approved" : "pending"} label={isFullyVerified ? "Verificado" : "En proceso"} size="md" />
          </div>
          <p className={`text-sm ${isFullyVerified ? "text-green-700" : "text-amber-700"}`}>{approvedCount} de {totalCount} verificaciones completadas</p>
          <Progress value={progress} className="mt-2 h-1.5" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3"><CardTitle className="text-base">Checklist de verificación</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-100">
            {verificationItems.map(({ label, status, icon: Icon, note }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${status === "approved" ? "bg-trust-greenLight" : status === "pending" ? "bg-amber-50" : "bg-surface-100"}`}>
                  <Icon className={`w-4 h-4 ${status === "approved" ? "text-trust-green" : status === "pending" ? "text-amber-500" : "text-ink-400"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-800">{label}</p>
                  <p className="text-xs text-ink-400">{note}</p>
                </div>
                <TrustBadge status={status as "approved" | "pending"} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Niveles de reputación</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-100">
            {tiers.map(({ name, desc }, idx) => {
              const active = idx === currentTierIdx;
              const passed = idx < currentTierIdx;
              return (
                <div key={name} className={`flex items-center gap-4 px-6 py-4 ${active ? "bg-amber-50" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${active ? "bg-amber-500 text-white" : passed ? "bg-trust-green text-white" : "bg-surface-100 text-ink-400"}`}>
                    {active ? "★" : passed ? "✓" : "○"}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${active ? "text-amber-800" : passed ? "text-trust-green" : "text-ink-600"}`}>{name}</p>
                    <p className="text-xs text-ink-400">{desc}</p>
                  </div>
                  {active && <Badge variant="elite">Nivel actual</Badge>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
