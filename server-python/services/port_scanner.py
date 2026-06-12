import ipaddress
import logging
import re
import socket
import time
from urllib.parse import urlparse
import nmap

logger = logging.getLogger(__name__)

PORTS = "21,22,23,25,80,443,3306,5432,8080,27017"

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

# Blocks .local / .internal / .localhost TLD hostnames by name before DNS resolution
_PRIVATE_HOSTNAME_RE = re.compile(
    r"^(localhost|(.*\.)?local|(.*\.)?internal|(.*\.)?localhost)$", re.IGNORECASE
)


def _is_private_ip(ip: str) -> bool:
    """Returns True if the IP address is in a private, loopback, or link-local range."""
    try:
        addr = ipaddress.ip_address(ip)
        # Python 3.11+ ip_address.is_private covers RFC-1918, loopback, link-local, etc.
        return (
            addr.is_private    or  # 10.x, 172.16-31.x, 192.168.x, fc00::/7, fe80::/10 …
            addr.is_loopback   or  # 127.x, ::1
            addr.is_link_local or  # 169.254.x.x (AWS metadata), fe80::/10
            addr.is_unspecified    # 0.0.0.0, ::
        )
    except ValueError:
        return False  # Not a valid IP literal — treat as hostname, not a private IP


def _assert_safe_host(hostname: str) -> None:
    """
    Raises ValueError if the hostname is private, internal, or resolves to a
    private IP. Defence-in-depth mirror of Node's validate.js.
    """
    if _PRIVATE_HOSTNAME_RE.match(hostname):
        raise ValueError("Scanning private/local addresses is not allowed")

    # Block bare private IP literals supplied directly in the URL
    if _is_private_ip(hostname):
        raise ValueError("Scanning private/local addresses is not allowed")

    # DNS rebinding defence: resolve to actual IP and re-check.
    # An attacker could use a public-looking domain that resolves to 127.0.0.1.
    try:
        results = socket.getaddrinfo(hostname, None)
    except OSError:
        raise ValueError(f"Unable to resolve hostname: {hostname}")

    for result in results:
        resolved_ip = result[4][0]
        if _is_private_ip(resolved_ip):
            raise ValueError("Scanning private/local addresses is not allowed")


def scan(url: str) -> dict:
    host = urlparse(url).hostname

    if not host:
        raise ValueError(f"Could not extract a hostname from URL: {url}")

    _assert_safe_host(host)

    try:
        nm = nmap.PortScanner()
        logger.info('Port scan starting: %s', host)
        _start = time.monotonic()
        # -sT             = TCP connect scan (no root/admin required)
        # -T4             = aggressive timing (faster, acceptable for authorised scans)
        # --host-timeout  = bail out after 30s — never block indefinitely on one host
        # --max-retries 1 = one retry max — avoids hanging on filtered ports
        nm.scan(hosts=host, ports=PORTS, arguments="-sT -T4 --host-timeout 30s --max-retries 1")
        logger.info('Port scan complete: %s (%dms)', host, round((time.monotonic() - _start) * 1000))
    except nmap.PortScannerError:
        raise RuntimeError(
            "nmap is not installed or could not be executed. "
            "Install it from https://nmap.org/download.html and make sure it is on your PATH."
        )

    all_hosts = nm.all_hosts()
    host_data = nm[all_hosts[0]] if all_hosts else {}
    ports = []

    for port_num, meta in PORTS_META.items():
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
            "risk":      meta["risk"] if state == "open" else "none",
            "risk_desc": meta["risk_desc"] if state == "open" else None,
        })

    return {"host": host, "ports": ports}
