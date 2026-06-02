@echo off

set BASE_DIR=C:\Users\balou\Documents\Web Security Toolkit - POA

echo Starting all services in Windows Terminal tabs...

wt ^
new-tab cmd /k "cd /d "%BASE_DIR%\server-python" && call .venv\Scripts\activate && uvicorn main:app --reload --port 8000" ; ^
new-tab cmd /k "cd /d "%BASE_DIR%\server-node" && npm run dev" ; ^
new-tab cmd /k "cd /d "%BASE_DIR%\client" && npm run dev"