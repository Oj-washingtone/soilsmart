import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from "./controller/routes.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Middleware for parsing JSON data
app.use(express.json());

app.use("/", routes);
app.use("/chat", routes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
