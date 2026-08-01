const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );  

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, thodi dikkat aa gayi. Please try again." });
  }
});

module.exports = router;