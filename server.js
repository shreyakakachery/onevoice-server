import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import { createTranscriptionSocket } from "./assemblyAi/transcriptionservice.js";
// WS NEEDS HTTP server to attach to; not Express

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL;

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ALL ROUTES
app.get("/", (_req, res) => {
  res.send("Welcome to the OneVoice Backend. Recording in Progress...");
});

// app.get("/assembly", (_req, res) => {
//   res.send("Transcribing!");
// });

createTranscriptionSocket(server);
// pass the HTTP server to ws server so it can attach and listen to requests

server.listen(PORT, () => {
  console.log(`running at ${BACKEND_URL}:${PORT}`);
});
