"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const reasons = [
  "Carga dañada",
  "Carga perdida / no entregada",
  "Retraso significativo",
  "Documentación incorrecta",
  "Comportamiento inapropiado",
  "Cobro indebido",
  "Otro",
];

export function ClaimForm({ shipmentId }: { shipmentId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) { setError("Selecciona un motivo."); return; }
    if (description.trim().length < 20) { setError("Describe el incidente con más detalle (mínimo 20 caracteres)."); return; }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipmentId, reason, description: description.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al enviar reclamo");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-ink-900 mb-1">Reclamo registrado</h2>
          <p className="text-sm text-ink-500 mb-4">
            Nuestro equipo revisará tu caso en las próximas 24-48 horas. Los fondos en custodia permanecen bloqueados hasta la resolución.
          </p>
          <Button onClick={() => router.push("/app/embarcador")} className="w-full">
            Volver al dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-4">
        <CardContent className="p-5 space-y-4">
          <div>
            <Label className="mb-2 block">Motivo del reclamo</Label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label key={r} className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 cursor-pointer hover:border-accent-300 hover:bg-accent-50 transition-colors">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-accent-500"
                  />
                  <span className="text-sm text-ink-800">{r}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="mb-2 block">Descripción del incidente</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo que ocurrió con el mayor detalle posible..."
              className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-accent-500"
              maxLength={2000}
            />
            <p className="text-xs text-ink-300 mt-1 text-right">{description.length}/2000</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full gap-2 bg-red-600 hover:bg-red-700" disabled={loading}>
        <AlertCircle className="w-4 h-4" />
        {loading ? "Enviando..." : "Enviar reclamo"}
      </Button>
      <p className="text-xs text-ink-400 text-center mt-3">
        Los fondos en custodia quedan bloqueados automáticamente al abrir un reclamo.
      </p>
    </form>
  );
}
