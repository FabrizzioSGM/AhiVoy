"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Sparkles, FileText, Package, MapPin, Calendar, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type InputMode = "ai" | "form";

const parsedExample = {
  originCity: "Ciudad de México", originState: "CDMX",
  destinationCity: "Monterrey", destinationState: "Nuevo León",
  cargoDescription: "Electrodomésticos — refrigeradores y lavadoras en pallets",
  cargoType: "Electrodomésticos", weightKg: 12000, volumeM3: 60,
  requiredDate: "2025-02-11", declaredValue: 850000,
};

export default function NuevoEnvioPage() {
  const [mode, setMode] = useState<InputMode>("ai");
  const [aiInput, setAiInput] = useState("");
  const [parsed, setParsed] = useState<typeof parsedExample | null>(null);
  const [step, setStep] = useState<"input" | "confirm" | "published">("input");

  const handleAIParse = () => { setParsed(parsedExample); setStep("confirm"); };
  const handlePublish = () => setStep("published");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-4">
          <Link href="/app/embarcador"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        </Button>
      </div>

      {step === "input" && (
        <div>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Nuevo envío</h1>
          <p className="text-sm text-ink-500 mb-6">Describe tu carga o usa el formulario guiado.</p>
          <div className="flex gap-2 mb-6">
            {([["ai", Sparkles, "Descripción libre (recomendado)"], ["form", FileText, "Formulario detallado"]] as const).map(([id, Icon, label]) => (
              <button key={id} onClick={() => setMode(id as InputMode)}
                className={cn("flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all",
                  mode === id ? "border-accent-400 bg-accent-50 text-accent-700" : "border-surface-200 text-ink-500 hover:border-surface-300")}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
          {mode === "ai" ? (
            <Card><CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-ink-800">Describe tu envío en tus palabras</span>
              </div>
              <Textarea placeholder="Ej: Necesito mover 12 toneladas de electrodomésticos de CDMX a Monterrey el 11 de febrero. Están en pallets, valor declarado aprox $850,000 pesos." value={aiInput} onChange={e => setAiInput(e.target.value)} className="min-h-[120px] mb-3 text-sm" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-400">El sistema extrae automáticamente origen, destino, peso, tipo y fecha.</p>
                <Button onClick={handleAIParse} disabled={aiInput.length < 10} className="gap-2"><Sparkles className="w-4 h-4" />Procesar</Button>
              </div>
              <div className="mt-4 p-3 bg-surface-50 rounded-lg border border-surface-200">
                <p className="text-xs font-medium text-ink-600 mb-1.5">Ejemplo:</p>
                <p className="text-xs text-ink-400">"Quiero mover materiales de empaque de CDMX a Guadalajara, como 5,500 kg, para el 18 de febrero, valor $120,000"</p>
              </div>
            </CardContent></Card>
          ) : (
            <Card><CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-ink-400" />Origen</Label><Input placeholder="Ciudad de México" className="mt-1.5" /></div>
                <div><Label>Estado origen</Label><Input placeholder="CDMX" className="mt-1.5" /></div>
                <div><Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent-500" />Destino</Label><Input placeholder="Monterrey" className="mt-1.5" /></div>
                <div><Label>Estado destino</Label><Input placeholder="Nuevo León" className="mt-1.5" /></div>
              </div>
              <div><Label>Descripción de la carga</Label><Textarea placeholder="Electrodomésticos en pallets, cajas de cartón..." className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Peso total (kg)</Label><Input type="number" placeholder="12000" className="mt-1.5" /></div>
                <div><Label>Volumen (m³)</Label><Input type="number" placeholder="60" className="mt-1.5" /></div>
                <div><Label className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-ink-400" />Fecha requerida</Label><Input type="date" className="mt-1.5" /></div>
                <div><Label>Valor declarado (MXN)</Label><Input type="number" placeholder="850000" className="mt-1.5" /></div>
              </div>
              <Button onClick={handleAIParse} size="lg" className="w-full gap-2">Publicar solicitud <ArrowRight className="w-4 h-4" /></Button>
            </CardContent></Card>
          )}
        </div>
      )}

      {step === "confirm" && parsed && (
        <div>
          <button onClick={() => setStep("input")} className="text-sm text-ink-400 hover:text-ink-700 mb-6 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Editar</button>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Confirma los datos del envío</h1>
          <p className="text-sm text-ink-500 mb-6">Revisa que todo esté correcto antes de publicar.</p>
          <Card className="mb-6"><CardContent className="p-6">
            <Badge variant="success" className="mb-4"><Sparkles className="w-3 h-3 mr-1" />Datos procesados por IA</Badge>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-ink-400">Origen</p><p className="font-medium text-ink-900">{parsed.originCity}, {parsed.originState}</p></div>
              <div><p className="text-xs text-ink-400">Destino</p><p className="font-medium text-ink-900">{parsed.destinationCity}, {parsed.destinationState}</p></div>
              <div><p className="text-xs text-ink-400">Tipo de carga</p><p className="font-medium text-ink-900">{parsed.cargoType}</p></div>
              <div><p className="text-xs text-ink-400">Peso</p><p className="font-medium text-ink-900">{parsed.weightKg.toLocaleString("es-MX")} kg</p></div>
              <div><p className="text-xs text-ink-400">Fecha requerida</p><p className="font-medium text-ink-900">{parsed.requiredDate}</p></div>
              <div><p className="text-xs text-ink-400">Valor declarado</p><p className="font-medium text-ink-900">${parsed.declaredValue.toLocaleString("es-MX")} MXN</p></div>
            </div>
            <div className="mt-3 pt-3 border-t border-surface-100"><p className="text-xs text-ink-400">Descripción</p><p className="text-sm text-ink-700 mt-0.5">{parsed.cargoDescription}</p></div>
          </CardContent></Card>
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-ink-500 space-y-1">
                <p className="font-medium text-ink-700">¿Qué pasa después de publicar?</p>
                <p>• Solo ves transportistas con verificación aprobada</p>
                <p>• Tu teléfono no se comparte hasta confirmar operación</p>
                <p>• Recibes notificación cuando haya una coincidencia</p>
              </div>
            </div>
          </div>
          <Button onClick={handlePublish} size="lg" className="w-full gap-2">Publicar solicitud de envío <ArrowRight className="w-4 h-4" /></Button>
        </div>
      )}

      {step === "published" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-trust-greenLight flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-trust-green" />
          </div>
          <h2 className="text-xl font-bold text-ink-900 mb-2">Solicitud publicada</h2>
          <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">ZzingRush está buscando transportistas con rutas de retorno compatibles. Te notificamos cuando haya coincidencias.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline"><Link href="/app/embarcador/envios/nuevo">Crear otro envío</Link></Button>
            <Button asChild><Link href="/app/embarcador">Ir al dashboard <ArrowRight className="w-4 h-4" /></Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
