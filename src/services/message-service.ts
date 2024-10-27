// services/message-service.ts
import nodemailer from 'nodemailer';
import { IMessage } from '../@types/@types';
import Message from '../db/models/message-model';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'orime.studio.wd@gmail.com', // כתובת הדוא"ל שלך
        pass: 'irxc uywu oejz tugl',
    },
});

const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: 'orime.studio.wd@gmail.com',
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Failed to send email');
    }
};

export const messageService = {
    // יצירת הודעה חדשה
    createMessage: async (data: IMessage) => {
        console.log('Creating a new message with data:', data);
        const message = new Message(data);
        console.log('Message created:', message);

        // שמירת ההודעה במסד הנתונים
        const savedMessage = await message.save();

        // שליחת מייל תודה ללקוח
        await sendEmail(data.email, 'Thank you for your message', 'Thank you for reaching out! We will get back to you soon.');

        // שליחת מייל עם הפרטים שלך למייל שלך
        const adminMessage = `New message from: ${data.fullName} (${data.email})\n\nMessage: ${data.message}`;
        await sendEmail('orime.studio.wd@gmail.com', 'New Lead Received', adminMessage);

        return savedMessage; // החזרת ההודעה שנשמרה
    },

    // קבלת כל ההודעות
    getAllMessages: async () => {
        console.log('Fetching all messages');
        const messages = await Message.find({}).sort({ createdAt: -1 });
        console.log('Messages fetched:', messages);
        return messages;
    },
};