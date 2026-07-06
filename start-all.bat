@echo off

set BASE_DIR=%~dp0
set BASE_DIR=%BASE_DIR:~0,-1%

echo Starting all services in Windows Terminal tabs...

wt ^
new-tab cmd /k "cd /d "%BASE_DIR%\server-python" && call .venv\Scripts\activate && uvicorn main:app --reload --port 8000" ; ^
new-tab cmd /k "cd /d "%BASE_DIR%\server-node" && npm run dev" ; ^
new-tab cmd /k "cd /d "%BASE_DIR%\client" && npm run dev"