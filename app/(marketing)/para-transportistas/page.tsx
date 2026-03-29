import { CheckCircle2, ArrowRight, TruckIcon, Lock, CreditCard, Shield, MapPin, Star, AlertCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrustBar } from "@/components/layout/trust-bar";
import { formatCurrency } from "@/lib/utils";

const benefits = [
  { icon: CreditCard, title: "Pago garantizado antes de salir", desc: "Los fondos están en custodia antes de que hagas el recorrido. Jamás trabajas sin certeza de cobro." },
  { icon: TruckIcon, title: "Monetiza viajes que ya estás haciendo", desc: "Tu ruta de retorno ya la pagaste. Cualquier carga que lleves de regreso es utilidad neta adicional." },
  { icon: Shield, title: "Clientes verificados", desc: "Tus datos personales y los del cliente están protegidos. No operas con perfiles anónimos." },
  { icon: MapPin, title: "Sin desvíos innecesarios", desc: "ZzingRush filtra cargas que se alinean a tu ruta existente. Solo ves opciones que tienen sentido operativo." },
  { icon: BarChart3, title: "Construye tu reputación", desc: "Tu historial de operaciones, puntualidad y documentación se traduce en un perfil que atrae mejores cargas." },
  { icon: Lock, title: "Tus datos, protegidos", desc: "Tu número de teléfono no se comparte hasta confirmar el escrow. Sin llamadas de desconocidos sin contexto." },
];

const earningsExample = {
  route: "Guadalajara → Querétaro",
  distance: 260,
  baseEarnings: 2860,
  emptyTrip: 0,
  monthlyTrips: 8,
  monthlyTotal: 22880,
};

const objections = [
  {
    q: "¿Cómo sé que me van a pagar?",
    a: "Antes de que salgas a recoger la carga, el embarcador ya depositó el monto completo en custodia. ZzingRush retiene los fondos hasta la entrega confirmada. No puedes quedarte sin cobro si la carga llegó.",
  },
  {
    q: "¿Qué pasa si el embarcador no quiere confirmar la entrega?",
    a: "Si el embarcador no confirma y no abre una reclamación formal dentro de 24 horas de la entrega, el pago se libera automáticamente. El silencio no te perjudica.",
  },
  {
    q: "¿Me protegen si el embarcador hace una reclamación falsa?",
    a: "Sí. La evidencia fotográfica y el GPS que registraste durante la operación son tu respaldo. ZzingRush evalúa la evidencia de ambas partes antes de tomar cualquier decisión sobre los fondos.",
  },
  {
    q: "¿Puedo usar ZzingRush si soy operador independiente, no empresa?",
    a: "Sí. Aceptamos personas físicas con actividad empresarial y régimen simplificado de confianza (RESICO). Lo que necesitas es RFC activo, licencia, seguro vigente y tarjeta de circulación.",
  },
];

export default function ParaTransportistasPage() {
  return (
    <div>
      <section className="bg-ink-900 text-white py-20 lg:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-ink-800 text-ink-200 border border-ink-700">
              <TruckIcon className="w-3.5 h-3.5 mr-1.5" /> Para transportistas
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Tu ruta de retorno ya vale dinero. <span className="text-accent-400">Cóbrala.</span>
            </h1>
            <p className="text-xl text-ink-300 leading-relaxed mb-8">
              Publica tu capacidad disponible de regreso. Recibe cargas verificadas con pago garantizado antes de salir.
            </p>
            <Button asChild size="xl" variant="outline" className="border-white text-white bg-transparent hover:bg-ink-800 hover:border-ink-500">
              <Link href="/registro?rol=transportista">
                Publicar mi primera ruta <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Earnings example */}
      <section className="section-sm bg-white border-b border-surface-200">
        <div className="container-page max-w-3xl">
          <div className="bg-surface-50 rounded-2xl border border-surface-200 p-8">
            <Badge variant="secondary" className="mb-4">Ejemplo real de ganancia</Badge>
            <h3 className="text-xl font-bold text-ink-900 mb-6">Ruta: {earningsExample.route}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-ink-500 mb-1">Sin ZzingRush (viaje vacío)</p>
                <p className="text-2xl font-bold text-ink-300">{formatCurrency(earningsExample.emptyTrip)}</p>
                <p className="text-xs text-ink-400 mt-1">Solo gastos de combustible</p>
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">Con ZzingRush (por viaje)</p>
                <p className="text-2xl font-bold text-trust-green">{formatCurrency(earningsExample.baseEarnings)}</p>
                <p className="text-xs text-ink-400 mt-1">En {earningsExample.distance} km de retorno</p>
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">Ganancia adicional mensual</p>
                <p className="text-2xl font-bold text-accent-600">{formatCurrency(earningsExample.monthlyTotal)}</p>
                <p className="text-xs text-ink-400 mt-1">{earningsExample.monthlyTrips} viajes/mes × {formatCurrency(earningsExample.baseEarnings)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface-50">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink-900 mb-4">Lo que ZzingRush garantiza al transportista</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6">
                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-ink-600" />
                </div>
                <h3 className="font-semibold text-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">Preguntas del transportista</Badge>
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Dudas antes de registrarse</h2>
          </div>
          <div className="space-y-4">
            {objections.map(({ q, a }) => (
              <div key={q} className="bg-surface-50 rounded-xl border border-surface-200 p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-4 h-4 text-trust-amber flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-ink-800">{q}</h4>
                </div>
                <p className="text-sm text-ink-500 leading-relaxed pl-7">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-ink-900 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold mb-3">Empieza a cobrar tus rutas de retorno</h2>
          <p className="text-ink-300 mb-6">Registro gratuito. Verificación en 24 horas. Sin cuota mensual para comenzar.</p>
          <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
            <Link href="/registro?rol=transportista">Registrarme como transportista <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
