import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent-100 text-accent-700",
        secondary: "bg-surface-100 text-ink-700",
        outline: "border border-surface-200 text-ink-700",
        success: "bg-trust-greenLight text-trust-green",
        warning: "bg-trust-amberLight text-trust-amber",
        danger: "bg-trust-redLight text-trust-red",
        ink: "bg-ink-900 text-white",
        elite: "bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
