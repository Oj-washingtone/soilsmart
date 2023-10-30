import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from "./controller/routes.js";
import db from "./controller/databaseConfig.js";
import bodyParser from "body-parser";
import ejs from "ejs";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Use the bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/src"));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "app/utils")));
app.use(express.static(path.join(__dirname, "app/src")));

// Middleware for parsing JSON data
app.use(express.json());

app.use("/", routes);
app.use("/chats", routes);
app.use("/chat", routes);
app.use("/login", routes);
app.use("/register", routes);
app.use("/userreg", routes);
app.use("/signin", routes);
app.use("/save/bot/message", routes);
app.use("/logout", routes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
