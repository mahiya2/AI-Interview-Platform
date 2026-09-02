# AI Interview Preparation Platform

An AI-powered web application designed to help students prepare for technical and HR interviews through mock interviews, resume analysis, performance tracking, and competitive insights.

## 🚀 Features

### 👤 User Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control

### 📄 AI Resume Analysis
- Upload resume in PDF format
- Extract resume content
- AI-powered resume analysis
- Suggestions for improving the resume

### 🎤 Mock Interview
- HR and Technical interview rounds
- AI-generated interview questions
- User answer evaluation
- Interview score and feedback
- Interview history

### 📊 Analytics
- Track interview performance
- View scores and progress
- Analyze interview performance over time

### 🏆 Leaderboard
- Compare interview performance with other users
- Display user rankings based on performance

### 👨‍💼 Admin Dashboard
- Admin-only access
- View total users
- View student and admin counts
- View interview statistics
- View coding-question statistics
- View interview-question statistics

## 🛠️ Technologies Used

### Frontend
- React.js
- HTML
- CSS
- JavaScript
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### AI
- Groq API

### Other Technologies
- PDF parsing
- REST APIs
- Git & GitHub

## 📁 Project Structure

```text
AI-Interview-Platform/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore
└── README.md