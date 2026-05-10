from urllib.parse import urlparse
import nmap

PORTS = "21,22,23,25,80,443,3306,5432,8080,27017"

RISK = {
    21: "high", 22: "medium", 23: "high", 25: "medium",
    80: "low",  443: "low",   3306: "high", 5432: "high",
    8080: "low", 27017: "high"
}

def scan(url: str) -> dict:
    host = urlparse(url).hostname
    nm = nmap.PortScanner()
    # -sT = TCP connect scan (no root required)
    nm.scan(hosts=host, ports=PORTS, arguments="-sT --open -T4")

    ports = []
    for proto in nm[host].all_protocols() if host in nm.all_hosts() else []:
        for port, data in nm[host][proto].items():
            ports.append({
                "port":    port,
                "state":   data["state"],
                "service": data["name"],
                "risk":    RISK.get(port, "low")
            })

    return {"host": host, "ports": ports}
