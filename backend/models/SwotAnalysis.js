const mongoose = require('mongoose');

const swotAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationSummary: { type: String, required: true },
  keyMemories: [String],   // ← naya field
  strengths: [String],
  weaknesses: [String],
  opportunities: [String],
  threats: [String],
  moodScore: { type: Number, min: 1, max: 10 },
  keyTopics: [String],
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SwotAnalysis', swotAnalysisSchema);