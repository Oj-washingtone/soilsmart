import bcrypt from "bcrypt";
import User from "./models/User.js";

class Account {
  constructor() {}

  // function to register a user
  async registerUser(fullName, email, password) {
    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Hash the password
      const hashedPassword = await this.hashPassword(password);

      const user = new User({
        fullName,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      await user.save();

      // Return the registered user object
      return user;
    } catch (error) {
      throw new Error("User registration failed: " + error.message);
    }
  }

  async loginUser(email, password) {
    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await this.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      return user; // Return the logged-in user object
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  }

  // Helper method to hash passwords
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Helper method to compare passwords
  async comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  async findUserById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error("User not found: " + error.message);
    }
  }
}

export default Account;
