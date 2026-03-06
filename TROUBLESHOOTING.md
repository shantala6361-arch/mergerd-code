# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Backend Connection Issues

#### Problem: "Cannot connect to backend server"
**Symptoms:**
- Frontend shows "Backend not reachable"
- API health check fails
- No response from http://localhost:8000

**Solutions:**
1. **Check if backend is running:**
```bash
   ps aux | grep uvicorn  # Linux/Mac
   tasklist | findstr python  # Windows
```

2. **Verify backend port:**
```bash
   netstat -an | grep 8000  # Linux/Mac
   netstat -an | findstr 8000  # Windows
```

3. **Restart backend:**
```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

4. **Check firewall:**
   - Allow port 8000 in firewall settings
   - Disable antivirus temporarily to test

5. **Try different port:**
```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
   # Update frontend API_URL to http://localhost:8080
```

---

### 🔴 Gemini API Issues

#### Problem: "Gemini 429 Rate Limit"
**Symptoms:**
- "❌ Gemini 429 Rate Limit - Too many requests"
- AI analysis fails

**Solutions:**
1. **Wait and retry:**
   - Free tier: 15 requests/minute
   - Wait 60 seconds before next analysis

2. **Get new API key:**
```bash
   # Visit: https://aistudio.google.com/app/apikey
   # Create new key
   # Update .env:
   GEMINI_API_KEY=your_new_key
   # Restart backend
```

3. **Check API quota:**
   - Visit: https://aistudio.google.com/app/apikey
   - Check usage limits
   - Consider upgrading plan

#### Problem: "Gemini 400 Bad Request"
**Symptoms:**
- "❌ Gemini 400 - API Key likely invalid"

**Solutions:**
1. **Verify API key:**
```bash
   # Check .env file
   cat backend/.env | grep GEMINI

   # Test API key manually
   python -c "
   import requests, os
   from dotenv import load_dotenv
   load_dotenv()
   key = os.getenv('GEMINI_API_KEY')
   url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}'
   response = requests.post(url, json={'contents': [{'parts': [{'text': 'Test'}]}]})
   print(f'Status: {response.status_code}')
   print(f'Response: {response.text[:200]}')
   "
```

2. **Create new API key:**
   - Old key may be expired or revoked
   - Generate fresh key from Google AI Studio

---

### 🔴 Video Analysis Issues

#### Problem: "Hands not detected"
**Symptoms:**
- "Hand Gestures: Hands not detected"
- Hand visibility 0%

**Solutions:**
1. **Check video quality:**
   - Ensure hands are visible in frame
   - Good lighting required
   - Hands should be at waist level or above

2. **Lower detection threshold:**
```bash
   # Edit backend/app/config.py
   HAND_VISIBILITY_MIN: float = 0.10  # Changed from 0.15
```

3. **Re-record video:**
   - Keep hands in frame throughout
   - Position camera to show upper body
   - Avoid rapid hand movements

#### Problem: "Arms crossed: 942 instances"
**Symptoms:**
- Unrealistically high arms crossed count
- False positives

**Solutions:**
1. **Already fixed in provided code:**
   - New stricter detection thresholds
   - Temporal smoothing added
   - Expected: 10-20 instances for 18-minute video

2. **If still high, adjust config:**
```python
   # backend/app/config.py
   # Make detection even stricter
   # (Already done in provided files)
```

#### Problem: "Analysis timeout"
**Symptoms:**
- "⏱️ Analysis timed out"
- Long videos (>15 minutes) fail

**Solutions:**
1. **Compress video:**
```bash
   ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 output.mp4
```

2. **Split video:**
```bash
   ffmpeg -i input.mp4 -t 00:10:00 -c copy part1.mp4
   ffmpeg -i input.mp4 -ss 00:10:00 -c copy part2.mp4
```

3. **Increase timeout:**
```javascript
   // frontend/js/script.js
   const timeoutMs = timeoutSeconds * 2000;  // Double timeout
```

---

### 🔴 Installation Issues

#### Problem: "ModuleNotFoundError"
**Symptoms:**
- "No module named 'faster_whisper'"
- Import errors

**Solutions:**
1. **Activate virtual environment:**
```bash
   # Linux/Mac
   source backend/venv/bin/activate

   # Windows
   backend\venv\Scripts\activate
```

2. **Reinstall dependencies:**
```bash
   cd backend
   pip install --upgrade pip
   pip install -r requirements.txt
```

3. **Check Python version:**
```bash
   python --version  # Must be 3.8+
```

#### Problem: "FFmpeg not found"
**Symptoms:**
- "❌ All audio extraction methods failed"
- Audio extraction fails

**Solutions:**
1. **Install FFmpeg:**
```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install ffmpeg

   # macOS
   brew install ffmpeg

   # Windows
   # Download from https://ffmpeg.org/download.html
   # Add to PATH
```

2. **Verify installation:**
```bash
   ffmpeg -version
   which ffmpeg  # Linux/Mac
   where ffmpeg  # Windows
```

---

### 🔴 Performance Issues

#### Problem: "Analysis very slow"
**Symptoms:**
- Takes >2 minutes per minute of video
- High CPU usage

**Solutions:**
1. **Reduce processing rate:**
```bash
   # Edit backend/app/config.py
   FRAMES_PER_SECOND: int = 0.5  # Changed from 1
```

2. **Check system resources:**
```bash
   # Linux
   top
   htop

   # Windows
   # Open Task Manager (Ctrl+Shift+Esc)
```

3. **Close other applications:**
   - Free up RAM
   - Close unnecessary programs

4. **Use smaller video:**
   - Compress to 720p
   - Shorter duration

---

### 🔴 Frontend Issues

#### Problem: "CORS errors"
**Symptoms:**
- Console shows CORS policy errors
- Frontend can't reach backend

**Solutions:**
1. **Check CORS configuration:**
```python
   # backend/app/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Should be present
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
```

2. **Use same origin:**
```bash
   # Serve frontend from same server
   cd backend
   # Create static route to serve frontend
```

---

### 🔴 Grammar Checking Issues

#### Problem: "Grammar checker failed"
**Symptoms:**
- Grammar analysis unavailable
- LanguageTool errors

**Solutions:**
1. **First-time setup:**
```bash
   # LanguageTool downloads on first use
   python -c "import language_tool_python; language_tool_python.LanguageTool('en-US')"
   # Wait 30-60 seconds for download
```

2. **Manual installation:**
```bash
   pip uninstall language-tool-python
   pip install language-tool-python==2.8.2
```

---

## 📊 **Diagnostic Commands**
```bash
# ===== SYSTEM CHECK =====
python --version
ffmpeg -version
pip list | grep -E "fastapi|mediapipe|whisper"

# ===== BACKEND STATUS =====
curl http://localhost:8000/api/health

# ===== LOG CHECKING =====
# Check backend logs for errors
tail -f backend/app.log  # If logging to file

# ===== NETWORK CHECK =====
netstat -an | grep 8000
ping localhost
```

---

## 🆘 **Getting Help**

If you're still experiencing issues:

1. **Check logs:**
   - Backend console output
   - Browser console (F12)

2. **Create issue:**
   - Visit: [GitHub Issues](https://github.com/krankushpatel/Behavioural-Video-Analyzer/issues)
   - Include:
     - Error message
     - Steps to reproduce
     - System info (OS, Python version)
     - Log output

3. **Contact support:**
   - Email: krankushpatel@gmail.com
   - Include full error traceback

---

## ✅ **Prevention Tips**

1. **Keep dependencies updated:**
```bash
   pip install --upgrade -r requirements.txt
```

2. **Use recommended video format:**
   - MP4 with H.264 codec
   - 720p or 1080p resolution
   - 5-15 minutes duration

3. **Monitor API usage:**
   - Check Gemini API quota regularly
   - Avoid rapid consecutive requests

4. **Regular maintenance:**
   - Clear old files from uploads/outputs
   - Restart backend daily for production use