# 📖 User Guide

## Getting Started

### Accessing the Application

1. **Start Backend:**
```bash
   cd backend
   source venv/bin/activate  # Windows: venv\Scripts\activate
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

2. **Open Frontend:**
   - Open `frontend/index.html` in your browser
   - OR visit `http://localhost:3000` if using HTTP server

---

## 🎬 **Analyzing a Presentation**

### Step 1: Prepare Your Video

**Recommended Settings:**
- **Format:** MP4, MOV, AVI, or WebM
- **Duration:** 5-20 minutes
- **Resolution:** 720p or 1080p
- **Size:** Under 500MB
- **Content:** Clear audio, presenter visible

**Tips for Best Results:**
- Record in good lighting
- Keep hands visible in frame
- Face camera directly
- Use external microphone for clear audio
- Minimize background noise

---

### Step 2: Upload Video

1. Click **"Choose File"** or drag-drop video
2. Video player appears with your video
3. Review video preview
4. Click **"Start AI Analysis"**

---

### Step 3: Enter Your Information

A modal appears requesting:

1. **Full Name** ✅ Required
   - Your complete name for the report

2. **Email Address** ✅ Required
   - Valid email format checked automatically
   - Example: your.email@example.com

3. **Expected Duration** ✅ Required
   - **Minimum time:** e.g., 10 minutes
   - **Maximum time:** e.g., 12 minutes
   - System checks if you stayed within limits

4. **Evaluation Type** ✅ Required
   - **Baseline:** First-time evaluation
   - **Mid-Term:** Progress check
   - **Final:** Final assessment

Click **"Start Analysis"** after filling all fields.

---

### Step 4: Wait for Analysis

**Processing Time:**
- 2 min video → ~2-3 min processing
- 5 min video → ~6-8 min processing
- 10 min video → ~12-15 min processing
- 15 min video → ~18-22 min processing

**Progress Stages:**
1. ⏫ Uploading video
2. 🎵 Extracting audio
3. 🎤 Transcribing with AI
4. 📝 Analyzing grammar
5. 👁️ Detecting body language
6. 🤖 Generating insights

**Do NOT:**
- Close browser tab
- Refresh page
- Navigate away

---

### Step 5: View Results

#### **Overall Score Dashboard**
- **Final Score:** 0-100%
- **Grade:** Excellent/Good/Needs Improvement
- **Confidence Score:** Presentation confidence level
- **Speech Rate:** Words per minute
- **Clarity Score:** Speech fluency rating
- **Duration:** Actual presentation time

#### **Detailed Analysis Sections:**

**🎤 Speech & Audio:**
- Voice modulation feedback
- Speaking pace (WPM)
- Filler word count and breakdown
- Clarity and fluency scores
- Vocabulary richness

**👁️ Visual & Body Language:**
- Eye contact distribution (Left/Center/Right)
- Facial expressions and smile percentage
- Hand gesture variety
- Posture quality (leaning/slumping)
- Stage movement and coverage

**📝 Grammar & Language:**
- Total grammar issues found
- Grammar density percentage
- Specific error examples
- Correction suggestions

**🤖 AI Content Analysis:**
- Presentation structure review
- Content strengths identified
- Areas for improvement
- Overall assessment

**🚫 Bad Behaviors Detected:**
- Face touching instances
- Hair touching
- Arms crossed
- Hands in pockets
- Other fidgeting behaviors

**📸 Posture Gallery:**
- Screenshots of poor posture moments
- Timestamp for each issue
- Specific problems identified

---

### Step 6: Download Reports

Three download options available:

#### **1. PDF Report** 📄
- Comprehensive analysis document
- Professional formatting
- Includes all metrics
- Posture screenshots
- AI insights
- Click **"PDF Report"** to download

#### **2. Self-Evaluation Excel** 📊
- Comparative evaluation template
- AI scores pre-filled
- Space for your self-scores
- Discrepancy calculations
- Progress tracking across evaluations
- Click **"Self-Evaluation"** to generate

**Excel Structure:**
- **Baseline columns:** First evaluation
- **Mid-term columns:** Progress check
- **Final columns:** Final assessment
- System fills correct column based on your selection

#### **3. Annotated Video** 🎥
- Original video with behavior markers
- Timestamps of bad behaviors
- Visual indicators on problematic moments
- Click **"Annotated Video"** (if available)

---

## 📊 **Understanding Your Scores**

### Overall Score Breakdown

**85-100% (Excellent)**
- Professional-level presentation
- Minimal improvements needed
- Strong across all metrics

**70-84% (Good)**
- Solid presentation skills
- Minor areas for improvement
- Ready for most audiences

**Below 70% (Needs Improvement)**
- Significant areas to address
- Practice recommended
- Review AI suggestions carefully

### Component Scores

**Clarity Score (Speech):**
- Based on filler words and fluency
- Higher = clearer delivery
- Target: 75%+

**Visual Score (Body Language):**
- Eye contact, posture, gestures
- Presentation presence
- Target: 70%+

**Confidence Score:**
- Overall presentation confidence
- Composite of multiple factors
- Target: 80%+

**Grammar Score:**
- Language correctness
- Vocabulary usage
- Target: 85%+

---

## 🎯 **Time Management Evaluation**

If you set time requirements:

**✅ PASSED:**
- Stayed within min-max range
- Full marks awarded (5/5)
- Green checkmark displayed

**❌ FAILED:**
- Too short or too long
- Zero marks (0/5)
- Red X displayed
- Feedback explains issue

**Example:**
- Expected: 10-12 minutes
- Actual: 11.5 minutes → PASSED ✅
- Actual: 8 minutes → FAILED ❌ (too short)
- Actual: 15 minutes → FAILED ❌ (too long)

---

## 🎓 **Using the Self-Evaluation Excel**

### Purpose
Compare your self-perception with AI analysis across multiple evaluation periods.

### How to Use

1. **Download Excel after analysis**
2. **Open in Microsoft Excel / Google Sheets**
3. **Navigate to "Self-Evaluation Form" tab**

4. **Fill your self-scores:**
   - System pre-fills AI "EXPERT" scores
   - You fill "SELF" score columns
   - Correct column auto-selected based on evaluation type

5. **Review discrepancies:**
   - DISCREP column auto-calculates difference
   - Positive = You rated yourself higher
   - Negative = AI rated you higher
   - Goal: Minimize discrepancies

6. **Track progress:**
   - Baseline → Mid-term → Final
   - Watch improvements over time
   - Identify persistent weak areas

### Excel Tabs

1. **AI Analysis Summary:** Overall scores and metrics
2. **Self-Evaluation Form:** Main comparison sheet
3. **Detailed Analysis:** All raw metrics
4. **Improvement Plan:** Actionable suggestions
5. **Posture Feedback:** Bad posture frames
6. **Behavior Feedback:** Fidgeting incidents

---

## 💡 **Improvement Tips**

### Speech Clarity
- **Reduce filler words:**
  - Practice pausing instead of saying "um", "uh"
  - Record yourself and count fillers
  - Use speech timer apps

- **Improve fluency:**
  - Prepare and outline key points
  - Practice transitions between topics
  - Read aloud regularly

### Eye Contact
- **3-Point technique:**
  - Divide audience into Left-Center-Right
  - Spend 3-5 seconds on each section
  - Rotate systematically

- **Practice:**
  - Mark three spots on wall
  - Practice looking at each
  - Film yourself to check distribution

### Posture & Body Language
- **Stand upright:**
  - Shoulders back and relaxed
  - Feet shoulder-width apart
  - Weight evenly distributed

- **Avoid fidgeting:**
  - Keep hands at waist level
  - Use purposeful gestures only
  - Don't touch face, hair, or clothing

### Hand Gestures
- **Be purposeful:**
  - Use gestures to emphasize points
  - Keep hands visible
  - Avoid repetitive movements

- **Practice:**
  - Mirror practice
  - Video review
  - Ask for feedback

---

## ❓ **Frequently Asked Questions**

**Q: How long does analysis take?**
A: Approximately 1-1.5x video length. 10-minute video = 12-15 minutes processing.

**Q: Can I analyze multiple videos in a row?**
A: Yes, but be mindful of Gemini API rate limits (15 requests/minute).

**Q: What if hands aren't detected?**
A: Ensure hands are visible in frame, good lighting, and camera shows upper body.

**Q: Is my data stored?**
A: Files auto-delete after 1 hour. No permanent storage of videos.

**Q: Can I re-download reports later?**
A: Download immediately after analysis. Files deleted after 1 hour.

**Q: What video quality is best?**
A: 720p or 1080p, MP4 format, good lighting, clear audio.

**Q: How accurate is the AI analysis?**
A: System uses state-of-the-art models. Accuracy depends on video quality.

**Q: Can I edit scores in Excel?**
A: Yes! Excel is fully editable. Modify as needed.

---

## 🆘 **Getting Help**

- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Technical Issues:** [GitHub Issues](https://github.com/krankushpatel/Behavioural-Video-Analyzer/issues)
- **Questions:** krankushpatel@gmail.com
```

---

## 📄 **FILE 19: `LICENSE`**
```
MIT License

Copyright (c) 2024-2026 eklakshya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.