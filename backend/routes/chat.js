const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const authMiddleware = require('../middleware/authMiddleware');
const SwotAnalysis = require('../models/SwotAnalysis');

router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;

  try {
    // User ke pichle 3 sessions ki keyMemories fetch karo
    const pastSessions = await SwotAnalysis.find({ userId: req.userId })
      .sort({ generatedAt: -1 })
      .limit(3);

    let memoryContext = '';
    if (pastSessions.length > 0) {
      const allMemories = pastSessions
        .flatMap(session => session.keyMemories || [])
        .filter(Boolean);

      if (allMemories.length > 0) {
        memoryContext = `Here is some context from this user's previous conversations with you. Use it naturally to provide continuity, but do not explicitly list these back to the user unless relevant:\n${allMemories.map(m => `- ${m}`).join('\n')}\n\n`;
      }
    }

    const systemInstruction = {
      parts: [{
        text: `You are Solace, a supportive and empathetic mental health chatbot. Be warm, non-judgmental, and helpful. ${memoryContext}Now respond to the user's current message.`
      }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: systemInstruction,
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      console.error("Unexpected Gemini response:", JSON.stringify(data, null, 2));
      return res.status(500).json({ reply: "Sorry, I couldn't process that. Please try again." });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ reply: "Something went wrong. Please try again in a moment." });
  }
});

module.exports = router;