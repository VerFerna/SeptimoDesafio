import mongoose from "mongoose";
import { MessageModel } from "../models/message.model.js";
import { getLocaleTime } from "../../helpers/utils.js";

class ChatManager {
  saveMessage = async (message) => {
    try {
      const newMessage = await MessageModel.create(message);

      console.log(`Message saved - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getMessages = async () => {
    try {
      const messages = await MessageModel.find();

      return messages;
    } catch (err) {
      console.log(`No messages - ${getLocaleTime()}`);
      return [];
    }
  };

  editMessage = async (idM, props) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idM)) {
        console.log(`Invalid message ID - ${getLocaleTime()}`);
        throw new Error("Invalid message ID");
      }

      if (props.message.trim().length < 1) {
        console.log(`Message cannot be empty - ${getLocaleTime()}`);
        throw new Error("Message cannot be empty");
      }

      const newChat = await MessageModel.findByIdAndUpdate(idM, props, {
        new: true,
      });

      if (!newChat) {
        console.log(`Not found Chat - ${getLocaleTime()}`);
        throw new Error("Not found Chat");
      }

      return newChat;
    } catch (err) {
      throw err;
    }
  };
}

export default ChatManager;
