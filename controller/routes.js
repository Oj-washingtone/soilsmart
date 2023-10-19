import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Replicate from "replicate";
import dotenv from "dotenv";
import ReplicateResponseHandler from "../app/utils/EngageUser.js";
import MarkdownIt from "markdown-it";

const router = express.Router();

const apiToken = dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (including text.js)
router.use(express.static("app"));
router.use(express.static(path.join(__dirname, "app")));
router.use(express.static(path.join(__dirname, "app/utils")));

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "app/index.html");
  res.sendFile(filePath);
});

router.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  const replicateHandler = new ReplicateResponseHandler();

  const prediction = await replicateHandler.getResponse(userInput);

  res.json(prediction);
  res.end();
});

export default router;
