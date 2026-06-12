import math
import re

COMMON_PASSWORDS = {
    "password", "password1", "password12", "password123", "passwords",
    "welcome", "welcome1", "letmein", "letmein1",
    "admin", "admin123", "admin1234", "administrator",
    "iloveyou", "iloveyou1", "sunshine", "monkey", "dragon",
    "master", "hello", "hello123", "hello1234",
    "qwerty", "qwerty123", "qwerty1", "qwertyuiop",
    "abc123", "abc1234", "abcdef",
    "football", "baseball", "basketball", "soccer",
    "superman", "batman", "spiderman", "princess",
    "shadow", "ninja", "trustno1", "secret",
    "michael", "jessica", "starwars", "login", "access",
    "pass", "test", "guest", "default", "root", "toor",
    "1234", "12345", "123456", "1234567", "12345678",
    "123456789", "1234567890", "000000", "111111",
    "123123", "654321", "passw0rd", "p@ssword", "p@ssw0rd",
}

# Each tuple: (regex, label)
# Order matters — more specific patterns should come before general ones.
PATTERNS = [
    # Full keyboard rows
    (r"qwertyuiop|asdfghjkl|zxcvbnm",                           "keyboard-row"),
    # Common keyboard walks
    (r"qwerty|asdfgh|zxcvbn|ytrewq|lkjhgf|mnbvcx|qwert|asdfg",  "keyboard-sequence"),
    # Numeric runs
    (r"1234567890|0987654321|123456|654321|12345|54321|1234|4321|2345|3456", "numeric-sequence"),
    # Sequential alphabet runs (forward and backward)
    (r"abcdef|bcdefg|cdefgh|defghi|efghij|fedcba|zyxwvu|zyxw",  "sequential-letters"),
    # Repeated characters (3 or more of the same)
    (r"(.)\1{2,}",                                               "repetition"),
    # Year patterns — no word boundaries since digits are also \w in Python
    (r"(19|20)\d{2}",                                            "year"),
    # Date patterns (ddmm or mmdd with optional year)
    (r"(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{2,4})?",        "date"),
    # Month names
    (r"jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|jun(e)?|"
     r"jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?|nov(ember)?|dec(ember)?",
                                                                  "month-name"),
    # Leetspeak variants of common words
    (r"p[@a]s{1,2}w[o0]r?d",                                    "leet-password"),
    (r"[a4]dm[i1]n|[a4]dmin",                                   "leet-admin"),
    # Common words (plain)
    (r"\b(welcome|letmein|iloveyou|sunshine|monkey|dragon|master|secret|shadow)\b",
                                                                  "common-word"),
    (r"\b(football|baseball|basketball|superman|batman|princess|trustno1)\b",
                                                                  "common-word"),
]


def _charset_size(pwd: str) -> int:
    size = 0
    if re.search(r"[a-z]", pwd):       size += 26
    if re.search(r"[A-Z]", pwd):       size += 26
    if re.search(r"\d", pwd):          size += 10
    if re.search(r"[^a-zA-Z\d]", pwd): size += 33
    return size or 1


def _entropy_label(bits: float) -> str:
    if bits < 28:  return "Very weak"
    if bits < 36:  return "Weak"
    if bits < 60:  return "Fair"
    if bits < 128: return "Strong"
    return "Very strong"


def _crack_time(entropy: float) -> dict:
    # Cap to avoid float overflow (2^1023 is near float max)
    combinations = 2 ** min(entropy, 150)

    def fmt(seconds: float) -> str:
        if seconds < 1:           return "instantly"
        if seconds < 60:          return f"{int(seconds)} seconds"
        if seconds < 3_600:       return f"{int(seconds / 60)} minutes"
        if seconds < 86_400:      return f"{int(seconds / 3_600)} hours"
        if seconds < 2_592_000:   return f"{int(seconds / 86_400)} days"
        if seconds < 31_536_000:  return f"{int(seconds / 2_592_000)} months"
        years = seconds / 31_536_000
        if years < 1_000:         return f"{int(years)} years"
        if years < 1_000_000:     return f"{int(years / 1_000)}k years"
        if years < 1_000_000_000: return f"{int(years / 1_000_000)}M years"
        return "centuries"

    return {
        "online":  fmt(combinations / 100),   # rate-limited login: 100 guesses/sec
        "offline": fmt(combinations / 1e10),  # GPU cracking a fast hash: 10B guesses/sec
    }


def _feedback(patterns: list, pwd: str) -> dict:
    suggestions = []
    warning = None

    if "common-password" in patterns:
        warning = "This is one of the most commonly used passwords"
        suggestions.append("Choose a password that is not on any top-10000 list")
    elif "common-word" in patterns or "leet-password" in patterns or "leet-admin" in patterns:
        warning = "This resembles a commonly used password"
        suggestions.append("Avoid common words — letter substitutions (@, 0, 1) are always tried")

    if "keyboard-sequence" in patterns or "keyboard-row" in patterns:
        warning = warning or "Contains a keyboard walk"
        suggestions.append("Avoid keyboard patterns like 'qwerty' or 'asdfgh'")

    if "numeric-sequence" in patterns:
        suggestions.append("Avoid simple number sequences like '123456'")

    if "repetition" in patterns:
        suggestions.append("Avoid repeated characters like 'aaa' or '111'")

    if any(p in patterns for p in ("year", "date", "month-name")):
        suggestions.append("Avoid dates and years — attackers always try these first")

    if len(pwd) < 8:
        suggestions.append("Use at least 12 characters")
    elif len(pwd) < 12:
        suggestions.append("Aim for 16+ characters for stronger security")

    if not re.search(r"[A-Z]", pwd):
        suggestions.append("Add uppercase letters")
    if not re.search(r"\d", pwd):
        suggestions.append("Add numbers")
    if not re.search(r"[^a-zA-Z\d]", pwd):
        suggestions.append("Add special characters (!, @, #, $, ...)")

    return {
        "warning":     warning,
        "suggestions": suggestions[:3],  # cap at 3 so the UI stays clean
    }


def analyze(password: str) -> dict:
    n = _charset_size(password)
    raw_entropy = len(password) * math.log2(n) if n > 1 else 0.0

    found_patterns = []

    # Exact match against known common passwords (normalise whitespace + case)
    normalized = re.sub(r"\s+", "", password.lower())
    if normalized in COMMON_PASSWORDS:
        found_patterns.append("common-password")

    for regex, label in PATTERNS:
        if re.search(regex, password, re.IGNORECASE):
            found_patterns.append(label)

    # Deduplicate while keeping order
    seen = set()
    unique_patterns = [p for p in found_patterns if not (p in seen or seen.add(p))]

    # Effective entropy: penalise each distinct pattern type by 10 bits.
    # Attackers use pattern-specific dictionaries, so these passwords are
    # cracked far faster than the raw character-set entropy suggests.
    penalty = len(unique_patterns) * 10
    effective_entropy = max(0.0, raw_entropy - penalty)

    score = min(4, int(effective_entropy / 25))
    labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"]

    return {
        "entropy":          round(raw_entropy, 2),
        "effectiveEntropy": round(effective_entropy, 2),
        "entropyLabel":     _entropy_label(effective_entropy),
        "score":            score,
        "label":            labels[score],
        "patterns":         unique_patterns,
        "charsetSize":      n,
        "length":           len(password),
        "crackTime":        _crack_time(effective_entropy),
        "feedback":         _feedback(unique_patterns, password),
    }
