import React, { useState } from 'react'
import { Database } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

function IDORDemo({ user }) {
  const [allUsers, setAllUsers] = useState([])
  const [targetUserId, setTargetUserId] = useState('')
  const [idorResult, setIdorResult] = useState(null)

  const fetchAllUsers = async (mode) => {
    try {
      const result = mode === 'vulnerable'
        ? await api.getAllUsersVulnerable()
        : await api.getAllUsersSecure()

      if (result.success) {
        setAllUsers(result.users)
        setIdorResult({ type: 'list', mode, ...result })
      }
    } catch (error) {
      console.error('Fetch users error:', error)
    }
  }

  const accessUserProfile = async (mode) => {
    if (!targetUserId.trim()) {
      alert('Please enter a user ID')
      return
    }
    try {
      const result = mode === 'vulnerable'
        ? await api.getUserByIdVulnerable(targetUserId)
        : await api.getUserByIdSecure(targetUserId)
      setIdorResult({ type: 'access', mode, ...result })
    } catch (error) {
      console.error('Access user error:', error)
    }
  }

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 to-purple-900 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        <div className="relative flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white font-mono">IDOR Demo</h3>
            <p className="text-violet-200 text-xs mt-1">Insecure Direct Object Reference</p>
          </div>
          <Badge variant="high" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-threat-pulse" />
            A01:2021
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 space-y-5">
        {/* Current User */}
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Logged in as</p>
          <p className="text-sm font-semibold text-violet-400 font-mono mt-1">
            {user?.username} <span className="text-muted-foreground">({user?.role})</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">ID: {user?.id}</p>
        </div>

        {/* List All Users */}
        <div className="p-4 rounded-lg border border-zinc-800 space-y-3">
          <h4 className="text-sm font-bold text-violet-300 font-mono flex items-center gap-2">
            📋 List All Users
          </h4>
          <div className="flex gap-2 flex-wrap">
            <Button variant="destructive" size="sm" onClick={() => fetchAllUsers('vulnerable')}>
              🔓 Vulnerable (No Check)
            </Button>
            <Button variant="success" size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => fetchAllUsers('secure')}>
              🔒 Secure (Auth Check)
            </Button>
          </div>
          <div className="text-[11px] space-y-1">
            <p className="text-red-400">🔓 Vulnerable: Any user can list ALL users</p>
            <p className="text-emerald-400">🔒 Secure: Regular users see only their own profile</p>
          </div>
        </div>

        {/* Access User by ID */}
        <div className="p-4 rounded-lg border border-zinc-800 space-y-3">
          <h4 className="text-sm font-bold text-violet-300 font-mono flex items-center gap-2">
            👤 Access User by ID
          </h4>
          <Input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="Enter user ID to access"
            className="font-mono text-xs"
          />
          <div className="flex gap-2 flex-wrap">
            <Button variant="destructive" size="sm" onClick={() => accessUserProfile('vulnerable')}>
              🔓 Vulnerable Access
            </Button>
            <Button variant="success" size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => accessUserProfile('secure')}>
              🔒 Secure Access
            </Button>
          </div>
          <div className="text-[11px] space-y-1">
            <p className="text-red-400">🔓 Vulnerable: Access ANY user's profile</p>
            <p className="text-emerald-400">🔒 Secure: Can only access your own profile</p>
          </div>

          {allUsers.length > 0 && (
            <div className="p-2 bg-zinc-900 rounded-lg">
              <span className="text-xs font-semibold text-muted-foreground font-mono">Try other users: </span>
              <div className="flex gap-1.5 flex-wrap mt-1.5">
                {allUsers.filter(u => u._id !== user?.id).slice(0, 3).map(u => (
                  <button
                    key={u._id}
                    onClick={() => setTargetUserId(u._id)}
                    className="px-2.5 py-1 text-xs bg-violet-500/15 text-violet-300 rounded-md border border-violet-500/20 hover:bg-violet-500/25 transition-colors cursor-pointer font-mono"
                  >
                    {u.username}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        {idorResult && (
          <div className={`p-4 rounded-lg text-sm animate-fade-in ${
            idorResult.vulnerability
              ? 'bg-red-500/10 border border-red-500/20'
              : idorResult.secure
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-zinc-900 border border-zinc-800'
          }`}>
            <pre className="whitespace-pre-wrap overflow-x-auto font-mono text-xs text-muted-foreground">
              {JSON.stringify(idorResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default IDORDemo
