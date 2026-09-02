const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const upload = require('../config/multerConfig');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password (scramble it so it's never stored as plain text)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with the hashed one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create the token (the "wristband")
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful ✅',
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// PROTECTED TEST ROUTE
router.get('/profile', protect, async (req, res) => {
  res.status(200).json({
    message: 'You accessed a protected route ✅',
    user: req.user,
  });
});
// RESUME UPLOAD ROUTE
router.post('/upload-resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // req.user.id comes from the token (set by our protect middleware)
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the file path to the user's profile
    user.resumeUrl = req.file.path;
    await user.save();

    res.status(200).json({
      message: 'Resume uploaded successfully ✅',
      resumeUrl: user.resumeUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// AI RESUME FEEDBACK ROUTE
router.post('/analyze-resume', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    if (!user || !user.resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume first' });
    }

    // Read the PDF file and extract its text
const dataBuffer = fs.readFileSync(user.resumeUrl);
const parser = new PDFParse({ data: dataBuffer });
const pdfData = await parser.getText();
const resumeText = pdfData.text;
await parser.destroy();

    // Send the resume text to Groq (Llama 3) for feedback
    const aiResponse = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume reviewer. Give constructive feedback on the resume text provided. Keep your response concise: a score out of 100, 3 strengths, and 3 suggestions for improvement.',
        },
        {
          role: 'user',
          content: resumeText,
        },
      ],
    });

    const feedback = aiResponse.choices[0].message.content;

    // Save the feedback to the user's profile
    user.aiFeedback = feedback;
    await user.save();

    res.status(200).json({
      message: 'Resume analyzed successfully ✅',
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;