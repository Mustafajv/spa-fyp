import React, { useState, useEffect, useCallback } from 'react'
import { Shield, Lock, Unlock, MessageSquare, Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import XSSDemo from '@/components/demos/XSSDemo'
import IDORDemo from '@/components/demos/IDORDemo'
import RateLimitDemo from '@/components/demos/RateLimitDemo'
import NoSQLInjectionDemo from '@/components/demos/NoSQLInjectionDemo'
import api from '@/lib/api'

function DashboardPage({ user, vulnerabilityMode }) {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [secrets, setSecrets] = useState(null)

  const fetchComments = useCallback(async () => {
    try {
      const data = await api.getComments()
      if (data.success) setComments(data.comments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }, [])

  useEffect(() => { fetchComments() }, [fetchComments])

  useEffect(() => {
    const fetchSecrets = async () => {
      if (user?.role === 'admin') {
        const data = await api.getSecrets()
        if (data?.success) setSecrets(data.secrets)
      }
    }
    fetchSecrets()
  }, [user])

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return
    try {
      const result = await api.postComment(comment)
      if (result.success) {
        fetchComments()
      } else {
        alert(result.message || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Post comment error:', error)
      alert('Failed to post comment. Make sure you are logged in.')
    }
    setComment('')
  }

  const renderAdminPanel = () => {
    if (vulnerabilityMode === 'vulnerable') {
      const demoSecrets = { apiKey: 'sk_live_51234567890abcdef', dbPassword: 'P@ssw0rd123!' }
      return (
        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono">
              <Unlock className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Admin Panel</span>
              <span className="text-muted-foreground text-xs font-normal">(Insecure)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">API Key</p>
              <p className="font-mono text-sm text-red-400 break-all mt-1">{demoSecrets.apiKey}</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Database Password</p>
              <p className="font-mono text-sm text-red-400 mt-1">{demoSecrets.dbPassword}</p>
            </div>
            <Alert variant="danger">
              This data is exposed client-side! Anyone can access it via browser console.
            </Alert>
          </CardContent>
        </Card>
      )
    }

    if (user?.role !== 'admin') {
      return (
        <Card className="border-zinc-800">
          <CardContent className="p-6 text-center text-muted-foreground font-mono text-sm">
            Access Denied — Admin Only
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 font-mono">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400">Admin Panel</span>
            <span className="text-muted-foreground text-xs font-normal">(Secured)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {secrets ? (
            <>
              <Alert variant="success">Data fetched securely from backend</Alert>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">API Key</p>
                <p className="font-mono text-sm text-emerald-400 break-all mt-1">{secrets.apiKey}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Database Password</p>
                <p className="font-mono text-sm text-emerald-400 mt-1">{secrets.dbPassword}</p>
              </div>
            </>
          ) : (
            <p className="text-emerald-400 text-sm font-mono">
              Backend validates authentication before sending sensitive data.
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold font-mono">
          Welcome, <span className="text-primary">{user?.username}</span>
          <span className="text-sm font-normal text-muted-foreground ml-2">({user?.role})</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Security lab dashboard — explore vulnerability demos below</p>
      </div>

      {/* Comments Section */}
      <Card className="border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 font-mono">
            <MessageSquare className="w-5 h-5 text-primary" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
              className="flex-1 h-10"
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <Button onClick={handleCommentSubmit} className="h-10 px-5 font-mono">
              <Send className="w-4 h-4" />
              Post
            </Button>
          </div>

          {vulnerabilityMode === 'vulnerable' && (
            <Alert variant="warning">
              <span className="font-mono text-xs">
                Try XSS: <code className="bg-zinc-800 px-1.5 py-0.5 rounded">&lt;img src=x onerror="alert('XSS')"&gt;</code>
              </span>
            </Alert>
          )}

          <Separator />

          <div className="space-y-2">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 font-mono">No comments yet</p>
            ) : (
              comments.map((c, i) => (
                <div key={c._id || i} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <p className="text-xs font-semibold text-primary font-mono">
                    {c.username || c.user?.username || 'Anonymous'}
                  </p>
                  {vulnerabilityMode === 'vulnerable' ? (
                    <div className="text-sm text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: c.text }} />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{c.text}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Panel */}
      {user?.role === 'admin' && renderAdminPanel()}

      {/* Security Demos */}
      <div className="pt-4">
        <h2 className="text-xl font-bold font-mono flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span>Vulnerability <span className="text-primary">Demos</span></span>
        </h2>

        <div className="space-y-6 stagger-children">
          <XSSDemo />
          <IDORDemo user={user} />
          <RateLimitDemo />
          <NoSQLInjectionDemo />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
