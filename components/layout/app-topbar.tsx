"use client";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppTopbarProps {
  userName: string;
  role: "embarcador" | "transportista";
  notificationCount?: number;
  pageTitle?: string;
}

export function AppTopbar({ userName, role, notificationCount = 0, pageTitle }: AppTopbarProps) {
  const roleLabel = role === "embarcador" ? "Embarcador" : "Transportista";

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        {pageTitle && <h2 className="text-base font-semibold text-ink-900">{pageTitle}</h2>}
      </div>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="relative">
          <Link href="/app/notificaciones">
            <Bell className="w-5 h-5 text-ink-500" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
        </Button>
        <div className="flex items-center gap-2 pl-3 border-l border-surface-200">
          <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center">
            <span className="text-ink-700 text-xs font-semibold">
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-ink-800">{userName}</p>
            <p className="text-xs text-ink-400">{roleLabel}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-ink-400" />
        </div>
      </div>
    </header>
  );
}
