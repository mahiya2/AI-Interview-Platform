const express = require('express');
const router = express.Router();
const Question = require('../models/Questions');
const protect = require('../middleware/authMiddleware');

// ADD A QUESTION
router.post('/add', protect, async (req, res) => {
  try {
    const { category, question, difficulty, stack } = req.body;

    if (!category || !question) {
      return res.status(400).json({ message: 'Category and question are required' });
    }

    const newQuestion = new Question({
      category,
      question,
      difficulty,
      stack: stack || 'General',
    });
    await newQuestion.save();

    res.status(201).json({
      message: 'Question added successfully ✅',
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET QUESTIONS BY CATEGORY (optionally filtered by stack via ?stack=Python)
router.get('/:category', protect, async (req, res) => {
  try {
    const { category } = req.params;
    const { stack } = req.query;

    const filter = { category };
    if (stack) {
      filter.stack = stack;
    }

    const questions = await Question.find(filter);

    res.status(200).json({
      message: 'Questions fetched successfully ✅',
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// UPDATE A QUESTION'S STACK (or other fields)
router.put('/update/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { stack, category, question, difficulty } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { stack, category, question, difficulty },
      { new: true } // returns the updated document instead of the old one
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({
      message: 'Question updated successfully ✅',
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;