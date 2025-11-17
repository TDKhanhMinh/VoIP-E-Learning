import nodemailer from "nodemailer";
const MAIL_USER = process.env.GMAIL_USER;
const MAIL_PASS = process.env.GMAIL_PASSWORD;
export const sendEmail = async (toEmail, subject, htmlContent, fromEmail, content) => {
    if (!MAIL_USER || !MAIL_PASS) {
        console.error("LỖI: MAIL_USER hoặc MAIL_PASS chưa được cấu hình trong .env!");
    }
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: content,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email đã được gửi thành công:", info.messageId);
        return info;
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        throw error;
    }
};
