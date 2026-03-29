import { Shield, CheckCircle2, Lock, MapPin, Camera, FileCheck, Star, AlertCircle, ArrowRight, Users, Building2, TruckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrustBar } from "@/components/layout/trust-bar";

const verificationItems = [
  {
    title: "Verificación de identidad personal",
    icon: Users,
    items: ["INE o pasaporte vigente", "Selfie de confirmación de identidad", "Número de teléfono validado", "Correo electrónico confirmado"],
  },
  {
    title: "Verificación de empresa",
    icon: Building2,
    items: ["RFC activo y situación fiscal al corriente", "Acta constitutiva o constancia REPSE", "Comprobante de domicilio fiscal", "Opinión de cumplimiento SAT"],
  },
  {
    title: "Verificación de unidad (transportistas)",
    icon: TruckIcon,
    items: ["Tarjeta de circulación vigente", "Seguro de responsabilidad civil vigente", "Fotografías de la unidad", "Número de serie (NIV) validado"],
  },
];

const escrowSteps = [
  { n: 1, title: "Embarcador deposita en custodia", desc: "Antes de confirmar la operación, el embarcador transfiere el monto acordado a la cuenta fiduciaria de ZzingRush." },
  { n: 2, title: "Transportista recibe confirmación de garantía", desc: "El transportista ve en su app que los fondos están reservados. Sale con la certeza de que va a cobrar." },
  { n: 3, title: "Recolección y evidencia fotográfica", desc: "Al recoger, el transportista registra foto de la carga dentro de la app. Queda registrado con timestamp y GPS." },
  { n: 4, title: "Entrega y confirmación", desc: "Al entregar, nuevo registro fotográfico con GPS. El embarcador recibe notificación para confirmar." },
  { n: 5, title: "Liberación de fondos", desc: "Embarcador confirma recepción correcta o transcurren 24 horas sin reclamación. Fondos transferidos al transportista en el mismo día." },
];

const gpsMilestones = [
  { icon: MapPin, label: "Salida confirmada", desc: "GPS registra inicio del viaje desde la ubicación de recolección." },
  { icon: Camera, label: "Foto en recolección", desc: "Fotografía de la carga con timestamp y coordenadas GPS." },
  { icon: MapPin, label: "Posición en tránsito", desc: "Actualizaciones periódicas de posición disponibles para el embarcador." },
  { icon: MapPin, label: "Llegada a destino", desc: "GPS registra llegada a la ubicación de entrega." },
  { icon: Camera, label: "Foto en entrega", desc: "Fotografía de confirmación con nombre del receptor, timestamp y GPS." },
];

const claimProcess = [
  { step: "1", title: "Reporte del incidente", desc: "El embarcador abre una reclamación dentro de la app, con descripción y evidencia fotográfica." },
  { step: "2", title: "Fondos en pausa", desc: "El pago al transportista queda bloqueado mientras el caso está en revisión." },
  { step: "3", title: "Evaluación de evidencia", desc: "El equipo de ZzingRush revisa fotos de recolección, fotos de entrega, tracking GPS y comunicaciones." },
  { step: "4", title: "Resolución arbitrada", desc: "Se emite resolución dentro de 5 días hábiles. Se libera el pago al transportista, se procesa reembolso parcial o total, según el caso." },
];

export default function ConfianzaSeguridadPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-900 text-white py-20 lg:py-28">
        <div className="container-page">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-ink-800 text-ink-200 border border-ink-700">Confianza y seguridad</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Operaciones verificadas, protegidas y trazables
            </h1>
            <p className="text-xl text-ink-300 leading-relaxed">
              La confianza no se puede improvisar. ZzingRush verifica identidades, protege los pagos y rastrea cada carga
              antes de que la operación comience.
            </p>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Verification */}
      <section id="verificacion" className="section bg-white">
        <div className="container-page">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Verificación</Badge>
            <h2 className="text-3xl font-bold text-ink-900 mb-4">Solo operan perfiles verificados</h2>
            <p className="text-ink-500 max-w-2xl mx-auto">
              Ningún transportista puede publicar rutas y ningún embarcador puede crear envíos
              sin haber pasado por nuestro proceso de verificación.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {verificationItems.map(({ title, icon: Icon, items }) => (
              <Card key={title} className="p-6">
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-ink-900 mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-trust-green flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="bg-trust-greenLight border border-green-200 rounded-xl p-5 max-w-2xl mx-auto text-center">
            <CheckCircle2 className="w-6 h-6 text-trust-green mx-auto mb-2" />
            <p className="text-sm font-medium text-trust-green">
              El badge de "Verificado" solo aparece cuando nuestro equipo ha revisado y aprobado manualmente cada documento.
            </p>
          </div>
        </div>
      </section>

      {/* Escrow */}
      <section id="escrow" className="section bg-surface-50">
        <div className="container-page">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Pago protegido</Badge>
            <h2 className="text-3xl font-bold text-ink-900 mb-4">El dinero espera en custodia</h2>
            <p className="text-ink-500 max-w-2xl mx-auto">
              Ni el transportista puede cobrar sin entregar, ni el embarcador puede negarse a pagar una vez confirmada la entrega.
              El escrow protege los dos lados.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {escrowSteps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 items-start p-5 bg-white rounded-xl border border-surface-200">
                <div className="w-8 h-8 rounded-full bg-accent-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {n}
                </div>
                <div>
                  <h4 className="font-semibold text-ink-900 mb-1">{title}</h4>
                  <p className="text-sm text-ink-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GPS & Tracking */}
      <section id="seguimiento" className="section bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Seguimiento GPS</Badge>
              <h2 className="text-3xl font-bold text-ink-900 mb-6">GPS obligatorio durante toda la operación</h2>
              <p className="text-ink-500 leading-relaxed mb-8">
                El transportista activa el seguimiento GPS desde la app al momento de salir a recoger la carga.
                La señal se comparte en tiempo real con el embarcador. No hay operaciones "off-the-radar".
              </p>
              <div className="space-y-4">
                {gpsMilestones.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-800">{label}</p>
                      <p className="text-xs text-ink-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-100 rounded-2xl p-8 border border-surface-200">
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border border-surface-200">
                  <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Estado del envío</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-trust-green animate-pulse" />
                    <span className="text-sm font-semibold text-ink-800">En tránsito · San Luis Potosí</span>
                  </div>
                  <p className="text-xs text-ink-400 mt-1">Actualizado hace 4 minutos</p>
                </div>
                {[
                  { label: "Recolección confirmada", time: "08:32", done: true },
                  { label: "En tránsito — Querétaro", time: "10:15", done: true },
                  { label: "En tránsito — SLP", time: "14:45", done: true },
                  { label: "Entrega estimada — MTY", time: "~19:00", done: false },
                ].map(({ label, time, done }) => (
                  <div key={label} className={`flex items-center gap-3 py-2 px-3 rounded-lg ${done ? "bg-trust-greenLight" : "bg-surface-100"}`}>
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${done ? "text-trust-green" : "text-ink-300"}`} />
                    <span className={`text-sm ${done ? "text-trust-green font-medium" : "text-ink-400"}`}>{label}</span>
                    <span className="text-xs text-ink-400 ml-auto">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact protection */}
      <section className="section bg-ink-900 text-white">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-ink-800 text-ink-200 border border-ink-700">Protección de contacto</Badge>
            <h2 className="text-3xl font-bold text-white mb-6">
              Tu número de teléfono permanece oculto hasta confirmar el escrow
            </h2>
            <p className="text-ink-300 leading-relaxed mb-8">
              Toda la comunicación inicial ocurre dentro de ZzingRush. El número personal, WhatsApp
              y datos de contacto solo se revelan cuando los fondos ya están en custodia y ambas partes
              han confirmado la operación. Sin datos expuestos, sin llamadas de desconocidos.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                { stage: "Antes del escrow", info: "Solo nombre, empresa y reputación visible", color: "bg-ink-800 border-ink-700" },
                { stage: "Fondos en custodia", info: "Se desbloquea dirección de recolección y datos de contacto", color: "bg-accent-900 border-accent-700" },
                { stage: "Operación activa", info: "Comunicación completa + seguimiento GPS compartido", color: "bg-trust-green bg-opacity-10 border-green-700" },
              ].map(({ stage, info, color }) => (
                <div key={stage} className={`rounded-xl p-5 border ${color}`}>
                  <p className="text-xs font-semibold text-ink-300 uppercase tracking-wide mb-2">{stage}</p>
                  <p className="text-sm text-ink-200">{info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Claims */}
      <section className="section bg-surface-50">
        <div className="container-page">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Reclamaciones</Badge>
            <h2 className="text-3xl font-bold text-ink-900 mb-4">Proceso de reclamación documentado</h2>
            <p className="text-ink-500 max-w-2xl mx-auto">
              Si algo sale mal, hay un proceso claro. No dependes de buena fe ni de llamadas telefónicas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {claimProcess.map(({ step, title, desc }) => (
              <Card key={step} className="p-6">
                <div className="w-8 h-8 rounded-full bg-surface-100 text-ink-600 text-sm font-bold flex items-center justify-center mb-4">
                  {step}
                </div>
                <h4 className="font-semibold text-ink-900 mb-2">{title}</h4>
                <p className="text-sm text-ink-500">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reputation */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">Reputación</Badge>
            <h2 className="text-3xl font-bold text-ink-900 mb-6">Un sistema de reputación que va más allá de las estrellas</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left mt-8">
              {[
                { icon: Star, label: "Calificación general", desc: "Promedio ponderado de todas las operaciones completadas." },
                { icon: CheckCircle2, label: "Tasa de puntualidad", desc: "Porcentaje de entregas realizadas en el tiempo acordado." },
                { icon: FileCheck, label: "Calidad documental", desc: "Consistencia en evidencia fotográfica y documentación de entrega." },
                { icon: AlertCircle, label: "Tasa de incidencias", desc: "Proporción de operaciones que generaron reclamaciones formales." },
                { icon: TruckIcon, label: "Viajes completados", desc: "Número total de servicios concluidos con éxito en la plataforma." },
                { icon: Shield, label: "Nivel de verificación", desc: "Nuevo → Verificado → Confiable → Élite, según historial y documentación." },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex gap-3 p-4 rounded-xl bg-surface-50 border border-surface-200">
                  <div className="w-8 h-8 rounded-lg bg-white border border-surface-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{label}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-accent-500 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold mb-3">Opera con la trazabilidad que mereces</h2>
          <p className="text-accent-100 mb-6">Regístrate y verifica tu perfil en menos de 24 horas.</p>
          <Button asChild size="lg" className="bg-white text-accent-700 hover:bg-accent-50">
            <Link href="/registro">Crear cuenta gratuita <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
