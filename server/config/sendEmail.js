import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
    console.log("Provide BREVO_API_KEY and SENDER_EMAIL in the .env file");
}

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'Gharbeti-sewa',
                    email: process.env.SENDER_EMAIL,
                },
                to: [
                    {
                        email: sendTo,
                        name: sendTo.split('@')[0], // Optional name fallback
                    },
                ],
                subject: subject,
                htmlContent: html,
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Brevo email error:", error.response?.data || error.message);
        return null;
    }
};

export default sendEmail;
