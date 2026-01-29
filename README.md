# 🛡️ SPA Security Demo

An interactive Single Page Application demonstrating common web security vulnerabilities and their mitigations. Built as a Final Year Project to educate developers about secure coding practices.

![Security Demo](https://img.shields.io/badge/Security-Educational-red)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

## 📋 Overview

This project provides hands-on demonstrations of various security vulnerabilities commonly found in Single Page Applications. Each vulnerability has both a **vulnerable** and **secure** implementation, allowing users to understand the attack vectors and learn proper mitigation techniques.

## 🎯 Security Vulnerabilities Demonstrated

| Vulnerability | Description | OWASP Category |
|--------------|-------------|----------------|
| **XSS (Cross-Site Scripting)** | Inject malicious scripts into web pages | A7:2017 |
| **IDOR (Insecure Direct Object Reference)** | Access unauthorized resources by manipulating IDs | A5:2017 |
| **NoSQL Injection** | Bypass authentication using MongoDB operators | A1:2017 |
| **Brute Force / Rate Limiting** | Unlimited login attempts without protection | A2:2017 |
| **Insecure Token Storage** | JWT stored in localStorage vs HttpOnly cookies | A3:2017 |

## ✨ Features

- 🔓 **Vulnerable Mode**: Demonstrates how attacks work in real-time
- 🔒 **Secure Mode**: Shows proper implementation with security controls
- 📊 **Interactive Demos**: Test payloads and see immediate results
- 🎨 **Modern UI**: Dark theme with glassmorphism design
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔐 **Authentication System**: Full login/register with JWT

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Lucide React (icons)
- Custom CSS with CSS Variables

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- express-rate-limit for rate limiting
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

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

4. **Configure environment variables**
   ```bash
   # In /server directory, create .env file
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/spa-security-demo
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   node scripts/seed.js
   ```

6. **Run the application**
   
   In the root directory:
   ```bash
   npm run dev
   ```
   
   This starts both frontend (Vite) and backend (Express) concurrently.

## 🚀 Usage

### Default Accounts (after seeding)
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| user | user123 | User |

### Testing Vulnerabilities

#### XSS Demo
1. Navigate to the XSS section
2. Select a payload from the arsenal or enter custom payload
3. Click "INJECT" to see how it executes in vulnerable mode
4. Compare with secure mode where it's escaped

#### IDOR Demo
1. Log in as a regular user
2. Click "List All Users" - Vulnerable shows all, Secure shows only your profile
3. Try accessing another user's ID to see the difference

#### NoSQL Injection
1. Enter a target username (e.g., "admin")
2. Click "Inject (Vulnerable)" - bypasses password check
3. Click "Inject (Sanitized)" - blocks the attack

#### Rate Limiting
1. Click "Attack (No Protection)" - unlimited attempts
2. Click "Attack (Rate Limited)" - blocks after 5 attempts

## 📁 Project Structure

```
fyp/
├── src/                    # Frontend source
│   ├── components/
│   │   └── VulnerableSPADemo.jsx
│   ├── App.jsx
│   └── index.css
├── server/                 # Backend source
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication
│   │   └── rate-limit.js  # Rate limiting
│   ├── models/
│   │   ├── User.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js        # Auth routes
│   │   ├── vulnerable-auth.js  # Demo routes
│   │   └── vulnerable-users.js # IDOR demo
│   ├── scripts/
│   │   └── seed.js        # Database seeder
│   └── server.js          # Express entry point
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Security Best Practices Demonstrated

### XSS Prevention
- Use `textContent` instead of `innerHTML`
- Sanitize with DOMPurify
- Implement Content Security Policy (CSP)
- HttpOnly cookies for sensitive tokens

### IDOR Prevention
- Always verify user ownership/authorization
- Use indirect references instead of database IDs
- Implement proper access control checks

### NoSQL Injection Prevention
- Validate input types (reject objects for string fields)
- Use parameterized queries
- Sanitize MongoDB operators ($gt, $ne, etc.)

### Rate Limiting
- Implement request limits per IP/user
- Use exponential backoff
- Account lockout after failed attempts

## ⚠️ Disclaimer

This project is for **educational purposes only**. The vulnerable implementations are intentionally insecure to demonstrate attack vectors. **DO NOT** use any vulnerable code patterns in production applications.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- Final Year Project
- University Name

---

<p align="center">
  <b>🛡️ Learn to hack responsibly, build securely! 🛡️</b>
</p>