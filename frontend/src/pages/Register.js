import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'https://ai-interview-platform-h3b8.onrender.com/api/auth/register',
        {
          name,
          email,
          password,
        }
      );

      setMessage(response.data.message);

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Section */}
      <div className="register-left">

        <div className="register-brand">
          <div className="register-brand-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <div className="register-intro">
          <h1>
            Start your<br />
            <span>interview journey.</span>
          </h1>

          <p>
            Build your confidence, improve your skills,
            and prepare for your dream job with AI-powered
            interview practice.
          </p>

          <div className="register-features">
            <div>✓ Practice HR interviews</div>
            <div>✓ Master technical questions</div>
            <div>✓ Solve coding challenges</div>
            <div>✓ Get AI-powered feedback</div>
          </div>
        </div>

      </div>

      {/* Right Section */}
      <div className="register-right">

        <div className="register-card">

          <div className="register-mobile-brand">
            <div className="register-brand-icon">AI</div>
            <span>InterviewPrep</span>
          </div>

          <h2>Create your account </h2>

          <p className="register-subtitle">
            Join the AI-powered interview preparation platform.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="register-input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="register-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="register-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          {message && (
            <div className="register-message">
              {message}
            </div>
          )}

          <p className="login-text">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;