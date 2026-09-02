const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Question = require('../models/Questions');
const protect = require('../middleware/authMiddleware');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// START A NEW INTERVIEW
router.post('/start', protect, async (req, res) => {
  try {
    const { category, stack } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Build the filter - only add stack if one was given (HR interviews won't send one)
    const filter = { category };
    if (stack) {
      filter.stack = stack;
    }

    const allQuestions = await Question.find(filter);

    if (allQuestions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this category/stack' });
    }

    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const firstQuestion = allQuestions[randomIndex];

    const newInterview = new Interview({
      user: req.user.id,
      category,
      stack: stack || null,
      questions: [
        {
          questionText: firstQuestion.question,
          answerText: '',
          feedback: '',
          score: 0,
        },
      ],
      status: 'in-progress',
    });

    await newInterview.save();

    res.status(201).json({
      message: 'Interview started ✅',
      interviewId: newInterview._id,
      currentQuestion: firstQuestion.question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// SUBMIT AN ANSWER
router.post('/answer', protect, async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({ message: 'interviewId and answer are required' });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Get the current (most recent) question in this session
    const currentQuestionEntry = interview.questions[interview.questions.length - 1];
    currentQuestionEntry.answerText = answer;

    // Ask Groq to score and give feedback on this answer
    const aiResponse = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'You are an interview coach. Given an interview question and a candidate\'s answer, give a score out of 100 and 2-3 short sentences of constructive feedback. Respond in this exact format: "Score: X/100\nFeedback: ..."',
        },
        {
          role: 'user',
          content: `Question: ${currentQuestionEntry.questionText}\nAnswer: ${answer}`,
        },
      ],
    });

    const aiText = aiResponse.choices[0].message.content;

    // Extract the score number from the AI's response (e.g. "Score: 75/100")
    const scoreMatch = aiText.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    currentQuestionEntry.feedback = aiText;
    currentQuestionEntry.score = score;

    // Decide whether to continue or end the interview
    const filter = { category: interview.category };
if (interview.stack) {
  filter.stack = interview.stack;
}
const allQuestions = await Question.find(filter);
    const askedQuestions = interview.questions.map(q => q.questionText);
    const remainingQuestions = allQuestions.filter(q => !askedQuestions.includes(q.question));

    if (remainingQuestions.length === 0 || interview.questions.length >= 3) {
      // End the interview after 3 questions (or if we run out of questions)
      interview.status = 'completed';
      const totalScore = interview.questions.reduce((sum, q) => sum + q.score, 0);
      interview.overallScore = Math.round(totalScore / interview.questions.length);

      await interview.save();

      return res.status(200).json({
        message: 'Interview completed ✅',
        feedback: aiText,
        status: 'completed',
        overallScore: interview.overallScore,
      });
    }

    // Otherwise, pick the next question
    const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];

    interview.questions.push({
      questionText: nextQuestion.question,
      answerText: '',
      feedback: '',
      score: 0,
    });

    await interview.save();

    res.status(200).json({
      message: 'Answer submitted ✅',
      feedback: aiText,
      status: 'in-progress',
      nextQuestion: nextQuestion.question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// GET ALL PAST INTERVIEWS FOR THE LOGGED-IN USER
router.get('/history', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Interview history fetched successfully ✅',
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// GET ANALYTICS SUMMARY FOR THE LOGGED-IN USER
router.get('/analytics', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
      status: 'completed',
    });

    if (interviews.length === 0) {
      return res.status(200).json({
        message: 'No completed interviews yet',
        totalInterviews: 0,
        averageScore: 0,
        skillsBreakdown: [],
        progressOverTime: [],
      });
    }

    // Average score across all completed interviews
    const totalScore = interviews.reduce((sum, i) => sum + i.overallScore, 0);
    const averageScore = Math.round(totalScore / interviews.length);

    // Group scores by "skill" - using stack if present (Technical), otherwise category (HR)
    const skillGroups = {};
    interviews.forEach((interview) => {
      const skillName = interview.stack || interview.category;
      if (!skillGroups[skillName]) {
        skillGroups[skillName] = [];
      }
      skillGroups[skillName].push(interview.overallScore);
    });

    const skillsBreakdown = Object.keys(skillGroups).map((skill) => {
      const scores = skillGroups[skill];
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      return { skill, averageScore: avg, interviewsCount: scores.length };
    });

    // Progress over time - one point per interview, in chronological order
    const progressOverTime = interviews
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((interview) => ({
        date: interview.createdAt,
        score: interview.overallScore,
        category: interview.category,
      }));

    // Find strongest and weakest skill
    const sortedSkills = [...skillsBreakdown].sort((a, b) => b.averageScore - a.averageScore);
    const strongestSkill = sortedSkills[0]?.skill || null;
    const weakestSkill = sortedSkills[sortedSkills.length - 1]?.skill || null;

    res.status(200).json({
      message: 'Analytics fetched successfully ✅',
      totalInterviews: interviews.length,
      averageScore,
      skillsBreakdown,
      progressOverTime,
      strongestSkill,
      weakestSkill,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;