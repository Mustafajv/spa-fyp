import React from 'react'
import { Shield, ShieldAlert, Zap, Terminal, Lock, Bug } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function HomePage({ onNavigate }) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20 animate-pulse-glow mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight mb-3">
          <span className="text-foreground">SPA </span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SEC
          </span>
          <span className="text-foreground"> LAB</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Interactive demonstration of security vulnerabilities in Single Page Applications
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <Badge variant="default">Educational</Badge>
          <Badge variant="critical">OWASP Top 10</Badge>
          <Badge variant="success">Interactive</Badge>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-4 stagger-children">
        {/* Vulnerable Mode Card */}
        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-card hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-foreground font-mono text-sm">VULNERABLE MODE</h3>
                <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest">Exploitable</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                'XSS attacks possible',
                'JWT stored in localStorage',
                'Insecure direct object references',
                'No rate limiting on auth',
                'NoSQL injection vectors',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Secure Mode Card */}
        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-card hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-foreground font-mono text-sm">SECURE MODE</h3>
                <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">Protected</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                'Input sanitization & encoding',
                'HttpOnly secure cookies',
                'Backend auth validation',
                'Rate limiting & brute-force protection',
                'Parameterized queries',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Demo categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        {[
          { icon: Bug, label: 'XSS', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { icon: Lock, label: 'IDOR', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { icon: Zap, label: 'Rate Limit', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { icon: Terminal, label: 'NoSQL Inj', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${item.bg} hover:scale-105 transition-transform`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
            <span className="text-xs font-mono font-bold text-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-2 pb-4">
        <Button
          size="lg"
          onClick={() => onNavigate('login')}
          className="animate-pulse-glow font-mono tracking-wide"
        >
          <Zap className="w-4 h-4" />
          LAUNCH DEMO
        </Button>
      </div>
    </div>
  )
}

export default HomePage
