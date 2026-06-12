SEVERITY_WEIGHTS = {"critical": 3, "high": 2, "medium": 1, "low": 0.5}


def _grade(score: float) -> str:
    if score >= 9:  return "A"
    if score >= 7:  return "B"
    if score >= 5:  return "C"
    if score >= 3:  return "D"
    return "F"


def _get_header(headers: dict, key: str) -> dict:
    return headers.get("headers", {}).get(key, {})


def detect(headers: dict, ports: dict) -> dict:
    vulns = []
    open_ports = {p["port"] for p in ports.get("ports", []) if p["state"] == "open"}
    url = headers.get("url", "")

    # --- Protocol check ---
    if url.startswith("http://"):
        vulns.append({
            "id":             "UNENCRYPTED_TRAFFIC",
            "severity":       "high",
            "title":          "Site is served over HTTP (not HTTPS)",
            "description":    "All data between the browser and server is transmitted in plaintext. Anyone on the same network can read or modify it.",
            "recommendation": "Enable HTTPS and redirect all HTTP traffic to HTTPS."
        })

    # --- Missing or weak security headers ---
    header_checks = [
        {
            "key":      "content-security-policy",
            "id":       "MISSING_CSP",
            "severity": "high",
            "title":    "Content-Security-Policy header missing",
            "description":    "Without a CSP, the browser will execute any script on the page, making XSS attacks trivial.",
            "recommendation": "Add a Content-Security-Policy header, e.g. default-src 'self'."
        },
        {
            "key":      "strict-transport-security",
            "id":       "MISSING_HSTS",
            "severity": "high",
            "title":    "Strict-Transport-Security (HSTS) not configured",
            "description":    "Without HSTS, attackers can downgrade HTTPS connections to HTTP and intercept traffic.",
            "recommendation": "Add Strict-Transport-Security: max-age=31536000; includeSubDomains."
        },
        {
            "key":      "x-frame-options",
            "id":       "MISSING_XFO",
            "severity": "medium",
            "title":    "X-Frame-Options header missing — clickjacking possible",
            "description":    "Without this header, attackers can embed your page in an invisible iframe and trick users into clicking hidden elements.",
            "recommendation": "Add X-Frame-Options: DENY or SAMEORIGIN."
        },
        {
            "key":      "x-content-type-options",
            "id":       "MISSING_XCTO",
            "severity": "medium",
            "title":    "X-Content-Type-Options header missing",
            "description":    "Browsers may try to guess the content type of a response. This can allow MIME-type attacks where a file is interpreted as JavaScript.",
            "recommendation": "Add X-Content-Type-Options: nosniff."
        },
        {
            "key":      "referrer-policy",
            "id":       "MISSING_REFERRER",
            "severity": "low",
            "title":    "Referrer-Policy header missing",
            "description":    "Without this header, the browser sends the full URL as the Referer on every request, potentially leaking sensitive URL parameters.",
            "recommendation": "Add Referrer-Policy: strict-origin-when-cross-origin."
        },
    ]

    for check in header_checks:
        h = _get_header(headers, check["key"])
        if not h.get("present"):
            vulns.append({
                "id":             check["id"],
                "severity":       check["severity"],
                "title":          check["title"],
                "description":    check["description"],
                "recommendation": check["recommendation"],
            })
        elif h.get("quality") in ("weak", "misconfigured"):
            # Header is present but badly configured — flag at one severity lower
            original = check["severity"]
            downgraded = {"critical": "high", "high": "medium", "medium": "low", "low": "low"}[original]
            issues_text = "; ".join(h.get("issues", []))
            vulns.append({
                "id":             check["id"] + "_WEAK",
                "severity":       downgraded,
                "title":          f"{check['title'].replace('missing', 'misconfigured')} — header present but weak",
                "description":    f"The header exists but has configuration issues: {issues_text}",
                "recommendation": check["recommendation"],
            })

    # --- Open port vulnerabilities ---
    if open_ports & {3306, 5432, 27017}:
        exposed = [str(p) for p in sorted(open_ports & {3306, 5432, 27017})]
        vulns.append({
            "id":             "EXPOSED_DB",
            "severity":       "critical",
            "title":          f"Database port(s) publicly reachable: {', '.join(exposed)}",
            "description":    "Databases should never be directly accessible from the internet. This allows attackers to attempt brute-force logins or exploit unpatched database vulnerabilities.",
            "recommendation": "Restrict database access to internal networks only using a firewall or security group rules."
        })

    if 23 in open_ports:
        vulns.append({
            "id":             "TELNET_OPEN",
            "severity":       "critical",
            "title":          "Telnet (port 23) is open",
            "description":    "Telnet transmits everything — including passwords — in plaintext over the network. It has been obsolete since SSH was introduced in 1995.",
            "recommendation": "Disable Telnet immediately and use SSH (port 22) instead."
        })

    if 21 in open_ports:
        vulns.append({
            "id":             "FTP_OPEN",
            "severity":       "high",
            "title":          "FTP (port 21) is open",
            "description":    "FTP transmits credentials and file contents in plaintext. Passive FTP also opens unpredictable high ports.",
            "recommendation": "Replace FTP with SFTP (SSH file transfer) or FTPS (FTP over TLS)."
        })

    if 8080 in open_ports:
        vulns.append({
            "id":             "DEV_PORT_OPEN",
            "severity":       "medium",
            "title":          "HTTP-alt port 8080 is open",
            "description":    "Port 8080 is commonly used by development or staging servers. Exposing it publicly may give access to an unfinished, unprotected version of the application.",
            "recommendation": "Confirm this is intentional. If it is a dev server, restrict access with a firewall rule."
        })

    # --- Calculate final score and grade ---
    penalty = sum(SEVERITY_WEIGHTS.get(v["severity"], 1) for v in vulns)
    score   = round(max(0.0, 10.0 - penalty), 1)
    grade   = _grade(score)

    return {
        "vulnerabilities": vulns,
        "score":           score,
        "maxScore":        10,
        "grade":           grade,
    }
