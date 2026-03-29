import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default function TransportistaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <AppSidebar
        role="transportista"
        userName="Carlos Ramírez"
        companyName="Trans Ramírez"
        verificationStatus="approved"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppTopbar
          userName="Carlos Ramírez"
          role="transportista"
          notificationCount={3}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
