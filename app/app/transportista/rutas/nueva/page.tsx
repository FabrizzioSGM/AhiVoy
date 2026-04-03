"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, TruckIcon, MapPin, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createRoute, getCarrierProfileByUserId } from "@/lib/supabase/queries";

const CARGO_TYPES = ["Carga general", "Manufactura", "Electrodomésticos", "Alimentos", "Textiles", "Papel", "Autopartes"];

export default function NuevaRutaPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "preview" | "published">("form");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [selectedCargo, setSelectedCargo] = useState<string[]>([]);

  // Controlled form state
  const [originCity, setOriginCity] = useState("Monterrey");
  const [originState, setOriginState] = useState("Nuevo León");
  const [destinationCity, setDestinationCity] = useState("Ciudad de México");
  const [destinationState, setDestinationState] = useState("CDMX");
  const [capacityKg, setCapacityKg] = useState("14000");
  const [capacityM3, setCapacityM3] = useState("70");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pricePerKm, setPricePerKm] = useState("");

  const toggleCargo = (tag: string) =>
    setSelectedCargo(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const estimatedEarnings = pricePerKm
    ? Math.round(parseFloat(pricePerKm) * 938 * 0.965)
    : null;

  const handlePublish = async () => {
    setPublishError(null);
    setPublishing(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");

      const carrierProfile = await getCarrierProfileByUserId(supabase, user.id);
      if (!carrierProfile) throw new Error("Completa tu onboarding de transportista primero");

      await createRoute(supabase, {
        carrierId: carrierProfile.id,
        originCity: originCity || "Sin especificar",
        originState: originState || "Sin especificar",
        destinationCity: destinationCity || "Sin especificar",
        destinationState: destinationState || "Sin especificar",
        departureDateFrom: dateFrom || new Date().toISOString().split("T")[0],
        departureDateTo: dateTo || dateFrom || new Date().toISOString().split("T")[0],
        availableCapacityKg: parseFloat(capacityKg) || 0,
        availableCapacityM3: capacityM3 ? parseFloat(capacityM3) : undefined,
        pricePerKm: pricePerKm ? parseFloat(pricePerKm) : undefined,
        acceptedCargoTypes: selectedCargo.length > 0 ? selectedCargo : ["Carga general"],
      });

      setStep("published");
    } catch (err: unknown) {
      setPublishError(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setPublishing(false);
    }
  };

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
                <div><Label>Ciudad de origen</Label><Input placeholder="Monterrey" className="mt-1.5" value={originCity} onChange={e => setOriginCity(e.target.value)} /></div>
                <div><Label>Estado</Label><Input placeholder="Nuevo León" className="mt-1.5" value={originState} onChange={e => setOriginState(e.target.value)} /></div>
                <div><Label>Ciudad de destino</Label><Input placeholder="Ciudad de México" className="mt-1.5" value={destinationCity} onChange={e => setDestinationCity(e.target.value)} /></div>
                <div><Label>Estado</Label><Input placeholder="CDMX" className="mt-1.5" value={destinationState} onChange={e => setDestinationState(e.target.value)} /></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2"><TruckIcon className="w-4 h-4 text-ink-400" />Capacidad disponible</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Capacidad (kg)</Label><Input type="number" placeholder="14000" className="mt-1.5" value={capacityKg} onChange={e => setCapacityKg(e.target.value)} /></div>
                <div><Label>Capacidad (m³)</Label><Input type="number" placeholder="70" className="mt-1.5" value={capacityM3} onChange={e => setCapacityM3(e.target.value)} /></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-3">Fechas de salida</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Desde</Label><Input type="date" className="mt-1.5" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
                <div><Label>Hasta</Label><Input type="date" className="mt-1.5" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
              </div>
            </div>
            <div>
              <Label>Tipos de carga que aceptas</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CARGO_TYPES.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCargo(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedCargo.includes(tag)
                        ? "border-accent-400 bg-accent-50 text-accent-700"
                        : "border-surface-200 text-ink-600 hover:border-accent-400 hover:bg-accent-50 hover:text-accent-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Precio por km (MXN) — opcional</Label>
              <Input type="number" placeholder="12.50" className="mt-1.5" value={pricePerKm} onChange={e => setPricePerKm(e.target.value)} />
              <p className="text-xs text-ink-400 mt-1">Puedes dejarlo vacío y negociar con los embarcadores.</p>
            </div>
            <Button onClick={() => setStep("preview")} size="lg" className="w-full gap-2">
              Ver resumen y publicar <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent></Card>
        </div>
      )}

      {step === "preview" && (
        <div>
          <button onClick={() => setStep("form")} className="text-sm text-ink-400 hover:text-ink-700 mb-6 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />Editar ruta
          </button>
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Resumen de tu ruta</h1>
          <p className="text-sm text-ink-500 mb-6">Revisa los datos antes de publicar.</p>
          <Card className="mb-4"><CardContent className="p-6 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-ink-400">Origen: </span><span className="font-medium text-ink-800">{originCity}, {originState}</span></div>
            <div><span className="text-ink-400">Destino: </span><span className="font-medium text-ink-800">{destinationCity}, {destinationState}</span></div>
            <div><span className="text-ink-400">Capacidad: </span><span className="font-medium text-ink-800">{parseInt(capacityKg || "0").toLocaleString("es-MX")} kg{capacityM3 ? ` / ${capacityM3} m³` : ""}</span></div>
            <div><span className="text-ink-400">Fecha: </span><span className="font-medium text-ink-800">{dateFrom || "—"}{dateTo && dateTo !== dateFrom ? ` – ${dateTo}` : ""}</span></div>
            <div><span className="text-ink-400">Carga aceptada: </span><span className="font-medium text-ink-800">{selectedCargo.length > 0 ? selectedCargo.join(", ") : "Carga general"}</span></div>
            {pricePerKm && <div><span className="text-ink-400">Precio/km: </span><span className="font-medium text-ink-800">${pricePerKm} MXN</span></div>}
          </CardContent></Card>
          {estimatedEarnings && (
            <div className="bg-trust-greenLight border border-green-200 rounded-xl p-5 mb-6 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-trust-green flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-trust-green">Ganancia potencial estimada</p>
                <p className="text-2xl font-bold text-trust-green">{formatCurrency(estimatedEarnings)}</p>
                <p className="text-xs text-green-600">Neto después de comisión ZzingRush (3.5%)</p>
              </div>
            </div>
          )}
          {publishError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{publishError}</p>
          )}
          <Button onClick={handlePublish} size="lg" className="w-full gap-2" disabled={publishing}>
            {publishing ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Publicando...</>
            ) : (
              <>Publicar ruta <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}

      {step === "published" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-trust-greenLight flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-trust-green" />
          </div>
          <h2 className="text-xl font-bold text-ink-900 mb-2">Ruta publicada</h2>
          <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
            ZzingRush está buscando cargas compatibles con tu ruta {originCity} → {destinationCity}. Te notificamos cuando haya una solicitud compatible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/app/transportista/rutas/nueva")}>Publicar otra ruta</Button>
            <Button onClick={() => router.push("/app/transportista")}>
              Ir al dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
