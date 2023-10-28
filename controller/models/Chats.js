import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: String,
  thread: Array,
});

const Chats = mongoose.model("Chat", chatSchema);

export default Chats;
