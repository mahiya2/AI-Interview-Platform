import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          'https://ai-interview-platform-h3b8.onrender.com/api/interview/analytics',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnalytics(response.data);
      } catch (error) {
        console.log('Dashboard data could not be loaded');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <div className="sidebar-menu">

          <Link to="/dashboard" className="sidebar-link active">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/resume-upload" className="sidebar-link">
            <span>📄</span>
            Resume
          </Link>

          <Link to="/mock-interview" className="sidebar-link">
            <span>🎤</span>
            Mock Interview
          </Link>
          <Link to="/interview-history" className="sidebar-link">
            <span>🕘</span>
            Interview History
          </Link>

          <Link to="/analytics" className="sidebar-link">
            <span>📊</span>
            Analytics
          </Link>

          <Link to="/leaderboard" className="sidebar-link">
            <span>🏆</span>
            Leaderboard
          </Link>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="user-details">
              <strong>{user?.name || 'User'}</strong>
              <span>{user?.role || 'Student'}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <p className="dashboard-small-title">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>

            <p className="dashboard-subtitle">
              Ready to improve your interview skills today?
            </p>
          </div>

          <Link
            to="/mock-interview"
            className="header-interview-button"
          >
            Start Interview →
          </Link>

        </header>


        {/* STAT CARDS */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon purple">
              🎤
            </div>

            <div>
              <span>Total Interviews</span>

              <strong>
                {loading
                  ? '...'
                  : analytics?.totalInterviews || 0}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon blue">
              📈
            </div>

            <div>
              <span>Average Score</span>

              <strong>
                {loading
                  ? '...'
                  : `${analytics?.averageScore || 0}%`}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon green">
              💪
            </div>

            <div>
              <span>Strongest Area</span>

              <strong>
                {loading
                  ? '...'
                  : analytics?.strongestSkill || 'Not available'}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon orange">
              🎯
            </div>

            <div>
              <span>Focus Area</span>

              <strong>
                {loading
                  ? '...'
                  : analytics?.weakestSkill || 'Not available'}
              </strong>
            </div>
          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Quick Actions</h2>
              <p>Continue your interview preparation</p>
            </div>
          </div>


          <div className="action-grid">

            <Link
              to="/resume-upload"
              className="action-card resume-action"
            >
              <div className="action-icon">
                📄
              </div>

              <div>
                <h3>Analyze Resume</h3>

                <p>
                  Get AI-powered feedback on your resume.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>


            <Link
              to="/mock-interview"
              className="action-card interview-action"
            >
              <div className="action-icon">
                🎤
              </div>

              <div>
                <h3>Start Mock Interview</h3>

                <p>
                  Practice HR and technical interviews.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>


            <Link
              to="/analytics"
              className="action-card analytics-action"
            >
              <div className="action-icon">
                📊
              </div>

              <div>
                <h3>View Performance</h3>

                <p>
                  Track your progress and improve.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

          </div>

        </section>


        {/* BOTTOM SECTION */}
        <section className="dashboard-bottom">

          <div className="progress-card">

            <div className="progress-header">
              <div>
                <h2>Your Progress</h2>
                <p>Keep practicing to improve your score.</p>
              </div>

              <Link to="/analytics">
                View Analytics →
              </Link>
            </div>

            <div className="progress-content">

              <div className="score-circle">
                <span>
                  {analytics?.averageScore || 0}%
                </span>
              </div>

              <div className="progress-info">

                <h3>
                  {analytics?.averageScore >= 70
                    ? 'Great progress! 🎉'
                    : 'Keep practicing! 💪'}
                </h3>

                <p>
                  Your average interview score is currently{' '}
                  <strong>
                    {analytics?.averageScore || 0}%
                  </strong>.
                  Continue practicing mock interviews to improve.
                </p>

              </div>

            </div>

          </div>


          <div className="leaderboard-card">

            <div className="leaderboard-icon">
              🏆
            </div>

            <h2>Challenge Yourself</h2>

            <p>
              See how your interview performance compares
              with other candidates.
            </p>

            <Link to="/leaderboard">
              View Leaderboard →
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;