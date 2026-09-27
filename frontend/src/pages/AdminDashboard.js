import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [statsResponse, usersResponse] = await Promise.all([
          axios.get(
            'http://https://ai-interview-platform-h3b8.onrender.com/api/admin/stats',
            config
          ),
          axios.get(
            'http://https://ai-interview-platform-h3b8.onrender.com/api/admin/users',
            config
          ),
        ]);

        setStats(statsResponse.data);
        setUsers(usersResponse.data.users);

      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }

        if (err.response?.status === 403) {
          setError('You do not have permission to access the Admin Dashboard.');
          return;
        }

        setError(
          err.response?.data?.message ||
          'Failed to load admin dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-loading-icon">👑</div>
          <h2>Loading Admin Dashboard...</h2>
          <p>Preparing platform statistics.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          <div className="admin-error-icon">⚠️</div>
          <h2>Unable to access Admin Dashboard</h2>
          <p>{error}</p>

          <Link to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">
            AI
          </div>

          <span>InterviewPrep</span>
        </div>


        <div className="admin-panel-title">
          ADMIN PANEL
        </div>


        <nav className="admin-menu">

          <Link
            to="/admin"
            className="admin-nav-link active"
          >
            <span>📊</span>
            Dashboard
          </Link>


          <Link
            to="/coding"
            className="admin-nav-link"
          >
            <span>💻</span>
            Coding Questions
          </Link>


          <Link
            to="/dashboard"
            className="admin-nav-link"
          >
            <span>🎓</span>
            Student View
          </Link>

        </nav>


        <div className="admin-sidebar-bottom">

          <div className="admin-user">

            <div className="admin-avatar">
              👑
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>

          </div>


          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <p className="admin-label">
              ADMIN DASHBOARD
            </p>

            <h1>
              Platform Overview 👋
            </h1>

            <p className="admin-subtitle">
              Monitor users, interviews and coding content.
            </p>

          </div>

          <div className="admin-status">
            <span></span>
            System Active
          </div>

        </header>


        {/* STAT CARDS */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon purple">
              👥
            </div>

            <div>
              <span>Total Users</span>

              <strong>
                {stats?.users?.total || 0}
              </strong>

              <small>
                {stats?.users?.students || 0} students
              </small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon blue">
              🎤
            </div>

            <div>
              <span>Total Interviews</span>

              <strong>
                {stats?.interviews?.total || 0}
              </strong>

              <small>
                {stats?.interviews?.completed || 0} completed
              </small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon green">
              💻
            </div>

            <div>
              <span>Coding Questions</span>

              <strong>
                {stats?.codingQuestions?.total || 0}
              </strong>

              <small>
                Practice problems
              </small>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon orange">
              ❓
            </div>

            <div>
              <span>Interview Questions</span>

              <strong>
                {stats?.interviewQuestions || 0}
              </strong>

              <small>
                Question bank
              </small>
            </div>

          </div>

        </section>


        {/* OVERVIEW CARDS */}

        <section className="admin-overview-grid">

          {/* USERS */}

          <div className="admin-overview-card">

            <div className="admin-card-heading">

              <div>
                <h2>User Overview</h2>
                <p>Registered platform users</p>
              </div>

              <span>👥</span>

            </div>


            <div className="overview-numbers">

              <div>
                <strong>
                  {stats?.users?.students || 0}
                </strong>

                <span>Students</span>
              </div>


              <div>
                <strong>
                  {stats?.users?.admins || 0}
                </strong>

                <span>Admins</span>
              </div>


              <div>
                <strong>
                  {stats?.users?.total || 0}
                </strong>

                <span>Total</span>
              </div>

            </div>

          </div>


          {/* CODING */}

          <div className="admin-overview-card">

            <div className="admin-card-heading">

              <div>
                <h2>Coding Questions</h2>
                <p>Questions by difficulty</p>
              </div>

              <span>💻</span>

            </div>


            <div className="difficulty-overview">

              <div className="difficulty-row">

                <div>
                  <span className="difficulty-dot easy-dot"></span>
                  Easy
                </div>

                <strong>
                  {stats?.codingQuestions?.easy || 0}
                </strong>

              </div>


              <div className="difficulty-row">

                <div>
                  <span className="difficulty-dot medium-dot"></span>
                  Medium
                </div>

                <strong>
                  {stats?.codingQuestions?.medium || 0}
                </strong>

              </div>


              <div className="difficulty-row">

                <div>
                  <span className="difficulty-dot hard-dot"></span>
                  Hard
                </div>

                <strong>
                  {stats?.codingQuestions?.hard || 0}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* USERS TABLE */}

        <section className="admin-users-card">

          <div className="admin-users-header">

            <div>
              <p className="admin-label">
                USER MANAGEMENT
              </p>

              <h2>
                Registered Users
              </h2>

              <p>
                View all users registered on the platform.
              </p>
            </div>

            <span className="user-count">
              {users.length} Users
            </span>

          </div>


          <div className="admin-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>

                    <td>

                      <div className="table-user">

                        <div className="table-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase() || 'U'}
                        </div>

                        <strong>
                          {user.name}
                        </strong>

                      </div>

                    </td>


                    <td>
                      {user.email}
                    </td>


                    <td>

                      <span
                        className={`role-badge ${
                          user.role === 'admin'
                            ? 'admin-role'
                            : 'student-role'
                        }`}
                      >
                        {user.role === 'admin'
                          ? '👑 Admin'
                          : '🎓 Student'}
                      </span>

                    </td>


                    <td>
                      {formatDate(user.createdAt)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* BOTTOM INFORMATION */}

        <section className="admin-bottom-grid">

          <div className="admin-info-card">

            <div className="info-icon">
              🎤
            </div>

            <div>

              <h3>
                Interview Activity
              </h3>

              <p>
                {stats?.interviews?.completed || 0}
                {' '}of{' '}
                {stats?.interviews?.total || 0}
                {' '}interviews have been completed.
              </p>

            </div>

          </div>


          <div className="admin-info-card">

            <div className="info-icon">
              💻
            </div>

            <div>

              <h3>
                Coding Practice
              </h3>

              <p>
                {stats?.codingQuestions?.total || 0}
                {' '}coding problems are currently
                available for students.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;