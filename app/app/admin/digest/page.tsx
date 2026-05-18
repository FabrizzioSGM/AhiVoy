import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DigestManager } from "./digest-manager";

export default async function AdminDigestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink-900 mb-2">Email Digest Manager</h1>
      <p className="text-sm text-ink-500 mb-6">
        Agrega novedades y envía el digest semanal a todos los usuarios registrados.
      </p>
      <DigestManager />
    </div>
  );
}
