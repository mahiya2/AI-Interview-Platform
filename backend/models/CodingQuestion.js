const mongoose = require('mongoose');

const codingQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String, // "Easy", "Medium", "Hard"
    default: 'Medium',
  },
  examples: [
    {
      input: String,
      output: String,
    },
  ],
  constraints: {
    type: String,
  },
  testCases: [
    {
      input: String,   // what gets fed to the program
      expectedOutput: String, // what the program should print
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);