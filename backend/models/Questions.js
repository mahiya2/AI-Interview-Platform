const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String, // e.g. "HR", "Technical"
    required: true,
  },
  stack: {
    type: String, // e.g. "JavaScript", "Python", "Java", "General" (for HR)
    default: 'General',
  },
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    default: 'Medium',
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);