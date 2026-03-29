"use client";
import { Package, TruckIcon, Shield, CreditCard, MapPin, FileCheck, Star, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrustBar } from "@/components/layout/trust-bar";

const shipperFlow = [
  {
    n: 1,
    title: "Crea tu cuenta y verifica tu empresa",
    desc: "Registra tu empresa, sube tus documentos fiscales (RFC, acta constitutiva) y nuestro equipo verifica tu perfil en menos de 24 horas.",
    details: ["RFC y situación fiscal", "Acta constitutiva o constancia de REPSE", "Datos de facturación y cuenta de pago"],
    icon: Shield,
  },
  {
    n: 2,
    title: "Describe tu envío",
    desc: "Escribe en lenguaje natural qué necesitas mover. El sistema extrae los datos relevantes: origen, destino, peso, tipo de carga y fecha.",
    details: ["Descripción libre o formulario guiado", "Sistema interpreta y valida los datos", "Sin decisiones técnicas de tu parte"],
    icon: Package,
  },
  {
    n: 3,
    title: "Recibe y evalúa coincidencias verificadas",
    desc: "ZzingRush muestra transportistas que tienen ruta de retorno compatible. Solo ves transportistas con verificación aprobada y con reputación real.",
    details: ["Score de coincidencia por ruta", "Reputación, calificaciones y viajes completados", "Precio estimado basado en distancia real"],
    icon: CheckCircle2,
  },
  {
    n: 4,
    title: "Acepta la propuesta y deposita en custodia",
    desc: "Confirmas la operación y el monto queda retenido en custodia. El transportista recibe notificación de que el pago está garantizado.",
    details: ["Pago seguro vía transferencia o tarjeta", "Fondos retenidos hasta entrega confirmada", "CFDI generado al completar el servicio"],
    icon: CreditCard,
  },
  {
    n: 5,
    title: "Seguimiento en tiempo real y confirmación de entrega",
    desc: "Monitorea la posición del transportista. Recibes alertas en cada hito: recolección, en tránsito, entrega. Confirma con foto y el pago se libera.",
    details: ["GPS en tiempo real durante el servicio", "Foto en recolección y entrega", "Liberación de pago automática al confirmar"],
    icon: MapPin,
  },
];

const carrierFlow = [
  {
    n: 1,
    title: "Verifica tu identidad y unidad",
    desc: "Sube tu INE, licencia de conducir, tarjeta de circulación de la unidad, seguro vigente y datos bancarios para cobros.",
    details: ["Verificación de identidad personal", "Revisión de documentos del vehículo", "Datos de pago validados por el equipo"],
    icon: Shield,
  },
  {
    n: 2,
    title: "Publica tu ruta de retorno",
    desc: "Indica de dónde sales, a dónde vas, qué capacidad tienes disponible y en qué fechas. ZzingRush estima automáticamente tu ganancia potencial.",
    details: ["Origen, destino y rango de fechas", "Capacidad en kg y m³", "Tipos de carga que aceptas"],
    icon: TruckIcon,
  },
  {
    n: 3,
    title: "Recibe solicitudes de carga compatibles",
    desc: "El sistema filtra cargas que se alinean con tu ruta, sin desvíos innecesarios. Ves el perfil del embarcador, el tipo de carga y el precio antes de decidir.",
    details: ["Resumen de detour en kilómetros", "Perfil verificado del embarcador", "Precio ofrecido y ganancia neta estimada"],
    icon: CheckCircle2,
  },
  {
    n: 4,
    title: "Acepta y coordina la recolección",
    desc: "Los datos de contacto del embarcador se desbloquean solo cuando los fondos están en custodia. Coordinas la recolección con información completa y verificada.",
    details: ["Contacto protegido hasta escrow confirmado", "Dirección exacta de recolección", "Instrucciones especiales de carga"],
    icon: FileCheck,
  },
  {
    n: 5,
    title: "Entrega y cobra en menos de 24 horas",
    desc: "Registra la entrega con foto y GPS dentro de la app. El embarcador recibe notificación. Si no hay reclamación en 24h, el dinero se transfiere automáticamente.",
    details: ["Foto de evidencia al entregar", "Confirmación GPS de ubicación", "Transferencia automática a tu cuenta"],
    icon: CreditCard,
  },
];

export default function ComoFuncionaPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-900 text-white py-20 lg:py-28">
        <div className="container-page text-center">
          <Badge className="mb-6 bg-ink-800 text-ink-200 border border-ink-700">Proceso</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Cómo funciona ZzingRush
          </h1>
          <p className="text-xl text-ink-300 max-w-2xl mx-auto">
            Un flujo claro, trazable y protegido para los dos lados de la operación logística.
          </p>
        </div>
      </section>

      <TrustBar />

      {/* Flows */}
      <section className="section bg-white">
        <div className="container-page">
          <Tabs defaultValue="embarcador">
            <div className="flex justify-center mb-12">
              <TabsList>
                <TabsTrigger value="embarcador" className="px-8">
                  <Package className="w-4 h-4 mr-2" /> Para embarcadores
                </TabsTrigger>
                <TabsTrigger value="transportista" className="px-8">
                  <TruckIcon className="w-4 h-4 mr-2" /> Para transportistas
                </TabsTrigger>
              </TabsList>
            </div>

            {[
              { value: "embarcador", steps: shipperFlow, cta: { label: "Comenzar como embarcador", href: "/registro?rol=embarcador" } },
              { value: "transportista", steps: carrierFlow, cta: { label: "Publicar mi ruta de retorno", href: "/registro?rol=transportista" } },
            ].map(({ value, steps, cta }) => (
              <TabsContent key={value} value={value}>
                <div className="max-w-4xl mx-auto">
                  <div className="relative">
                    {/* Connector line */}
                    <div className="absolute left-[19px] top-10 bottom-10 w-px bg-surface-200 hidden md:block" />
                    <div className="space-y-6">
                      {steps.map(({ n, title, desc, details, icon: Icon }) => (
                        <div key={n} className="flex gap-6">
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-accent-500 text-white font-bold text-sm flex items-center justify-center z-10">
                              {n}
                            </div>
                          </div>
                          <div className="flex-1 bg-surface-50 rounded-xl border border-surface-200 p-6 mb-2">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-accent-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-ink-900 mb-2">{title}</h3>
                                <p className="text-sm text-ink-600 leading-relaxed mb-4">{desc}</p>
                                <ul className="space-y-1.5">
                                  {details.map((d) => (
                                    <li key={d} className="flex items-center gap-2 text-xs text-ink-500">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-trust-green flex-shrink-0" />
                                      {d}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center mt-10">
                    <Button asChild size="lg">
                      <Link href={cta.href}>{cta.label} <ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-sm bg-ink-900 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold mb-4">¿Tienes más preguntas sobre el proceso?</h2>
          <p className="text-ink-300 mb-6">Revisa nuestra página de confianza y seguridad o escríbenos.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="border-ink-600 text-ink-200 hover:bg-ink-800 hover:text-white bg-transparent">
              <Link href="/confianza-seguridad">Ver confianza y seguridad</Link>
            </Button>
            <Button asChild>
              <Link href="/registro">Comenzar ahora <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
