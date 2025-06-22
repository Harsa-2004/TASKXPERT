// routes/extractText.js
const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer,
      'eng',
      { logger: m => console.log(m) }
    );

    res.json({ text });
  } catch (err) {
    console.error("OCR Error:", err);
    res.status(500).json({ error: 'Failed to extract text from image' });
  }
});

module.exports = router;
