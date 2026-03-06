# 📦 Installation Guide

## Prerequisites

### Required Software
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **FFmpeg** - [Download](https://ffmpeg.org/download.html)
- **Git** (optional) - [Download](https://git-scm.com/downloads)

### System Requirements
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 2GB free space
- **OS:** Windows 10+, macOS 10.14+, Linux (Ubuntu 20.04+)
- **Internet:** Required for AI analysis (Gemini API)

---

## Installation Methods

### Method 1: Automated Setup (Recommended)

#### **Linux/macOS:**
```bash
git clone https://github.com/yourusername/Behavioural-Video-Analyzer.git
cd Behavioural-Video-Analyzer
chmod +x scripts/setup.sh
./scripts/setup.sh
```

#### **Windows:**
```cmd
git clone https://github.com/yourusername/Behavioural-Video-Analyzer.git
cd Behavioural-Video-Analyzer
scripts\setup.bat
```

---

### Method 2: Manual Installation

#### **Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/Behavioural-Video-Analyzer.git
cd Behavioural-Video-Analyzer
```

#### **Step 2: Install FFmpeg**

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
1. Download from https://ffmpeg.org/download.html
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to System PATH

#### **Step 3: Setup Backend**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### **Step 4: Configure Environment**
```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
GEMINI_API_KEY=your_actual_api_key_here
```

Get Gemini API Key:
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

#### **Step 5: Verify Installation**
```bash
# Check Python packages
pip list | grep -E "fastapi|mediapipe|faster-whisper"

# Check FFmpeg
ffmpeg -version

# Test backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Visit: http://localhost:8000/api/health

Expected response:
```json
{
  "status": "ok",
  "message": "AI Presentation Analyzer v2.0 running"
}
```

---

## Running the Application

### Start Backend Server:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Access Frontend:
**Option 1:** Direct file access
```bash
# Simply open frontend/index.html in browser
```

**Option 2:** Local server (recommended)
```bash
cd frontend
python -m http.server 3000
# Visit: http://localhost:3000
```

---

## Troubleshooting Installation

### Issue: "Python not found"
**Solution:**
```bash
# Check Python installation
python --version
python3 --version

# Install Python 3.8+
# Visit: https://www.python.org/downloads/
```

### Issue: "FFmpeg not found"
**Solution:**
```bash
# Check FFmpeg installation
ffmpeg -version

# Linux:
sudo apt-get install ffmpeg

# macOS:
brew install ffmpeg

# Windows: Download and add to PATH
```

### Issue: "Module not found"
**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "GEMINI_API_KEY not found"
**Solution:**
```bash
# Check .env file exists
ls -la .env

# Edit .env file
nano .env  # Linux/Mac
notepad .env  # Windows

# Ensure GEMINI_API_KEY is set
GEMINI_API_KEY=AIza...your_key_here
```

---

## Next Steps

After successful installation:
1. ✅ Read [USER_GUIDE.md](USER_GUIDE.md)
2. ✅ Try sample video analysis
3. ✅ Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. ✅ Join community discussions

---

## Support

- **Documentation:** [docs/](../docs/)
- **Issues:** [GitHub Issues](https://github.com/yourusername/Behavioural-Video-Analyzer/issues)
- **Email:** krankushpatel@gmail.com