import React from 'react'

function Terminal({ children, title = 'Terminal', className = '' }) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-[#0d1117] overflow-hidden shadow-xl shadow-black/30 ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-zinc-800">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm shadow-red-500/30" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm shadow-yellow-500/30" />
          <span className="w-3 h-3 rounded-full bg-[#27ca40] shadow-sm shadow-green-500/30" />
        </div>
        <span className="text-xs text-zinc-500 font-mono ml-2">{title}</span>
      </div>
      {/* Content */}
      <div className="p-4 font-mono text-xs leading-relaxed max-h-64 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default Terminal
