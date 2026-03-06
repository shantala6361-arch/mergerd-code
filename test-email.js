require('dotenv').config();
const { sendEmail } = require('../backend/utils/app/email');

(async () => {
    try {
        await sendEmail({
            to: 'shantala6361@gmail.com', // or any test email
            subject: 'Test from BVA',
            text: 'Hello! This is a test email using your SMTP.',
            html: '<strong>Hello!</strong> This is a test email using your SMTP.',
        });
        console.log('✅ Test email sent successfully');
    } catch (err) {
        console.error('❌ Test failed:', err);
    }
})();