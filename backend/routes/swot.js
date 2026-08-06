const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const SwotAnalysis = require('../models/SwotAnalysis');
const authMiddleware = require('../middleware/authMiddleware');

// Helper: Gemini ko conversation bhej ke SWOT nikalna
async function generateSwot(messages) {
  const conversationText = messages
    .map(m => `${m.sender === 'user' ? 'User' : 'Bot'}: ${m.text}`)
    .join('\n');

  const prompt = `
Analyze the following conversation between a user and a mental health support chatbot.

Conversation:
${conversationText}

Return ONLY a valid JSON object (no markdown, no extra text, no explanation) with this exact structure:
{
  "conversationSummary": "A short narrative (3-5 sentences) describing what the user talked about, their emotional tone, how the conversation flowed, and how it concluded.",
  "keyMemories": ["3-5 short factual points worth remembering for future conversations — things like ongoing struggles, preferences, or context that would help continue supporting this user next time"],
  "strengths": ["array of user's positive traits or coping mechanisms observed"],
  "weaknesses": ["array of challenges or struggles observed"],
  "opportunities": ["array of areas where the user could grow or improve"],
  "threats": ["array of potential risk factors or concerns"],
  "moodScore": 7,
  "keyTopics": ["array of main topics discussed"]
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]) {
    console.error("Gemini SWOT raw response:", JSON.stringify(data, null, 2));
    throw new Error("Gemini did not return a valid response for SWOT");
  }

  let rawText = data.candidates[0].content.parts[0].text;

  // Gemini kabhi kabhi ```json ... ``` wrap kar deta hai, usse hatao
  rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(rawText);
  } catch (parseErr) {
    console.error("Failed to parse Gemini SWOT response:", rawText);
    throw new Error("Could not parse SWOT analysis from AI response");
  }
}

// POST /api/swot/generate
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length < 2) {
      return res.status(400).json({ message: "Not enough conversation to analyze" });
    }

    const swotResult = await generateSwot(messages);

    const saved = await SwotAnalysis.create({
      userId: req.userId,
      ...swotResult
    });

    res.json({ message: "SWOT analysis generated", data: saved });
  } catch (err) {
    console.error("SWOT generation error:", err.message);
    res.status(500).json({ message: "Failed to generate SWOT analysis" });
  }
});

// POST /api/swot/generate-beacon — sendBeacon ke liye special route (token body mein aata hai)
router.post('/generate-beacon', async (req, res) => {
  try {
    const { token, messages } = req.body;
    if (!token || !messages || messages.length < 2) {
      return res.status(400).end();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const swotResult = await generateSwot(messages);
    await SwotAnalysis.create({ userId: decoded.userId, ...swotResult });

    res.status(200).end();
  } catch (err) {
    console.error("Beacon SWOT error:", err.message);
    res.status(500).end();
  }
});

// GET /api/swot/history — dashboard ke liye
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await SwotAnalysis.find({ userId: req.userId }).sort({ generatedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

module.exports = router;