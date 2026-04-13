import React from 'react'
import { Shield, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

function SecurityModeToggle({ mode, onToggle }) {
  const isVulnerable = mode === 'vulnerable'

  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer overflow-hidden group",
        isVulnerable
          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
          : "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
      )}
    >
      {/* Shimmer overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

      {isVulnerable ? (
        <ShieldAlert className="w-4 h-4 relative z-10" />
      ) : (
        <Shield className="w-4 h-4 relative z-10" />
      )}
      <span className="relative z-10 font-mono tracking-wide">
        {isVulnerable ? 'VULNERABLE' : 'SECURE'}
      </span>

      {/* Pulse dot */}
      <span className={cn(
        "relative z-10 w-2 h-2 rounded-full",
        isVulnerable
          ? "bg-red-300 animate-threat-pulse"
          : "bg-emerald-300 animate-pulse-glow"
      )} />
    </button>
  )
}

export default SecurityModeToggle
