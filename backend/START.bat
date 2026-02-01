@echo off
REM Medical Document Summarizer - One-Click Startup for Windows
REM Starts FastAPI backend and Streamlit frontend simultaneously

cd /d %~dp0

REM Check if virtual environment exists in parent directory
if not exist "..\.venv" (
    echo [ERROR] Virtual environment not found!
    echo Please run: python -m venv .venv in parent directory
    pause
    exit /b 1
)

REM Activate virtual environment from parent directory
call "..\.venv\Scripts\activate.bat"

REM Check if required files exist
if not exist "api_server.py" (
    echo [ERROR] api_server.py not found!
    pause
    exit /b 1
)

if not exist "app_langgraph.py" (
    echo [ERROR] app_langgraph.py not found!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Medical Document Summarizer - v1.0
echo  Starting Services...
echo ========================================
echo.
echo [1/2] Starting FastAPI Backend...
echo       Access: http://localhost:8000
echo       API Docs: http://localhost:8000/docs
echo.
echo [2/2] Starting Streamlit Frontend...
echo       Access: http://localhost:8502
echo.
echo Press CTRL+C to stop all services
echo ========================================
echo.

REM Start backend in background
start "Medical Document Summarizer - Backend" /MIN cmd /k python api_server.py

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

REM Start frontend
start "Medical Document Summarizer - Frontend" cmd /k streamlit run app_langgraph.py

echo.
echo Services started! Waiting for startup...
timeout /t 5 /nobreak

echo.
echo Opening web browser...
start http://localhost:8502

echo.
echo Setup complete! You can close these windows when done.
pause
