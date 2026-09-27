import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MockInterview.css';

function MockInterview() {
  const [category, setCategory] = useState('');
  const [stack, setStack] = useState('');
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('not-started');
  const [overallScore, setOverallScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const extractScore = (feedbackText) => {
    const match = feedbackText.match(/Score:\s*(\d+)/i);
    return match ? match[1] : '-';
  };

  const handleCategoryChoice = (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory === 'HR') {
      startInterview(selectedCategory, null);
    } else {
      setStatus('choosing-stack');
    }
  };

  const startInterview = async (selectedCategory, selectedStack) => {
    setLoading(true);
    setHistory([]);

    try {
      const response = await axios.post(
        'https://ai-interview-platform-h3b8.onrender.com/api/interview/start',
        {
          category: selectedCategory,
          stack: selectedStack,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInterviewId(response.data.interviewId);
      setCurrentQuestion(response.data.currentQuestion);
      setStatus('in-progress');
    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to start interview'
      );

      setStatus('not-started');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please type an answer first');
      return;
    }

    setLoading(true);

    const questionJustAnswered = currentQuestion;
    const answerJustGiven = answer;

    try {
      const response = await axios.post(
        'https://ai-interview-platform-h3b8.onrender.com/api/interview/answer',
        {
          interviewId,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory((prevHistory) => [
        ...prevHistory,
        {
          question: questionJustAnswered,
          answer: answerJustGiven,
          feedback: response.data.feedback,
          score: extractScore(response.data.feedback),
        },
      ]);

      setAnswer('');

      if (response.data.status === 'completed') {
        setStatus('completed');
        setOverallScore(response.data.overallScore);
      } else {
        setCurrentQuestion(response.data.nextQuestion);
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to submit answer'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setCategory('');
    setStack('');
    setInterviewId(null);
    setCurrentQuestion('');
    setAnswer('');
    setHistory([]);
    setStatus('not-started');
    setOverallScore(null);
  };

  const renderHistoryItem = (item, index) => (
    <div className="answered-card" key={index}>

      <div className="answered-header">
        <span>Question {index + 1}</span>

        <span className="answered-score">
          {item.score}/100
        </span>
      </div>

      <h3>{item.question}</h3>

      <div className="answer-box">
        <p className="answer-label">
          Your Answer
        </p>

        <p>{item.answer}</p>
      </div>

      <div className="feedback-box">
        <p className="feedback-label">
          ✨ AI Feedback
        </p>

        <p>{item.feedback}</p>
      </div>

    </div>
  );

  /* =========================
     CATEGORY SELECTION
  ========================= */

  if (status === 'not-started') {
    return (
      <div className="mock-page">

        <header className="mock-header">

          <div className="mock-brand">
            <div className="mock-brand-icon">AI</div>
            <span>InterviewPrep</span>
          </div>

          <Link to="/dashboard">
            ← Dashboard
          </Link>

        </header>

        <main className="mock-main">

          <div className="mock-heading">

            <p className="mock-label">
              AI MOCK INTERVIEW
            </p>

            <h1>
              Practice like it's the
              <span> real interview.</span>
            </h1>

            <p>
              Choose an interview type and let our AI interviewer
              evaluate your answers and help you improve.
            </p>

          </div>


          <div className="category-grid">

            <button
              className="category-card"
              onClick={() => handleCategoryChoice('HR')}
              disabled={loading}
            >

              <div className="category-icon purple-icon">
                👥
              </div>

              <h2>HR Interview</h2>

              <p>
                Practice common HR questions, behavioral questions
                and questions about your background.
              </p>

              <span>
                Start HR Interview →
              </span>

            </button>


            <button
              className="category-card"
              onClick={() => handleCategoryChoice('Technical')}
              disabled={loading}
            >

              <div className="category-icon blue-icon">
                💻
              </div>

              <h2>Technical Interview</h2>

              <p>
                Test your technical knowledge with questions
                based on your selected technology stack.
              </p>

              <span>
                Start Technical Interview →
              </span>

            </button>

          </div>

        </main>

      </div>
    );
  }


  /* =========================
     STACK SELECTION
  ========================= */

  if (status === 'choosing-stack') {

    const stacks = [
      'JavaScript',
      'Python',
      'Java',
      'HTML/CSS',
      'General',
    ];

    return (
      <div className="mock-page">

        <header className="mock-header">

          <div className="mock-brand">
            <div className="mock-brand-icon">AI</div>
            <span>InterviewPrep</span>
          </div>

          <Link to="/dashboard">
            ← Dashboard
          </Link>

        </header>


        <main className="mock-main stack-main">

          <div className="stack-card">

            <div className="stack-icon">
              💻
            </div>

            <p className="mock-label">
              TECHNICAL INTERVIEW
            </p>

            <h1>
              Choose your technology
            </h1>

            <p>
              Select the technology you want to be
              interviewed on.
            </p>


            <div className="stack-grid">

              {stacks.map((item) => (

                <button
                  key={item}
                  className="stack-button"
                  onClick={() => {
                    setStack(item);
                    startInterview('Technical', item);
                  }}
                  disabled={loading}
                >
                  <span>
                    {item === 'JavaScript' && '🟨'}
                    {item === 'Python' && '🐍'}
                    {item === 'Java' && '☕'}
                    {item === 'HTML/CSS' && '🌐'}
                    {item === 'General' && '💻'}
                  </span>

                  {item}
                </button>

              ))}

            </div>


            <button
              className="back-button"
              onClick={() => setStatus('not-started')}
            >
              ← Back
            </button>

          </div>

        </main>

      </div>
    );
  }


  /* =========================
     COMPLETED
  ========================= */

  if (status === 'completed') {

    return (
      <div className="mock-page">

        <header className="mock-header">

          <div className="mock-brand">
            <div className="mock-brand-icon">AI</div>
            <span>InterviewPrep</span>
          </div>

          <Link to="/dashboard">
            ← Dashboard
          </Link>

        </header>


        <main className="mock-main completed-main">

          <div className="completed-card">

            <div className="success-icon">
              ✓
            </div>

            <p className="mock-label">
              INTERVIEW COMPLETED
            </p>

            <h1>
              Great job! 🎉
            </h1>

            <p>
              You have completed your {category}
              {stack ? ` (${stack})` : ''} interview.
            </p>


            <div className="overall-score">

              <div className="score-ring">

                <div>
                  <strong>
                    {overallScore}
                  </strong>

                  <span>
                    /100
                  </span>
                </div>

              </div>

              <div className="score-text">

                <h2>
                  Overall Score
                </h2>

                <p>
                  {overallScore >= 80
                    ? 'Excellent performance! Keep it up.'
                    : overallScore >= 60
                      ? 'Good performance. Keep practicing.'
                      : 'Keep practicing and work on the feedback.'}
                </p>

              </div>

            </div>


            <div className="completed-summary">

              {history.map(renderHistoryItem)}

            </div>


            <div className="completed-actions">

              <button
                className="primary-mock-button"
                onClick={resetInterview}
              >
                Start Another Interview
              </button>

              <Link
                to="/analytics"
                className="secondary-mock-button"
              >
                View Analytics
              </Link>

            </div>

          </div>

        </main>

      </div>
    );
  }


  /* =========================
     INTERVIEW IN PROGRESS
  ========================= */

  const currentQuestionNumber = history.length + 1;

  return (
    <div className="mock-page">

      <header className="mock-header">

        <div className="mock-brand">
          <div className="mock-brand-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <Link to="/dashboard">
          Exit Interview
        </Link>

      </header>


      <main className="interview-main">

        {/* TOP INFO */}

        <div className="interview-top">

          <div>

            <p className="mock-label">
              {category.toUpperCase()} INTERVIEW
            </p>

            <h1>
              AI Mock Interview
            </h1>

          </div>

          <div className="interview-info">

            {stack && (
              <span className="info-badge">
                💻 {stack}
              </span>
            )}

            <span className="info-badge">
              Question {currentQuestionNumber} of 3
            </span>

          </div>

        </div>


        {/* PROGRESS */}

        <div className="question-progress">

          <div className="progress-label">
            <span>
              Interview Progress
            </span>

            <strong>
              {Math.round((history.length / 3) * 100)}%
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(history.length / 3) * 100}%`,
              }}
            ></div>
          </div>

        </div>


        {/* PREVIOUS ANSWERS */}

        {history.length > 0 && (

          <div className="previous-answers">

            <h2>
              Completed Questions
            </h2>

            {history.map(renderHistoryItem)}

          </div>

        )}


        {/* CURRENT QUESTION */}

        <div className="question-card">

          <div className="question-number">
            Question {currentQuestionNumber}
          </div>

          <h2>
            {currentQuestion}
          </h2>

          <div className="answer-section">

            <label>
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={7}
              disabled={loading}
            />

            <div className="answer-footer">

              <span>
                Take your time and answer clearly.
              </span>

              <button
                onClick={submitAnswer}
                disabled={loading}
                className="submit-answer-button"
              >
                {loading
                  ? 'Evaluating...'
                  : currentQuestionNumber === 3
                    ? 'Submit & Finish'
                    : 'Submit Answer →'}
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MockInterview;