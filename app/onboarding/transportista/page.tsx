"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, TruckIcon, Building2, FileText, Shield, CreditCard, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = [
  { id: "tipo", label: "Tipo de operador", icon: Building2 },
  { id: "verificacion", label: "Identidad", icon: Shield },
  { id: "unidad", label: "Mi unidad", icon: TruckIcon },
  { id: "documentos", label: "Documentos", icon: FileText },
  { id: "cobros", label: "Datos de cobro", icon: CreditCard },
  { id: "completo", label: "Completado", icon: CheckCircle2 },
];

type StepId = "tipo" | "verificacion" | "unidad" | "documentos" | "cobros" | "completo";
const stepOrder: StepId[] = ["tipo", "verificacion", "unidad", "documentos", "cobros", "completo"];

export default function TransportistaOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<StepId>("tipo");
  const [operatorType, setOperatorType] = useState<"empresa" | "independiente" | null>(null);
  const stepIndex = stepOrder.indexOf(currentStep);
  const progress = ((stepIndex + 1) / stepOrder.length) * 100;

  const goNext = () => {
    if (stepIndex < stepOrder.length - 1) setCurrentStep(stepOrder[stepIndex + 1]);
  };
  const goBack = () => {
    if (stepIndex > 0) setCurrentStep(stepOrder[stepIndex - 1]);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <div className="bg-white border-b border-surface-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">Z</span>
            </div>
            <span className="text-ink-900 font-semibold">ZzingRush</span>
          </Link>
          <span className="text-sm text-ink-400">Paso {stepIndex + 1} de {stepOrder.length}</span>
        </div>
      </div>
      <Progress value={progress} className="h-1 rounded-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicators - scrollable on mobile */}
          <div className="flex items-center justify-center gap-1.5 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step.id} className="flex items-center gap-1.5 flex-shrink-0">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    done ? "bg-trust-green text-white" : active ? "bg-accent-500 text-white" : "bg-surface-200 text-ink-400"
                  )}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
                  </div>
                  {i < steps.length - 1 && <div className="w-4 h-px bg-surface-200" />}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
            {currentStep === "tipo" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-ink-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">¿Cómo operas?</h2>
                <p className="text-sm text-ink-500 mb-6">Selecciona tu tipo de operación. Esto determina qué documentos necesitas.</p>
                <div className="space-y-3">
                  {[
                    { id: "empresa", title: "Empresa de transporte", desc: "Tengo una empresa constituida (S.A. de C.V., S. de R.L., etc.) con flota de unidades.", docs: ["Acta constitutiva", "Permiso SCT", "RFC empresarial"] },
                    { id: "independiente", title: "Operador independiente", desc: "Soy persona física con actividad empresarial. Tengo una o pocas unidades a mi nombre.", docs: ["INE y RFC personal", "Tarjeta de circulación", "Seguro vigente"] },
                  ].map(({ id, title, desc, docs }) => (
                    <button
                      key={id}
                      onClick={() => setOperatorType(id as "empresa" | "independiente")}
                      className={cn(
                        "w-full text-left p-5 rounded-xl border-2 transition-all",
                        operatorType === id ? "border-accent-400 bg-accent-50" : "border-surface-200 hover:border-surface-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-ink-900 mb-1">{title}</p>
                          <p className="text-sm text-ink-500 mb-3">{desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {docs.map((d) => (
                              <span key={d} className="text-xs bg-surface-100 text-ink-500 px-2 py-0.5 rounded-full">{d}</span>
                            ))}
                          </div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
                          operatorType === id ? "border-accent-500 bg-accent-500" : "border-surface-300"
                        )}>
                          {operatorType === id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "verificacion" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-ink-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Verificación de identidad</h2>
                <p className="text-sm text-ink-500 mb-6">Requerida para todos los operadores. Protege a todos en la plataforma.</p>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre completo (como aparece en INE)</Label>
                    <Input placeholder="Juan Carlos Ramírez López" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>CURP</Label>
                    <Input placeholder="RALJ900101HDFMPC09" className="mt-1.5 font-mono uppercase" maxLength={18} />
                  </div>
                  <div>
                    <Label>Número de licencia de conducir</Label>
                    <Input placeholder="LIC-JAL-88432" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Estado donde opera principalmente</Label>
                    <Input placeholder="Jalisco, CDMX, Nuevo León..." className="mt-1.5" />
                  </div>
                  <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
                    <p className="text-xs text-accent-700 font-medium mb-1">Próximo paso: documentos</p>
                    <p className="text-xs text-accent-600">Necesitarás subir foto de tu INE y selfie de confirmación en el paso de documentos.</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "unidad" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center mb-4">
                  <TruckIcon className="w-5 h-5 text-ink-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Datos de tu unidad</h2>
                <p className="text-sm text-ink-500 mb-6">Puedes registrar más unidades después desde tu panel.</p>
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de unidad</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {["Camioneta", "Rabón", "Torton", "Trailer", "Full", "Otro"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className="text-xs px-3 py-2 rounded-lg border border-surface-200 text-ink-600 hover:border-accent-400 hover:bg-accent-50 hover:text-accent-700 transition-colors"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Marca</Label>
                      <Input placeholder="International" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Modelo</Label>
                      <Input placeholder="ProStar" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Año</Label>
                      <Input type="number" placeholder="2021" className="mt-1.5" min={2000} max={2025} />
                    </div>
                    <div>
                      <Label>Placas</Label>
                      <Input placeholder="JLA-123-B" className="mt-1.5 uppercase" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Capacidad (kg)</Label>
                      <Input type="number" placeholder="18000" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Capacidad (m³)</Label>
                      <Input type="number" placeholder="90" className="mt-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "documentos" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-ink-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Documentos requeridos</h2>
                <p className="text-sm text-ink-500 mb-6">Todos los documentos son revisados manualmente por nuestro equipo de verificación.</p>
                <div className="space-y-3">
                  {[
                    { label: "INE o pasaporte vigente", required: true, hint: "Foto clara de ambos lados" },
                    { label: "Licencia de conducir vigente", required: true, hint: "Tipo E o superior para carga pesada" },
                    { label: "Tarjeta de circulación", required: true, hint: "De la unidad que registraste" },
                    { label: "Seguro de responsabilidad civil", required: true, hint: "Vigente, con número de póliza" },
                    { label: "Constancia de situación fiscal (SAT)", required: true, hint: "RFC activo y al corriente" },
                    { label: "Foto de la unidad", required: false, hint: "Exterior e interior de la caja — opcional pero recomendado" },
                  ].map(({ label, required, hint }) => (
                    <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 hover:border-accent-200 cursor-pointer hover:bg-surface-50 transition-colors group">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-100 group-hover:bg-accent-50 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Camera className="w-3.5 h-3.5 text-ink-400 group-hover:text-accent-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-800">{label}</p>
                          <p className="text-xs text-ink-400">{hint}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {required && <span className="text-xs text-trust-red font-medium">Requerido</span>}
                        <div className="w-6 h-6 rounded border-2 border-dashed border-surface-300 group-hover:border-accent-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "cobros" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center mb-4">
                  <CreditCard className="w-5 h-5 text-ink-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Datos de cobro</h2>
                <p className="text-sm text-ink-500 mb-6">Así recibirás tus pagos. Solo transferencia bancaria a cuenta registrada a tu nombre.</p>
                <div className="space-y-4">
                  <div>
                    <Label>Banco</Label>
                    <Input placeholder="BBVA, Banorte, HSBC, Banamex..." className="mt-1.5" />
                  </div>
                  <div>
                    <Label>CLABE interbancaria (18 dígitos)</Label>
                    <Input placeholder="012345678901234567" className="mt-1.5 font-mono" maxLength={18} />
                    <p className="text-xs text-ink-400 mt-1">La cuenta debe estar a tu nombre o de tu empresa.</p>
                  </div>
                  <div>
                    <Label>Número de cuenta (opcional)</Label>
                    <Input placeholder="12345678" className="mt-1.5 font-mono" />
                  </div>
                  <div className="bg-trust-greenLight border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-trust-green font-medium">
                      Los cobros se procesan en menos de 24 horas después de confirmada la entrega.
                      No hay retenciones adicionales ni comisiones bancarias de nuestra parte.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "completo" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-trust-amberLight flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-trust-amber" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-2">Perfil en revisión</h2>
                <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
                  Tu perfil y documentos están siendo revisados por nuestro equipo.
                  El proceso toma hasta 24 horas hábiles. Te notificamos por correo y app.
                </p>
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 text-left mb-6">
                  <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-3">Estado de verificación</p>
                  <div className="space-y-2">
                    {[
                      { label: "Cuenta creada", done: true },
                      { label: "Datos personales registrados", done: true },
                      { label: "Documentos recibidos", done: true },
                      { label: "Revisión en proceso (hasta 24h)", done: false, pending: true },
                      { label: "Aprobación para operar", done: false },
                    ].map(({ label, done, pending }) => (
                      <div key={label} className={cn("flex items-center gap-3 py-1", done ? "text-trust-green" : pending ? "text-trust-amber" : "text-ink-300")}>
                        <CheckCircle2 className={cn("w-4 h-4", done ? "text-trust-green" : pending ? "text-trust-amber" : "text-ink-200")} />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/app/transportista">
                    Ir a mi panel <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}

            {currentStep !== "completo" && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
                <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </Button>
                <Button onClick={goNext} disabled={currentStep === "tipo" && !operatorType} className="gap-2">
                  {stepIndex === stepOrder.length - 2 ? "Finalizar" : "Continuar"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
