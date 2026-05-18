import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <div className="border-b border-surface-200 bg-surface-50 px-6 py-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-accent-600" />
        <span className="text-sm font-semibold text-ink-700">Panel Admin</span>
        <div className="flex gap-4 ml-6">
          <Link href="/app/admin/digest" className="text-xs text-ink-500 hover:text-accent-600 transition-colors">
            Email Digest
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
