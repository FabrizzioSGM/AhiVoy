"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VerificationActions({ carrierId }: { carrierId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "approve" | "reject") => {
    setError(null);
    setLoading(action);
    try {
      const res = await fetch("/api/admin/verify-carrier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrierId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      router.refresh(); // Recarga los datos del server component sin navegar
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al procesar");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-1.5">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{error}</p>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
          onClick={() => handleAction("reject")}
          disabled={loading !== null}
        >
          {loading === "reject"
            ? <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
            : <XCircle className="w-3.5 h-3.5" />
          }
          Rechazar
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs gap-1.5"
          onClick={() => handleAction("approve")}
          disabled={loading !== null}
        >
          {loading === "approve"
            ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            : <CheckCircle2 className="w-3.5 h-3.5" />
          }
          Aprobar
        </Button>
      </div>
    </div>
  );
}
