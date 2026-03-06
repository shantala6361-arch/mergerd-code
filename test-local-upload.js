require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { saveFile, getFilePath, getFileUrl } = require('./utils/fileStorage');

(async () => {
    try {
        // Simulate a file buffer (e.g., PDF content)
        const dummyContent = 'This is a test outline PDF content.';
        const buffer = Buffer.from(dummyContent, 'utf-8');
        const filename = `test_outline_${Date.now()}.pdf`;

        // Save to outlines folder
        const savedPath = await saveFile(buffer, 'outlines', filename);
        console.log('✅ File saved at:', savedPath);

        // Generate URL (for frontend use)
        const url = getFileUrl('outlines', filename);
        console.log('File URL (relative):', url);

        // Verify file exists
        const exists = await fs.pathExists(savedPath);
        console.log('File exists:', exists);

        // Optional: clean up
        // await deleteFile(savedPath);
        // console.log('Deleted');
    } catch (err) {
        console.error('❌ Test failed:', err);
    }
})();