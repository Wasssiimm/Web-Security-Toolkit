from fastapi import APIRouter
from pydantic import BaseModel
from services import port_scanner, vuln_detector, header_analyzer

router = APIRouter()

class UrlBody(BaseModel):
    url: str

class HeadersBody(BaseModel):
    headers: dict   # raw HTTP response headers, lowercase keys

class VulnBody(BaseModel):
    headers: dict
    ports: dict

@router.post("/headers")
def analyze_headers(body: HeadersBody):
    return header_analyzer.analyze(body.headers)

@router.post("/ports")
def scan_ports(body: UrlBody):
    return port_scanner.scan(body.url)

@router.post("/vulnerabilities")
def detect_vulnerabilities(body: VulnBody):
    return vuln_detector.detect(body.headers, body.ports)
