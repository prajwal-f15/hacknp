@echo off
title Medical Document Summarizer - Full Stack
color 0A

echo.
echo ========================================
echo   Medical Document Summarizer v2.0
echo   Full Stack Launch
echo ========================================
echo.

:: Check if virtual environment exists
if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found!
    echo Please run: python -m venv .venv
    echo Then: pip install -r requirements.txt
    pause
    exit /b 1
)

:: Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo [WARNING] Frontend dependencies not installed!
    echo Installing npm packages...
    cd frontend
    call npm install
    cd ..
)

:: Create .env.local if it doesn't exist
if not exist "frontend\.env.local" (
    echo Creating frontend/.env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
        echo NEXT_PUBLIC_WS_URL=ws://localhost:8000
    ) > frontend\.env.local
)

echo.
echo [1/3] Starting FastAPI Backend (Port 8000)...
start "Backend API Server" cmd /k "cd backend && ..\\.venv\Scripts\python.exe api_server.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Next.js Frontend (Port 3000)...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Streamlit UI (Port 8502)...
start "Streamlit UI" cmd /k "cd backend && ..\\.venv\Scripts\streamlit run app_langgraph.py"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo   Next.js Frontend:  http://localhost:3000
echo   FastAPI Backend:   http://localhost:8000
echo   Streamlit UI:      http://localhost:8502
echo   API Docs:          http://localhost:8000/docs
echo.
echo Press any key to open Next.js Frontend...
pause >nul
start http://localhost:3000

echo.
echo Services are running in separate windows.
echo Close this window or press Ctrl+C to exit.
echo (Services will continue running in their windows)
echo.
pause
