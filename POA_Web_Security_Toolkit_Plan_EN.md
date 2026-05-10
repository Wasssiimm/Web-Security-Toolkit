# POA Project Plan: Web Security Toolkit

**Student:** [Your name]
**Programme:** Computer Science – Year 2
**Period:** May 2026 – June 2026
**Total hours:** 28 hours

---

## 1. Introduction

This document describes the detailed execution plan for the Personal Development Activity (POA). The goal is to build a web application called **Web Security Toolkit**, consisting of two extended modules:

1. **Web Security Scanner** – analyses a URL for security headers, open ports, vulnerabilities and generates a report.
2. **Password Strength Analyzer** – evaluates passwords for strength, calculates entropy, detects patterns and checks against known data breaches.

---

## 2. Learning Objectives

- Independently set up and complete a full-stack web application within 28 hours.
- Work with React (frontend) and a split backend: Node.js for API routing and Python for security analysis.
- Gain in-depth knowledge of cybersecurity concepts: HTTP security headers, port scanning, password entropy and credential leaks.
- Gain experience with external API integrations (Have I Been Pwned).
- Publish a project on GitHub including complete documentation.

---

## 3. Stack Choice & Motivation

### Why a split backend (Node.js + Python)?

The backend is divided into two responsibilities:

- **Node.js (Express)** acts as the central API gateway. It receives all requests from the frontend, handles routing and forwards to the Python service where needed. Node.js is ideal here due to its speed with I/O tasks (fetching HTTP requests, analysing headers).

- **Python (FastAPI)** handles the heavy security analysis: port scanning via `python-nmap`, password entropy calculation and pattern detection. Python has a far richer ecosystem of security libraries than Node.js for this kind of work.

This approach also reflects real-world industry practice: microservices with separate responsibilities per language.

---

## 4. Tech Stack

### Frontend
| Technology | Version | Reason |
|---|---|---|
| React | 18.x | Component-based UI, widely used in the industry |
| Vite | 5.x | Fast development server and build tool |
| Axios | 1.x | HTTP requests to the backend |
| TailwindCSS | 3.x | Fast, utility-first styling |
| Recharts | 2.x | Visualisation of report/score (charts) |

### Backend – Node.js (API Gateway)
| Technology | Version | Reason |
|---|---|---|
| Node.js | 20.x LTS | JavaScript runtime, fast at I/O |
| Express | 4.x | Minimalist web framework |
| Axios | 1.x | Fetching headers from external websites |
| cors | 2.x | Allow cross-origin requests from the frontend |
| dotenv | 16.x | Managing environment variables |
| crypto (built-in) | – | Generating SHA-1 hash for HIBP k-anonymity |

### Backend – Python (Security Engine)
| Technology | Version | Reason |
|---|---|---|
| Python | 3.12 | Rich security ecosystem |
| FastAPI | 0.11x | Modern, fast async web framework |
| uvicorn | 0.29 | ASGI server for FastAPI |
| python-nmap | 0.7.x | Port scanning via nmap |
| requests | 2.x | HTTP requests from Python |
| math (built-in) | – | Entropy calculation |

### External APIs
| API | Purpose |
|---|---|
| Have I Been Pwned (HIBP) Passwords API | Check whether a password appears in known data breaches |

### Tooling
| Tool | Purpose |
|---|---|
| Git & GitHub | Version control and publication |
| VS Code | Code editor |
| Postman | API testing |
| nmap | Network/port scanner (system tool, requires installation) |
| Docker (optional) | Keep the environment consistent across machines |

---

## 5. Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│                React Frontend (Vite)                     │
│  ┌───────────────────────┐   ┌─────────────────────────┐ │
│  │   Web Security Scanner│   │  Password Strength      │ │
│  │   - Header results    │   │  Analyzer               │ │
│  │   - Port scan results │   │  - Score & entropy      │ │
│  │   - Vuln. detections  │   │  - Pattern feedback     │ │
│  │   - PDF/JSON report   │   │  - Breach check result  │ │
│  └──────────┬────────────┘   └────────────┬────────────┘ │
└─────────────┼────────────────────────────┼──────────────┘
              │   HTTP REST (JSON)          │
┌─────────────┼────────────────────────────┼──────────────┐
│             │  Node.js / Express          │              │
│     ┌───────▼──────────┐    ┌────────────▼───────────┐  │
│     │ /api/scan        │    │ /api/password          │  │
│     │  ├ headers       │    │  ├ /analyze            │  │
│     │  ├ ports         │    │  └ /breach             │  │
│     │  └ report        │    └────────────┬───────────┘  │
│     └──────┬───────────┘                 │              │
│            │ internal HTTP               │ internal HTTP│
│     ┌──────▼───────────┐    ┌────────────▼───────────┐  │
│     │ Python / FastAPI │    │  Node.js crypto +      │  │
│     │  - nmap scan     │    │  HIBP API (k-anon.)    │  │
│     │  - header check  │    │  + Python entropy      │  │
│     │  - vuln. detect  │    └────────────────────────┘  │
│     └──────────────────┘                               │
└─────────────────────────────────────────────────────────┘
                         │
               External target website / HIBP API
```

---

## 6. Features

### 6.1 Web Security Scanner

The user enters a URL and receives a full report in return.

#### 6.1.1 Security Header Check
The backend fetches the HTTP response headers from the given URL and checks for:

| Header | Security purpose |
|---|---|
| `Content-Security-Policy` | Prevents XSS attacks |
| `Strict-Transport-Security` | Enforces HTTPS (HSTS) |
| `X-Content-Type-Options` | Prevents MIME-sniffing |
| `X-Frame-Options` | Protects against clickjacking |
| `Referrer-Policy` | Limits referrer information |
| `Permissions-Policy` | Controls browser API access |
| `X-XSS-Protection` | Legacy XSS filter (browsers) |
| `Cache-Control` | Prevents unsafe caching of sensitive data |

Per header: present ✅ / missing ❌, the actual value and an explanation.

#### 6.1.2 Basic Port Scan
Using `python-nmap`, the most common ports are scanned on the hostname of the URL:

| Port | Service | Risk if open |
|---|---|---|
| 21 | FTP | Unencrypted file transfer |
| 22 | SSH | Brute-force target |
| 23 | Telnet | Completely unencrypted |
| 25 | SMTP | Mail server, spam risk |
| 80 | HTTP | Unencrypted web traffic |
| 443 | HTTPS | Normally open, check SSL |
| 3306 | MySQL | Database exposed |
| 5432 | PostgreSQL | Database exposed |
| 8080 | HTTP-alt | Dev server public? |
| 27017 | MongoDB | Database exposed |

> ⚠️ **Ethical note:** The port scan is only performed on the host of the entered URL. It is the user's responsibility to only scan websites for which they have permission.

#### 6.1.3 Vulnerability Detection (basic)
Based on the combined results, simple vulnerabilities are flagged:

- HTTP used instead of HTTPS → "Unencrypted traffic"
- `Strict-Transport-Security` missing while HTTPS is active → "HSTS not configured"
- Database port (3306, 5432, 27017) open → "Database possibly publicly reachable"
- `Content-Security-Policy` missing → "XSS risk present"
- `X-Frame-Options` missing → "Clickjacking possible"
- Telnet (23) open → "Insecure protocol active"

#### 6.1.4 Report
After the scan, a clear report is assembled containing:

- Total score (e.g. 6/10)
- Summary of found issues per category
- Recommendations per found vulnerability
- Export as JSON (and optionally as PDF via `jsPDF` in the frontend)

---

### 6.2 Password Strength Analyzer

#### 6.2.1 Strength Analysis
- **Score 0–4** based on zxcvbn (proven library, trained on real attack patterns).
- **Visual strength bar** (red → orange → yellow → green).
- **Estimated crack time** (offline and online attack).

#### 6.2.2 Entropy Calculation
Entropy is calculated using: `H = L × log₂(N)`

where `L` is the password length and `N` is the character set size (e.g. 26 for lowercase letters only, 95 for all printable ASCII characters). The Python backend performs this calculation and returns the value in bits.

| Entropy | Rating |
|---|---|
| < 28 bits | Very weak |
| 28–35 bits | Weak |
| 36–59 bits | Fair |
| 60–127 bits | Strong |
| ≥ 128 bits | Very strong |

#### 6.2.3 Pattern Detection
The backend detects common insecure patterns:

- Keyboard sequences: `qwerty`, `123456`, `asdfgh`
- Repetitions: `aaaa`, `1111`
- Common words: `password`, `welcome`, `admin`
- Date patterns: `1990`, `2024`, `ddmmyyyy`
- Leetspeak variants: `p@ssw0rd` (recognised as a weak pattern)

#### 6.2.4 Breached Password Check (Have I Been Pwned)
Integrates with the **HIBP Passwords API** using the **k-anonymity model** – the full password is *never* transmitted:

1. The frontend/Node.js computes a SHA-1 hash of the password.
2. Only the **first 5 characters** of the hash are sent to the HIBP API.
3. HIBP returns all hashes that start with those 5 characters.
4. Locally, it checks whether the full hash is present in the list.
5. Result: "Password found in X data breaches" or "Not found ✅".

---

## 7. API Endpoints

### Node.js (port 3000)

#### `POST /api/scan/headers`
```json
// Request
{ "url": "https://example.com" }

// Response
{
  "url": "https://example.com",
  "headers": {
    "Content-Security-Policy": { "present": true, "value": "default-src 'self'", "risk": "low" },
    "Strict-Transport-Security": { "present": false, "value": null, "risk": "high" }
  },
  "headerScore": 5,
  "maxHeaderScore": 8
}
```

#### `POST /api/scan/ports`
```json
// Request
{ "url": "https://example.com" }

// Response
{
  "host": "example.com",
  "ports": [
    { "port": 22,   "state": "open",   "service": "ssh",   "risk": "medium" },
    { "port": 3306, "state": "closed", "service": "mysql", "risk": "high" }
  ]
}
```

#### `POST /api/scan/report`
```json
// Request
{ "url": "https://example.com" }

// Response
{
  "url": "https://example.com",
  "totalScore": 6,
  "maxScore": 10,
  "grade": "C",
  "vulnerabilities": [
    { "id": "MISSING_HSTS", "severity": "high", "title": "HSTS missing", "recommendation": "Add Strict-Transport-Security header..." }
  ],
  "headers": { "..." : "..." },
  "ports": [ "..." ],
  "generatedAt": "2026-05-10T14:00:00Z"
}
```

#### `POST /api/password/analyze`
```json
// Request
{ "password": "myP@ssw0rd" }

// Response
{
  "score": 2,
  "label": "Weak",
  "entropy": 34.7,
  "entropyLabel": "Weak",
  "crackTimeOnline": "3 hours",
  "crackTimeOffline": "2 seconds",
  "patterns": ["leetspeak", "common-word"],
  "feedback": {
    "warning": "Resembles a commonly used password",
    "suggestions": ["Use a longer passphrase", "Add special characters"]
  }
}
```

#### `POST /api/password/breach`
```json
// Request
{ "hashPrefix": "5BAA6" }

// Response
{
  "breached": true,
  "occurrences": 34201,
  "message": "This password has been found in 34,201 known data breaches."
}
```

### Python / FastAPI (port 8000, internal)

| Endpoint | Method | Function |
|---|---|---|
| `/scan/headers` | POST | Header analysis |
| `/scan/ports` | POST | Nmap port scan |
| `/scan/vulnerabilities` | POST | Vulnerability detection |
| `/password/entropy` | POST | Entropy calculation |
| `/password/patterns` | POST | Pattern detection |

---

## 8. Folder Structure

```
web-security-toolkit/
│
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── scanner/
│   │   │   │   ├── ScannerForm.jsx        # URL input
│   │   │   │   ├── HeaderResults.jsx      # Header table
│   │   │   │   ├── PortResults.jsx        # Port overview
│   │   │   │   ├── VulnList.jsx           # Vulnerabilities
│   │   │   │   └── ReportCard.jsx         # Final report + export
│   │   │   ├── password/
│   │   │   │   ├── PasswordForm.jsx       # Password input
│   │   │   │   ├── StrengthBar.jsx        # Visual bar
│   │   │   │   ├── EntropyGauge.jsx       # Entropy indicator
│   │   │   │   ├── PatternWarnings.jsx    # Pattern warnings
│   │   │   │   └── BreachResult.jsx       # HIBP result
│   │   │   └── shared/
│   │   │       ├── ScoreCircle.jsx        # Circle score
│   │   │       └── Badge.jsx              # Status badges
│   │   ├── pages/
│   │   │   ├── ScannerPage.jsx
│   │   │   └── PasswordPage.jsx
│   │   ├── services/
│   │   │   └── api.js                     # Axios API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server-node/                     # Node.js API Gateway
│   ├── routes/
│   │   ├── scan.js                        # /api/scan/*
│   │   └── password.js                    # /api/password/*
│   ├── services/
│   │   ├── headerService.js               # Fetch & check headers
│   │   ├── hibpService.js                 # Call HIBP API
│   │   └── pythonBridge.js                # Internal HTTP to FastAPI
│   ├── middleware/
│   │   └── validate.js                    # Input validation
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── server-python/                   # Python Security Engine
│   ├── routers/
│   │   ├── scan.py                        # /scan/* endpoints
│   │   └── password.py                    # /password/* endpoints
│   ├── services/
│   │   ├── header_analyzer.py             # Header analysis logic
│   │   ├── port_scanner.py                # nmap wrapper
│   │   ├── vuln_detector.py               # Vulnerability logic
│   │   └── entropy_calculator.py          # Entropy & patterns
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 9. Time Schedule (28 hours)

### Phase 1 – Preparation & Setup (3.5 hours)
| Task | Hours |
|---|---|
| Create Git repo, set up folder structure | 0.5 |
| Set up Node.js backend (Express + basic routing) | 0.75 |
| Set up Python backend (FastAPI + uvicorn) | 0.75 |
| Set up React frontend (Vite + Tailwind) | 0.75 |
| Install and test nmap, explore HIBP API | 0.75 |

### Phase 2 – Web Security Scanner backend (8 hours)
| Task | Hours |
|---|---|
| `headerService.js`: fetch and check headers (8 headers) | 1.5 |
| `header_analyzer.py`: risk rating per header | 1 |
| `port_scanner.py`: nmap wrapper for 10 ports | 2 |
| `vuln_detector.py`: vulnerability detection based on results | 1.5 |
| Build report endpoint + scoring system | 1.5 |
| Test via Postman | 0.5 |

### Phase 3 – Password Analyzer backend (4 hours)
| Task | Hours |
|---|---|
| `entropy_calculator.py`: implement entropy formula | 1 |
| Pattern detection (sequences, repetitions, common words) | 1 |
| `hibpService.js`: SHA-1 hash + k-anonymity HIBP call | 1.5 |
| Test with various passwords | 0.5 |

### Phase 4 – Frontend development (8 hours)
| Task | Hours |
|---|---|
| Navigation structure and page layout | 0.5 |
| Scanner: `ScannerForm`, `HeaderResults`, `PortResults` | 2.5 |
| Scanner: `VulnList`, `ReportCard` + JSON export | 1.5 |
| Password: `PasswordForm`, `StrengthBar`, `EntropyGauge` | 1.5 |
| Password: `PatternWarnings`, `BreachResult` | 1 |
| Global error handling and loading states | 0.5 |

### Phase 5 – Testing & Finalisation (2.5 hours)
| Task | Hours |
|---|---|
| End-to-end testing (multiple URLs, passwords) | 1 |
| Bug fixes and code clean-up | 0.75 |
| Complete README with installation instructions + screenshots | 0.75 |

### Phase 6 – Reflection & Documentation (2 hours)
| Task | Hours |
|---|---|
| Write reflection report (what was learned, what went wrong) | 1.5 |
| Collect screenshots and demo material, push to GitHub | 0.5 |

**Total: 28 hours**

---

## 10. Risks & Mitigation

| Risk | Likelihood | Impact | Approach |
|---|---|---|---|
| Nmap does not work without root privileges | High | High | Use TCP-connect scan (no root required); document in README |
| External website blocks HTTP request | Medium | Medium | Set timeout (5s), show error message in UI |
| HIBP API rate-limiting | Low | Low | Cache requests per session; add delay on repeated calls |
| Python–Node communication fails | Low | High | Fallback: Node.js runs header check itself if Python is unreachable |
| Password visible in logs | Medium | High | Never log the password; only send first 5 hash characters to HIBP |
| Port scan on unauthorised host | Medium | High | Disclaimer in UI; block private IP ranges (RFC1918) in backend |
| Time shortage due to nmap complexity | Medium | Medium | Mark nmap as optional; implement basic TCP check as fallback |

---

## 11. Ethical Considerations

This project contains functionality (port scanning) that could be misused. The following measures are taken:

- A clear **disclaimer** in the UI: "Only scan websites for which you have permission."
- **Blocking of private IP ranges** (192.168.x.x, 10.x.x.x, 127.x.x.x) in the backend.
- The password **never leaves the browser in plaintext** – only the first 5 characters of the SHA-1 hash are sent to HIBP.
- The application is intended for **educational use**.

---

## 12. Delivery Requirements

- [ ] Application starts locally with documented installation instructions
- [ ] Web Security Scanner displays headers, ports, vulnerabilities and report
- [ ] Password Analyzer displays score, entropy, patterns and breach result
- [ ] HIBP integration works via k-anonymity (password is not transmitted)
- [ ] Code is on a public GitHub repository
- [ ] README contains: description, installation instructions and screenshots
- [ ] Reflection report submitted

---

## 13. Sources & References

- [MDN Web Docs – HTTP Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Have I Been Pwned – Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords)
- [zxcvbn – Password Strength Estimator](https://github.com/dropbox/zxcvbn)
- [python-nmap documentation](https://xael.org/pages/python-nmap-en.html)
- [FastAPI documentation](https://fastapi.tiangolo.com)
- [React documentation](https://react.dev)
- [Vite documentation](https://vitejs.dev)
- [NIST – Password Guidelines (SP 800-63B)](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

*Plan written based on the POA application form, May 2026.*
