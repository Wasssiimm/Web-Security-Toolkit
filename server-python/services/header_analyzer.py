import re

def _check_csp(value: str) -> dict:
    issues = []
    if "default-src *" in value or "script-src *" in value:
        issues.append("Wildcard (*) allows scripts from any source — no XSS protection")
    if "'unsafe-inline'" in value:
        issues.append("'unsafe-inline' allows inline scripts — weakens XSS protection")
    if "'unsafe-eval'" in value:
        issues.append("'unsafe-eval' allows eval() — weakens XSS protection")
    if "default-src" not in value and "script-src" not in value:
        issues.append("No default-src or script-src directive found")
    quality = "good" if not issues else ("weak" if len(issues) == 1 else "misconfigured")
    return {"quality": quality, "issues": issues}


def _check_hsts(value: str) -> dict:
    issues = []
    match = re.search(r"max-age=(\d+)", value, re.IGNORECASE)
    if not match:
        issues.append("max-age directive is missing")
    elif int(match.group(1)) < 31536000:
        issues.append(f"max-age={match.group(1)} is too short — should be at least 31536000 (1 year)")
    if "includesubdomains" not in value.lower():
        issues.append("includeSubDomains is missing — subdomains are not protected")
    quality = "good" if not issues else ("weak" if len(issues) == 1 else "misconfigured")
    return {"quality": quality, "issues": issues}


def _check_xcto(value: str) -> dict:
    issues = []
    if value.strip().lower() != "nosniff":
        issues.append(f"Value should be 'nosniff', got '{value}'")
    quality = "good" if not issues else "misconfigured"
    return {"quality": quality, "issues": issues}


def _check_xfo(value: str) -> dict:
    issues = []
    v = value.strip().upper()
    if v not in ("DENY", "SAMEORIGIN"):
        issues.append("Value should be DENY or SAMEORIGIN — ALLOW-FROM is deprecated and ignored by modern browsers")
    quality = "good" if not issues else "misconfigured"
    return {"quality": quality, "issues": issues}


def _check_referrer(value: str) -> dict:
    STRICT = {"no-referrer", "strict-origin", "strict-origin-when-cross-origin", "no-referrer-when-downgrade"}
    WEAK   = {"unsafe-url", "origin", "origin-when-cross-origin"}
    # Referrer-Policy accepts a comma-separated fallback list (e.g. GitHub sends
    # "origin-when-cross-origin, strict-origin-when-cross-origin") — browsers apply
    # the last token they recognise, so validate against that one, not the raw string.
    tokens = [t.strip().lower() for t in value.split(",") if t.strip()]
    known = [t for t in tokens if t in STRICT or t in WEAK]
    unknown = [t for t in tokens if t not in STRICT and t not in WEAK]
    issues = []
    if unknown:
        issues.append(f"Unrecognised value '{', '.join(unknown)}'")
    effective = known[-1] if known else None
    if effective in WEAK:
        issues.append(f"'{effective}' sends referrer data broadly — consider a stricter policy")
    quality = "good" if not issues else "weak"
    return {"quality": quality, "issues": issues}


def _check_permissions(value: str) -> dict:
    # Permissions-Policy is highly flexible; flag only if it's clearly too open
    issues = []
    if value.strip() == "":
        issues.append("Empty value provides no restrictions")
    quality = "good" if not issues else "weak"
    return {"quality": quality, "issues": issues}


def _check_xxss(value: str) -> dict:
    issues = []
    v = value.strip()
    # "0" is actually acceptable — modern guidance says disable it and rely on CSP instead
    if v not in ("0", "1; mode=block", "1"):
        issues.append(f"Unrecognised value '{value}' — use '1; mode=block' or '0'")
    quality = "good" if not issues else "misconfigured"
    return {"quality": quality, "issues": issues}


def _check_cache(value: str) -> dict:
    issues = []
    v = value.lower()
    if "no-store" not in v and "no-cache" not in v:
        issues.append("Missing no-store or no-cache — sensitive pages may be cached by the browser")
    if "public" in v and "no-store" not in v:
        issues.append("'public' combined with no no-store can expose sensitive data via shared caches")
    quality = "good" if not issues else "weak"
    return {"quality": quality, "issues": issues}


CHECKERS = {
    "content-security-policy":   _check_csp,
    "strict-transport-security": _check_hsts,
    "x-content-type-options":    _check_xcto,
    "x-frame-options":           _check_xfo,
    "referrer-policy":           _check_referrer,
    "permissions-policy":        _check_permissions,
    "x-xss-protection":          _check_xxss,
    "cache-control":             _check_cache,
}


def analyze(raw_headers: dict) -> dict:
    """
    Takes a dict of raw HTTP response headers (lowercase keys → string values).
    Returns per-header quality analysis for the 8 security headers we track.
    """
    results = {}
    for header_key, checker in CHECKERS.items():
        value = raw_headers.get(header_key)
        if value:
            analysis = checker(value)
            results[header_key] = {
                "present":  True,
                "value":    value,
                "quality":  analysis["quality"],
                "issues":   analysis["issues"],
                "risk":     "none" if analysis["quality"] == "good" else
                            "low"  if analysis["quality"] == "weak"  else "medium",
            }
        else:
            results[header_key] = {
                "present": False,
                "value":   None,
                "quality": None,
                "issues":  [],
                "risk":    "high" if header_key in ("content-security-policy", "strict-transport-security")
                           else "medium" if header_key in ("x-content-type-options", "x-frame-options")
                           else "low",
            }
    return {"headers": results}
