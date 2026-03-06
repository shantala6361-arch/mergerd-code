// bahevioural_video_analyzer/frontend/js/script.js
// ===== CONFIGURATION =====
const API_URL = 'http://localhost:8000';
let API_AVAILABLE = false;

// ===== ELEMENTS =====
const videoInput = document.getElementById("videoInput");
const uploadArea = document.getElementById("upload");
const playerArea = document.getElementById("player");
const videoElement = document.getElementById("videoElement");
const analyzeBtn = document.getElementById("analyzeBtn");
const normalHeader = document.getElementById("normal-header");
const premiumHeader = document.getElementById("premium-header");
const heroSection = document.getElementById("hero-section");
const featuresSection = document.getElementById("features-section");
const progressContainer = document.getElementById("progressContainer");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressStage = document.getElementById("progressStage");
const kpiRow = document.getElementById("kpiRow");
const chartsGrid = document.getElementById("chartsGrid");
const verdictsGrid = document.getElementById("verdictsGrid");
const suggestionsSection = document.getElementById("suggestionsSection");
const downloadBar = document.getElementById("downloadBar");
const vNameDisplay = document.getElementById("vName");
const resetBtn = document.getElementById("resetBtn");

let selectedFile = null;
let analysisResults = null;
let voiceChart, eyeChart;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 AI Presentation Analyzer Frontend v2.0");
    initPlaceholderCharts();
    checkBackendConnection();
    setupEventListeners();
});

function setupEventListeners() {
    uploadArea.onclick = () => videoInput.click();
    resetBtn.onclick = resetUI;
    videoInput.onchange = handleFileSelect;
    analyzeBtn.onclick = startAnalysis;
    document.getElementById('downloadBtn').onclick = downloadReport;
    document.getElementById('downloadExcel').onclick = downloadExcelReport;
    document.getElementById('downloadVideo').onclick = downloadAnnotatedVideo;
    document.getElementById('seePptBtn').onclick = openPPTGenerator;
}

// ===== BACKEND CONNECTION CHECK =====
async function checkBackendConnection() {
    try {
        console.log(`🔌 Checking backend: ${API_URL}`);
        const response = await fetch(`${API_URL}/api/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connected:', data);
            API_AVAILABLE = true;

            const statusDot = document.querySelector('.status-dot');
            if (statusDot) {
                statusDot.style.background = '#00ffcc';
                statusDot.style.boxShadow = '0 0 12px #00ffcc';
            }
            return true;
        } else {
            console.warn('⚠️ Backend returned non-OK:', response.status);
            API_AVAILABLE = false;
            return false;
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        API_AVAILABLE = false;
        setTimeout(() => {
            alert('⚠️ Backend server not reachable!\n\nEnsure:\n1. Backend running on ' + API_URL + '\n2. CORS enabled\n3. No firewall blocking');
        }, 1000);
        return false;
    }
}

// ===== FILE UPLOAD =====
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
        alert('❌ Please select a video file');
        return;
    }

    // Frontend file size check
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
        alert(`❌ File too large!\nMaximum: 500MB\nYour file: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
        return;
    }

    selectedFile = file;
    const url = URL.createObjectURL(file);
    videoElement.src = url;

    if (vNameDisplay) vNameDisplay.innerText = file.name;

    updateUIForFileSelected();
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `<i class="fas fa-play"></i> Start AI Analysis`;
}

function updateUIForFileSelected() {
    normalHeader.style.display = 'flex';
    premiumHeader.style.display = 'none';
    heroSection.style.display = 'none';
    featuresSection.style.display = 'none';

    document.getElementById('overallScore').textContent = '--';
    document.getElementById('overallGrade').textContent = 'Pending Analysis';
    document.getElementById('confidenceScore').textContent = '--';
    document.getElementById('wpmScore').textContent = '--';
    document.getElementById('clarityScore').textContent = '--';
    document.getElementById('durationVal').textContent = '--';

    kpiRow.style.display = 'grid';
    chartsGrid.style.display = 'grid';
    verdictsGrid.style.display = 'grid';
    suggestionsSection.style.display = 'block';
    downloadBar.style.display = 'flex';

    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('downloadExcel').style.display = 'none';
    document.getElementById('downloadVideo').style.display = 'none';

    uploadArea.classList.add("hidden");
    playerArea.classList.remove("hidden");

    const badges = ['eyeBadge', 'facialBadge', 'handBadge', 'postureBadge', 'movementBadge', 'attireBadge'];
    badges.forEach(badgeId => {
        const badge = document.getElementById(badgeId);
        if (badge) {
            badge.className = 'verdict-badge badge-moderate';
            badge.textContent = 'Pending';
        }
    });

    document.getElementById('suggestionsList').innerHTML = `
        <div class="suggestion-item">
            <i class="fas fa-info-circle"></i>
            <p>Click "Start AI Analysis" to receive personalized suggestions.</p>
        </div>
    `;

    document.getElementById('summarySection').style.display = 'none';
    document.getElementById('behaviorGallery').style.display = 'none';
}

function resetUI() {
    console.log("🔄 Resetting UI...");

    selectedFile = null;
    analysisResults = null;
    videoInput.value = "";
    videoElement.src = "";
    videoElement.pause();

    uploadArea.classList.remove("hidden");
    playerArea.classList.add("hidden");

    normalHeader.style.display = 'flex';
    premiumHeader.style.display = 'none';
    heroSection.style.display = 'block';
    featuresSection.style.display = 'grid';

    kpiRow.style.display = 'none';
    chartsGrid.style.display = 'none';
    verdictsGrid.style.display = 'none';
    suggestionsSection.style.display = 'none';
    downloadBar.style.display = 'none';
    document.getElementById('summarySection').style.display = 'none';
    document.getElementById('behaviorGallery').style.display = 'none';

    progressContainer.classList.remove('active');
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressStage.textContent = 'Initializing...';

    if (voiceChart) {
        voiceChart.destroy();
        voiceChart = null;
    }
    if (eyeChart) {
        eyeChart.destroy();
        eyeChart = null;
    }

    setTimeout(() => initPlaceholderCharts(), 100);

    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `<i class="fas fa-play"></i> Start AI Analysis`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("✅ UI reset complete");
}

// ===== ANALYSIS =====
function getVideoDuration(file) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            resolve(Math.ceil(video.duration));
        };

        video.onerror = () => reject(new Error('Failed to load video'));
        video.src = URL.createObjectURL(file);
    });
}

// ===== GLOBAL VARIABLE FOR USER DATA =====
let userData = null;

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== SHOW USER INFO MODAL =====
function showUserInfoModal() {
    const modal = document.getElementById('userInfoModal');
    modal.style.display = 'flex';

    // Cancel button
    document.getElementById('cancelUserInfo').onclick = () => {
        modal.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i class="fas fa-play"></i> Start AI Analysis`;
    };

    // Form submission
    document.getElementById('userInfoForm').onsubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const minTime = parseInt(document.getElementById('minTime').value);
        const maxTime = parseInt(document.getElementById('maxTime').value);
        const evalType = document.getElementById('evaluationType').value;

        // Validate email
        const emailError = document.getElementById('emailError');
        if (!validateEmail(email)) {
            emailError.style.display = 'block';
            return;
        }
        emailError.style.display = 'none';

        // Validate time range
        if (minTime >= maxTime) {
            alert('⚠️ Minimum time must be less than maximum time!');
            return;
        }

        // Save user data
        userData = {
            name: name,
            email: email,
            expected_min_minutes: minTime,
            expected_max_minutes: maxTime,
            evaluation_type: evalType
        };

        console.log('✅ User data collected:', userData);

        // Close modal
        modal.style.display = 'none';

        // Start actual analysis
        performAnalysis();
    };
}

// ===== START ANALYSIS (SHOWS MODAL FIRST) =====
async function startAnalysis() {
    if (!selectedFile) {
        alert('Please select a video first!');
        return;
    }

    if (!API_AVAILABLE) {
        const isConnected = await checkBackendConnection();
        if (!isConnected) {
            alert('Cannot connect to backend server.');
            return;
        }
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;

    // Show user info modal first
    showUserInfoModal();
}

// ===== PERFORM ACTUAL ANALYSIS (AFTER USER DATA COLLECTED) =====
async function performAnalysis() {
    try {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
        progressContainer.classList.add('active');

        // Get video duration for smart timeout
        let videoDuration = 180;
        try {
            videoDuration = await getVideoDuration(selectedFile);
        } catch (error) {
            console.warn('⚠️ Could not detect duration');
        }

        // Smart timeout
        const baseOverhead = 120;
        const timeoutSeconds = Math.max(180, (videoDuration * 1.5) + baseOverhead);
        const timeoutMs = timeoutSeconds * 1000;

        console.log(`⏱️ Video: ${(videoDuration / 60).toFixed(1)}min → Timeout: ${(timeoutSeconds / 60).toFixed(1)}min`);

        const stages = [
            { percent: 10, text: `Uploading ${(videoDuration / 60).toFixed(1)}min video...` },
            { percent: 25, text: "Extracting audio..." },
            { percent: 40, text: "Transcribing with Whisper AI..." },
            { percent: 55, text: "Analyzing grammar..." },
            { percent: 70, text: "Detecting body language..." },
            { percent: 85, text: "Generating insights..." }
        ];

        let stageIndex = 0;
        const progressInterval = setInterval(() => {
            if (stageIndex < stages.length) {
                const stage = stages[stageIndex];
                progressFill.style.width = stage.percent + '%';
                progressPercent.textContent = stage.percent + '%';
                progressStage.textContent = stage.text;
                stageIndex++;
            }
        }, 1500);

        const formData = new FormData();
        formData.append('file', selectedFile);

        // Add user data to request
        formData.append('user_data', JSON.stringify(userData));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${API_URL}/api/analyze-video`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        clearInterval(progressInterval);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        analysisResults = await response.json();
        console.log("✅ Analysis complete");

        progressFill.style.width = '100%';
        progressPercent.textContent = '100%';
        progressStage.textContent = 'Complete!';

        setTimeout(() => {
            displayResults(analysisResults);
            progressContainer.classList.remove('active');
            analyzeBtn.innerHTML = `<i class="fas fa-check-circle"></i> Complete`;
        }, 800);

    } catch (error) {
        console.error('❌ Error:', error);
        progressContainer.classList.remove('active');
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i class="fas fa-play"></i> Start Analysis`;

        if (error.name === 'AbortError') {
            alert(`⏱️ Analysis timed out.\n\nTry:\n• Shorter clips (< 15 min)\n• Compressing video\n• Splitting into parts`);
        } else {
            alert(`❌ Failed: ${error.message}`);
        }
    }
}

// ===== DISPLAY RESULTS =====
function displayResults(data) {
    console.log("📊 Displaying results...");

    normalHeader.style.display = 'none';
    premiumHeader.style.display = 'block';

    const displayScore = data.excel_overall_score || data.final_score;

    document.getElementById('finalScoreVal').textContent = displayScore + '%';
    document.getElementById('gradeText').textContent = data.combined_grade + ' Performance';

    // Summary
    const summarySection = document.getElementById('summarySection');
    const summaryContent = document.getElementById('summaryContent');
    if (data.presentation_summary && data.presentation_summary.length > 50) {
        summarySection.style.display = 'block';
        let formattedSummary = data.presentation_summary
            .replace(/\*\*(.*?)\*\*/g, '<b style="color: #00f2ff; font-weight: 600;">$1</b>')
            .replace(/\n/g, '<br>');
        summaryContent.innerHTML = formattedSummary;
    }

    // KPIs
    kpiRow.style.display = 'grid';
    document.getElementById('overallScore').textContent = displayScore + '%';
    document.getElementById('overallGrade').textContent = data.combined_grade;
    document.getElementById('confidenceScore').textContent = data.confidence_score + '%';

    const wpmValue = data.wpm;
    if (wpmValue === null || wpmValue === undefined || wpmValue === "Not Detected") {
        document.getElementById('wpmScore').textContent = 'N/A';
        document.getElementById('wpmScore').style.opacity = '0.5';
    } else {
        document.getElementById('wpmScore').textContent = Math.round(wpmValue);
        document.getElementById('wpmScore').style.opacity = '1';
    }
    document.getElementById('clarityScore').textContent = data.clarity_score + '%';

    if (data.formatted_duration) {
        document.getElementById('durationVal').textContent = data.formatted_duration;
    } else {
        const d = parseFloat(data.duration_sec || 0);
        if (!isNaN(d) && d > 0) {
            document.getElementById('durationVal').textContent =
                `${Math.floor(d / 60)}m ${Math.round(d % 60)}s`;
        } else {
            document.getElementById('durationVal').textContent = "0s";
        }
    }

    chartsGrid.style.display = 'grid';
    setTimeout(() => initCharts(data), 100);

    // Verdicts
    verdictsGrid.style.display = 'grid';
    document.getElementById('eyeVerdict').textContent = data.eye_contact_feedback || 'No data';
    document.getElementById('facialVerdict').textContent = data.facial_expression_verdict || 'No data';
    document.getElementById('handVerdict').textContent = data.hand_gesture_verdict || 'No data';
    document.getElementById('postureVerdict').textContent = data.posture_verdict || 'No data';
    document.getElementById('movementVerdict').textContent = data.body_movement_verdict || 'No data';
    document.getElementById('attireVerdict').textContent = `${data.attire_type || 'Unknown'} attire`;

    updateBadge('eyeBadge', data.eye_contact_verdict);
    updateBadge('facialBadge', data.smile_percent > 25 ? 'Good' : 'Moderate');
    updateBadge('handBadge', data.hand_gesture_verdict?.includes('Good') ? 'Good' : 'Moderate');
    updateBadge('postureBadge', data.posture_verdict?.includes('Good') ? 'Good' : 'Moderate');
    updateBadge('movementBadge', data.body_movement_verdict?.includes('Balanced') ? 'Good' : 'Moderate');
    updateBadge('attireBadge', data.attire_type === 'Formal' ? 'Good' : 'Moderate');

    displayBehaviorGallery(data);

    // Suggestions
    suggestionsSection.style.display = 'block';
    const sl = document.getElementById('suggestionsList');
    if (data.ai_suggestions && data.ai_suggestions.length > 0) {
        sl.innerHTML = data.ai_suggestions.map(s =>
            `<div class="suggestion-item"><i class="fas fa-lightbulb"></i><p>${s}</p></div>`
        ).join('');
    } else {
        sl.innerHTML = `<div class="suggestion-item"><i class="fas fa-info-circle"></i>
                         <p>No specific suggestions — overall quality is good.</p></div>`;
    }

    // Download buttons
    downloadBar.style.display = 'flex';
    document.getElementById('downloadBtn').disabled = false;
    document.getElementById('downloadExcel').style.display = 'inline-flex';

    if (data.annotated_video_filename) {
        document.getElementById('downloadVideo').style.display = 'inline-flex';
    }

    // ── NEW: store excel_filename returned by backend; show "See PPT" ──
    if (data.excel_report_filename) {
        window._excelFilename = data.excel_report_filename;
        document.getElementById('seePptBtn').style.display = 'inline-flex';
        console.log("📊 Excel auto-saved:", data.excel_report_filename);
    }

    console.log("✅ Results displayed");
}

// ===== ✅ ENHANCED: BEHAVIOR GALLERY =====
function displayBehaviorGallery(data) {
    const behaviorGallery = document.getElementById('behaviorGallery');
    const categoriesContainer = document.getElementById('behaviorCategories');

    const behaviorSummary = data.behavior_images_summary || {};

    if (Object.keys(behaviorSummary).length === 0) {
        behaviorGallery.style.display = 'none';
        return;
    }

    behaviorGallery.style.display = 'block';
    categoriesContainer.innerHTML = '';

    // ✅ DEFINE BEHAVIOR CATEGORIES
    const categories = {
        "Posture Issues": {
            behaviors: ["leaning", "slumped"],
            icon: "fa-person-falling",
            color: "#dc2626"
        },
        "Defensive Body Language": {
            behaviors: ["arms_crossed"],
            icon: "fa-hands",
            color: "#ea580c"
        },
        "Fidgeting - Face/Hair": {
            behaviors: ["face_touch", "hair_touch", "hair_fixing", "neck_touch"],
            icon: "fa-face-grimace",
            color: "#d97706"
        },
        "Fidgeting - Hands": {
            behaviors: ["finger_fidgeting", "hands_in_pockets"],
            icon: "fa-hand-sparkles",
            color: "#ca8a04"
        },
        "Fidgeting - Clothing/Accessories": {
            behaviors: ["clothing_adjustment", "belt_touch", "mic_id_fidgeting"],
            icon: "fa-shirt",
            color: "#65a30d"
        },
        "Unprofessional Behaviors": {
            behaviors: ["phone_holding"],
            icon: "fa-mobile-screen",
            color: "#0891b2"
        }
    };

    // ✅ DISPLAY EACH CATEGORY
    for (const [categoryName, categoryData] of Object.entries(categories)) {
        let categoryImages = [];

        // Collect all images for this category
        for (const behaviorType of categoryData.behaviors) {
            if (behaviorSummary[behaviorType]) {
                categoryImages.push(...behaviorSummary[behaviorType].images.map(img => ({
                    ...img,
                    behaviorType: behaviorType
                })));
            }
        }

        if (categoryImages.length === 0) continue;

        // Create category section
        const categoryDiv = document.createElement('div');
        categoryDiv.style.cssText = `
            margin-bottom: 30px;
            border-left: 4px solid ${categoryData.color};
            background: rgba(255, 255, 255, 0.02);
            padding: 20px;
            border-radius: 12px;
        `;

        categoryDiv.innerHTML = `
            <h4 style="color: ${categoryData.color}; margin-bottom: 15px;">
                <i class="fas ${categoryData.icon}"></i> ${categoryName}
                <span style="font-size: 12px; opacity: 0.7; margin-left: 10px;">
                    (${categoryImages.length} instance${categoryImages.length > 1 ? 's' : ''})
                </span>
            </h4>
            <div class="behavior-images-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
            </div>
        `;

        const imagesGrid = categoryDiv.querySelector('.behavior-images-grid');

        // Add images (max 6 per category)
        categoryImages.slice(0, 6).forEach((img, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.style.cssText = `
                border: 2px solid ${categoryData.color};
                border-radius: 12px;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            const imagePath = `${API_URL}/outputs/landmarks/${img.filename}`;

            imageDiv.innerHTML = `
                <img src="${imagePath}" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     loading="lazy" />
                <div style="display: none; background: #333; color: white; padding: 20px; text-align: center; height: 120px; align-items: center; justify-content: center;">
                    <i class="fas fa-image" style="font-size: 24px; opacity: 0.3;"></i>
                </div>
                <p style="margin: 0 0 4px 0; color: ${categoryData.color}; font-size: 11px; font-weight: 600;">
                    <i class="fas fa-clock"></i> ${img.time}s
                </p>
                <p style="margin: 0; color: #cbd5e1; font-size: 10px; line-height: 1.4;">
                    ${img.description}
                </p>
            `;

            imageDiv.addEventListener('mouseenter', () => {
                imageDiv.style.transform = 'translateY(-5px)';
                imageDiv.style.boxShadow = `0 8px 20px ${categoryData.color}40`;
            });

            imageDiv.addEventListener('mouseleave', () => {
                imageDiv.style.transform = 'translateY(0)';
                imageDiv.style.boxShadow = 'none';
            });

            imageDiv.onclick = () => {
                openBehaviorModal(img, categoryName, categoryData.color);
            };

            imagesGrid.appendChild(imageDiv);
        });

        if (categoryImages.length > 6) {
            const moreDiv = document.createElement('div');
            moreDiv.style.cssText = `
                padding: 20px;
                text-align: center;
                color: #94a3b8;
                font-size: 12px;
                border: 1px dashed ${categoryData.color}40;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            moreDiv.textContent = `+ ${categoryImages.length - 6} more instances`;
            imagesGrid.appendChild(moreDiv);
        }

        categoriesContainer.appendChild(categoryDiv);
    }
}

function openBehaviorModal(img, categoryName, color) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;

    // ✅ IMPROVEMENT TIPS BY CATEGORY
    const improvementTips = {
        "Posture Issues": [
            "Keep shoulders level and balanced - avoid leaning to one side",
            "Stand upright with chest open and shoulders back",
            "Distribute weight evenly on both feet",
            "Imagine a vertical line from head to feet"
        ],
        "Defensive Body Language": [
            "Keep arms open and hands visible",
            "Use purposeful hand gestures instead of crossed arms",
            "Practice relaxed, confident stance",
            "Record yourself to identify defensive patterns"
        ],
        "Fidgeting - Face/Hair": [
            "Keep hands away from face and hair during presentation",
            "Practice hand positioning at waist level",
            "Record yourself to identify unconscious habits",
            "Channel nervous energy into purposeful gestures"
        ],
        "Fidgeting - Hands": [
            "Channel nervous energy into purposeful gestures",
            "Practice keeping hands still when not gesturing",
            "Use cue cards or clicker to occupy hands",
            "Avoid fidgeting with fingers - keep hands relaxed"
        ],
        "Fidgeting - Clothing/Accessories": [
            "Ensure proper fit of clothing before presentation",
            "Secure microphone and accessories beforehand",
            "Do a final appearance check before starting",
            "Remove all distractions from speaking area"
        ],
        "Unprofessional Behaviors": [
            "Turn off and put away phone before presentation",
            "Remove all distractions from speaking area",
            "Focus entirely on audience engagement",
            "Practice professional presence and boundaries"
        ]
    };

    const tips = improvementTips[categoryName] || [
        "Practice professional body language",
        "Record yourself to identify areas for improvement",
        "Focus on confident, open posture"
    ];

    const tipsHTML = tips.map(tip => `<li style="margin-bottom: 8px;">${tip}</li>`).join('');

    modal.innerHTML = `
        <div style="max-width: 90%; max-height: 90%; background: #1e293b; border-radius: 20px; padding: 30px; position: relative; border: 2px solid ${color};">
            <button id="closeModal" style="position: absolute; top: 15px; right: 15px; background: ${color}; border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">
                ✕
            </button>
            
            <h3 style="color: ${color}; margin: 0 0 15px 0;">
                <i class="fas fa-exclamation-triangle"></i> ${categoryName}
            </h3>
            
            <p style="color: #94a3b8; margin-bottom: 20px;">
                Time: ${img.time}s | ${img.description}
            </p>
            
            <img src="${API_URL}/outputs/landmarks/${img.filename}" 
                 style="max-width: 100%; max-height: 60vh; border-radius: 12px; display: block; margin: 0 auto; border: 2px solid ${color}40;"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%23999%22>Image not available</text></svg>'" />
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1); border-radius: 12px; border-left: 4px solid ${color};">
                <h4 style="color: ${color}; margin: 0 0 10px 0;">
                    <i class="fas fa-lightbulb"></i> Improvement Tips:
                </h4>
                <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; line-height: 1.6;">
                    ${tipsHTML}
                </ul>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeModal').onclick = () => {
        document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

function updateBadge(badgeId, verdict) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;

    badge.className = 'verdict-badge';

    if (!verdict) {
        badge.classList.add('badge-moderate');
        badge.textContent = 'N/A';
        return;
    }

    if (verdict === 'Good' || verdict.includes('Good')) {
        badge.classList.add('badge-good');
        badge.textContent = 'Good';
    } else if (verdict === 'Partial' || verdict === 'Moderate' || verdict.includes('Moderate')) {
        badge.classList.add('badge-moderate');
        badge.textContent = 'Moderate';
    } else {
        badge.classList.add('badge-poor');
        badge.textContent = 'Needs Work';
    }
}

// ===== CHARTS =====
function initCharts(data) {
    const voiceCtx = document.getElementById('voiceChart');
    if (!voiceCtx) return;

    const ctx = voiceCtx.getContext('2d');

    if (voiceChart) voiceChart.destroy();

    const videoDuration = data.video_duration_sec || data.speech_duration_sec || 180;
    const numPoints = 7;
    const timeInterval = videoDuration / (numPoints - 1);

    const timeLabels = [];
    for (let i = 0; i < numPoints; i++) {
        const seconds = Math.round(i * timeInterval);
        timeLabels.push(seconds + 's');
    }

    const pitchData = data.pitch_timeline || [200, 220, 210, 230, 215, 225, 220];

    voiceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Pitch Variation (Hz)',
                data: pitchData,
                borderColor: '#00f2ff',
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#00f2ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#94a3b8' }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#00f2ff',
                    bodyColor: '#fff',
                    borderColor: '#00f2ff',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return 'Pitch: ' + context.parsed.y + ' Hz';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 11 } },
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 11 } },
                    title: {
                        display: true,
                        text: 'Pitch (Hz)',
                        color: '#94a3b8'
                    }
                }
            }
        }
    });

    const eyeCtx = document.getElementById('eyeChart');
    if (!eyeCtx) return;

    const ctx2 = eyeCtx.getContext('2d');

    if (eyeChart) eyeChart.destroy();

    const eyeData = data.eye_contact_distribution || { Left: 33, Center: 34, Right: 33 };

    eyeChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Left', 'Center', 'Right'],
            datasets: [{
                data: [
                    eyeData.Left || 0,
                    eyeData.Center || 0,
                    eyeData.Right || 0
                ],
                backgroundColor: ['#f97316', '#00f2ff', '#a855f7'],
                borderWidth: 0,
                borderColor: 'transparent'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 12 },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#00f2ff',
                    bodyColor: '#fff',
                    borderColor: '#00f2ff',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function initPlaceholderCharts() {
    const voiceCtx = document.getElementById('voiceChart');
    if (voiceCtx) {
        const ctx = voiceCtx.getContext('2d');
        if (voiceChart) voiceChart.destroy();

        voiceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0s', '30s', '60s', '90s', '120s', '150s', '180s'],
                datasets: [{
                    label: 'Awaiting Analysis',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    backgroundColor: 'rgba(148, 163, 184, 0.05)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    const eyeCtx = document.getElementById('eyeChart');
    if (eyeCtx) {
        const ctx2 = eyeCtx.getContext('2d');
        if (eyeChart) eyeChart.destroy();

        eyeChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Left', 'Center', 'Right'],
                datasets: [{
                    data: [33, 34, 33],
                    backgroundColor: [
                        'rgba(249, 115, 22, 0.3)',
                        'rgba(0, 242, 255, 0.3)',
                        'rgba(168, 85, 247, 0.3)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', padding: 15 }
                    }
                }
            }
        });
    }
}

// ===== DOWNLOAD FUNCTIONS =====
async function downloadReport() {
    if (!analysisResults || !analysisResults.pdf_report_filename) {
        alert('No analysis results available!');
        return;
    }

    try {
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading...`;
        downloadBtn.disabled = true;

        const response = await fetch(`${API_URL}/api/download-report/${analysisResults.pdf_report_filename}`);

        if (!response.ok) {
            throw new Error(`Failed to download: ${response.status}`);
        }

        const blob = await response.blob();

        if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = analysisResults.pdf_report_filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            console.log('✅ PDF downloaded');
        }, 100);

    } catch (error) {
        console.error('❌ Download error:', error);
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.innerHTML = `<i class="fas fa-download"></i> PDF Report`;
        downloadBtn.disabled = false;
        alert(`Failed to download PDF: ${error.message}`);
    }
}

async function downloadAnnotatedVideo() {
    if (!analysisResults || !analysisResults.annotated_video_filename) {
        alert('No annotated video available!');
        return;
    }

    try {
        const downloadBtn = document.getElementById('downloadVideo');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading...`;
        downloadBtn.disabled = true;

        const response = await fetch(`${API_URL}/api/download-annotated-video/${analysisResults.annotated_video_filename}`);

        if (!response.ok) {
            throw new Error(`Failed to download: ${response.status}`);
        }

        const blob = await response.blob();

        if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = analysisResults.annotated_video_filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            console.log('✅ Annotated video downloaded');
        }, 100);

    } catch (error) {
        console.error('❌ Download error:', error);
        const downloadBtn = document.getElementById('downloadVideo');
        downloadBtn.innerHTML = `<i class="fas fa-video"></i> Annotated Video`;
        downloadBtn.disabled = false;
        alert(`Failed to download video: ${error.message}`);
    }
}

async function downloadExcelReport() {
    if (!analysisResults || !analysisResults.video_filename) {
        alert('No analysis results available!');
        return;
    }

    const modal = document.getElementById('selfEvalModal');
    modal.style.display = 'flex';

    document.getElementById('closeEvalModal').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('selfEvalForm').onsubmit = async (e) => {
        e.preventDefault();

        const downloadBtn = document.getElementById('downloadExcel');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
        downloadBtn.disabled = true;
        modal.style.display = 'none';

        // Collect all 20 scores
        const userScores = {
            self_eye: parseFloat(document.getElementById('self_eye').value) || 0,
            self_facial: parseFloat(document.getElementById('self_facial').value) || 0,
            self_gestures: parseFloat(document.getElementById('self_gestures').value) || 0,
            self_posture: parseFloat(document.getElementById('self_posture').value) || 0,
            self_attire: parseFloat(document.getElementById('self_attire').value) || 0,
            self_outline: parseFloat(document.getElementById('self_outline').value) || 0,
            self_opening: parseFloat(document.getElementById('self_opening').value) || 0,
            self_body: parseFloat(document.getElementById('self_body').value) || 0,
            self_conclusion: parseFloat(document.getElementById('self_conclusion').value) || 0,
            self_grammar: parseFloat(document.getElementById('self_grammar').value) || 0,
            self_time_mgmt: parseFloat(document.getElementById('self_time_mgmt').value) || 0,
            self_voice: parseFloat(document.getElementById('self_voice').value) || 0,
            self_rate: parseFloat(document.getElementById('self_rate').value) || 0,
            self_fluency: parseFloat(document.getElementById('self_fluency').value) || 0,
            self_pronunciation: parseFloat(document.getElementById('self_pronunciation').value) || 0,
            self_verbal: parseFloat(document.getElementById('self_verbal').value) || 0,
            self_qna: parseFloat(document.getElementById('self_qna').value) || 0,
            self_engagement: parseFloat(document.getElementById('self_engagement').value) || 0,
            self_emotional: parseFloat(document.getElementById('self_emotional').value) || 0,
            self_listening: parseFloat(document.getElementById('self_listening').value) || 0,
        };

        try {
            // ── Save Excel server-side AND get filename ────────────────
            const saveResp = await fetch(`${API_URL}/api/save-excel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: analysisResults.video_filename,
                    user_scores: userScores
                })
            });

            if (saveResp.ok) {
                const saveData = await saveResp.json();
                if (saveData.excel_filename) {
                    window._excelFilename = saveData.excel_filename;
                    document.getElementById('seePptBtn').style.display = 'inline-flex';
                    console.log("✅ Excel saved for PPT:", saveData.excel_filename);
                }
            }

            // ── Also download the Excel for the user ───────────────────
            const dlResp = await fetch(`${API_URL}/api/generate-excel-personalized`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: analysisResults.video_filename,
                    user_scores: userScores
                })
            });

            if (!dlResp.ok) throw new Error(`Server error: ${dlResp.status}`);
            const blob = await dlResp.blob();
            if (blob.size === 0) throw new Error('Generated file is empty');

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${analysisResults.video_filename.replace(/\.[^/.]+$/, '')}_Self_Evaluation.xlsx`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }, 100);

        } catch (error) {
            console.error('❌ Excel error:', error);
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            alert(`Failed to download Excel: ${error.message}`);
        }
    };
}

// function openPPTGenerator() {
//     const excel = window._excelFilename || (analysisResults && analysisResults.excel_report_filename) || '';
//     if (!excel) {
//         alert('Please generate and download the Self-Evaluation Excel first, then click "See PPT" again.');
//         return;
//     }
//     // Open the PPT generator page with the excel filename as a query parameter
//     window.open(`/teacher/ppt_generate.html?excel=${encodeURIComponent(excel)}`, '_blank');
// }

async function openPPTGenerator() {
    const excel = window._excelFilename || (analysisResults && analysisResults.excel_report_filename) || '';
    if (!excel) {
        alert('Please generate and download the Self-Evaluation Excel first, then click "See PPT" again.');
        return;
    }

    const btn = document.getElementById('seePptBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating PPT...`;
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/generate-ppt-public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ excel_filename: excel })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'PPT generation failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = excel.replace('.xlsx', '.pptx');
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 100);

    } catch (error) {
        console.error('❌ PPT error:', error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert(`Failed to generate PPT: ${error.message}`);
    }
}