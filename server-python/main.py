from fastapi import FastAPI
from routers import scan, password

app = FastAPI(title="Web Security Toolkit – Python Engine")

app.include_router(scan.router,     prefix="/scan")
app.include_router(password.router, prefix="/password")

@app.get("/health")
def health():
    return {"status": "ok"}
