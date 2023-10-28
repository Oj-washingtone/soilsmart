import mongoose from "mongoose";
import Chats from "./models/Chats.js";

// class to handle saving messages to the database and retrieving them

class Messages {
  constructor() {}

  // function to save message to database
  async saveMessage(sender, message) {
    try {
      const chat = new Chats({
        sender,
        message,
      });

      await chat.save();
    } catch (error) {
      throw new Error("Message saving failed: " + error.message);
    }
  }

  // function to initialize an empty chat for a user
  async initChat(user) {
    try {
      const chat = new Chats({
        user: user.toString(),
        message: [],
      });

      await chat.save();
      return chat._id.toString();
    } catch (error) {
      throw new Error("Chat initialization failed: " + error.message);
    }
  }

  // save message
  async saveMessage(sender, message, id) {
    try {
      const chat = await Chats.findById(new mongoose.Types.ObjectId(id));

      if (!chat) {
        throw new Error("Chat not found");
      }

      // Append the new message to the thread array of the chat
      chat.thread.push({ sender, message });

      await chat.save();
    } catch (error) {
      throw new Error("Message saving failed: " + error.message);
    }
  }

  // get message property of the chat belonging to a user and has a particular id

  async getCurrentChat(user, id) {
    user = user.toString();
    try {
      const chat = await Chats.findOne({
        user,
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      return chat;
    } catch (error) {
      throw new Error("Chat retrieval failed: " + error.message);
    }
  }

  // function to get all mesages from the database for a particular user to have a chat history
  async getAllMessages(user) {
    user = user.toString();
    try {
      const messages = await Chats.find({ user: user });
      return messages;
    } catch (error) {
      throw new Error("Previous Message retrieval failed: " + error.message);
    }
  }
}

export default Messages;
