# CLAUDE.md – Web Security Toolkit

> This file is automatically loaded by Claude Code at the start of every session.
> It tracks project state, architecture decisions, and learning notes.
> **Update this file every time a meaningful piece of code is added or changed.**

---

## Project Overview

A full-stack monorepo built as a POA (Personal Development Activity) for a 2nd-year Computer Science programme.  
**Period:** May 2026 – June 2026 | **Budget:** 28 hours

### Two modules:
1. **Web Security Scanner** – scans a URL for missing security headers, open ports, and known vulnerability patterns. Generates a scored report.
2. **Password Strength Analyzer** – calculates password entropy, detects weak patterns, and checks against known breaches via Have I Been Pwned.

---

## Architecture

```
Browser (React)
    │  HTTP REST (JSON)
    ▼
Node.js / Express  ← API gateway, port 3000
    │  internal HTTP
    ├──► Python / FastAPI  ← security engine, port 8000
    └──► HIBP API          ← external, k-anonymity breach check
```

### Why this split?
- **Node.js** handles I/O-heavy tasks well (fetching HTTP headers, routing).
- **Python** has the best ecosystem for security tooling (`python-nmap`, `math` for entropy).
- This mirrors real-world microservice patterns — each service does one thing.

### Why a proxy in vite.config.js?
The React dev server runs on port 5173. Without a proxy, browser requests to `/api/...` would fail due to CORS. The proxy forwards them to Node on port 3000, so the frontend never has to hardcode a backend URL.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + Vite + TailwindCSS + Recharts | 18.x / 5.x / 3.x / 2.x |
| API Gateway | Node.js + Express | 20.x / 4.x |
| Security Engine | Python + FastAPI + uvicorn | 3.12 / 0.111 / 0.29 |
| Port scanning | python-nmap (wraps system nmap) | 0.7.x |
| Breach check | Have I Been Pwned Passwords API | v3 |

---

## How to Run Locally

> Requires: Node.js 20+, Python 3.12+, [nmap](https://nmap.org/download.html) installed on the system.

Open **three terminals** from the project root:

```bash
# Terminal 1 – Python security engine
cd server-python
source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2 – Node.js API gateway
cd server-node
npm run dev

# Terminal 3 – React frontend
cd client
npm run dev
```

Visit **http://localhost:5173**

---

## Folder Structure

```
web-security-toolkit/
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── scanner/           # Scanner UI components (to build)
│       │   ├── password/          # Password UI components (to build)
│       │   └── shared/            # Reusable components (to build)
│       ├── pages/
│       │   ├── ScannerPage.jsx    # Scanner page (placeholder)
│       │   └── PasswordPage.jsx   # Password page (placeholder)
│       └── services/
│           └── api.js             # All Axios calls to Node backend
│
├── server-node/                   # Express API gateway
│   ├── routes/
│   │   ├── scan.js                # POST /api/scan/headers|ports|report
│   │   └── password.js            # POST /api/password/analyze|breach
│   ├── services/
│   │   ├── headerService.js       # Fetches URL and checks 8 security headers
│   │   ├── hibpService.js         # Calls HIBP API with 5-char hash prefix
│   │   └── pythonBridge.js        # HTTP client to talk to FastAPI
│   ├── middleware/
│   │   └── validate.js            # Blocks private IPs, validates URL format
│   └── index.js                   # App entry point
│
├── server-python/                 # FastAPI security engine
│   ├── routers/
│   │   ├── scan.py                # /scan/ports + /scan/vulnerabilities
│   │   └── password.py            # /password/analyze
│   ├── services/
│   │   ├── port_scanner.py        # nmap wrapper, scans 10 common ports
│   │   ├── vuln_detector.py       # Flags vulnerabilities from scan results
│   │   └── entropy_calculator.py  # Entropy formula + pattern detection
│   └── main.py                    # FastAPI app entry point
│
├── CLAUDE.md                      # ← you are here
├── README.md                      # Public-facing install instructions
└── .gitignore
```

---

## API Endpoints Reference

### Node.js (port 3000)

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/api/scan/headers` | Fetches the URL's HTTP headers and scores 8 security headers |
| POST | `/api/scan/ports` | Forwards to Python to run an nmap scan on 10 common ports |
| POST | `/api/scan/report` | Combines headers + ports + vulnerabilities into one scored report |
| POST | `/api/password/analyze` | Forwards to Python for entropy + pattern analysis |
| POST | `/api/password/breach` | Sends 5-char SHA-1 prefix to HIBP, returns matches |

### Python / FastAPI (port 8000, internal only)

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/scan/ports` | nmap TCP-connect scan on 10 ports |
| POST | `/scan/vulnerabilities` | Takes headers+ports results, returns vulnerability list |
| POST | `/password/analyze` | Entropy calculation + pattern detection |

---

## Key Concepts (Learning Notes)

### Security Headers
HTTP headers the server sends back with every response. Browsers read them to know what's allowed. Missing headers = open attack surface.

| Header | Protects against |
|---|---|
| `Content-Security-Policy` | XSS – restricts where scripts can load from |
| `Strict-Transport-Security` | Downgrade attacks – forces HTTPS |
| `X-Frame-Options` | Clickjacking – prevents embedding in iframes |
| `X-Content-Type-Options` | MIME sniffing – forces declared content type |

### Password Entropy
Entropy (H) measures how hard a password is to guess by brute force:  
`H = L × log₂(N)` where L = length, N = number of possible characters.

Example: `abc` → L=3, N=26 → H = 3 × 4.7 = ~14 bits (very weak).  
Example: `X#9mQ!vL2k` → L=10, N=95 → H = 10 × 6.57 = ~65 bits (strong).

### HIBP k-Anonymity
The password **never leaves the browser in plaintext**:
1. SHA-1 hash the password → e.g. `5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8`
2. Send only the first 5 chars (`5BAA6`) to the HIBP API
3. HIBP returns all hashes starting with `5BAA6` (~500 results)
4. Check locally if the full hash is in that list
5. If yes → breached. The API never saw the full password.

### Why TCP-connect scan (not SYN scan)?
`nmap -sS` (SYN/stealth scan) requires root/admin privileges. `-sT` (TCP-connect) works without them, making the app usable on any machine without elevated rights.

---

## Progress Tracker

### ✅ Phase 1 – Setup (Complete)
- [x] Monorepo folder structure created
- [x] React + Vite + Tailwind initialised
- [x] Express API gateway initialised (routes, services, middleware stubs)
- [x] FastAPI Python engine initialised (routers, services stubs)
- [x] All npm/pip dependencies installed
- [x] Vite proxy configured (frontend → Node)
- [x] Private IP blocker middleware in place
- [x] CLAUDE.md created

### 🔲 Phase 2 – Web Security Scanner Backend (Next)
- [x] `headerService.js` – test against real URLs
- [x] `header_analyzer.py` – risk rating per header
- [x] `port_scanner.py` – test nmap on Windows
- [ ] `vuln_detector.py` – vulnerability logic
- [ ] Report endpoint + scoring
- [ ] Test via Postman

### 🔲 Phase 3 – Password Analyzer Backend
- [ ] `entropy_calculator.py` – test formula
- [ ] Pattern detection
- [ ] `hibpService.js` – SHA-1 + HIBP call
- [ ] End-to-end test

### 🔲 Phase 4 – Frontend
- [ ] ScannerForm, HeaderResults, PortResults
- [ ] VulnList, ReportCard + JSON export
- [ ] PasswordForm, StrengthBar, EntropyGauge
- [ ] PatternWarnings, BreachResult
- [ ] Loading states + error handling

### 🔲 Phase 5 – Testing & Finalisation
- [ ] End-to-end tests (multiple URLs and passwords)
- [ ] Bug fixes
- [ ] README screenshots

### 🔲 Phase 6 – Reflection & Documentation
- [ ] Reflection report
- [ ] GitHub push

---

## Decisions & Notes

| Date | Decision | Reason |
|---|---|---|
| 2026-05-11 | Single monorepo | Tight coupling between the 3 parts; simpler for a student project |
| 2026-05-11 | Node as API gateway, Python for security logic | Node excels at I/O; Python has better security libraries |
| 2026-05-11 | Vite proxy instead of CORS headers | Avoids managing CORS during development; cleaner setup |
| 2026-05-11 | TCP-connect nmap scan (`-sT`) | No root/admin required on Windows |
| 2026-05-11 | Feature branch per phase | Keeps master clean; one branch per phase, merged when complete |
| 2026-05-11 | `.env.example` committed, `.env` gitignored | Documents required variables without exposing secrets |
| 2026-05-11 | `__init__.py` in Python routers/ and services/ | Makes them proper Python packages so imports resolve correctly |
