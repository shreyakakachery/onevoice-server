import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

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

app.listen(PORT, () => {
  console.log(`running at ${BACKEND_URL}:${PORT}`);
});
