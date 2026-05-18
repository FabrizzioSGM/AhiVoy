"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateMatchStatusAction } from "@/lib/supabase/match-actions";
import { formatCurrency } from "@/lib/utils";

export function ConfirmEscrowButton({ matchId, total }: { matchId: string; total: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    const result = await updateMatchStatusAction(matchId, "accepted");
    if (result.success) {
      router.push("/app/embarcador");
      router.refresh();
    } else {
      setError(result.error ?? "Error al procesar el pago");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
      <Button size="lg" className="w-full gap-2" onClick={handleConfirm} disabled={loading}>
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Procesando...</>
        ) : (
          <><Shield className="w-4 h-4" />Confirmar y depositar {formatCurrency(total)} en custodia<ArrowRight className="w-4 h-4" /></>
        )}
      </Button>
    </div>
  );
}
