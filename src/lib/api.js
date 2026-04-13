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

export default api;
