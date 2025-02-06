// server/models/Grade.js
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // role=STUDENT
  },
  gradeValue: { type: String }, // e.g. 'A+', 'B', or numeric
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grade', gradeSchema);
