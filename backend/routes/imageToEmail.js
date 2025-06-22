// backend/routes/imageToEmail.js
const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const OpenAI = require("openai");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng");

    const chatCompletion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      messages: [{ role: "user", content: text }],
    });

    const generatedEmail = chatCompletion.choices[0].message.content;

    res.json({ extractedText: text, generatedEmail });
  } catch (error) {
    console.error("Image-to-Email error:", error.message);
    res.status(500).json({ error: "Failed to process image and generate email" });
  }
});

module.exports = router;
