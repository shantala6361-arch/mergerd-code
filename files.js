const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const authMiddleware = require('../middleware/auth'); // your auth

router.get('/uploads/:type/:filename', authMiddleware, async (req, res) => {
    const { type, filename } = req.params;
    // Validate type to prevent directory traversal
    const allowedTypes = ['outlines', 'reports', 'temp_videos'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid file type' });
    }

    const filePath = path.join(__dirname, '../uploads', type, filename);
    try {
        if (await fs.pathExists(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;