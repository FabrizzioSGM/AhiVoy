"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-700">{label}</span>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(i)}
            className="p-0.5"
          >
            <Star className={`w-5 h-5 transition-colors ${i <= (hover || value) ? "text-amber-500 fill-amber-500" : "text-ink-200"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function RatingForm({ matchId, shipmentId, revieweeId, carrierName }: {
  matchId: string;
  shipmentId: string;
  revieweeId: string;
  carrierName: string;
}) {
  const router = useRouter();
  const [overall, setOverall] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [documentation, setDocumentation] = useState(0);
  const [cargoCondition, setCargoCondition] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overall === 0) { setError("Selecciona una calificación general."); return; }
    if (punctuality === 0 || communication === 0 || documentation === 0) {
      setError("Completa todas las categorías."); return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipmentId,
          revieweeId,
          overall,
          punctuality,
          communication,
          documentation,
          cargoCondition: cargoCondition || null,
          comment: comment.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al enviar calificación");
      }
      router.push("/app/embarcador");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-4">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-700 font-bold">
              {carrierName.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-ink-900">{carrierName}</p>
          </div>
          <div className="space-y-4">
            <StarRating value={overall} onChange={setOverall} label="Calificación general" />
            <StarRating value={punctuality} onChange={setPunctuality} label="Puntualidad" />
            <StarRating value={communication} onChange={setCommunication} label="Comunicación" />
            <StarRating value={documentation} onChange={setDocumentation} label="Documentación" />
            <StarRating value={cargoCondition} onChange={setCargoCondition} label="Estado de la carga (opcional)" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-5">
          <label className="text-sm font-medium text-ink-700 mb-2 block">Comentario (opcional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Cómo fue tu experiencia con este transportista?"
            className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent-500"
            maxLength={500}
          />
          <p className="text-xs text-ink-300 mt-1 text-right">{comment.length}/500</p>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar calificación"}
      </Button>
    </form>
  );
}
