import { CheckCircle2, ArrowRight, Shield, Zap, Building2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Básico",
    price: "Gratis",
    subtitle: "Para comenzar a operar",
    commission: "5.5% por operación",
    commissionNote: "Se descuenta del monto total del servicio",
    features: [
      "Verificación de identidad incluida",
      "Hasta 5 operaciones por mes",
      "Seguimiento GPS en tiempo real",
      "CFDI automático",
      "Escrow en cada operación",
      "Soporte por correo electrónico",
    ],
    notIncluded: [
      "Prioridad en resultados de búsqueda",
      "Soporte prioritario",
      "Múltiples usuarios",
    ],
    cta: "Comenzar gratis",
    href: "/registro",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$990",
    period: "/mes",
    subtitle: "Para operaciones frecuentes",
    commission: "3.5% por operación",
    commissionNote: "Ahorra ~2 puntos en cada servicio",
    features: [
      "Todo lo de Básico",
      "Operaciones ilimitadas",
      "Prioridad en coincidencias",
      "Hasta 3 usuarios por cuenta",
      "Soporte prioritario por WhatsApp",
      "Reportes de operación exportables",
      "Perfil destacado en búsquedas",
      "Historial completo de CFDI",
    ],
    notIncluded: [
      "API de integración",
      "Gestor de cuenta dedicado",
    ],
    cta: "Comenzar con Pro",
    href: "/registro?plan=pro",
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "A convenir",
    subtitle: "Para flotas y grandes volúmenes",
    commission: "Comisión negociada",
    commissionNote: "Según volumen mensual de operaciones",
    features: [
      "Todo lo de Pro",
      "Usuarios ilimitados",
      "API de integración REST",
      "Gestor de cuenta dedicado",
      "Facturación consolidada",
      "Flujos de aprobación personalizados",
      "SLA de soporte garantizado",
      "Onboarding asistido de flota",
    ],
    notIncluded: [],
    cta: "Hablar con ventas",
    href: "#contacto",
    highlight: false,
  },
];

const commissionBreakdown = [
  { label: "Monto acordado del servicio", value: "$10,000 MXN", neutral: true },
  { label: "Comisión ZzingRush (3.5% Pro)", value: "−$350 MXN", neutral: false },
  { label: "IVA sobre comisión", value: "−$56 MXN", neutral: false },
  { label: "Transportista recibe", value: "$9,594 MXN", highlight: true },
];

export default function PreciosPage() {
  return (
    <div>
      <section className="bg-ink-900 text-white py-20 lg:py-28">
        <div className="container-page text-center">
          <Badge className="mb-6 bg-ink-800 text-ink-200 border border-ink-700">Precios</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Precios claros, sin sorpresas</h1>
          <p className="text-xl text-ink-300 max-w-2xl mx-auto">
            Comisión por operación completada. Solo pagas cuando la carga llega.
            No hay cargos mensuales obligatorios para comenzar.
          </p>
        </div>
      </section>

      <section className="section bg-surface-50">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-ink-900 border-ink-700 text-white shadow-card-lg"
                    : "bg-white border-surface-200 shadow-card"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent-500 text-white border-0">Más popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-ink-900"}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? "text-ink-400" : "text-ink-500"}`}>{plan.subtitle}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-ink-900"}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ${plan.highlight ? "text-ink-400" : "text-ink-500"}`}>{plan.period}</span>}
                  </div>
                  <div className={`mt-3 text-sm font-medium ${plan.highlight ? "text-accent-400" : "text-accent-600"}`}>
                    {plan.commission}
                  </div>
                  <p className={`text-xs mt-1 ${plan.highlight ? "text-ink-500" : "text-ink-400"}`}>{plan.commissionNote}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-trust-green" : "text-trust-green"}`} />
                      <span className={plan.highlight ? "text-ink-200" : "text-ink-700"}>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm opacity-40">
                      <span className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center">—</span>
                      <span className={plan.highlight ? "text-ink-400" : "text-ink-400"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.highlight ? "default" : "outline"}
                  size="lg"
                  className={`w-full ${plan.highlight ? "bg-accent-500 hover:bg-accent-600 text-white" : ""}`}
                >
                  <Link href={plan.href}>{plan.cta} <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission breakdown */}
      <section className="section-sm bg-white border-t border-surface-200">
        <div className="container-page max-w-lg mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Ejemplo de comisión</Badge>
          <h2 className="text-2xl font-bold text-ink-900 mb-8">¿Cómo se calcula lo que cobra el transportista?</h2>
          <div className="card overflow-hidden">
            {commissionBreakdown.map(({ label, value, neutral, highlight }) => (
              <div
                key={label}
                className={`flex items-center justify-between px-5 py-3.5 border-b border-surface-100 last:border-0 text-sm ${
                  highlight ? "bg-trust-greenLight" : neutral ? "" : ""
                }`}
              >
                <span className={highlight ? "font-semibold text-trust-green" : neutral ? "text-ink-600" : "text-ink-500"}>{label}</span>
                <span className={highlight ? "font-bold text-trust-green" : neutral ? "font-semibold text-ink-900" : "text-ink-600"}>{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-400 mt-4">* Precios en MXN. El IVA sobre la comisión es responsabilidad de ZzingRush como proveedor del servicio de plataforma.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface-50">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-8">Preguntas sobre precios</h2>
          <div className="space-y-4">
            {[
              {
                q: "¿Quién paga la comisión — embarcador o transportista?",
                a: "La comisión se descuenta del monto total del servicio. El embarcador ve el precio final y el transportista recibe el neto ya descontada la comisión. No hay cargos adicionales sorpresa.",
              },
              {
                q: "¿Cuándo se cobra la comisión?",
                a: "Solo cuando la operación se completa exitosamente. Si el servicio se cancela antes de comenzar, el embarcador recibe el reembolso completo sin comisión.",
              },
              {
                q: "¿Hay costo por registrarse o verificarse?",
                a: "No. El registro y la verificación de identidad son completamente gratuitos para todos los usuarios, independientemente del plan.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-surface-200 p-5">
                <h4 className="font-semibold text-ink-800 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                  {q}
                </h4>
                <p className="text-sm text-ink-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-accent-500 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold mb-3">Comienza sin costo</h2>
          <p className="text-accent-100 mb-6">Sin tarjeta de crédito. Sin compromisos. Solo paga cuando operes.</p>
          <Button asChild size="lg" className="bg-white text-accent-700 hover:bg-accent-50">
            <Link href="/registro">Crear cuenta <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
