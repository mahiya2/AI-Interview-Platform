import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './InterviewHistory.css';

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          'http://https://ai-interview-platform-h3b8.onrender.com/api/interview/history',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInterviews(response.data.interviews);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load interview history'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-needs-work';
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">
          <div className="history-loader">⏳</div>
          <h2>Loading your interview history...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="history-error">
          <div>⚠️</div>
          <h2>Unable to load history</h2>
          <p>{error}</p>
          <Link to="/dashboard">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">

      {/* HEADER */}
      <header className="history-header">

        <div className="history-brand">
          <div className="history-brand-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <Link to="/dashboard" className="history-dashboard-link">
          ← Dashboard
        </Link>

      </header>


      {/* MAIN */}
      <main className="history-main">

        <div className="history-heading">

          <div>
            <p className="history-label">
              INTERVIEW HISTORY
            </p>

            <h1>Your practice journey</h1>

            <p>
              Review your previous interviews, answers and
              AI feedback to understand how you're improving.
            </p>
          </div>

          <Link
            to="/mock-interview"
            className="new-interview-button"
          >
            + New Interview
          </Link>

        </div>


        {/* SUMMARY */}
        <div className="history-summary">

          <div className="history-stat">
            <div className="history-stat-icon purple">
              🎤
            </div>

            <div>
              <span>Total Interviews</span>
              <strong>{interviews.length}</strong>
            </div>
          </div>


          <div className="history-stat">
            <div className="history-stat-icon blue">
              ✅
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {
                  interviews.filter(
                    (interview) =>
                      interview.status === 'completed'
                  ).length
                }
              </strong>
            </div>
          </div>


          <div className="history-stat">
            <div className="history-stat-icon green">
              📈
            </div>

            <div>
              <span>Average Score</span>

              <strong>
                {
                  interviews.length > 0
                    ? Math.round(
                        interviews.reduce(
                          (sum, interview) =>
                            sum + (interview.overallScore || 0),
                          0
                        ) / interviews.length
                      )
                    : 0
                }%
              </strong>
            </div>
          </div>

        </div>


        {/* EMPTY STATE */}
        {interviews.length === 0 ? (

          <div className="history-empty">

            <div className="history-empty-icon">
              🎤
            </div>

            <h2>No interviews yet</h2>

            <p>
              Complete your first mock interview and
              your results will appear here.
            </p>

            <Link
              to="/mock-interview"
              className="start-history-button"
            >
              Start Your First Interview →
            </Link>

          </div>

        ) : (

          <section className="history-list">

            <div className="history-list-header">

              <div>
                <h2>Previous Interviews</h2>
                <p>
                  Click an interview to view the complete
                  question and feedback breakdown.
                </p>
              </div>

              <span>
                {interviews.length}{' '}
                {interviews.length === 1
                  ? 'Interview'
                  : 'Interviews'}
              </span>

            </div>


            {interviews.map((interview, interviewIndex) => (

              <div
                className={`history-card ${
                  expandedId === interview._id
                    ? 'history-card-expanded'
                    : ''
                }`}
                key={interview._id}
              >

                {/* CARD HEADER */}
                <button
                  className="history-card-header"
                  onClick={() =>
                    toggleExpand(interview._id)
                  }
                >

                  <div className="history-card-left">

                    <div className="history-number">
                      {interviewIndex + 1}
                    </div>

                    <div>

                      <div className="history-title-row">

                        <h3>
                          {interview.category} Interview
                        </h3>

                        <span className="status-badge">
                          {interview.status === 'completed'
                            ? '✓ Completed'
                            : 'In Progress'}
                        </span>

                      </div>

                      <div className="history-meta">

                        {interview.stack && (
                          <span>
                            💻 {interview.stack}
                          </span>
                        )}

                        <span>
                          📅 {formatDate(interview.createdAt)}
                        </span>

                        <span>
                          ❓ {interview.questions.length} Questions
                        </span>

                      </div>

                    </div>

                  </div>


                  <div className="history-card-right">

                    <div
                      className={`history-score ${
                        getScoreClass(
                          interview.overallScore || 0
                        )
                      }`}
                    >
                      <span>Score</span>
                      <strong>
                        {interview.status === 'completed'
                          ? `${interview.overallScore}/100`
                          : '—'}
                      </strong>
                    </div>

                    <span className="expand-icon">
                      {expandedId === interview._id
                        ? '▲'
                        : '▼'}
                    </span>

                  </div>

                </button>


                {/* EXPANDED CONTENT */}
                {expandedId === interview._id && (

                  <div className="history-details">

                    <div className="details-divider"></div>

                    <div className="details-heading">
                      <h2>Interview Breakdown</h2>
                      <p>
                        Review each question, your answer
                        and the AI evaluation.
                      </p>
                    </div>


                    {interview.questions.map(
                      (question, index) => (

                        <div
                          className="question-history-card"
                          key={question._id || index}
                        >

                          <div className="question-history-header">

                            <span>
                              Question {index + 1}
                            </span>

                            <strong
                              className={getScoreClass(
                                question.score || 0
                              )}
                            >
                              {question.answerText
                                ? `${question.score}/100`
                                : 'Not answered'}
                            </strong>

                          </div>


                          <h3>
                            {question.questionText}
                          </h3>


                          {question.answerText ? (

                            <>

                              <div className="history-answer">

                                <div className="detail-label">
                                  Your Answer
                                </div>

                                <p>
                                  {question.answerText}
                                </p>

                              </div>


                              <div className="history-feedback">

                                <div className="detail-label">
                                  ✨ AI Feedback
                                </div>

                                <p>
                                  {question.feedback}
                                </p>

                              </div>

                            </>

                          ) : (

                            <div className="not-answered">
                              This question was not answered.
                            </div>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            ))}

          </section>

        )}

      </main>

    </div>
  );
}

export default InterviewHistory;