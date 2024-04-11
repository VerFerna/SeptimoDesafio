import ChatManager from "../../dao/mongoDB/chatManager.js";
import { Router } from "express";

const chatManager = new ChatManager();
const router = Router();

router.post("/v2/chats", async (req, res) => {
  const { user, message, hour } = req.body;

  if (!user || !message) {
    return res.status(400).json("All fields are required");
  }

  const date = new Date();
  const hourDate = date.getHours();
  const minuteDate = date.getMinutes();
  const formarttedMinute = minuteDate.toString().padStart(2, "0");
  const chatHour = `${hourDate}:${formarttedMinute}`;

  try {
    const chat = {
      user,
      message,
      hour: chatHour,
    };

    await chatManager.saveMessage(chat);
    res.status(201).json("Message created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/v2/chats", async (req, res) => {
  try {
    const messages = await chatManager.getMessages();

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/v2/chats/:mid", async (req, res) => {
  const { mid } = req.params;
  const props = req.body;

  try {
    const updatedMessage = await chatManager.editMessage(mid, props);

    res.status(200).json(updatedMessage);
  } catch (error) {
    if (err.message.includes("Invalid message")) {
      res.status(404).json(error.message);
    } else if (err.message.includes("Message cannot")) {
      res.status(404).json(error.message);
    } else if (err.message.includes("Not found")) {
      res.status(400).json(error.message);
    } else {
      res.status(500).json(error);
    }
  }
});

export default router;
