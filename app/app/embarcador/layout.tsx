import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default async function EmbarcadorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: company }, { count: unreadCount }] = await Promise.all([
    supabase.from("profiles").select("name").eq("id", user.id).single(),
    supabase.from("companies").select("trade_name, legal_name, verification_status").eq("user_id", user.id).maybeSingle(),
    supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false),
  ]);

  const userName = profile?.name ?? user.email ?? "Usuario";
  const companyName = company?.trade_name ?? company?.legal_name ?? undefined;
  const verificationStatus = company?.verification_status ?? "pending";

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <AppSidebar
        role="embarcador"
        userName={userName}
        companyName={companyName}
        verificationStatus={verificationStatus}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppTopbar
          userName={userName}
          role="embarcador"
          notificationCount={unreadCount ?? 0}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
