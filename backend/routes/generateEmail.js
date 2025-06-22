// const express = require('express');
// const OpenAI = require('openai');
// const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post('/generate-email', async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const message = chatCompletion.choices[0].message.content;
//     res.json({ email: message });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Failed to generate email' });
//   }
// });

// module.exports = router;



// backend/routes/generateEmail.js

// const express = require('express');
// const OpenAI = require('openai');
// const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // router.post('/', async (req, res) => {
// //   const { prompt } = req.body;

// //   if (!prompt) {
// //     return res.status(400).json({ error: 'Prompt is required' });
// //   }

// //   try {
// //     const chatCompletion = await openai.chat.completions.create({
// //       model: "gpt-3.5-turbo",
// //       messages: [{ role: "user", content: prompt }],
// //     });

// //     const message = chatCompletion.choices[0].message.content;
// //     res.json({ email: message });
// //   } catch (error) {
// //     console.error(error.message);
// //     res.status(500).json({ error: 'Failed to generate email' });
// //   }
// // });

// router.post('/', async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: 'Prompt is required' });
//   }

//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const message = chatCompletion.choices[0].message.content;
//     res.json({ email: message });
//   } catch (error) {
//     console.error("OpenAI API Error:", error); // 🔥 Add this line
//     res.status(500).json({ error: 'Failed to generate email' });
//   }
// });



// module.exports = router;




// backend/routes/generateEmail.js
const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,  // This must be set
});


router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      messages: [{ role: "user", content: prompt }],
    });
    

    const message = chatCompletion.choices[0].message.content;
    res.json({ email: message });
  } catch (error) {
    console.error("Together.ai Error:", error.message);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

module.exports = router;
