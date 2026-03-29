import { Shield, MapPin, Lock, Star, FileCheck, CreditCard } from "lucide-react";

const trustItems = [
  { icon: Shield, label: "Verificación de identidad" },
  { icon: Lock, label: "Pago en custodia" },
  { icon: MapPin, label: "GPS en tiempo real" },
  { icon: FileCheck, label: "CFDI garantizado" },
  { icon: CreditCard, label: "Seguro de carga" },
  { icon: Star, label: "Sistema de reputación" },
];

export function TrustBar() {
  return (
    <div className="bg-surface-50 border-y border-surface-200">
      <div className="container-page py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-ink-600">
              <Icon className="w-4 h-4 text-trust-green flex-shrink-0" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
