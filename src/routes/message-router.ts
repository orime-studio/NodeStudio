import { IMessage } from "../@types/@types";
import { messageService } from "../services/message-service";
import router from "./users";

//create new message
router.post('/send-message', async (req, res, next) => {
    try {
        const messageData: IMessage = req.body;
        const result = await messageService.createMessage(messageData);
        
        // שליחת מייל לאחר יצירת ההודעה
        await messageService.sendEmail(messageData);
        
        res.status(201).json(result);
    } catch (e) {
        console.error('Error creating message:', e); // הדפסת שגיאה לקונסול
        res.status(500).json({ message: 'Error creating message', error: e.message });
    }
});

//get all messages
router.get('/all-messages/get', async (req, res, next) => {
    try {
        const messages = await messageService.getAllMessages();
        res.json(messages);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

export { router as messageRouter };