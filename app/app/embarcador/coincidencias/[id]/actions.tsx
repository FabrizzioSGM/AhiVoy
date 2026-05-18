"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateMatchStatusAction } from "@/lib/supabase/match-actions";

export function MatchActions({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReject = async () => {
    setError(null);
    setRejecting(true);
    const result = await updateMatchStatusAction(matchId, "rejected");
    if (result.success) {
      router.push("/app/embarcador");
    } else {
      setError(result.error ?? "Error al rechazar");
      setRejecting(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="flex-1 gap-2">
          <Link href={`/app/embarcador/pago/${matchId}`}>
            <Shield className="w-4 h-4" />Aceptar y pagar en custodia
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleReject}
          disabled={rejecting}
          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          {rejecting
            ? <><span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />Rechazando...</>
            : <><X className="w-4 h-4" />Rechazar</>
          }
        </Button>
      </div>
    </div>
  );
}
