import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  fullName: String,
  email: String,
  password: String, // Note: Store hashed passwords for security
});

const User = mongoose.model("User", userSchema);

export default User;
