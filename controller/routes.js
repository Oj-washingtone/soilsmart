import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import ReplicateResponseHandler from "../app/utils/EngageUser.js";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import Account from "./Account.js";

const router = express.Router();
const account = new Account();

const apiToken = dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (including text.js)
router.use(express.static("app"));
router.use(express.static(path.join(__dirname, "app")));
router.use(express.static(path.join(__dirname, "app/utils")));

// Initialize express-session
router.use(
  session({
    secret: "9w&2$gA$7jH1pP#5mN!cYtRr@zUxV6qB",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
router.use(passport.initialize());
router.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => {
  // Store only the user id in the session
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user.id);
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await account.loginUser(email, password);
        console.log(user);
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "app/src", "index.html");
  res.sendFile(filePath);
});

router.get("/register", (req, res) => {
  const registration_page = path.join(
    __dirname,
    "..",
    "app/src",
    "register.html"
  );

  res.sendFile(registration_page);
});

router.get("/login", (req, res) => {
  const signin_page = path.join(__dirname, "..", "app/src", "login.html");
  res.sendFile(signin_page);
});

router.get("/signup", (req, res) => {
  const signin_page = path.join(__dirname, "..", "app", "signup.html");
  res.sendFile(signin_page);
});

router.get("/chats", (req, res) => {
  const chat_page = path.join(__dirname, "..", "app/src", "chat.html");
  res.sendFile(chat_page);
});

router.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  const replicateHandler = new ReplicateResponseHandler();

  const prediction = await replicateHandler.getResponse(userInput);

  res.json(prediction);
  res.end();
});

router.post("/userreg", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    const user = await account.registerUser(fullName, email, password);

    // if user is created successfully, log them in
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/chats");
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/chats");
});

export default router;
