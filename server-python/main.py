import json
import logging
import os
import shutil
import time
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from routers import scan, password
from limiter import limiter

# ── Logging configuration ─────────────────────────────────────────────────────
# Production: structured JSON lines (machine-readable, easy to ship to Betterstack etc.)
# Development: human-readable coloured format
_IS_PROD = os.getenv('PYTHON_ENV') == 'production'


class _JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        entry = {
            'time':    self.formatTime(record, '%Y-%m-%dT%H:%M:%S'),
            'level':   record.levelname.lower(),
            'logger':  record.name,
            'message': record.getMessage(),
        }
        if record.exc_info:
            entry['exception'] = self.formatException(record.exc_info)
        return json.dumps(entry)


_handler = logging.StreamHandler()
_handler.setFormatter(
    _JsonFormatter() if _IS_PROD
    else logging.Formatter('%(asctime)s %(levelname)-8s %(name)s: %(message)s', datefmt='%H:%M:%S')
)
# force=True replaces any handlers uvicorn already attached to the root logger
logging.basicConfig(level=logging.INFO, handlers=[_handler], force=True)

logger = logging.getLogger(__name__)

# ── Sentry ────────────────────────────────────────────────────────────────────
# Only active when SENTRY_DSN is set. FastAPI + Starlette integrations add
# automatic request context and exception capture.
_SENTRY_DSN = os.getenv('SENTRY_DSN', '')
if _SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.starlette import StarletteIntegration
    sentry_sdk.init(
        dsn=_SENTRY_DSN,
        environment=os.getenv('PYTHON_ENV', 'development'),
        traces_sample_rate=0.2,
        integrations=[StarletteIntegration(), FastApiIntegration()],
    )

_INTERNAL_TOKEN = os.getenv('INTERNAL_API_TOKEN', '')

# ── Startup guard ─────────────────────────────────────────────────────────────
if os.getenv('PYTHON_ENV') == 'production' and not _INTERNAL_TOKEN:
    raise RuntimeError('FATAL: INTERNAL_API_TOKEN must be set in production')

app = FastAPI(title='Web Security Toolkit – Python Engine')

# ── Internal auth middleware ──────────────────────────────────────────────────
# Rejects any request that didn't come through the Node gateway.
# Prevents attackers from bypassing Node's input validation and rate limiting
# by calling port 8000 directly.
@app.middleware('http')
async def internal_auth(request: Request, call_next):
    if request.url.path == '/health':
        return await call_next(request)
    if _INTERNAL_TOKEN and request.headers.get('X-Internal-Token') != _INTERNAL_TOKEN:
        return JSONResponse(status_code=401, content={'error': 'Unauthorized'})
    return await call_next(request)

# ── Body size limit ───────────────────────────────────────────────────────────
# Defence-in-depth: Python has no body-parser equivalent, so enforce 10kb here.
@app.middleware('http')
async def body_size_limit(request: Request, call_next):
    max_bytes = 10 * 1024
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > max_bytes:
        return JSONResponse(status_code=413, content={'error': 'Request body too large'})
    return await call_next(request)

# ── Rate limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Exception handlers ────────────────────────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    errors = [
        {'field': str(e['loc'][-1]) if e['loc'] else 'body', 'error': e['msg']}
        for e in exc.errors()
    ]
    return JSONResponse(status_code=422, content={'detail': errors})

@app.exception_handler(Exception)
async def generic_handler(request: Request, exc: Exception):
    logger.exception('Unhandled error on %s: %s', request.url.path, exc)
    return JSONResponse(status_code=500, content={'error': 'Internal server error'})

# ── Request logging middleware ────────────────────────────────────────────────
# Added last so it runs first (outermost), capturing total duration for every request.
# Logs method, path, status, and duration — never logs request body.
@app.middleware('http')
async def log_requests(request: Request, call_next):
    start = time.monotonic()
    response = await call_next(request)
    duration_ms = round((time.monotonic() - start) * 1000, 1)
    logger.info('%s %s %d %.1fms', request.method, request.url.path, response.status_code, duration_ms)
    return response

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(scan.router,     prefix='/scan')
app.include_router(password.router, prefix='/password')

@app.get('/health')
def health():
    nmap_ok = shutil.which('nmap') is not None
    return {'status': 'ok', 'nmap': 'ok' if nmap_ok else 'not found'}
