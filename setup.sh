#!/bin/bash

# ===== Behavioural Video Analyzer Setup Script =====
echo "🎬 Behavioural Video Analyzer - Setup"
echo "======================================"
echo ""

# Check Python version
echo "📦 Checking Python version..."
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version 2>&1 | awk '{print $2}')
    echo "   Found: Python $python_version"
else
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Check FFmpeg
echo ""
echo "📦 Checking FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Installing..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    fi
else
    echo "   ✅ FFmpeg found"
fi

# Navigate to backend
cd backend || exit

# Create virtual environment
echo ""
echo "🐍 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "   Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "📦 Installing Python packages..."
pip install -r requirements.txt

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p uploads
mkdir -p outputs
mkdir -p outputs/landmarks

# Create .env file if not exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "   ⚠️  Please edit .env and add your GEMINI_API_KEY"
fi

# Create .gitkeep files
touch uploads/.gitkeep
touch outputs/.gitkeep
touch outputs/landmarks/.gitkeep

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit backend/.env and add your GEMINI_API_KEY"
echo "   2. Get API key from: https://aistudio.google.com/app/apikey"
echo "   3. Run: cd backend && source venv/bin/activate"
echo "   4. Run: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo "   5. Open frontend/index.html in your browser"
echo ""