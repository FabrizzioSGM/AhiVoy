"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Route, Handshake, MapPin, Star,
  FileText, Settings, Bell, ChevronRight, TruckIcon, CreditCard,
  ShieldCheck, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const shipperNav: SidebarNavItem[] = [
  { href: "/app/embarcador", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/embarcador/envios", label: "Mis envíos", icon: Package, badge: 2 },
  { href: "/app/embarcador/coincidencias", label: "Coincidencias", icon: Handshake, badge: 1 },
  { href: "/app/embarcador/seguimiento", label: "Seguimiento", icon: MapPin },
  { href: "/app/embarcador/reputacion", label: "Reputación", icon: Star },
  { href: "/app/embarcador/documentos", label: "Documentos", icon: FileText },
];

const carrierNav: SidebarNavItem[] = [
  { href: "/app/transportista", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/transportista/rutas", label: "Mis rutas", icon: Route },
  { href: "/app/transportista/coincidencias", label: "Cargas disponibles", icon: Handshake, badge: 3 },
  { href: "/app/transportista/seguimiento", label: "Seguimiento", icon: MapPin },
  { href: "/app/transportista/cobros", label: "Cobros", icon: CreditCard },
  { href: "/app/transportista/reputacion", label: "Reputación", icon: Star },
];

const bottomNav: SidebarNavItem[] = [
  { href: "/app/verificacion", label: "Verificación", icon: ShieldCheck },
  { href: "/app/soporte", label: "Soporte", icon: HelpCircle },
  { href: "/app/configuracion", label: "Configuración", icon: Settings },
];

interface AppSidebarProps {
  role: "embarcador" | "transportista";
  userName: string;
  companyName?: string;
  verificationStatus?: string;
}

export function AppSidebar({ role, userName, companyName, verificationStatus }: AppSidebarProps) {
  const pathname = usePathname();
  const navItems = role === "embarcador" ? shipperNav : carrierNav;

  return (
    <aside className="w-64 bg-white border-r border-surface-200 flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-surface-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">Z</span>
          </div>
          <span className="text-ink-900 font-semibold text-base">ZzingRush</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center flex-shrink-0">
            <span className="text-ink-700 text-sm font-semibold">
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-900 truncate">{userName}</p>
            {companyName && <p className="text-xs text-ink-400 truncate">{companyName}</p>}
          </div>
        </div>
        {verificationStatus === "approved" && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-trust-green font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-trust-green" />
            Verificado
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  active
                    ? "bg-accent-50 text-accent-700"
                    : "text-ink-600 hover:bg-surface-50 hover:text-ink-900"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-accent-600" : "text-ink-400 group-hover:text-ink-600")} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="default" className="text-xs px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-100 space-y-0.5">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  active
                    ? "bg-accent-50 text-accent-700"
                    : "text-ink-500 hover:bg-surface-50 hover:text-ink-800"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-ink-400 group-hover:text-ink-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
