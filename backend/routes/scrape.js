// // routes/scrape.js

// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");

// const router = express.Router();

// router.post("/scrape", async (req, res) => {
//   const { url } = req.body;

//   try {
//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const scrapedData = [];

//     $("h2, h3, p").each((index, element) => {
//       scrapedData.push($(element).text().trim());
//     });

//     res.json({ success: true, data: scrapedData });
//   } catch (error) {
//     console.error("Scraping failed:", error.message);
//     res.status(500).json({ success: false, message: "Failed to scrape" });
//   }
// });

// module.exports = router;



// // routes/scrape.js

// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");
// const path = require("path");
// const { Parser } = require("json2csv");

// const router = express.Router();

// router.post("/scrape", async (req, res) => {
//   const { url } = req.body;

//   try {
//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const scrapedData = [];

//     $("h2, h3, p").each((index, element) => {
//       scrapedData.push({ text: $(element).text().trim() });
//     });

//     // Convert to CSV
//     const parser = new Parser();
//     const csv = parser.parse(scrapedData);
//     const fileName = `scraped-${Date.now()}.csv`;
//     const filePath = path.join(__dirname, "..", "public", fileName);

//     fs.writeFileSync(filePath, csv);

//     res.json({
//       success: true,
//       data: scrapedData,
//       csvLink: `/public/${fileName}`,
//     });
//   } catch (error) {
//     console.error("Scraping failed:", error.message);
//     res.status(500).json({ success: false, message: "Failed to scrape" });
//   }
// });

// module.exports = router;



// routes/scrape.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// router.post('/scrape', async (req, res) => {
//   const { query } = req.body;

//   try {
//     const formattedQuery = query.trim().replace(/\s+/g, '+');
//     const url = `https://www.bing.com/news/search?q=${formattedQuery}`; // You can use other news sources too

//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     const results = [];

//     $('.news-card h2 a').each((index, element) => {
//       const title = $(element).text();
//       const link = $(element).attr('href');
//       if (title && link) {
//         results.push({ title, link });
//       }
//     });

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Scraping failed' });
//   }
// });

// In routes/scrape.js
router.post('/scrape', async (req, res) => {
    const { query } = req.body;
  
    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }
  
    try {
      // Replace this URL with your actual scraping target
      const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      
      const $ = cheerio.load(response.data);
      const results = [];
  
      $('a.title').each((i, el) => {
        results.push({
          title: $(el).text(),
          link: $(el).attr('href')
        });
      });
  
      return res.json(results); // ✅ JSON response
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Scraping failed' });
    }
  });
  

module.exports = router;
