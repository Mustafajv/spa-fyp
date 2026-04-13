import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'
import SecurityModeToggle from '@/components/shared/SecurityModeToggle'

function AppShell({ children, currentView, onNavigate, user, vulnerabilityMode, onToggleMode, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen relative">
      {/* Background effects */}
      <div className="scan-lines" />
      <div className="grid-pattern" />

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-foreground shadow-lg cursor-pointer"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile mode toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <SecurityModeToggle mode={vulnerabilityMode} onToggle={onToggleMode} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            onNavigate(view)
            setMobileOpen(false)
          }}
          user={user}
          vulnerabilityMode={vulnerabilityMode}
          onToggleMode={onToggleMode}
          onLogout={() => {
            onLogout()
            setMobileOpen(false)
          }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 relative z-10 min-h-screen">
        <div className="max-w-5xl mx-auto p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppShell
