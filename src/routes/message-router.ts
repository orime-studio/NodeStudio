import nodemailer from 'nodemailer';
import { Router } from 'express';
import { IMessage } from "../@types/@types";
import { messageService } from "../services/message-service";

const router = Router();

// הגדרת הטרנספורטר לשליחת המיילים
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// יצירת הודעה ושליחת מייל
router.post('/send-message', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // יצירת הודעה במסד הנתונים
    const result = await messageService.createMessage(req.body as IMessage);

    // הגדרת אפשרויות המייל
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,  // כתובת האימייל שלך
      subject: `New Message from ${name}`,
      text: message,
    };

    // שליחת המייל
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.status(201).json(result);
    });
  } catch (e) {
    next(e.message);
  }
});

// קבלת כל ההודעות
router.get('/all-messages/get', async (req, res, next) => {
  try {
    const messages = await messageService.getAllMessages();
    res.json(messages);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

export { router as messageRouter };
