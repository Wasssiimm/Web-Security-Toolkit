import math
import re

PATTERNS = [
    (r"(qwerty|asdfgh|zxcvbn|123456|654321)", "keyboard-sequence"),
    (r"(.)\1{3,}",                             "repetition"),
    (r"(password|welcome|admin|letmein)",       "common-word"),
    (r"\b(19|20)\d{2}\b",                      "date-pattern"),
    (r"p@ssw(0|o)rd|@dmin",                    "leetspeak"),
]

def _charset_size(pwd: str) -> int:
    size = 0
    if re.search(r"[a-z]", pwd): size += 26
    if re.search(r"[A-Z]", pwd): size += 26
    if re.search(r"\d",    pwd): size += 10
    if re.search(r"[^a-zA-Z\d]", pwd): size += 33
    return size or 1

def _entropy_label(bits: float) -> str:
    if bits < 28:  return "Very weak"
    if bits < 36:  return "Weak"
    if bits < 60:  return "Fair"
    if bits < 128: return "Strong"
    return "Very strong"

def analyze(password: str) -> dict:
    n = _charset_size(password)
    entropy = len(password) * math.log2(n) if n > 1 else 0

    found_patterns = []
    for pattern, label in PATTERNS:
        if re.search(pattern, password, re.IGNORECASE):
            found_patterns.append(label)

    score = min(4, int(entropy / 30))
    if found_patterns:
        score = max(0, score - 1)

    labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"]

    return {
        "entropy":      round(entropy, 2),
        "entropyLabel": _entropy_label(entropy),
        "score":        score,
        "label":        labels[score],
        "patterns":     found_patterns,
        "charsetSize":  n
    }
