const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Interview = require('../models/Interview');
const CodingQuestion = require('../models/CodingQuestion');
const Question = require('../models/Questions');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');


// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: 'student',
    });

    const totalAdmins = await User.countDocuments({
      role: 'admin',
    });

    const totalInterviews = await Interview.countDocuments();

    const completedInterviews = await Interview.countDocuments({
      status: 'completed',
    });

    const totalCodingQuestions =
      await CodingQuestion.countDocuments();

    const easyCodingQuestions =
      await CodingQuestion.countDocuments({
        difficulty: 'Easy',
      });

    const mediumCodingQuestions =
      await CodingQuestion.countDocuments({
        difficulty: 'Medium',
      });

    const hardCodingQuestions =
      await CodingQuestion.countDocuments({
        difficulty: 'Hard',
      });

    const totalInterviewQuestions =
      await Question.countDocuments();


    res.status(200).json({

      message: 'Admin statistics fetched successfully',

      users: {
        total: totalUsers,
        students: totalStudents,
        admins: totalAdmins,
      },

      interviews: {
        total: totalInterviews,
        completed: completedInterviews,
      },

      codingQuestions: {
        total: totalCodingQuestions,
        easy: easyCodingQuestions,
        medium: mediumCodingQuestions,
        hard: hardCodingQuestions,
      },

      interviewQuestions: totalInterviewQuestions,

    });

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch admin statistics',
      error: error.message,
    });

  }
});


// ==========================================
// GET ALL USERS
// ==========================================

router.get('/users', protect, adminOnly, async (req, res) => {
  try {

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });

  }
});


module.exports = router;