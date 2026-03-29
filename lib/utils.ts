import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(new Date(dateStr));
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
  return `${kg.toLocaleString("es-MX")} kg`;
}

export function formatDistance(km: number): string {
  return `${km.toLocaleString("es-MX")} km`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function getVerificationLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En revisión",
    approved: "Verificado",
    rejected: "Rechazado",
    needs_action: "Requiere acción",
  };
  return labels[status] ?? status;
}

export function getShipmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Borrador",
    published: "Publicado",
    matching: "Buscando",
    matched: "Coincidencia",
    confirmed: "Confirmado",
    escrow_funded: "Pago en custodia",
    in_transit: "En tránsito",
    delivered: "Entregado",
    completed: "Completado",
    cancelled: "Cancelado",
    disputed: "En disputa",
  };
  return labels[status] ?? status;
}

export function getMatchStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    suggested: "Sugerido",
    viewed: "Visto",
    negotiating: "Negociando",
    accepted: "Aceptado",
    rejected: "Rechazado",
    expired: "Expirado",
  };
  return labels[status] ?? status;
}

export function getRouteLabel(origin: string, destination: string): string {
  return `${origin} → ${destination}`;
}

export function getReputationTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    nuevo: "Nuevo",
    verificado: "Verificado",
    confiable: "Confiable",
    elite: "Élite",
  };
  return labels[tier] ?? tier;
}

export function calculateSavingsPercent(savings: number, original: number): number {
  if (original === 0) return 0;
  return Math.round((savings / original) * 100);
}
