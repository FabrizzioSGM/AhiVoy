"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = await signIn({ email, password });
      // Redirect based on role stored in user metadata
      const role = user?.user_metadata?.role;
      if (role === "transportista") {
        router.push("/app/transportista");
      } else {
        router.push("/app/embarcador");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      if (message.includes("Invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else if (message.includes("Email not confirmed")) {
        setError("Confirma tu correo electrónico antes de iniciar sesión.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-ink-900 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="text-white font-semibold text-lg">ZzingRush</span>
        </Link>
        <div>
          <blockquote className="text-ink-200 text-xl leading-relaxed mb-6">
            "Pasamos de cerrar fletes por WhatsApp a tener trazabilidad completa en cada envío.
            El proceso de verificación nos da seguridad que antes no teníamos."
          </blockquote>
          <p className="text-ink-400 text-sm">— Ricardo H., Director de Logística · Grupo BIMSA</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <Shield className="w-4 h-4 text-trust-green" />
          Plataforma verificada y operada en México
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">Z</span>
              </div>
              <span className="text-ink-900 font-semibold">ZzingRush</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-ink-900 mb-2">Iniciar sesión</h1>
          <p className="text-ink-500 text-sm mb-8">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-accent-600 hover:underline font-medium">
              Regístrate gratis
            </Link>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tucorreo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-xs text-accent-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                  required
                  disabled={loading}
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

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-xs text-ink-400 mb-3">Acceso de demostración</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const { user } = await signIn({ email: "test-embarcador@zzingrush.test", password: "Test1234!" });
                      router.push("/app/embarcador");
                    } catch { setError("Cuenta demo no disponible."); setLoading(false); }
                  }}
                  disabled={loading}
                  className="text-xs"
                >
                  Ver demo embarcador
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const { user } = await signIn({ email: "test-transportista@zzingrush.test", password: "Test1234!" });
                      router.push("/app/transportista");
                    } catch { setError("Cuenta demo no disponible."); setLoading(false); }
                  }}
                  disabled={loading}
                  className="text-xs"
                >
                  Ver demo transportista
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-ink-400">
            Al iniciar sesión aceptas nuestros{" "}
            <Link href="#" className="underline hover:text-ink-600">Términos de servicio</Link>{" "}
            y{" "}
            <Link href="#" className="underline hover:text-ink-600">Política de privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
