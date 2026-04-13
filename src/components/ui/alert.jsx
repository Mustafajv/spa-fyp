import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react"

const alertIcons = {
  danger: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const alertStyles = {
  danger: "border-red-500/30 bg-red-500/10 text-red-300 [&>svg]:text-red-400",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 [&>svg]:text-emerald-400",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 [&>svg]:text-yellow-400",
  info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 [&>svg]:text-cyan-400",
}

function Alert({ className, variant = "info", children, ...props }) {
  const Icon = alertIcons[variant]

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border p-4 text-sm",
        alertStyles[variant],
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export { Alert }
