import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Segunda capa de seguridad — el middleware es la primera.
// Si alguien bypassea el middleware por cualquier razón,
// este layout lo detiene antes de renderizar nada.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect(profile?.role === "transportista" ? "/app/transportista" : "/app/embarcador");
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-ink-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">Z</span>
          </div>
          <span className="font-semibold">ZzingRush Admin</span>
          <span className="text-xs bg-ink-700 text-ink-300 px-2 py-0.5 rounded-full">Panel interno</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-300">
          <div className="w-2 h-2 rounded-full bg-trust-green" />
          {user.email}
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
