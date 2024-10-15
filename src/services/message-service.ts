import { IMessage } from '../@types/@types';
import Message from '../db/models/message-model';
import nodemailer from 'nodemailer';

// הגדרת הטרנספולר
const transporter = nodemailer.createTransport({
    service: 'gmail', // או ספק דוא"ל אחר
    auth: {
        user: process.env.EMAIL_USER, // כתובת המייל שלך
        pass: process.env.EMAIL_PASS, // הסיסמה של המייל שלך
    },
});

export const messageService = {
    // יצירת הודעה חדשה
    createMessage: async (data: IMessage) => {
        console.log('Creating a new message with data:', data);
        const message = new Message(data);
        console.log('Message created:', message);

        // שמירת ההודעה במסד הנתונים
        await message.save();

        // שליחת המייל
        await messageService.sendEmail(data); // קריאה לשליחת המייל
    },

    // קבלת כל ההודעות
    getAllMessages: async () => {
        console.log('Fetching all messages');
        const messages = await Message.find({}).sort({ createdAt: -1 });
        console.log('Messages fetched:', messages);
        return messages;
    },

    // שליחת מייל
    sendEmail: async (messageData: IMessage) => {
        console.log('Preparing to send email...');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'orime.studio.wd@gmail.com',
            subject: 'New Message from Contact Form',
            text: `
            You have received a new message:
    
            Name: ${messageData.fullName}
            Email: ${messageData.email}
            Phone: ${messageData.phone}
            Message: ${messageData.message}
            `,
        };

        try {
            console.log('Sending email with options:', mailOptions);
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Could not send email');
        }
    },
};
