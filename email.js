// bahevioural_video_analyzer/backend/utils/app/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Send an email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - plain text body
 * @param {string} html - HTML body (optional)
 * @returns {Promise}
 */
async function sendEmail({ to, subject, text, html }) {
    const mailOptions = {
        from: `"BVA Platform" <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
}

module.exports = { sendEmail };