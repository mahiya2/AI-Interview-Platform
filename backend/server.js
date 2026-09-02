const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
   const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
app.use(cors());
app.use(express.json()); // allows the server to read JSON data sent from forms/apps
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('Hello! My AI Interview Platform backend is working 🎉');
});

app.use('/api/auth', authRoutes); // any URL starting with /api/auth goes to authRoutes
app.use('/api/Questions', require('./routes/questionRoutes'));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully ✅'))
  .catch((err) => console.log('MongoDB connection error ❌', err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});