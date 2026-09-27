import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import './AnalyticsDashboard.css';

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          'http://https://ai-interview-platform-h3b8.onrender.com/api/interview/analytics',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnalytics(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load analytics'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Keep Practicing';
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div className="analytics-loading-icon">📊</div>
          <h2>Loading your analytics...</h2>
          <p>Preparing your performance overview.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          <div>⚠️</div>
          <h2>Unable to load analytics</h2>
          <p>{error}</p>
          <Link to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalInterviews === 0) {
    return (
      <div className="analytics-page">

        <header className="analytics-header">
          <div className="analytics-brand">
            <div className="analytics-brand-icon">AI</div>
            <span>InterviewPrep</span>
          </div>

          <Link to="/dashboard">
            ← Dashboard
          </Link>
        </header>

        <main className="analytics-main">

          <div className="analytics-empty">

            <div className="analytics-empty-icon">
              📊
            </div>

            <p className="analytics-label">
              PERFORMANCE ANALYTICS
            </p>

            <h1>
              Your progress starts here.
            </h1>

            <p>
              Complete your first mock interview to see your
              scores, strengths, weaknesses and progress over time.
            </p>

            <Link
              to="/mock-interview"
              className="start-analytics-button"
            >
              Start Mock Interview →
            </Link>

          </div>

        </main>
      </div>
    );
  }

  const progressChartData =
    analytics.progressOverTime.map((point, index) => ({
      name: `${formatDateShort(point.date)} (${point.category})`,
      score: point.score,
      interview: index + 1,
    }));

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <header className="analytics-header">

        <div className="analytics-brand">
          <div className="analytics-brand-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <Link to="/dashboard">
          ← Dashboard
        </Link>

      </header>


      {/* MAIN */}

      <main className="analytics-main">

        {/* HEADING */}

        <div className="analytics-heading">

          <div>

            <p className="analytics-label">
              PERFORMANCE ANALYTICS
            </p>

            <h1>
              Track your progress.
            </h1>

            <p>
              Understand your interview performance and identify
              the areas where you can improve.
            </p>

          </div>

          <Link
            to="/mock-interview"
            className="analytics-new-button"
          >
            + Practice Interview
          </Link>

        </div>


        {/* TOP STATS */}

        <div className="analytics-stats">

          <div className="analytics-stat-card">

            <div className="stat-icon purple">
              🎤
            </div>

            <div>
              <span>Total Interviews</span>
              <strong>
                {analytics.totalInterviews}
              </strong>
            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="stat-icon blue">
              🎯
            </div>

            <div>
              <span>Average Score</span>
              <strong>
                {analytics.averageScore}%
              </strong>
            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="stat-icon green">
              💪
            </div>

            <div>
              <span>Strongest Area</span>
              <strong className="skill-stat">
                {analytics.strongestSkill || '—'}
              </strong>
            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="stat-icon orange">
              📌
            </div>

            <div>
              <span>Needs Improvement</span>
              <strong className="skill-stat weak-skill">
                {analytics.weakestSkill || '—'}
              </strong>
            </div>

          </div>

        </div>


        {/* PERFORMANCE OVERVIEW */}

        <section className="overview-card">

          <div className="overview-left">

            <p>Overall Performance</p>

            <div className="big-score">
              {analytics.averageScore}
              <span>/100</span>
            </div>

            <div className="score-status">
              {getScoreMessage(analytics.averageScore)}
            </div>

            <p className="overview-description">
              Your average score across all completed mock
              interviews.
            </p>

          </div>


          <div className="overview-right">

            <div className="mini-progress-label">
              <span>Performance</span>
              <strong>
                {analytics.averageScore}%
              </strong>
            </div>

            <div className="mini-progress-track">
              <div
                className="mini-progress-fill"
                style={{
                  width: `${analytics.averageScore}%`,
                }}
              ></div>
            </div>

            <div className="performance-scale">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>

          </div>

        </section>


        {/* CHARTS */}

        <div className="charts-grid">

          {/* SKILLS */}

          <section className="chart-card">

            <div className="chart-heading">

              <div>
                <h2>Skills Performance</h2>
                <p>
                  Average score by technology or category.
                </p>
              </div>

              <span>Average</span>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart
                  data={analytics.skillsBreakdown}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="skill"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="averageScore"
                    fill="#7040df"
                    radius={[6, 6, 0, 0]}
                    name="Average Score"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </section>


          {/* PROGRESS */}

          <section className="chart-card">

            <div className="chart-heading">

              <div>
                <h2>Progress Over Time</h2>
                <p>
                  Your interview scores over time.
                </p>
              </div>

              <span>Score</span>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart
                  data={progressChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7040df"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: '#7040df',
                    }}
                    activeDot={{
                      r: 7,
                    }}
                    name="Interview Score"
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </section>

        </div>


        {/* SKILL BREAKDOWN */}

        <section className="skill-breakdown-card">

          <div className="breakdown-heading">

            <div>
              <h2>Skill Breakdown</h2>
              <p>
                A detailed look at your interview performance.
              </p>
            </div>

          </div>


          <div className="skill-list">

            {analytics.skillsBreakdown.map((skill) => (

              <div
                className="skill-row"
                key={skill.skill}
              >

                <div className="skill-info">

                  <strong>
                    {skill.skill}
                  </strong>

                  <span>
                    {skill.interviewsCount}{' '}
                    {skill.interviewsCount === 1
                      ? 'interview'
                      : 'interviews'}
                  </span>

                </div>


                <div className="skill-progress">

                  <div className="skill-progress-track">

                    <div
                      className="skill-progress-fill"
                      style={{
                        width: `${skill.averageScore}%`,
                      }}
                    ></div>

                  </div>

                  <strong>
                    {skill.averageScore}%
                  </strong>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* BOTTOM ACTION */}

        <div className="analytics-bottom">

          <div>

            <h2>
              Ready to improve your score?
            </h2>

            <p>
              Practice another interview and watch your
              progress grow.
            </p>

          </div>

          <Link
            to="/mock-interview"
            className="analytics-practice-button"
          >
            Practice Again →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default AnalyticsDashboard;