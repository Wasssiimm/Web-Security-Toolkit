import re
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, field_validator
from services import port_scanner, vuln_detector, header_analyzer
from limiter import limiter

router = APIRouter()

_HTTP_SCHEME_RE = re.compile(r"^https?://", re.IGNORECASE)


class UrlBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    url: str = Field(max_length=2048)

    @field_validator("url")
    @classmethod
    def url_must_be_http(cls, v: str) -> str:
        if not _HTTP_SCHEME_RE.match(v):
            raise ValueError("url must start with http:// or https://")
        return v


class HeadersBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    headers: dict


class VulnBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    headers: dict
    ports: dict


@router.post("/headers")
@limiter.limit("60/minute")
def analyze_headers(request: Request, body: HeadersBody):
    return header_analyzer.analyze(body.headers)


@router.post("/ports")
@limiter.limit("60/minute")
def scan_ports(request: Request, body: UrlBody):
    try:
        return port_scanner.scan(body.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/vulnerabilities")
@limiter.limit("60/minute")
def detect_vulnerabilities(request: Request, body: VulnBody):
    return vuln_detector.detect(body.headers, body.ports)
