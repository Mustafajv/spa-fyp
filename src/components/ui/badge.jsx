import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary",
        critical:
          "border-red-500/30 bg-red-500/15 text-red-400",
        high:
          "border-orange-500/30 bg-orange-500/15 text-orange-400",
        medium:
          "border-yellow-500/30 bg-yellow-500/15 text-yellow-400",
        low:
          "border-blue-500/30 bg-blue-500/15 text-blue-400",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        destructive:
          "border-red-500/30 bg-red-500/15 text-red-400",
        outline:
          "border-border text-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
