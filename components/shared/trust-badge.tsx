import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/types";

interface TrustBadgeProps {
  status: VerificationStatus;
  label?: string;
  size?: "sm" | "md";
}

export function TrustBadge({ status, label, size = "sm" }: TrustBadgeProps) {
  const config = {
    approved: {
      icon: CheckCircle2,
      text: label ?? "Verificado",
      className: "bg-trust-greenLight text-trust-green border-green-200",
    },
    pending: {
      icon: Clock,
      text: label ?? "Pendiente",
      className: "bg-trust-amberLight text-trust-amber border-amber-200",
    },
    in_review: {
      icon: Clock,
      text: label ?? "En revisión",
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
    needs_action: {
      icon: AlertCircle,
      text: label ?? "Requiere acción",
      className: "bg-trust-redLight text-trust-red border-red-200",
    },
    rejected: {
      icon: XCircle,
      text: label ?? "Rechazado",
      className: "bg-trust-redLight text-trust-red border-red-200",
    },
  };

  const { icon: Icon, text, className } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {text}
    </span>
  );
}
