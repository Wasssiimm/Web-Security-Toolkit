def detect(headers: dict, ports: dict) -> dict:
    vulns = []
    open_ports = {p["port"] for p in ports.get("ports", []) if p["state"] == "open"}

    if not headers.get("headers", {}).get("content-security-policy", {}).get("present"):
        vulns.append({"id": "MISSING_CSP", "severity": "high", "title": "Content-Security-Policy missing", "recommendation": "Add a CSP header to mitigate XSS attacks."})

    if not headers.get("headers", {}).get("strict-transport-security", {}).get("present"):
        vulns.append({"id": "MISSING_HSTS", "severity": "high", "title": "HSTS not configured", "recommendation": "Add Strict-Transport-Security header."})

    if not headers.get("headers", {}).get("x-frame-options", {}).get("present"):
        vulns.append({"id": "MISSING_XFO", "severity": "medium", "title": "Clickjacking possible", "recommendation": "Add X-Frame-Options: DENY or SAMEORIGIN."})

    if open_ports & {3306, 5432, 27017}:
        vulns.append({"id": "EXPOSED_DB", "severity": "critical", "title": "Database port publicly reachable", "recommendation": "Restrict database access to internal networks only."})

    if 23 in open_ports:
        vulns.append({"id": "TELNET_OPEN", "severity": "critical", "title": "Telnet port open", "recommendation": "Disable Telnet; use SSH instead."})

    score = max(0, 10 - len(vulns) * 2)
    return {"vulnerabilities": vulns, "score": score}
