import React, { useState } from 'react'
import { UserPlus, ArrowRight, Terminal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

function RegisterPage({ onRegister, onNavigate }) {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await api.register(form.username, form.password)

      if (result.success) {
        onRegister(result.user)
      } else {
        setError(result.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Register error:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Terminal prompt */}
        <div className="flex items-center gap-2 mb-6 font-mono text-xs text-muted-foreground">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">$</span>
          <span>user --create --new</span>
          <span className="w-2 h-4 bg-emerald-400/60 animate-terminal-blink" />
        </div>

        <Card className="border-zinc-800 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-mono">
              <span className="text-emerald-400">user</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-foreground">create</span>
              <span className="text-muted-foreground">()</span>
            </CardTitle>
            <CardDescription>Create a new account for the security lab</CardDescription>
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
                  placeholder="At least 3 characters"
                  minLength={3}
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
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground font-mono">confirm_password</label>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" variant="success" className="w-full h-11 font-mono bg-gradient-to-r from-emerald-600 to-cyan-500 text-white hover:brightness-110" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Creating account...</span>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors"
                >
                  Login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
