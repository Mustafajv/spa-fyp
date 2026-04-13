import React, { useState } from 'react'
import { User, ArrowRight, Terminal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

function LoginPage({ onLogin, onNavigate, vulnerabilityMode }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.login(form.username, form.password)

      if (result.success) {
        if (vulnerabilityMode === 'vulnerable') {
          localStorage.setItem('authToken', btoa(JSON.stringify(result.user)))
        }
        onLogin(result.user)
      } else {
        setError(result.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Terminal-style prompt */}
        <div className="flex items-center gap-2 mb-6 font-mono text-xs text-muted-foreground">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary">$</span>
          <span>authenticate --user</span>
          <span className="w-2 h-4 bg-primary/60 animate-terminal-blink" />
        </div>

        <Card className="border-zinc-800 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-mono">
              <span className="text-primary">auth</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-foreground">login</span>
              <span className="text-muted-foreground">()</span>
            </CardTitle>
            <CardDescription>Sign in to access the security lab</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground font-mono">username</label>
                <Input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground font-mono">password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 font-mono" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                No account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors"
                >
                  Register
                </button>
              </p>
            </div>

            {/* Vulnerable mode hint */}
            {vulnerabilityMode === 'vulnerable' && (
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
                ⚠️ Token will be stored in localStorage (check DevTools → Application)
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
