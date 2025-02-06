const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  answers: [{ type: Number }], // array of chosen option indices
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', attemptSchema);
