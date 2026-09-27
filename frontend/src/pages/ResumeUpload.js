import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ResumeUpload.css';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setMessage('');
    setFeedback('');
    setUploaded(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setFile(null);
      setMessage('Only PDF files are allowed.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a PDF file first.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://ai-interview-platform-h3b8.onrender.com/api/auth/upload-resume',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message);
      setUploaded(true);
      setFeedback('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Resume upload failed.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setMessage('');
    setFeedback('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://ai-interview-platform-h3b8.onrender.com/api/auth/analyze-resume',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback(response.data.feedback);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Resume analysis failed.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="resume-page">

      {/* TOP BAR */}
      <header className="resume-header">

        <div className="resume-brand">
          <div className="resume-brand-icon">AI</div>
          <span>InterviewPrep</span>
        </div>

        <Link to="/dashboard" className="back-dashboard">
          ← Dashboard
        </Link>

      </header>


      {/* MAIN */}
      <main className="resume-main">

        <div className="resume-heading">

          <p className="resume-label">
            RESUME ANALYSIS
          </p>

          <h1>
            Make your resume
            <span> interview-ready.</span>
          </h1>

          <p>
            Upload your resume and let AI analyze it for strengths,
            weaknesses, and areas for improvement.
          </p>

        </div>


        <div className="resume-content">

          {/* UPLOAD CARD */}
          <section className="resume-upload-card">

            <div className="upload-icon">
              📄
            </div>

            <h2>Upload your resume</h2>

            <p className="upload-description">
              Upload your latest resume in PDF format.
            </p>

            <form onSubmit={handleUpload}>

              <label className="file-area">

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />

                <div className="file-area-icon">
                  ⬆
                </div>

                <strong>
                  {file
                    ? file.name
                    : 'Click to choose your resume'}
                </strong>

                <span>
                  PDF files only
                </span>

              </label>

              {file && (
                <div className="selected-file">
                  <span>📄</span>

                  <div>
                    <strong>{file.name}</strong>
                    <small>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="upload-button"
                disabled={uploading}
              >
                {uploading
                  ? 'Uploading...'
                  : uploaded
                    ? 'Resume Uploaded ✓'
                    : 'Upload Resume'}
              </button>

            </form>

            {message && (
              <div className="resume-message">
                {message}
              </div>
            )}

          </section>


          {/* AI ANALYSIS CARD */}
          <section className="analysis-card">

            <div className="analysis-header">

              <div className="analysis-icon">
                ✨
              </div>

              <div>
                <h2>AI Resume Review</h2>
                <p>
                  Get personalized feedback from AI.
                </p>
              </div>

            </div>


            {!feedback && !analyzing && (
              <div className="analysis-empty">

                <div className="empty-icon">
                  🤖
                </div>

                <h3>
                  Ready to analyze your resume?
                </h3>

                <p>
                  Upload your resume first, then click the
                  button below to receive your AI-powered review.
                </p>

                <button
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={!uploaded}
                >
                  ✨ Analyze Resume
                </button>

                {!uploaded && (
                  <small>
                    Upload your resume to unlock AI analysis.
                  </small>
                )}

              </div>
            )}


            {analyzing && (
              <div className="analysis-loading">

                <div className="loading-circle">
                  ✨
                </div>

                <h3>
                  Analyzing your resume...
                </h3>

                <p>
                  AI is reviewing your resume. This may take
                  a few moments.
                </p>

              </div>
            )}


            {feedback && !analyzing && (
              <div className="feedback-section">

                <div className="feedback-title">
                  <h3>AI Feedback</h3>

                  <span>
                    ✓ Analysis Complete
                  </span>
                </div>

                <div className="feedback-content">
                  {feedback}
                </div>

                <button
                  className="reanalyze-button"
                  onClick={handleAnalyze}
                >
                  ↻ Analyze Again
                </button>

              </div>
            )}

          </section>

        </div>


        {/* TIPS */}
        <section className="resume-tips">

          <h2>Tips for a stronger resume</h2>

          <div className="tips-grid">

            <div>
              <span>01</span>
              <p>
                Keep your resume concise and highlight your
                most relevant technical skills.
              </p>
            </div>

            <div>
              <span>02</span>
              <p>
                Use measurable achievements instead of only
                listing your responsibilities.
              </p>
            </div>

            <div>
              <span>03</span>
              <p>
                Make sure your projects clearly explain the
                technologies and features you implemented.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ResumeUpload;