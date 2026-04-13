import React, { useState } from 'react'
import { Key } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

function NoSQLInjectionDemo() {
  const [noSqlResult, setNoSqlResult] = useState(null)
  const [noSqlTarget, setNoSqlTarget] = useState('admin')

  const tryNoSqlInjection = async (mode) => {
    try {
      const injectionPayload = { "$gt": "" }

      const result = mode === 'vulnerable'
        ? await api.noSqlInjectionDemo(noSqlTarget, injectionPayload)
        : await api.noSqlInjectionSecure(noSqlTarget, injectionPayload)

      setNoSqlResult({ mode, ...result })
    } catch (error) {
      console.error('NoSQL injection error:', error)
    }
  }

  return (
    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 to-amber-900 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        <div className="relative flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center shadow-lg">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white font-mono">NoSQL Injection</h3>
            <p className="text-yellow-200 text-xs mt-1">Database Query Manipulation</p>
          </div>
          <Badge variant="critical" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-threat-pulse" />
            A03:2021
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 space-y-5">
        <p className="text-sm text-muted-foreground">
          NoSQL injection allows attackers to manipulate database queries by injecting operators like{' '}
          <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-yellow-400 text-xs font-mono">{"$gt"}</code>,{' '}
          <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-yellow-400 text-xs font-mono">{"$ne"}</code>.
        </p>

        {/* Injection Payload */}
        <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Injection Payload</p>
          <p className="font-mono text-xs text-yellow-400">
            {`{ "username": "${noSqlTarget}", "password": { "$gt": "" } }`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            The <code className="text-yellow-400">{"$gt: \"\""}</code> operator means "greater than empty string" — <span className="text-red-400 font-semibold">always true</span>, bypassing password validation!
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center flex-wrap">
          <label className="text-sm text-muted-foreground font-mono shrink-0">Target:</label>
          <Input
            value={noSqlTarget}
            onChange={(e) => setNoSqlTarget(e.target.value)}
            className="w-28 font-mono text-xs"
          />
          <Button variant="destructive" size="sm" onClick={() => tryNoSqlInjection('vulnerable')}>
            🔓 Inject (Vulnerable)
          </Button>
          <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => tryNoSqlInjection('secure')}>
            🔒 Inject (Sanitized)
          </Button>
        </div>

        {/* Result */}
        {noSqlResult && (
          <div className={`p-4 rounded-lg text-sm animate-fade-in ${
            noSqlResult.bypassed
              ? 'bg-red-500/10 border border-red-500/20'
              : noSqlResult.blocked
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-zinc-900 border border-zinc-800'
          }`}>
            {noSqlResult.bypassed && (
              <div className="text-red-400 font-bold font-mono text-sm mb-2 flex items-center gap-2">
                ⚠️ Authentication Bypassed!
              </div>
            )}
            {noSqlResult.blocked && (
              <div className="text-emerald-400 font-bold font-mono text-sm mb-2 flex items-center gap-2">
                🛡️ Injection Attempt Blocked!
              </div>
            )}
            <pre className="whitespace-pre-wrap overflow-x-auto font-mono text-xs text-muted-foreground">
              {JSON.stringify(noSqlResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NoSQLInjectionDemo
