import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CodingQuestions.css';
function CodingQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          'http://localhost:5000/api/coding/all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuestions(response.data.questions);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load coding questions'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions =
    filter === 'All'
      ? questions
      : questions.filter(
          (question) =>
            question.difficulty?.toLowerCase() === filter.toLowerCase()
        );

  const getDifficultyClass = (difficulty) => {
    if (difficulty === 'Easy') return 'easy';
    if (difficulty === 'Hard') return 'hard';
    return 'medium';
  };

  if (loading) {
    return (
      <div className="coding-page">
        <div className="coding-loading">
          Loading coding questions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coding-page">
        <div className="coding-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="coding-page">

      {/* Header */}
      <div className="coding-header">
        <div>
          <p className="coding-label">CODING PRACTICE</p>

          <h1>Sharpen Your Coding Skills 💻</h1>

          <p>
            Solve coding problems and prepare for technical interviews.
          </p>
        </div>

        <div className="coding-count">
          <span>{questions.length}</span>
          <small>Problems</small>
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="difficulty-filters">

        {['All', 'Easy', 'Medium', 'Hard'].map((level) => (
          <button
            key={level}
            className={filter === level ? 'filter-active' : ''}
            onClick={() => setFilter(level)}
          >
            {level}
          </button>
        ))}

      </div>

      {/* Questions */}
      {filteredQuestions.length === 0 ? (
        <div className="empty-coding">
          <h3>No coding questions found</h3>
          <p>
            There are no questions available for this difficulty level yet.
          </p>
        </div>
      ) : (
        <div className="coding-grid">

          {filteredQuestions.map((question) => (

            <div className="coding-card" key={question._id}>

              <div className="coding-card-top">

                <span className="coding-icon">
                  &lt;/&gt;
                </span>

                <span
                  className={`difficulty-badge ${getDifficultyClass(
                    question.difficulty
                  )}`}
                >
                  {question.difficulty || 'Medium'}
                </span>

              </div>

              <h2>{question.title}</h2>

              <p className="coding-description">
                {question.description}
              </p>

              {question.constraints && (
                <div className="constraints-preview">
                  <strong>Constraints:</strong>
                  <p>{question.constraints}</p>
                </div>
              )}

              <button
                className="solve-button"
                onClick={() =>
                  navigate(`/coding/${question._id}`)
                }
              >
                Solve Problem →
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default CodingQuestions;