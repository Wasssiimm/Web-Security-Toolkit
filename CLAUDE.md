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
.venv\Scripts\activate        # Windows PowerShell
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
│       │   ├── scanner/           # ScannerForm, HeaderResults, PortResults, VulnList, ReportCard
│       │   ├── password/          # PasswordForm, StrengthBar, EntropyGauge, PatternWarnings, BreachResult
│       │   └── shared/            # ScoreCircle, Badge, Spinner, ErrorMessage
│       ├── pages/
│       │   ├── ScannerPage.jsx    # Scanner page
│       │   └── PasswordPage.jsx   # Password page
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
│   │   ├── scan.py                # /scan/headers|ports|vulnerabilities
│   │   └── password.py            # /password/analyze
│   ├── services/
│   │   ├── header_analyzer.py     # Quality analysis per header value
│   │   ├── port_scanner.py        # nmap wrapper, scans 10 common ports
│   │   ├── vuln_detector.py       # Flags vulnerabilities, weighted scoring, A-F grades
│   │   └── entropy_calculator.py  # Entropy formula + pattern detection
│   └── main.py                    # FastAPI app entry point
│
├── bruno/                         # Bruno API collection (committed to git)
│   ├── node-api/                  # 5 requests for all Node endpoints
│   ├── python-api/                # 5 requests for Python engine directly
│   └── environments/local.bru    # Local environment variables
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
| POST | `/api/scan/headers` | Fetches headers, checks presence + quality of 8 security headers |
| POST | `/api/scan/ports` | Forwards to Python to run an nmap scan on 10 common ports |
| POST | `/api/scan/report` | Full scan: headers + quality + ports + vulns + score + grade |
| POST | `/api/password/analyze` | Forwards to Python for entropy + pattern analysis |
| POST | `/api/password/breach` | Accepts full 40-char SHA-1 hash, sends only 5-char prefix to HIBP, returns `{ breached, occurrences, message }` |

### Python / FastAPI (port 8000, internal only)

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/scan/headers` | Quality analysis of raw header values (good/weak/misconfigured) |
| POST | `/scan/ports` | nmap TCP-connect scan on 10 ports, returns all states |
| POST | `/scan/vulnerabilities` | Weighted vulnerability detection + A-F grade |
| POST | `/password/analyze` | Entropy calculation + pattern detection |

---

## Frontend Design Guide

> The frontend is a critical part of this project. It must look professional, be intuitive to use,
> and clearly communicate security information. Follow these specs closely during Phase 4.

### Design Principles
- **Dark theme** — security tools are dark. It looks professional and reduces eye strain.
- **Color communicates risk** — red = critical/high, orange = medium, yellow = low, green = safe. Never deviate.
- **Information hierarchy** — the most important result (score/grade) must be the first thing the eye lands on.
- **Empty states and loading matter** — a blank page while scanning looks broken. Always show feedback.

### Color Palette (Tailwind classes)

| Purpose | Class | Usage |
|---|---|---|
| Page background | `bg-gray-950` | Main background |
| Card background | `bg-gray-900` | All result cards |
| Border | `border-gray-800` | Card borders, dividers |
| Primary text | `text-gray-100` | Headings, important text |
| Secondary text | `text-gray-400` | Labels, descriptions |
| Accent / brand | `text-green-400` / `border-green-400` | Logo, active nav, CTAs |
| Critical risk | `text-red-400` / `bg-red-900/30` | Critical vulnerabilities |
| High risk | `text-orange-400` / `bg-orange-900/30` | High severity |
| Medium risk | `text-yellow-400` / `bg-yellow-900/30` | Medium severity |
| Low risk | `text-blue-400` / `bg-blue-900/30` | Low severity |
| Safe / present | `text-green-400` / `bg-green-900/30` | Headers present, no risk |

### Navigation
- Fixed top navbar, dark (`bg-gray-900`), thin bottom border (`border-gray-800`)
- Logo left: `Web Security Toolkit` in `text-green-400 font-bold`
- Two nav links: `Scanner` and `Password Analyzer`
- Active link: `text-green-400`, inactive: `text-gray-400 hover:text-white`
- No mobile hamburger needed — two links fit on any screen

### Scanner Page layout

```
┌─────────────────────────────────────────────────────┐
│  [URL input field]              [Scan button]        │
│  e.g. https://example.com                           │
├─────────────────────────────────────────────────────┤
│  [Score circle: 7/10]  Grade: B                     │
│  Scanned: github.com — 14 May 2026 at 22:00         │
├─────────────────────────────────────────────────────┤
│  Security Headers (7/8)                             │
│  ┌──────────────────┬─────────┬──────────────────┐  │
│  │ Header name      │ Status  │ Quality / Value   │  │
│  ├──────────────────┼─────────┼──────────────────┤  │
│  │ Content-Security │ ✅ Present│ ⚠ Weak (unsafe)  │  │
│  │ HSTS             │ ✅ Present│ ✅ Good           │  │
│  │ X-Frame-Options  │ ❌ Missing│ — Add DENY        │  │
│  └──────────────────┴─────────┴──────────────────┘  │
├─────────────────────────────────────────────────────┤
│  Port Scan (example.com)                            │
│  Port 80  HTTP   OPEN   [low badge]                 │
│  Port 443 HTTPS  OPEN   [low badge]                 │
│  Port 22  SSH    CLOSED [—]                         │
│  Port 3306 MySQL OPEN   [HIGH badge]  ← red         │
├─────────────────────────────────────────────────────┤
│  Vulnerabilities (3 found)                         │
│  [CRITICAL] Database port 3306 publicly reachable   │
│  [HIGH]     Content-Security-Policy missing         │
│  [MEDIUM]   X-Frame-Options missing                 │
├─────────────────────────────────────────────────────┤
│  [Export JSON button]                               │
└─────────────────────────────────────────────────────┘
```

### Scanner component specs

**ScannerForm**
- Full-width input with placeholder `https://example.com`
- Green "Scan" button, disabled while loading
- Show spinner inside button while request is in-flight
- On error: red banner below the input with the error message

**ScoreCircle (shared)**
- Recharts `RadialBarChart` — single arc showing score out of 10
- Arc color: green (8-10), yellow (5-7), orange (3-4), red (0-2)
- Grade letter centered inside the circle (large, bold)
- Score number below the grade

**HeaderResults**
- Table with 3 columns: Header name, Status badge, Quality/value
- Status badge: green "Present" or red "Missing"
- Quality badge: green "Good", yellow "Weak", red "Misconfigured"
- If missing: show the recommendation text in gray below the row
- Expandable rows — click to see the full header value and description

**PortResults**
- Compact list, one row per port
- Columns: port number, service name, state pill, risk badge
- State pill: green "Open", gray "Closed", gray "Filtered"
- Risk badge only shown when port is open: red=high/critical, yellow=medium, blue=low
- Closed/filtered rows are visually dimmed (`opacity-50`)

**VulnList**
- Severity badge left-aligned (colored by severity)
- Title bold, description in `text-gray-400`
- Recommendation in a slightly indented block with a `→` prefix
- Sorted by severity: critical → high → medium → low

**ReportCard**
- "Export as JSON" button — triggers `JSON.stringify(report, null, 2)` download
- Shows `generatedAt` timestamp

### Password Page layout

```
┌─────────────────────────────────────────────────────┐
│  [Password input — with show/hide toggle]            │
│  [Analyze button]                                   │
├─────────────────────────────────────────────────────┤
│  Strength bar: [████████░░] Strong                  │
│  Entropy: 67.3 bits — Strong                        │
├─────────────────────────────────────────────────────┤
│  Pattern warnings:                                  │
│  ⚠ Contains keyboard sequence (qwerty)              │
│  ⚠ Contains common word (password)                 │
├─────────────────────────────────────────────────────┤
│  Breach check:                                      │
│  ❌ Found in 34,201 known data breaches             │
│  OR                                                 │
│  ✅ Not found in any known breaches                 │
└─────────────────────────────────────────────────────┘
```

### Password component specs

**PasswordForm**
- Password input with show/hide toggle (eye icon)
- **Important:** the SHA-1 hash is computed in the browser before any network call. Never send the raw password to HIBP — only the 5-char hash prefix.
- "Analyze" button triggers both `/api/password/analyze` and the HIBP check simultaneously (`Promise.all`)

**StrengthBar**
- Full-width bar, animated fill using CSS transition
- 5 segments: Very Weak (red), Weak (orange), Fair (yellow), Strong (lime), Very Strong (green)
- Label below the bar matches the score

**EntropyGauge**
- Recharts `RadialBarChart` showing entropy bits on a 0–128 scale
- Color zones match the entropy table: red (<28), orange (28-35), yellow (36-59), green (60-127), bright green (128+)
- Bits value and label centered

**PatternWarnings**
- Only renders if `patterns.length > 0`
- Each pattern shown as a yellow warning chip with a short explanation
- If no patterns: show a small green "No weak patterns detected" message

**BreachResult**
- Two states: breached (red card) and clean (green card)
- Breached: shows count ("Found in X,XXX known data breaches") with explanation of k-anonymity below
- Clean: checkmark + "Not found in any known breaches"
- Always show the k-anonymity explanation so users understand their password was never transmitted

### Shared components

**Badge** — props: `severity` (critical/high/medium/low/none) → colored pill  
**Spinner** — small animated ring, used inside buttons and as page loader  
**ErrorMessage** — red card with error icon and message text

### Loading & error states (mandatory)
- Every API call must have a loading state — show a spinner, disable the submit button
- Port scan can take 10-30 seconds — show "Scanning ports, this may take a moment…" text
- Every API error must be caught and shown in the UI — never silently fail
- If Python is unreachable, show "Security engine unavailable — try again later"

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
2. Send only the first 5 chars (`5BAA6`) to the Node API
3. Node calls HIBP: returns all hashes starting with `5BAA6` (~500 results)
4. Check locally if the full hash is in that list
5. If yes → breached. HIBP never saw the full hash.

### Why TCP-connect scan (not SYN scan)?
`nmap -sS` (SYN/stealth scan) requires root/admin privileges. `-sT` (TCP-connect) works without them, making the app usable on any machine without elevated rights.

### Vulnerability Scoring
Each vulnerability has a severity weight: critical=3, high=2, medium=1, low=0.5.  
`score = max(0, 10 − sum of weights)` → A (≥9), B (≥7), C (≥5), D (≥3), F (<3).

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

### ✅ Phase 2 – Web Security Scanner Backend (Complete)
- [x] `headerService.js` – fetches live headers, checks 8 security headers
- [x] `header_analyzer.py` – quality analysis per header value (good/weak/misconfigured)
- [x] `port_scanner.py` – nmap TCP scan on 10 ports, full state reporting
- [x] `vuln_detector.py` – 10 vulnerability checks, weighted scoring, A-F grades
- [x] Report endpoint – wires all services together with quality enrichment
- [x] Tested via Bruno

### ✅ Phase 3 – Password Analyzer Backend (Complete)
- [x] `entropy_calculator.py` – entropy formula, 13 pattern types, crack time estimates, feedback/suggestions
- [x] Test `/api/password/analyze` chain (Node → Python) via Bruno
- [x] `hibpService.js` – fix breach response format (`breached`, `occurrences`, `message`)
- [x] End-to-end test via Bruno

### 🔲 Phase 4 – Frontend (See Frontend Design Guide above)
- [x] Navigation layout + routing (App.jsx complete from Phase 1)
- [x] Step 1: Fix api.js + shared components: Badge, Spinner, ErrorMessage
- [x] Step 2: Shared ScoreCircle (Recharts radial bar)
- [x] Step 3: Scanner – ScannerForm + ScannerPage with loading/error state
- [x] Step 4: Scanner – HeaderResults table
- [x] Step 5: Scanner – PortResults list
- [x] Step 6: Scanner – VulnList + ReportCard with JSON export
- [ ] Step 7: Password – PasswordForm + StrengthBar
- [ ] Step 8: Password – EntropyGauge (Recharts)
- [ ] Step 9: Password – PatternWarnings + BreachResult
- [ ] Loading states + error handling woven into every step above

### 🔲 Phase 5 – Testing & Finalisation
- [ ] End-to-end tests (multiple URLs and passwords)
- [ ] Bug fixes and code clean-up
- [ ] README screenshots

### 🔲 Phase 6 – Reflection & Documentation
- [ ] Reflection report
- [ ] Final GitHub push, make repo public

### 🔲 Phase 7 – VPS Deployment
- [ ] Provision a VPS (DigitalOcean / Hetzner / Linode — ~€5/month)
- [ ] Install Node.js 20, Python 3.12, nmap on the server
- [ ] Build React: `npm run build` → static files in `client/dist/`
- [ ] Configure Nginx: serve React static files + reverse proxy `/api` to Node on port 3000
- [ ] Deploy Node API with PM2 (keeps process alive, auto-restarts on crash)
- [ ] Deploy Python engine with systemd (same as PM2 but for Python)
- [ ] SSL certificate via Let's Encrypt / Certbot (free HTTPS)
- [ ] Set production environment variables on server (`.env` file)
- [ ] Configure firewall: only ports 22 (SSH), 80 (HTTP), 443 (HTTPS) open publicly
- [ ] Smoke test all endpoints on the live domain

---

## Branching Strategy (Gitflow)

```
master       ← final, release-ready code (only updated when project is fully complete)
  └─ develop ← integration branch — all completed phases merge here
       └─ phase-3-password-backend   ← active
       └─ phase-4-frontend           ← next
       └─ phase-5-testing            ← etc.
```

**Workflow per phase:**
1. Work on `phase-X-*` branch
2. When phase is done and tested → merge into `develop`
3. Cut next phase branch from `develop`
4. When entire project is complete → merge `develop` into `master`

---

## Decisions & Notes

| Date | Decision | Reason |
|---|---|---|
| 2026-05-11 | Single monorepo | Tight coupling between the 3 parts; simpler for a student project |
| 2026-05-11 | Node as API gateway, Python for security logic | Node excels at I/O; Python has better security libraries |
| 2026-05-11 | Vite proxy instead of CORS headers | Avoids managing CORS during development; cleaner setup |
| 2026-05-11 | TCP-connect nmap scan (`-sT`) | No root/admin required on Windows |
| 2026-05-11 | Gitflow 3-tier branching (phase → develop → master) | Keeps master clean; develop integrates completed phases |
| 2026-05-11 | `.env.example` committed, `.env` gitignored | Documents required variables without exposing secrets |
| 2026-05-11 | `__init__.py` in Python routers/ and services/ | Makes them proper Python packages so imports resolve correctly |
| 2026-05-14 | Bruno over Postman for API testing | Bruno collection files are plain text and committed to git |
| 2026-05-16 | Phase 7 added: VPS deployment | User wants the project publicly hosted after completion |
