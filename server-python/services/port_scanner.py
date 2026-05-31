from urllib.parse import urlparse
import nmap

PORTS = "21,22,23,25,80,443,3306,5432,8080,27017"

# Metadata for every port we scan — shown in the report regardless of state
PORTS_META = {
    21:    {"service": "FTP",        "risk": "high",   "risk_desc": "Unencrypted file transfer — credentials sent in plaintext"},
    22:    {"service": "SSH",        "risk": "medium", "risk_desc": "Brute-force target if password authentication is enabled"},
    23:    {"service": "Telnet",     "risk": "high",   "risk_desc": "Completely unencrypted — all traffic visible on the network"},
    25:    {"service": "SMTP",       "risk": "medium", "risk_desc": "Mail server — can be abused for spam relay if misconfigured"},
    80:    {"service": "HTTP",       "risk": "low",    "risk_desc": "Unencrypted web traffic — consider redirecting all traffic to HTTPS"},
    443:   {"service": "HTTPS",      "risk": "low",    "risk_desc": "Encrypted — verify the SSL certificate is valid and not expired"},
    3306:  {"service": "MySQL",      "risk": "high",   "risk_desc": "Database publicly reachable — restrict access to internal network only"},
    5432:  {"service": "PostgreSQL", "risk": "high",   "risk_desc": "Database publicly reachable — restrict access to internal network only"},
    8080:  {"service": "HTTP-alt",   "risk": "medium", "risk_desc": "Alternative HTTP port — development server may be running publicly"},
    27017: {"service": "MongoDB",    "risk": "high",   "risk_desc": "Database publicly reachable — often misconfigured with no authentication"},
}


def scan(url: str) -> dict:
    host = urlparse(url).hostname

    if not host:
        raise ValueError(f"Could not extract a hostname from URL: {url}")

    # Run the nmap scan
    try:
        nm = nmap.PortScanner()
        # -sT  = TCP connect scan (no root/admin required)
        # -T4  = aggressive timing (faster, acceptable for authorised scans)
        nm.scan(hosts=host, ports=PORTS, arguments="-sT -T4")
    except nmap.PortScannerError:
        raise RuntimeError(
            "nmap is not installed or could not be executed. "
            "Install it from https://nmap.org/download.html and make sure it is on your PATH."
        )

    # nmap resolves the hostname to an IP internally, so nm.all_hosts() contains
    # IPs not the original hostname — use the first scanned host if available.
    all_hosts = nm.all_hosts()
    host_data = nm[all_hosts[0]] if all_hosts else {}
    ports = []

    for port_num, meta in PORTS_META.items():
        # Default to 'filtered' — means nmap got no response (firewall blocking or host unreachable)
        state = "filtered"
        if host_data:
            for proto in host_data.all_protocols():
                if port_num in host_data[proto]:
                    state = host_data[proto][port_num]["state"]
                    break

        ports.append({
            "port":      port_num,
            "state":     state,
            "service":   meta["service"],
            # Only assign risk when the port is actually open — closed/filtered ports are not a risk
            "risk":      meta["risk"] if state == "open" else "none",
            "risk_desc": meta["risk_desc"] if state == "open" else None,
        })

    return {"host": host, "ports": ports}
