import logging
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from routers import scan, password
from limiter import limiter

logger = logging.getLogger(__name__)

app = FastAPI(title="Web Security Toolkit – Python Engine")

# ── Rate limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Exception handlers ────────────────────────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    # Return clean structured errors without internal file paths or tracebacks
    errors = [
        {"field": str(e["loc"][-1]) if e["loc"] else "body", "error": e["msg"]}
        for e in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": errors})

@app.exception_handler(Exception)
async def generic_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(status_code=500, content={"error": "Internal server error"})

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(scan.router,     prefix="/scan")
app.include_router(password.router, prefix="/password")

@app.get("/health")
def health():
    return {"status": "ok"}
