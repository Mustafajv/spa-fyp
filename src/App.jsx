import React, { useState, useEffect, useCallback } from 'react'
import AppShell from '@/components/layout/AppShell'
import HomePage from '@/components/pages/HomePage'
import LoginPage from '@/components/auth/LoginPage'
import RegisterPage from '@/components/auth/RegisterPage'
import DashboardPage from '@/components/pages/DashboardPage'
import api from '@/lib/api'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [vulnerabilityMode, setVulnerabilityMode] = useState('vulnerable')
  const [loading, setLoading] = useState(true)

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.getMe()
        if (data?.success) {
          setUser(data.user)
          setCurrentView('dashboard')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('authToken')
    setUser(null)
    setCurrentView('home')
  }

  const toggleMode = () => {
    setVulnerabilityMode(prev => prev === 'vulnerable' ? 'secure' : 'vulnerable')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse-glow mx-auto mb-4">
            <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground font-mono">Initializing security lab...</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell
      currentView={currentView}
      onNavigate={setCurrentView}
      user={user}
      vulnerabilityMode={vulnerabilityMode}
      onToggleMode={toggleMode}
      onLogout={handleLogout}
    >
      {currentView === 'home' && (
        <HomePage onNavigate={setCurrentView} />
      )}
      {currentView === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigate={setCurrentView}
          vulnerabilityMode={vulnerabilityMode}
        />
      )}
      {currentView === 'register' && (
        <RegisterPage
          onRegister={handleRegister}
          onNavigate={setCurrentView}
        />
      )}
      {currentView === 'dashboard' && user && (
        <DashboardPage
          user={user}
          vulnerabilityMode={vulnerabilityMode}
        />
      )}
    </AppShell>
  )
}

export default App
