const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswerIndex: Number
  }],
  timeLimit: Number, // e.g., total seconds or minutes to complete
  startTime: Date,
  endTime: Date,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to teacher
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course' // which course this quiz belongs to
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
