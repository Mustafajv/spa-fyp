import React, { useState } from 'react'
import { Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Terminal from '@/components/shared/Terminal'
import api from '@/lib/api'

function RateLimitDemo() {
  const [bruteForceResults, setBruteForceResults] = useState([])
  const [isAttacking, setIsAttacking] = useState(false)
  const [bruteForceCount, setBruteForceCount] = useState(0)

  const simulateBruteForce = async (mode) => {
    setIsAttacking(true)
    setBruteForceResults([])
    setBruteForceCount(0)

    const passwords = ['password', '123456', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master']
    const results = []

    for (let i = 0; i < passwords.length; i++) {
      try {
        const result = mode === 'vulnerable'
          ? await api.bruteForceVulnerable('admin', passwords[i])
          : await api.bruteForceProtected('admin', passwords[i])

        results.push({
          attempt: i + 1,
          password: passwords[i],
          ...result
        })
        setBruteForceResults([...results])
        setBruteForceCount(i + 1)

        if (result.blocked || result.status === 429) break
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error('Brute force error:', error)
      }
    }
    setIsAttacking(false)
  }

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-900 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        <div className="relative flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white font-mono">Rate Limiting Demo</h3>
            <p className="text-amber-200 text-xs mt-1">Brute Force Protection</p>
          </div>
          <Badge variant="high" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-threat-pulse" />
            A07:2021
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Without rate limiting, attackers can try unlimited password combinations.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => simulateBruteForce('vulnerable')}
            disabled={isAttacking}
          >
            {isAttacking ? '⏳ Attacking...' : '🔓 Attack (No Protection)'}
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => simulateBruteForce('secure')}
            disabled={isAttacking}
          >
            {isAttacking ? '⏳ Attacking...' : '🔒 Attack (Rate Limited)'}
          </Button>
        </div>

        {bruteForceResults.length > 0 && (
          <Terminal title="brute-force-sim" className="animate-fade-in">
            <div className="text-zinc-500 mb-2">
              Brute Force Attack Simulation — Target: <span className="text-amber-400">admin</span>
            </div>
            {bruteForceResults.map((r, i) => (
              <div
                key={i}
                className={
                  r.blocked ? 'text-red-500' :
                  r.success ? 'text-emerald-400' :
                  'text-yellow-500'
                }
              >
                <span className="text-zinc-600">[{r.attempt}]</span> Password: "<span className="text-zinc-300">{r.password}</span>" →{' '}
                {r.blocked ? '🚫 BLOCKED' : r.success ? '✅ SUCCESS!' : '❌ Failed'}
                {r.vulnerability && <span className="text-zinc-600"> (unprotected)</span>}
                {r.secure && <span className="text-zinc-600"> (rate limited)</span>}
              </div>
            ))}
            {bruteForceResults[bruteForceResults.length - 1]?.blocked && (
              <div className="mt-2 text-cyan-400 font-bold">
                🛡️ Rate limiting stopped the attack after {bruteForceCount} attempts!
              </div>
            )}
          </Terminal>
        )}
      </CardContent>
    </Card>
  )
}

export default RateLimitDemo
