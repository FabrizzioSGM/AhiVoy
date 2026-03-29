import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default function EmbarcadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <AppSidebar
        role="embarcador"
        userName="Ricardo Hernández"
        companyName="Grupo BIMSA"
        verificationStatus="approved"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppTopbar
          userName="Ricardo Hernández"
          role="embarcador"
          notificationCount={2}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
