"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, TruckIcon, MapPin, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function NuevaRutaPage() {
  const [step, setStep] = useState<"form" | "preview" | "published">("form");

  return (
    <div className="max-w-2xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href="/app/transportista"><ArrowLeft className="w-4 h-4" />Dashboard</Link>
      </Button>

      {step === "form" && (
        <div>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Publicar ruta de retorno</h1>
          <p className="text-sm text-ink-500 mb-6">Indica tu ruta, capacidad disponible y fechas. ZzingRush encuentra cargas compatibles.</p>
          <Card><CardContent className="p-6 space-y-5">
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-ink-400" />Ruta</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Ciudad de origen</Label><Input placeholder="Monterrey" className="mt-1.5" defaultValue="Monterrey" /></div>
                <div><Label>Estado</Label><Input placeholder="Nuevo León" className="mt-1.5" defaultValue="Nuevo León" /></div>
                <div><Label>Ciudad de destino</Label><Input placeholder="Ciudad de México" className="mt-1.5" defaultValue="Ciudad de México" /></div>
                <div><Label>Estado</Label><Input placeholder="CDMX" className="mt-1.5" defaultValue="CDMX" /></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2"><TruckIcon className="w-4 h-4 text-ink-400" />Capacidad disponible</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Capacidad (kg)</Label><Input type="number" placeholder="14000" className="mt-1.5" defaultValue="14000" /></div>
                <div><Label>Capacidad (m³)</Label><Input type="number" placeholder="70" className="mt-1.5" defaultValue="70" /></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-3">Fechas de salida</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Desde</Label><Input type="date" className="mt-1.5" defaultValue="2025-02-10" /></div>
                <div><Label>Hasta</Label><Input type="date" className="mt-1.5" defaultValue="2025-02-11" /></div>
              </div>
            </div>
            <div>
              <Label>Tipos de carga que aceptas</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Carga general", "Manufactura", "Electrodomésticos", "Alimentos", "Textiles", "Papel", "Autopartes"].map((tag) => (
                  <button key={tag} type="button" className="text-xs px-3 py-1.5 rounded-full border border-surface-200 text-ink-600 hover:border-accent-400 hover:bg-accent-50 hover:text-accent-700 transition-colors">{tag}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Precio por km (MXN) — opcional</Label>
              <Input type="number" placeholder="12.50" className="mt-1.5" defaultValue="12.50" />
              <p className="text-xs text-ink-400 mt-1">Puedes dejarlo vacío y negociar con los embarcadores.</p>
            </div>
            <Button onClick={() => setStep("preview")} size="lg" className="w-full gap-2">Ver resumen y publicar <ArrowRight className="w-4 h-4" /></Button>
          </CardContent></Card>
        </div>
      )}

      {step === "preview" && (
        <div>
          <button onClick={() => setStep("form")} className="text-sm text-ink-400 hover:text-ink-700 mb-6 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Editar ruta</button>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Resumen de tu ruta</h1>
          <p className="text-sm text-ink-500 mb-6">Revisa los datos antes de publicar.</p>
          <Card className="mb-4"><CardContent className="p-6 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-ink-400">Origen: </span><span className="font-medium text-ink-800">Monterrey, NL</span></div>
            <div><span className="text-ink-400">Destino: </span><span className="font-medium text-ink-800">CDMX</span></div>
            <div><span className="text-ink-400">Capacidad: </span><span className="font-medium text-ink-800">14,000 kg / 70 m³</span></div>
            <div><span className="text-ink-400">Fecha: </span><span className="font-medium text-ink-800">10–11 Feb 2025</span></div>
            <div><span className="text-ink-400">Distancia est.: </span><span className="font-medium text-ink-800">938 km</span></div>
            <div><span className="text-ink-400">Precio/km: </span><span className="font-medium text-ink-800">$12.50 MXN</span></div>
          </CardContent></Card>
          <div className="bg-trust-greenLight border border-green-200 rounded-xl p-5 mb-6 flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-trust-green flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-trust-green">Ganancia potencial estimada</p>
              <p className="text-2xl font-bold text-trust-green">{formatCurrency(11725)}</p>
              <p className="text-xs text-green-600">Neto después de comisión ZzingRush (3.5%)</p>
            </div>
          </div>
          <Button onClick={() => setStep("published")} size="lg" className="w-full gap-2">Publicar ruta <ArrowRight className="w-4 h-4" /></Button>
        </div>
      )}

      {step === "published" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-trust-greenLight flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-trust-green" />
          </div>
          <h2 className="text-xl font-bold text-ink-900 mb-2">Ruta publicada</h2>
          <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">ZzingRush está buscando cargas compatibles con tu ruta MTY → CDMX. Te notificamos cuando haya una solicitud compatible.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline"><Link href="/app/transportista/rutas/nueva">Publicar otra ruta</Link></Button>
            <Button asChild><Link href="/app/transportista">Ir al dashboard <ArrowRight className="w-4 h-4" /></Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
