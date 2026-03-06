# 📋 Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-12

### Added
- ✅ User information capture (name, email)
- ✅ Time duration compliance checking
- ✅ Multiple evaluation types (Baseline/Mid-term/Final)
- ✅ Dynamic Excel column filling based on evaluation type
- ✅ Email validation
- ✅ Improved arms crossed detection with temporal smoothing
- ✅ Bad posture image capture and display
- ✅ Attire detection (Formal/Business Casual/Casual)
- ✅ Comprehensive self-evaluation Excel template
- ✅ User data in PDF reports
- ✅ Time compliance scoring (5 points)

### Fixed
- 🐛 Arms crossed false positives (942 → 10-20 instances)
- 🐛 Bad posture images not saving
- 🐛 Gemini API timeout issues
- 🐛 Hand gesture detection sensitivity
- 🐛 Scoring algorithm for missing metrics
- 🐛 Frontend image display issues

### Changed
- 🔄 Stricter fidgeting detection thresholds
- 🔄 Improved scoring normalization
- 🔄 Better error handling for Gemini API
- 🔄 Enhanced user feedback messages

### Improved
- ⚡ Faster audio extraction with FFmpeg
- ⚡ Parallel audio + visual processing
- ⚡ Dynamic timeout based on video length
- ⚡ Better logging and diagnostics

## [1.0.0] - 2024-12-01

### Initial Release
- ✅ Basic video analysis
- ✅ Speech transcription
- ✅ Body language detection
- ✅ PDF report generation
- ✅ Basic Excel output
```

---

## 📄 **FILE 22: `backend/uploads/.gitkeep`**
```
# This file ensures the uploads directory is tracked by git
# Temporary video uploads are stored here
```

---

## 📄 **FILE 23: `backend/outputs/.gitkeep`**
```
# This file ensures the outputs directory is tracked by git
# Generated reports (PDF, Excel, videos) are stored here
```

---

## 📄 **FILE 24: `backend/outputs/landmarks/.gitkeep`**
```
# This file ensures the landmarks directory is tracked by git
# Bad posture screenshots are stored here