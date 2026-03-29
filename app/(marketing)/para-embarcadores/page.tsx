import { CheckCircle2, ArrowRight, Package, Shield, Lock, MapPin, FileCheck, BarChart3, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrustBar } from "@/components/layout/trust-bar";

const benefits = [
  { icon: Shield, title: "Transportistas verificados", desc: "INE, empresa, unidad y seguro revisados por nuestro equipo antes de mostrarte el perfil." },
  { icon: Lock, title: "Pago protegido en custodia", desc: "Tu dinero queda retenido hasta que la carga llegue. No antes. Sin riesgo de perder el anticipo." },
  { icon: MapPin, title: "GPS en tiempo real", desc: "Sabes exactamente dónde está tu mercancía en todo momento, sin depender de mensajes de WhatsApp." },
  { icon: FileCheck, title: "CFDI garantizado", desc: "Cada operación genera una factura electrónica automáticamente. Sin excepciones." },
  { icon: BarChart3, title: "Hasta 40% más barato", desc: "Los transportistas de retorno ya van de regreso — ofrecen precios que no puedes obtener en flete dedicado." },
  { icon: Clock, title: "Menos tiempo de gestión", desc: "Describe tu carga en lenguaje natural. El sistema hace el trabajo de buscar, filtrar y presentarte opciones." },
];

const objections = [
  {
    q: "¿Cómo sé que el transportista no me va a estafar?",
    a: "Todos los transportistas pasan verificación de identidad, empresa y vehículo antes de aparecer en la plataforma. Además, no liberas el pago hasta que confirmas la entrega correcta. El dinero nunca va directo al transportista sin evidencia.",
  },
  {
    q: "¿Qué pasa si llega dañada la mercancía?",
    a: "El proceso de reclamación se activa antes de liberar el pago. ZzingRush actúa como árbitro con la evidencia fotográfica de recolección y entrega. Si hay daño comprobable, el pago se suspende hasta resolver el caso.",
  },
  {
    q: "¿Necesito adaptar mi operación logística?",
    a: "No. Solo describes tu carga dentro de la app. ZzingRush se encarga de encontrar el transportista, gestionar el escrow y generar el CFDI. No necesitas cambiar tu proceso interno.",
  },
  {
    q: "¿Puedo usar ZzingRush para envíos frecuentes?",
    a: "Sí. Puedes guardar tus rutas frecuentes, transportistas de confianza y configurar preferencias de cargo. En el plan Pro puedes manejar múltiples envíos simultáneamente con tu equipo.",
  },
];

const useCases = [
  { industry: "Manufactura", desc: "Materia prima de regreso, producto terminado de planta a CEDIS, retornos de devoluciones." },
  { industry: "Retail y distribución", desc: "Reabastecimiento de tiendas, devoluciones de temporada, transferencias entre centros." },
  { industry: "Comercio exterior", desc: "Movimiento interno post-importación, consolidación hacia puertos o zonas aduanales." },
  { industry: "E-commerce", desc: "Devoluciones logísticas, envíos regionales de volumen, productos de temporada." },
];

export default function ParaEmbarcadoresPage() {
  return (
    <div>
      <section className="bg-ink-900 text-white py-20 lg:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-ink-800 text-ink-200 border border-ink-700">
              <Package className="w-3.5 h-3.5 mr-1.5" /> Para embarcadores
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Mueve tu carga con transportistas verificados y precio justo
            </h1>
            <p className="text-xl text-ink-300 leading-relaxed mb-8">
              Sin llamadas a desconocidos. Sin anticipos en efectivo. Sin incertidumbre sobre dónde está tu mercancía.
            </p>
            <Button asChild size="xl" className="bg-accent-500 hover:bg-accent-600">
              <Link href="/registro?rol=embarcador">
                Crear cuenta de embarcador <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink-900 mb-4">Lo que obtienes como embarcador</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6">
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface-50">
        <div className="container-page max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">Objecciones comunes</Badge>
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Preguntas directas, respuestas directas</h2>
          </div>
          <div className="space-y-4">
            {objections.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-surface-200 p-6">
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

      <section className="section bg-white">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Casos de uso frecuentes</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {useCases.map(({ industry, desc }) => (
              <div key={industry} className="p-5 rounded-xl bg-surface-50 border border-surface-200">
                <h4 className="font-semibold text-ink-800 mb-2">{industry}</h4>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-accent-500 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold mb-3">Empieza a mover carga hoy</h2>
          <p className="text-accent-100 mb-6">Registro gratuito. Primera operación sin comisión. Verificación en 24 horas.</p>
          <Button asChild size="lg" className="bg-white text-accent-700 hover:bg-accent-50">
            <Link href="/registro?rol=embarcador">Registrar mi empresa <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
