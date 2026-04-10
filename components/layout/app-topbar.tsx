"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AppTopbarProps {
  userName: string;
  role: "embarcador" | "transportista";
  notificationCount?: number;
  pageTitle?: string;
}

export function AppTopbar({ userName, role, notificationCount = 0, pageTitle }: AppTopbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const roleLabel = role === "embarcador" ? "Embarcador" : "Transportista";
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        {pageTitle && <h2 className="text-base font-semibold text-ink-900">{pageTitle}</h2>}
      </div>
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <Button asChild variant="ghost" size="icon" className="relative">
          <Link href={`/app/${role}/notificaciones`}>
            <Bell className="w-5 h-5 text-ink-500" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
        </Button>

        {/* Usuario + menú */}
        <div className="relative pl-3 border-l border-surface-200">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2 hover:bg-surface-50 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center flex-shrink-0">
              <span className="text-ink-700 text-xs font-semibold">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-ink-800 leading-tight">{userName}</p>
              <p className="text-xs text-ink-400">{roleLabel}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-ink-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <>
              {/* Overlay para cerrar */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-surface-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  {loggingOut
                    ? <span className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                    : <LogOut className="w-4 h-4" />
                  }
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
