const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// GET LEADERBOARD - ranks all users by their average interview score
router.get('/', protect, async (req, res) => {
  try {
    // Get all completed interviews, grouped by user
    const results = await Interview.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$user',
          averageScore: { $avg: '$overallScore' },
          interviewsCompleted: { $sum: 1 },
        },
      },
      { $sort: { averageScore: -1 } }, // highest score first
      { $limit: 20 }, // top 20 users
    ]);

    // The aggregate above only gives us user IDs - fetch their names
    const leaderboard = await Promise.all(
      results.map(async (entry, index) => {
        const user = await User.findById(entry._id).select('name');
        return {
          rank: index + 1,
          name: user ? user.name : 'Unknown User',
          averageScore: Math.round(entry.averageScore),
          interviewsCompleted: entry.interviewsCompleted,
        };
      })
    );

    res.status(200).json({
      message: 'Leaderboard fetched successfully ✅',
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;