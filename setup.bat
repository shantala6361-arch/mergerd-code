@echo off
REM ===== Behavioural Video Analyzer Setup Script =====
echo 🎬 Behavioural Video Analyzer - Setup
echo ======================================
echo.

REM Check Python version
echo 📦 Checking Python version...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check FFmpeg
echo.
echo 📦 Checking FFmpeg...
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FFmpeg not found. Please install FFmpeg manually.
    echo    Download from: https://ffmpeg.org/download.html
    pause
    exit /b 1
) else (
    echo    ✅ FFmpeg found
)

REM Navigate to backend
cd backend

REM Create virtual environment
echo.
echo 🐍 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo    Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo.
echo 📦 Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo.
echo 📦 Installing Python packages...
pip install -r requirements.txt

REM Create necessary directories
echo.
echo 📁 Creating directories...
if not exist "uploads" mkdir uploads
if not exist "outputs" mkdir outputs
if not exist "outputs\landmarks" mkdir outputs\landmarks

REM Create .env file if not exists
if not exist ".env" (
    echo.
    echo 📝 Creating .env file...
    copy .env.example .env
    echo    ⚠️  Please edit .env and add your GEMINI_API_KEY
)

REM Create .gitkeep files
type nul > uploads\.gitkeep
type nul > outputs\.gitkeep
type nul > outputs\landmarks\.gitkeep

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo    1. Edit backend\.env and add your GEMINI_API_KEY
echo    2. Get API key from: https://aistudio.google.com/app/apikey
echo    3. Run: cd backend
echo    4. Run: venv\Scripts\activate.bat
echo    5. Run: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
echo    6. Open frontend\index.html in your browser
echo.
pause