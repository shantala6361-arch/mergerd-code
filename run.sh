#!/bin/bash

# ===== Behavioural Video Analyzer Run Script =====
echo "🎬 Starting Behavioural Video Analyzer..."
echo ""

# Navigate to backend
cd backend || exit

# Activate virtual environment
echo "🐍 Activating virtual environment..."
source venv/bin/activate

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Please run setup.sh first"
    exit 1
fi

# Start backend
echo "🚀 Starting FastAPI backend on http://localhost:8000"
echo "   Press Ctrl+C to stop"
echo ""
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload