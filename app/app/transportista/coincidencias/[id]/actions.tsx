"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { updateMatchStatus } from "@/lib/supabase/queries";

export function CarrierMatchActions({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setError(null);
    setAccepting(true);
    try {
      const supabase = createClient();
      await updateMatchStatus(supabase, matchId, "negotiating");
      router.push("/app/transportista");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al aceptar");
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    setError(null);
    setRejecting(true);
    try {
      const supabase = createClient();
      await updateMatchStatus(supabase, matchId, "rejected");
      router.push("/app/transportista");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al rechazar");
      setRejecting(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAccept}
          disabled={accepting || rejecting}
        >
          {accepting
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Confirmando...</>
            : <><CheckCircle2 className="w-4 h-4" />Confirmar disponibilidad</>
          }
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleReject}
          disabled={accepting || rejecting}
          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          {rejecting
            ? <><span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />Rechazando...</>
            : <><X className="w-4 h-4" />No puedo tomar esta carga</>
          }
        </Button>
      </div>
      <p className="text-xs text-ink-400 text-center">
        Al confirmar, el embarcador recibe una notificación y puede proceder al pago en custodia.
      </p>
    </div>
  );
}
