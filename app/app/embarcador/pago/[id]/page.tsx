import Link from "next/link";
import { ArrowLeft, Shield, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { seedMatches } from "@/lib/seed-data";
import { formatCurrency } from "@/lib/utils";

export default function PagoEscrowPage({ params }: { params: { id: string } }) {
  const match = seedMatches.find(m => m.id === params.id) ?? seedMatches[0];
  const platformFee = Math.round(match.estimatedPrice * 0.035);
  const iva = Math.round(platformFee * 0.16);
  const total = match.estimatedPrice + platformFee + iva;

  return (
    <div className="max-w-2xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-500 mb-6">
        <Link href={`/app/embarcador/coincidencias/${params.id}`}><ArrowLeft className="w-4 h-4" />Detalle de coincidencia</Link>
      </Button>
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Depositar en custodia</h1>
      <p className="text-sm text-ink-500 mb-6">Los fondos quedan retenidos hasta confirmar la entrega. No se liberan antes.</p>
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3"><Lock className="w-4 h-4 text-accent-600" /><p className="text-sm font-semibold text-accent-800">¿Cómo funciona el pago en custodia?</p></div>
        <div className="space-y-2">
          {["Depositas el monto total ahora en la cuenta fiduciaria de ZzingRush.", "El transportista confirma que el pago está garantizado.", "Los fondos se liberan solo cuando confirmas la entrega correcta.", "Si hay reclamación, los fondos quedan bloqueados hasta resolución."].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-accent-700">
              <span className="w-4 h-4 rounded-full bg-accent-200 text-accent-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              {item}
            </div>
          ))}
        </div>
      </div>
      <Card className="mb-6"><CardContent className="p-6">
        <p className="text-sm font-semibold text-ink-700 mb-4">Resumen de la operación</p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm"><span className="text-ink-600">Servicio de flete</span><span className="font-medium">{formatCurrency(match.estimatedPrice)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-ink-600">Comisión ZzingRush (3.5%)</span><span className="font-medium">{formatCurrency(platformFee)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-ink-600">IVA sobre comisión (16%)</span><span className="font-medium">{formatCurrency(iva)}</span></div>
          <Separator />
          <div className="flex justify-between"><span className="font-semibold text-ink-900">Total a depositar</span><span className="text-xl font-bold text-ink-900">{formatCurrency(total)}</span></div>
        </div>
        <div className="mt-4 p-3 bg-trust-greenLight rounded-lg"><p className="text-xs text-trust-green font-medium">El CFDI se genera automáticamente al completarse la operación.</p></div>
      </CardContent></Card>
      <Card className="mb-6"><CardContent className="p-6">
        <p className="text-sm font-semibold text-ink-700 mb-4">Método de pago</p>
        <div className="space-y-3">
          {[{ label: "Transferencia bancaria (SPEI)", recommended: true }, { label: "Tarjeta de crédito o débito", recommended: false }].map(({ label, recommended }) => (
            <label key={label} className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 cursor-pointer hover:border-accent-300 hover:bg-accent-50 transition-colors">
              <input type="radio" name="payment" defaultChecked={recommended} className="accent-accent-500" />
              <span className="flex-1 text-sm font-medium text-ink-800">{label}</span>
              {recommended && <span className="text-xs text-trust-green font-medium">Recomendado</span>}
            </label>
          ))}
        </div>
      </CardContent></Card>
      <div className="flex items-start gap-3 mb-6 text-xs text-ink-500">
        <Shield className="w-4 h-4 text-trust-green flex-shrink-0 mt-0.5" />
        <p>Al confirmar, aceptas que los fondos queden en custodia hasta completar la operación. ZzingRush no libera el pago sin tu confirmación o resolución de disputa.</p>
      </div>
      <Button asChild size="lg" className="w-full gap-2">
        <Link href="/app/embarcador/seguimiento/s-3"><Shield className="w-4 h-4" />Confirmar y depositar {formatCurrency(total)} en custodia<ArrowRight className="w-4 h-4" /></Link>
      </Button>
    </div>
  );
}
