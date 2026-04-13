import React from 'react'
import { Shield, Home, LayoutDashboard, LogOut, Bug, User } from 'lucide-react'
import SecurityModeToggle from '@/components/shared/SecurityModeToggle'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
]

function Sidebar({ currentView, onNavigate, user, vulnerabilityMode, onToggleMode, onLogout }) {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse-glow">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-tight font-mono">
            SPA <span className="text-primary">SEC</span> LAB
          </h1>
          <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
            vulnerability demo
          </p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Mode Toggle */}
      <div className="p-4">
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2.5">
          Security Mode
        </p>
        <SecurityModeToggle mode={vulnerabilityMode} onToggle={onToggleMode} />
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          if (item.requiresAuth && !user) return null
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground border border-transparent"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </button>
          )
        })}

        {!user && (
          <>
            <button
              onClick={() => onNavigate('login')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                currentView === 'login'
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground border border-transparent"
              )}
            >
              <User className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => onNavigate('register')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                currentView === 'register'
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground border border-transparent"
              )}
            >
              <Bug className="w-4 h-4" />
              Register
            </button>
          </>
        )}
      </nav>

      {/* User Area */}
      {user && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.username}</p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[9px] text-zinc-600 font-mono text-center leading-relaxed">
          FYP Security Demo<br />
          Open DevTools (F12)
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
