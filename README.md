# 🛡️ SPA Security Lab

An interactive Single Page Application demonstrating common web security vulnerabilities and their mitigations. Built as a Final Year Project to educate developers about secure coding practices.

![Security](https://img.shields.io/badge/Security-Educational-ef4444)
![React 19](https://img.shields.io/badge/React-19-61dafb)
![Tailwind v4](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-fafafa)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248)

---

## Overview

This project provides hands-on demonstrations of security vulnerabilities commonly found in Single Page Applications. Each vulnerability has both a **vulnerable** and **secure** implementation, letting users understand attack vectors and learn proper mitigation techniques in a safe, controlled environment.

### Vulnerabilities Demonstrated

| Vulnerability | Description | OWASP |
|---|---|---|
| **XSS** (Cross-Site Scripting) | Inject malicious scripts into web pages via comments, URLs, or DOM manipulation | A03:2021 |
| **IDOR** (Insecure Direct Object Reference) | Access unauthorized resources by manipulating object IDs | A01:2021 |
| **NoSQL Injection** | Bypass authentication using MongoDB operator injection (`$gt`, `$ne`) | A03:2021 |
| **Brute Force / Rate Limiting** | Unlimited login attempts without throttling or lockout | A07:2021 |
| **Insecure Token Storage** | JWT stored in localStorage vs HttpOnly cookies | A07:2021 |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI component library |
| Vite | 7.2 | Build tool & dev server |
| Tailwind CSS | 4.2 | Utility-first CSS (v4 CSS-first config) |
| shadcn/ui | — | Accessible component primitives (new-york style) |
| class-variance-authority | 0.7 | Component variant management |
| Lucide React | 0.562 | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4.18 | Web framework |
| MongoDB + Mongoose | 8.0 | Database + ODM |
| bcryptjs | 2.4 | Password hashing |
| jsonwebtoken | 9.0 | JWT authentication |
| express-rate-limit | 8.2 | Rate limiting middleware |
| helmet | 7.1 | Security headers (CSP, etc.) |
| cookie-parser | 1.4 | HttpOnly cookie handling |

---

## Installation

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or Atlas)
- **npm**

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spa-fyp.git
   cd spa-fyp
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure environment**
   ```bash
   # In /server directory
   cp .env.example .env
   ```

   Edit `server/.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/spa-security-demo
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run seed
   ```

6. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend** (in a separate terminal)
   ```bash
   # From project root
   npm run dev
   ```

   The frontend runs at `http://localhost:5173` and proxies API calls to `http://localhost:5001`.

---

## Usage

### Default Accounts (after seeding)

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `user` | `user123` | User |

### Security Mode Toggle

The app has a global **Vulnerable / Secure** toggle in the sidebar. Switch between modes to see how each vulnerability behaves with and without protections.

### Demo Walkthroughs

#### XSS (Cross-Site Scripting)
1. Log in and navigate to the Dashboard
2. Scroll to the **XSS Demo** panel
3. Pick a payload from the **Payload Arsenal** (e.g., Image Error) or type a custom one
4. Click **INJECT** to see side-by-side comparison: vulnerable output executes the script, secure output escapes it
5. Try posting XSS payloads in the **Comments** section with Vulnerable mode on

#### IDOR (Insecure Direct Object Reference)
1. Log in as a regular user
2. In the **IDOR Demo**, click **🔓 Vulnerable (No Check)** to list all users
3. Copy another user's ID and try **🔓 Vulnerable Access** — you'll see their data
4. Switch to **🔒 Secure Access** — access is denied unless you own the profile

#### Rate Limiting / Brute Force
1. Click **🔓 Attack (No Protection)** — all 8 password attempts go through
2. Click **🔒 Attack (Rate Limited)** — the server blocks after 5 attempts with `429 Too Many Requests`

#### NoSQL Injection
1. Enter a target username (default: `admin`)
2. Click **🔓 Inject (Vulnerable)** — authentication bypassed using `{"$gt": ""}` operator
3. Click **🔒 Inject (Sanitized)** — the injection is detected and blocked

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create new account | No |
| `POST` | `/api/auth/login` | Authenticate user | No |
| `POST` | `/api/auth/logout` | Clear session | No |
| `GET` | `/api/auth/me` | Get current user | Yes |

### Comments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/comments` | List all comments | Yes |
| `POST` | `/api/comments` | Post a comment | Yes |

### Admin

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/admin/secrets` | Get secret data (admin only) | Yes (admin) |

### Vulnerability Demos

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vulnerable/users` | List all users (no auth check) |
| `GET` | `/api/vulnerable/users/:id` | Get user by ID (no ownership check) |
| `GET` | `/api/vulnerable/secure/users` | List users (auth-gated) |
| `GET` | `/api/vulnerable/secure/users/:id` | Get user (ownership verified) |
| `POST` | `/api/vulnerable/login-demo` | Login vulnerable to NoSQL injection |
| `POST` | `/api/vulnerable/login-secure` | Login with input sanitization |
| `POST` | `/api/vulnerable/brute-force` | Login with no rate limit |
| `POST` | `/api/vulnerable/brute-force-protected` | Login rate-limited to 5/min |

---

## Security Best Practices Demonstrated

### XSS Prevention
- Use React's default JSX text escaping (`{value}`) instead of `dangerouslySetInnerHTML`
- Sanitize user input with DOMPurify
- Implement Content Security Policy (CSP) headers via Helmet.js
- Store tokens in HttpOnly cookies, not localStorage

### IDOR Prevention
- Verify resource ownership on every request (`req.user._id === resource.owner`)
- Implement role-based access control (RBAC)
- Return `403 Forbidden` for unauthorized access

### NoSQL Injection Prevention
- Type-check inputs — reject objects where strings are expected
- Strip MongoDB operators (`$gt`, `$ne`, `$regex`) from user input
- Use parameterized queries

### Rate Limiting
- Limit login attempts per IP using `express-rate-limit` (5 per minute)
- Return `429 Too Many Requests` with retry-after headers
- Implement account lockout after repeated failures

---

## Design

The UI uses a **"Cyber Command Center"** aesthetic — a dark, atmospheric interface with:

- **Dark zinc-950 background** with scan-line overlays and grid patterns
- **Cyan primary accent** (`#06b6d4`) for secure state, **crimson red** for vulnerable state
- **JetBrains Mono** for terminal/code elements, **DM Sans** for body text
- **shadcn/ui components** (Button, Card, Input, Badge, Alert) with custom variants
- **Sidebar navigation** with animated security mode toggle
- **Responsive** — sidebar collapses to hamburger menu on mobile
- **Staggered fade-in animations** for page load delight

---


## License

MIT License — see [LICENSE](LICENSE) for details.

---
