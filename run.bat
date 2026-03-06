@echo off
REM ===== Behavioural Video Analyzer Run Script =====
echo 🎬 Starting Behavioural Video Analyzer...
echo.

REM Navigate to backend
cd backend

REM Activate virtual environment
echo 🐍 Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo    Please run setup.bat first
    pause
    exit /b 1
)

REM Start backend
echo 🚀 Starting FastAPI backend on http://localhost:8000
echo    Press Ctrl+C to stop
echo.
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload