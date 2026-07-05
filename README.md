# Web Security Toolkit

A full-stack web security tool built as a second-year Computer Science project at Avans Hogeschool (Breda). It consists of two modules: a **Web Security Scanner** and a **Password Strength Analyzer**.

Built to learn how real security tooling works end-to-end — from HTTP header analysis and port scanning to entropy calculation and breach checking via the Have I Been Pwned API.

---

## What it does

### Web Security Scanner
Scan any public URL and get a scored security report:
- Checks presence and quality of 8 HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- Runs an nmap TCP port scan on 10 common ports
- Detects vulnerabilities (e.g. exposed database ports, missing headers) with severity ratings (Critical → Low)
- Grades the target A–F based on weighted vulnerability scoring
- Exports the full report as JSON

### Password Strength Analyzer
Analyse a password without ever sending it to a server:
- Calculates Shannon entropy and estimates crack time
- Detects 13 weak pattern types (keyboard sequences, common words, repeated characters, etc.)
- Checks against the Have I Been Pwned breach database using **k-anonymity** — only a 5-character SHA-1 prefix is sent; the full password never leaves the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + Recharts |
| API Gateway | Node.js 20 + Express |
| Security Engine | Python 3.12 + FastAPI |
| Port Scanning | python-nmap (wraps system nmap) |
| Breach Check | Have I Been Pwned Passwords API v3 |

**Architecture:** The Node.js gateway handles routing, rate limiting, and SSRF protection. It forwards compute-heavy tasks to the Python engine over an internal authenticated channel. The frontend proxies all API calls through Vite, so no backend URLs are hardcoded.

---

## Security Features (implemented)

The backend is hardened beyond a typical school project:

- **SSRF protection** — blocks private IP ranges, resolves DNS before validating, follows redirects safely (each hop checked)
- **Rate limiting** — global (200 req/15 min), strict on scan endpoints (10 req/15 min)
- **Input validation** — `express-validator` on all routes; Pydantic strict mode in Python
- **Helmet.js** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options on all responses
- **Internal auth** — Python engine requires `X-Internal-Token`; rejects direct external calls
- **Concurrency limit** — max 3 simultaneous nmap scans to prevent DoS
- **Structured logging** — Winston + Morgan (Node), Python `logging` with JSON formatter
- **Error tracking** — Sentry integration (Node + Python), guarded by env var
- **Uptime monitoring** — UptimeRobot on homepage + `/health` deep-check endpoint

---

## Prerequisites

- Node.js 20+
- Python 3.12+
- [nmap](https://nmap.org/download.html) installed on your system and in PATH

---

## Installation

```bash
git clone <repo-url>
cd web-security-toolkit
```

**Frontend**
```bash
cd client
npm install
cp .env.example .env
```

**Node.js backend**
```bash
cd server-node
npm install
cp .env.example .env
```

**Python backend**
```bash
cd server-python
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

---

## Running locally

Open three terminals from the project root:

```bash
# Terminal 1 — Python security engine (port 8000)
cd server-python
.venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2 — Node.js API gateway (port 3001)
cd server-node
npm run dev

# Terminal 3 — React frontend (port 5173)
cd client
npm run dev
```

Visit **http://localhost:5173**

The Vite dev proxy forwards all `/api/...` calls to Node on port 3001 — no CORS config needed during development.

---

## Environment Variables

Copy `.env.example` to `.env` in both `server-node/` and `client/`. The defaults work out of the box for local development.

| Variable | Where | Required in prod |
|---|---|---|
| `INTERNAL_API_TOKEN` | `server-node/.env` | Yes — shared secret between Node and Python |
| `SENTRY_DSN` | `server-node/.env` + `server-python/.env` | Optional |
| `LOGTAIL_SOURCE_TOKEN` | `server-node/.env` | Optional |
| `VITE_UMAMI_WEBSITE_ID` | `client/.env` | Optional |

---

## Project Structure

```
web-security-toolkit/
├── client/                  # React frontend (Vite + TailwindCSS)
│   └── src/
│       ├── components/      # Scanner, Password, and shared UI components
│       ├── pages/           # ScannerPage.jsx, PasswordPage.jsx
│       └── services/api.js  # All Axios calls
├── server-node/             # Express API gateway
│   ├── routes/              # scan.js, password.js
│   ├── services/            # headerService.js, hibpService.js, pythonBridge.js
│   └── middleware/          # validate.js (SSRF + input)
├── server-python/           # FastAPI security engine
│   ├── routers/             # scan.py, password.py
│   └── services/            # header_analyzer.py, port_scanner.py, vuln_detector.py, entropy_calculator.py
└── bruno/                   # Bruno API collection (all endpoints, committed to git)
```

---

## Ethical Notice

Only scan websites and infrastructure you own or have explicit permission to test. The backend blocks all private/local IP ranges (RFC 1918, link-local, loopback) and validates DNS resolution to prevent misuse.
