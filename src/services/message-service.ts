// services/message-service.ts
import nodemailer from 'nodemailer';
import { IMessage } from '../@types/@types';
import Message from '../db/models/message-model';

const sendEmail = (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'orime.studio.wd@gmail.com', // כתובת הדוא"ל שלך
            pass: 'rgbphd45BN', // סיסמת האפליקציה שלך
        },
    });

    const mailOptions = {
        from: 'orime.studio.wd@gmail.com',
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

export const messageService = {
    // יצירת הודעה חדשה
    createMessage: async (data: IMessage) => {
        console.log('Creating a new message with data:', data);
        const message = new Message(data);
        console.log('Message created:', message);

        // שמירת ההודעה במסד הנתונים
        const savedMessage = await message.save();

        // שליחת המייל
        await sendEmail(data.email, 'New Message', data.message); // שלחי מייל עם הפרטים

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
