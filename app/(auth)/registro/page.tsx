"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Package, TruckIcon, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";
import { signUp } from "@/lib/auth";

function RegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("rol") as "embarcador" | "transportista" | null;
  const [selectedRole, setSelectedRole] = useState<"embarcador" | "transportista" | null>(initialRole);
  const [step, setStep] = useState<"role" | "form">(initialRole ? "form" : "role");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const roles = [
    {
      id: "embarcador" as const,
      icon: Package,
      title: "Soy embarcador",
      desc: "Tengo una empresa o negocio y necesito mover carga de forma regular.",
      benefits: ["Transportistas verificados", "Pago en custodia", "CFDI automático"],
    },
    {
      id: "transportista" as const,
      icon: TruckIcon,
      title: "Soy transportista",
      desc: "Tengo una unidad o flota y tengo capacidad de retorno disponible.",
      benefits: ["Pago garantizado antes de salir", "Cargas compatibles con mi ruta", "Cobro en 24 horas"],
    },
  ];

  const handleSelectRole = (role: "embarcador" | "transportista") => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setError(null);
    setLoading(true);

    try {
      await signUp({
        email,
        password,
        name,
        phone,
        role: selectedRole,
        companyName: company,
      });

      // Show success — Supabase sends confirmation email by default
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la cuenta";
      if (message.includes("already registered") || message.includes("already exists")) {
        setError("Ya existe una cuenta con ese correo. ¿Quieres iniciar sesión?");
      } else if (message.includes("Password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 mb-3">¡Cuenta creada!</h1>
          <p className="text-ink-500 mb-2">
            Te enviamos un correo de confirmación a <strong>{email}</strong>.
          </p>
          <p className="text-ink-400 text-sm mb-8">
            Confirma tu correo para activar tu cuenta y comenzar el proceso de verificación.
          </p>
          <Button onClick={() => router.push("/login")} size="lg" className="w-full">
            Ir a iniciar sesión <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Opera con más control. <br />
            <span className="text-accent-400">Sin la incertidumbre de lo informal.</span>
          </h2>
          <div className="space-y-3">
            {[
              "Verificación de identidad y empresa",
              "Pago protegido en custodia",
              "GPS en tiempo real",
              "CFDI automático",
              "Sin registro de pago",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-trust-green flex-shrink-0" />
                <span className="text-ink-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <Shield className="w-4 h-4 text-trust-green" />
          Plataforma verificada y operada en México
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">Z</span>
              </div>
              <span className="text-ink-900 font-semibold">ZzingRush</span>
            </Link>
          </div>

          {step === "role" ? (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-2">¿Cómo quieres usar ZzingRush?</h1>
              <p className="text-ink-500 text-sm mb-8">Elige tu rol para personalizar tu experiencia desde el inicio.</p>
              <div className="space-y-4">
                {roles.map(({ id, icon: Icon, title, desc, benefits }) => (
                  <button
                    key={id}
                    onClick={() => handleSelectRole(id)}
                    className="w-full text-left p-6 rounded-xl border-2 border-surface-200 hover:border-accent-300 hover:bg-accent-50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-100 group-hover:bg-accent-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-5 h-5 text-ink-600 group-hover:text-accent-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-ink-900 mb-1">{title}</h3>
                        <p className="text-sm text-ink-500 mb-3">{desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {benefits.map((b) => (
                            <span key={b} className="text-xs bg-surface-100 text-ink-600 px-2 py-0.5 rounded-full">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-accent-600 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-ink-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-accent-600 hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setStep("role")}
                className="text-sm text-ink-400 hover:text-ink-700 mb-6 flex items-center gap-1"
              >
                ← Cambiar rol
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center">
                  {selectedRole === "embarcador"
                    ? <Package className="w-4 h-4 text-accent-600" />
                    : <TruckIcon className="w-4 h-4 text-accent-600" />}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-ink-900">Crear cuenta</h1>
                  <p className="text-xs text-ink-400 capitalize">{selectedRole}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" required disabled={loading} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="company">
                      {selectedRole === "embarcador" ? "Nombre de la empresa" : "Empresa o nombre de operación"}
                    </Label>
                    <Input id="company" placeholder="Mi Empresa S.A. de C.V." value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1.5" required disabled={loading} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="reg-email">Correo electrónico corporativo</Label>
                    <Input id="reg-email" type="email" placeholder="tucorreo@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required disabled={loading} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" placeholder="55 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" required disabled={loading} />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Contraseña</Label>
                    <Input id="reg-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" required minLength={6} disabled={loading} />
                  </div>
                </div>

                <div className="bg-surface-50 border border-surface-200 rounded-lg p-3">
                  <p className="text-xs text-ink-500">
                    Después del registro, verificaremos tu identidad y empresa en menos de 24 horas.
                    Recibirás una notificación cuando tu perfil esté listo para operar.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                    {error.includes("iniciar sesión") && (
                      <Link href="/login" className="ml-1 underline font-medium">Ir a login</Link>
                    )}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando cuenta...
                    </span>
                  ) : (
                    <>Crear cuenta y comenzar verificación <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-ink-400">
                Al registrarte aceptas los{" "}
                <Link href="#" className="underline">Términos de servicio</Link>{" "}
                y la{" "}
                <Link href="#" className="underline">Política de privacidad</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegistroContent />
    </Suspense>
  );
}
