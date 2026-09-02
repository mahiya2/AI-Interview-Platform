const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  aiFeedback: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });
// timestamps: true automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);