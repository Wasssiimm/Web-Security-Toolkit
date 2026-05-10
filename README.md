# Web Security Toolkit

A full-stack web application with two security modules:

1. **Web Security Scanner** – analyses a URL for security headers, open ports, and vulnerabilities.
2. **Password Strength Analyzer** – evaluates passwords for entropy, patterns, and known breaches (HIBP).

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| API Gateway | Node.js 20 + Express |
| Security Engine | Python 3.12 + FastAPI |

## Prerequisites

- Node.js 20+
- Python 3.12+
- [nmap](https://nmap.org/download.html) installed on your system

## Installation

### 1. Clone the repo

```bash
git clone <repo-url>
cd web-security-toolkit
```

### 2. Frontend

```bash
cd client
npm install
```

### 3. Node.js backend

```bash
cd server-node
npm install
```

### 4. Python backend

```bash
cd server-python
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

## Running locally

Open three terminals:

```bash
# Terminal 1 – Python engine
cd server-python && uvicorn main:app --reload --port 8000

# Terminal 2 – Node API
cd server-node && npm run dev

# Terminal 3 – Frontend
cd client && npm run dev
```

Visit http://localhost:5173

## Ethical notice

Only scan websites for which you have explicit permission. The backend blocks private/local IP ranges.
