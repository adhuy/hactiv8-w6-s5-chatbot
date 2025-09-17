import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({});

// insialisasi model AI
const geminiModels = {
  text: "gemini-2.5-flash-lite",
  image: "gemini-2.5-flash",
  audio: "gemini-2.5-flash",
  document: "gemini-2.5-flash-lite",
};

// insialisasi aplikasi backend/server
app.use(cors()); // mengizinkan request dari semua origin
app.use(express.json()); // mengizinkan request dengan format JSON

app.post('/generate-text', async (req, res) => {
  const { body } = req;

  if(!body) return res.status(400).send({ error: "Tidak ada payload yang dikirim!" });

  if(typeof body !== "object") return res.status(400).send({ error: "Tipe payload tidak sesuai!" });

  const { message } = body;

  if(!message || typeof message !== "string") return res.status(400).send({ error: "Pesan tidak ada atau formatnya tidak sesuai!" });

  const response = await ai.models.generateContent({
    model: geminiModels.text,
    contents: message,
  });

  res.status(200).json({ reply: response.text });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
