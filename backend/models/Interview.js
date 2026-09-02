const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: String, // HR or Technical
      required: true,
    },

    stack: {
      type: String,
      default: null,
    },

    questions: [
      {
        questionText: String,
        answerText: String,
        feedback: String,
        score: Number,
      },
    ],

    status: {
      type: String, // in-progress or completed
      default: 'in-progress',
    },

    overallScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);