"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-trust-greenLight flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-trust-green" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Contraseña actualizada</h1>
          <p className="text-sm text-ink-500 mb-6">Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.</p>
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Ir a iniciar sesión <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-accent-600 tracking-tight">
            <span className="text-ink-900">Z</span> ZzingRush
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Nueva contraseña</h1>
        <p className="text-sm text-ink-500 mb-6">Ingresa tu nueva contraseña.</p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <Input
              id="confirm"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Actualizando...
              </span>
            ) : (
              <>Actualizar contraseña <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
