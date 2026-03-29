import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
  accent?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, accent }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-surface-200 shadow-card p-6", accent && "border-accent-200 bg-accent-50", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-500 truncate">{title}</p>
          <p className={cn("text-2xl font-bold mt-1", accent ? "text-accent-700" : "text-ink-900")}>{value}</p>
          {subtitle && <p className="text-xs text-ink-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs mt-1.5 font-medium", trend.positive ? "text-trust-green" : "text-trust-red")}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", accent ? "bg-accent-100" : "bg-surface-100")}>
            <Icon className={cn("w-5 h-5", accent ? "text-accent-600" : "text-ink-500")} />
          </div>
        )}
      </div>
    </div>
  );
}
