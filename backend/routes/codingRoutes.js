const express = require('express');
const router = express.Router();
const axios = require('axios');
const CodingQuestion = require('../models/CodingQuestion');
const protect = require('../middleware/authMiddleware');
// ADD A CODING QUESTION
router.post('/add', protect, async (req, res) => {
  try {
    const { title, description, difficulty, examples, constraints, testCases } = req.body;

    if (!title || !description || !testCases || testCases.length === 0) {
      return res.status(400).json({ message: 'Title, description, and at least one test case are required' });
    }

    const newQuestion = new CodingQuestion({
      title,
      description,
      difficulty,
      examples,
      constraints,
      testCases,
    });

    await newQuestion.save();

    res.status(201).json({
      message: 'Coding question added successfully ✅',
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL CODING QUESTIONS (list view - no test cases exposed, so answers can't be seen)
router.get('/all', protect, async (req, res) => {
  try {
    const questions = await CodingQuestion.find().select('-testCases');

    res.status(200).json({
      message: 'Coding questions fetched successfully ✅',
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ONE CODING QUESTION BY ID (also hides test cases)
router.get('/:id', protect, async (req, res) => {
  try {
    const question = await CodingQuestion.findById(req.params.id).select('-testCases');

    if (!question) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    res.status(200).json({
      message: 'Coding question fetched successfully ✅',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// EXECUTE CODE USING JDOODLE
router.post('/execute', protect, async (req, res) => {
  try {
    const { script, language, versionIndex, stdin } = req.body;

    if (!script || !language) {
      return res.status(400).json({
        message: 'Code and language are required',
      });
    }

    const response = await axios.post(
      'https://api.jdoodle.com/v1/execute',
      {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script,
        language,
        versionIndex: versionIndex || '0',
        stdin: stdin || '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      message: 'Code executed successfully',
      result: response.data,
    });
  } catch (error) {
    console.error('JDoodle execution error:', error.response?.data || error.message);

    res.status(500).json({
      message: 'Code execution failed',
      error: error.response?.data || error.message,
    });
  }
});
// SUBMIT CODE AND CHECK HIDDEN TEST CASES
router.post('/submit', protect, async (req, res) => {
  try {
    const { questionId, script, language, versionIndex } = req.body;

    if (!questionId || !script || !language) {
      return res.status(400).json({
        message: 'Question ID, code, and language are required',
      });
    }

    // Fetch the full question including hidden test cases
    const question = await CodingQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: 'Coding question not found',
      });
    }

    const testCases = question.testCases || [];

    if (testCases.length === 0) {
      return res.status(400).json({
        message: 'No test cases available for this question',
      });
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      const response = await axios.post(
        'https://api.jdoodle.com/v1/execute',
        {
          clientId: process.env.JDOODLE_CLIENT_ID,
          clientSecret: process.env.JDOODLE_CLIENT_SECRET,
          script,
          language,
          versionIndex: versionIndex || '0',
          stdin: testCase.input || '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data;

      const actualOutput = (result.output || '').trim();
      const expectedOutput = (testCase.expectedOutput || '').trim();

      const passed =
        result.isExecutionSuccess === true &&
        actualOutput === expectedOutput;

    results.push({
  testCase: i + 1,
  passed,
  actualOutput,
});

      // Stop checking if one test case fails
      if (!passed) {
        break;
      }
    }

    const allPassed =
      results.length === testCases.length &&
      results.every((result) => result.passed);

    res.status(200).json({
      message: allPassed
        ? 'All test cases passed 🎉'
        : 'Some test cases failed',
      passed: allPassed,
      totalTestCases: testCases.length,
      passedTestCases: results.filter((r) => r.passed).length,
      results,
    });
  } catch (error) {
    console.error(
      'Code submission error:',
      error.response?.data || error.message
    );

    res.status(500).json({
      message: 'Code submission failed',
      error: error.response?.data || error.message,
    });
  }
});
module.exports = router;