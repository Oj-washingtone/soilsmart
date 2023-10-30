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
import Messages from "./Messages.js";
import EventSource from "eventsource";

const router = express.Router();
const account = new Account();
const messages = new Messages();

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
  done(null, user._id.toString()); // Convert ObjectId to string
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await account.findUserById(id); // Parse string back to ObjectId
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Midleware to ensure user is authenticated before accessing some parts
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // User is not authenticated, redirect to the login page
  res.redirect("/login");
}

router.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/chats");
  } else {
    const filePath = path.join(__dirname, "..", "app/src", "index.html");
    res.sendFile(filePath);
  }
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
  if (req.session.isLoggedIn) {
    // User is already authenticated, redirect to /chats
    res.redirect("/chats");
  } else {
    const signin_page = path.join(__dirname, "..", "app/src", "login.html");
    res.sendFile(signin_page);
  }
});

router.get("/signup", (req, res) => {
  const signin_page = path.join(__dirname, "..", "app", "signup.html");
  res.sendFile(signin_page);
});

router.get("/chats", ensureAuthenticated, async (req, res) => {
  const chatId = req.query.id;

  try {
    // get current chat
    const chat = await messages.getCurrentChat(req.user._id, chatId);
    const previousMessages = await messages.getAllMessages(req.user._id);

    res.render("chat", { chat, previousMessages });
  } catch (error) {
    // catch errors and render 404.ejs
    res.status(404).render("404");
  }
});

router.post("/new-chat", ensureAuthenticated, async (req, res) => {
  try {
    // Initialize a new chat
    const chat = await messages.initChat(req.user._id);
    res.redirect("/chats?id=" + chat);
  } catch (error) {
    // Handle errors, e.g., render an error page
    res.status(500).render("error", { error });
  }
});

router.post("/chat", async (req, res) => {
  const userInput = req.body.message;
  const chatId = req.body.chatId;

  // Save user message
  await messages.saveMessage("user", userInput, chatId);

  const replicateHandler = new ReplicateResponseHandler();
  const prediction = await replicateHandler.getResponse(userInput);

  res.json(prediction);
});

// post endpoint to save bot message as sent from client side
router.post("/save/bot/message", async (req, res) => {
  const botMessage = req.body.botMessage;
  const chatId = req.body.chatId;

  // Save bot message
  await messages.saveMessage("bot", botMessage, chatId);

  res.json({ message: "success" });
});

router.post("/userreg", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    const user = await account.registerUser(fullName, email, password);

    // if user is created successfully, log them in
    req.login(user, async (err) => {
      if (err) {
        console.log(err);
        return;
      }

      // init new chat
      const chat = await messages.initChat(user._id);

      req.session.isLoggedIn = true;
      res.redirect("/chats?id=" + chat);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await account.loginUser(email, password);
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

router.post("/signin", passport.authenticate("local"), async (req, res) => {
  // init new messages for user
  const chat = await messages.initChat(req.user._id);

  req.session.isLoggedIn = true;
  res.redirect("/chats?id=" + chat);
});

router.get("/logout", (req, res) => {
  // Attempt to log the user out
  req.logout(function (err) {
    if (err) {
      console.error("Error during logout:", err);
      res.redirect("/login");
    }
    req.session.isLoggedIn = false;
    res.redirect("/");
  });
});

export default router;
