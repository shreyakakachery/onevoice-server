import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import { createTranscriptionSocket } from "./assemblyAi/transcriptionservice.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL;

// MIDDLEWARE
app.use(express.json());
// app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(cors());

// ALL ROUTES
app.get("/", (_req, res) => {
  res.send("Welcome to the OneVoice Backend. Recording in Progress...");
});

// app.get("/assembly", (_req, res) => {
//   res.send("Transcribing!");
// });

createTranscriptionSocket(server);

server.listen(PORT, () => {
  console.log(`running at ${BACKEND_URL}:${PORT}`);
});
