"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Package, Building2, FileText, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = [
  { id: "empresa", label: "Tu empresa", icon: Building2 },
  { id: "fiscal", label: "Datos fiscales", icon: FileText },
  { id: "perfil", label: "Perfil de envíos", icon: Package },
  { id: "completo", label: "Verificación", icon: Shield },
];

type StepId = "empresa" | "fiscal" | "perfil" | "completo";

const stepOrder: StepId[] = ["empresa", "fiscal", "perfil", "completo"];

export default function EmbarcadorOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<StepId>("empresa");
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
      {/* Header */}
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

      {/* Progress */}
      <div className="bg-white border-b border-surface-200">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    done ? "bg-trust-green text-white" : active ? "bg-accent-500 text-white" : "bg-surface-200 text-ink-400"
                  )}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={cn("text-xs hidden sm:block", active ? "text-ink-900 font-medium" : "text-ink-400")}>{step.label}</span>
                  {i < steps.length - 1 && <div className="w-6 h-px bg-surface-200 hidden sm:block" />}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
            {currentStep === "empresa" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-accent-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Cuéntanos sobre tu empresa</h2>
                <p className="text-sm text-ink-500 mb-6">Esta información será verificada por nuestro equipo.</p>
                <div className="space-y-4">
                  <div>
                    <Label>Razón social</Label>
                    <Input placeholder="Mi Empresa S.A. de C.V." className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Nombre comercial (opcional)</Label>
                    <Input placeholder="Como te conocen tus clientes" className="mt-1.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ciudad</Label>
                      <Input placeholder="Ciudad de México" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input placeholder="CDMX" className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <Label>Giro o industria</Label>
                    <Input placeholder="Manufactura, retail, distribución..." className="mt-1.5" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "fiscal" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-accent-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Datos fiscales</h2>
                <p className="text-sm text-ink-500 mb-6">Necesarios para generar tus CFDI automáticamente.</p>
                <div className="space-y-4">
                  <div>
                    <Label>RFC</Label>
                    <Input placeholder="ABC123456789" className="mt-1.5 font-mono" maxLength={13} />
                    <p className="text-xs text-ink-400 mt-1">Se validará contra el SAT automáticamente.</p>
                  </div>
                  <div>
                    <Label>Dirección fiscal completa</Label>
                    <Input placeholder="Av. Insurgentes Sur 1443, Col. Insurgentes Mixcoac" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Código postal fiscal</Label>
                    <Input placeholder="03920" className="mt-1.5" maxLength={5} />
                  </div>
                  <div>
                    <Label>Régimen fiscal</Label>
                    <Input placeholder="601 - General de Ley Personas Morales" className="mt-1.5" />
                  </div>
                  <div className="bg-surface-50 border border-surface-200 rounded-lg p-3 text-xs text-ink-500">
                    Tu información fiscal solo se usa para la generación de CFDI.
                    No se comparte con transportistas ni terceros.
                  </div>
                </div>
              </div>
            )}

            {currentStep === "perfil" && (
              <div>
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center mb-4">
                  <Package className="w-5 h-5 text-accent-600" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-1">Perfil de envíos</h2>
                <p className="text-sm text-ink-500 mb-6">Esto ayuda al sistema a encontrar mejores coincidencias para ti.</p>
                <div className="space-y-4">
                  <div>
                    <Label>Tipos de carga que envías con frecuencia</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["Carga general", "Manufactura", "Alimentos", "Electrodomésticos", "Textiles", "Autopartes", "Materiales de construcción", "Productos químicos"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="text-xs px-3 py-1.5 rounded-full border border-surface-200 text-ink-600 hover:border-accent-400 hover:bg-accent-50 hover:text-accent-700 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Rutas más frecuentes</Label>
                    <Input placeholder="Ej. CDMX → Monterrey, Guadalajara → Querétaro" className="mt-1.5" />
                    <p className="text-xs text-ink-400 mt-1">Separadas por coma. Esto mejora las recomendaciones.</p>
                  </div>
                  <div>
                    <Label>Peso promedio por envío (kg)</Label>
                    <Input type="number" placeholder="5000" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Frecuencia estimada de envíos</Label>
                    <Input placeholder="2 veces por semana, 1 por quincena..." className="mt-1.5" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "completo" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-trust-greenLight flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-trust-green" />
                </div>
                <h2 className="text-xl font-bold text-ink-900 mb-2">Cuenta creada con éxito</h2>
                <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
                  Nuestro equipo revisará tu información y aprobará tu perfil en menos de 24 horas.
                  Te notificaremos por correo y dentro de la app.
                </p>
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 text-left mb-6">
                  <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-3">Estado de verificación</p>
                  {["Cuenta creada", "Correo confirmado", "Revisión de empresa en proceso"].map((item, i) => (
                    <div key={item} className={cn("flex items-center gap-3 py-1.5", i === 2 ? "text-trust-amber" : "text-trust-green")}>
                      <CheckCircle2 className={cn("w-4 h-4", i === 2 ? "text-trust-amber" : "text-trust-green")} />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/app/embarcador">
                    Ir a mi dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Navigation */}
            {currentStep !== "completo" && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
                <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </Button>
                <Button onClick={goNext} className="gap-2">
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
