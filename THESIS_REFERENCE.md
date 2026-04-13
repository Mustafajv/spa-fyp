# Comprehensive Thesis Reference Document
## Single Page Application Security Vulnerabilities: An Educational Demonstration Platform

---

# SECTION 1: PROJECT OVERVIEW

## 1.1 Project Title
**"Development of an Interactive Educational Platform for Demonstrating Security Vulnerabilities in Single Page Applications"**

## 1.2 Abstract
This project presents the design and implementation of an interactive web-based educational platform that demonstrates common security vulnerabilities found in modern Single Page Applications (SPAs). The platform provides hands-on demonstrations of five critical security vulnerabilities: Cross-Site Scripting (XSS), Insecure Direct Object Reference (IDOR), NoSQL Injection, Brute Force attacks, and Insecure Token Storage. Each vulnerability is implemented in both vulnerable and secure modes, allowing users to understand attack vectors and learn proper mitigation techniques. The system is built using React.js for the frontend and Node.js with Express for the backend, connected to a MongoDB database.

## 1.3 Problem Statement
Single Page Applications have become the dominant architecture for modern web applications due to their improved user experience and performance. However, the shift of application logic from server to client introduces unique security challenges that many developers fail to address. According to OWASP (Open Web Application Security Project), injection attacks, broken authentication, and cross-site scripting remain in the top 10 web application security risks. There is a significant need for practical, hands-on educational tools that allow developers to understand these vulnerabilities in a safe, controlled environment.

## 1.4 Objectives
1. To develop an interactive web application that demonstrates common SPA security vulnerabilities
2. To implement both vulnerable and secure versions of each feature for comparison
3. To provide real-time feedback showing how attacks work and how they can be prevented
4. To create an educational resource that helps developers understand secure coding practices
5. To demonstrate the implementation of industry-standard security controls

## 1.5 Scope
The project covers the following security vulnerabilities:
- Cross-Site Scripting (XSS) - Stored, Reflected, and DOM-based
- Insecure Direct Object Reference (IDOR)
- NoSQL Injection attacks on MongoDB
- Brute Force attacks and Rate Limiting protection
- Insecure Token Storage (localStorage vs HttpOnly cookies)

---

# SECTION 2: LITERATURE REVIEW

## 2.1 Single Page Applications (SPAs)

### 2.1.1 Definition and Architecture
Single Page Applications are web applications that load a single HTML page and dynamically update content as the user interacts with the app. Unlike traditional multi-page applications where each user action triggers a full page reload from the server, SPAs use JavaScript to manipulate the DOM and fetch data asynchronously through APIs.

### 2.1.2 Key Characteristics
- **Client-side rendering**: The browser renders the UI using JavaScript frameworks
- **API-based communication**: Data is exchanged with the server via RESTful APIs or GraphQL
- **State management**: Application state is maintained on the client side
- **Routing**: Navigation is handled client-side without full page reloads

### 2.1.3 Popular SPA Frameworks
- React.js (Meta/Facebook) - Used in this project
- Angular (Google)
- Vue.js
- Svelte

## 2.2 OWASP Top 10 Web Application Security Risks

### 2.2.1 A03:2021 - Injection
Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. This project demonstrates NoSQL Injection attacks on MongoDB databases.

### 2.2.2 A07:2021 - Cross-Site Scripting (XSS)
XSS flaws occur when an application includes untrusted data in a web page without proper validation or escaping. This project demonstrates all three types of XSS.

### 2.2.3 A01:2021 - Broken Access Control
Access control enforces policy such that users cannot act outside their intended permissions. IDOR is a specific manifestation of broken access control.

### 2.2.4 A07:2017 - Identification and Authentication Failures
This includes brute force attacks, weak passwords, and improper session management. This project demonstrates rate limiting as a mitigation.

## 2.3 Detailed Vulnerability Analysis

### 2.3.1 Cross-Site Scripting (XSS)

**Definition**: XSS is a type of injection attack where malicious scripts are injected into trusted websites.

**Types**:
1. **Stored XSS**: Malicious script is permanently stored on the target server (database, message forum, comment field). When a victim visits the page, the script executes.
2. **Reflected XSS**: Malicious script is reflected off a web server in error messages, search results, or any response that includes user input.
3. **DOM-based XSS**: The attack payload is executed by modifying the DOM environment in the victim's browser.

**Attack Vectors Demonstrated in This Project**:
- `<script>alert('XSS')</script>` - Classic script injection
- `<img src=x onerror="alert('XSS')">` - Event handler injection
- `<svg onload="alert('XSS')">` - SVG event handler
- `<a href="javascript:alert('XSS')">Click Me</a>` - JavaScript protocol
- Cookie stealing payloads
- DOM manipulation payloads

**Mitigations Implemented**:
- Output encoding using React's default text content escaping
- Avoiding `dangerouslySetInnerHTML` in secure mode
- Content Security Policy (CSP) headers via Helmet.js

### 2.3.2 Insecure Direct Object Reference (IDOR)

**Definition**: IDOR occurs when an application exposes a reference to an internal implementation object (such as a database ID) without proper authorization checks.

**Attack Scenario in This Project**:
1. User A logs in and sees their profile at `/api/vulnerable/users/123`
2. User A changes the ID to `/api/vulnerable/users/456` (User B's profile)
3. In vulnerable mode, User A can access User B's data
4. In secure mode, the server verifies ownership before returning data

**Mitigations Implemented**:
- Server-side authorization checks comparing `req.user._id` with requested resource
- Role-based access control (admin users can access all resources)
- Return of 403 Forbidden for unauthorized access attempts

### 2.3.3 NoSQL Injection

**Definition**: NoSQL injection is an attack that exploits the query syntax of NoSQL databases by injecting malicious operators.

**MongoDB Operators Used in Attacks**:
- `$gt` (greater than) - Bypasses string comparison
- `$ne` (not equal) - Returns records where field is not equal to value
- `$regex` - Pattern matching that can leak data
- `$where` - JavaScript expression evaluation (most dangerous)

**Attack Payload Used in This Project**:
```json
{
  "username": "admin",
  "password": { "$gt": "" }
}
```

This payload works because `{ "$gt": "" }` means "greater than empty string", which is true for any non-empty password, bypassing authentication.

**Mitigations Implemented**:
- Type checking to ensure inputs are strings, not objects
- Sanitization of MongoDB operators from user input
- Use of parameterized queries

### 2.3.4 Brute Force Attacks and Rate Limiting

**Definition**: A brute force attack systematically checks all possible passwords or keys until the correct one is found.

**Attack Characteristics**:
- Automated tools can try thousands of passwords per second
- Common password lists make attacks faster
- Without rate limiting, there's no barrier to unlimited attempts

**Rate Limiting Implementation in This Project**:
- Uses `express-rate-limit` middleware
- Limits login attempts to 5 per minute per IP address
- Returns HTTP 429 (Too Many Requests) when limit exceeded
- Configurable window duration and maximum attempts

### 2.3.5 Insecure Token Storage

**Definition**: Storing authentication tokens in locations accessible to JavaScript makes them vulnerable to XSS attacks.

**localStorage Vulnerabilities**:
- Accessible via `window.localStorage` from any JavaScript on the page
- If XSS vulnerability exists, attacker can steal tokens
- No built-in expiration mechanism

**HttpOnly Cookie Advantages**:
- Not accessible via JavaScript (HttpOnly flag)
- Automatically sent with every request to the domain
- Can be made secure (HTTPS only) with Secure flag
- Can have SameSite attribute to prevent CSRF

---

# SECTION 3: SYSTEM ARCHITECTURE

## 3.1 Technology Stack

### 3.1.1 Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 19.2.0 | UI component library |
| Vite | 7.2.4 | Build tool and dev server |
| Lucide React | 0.562.0 | Icon library |
| Custom CSS | - | Styling with CSS variables |

### 3.1.2 Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web application framework |
| MongoDB | - | NoSQL database |
| Mongoose | 8.0.3 | MongoDB ODM |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| express-rate-limit | 8.2.1 | Rate limiting middleware |
| helmet | 7.1.0 | Security headers |
| cors | 2.8.5 | Cross-origin resource sharing |
| cookie-parser | 1.4.6 | Cookie parsing middleware |

## 3.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  React Application (SPA)                                         │
│  ├── VulnerableSPADemo.jsx (Main Component)                     │
│  ├── XSS Demo Section                                           │
│  ├── IDOR Demo Section                                          │
│  ├── NoSQL Injection Demo Section                               │
│  ├── Rate Limiting Demo Section                                 │
│  └── Authentication UI (Login/Register)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/HTTPS (REST API)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
├─────────────────────────────────────────────────────────────────┤
│  Middleware Layer                                                │
│  ├── helmet() - Security Headers (CSP, XSS Protection)         │
│  ├── cors() - Cross-Origin Resource Sharing                    │
│  ├── express.json() - Body Parser                               │
│  ├── cookieParser() - Cookie Handling                           │
│  ├── authenticate() - JWT Verification                          │
│  └── rateLimit() - Request Rate Limiting                        │
├─────────────────────────────────────────────────────────────────┤
│  Routes Layer                                                    │
│  ├── /api/auth/* - Authentication (Login, Register, Logout)    │
│  ├── /api/users/* - User Management                             │
│  ├── /api/comments/* - Comments (XSS Demo)                      │
│  ├── /api/admin/* - Admin Routes                                │
│  ├── /api/vulnerable/* - IDOR Demo Routes                       │
│  └── /api/vulnerable/* - NoSQL & Rate Limit Demo Routes        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                            │
├─────────────────────────────────────────────────────────────────┤
│  Collections:                                                    │
│  ├── users (username, password_hash, role, timestamps)          │
│  └── comments (text, user_ref, timestamps)                      │
└─────────────────────────────────────────────────────────────────┘
```

## 3.3 Data Flow Diagrams

### 3.3.1 Authentication Flow
```
User → Login Form → POST /api/auth/login → Validate Credentials
                                                    │
                    ┌───────────────────────────────┴───────────────────┐
                    ▼                                                   ▼
            [Success]                                            [Failure]
    Generate JWT Token                                     Return 401 Unauthorized
    Set HttpOnly Cookie
    Return User Data
```

### 3.3.2 IDOR Attack Flow
```
                    ┌─────────────────────────────────────────┐
                    │  User A authenticated with ID: 123      │
                    └─────────────────┬───────────────────────┘
                                      │
                    ┌─────────────────▼───────────────────────┐
                    │  Request: GET /api/vulnerable/users/456 │
                    │  (Attempting to access User B's data)   │
                    └─────────────────┬───────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                                                       ▼
    [VULNERABLE MODE]                                      [SECURE MODE]
    Returns User B's data                              Check: 123 !== 456
    No authorization check                             Return 403 Forbidden
```

---

# SECTION 4: IMPLEMENTATION DETAILS

## 4.1 Database Schema

### 4.1.1 User Model
```javascript
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });
```

### 4.1.2 Comment Model
```javascript
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 1000
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, { timestamps: true });
```

## 4.2 Authentication Implementation

### 4.2.1 Password Hashing
The system uses bcryptjs with a salt factor of 10 for password hashing:
```javascript
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
```

### 4.2.2 JWT Token Generation
```javascript
export const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
    
    res.cookie('jwt', token, {
        httpOnly: true,      // Not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production',  // HTTPS only
        sameSite: 'strict',  // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });
};
```

## 4.3 Vulnerability Implementations

### 4.3.1 XSS Demonstration

**Vulnerable Implementation (React)**:
```jsx
// VULNERABLE: Uses dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Secure Implementation (React)**:
```jsx
// SECURE: Uses textContent, automatically escapes HTML
<div>{userInput}</div>
```

### 4.3.2 IDOR Demonstration

**Vulnerable Endpoint**:
```javascript
router.get('/users/:id', authenticate, async (req, res) => {
    // VULNERABILITY: No check if req.user._id matches req.params.id
    const user = await User.findById(req.params.id);
    res.json({ user });
});
```

**Secure Endpoint**:
```javascript
router.get('/secure/users/:id', authenticate, async (req, res) => {
    // SECURE: Check ownership or admin role
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id);
    res.json({ user });
});
```

### 4.3.3 NoSQL Injection Demonstration

**Vulnerable Endpoint**:
```javascript
router.post('/login-demo', async (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABLE: password could be { "$gt": "" }
    if (typeof password === 'object' && password.$gt !== undefined) {
        // Injection detected - simulates bypass
        const user = await User.findOne({ username });
        return res.json({ bypassed: true, user });
    }
});
```

**Secure Endpoint**:
```javascript
router.post('/login-secure', async (req, res) => {
    let { username, password } = req.body;
    
    // SECURE: Type checking
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Invalid input types' });
    }
    
    // Additional sanitization
    username = username.replace(/[$]/g, '');
    // ... proceed with bcrypt comparison
});
```

### 4.3.4 Rate Limiting Implementation

**Rate Limiter Configuration**:
```javascript
import rateLimit from 'express-rate-limit';

export const demoRateLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 5,               // 5 attempts per window
    message: {
        success: false,
        message: 'Rate limit exceeded!',
        blocked: true,
        retryAfter: 60
    },
    handler: (req, res, next, options) => {
        res.status(429).json({
            ...options.message,
            attemptsRemaining: 0
        });
    }
});

// Vulnerable: No rate limiting
export const noRateLimit = (req, res, next) => next();
```

## 4.4 Security Headers (Helmet.js)

The application uses Helmet.js to set various HTTP security headers:
- **Content-Security-Policy**: Restricts sources of content
- **X-XSS-Protection**: Legacy XSS filter enablement
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS

---

# SECTION 5: API DOCUMENTATION

## 5.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Authenticate user | No |
| POST | /api/auth/logout | Logout user | No |
| GET | /api/auth/me | Get current user | Yes |

## 5.2 Vulnerable Demo Endpoints

### IDOR Demo
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vulnerable/users | List all users (vulnerable) |
| GET | /api/vulnerable/users/:id | Get user by ID (vulnerable) |
| GET | /api/vulnerable/secure/users | List users with auth check |
| GET | /api/vulnerable/secure/users/:id | Get user with ownership check |

### NoSQL Injection Demo
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/vulnerable/login-demo | Vulnerable to NoSQL injection |
| POST | /api/vulnerable/login-secure | Sanitized input handling |

### Rate Limiting Demo
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/vulnerable/brute-force | No rate limiting |
| POST | /api/vulnerable/brute-force-protected | Rate limited (5/min) |

---

# SECTION 6: USER INTERFACE DESIGN

## 6.1 Design Principles
- **Dark Theme**: Reduces eye strain, professional appearance
- **Glassmorphism**: Modern frosted-glass effect using CSS backdrop-filter
- **Visual Feedback**: Color-coded results (red=vulnerable, green=secure)
- **Interactive Elements**: Hover effects, animations, micro-interactions
- **Responsive Layout**: Works on desktop and mobile devices

## 6.2 Component Structure
```
VulnerableSPADemo
├── Header/Navigation
│   ├── Logo
│   ├── Mode Toggle (Vulnerable/Secure)
│   └── Logout Button
├── Home View
│   ├── Feature Cards
│   └── Getting Started CTA
├── Login/Register Views
└── Dashboard View
    ├── Comment Section (XSS Demo)
    ├── XSS Demo Panel
    │   ├── Attack Type Cards
    │   ├── Payload Arsenal
    │   ├── Custom Input
    │   └── Comparison Output
    ├── IDOR Demo Panel
    │   ├── User List Section
    │   └── User Access Section
    ├── Rate Limiting Demo Panel
    │   └── Brute Force Simulation
    └── NoSQL Injection Demo Panel
        └── Injection Payload Tester
```

## 6.3 CSS Architecture
The project uses a custom CSS design system with:
- CSS Custom Properties (variables) for theming
- Utility classes following a consistent naming convention
- Component-specific styles with BEM-like naming
- Keyframe animations for micro-interactions

---

# SECTION 7: TESTING AND RESULTS

## 7.1 XSS Testing Results

| Payload | Vulnerable Mode | Secure Mode |
|---------|-----------------|-------------|
| `<script>alert('XSS')</script>` | Executes (blocked by React) | Escaped as text |
| `<img src=x onerror="alert('XSS')">` | Executes | Escaped as text |
| `<svg onload="alert('XSS')">` | Executes | Escaped as text |

## 7.2 IDOR Testing Results

| Scenario | Vulnerable Mode | Secure Mode |
|----------|-----------------|-------------|
| User A accessing User A's profile | ✓ Allowed | ✓ Allowed |
| User A accessing User B's profile | ✓ Allowed (vulnerability) | ✗ 403 Forbidden |
| Admin accessing any profile | ✓ Allowed | ✓ Allowed |
| Regular user listing all users | Returns all users | Returns only own profile |

## 7.3 NoSQL Injection Testing Results

| Payload | Vulnerable Mode | Secure Mode |
|---------|-----------------|-------------|
| `{"password": {"$gt": ""}}` | Authentication bypassed | 400 Bad Request |
| `{"password": {"$ne": "wrong"}}` | Authentication bypassed | 400 Bad Request |
| Normal password string | Normal authentication | Normal authentication |

## 7.4 Rate Limiting Testing Results

| Attempts | Vulnerable Mode | Secure Mode |
|----------|-----------------|-------------|
| 1-5 | All allowed | All allowed |
| 6+ | All allowed (vulnerability) | 429 Too Many Requests |
| After 1 minute cooldown | N/A | Attempts reset |

---

# SECTION 8: CONCLUSIONS

## 8.1 Achievements
1. Successfully developed an interactive educational platform demonstrating 5 major security vulnerabilities
2. Implemented both vulnerable and secure versions for side-by-side comparison
3. Created an intuitive user interface that clearly shows the impact of each vulnerability
4. Provided comprehensive documentation for educational purposes

## 8.2 Learning Outcomes
This platform helps developers understand:
- How common web vulnerabilities work in practice
- The importance of input validation and output encoding
- Proper implementation of authentication and authorization
- The necessity of rate limiting for brute force protection
- Best practices for token storage and session management

## 8.3 Future Enhancements
1. Add more vulnerability demonstrations (CSRF, SSRF, XXE)
2. Implement a challenge/CTF mode where users must exploit vulnerabilities
3. Add detailed tutorials and explanations for each vulnerability
4. Create a progress tracking system for educational use
5. Add automated security scanning integration
6. Implement multi-language support

---

# SECTION 9: REFERENCES

1. OWASP Top 10 Web Application Security Risks (2021)
   https://owasp.org/Top10/

2. Cross-Site Scripting (XSS) - OWASP
   https://owasp.org/www-community/attacks/xss/

3. NoSQL Injection - OWASP
   https://owasp.org/www-project-web-security-testing-guide/

4. Insecure Direct Object References (IDOR) - OWASP
   https://owasp.org/www-project-web-security-testing-guide/

5. React.js Security Best Practices
   https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks

6. Express.js Security Best Practices
   https://expressjs.com/en/advanced/best-practice-security.html

7. MongoDB Security Best Practices
   https://docs.mongodb.com/manual/security/

8. JWT Best Practices - Auth0
   https://auth0.com/blog/jwt-handbook/

9. Helmet.js - Express Security Middleware
   https://helmetjs.github.io/

10. express-rate-limit Documentation
    https://www.npmjs.com/package/express-rate-limit

---

# APPENDICES

## Appendix A: Environment Configuration
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spa-security-demo
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Appendix B: Installation Commands
```bash
# Clone repository
git clone https://github.com/username/spa-fyp.git

# Install frontend dependencies
cd spa-fyp
npm install

# Install backend dependencies
cd server
npm install

# Seed database
npm run seed

# Run development server
cd ..
npm run dev
```

## Appendix C: Project File Structure
```
fyp/
├── src/
│   ├── components/
│   │   └── VulnerableSPADemo.jsx (1200+ lines)
│   ├── App.jsx
│   └── index.css (1700+ lines)
├── server/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rate-limit.js
│   ├── models/
│   │   ├── User.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── comments.js
│   │   ├── admin.js
│   │   ├── vulnerable-users.js
│   │   └── vulnerable-auth.js
│   ├── scripts/
│   │   └── seed.js
│   └── server.js
├── package.json
└── README.md
```

---

*Document prepared for thesis reference purposes. All code examples are from the actual project implementation.*
