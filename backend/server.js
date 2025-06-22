// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const path = require("path");
const cheerio = require('cheerio');
const bodyParser = require('body-parser');


const app = express();
const authRoutes = require("./routes/authRoutes");
const generateEmailRoute = require('./routes/generateEmail');
const sendEmailRoute = require("./routes/sendEmail");
const historyRoutes = require("./routes/historyRoutes");
const scrapeRoutes = require("./routes/scrape");
const dataCleanerRoute = require("./routes/dataCleaner");
// const imageToEmailRoute = require("./routes/imageToEmail");
const extractTextRouter = require("./routes/extractText");


// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve attachments
app.use("/api/auth", authRoutes);
app.use('/api/generate-email', generateEmailRoute);
app.use("/api", sendEmailRoute);
app.use("/api/history", historyRoutes);
app.use("/api", scrapeRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api", dataCleanerRoute);
// app.use("/api/image-to-email", imageToEmailRoute);
app.use('/api/extract-text', extractTextRouter);


// Routes (we’ll add them soon)
app.get("/", (req, res) => {
  res.send("TasXpert Backend is running!");
});

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const results = [];

    // Example: scrape article titles and links from a news site
    $('a').each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href');

      // Add only if both are present and valid
      if (title && link && link.startsWith('http')) {
        results.push({ title, link });
      }
    });

    res.json({ success: true, data: results.slice(0, 10) }); // Limit to 10 for simplicity
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
