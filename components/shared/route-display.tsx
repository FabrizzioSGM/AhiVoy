import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteDisplayProps {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RouteDisplay({
  originCity,
  originState,
  destinationCity,
  destinationState,
  size = "md",
  className,
}: RouteDisplayProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <MapPin className={cn("text-ink-400 flex-shrink-0", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
        <div>
          <p className={cn("font-semibold text-ink-900", size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base")}>
            {originCity}
          </p>
          <p className="text-xs text-ink-400">{originState}</p>
        </div>
      </div>
      <ArrowRight className={cn("text-ink-300 flex-shrink-0", size === "sm" ? "w-3 h-3" : "w-5 h-5")} />
      <div className="flex items-center gap-1">
        <MapPin className={cn("text-accent-500 flex-shrink-0", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
        <div>
          <p className={cn("font-semibold text-ink-900", size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base")}>
            {destinationCity}
          </p>
          <p className="text-xs text-ink-400">{destinationState}</p>
        </div>
      </div>
    </div>
  );
}
