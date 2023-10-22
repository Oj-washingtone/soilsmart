import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from "./controller/routes.js";
// import db from "./controller/databaseConfig.js";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use the bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
