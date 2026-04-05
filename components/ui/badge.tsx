import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
        secondary:
          "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
        destructive:
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        outline:
          "text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
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
