const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

// Base upload directory from .env or default
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

// Ensure base directory exists
fs.ensureDirSync(UPLOAD_DIR);

/**
 * Configure multer for outline uploads
 * - destination: outlines folder
 * - filename: unique name to avoid collisions
 */
const outlineStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(UPLOAD_DIR, 'outlines');
        fs.ensureDirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: topicId_studentId_timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.body.topicId}_${req.user.id}_${uniqueSuffix}${ext}`);
    }
});

const outlineUpload = multer({
    storage: outlineStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    }
});

/**
 * Save a file (e.g., generated report) directly from buffer
 * @param {Buffer} buffer - file content
 * @param {string} subDir - subdirectory under uploads (e.g., 'reports')
 * @param {string} filename - desired filename
 * @returns {string} full path
 */
async function saveFile(buffer, subDir, filename) {
    const dir = path.join(UPLOAD_DIR, subDir);
    await fs.ensureDir(dir);
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buffer);
    return filePath;
}

/**
 * Get a file's path for reading/serving
 * @param {string} subDir - subdirectory
 * @param {string} filename
 * @returns {string} full path
 */
function getFilePath(subDir, filename) {
    return path.join(UPLOAD_DIR, subDir, filename);
}

/**
 * Delete a file
 * @param {string} filePath - full path
 */
async function deleteFile(filePath) {
    await fs.remove(filePath);
}

/**
 * Generate a public URL for a file (to be served via an endpoint)
 * For local storage, you'll create an endpoint like /api/files/:type/:filename
 * This function returns the relative path that can be used in that endpoint.
 */
function getFileUrl(subDir, filename) {
    // Returns a URL path like /uploads/outlines/filename.pdf
    return `/uploads/${subDir}/${filename}`;
}

module.exports = {
    outlineUpload,          // multer middleware for outline uploads
    saveFile,
    getFilePath,
    deleteFile,
    getFileUrl,
    UPLOAD_DIR
};