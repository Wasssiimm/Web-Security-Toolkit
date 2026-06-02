@echo off

set BASE_DIR=C:\Users\balou\Documents\Web Security Toolkit - POA

echo Starting Python backend...
start cmd /k "cd /d "%BASE_DIR%\server-python" && call .venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Starting Node backend...
start cmd /k "cd /d "%BASE_DIR%\server-node" && npm run dev"

echo Starting Frontend...
start cmd /k "cd /d "%BASE_DIR%\client" && npm run dev"

echo All services started.