import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">AI</span>
          <span>InterviewPrep</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/register" className="nav-register">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">
          <div className="hero-badge">
            ✨ AI-Powered Interview Preparation
          </div>

          <h1>
            Practice Smarter.
            <br />
            <span>Interview Better.</span>
          </h1>

          <p>
            Prepare for your dream job with AI-powered mock interviews,
            resume analysis, coding practice, and personalized feedback.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started →
            </Link>

            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>AI</strong>
              <span>Powered</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Practice</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Personalized</span>
            </div>
          </div>
        </div>

        {/* AI Illustration */}
        <div className="hero-visual">
          <div className="ai-circle">
            <div className="robot-face">
              <div className="robot-eyes">
                <span></span>
                <span></span>
              </div>

              <div className="robot-mouth"></div>
            </div>
          </div>

          <div className="floating-card card-one">
            🎯 <span>AI Feedback</span>
          </div>

          <div className="floating-card card-two">
            📄 <span>Resume Analysis</span>
          </div>

          <div className="floating-card card-three">
            📊 <span>Performance</span>
          </div>
        </div>

      </section>

      {/* Features */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <p>POWERFUL FEATURES</p>
          <h2>Everything you need to prepare</h2>
          <span>
            Practice, analyze and improve your interview skills in one place.
          </span>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Mock Interviews</h3>
            <p>
              Practice HR and technical interviews with AI-generated questions
              and personalized feedback.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Resume Analysis</h3>
            <p>
              Upload your resume and receive AI-powered suggestions to improve
              your profile.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Coding Practice</h3>
            <p>
              Solve coding problems and prepare for technical coding rounds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Performance Analytics</h3>
            <p>
              Track your interview scores, strengths, weaknesses and progress
              over time.
            </p>
          </div>

        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">

        <div>
          <p className="section-label">WHY THIS PLATFORM?</p>

          <h2>
            Turn every practice session
            <br />
            into interview confidence.
          </h2>

          <p>
            Our platform combines AI evaluation, resume analysis, interview
            history and performance analytics to help students continuously
            improve their interview preparation.
          </p>

          <Link to="/register" className="primary-button">
            Start Practicing →
          </Link>
        </div>

        <div className="about-box">
          <div>🧠</div>
          <h3>Learn from every interview</h3>
          <p>
            Get personalized feedback and identify the areas you need to
            improve.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          <span className="logo-icon">AI</span>
          <span>InterviewPrep</span>
        </div>

        <p>© 2026 AI Interview Preparation Platform</p>
      </footer>

    </div>
  );
}

export default Home;