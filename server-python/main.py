import logging
import os
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from routers import scan, password
from limiter import limiter

logger = logging.getLogger(__name__)

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
    logger.error('Unhandled error on %s: %s', request.url.path, exc, exc_info=True)
    return JSONResponse(status_code=500, content={'error': 'Internal server error'})

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(scan.router,     prefix='/scan')
app.include_router(password.router, prefix='/password')

@app.get('/health')
def health():
    return {'status': 'ok'}
