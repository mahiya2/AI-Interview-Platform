import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'https://ai-interview-platform-h3b8.onrender.com/api/auth/login',
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left Section */}
      <div className="login-left">

        <div className="brand">
          <div className="brand-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <div className="login-intro">
          <h1>
            Prepare smarter.<br />
            <span>Interview better.</span>
          </h1>

          <p>
            Practice HR, technical and coding interviews
            with personalized AI feedback.
          </p>

          <div className="feature-list">
            <div>✓ AI-powered interview practice</div>
            <div>✓ Resume analysis</div>
            <div>✓ Personalized feedback</div>
            <div>✓ Track your progress</div>
          </div>
        </div>

      </div>

      {/* Right Section */}
      <div className="login-right">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-icon">AI</div>
            <span>InterviewPrep</span>
          </div>

          <h2>Welcome back 👋</h2>

          <p className="login-subtitle">
            Sign in to continue your interview preparation.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          <p className="register-text">
            Don't have an account?{' '}
            <Link to="/register">Create an account</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;