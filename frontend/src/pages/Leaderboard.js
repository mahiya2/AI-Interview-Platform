import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          'http://localhost:5000/api/leaderboard',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLeaderboard(response.data.leaderboard);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load leaderboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-loading">
          <div>🏆</div>
          <h2>Loading leaderboard...</h2>
          <p>Finding the top performers.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-error">
          <div>⚠️</div>
          <h2>Unable to load leaderboard</h2>
          <p>{error}</p>
          <Link to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="leaderboard-page">

      {/* HEADER */}

      <header className="leaderboard-header">

        <div className="leaderboard-brand">
          <div className="leaderboard-brand-icon">
            AI
          </div>
          <span>InterviewPrep</span>
        </div>

        <Link to="/dashboard">
          ← Dashboard
        </Link>

      </header>


      {/* MAIN */}

      <main className="leaderboard-main">

        {/* HEADING */}

        <div className="leaderboard-heading">

          <div>

            <p className="leaderboard-label">
              GLOBAL RANKING
            </p>

            <h1>
              Interview Champions 🏆
            </h1>

            <p>
              See how your interview performance compares
              with other candidates.
            </p>

          </div>

          <Link
            to="/mock-interview"
            className="leaderboard-practice-button"
          >
            Practice Interview →
          </Link>

        </div>


        {/* EMPTY STATE */}

        {leaderboard.length === 0 ? (

          <div className="leaderboard-empty">

            <div className="leaderboard-empty-icon">
              🏆
            </div>

            <h2>
              No rankings yet
            </h2>

            <p>
              Complete a mock interview to become the
              first person on the leaderboard.
            </p>

            <Link
              to="/mock-interview"
              className="leaderboard-start-button"
            >
              Start Mock Interview →
            </Link>

          </div>

        ) : (

          <>

            {/* TOP THREE */}

            <section className="podium-section">

              <div className="podium-heading">
                <h2>Top Performers</h2>
                <p>
                  The highest average interview scores.
                </p>
              </div>


              <div className="podium">

                {/* SECOND */}

                {topThree[1] && (
                  <div className="podium-place second">

                    <div className="podium-avatar">
                      {topThree[1].name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="podium-medal">
                      🥈
                    </div>

                    <h3>
                      {topThree[1].name}
                    </h3>

                    <strong>
                      {topThree[1].averageScore}
                    </strong>

                    <span>
                      Average Score
                    </span>

                    <div className="podium-block">
                      #2
                    </div>

                  </div>
                )}


                {/* FIRST */}

                {topThree[0] && (
                  <div className="podium-place first">

                    <div className="crown">
                      👑
                    </div>

                    <div className="podium-avatar">
                      {topThree[0].name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="podium-medal">
                      🥇
                    </div>

                    <h3>
                      {topThree[0].name}
                    </h3>

                    <strong>
                      {topThree[0].averageScore}
                    </strong>

                    <span>
                      Average Score
                    </span>

                    <div className="podium-block">
                      #1
                    </div>

                  </div>
                )}


                {/* THIRD */}

                {topThree[2] && (
                  <div className="podium-place third">

                    <div className="podium-avatar">
                      {topThree[2].name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="podium-medal">
                      🥉
                    </div>

                    <h3>
                      {topThree[2].name}
                    </h3>

                    <strong>
                      {topThree[2].averageScore}
                    </strong>

                    <span>
                      Average Score
                    </span>

                    <div className="podium-block">
                      #3
                    </div>

                  </div>
                )}

              </div>

            </section>


            {/* FULL RANKING */}

            <section className="ranking-section">

              <div className="ranking-heading">

                <div>
                  <h2>All Rankings</h2>
                  <p>
                    Top 20 candidates based on average score.
                  </p>
                </div>

                <span>
                  {leaderboard.length} Candidates
                </span>

              </div>


              <div className="ranking-table">

                <div className="ranking-table-header">

                  <span>Rank</span>
                  <span>Candidate</span>
                  <span>Average Score</span>
                  <span>Interviews</span>

                </div>


                {leaderboard.map((entry) => (

                  <div
                    className={`ranking-row ${
                      getRankClass(entry.rank)
                    }`}
                    key={entry.rank}
                  >

                    <div className="ranking-number">
                      {getMedal(entry.rank)}
                    </div>


                    <div className="candidate-info">

                      <div className="candidate-avatar">
                        {entry.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <strong>
                        {entry.name}
                      </strong>

                    </div>


                    <div className="candidate-score">

                      <strong>
                        {entry.averageScore}%
                      </strong>

                      <div className="score-bar">
                        <div
                          style={{
                            width: `${entry.averageScore}%`,
                          }}
                        ></div>
                      </div>

                    </div>


                    <div className="interview-count">
                      {entry.interviewsCompleted}
                      <span>
                        {entry.interviewsCompleted === 1
                          ? ' interview'
                          : ' interviews'}
                      </span>
                    </div>

                  </div>

                ))}

              </div>

            </section>


            {/* BOTTOM CTA */}

            <div className="leaderboard-bottom">

              <div>

                <h2>
                  Want to climb the leaderboard?
                </h2>

                <p>
                  Keep practicing and improve your average score.
                </p>

              </div>

              <Link
                to="/mock-interview"
                className="leaderboard-cta-button"
              >
                Take Another Interview →
              </Link>

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default Leaderboard;