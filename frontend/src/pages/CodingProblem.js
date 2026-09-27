import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './CodingProblem.css';
function CodingProblem() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [executionResult, setExecutionResult] = useState('');
const [language, setLanguage] = useState('java');

const [code, setCode] = useState(
  `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`
);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `http://https://ai-interview-platform-h3b8.onrender.com/api/coding/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuestion(response.data.question);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load coding problem'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const getStarterCode = (selectedLanguage) => {
    if (selectedLanguage === 'python') {
      return '# Write your solution here\n\n';
    }

    if (selectedLanguage === 'java') {
      return `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`;
    }

    return '// Write your solution here\n\n';
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);
    setCode(getStarterCode(selectedLanguage));
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

 const handleRun = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      'http://https://ai-interview-platform-h3b8.onrender.com/api/coding/execute',
      {
        script: code,
        language: language,
        versionIndex: '0',
        stdin: '',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Execution result:', response.data);
setExecutionResult(
  response.data.result?.output || 'Code executed successfully'
);
  } catch (err) {
    console.error('Execution error:', err);
   setExecutionResult(
  err.response?.data?.message || 'Code execution failed'
);
  }
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      'http://https://ai-interview-platform-h3b8.onrender.com/api/coding/submit',
      {
        questionId: id,
        script: code,
        language: language,
        versionIndex: '0',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;

    if (result.passed) {
      setExecutionResult(
        `✅ All test cases passed!\n\nPassed: ${result.passedTestCases}/${result.totalTestCases}`
      );
    } else {
      const failedTest = result.results.find(
        (test) => !test.passed
      );

     setExecutionResult(
  `❌ Test case failed.\n\nPassed: ${result.passedTestCases}/${result.totalTestCases}\n\nYour Output: ${failedTest?.actualOutput || 'No output'}`
);
    }
  } catch (err) {
    console.error('Submission error:', err);

    setExecutionResult(
      err.response?.data?.message ||
        'Code submission failed'
    );
  }
};

  if (loading) {
    return (
      <div className="coding-problem-page">
        <p>Loading problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coding-problem-page">
        <h2>Unable to load problem</h2>
        <p>{error}</p>

        <Link to="/coding">
          ← Back to Coding Problems
        </Link>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="coding-problem-page">
        <p>Problem not found.</p>

        <Link to="/coding">
          ← Back to Coding Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="coding-problem-page">

      {/* Back */}

      <Link
        to="/coding"
        className="back-to-coding"
      >
        ← Back to Coding Problems
      </Link>


      {/* Main Coding Layout */}

      <div className="coding-workspace">

        {/* LEFT SIDE - PROBLEM */}

        <div className="problem-panel">

          <div className="problem-header">

            <span
              className={`problem-difficulty ${
                question.difficulty?.toLowerCase()
              }`}
            >
              {question.difficulty || 'Medium'}
            </span>

            <h1>{question.title}</h1>

          </div>


          {/* Description */}

          <section className="problem-section">

            <h2>Problem Description</h2>

            <p className="problem-description">
              {question.description}
            </p>

          </section>


          {/* Examples */}

          {question.examples &&
            question.examples.length > 0 && (

              <section className="problem-section">

                <h2>Examples</h2>

                {question.examples.map(
                  (example, index) => (

                    <div
                      className="example-card"
                      key={index}
                    >

                      <h3>
                        Example {index + 1}
                      </h3>

                      <div className="example-row">

                        <strong>Input</strong>

                        <pre>
                          {example.input}
                        </pre>

                      </div>

                      <div className="example-row">

                        <strong>Output</strong>

                        <pre>
                          {example.output}
                        </pre>

                      </div>

                    </div>

                  )
                )}

              </section>

            )}


          {/* Constraints */}

          {question.constraints && (

            <section className="problem-section">

              <h2>Constraints</h2>

              <div className="constraints-box">

                <pre>
                  {question.constraints}
                </pre>

              </div>

            </section>

          )}

        </div>


        {/* RIGHT SIDE - EDITOR */}

        <div className="editor-panel">

          {/* Editor Header */}

          <div className="editor-toolbar">

            <div>

              <h2>Code Editor</h2>

              <span>
                Choose your programming language
              </span>

            </div>


            <select
              value={language}
              onChange={handleLanguageChange}
            >

              <option value="javascript">
                JavaScript
              </option>

              <option value="python">
                Python
              </option>

              <option value="java">
                Java
              </option>

            </select>

          </div>


          {/* Monaco Editor */}

          <div className="monaco-container">

            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: {
                  enabled: false,
                },
                fontSize: 14,
                automaticLayout: true,
                wordWrap: 'on',
                padding: {
                  top: 15,
                },
              }}
            />

          </div>


          {/* Editor Footer */}

          <div className="editor-footer">

            <button
              className="run-code-button"
              onClick={handleRun}
            >
              ▶ Run Code
            </button>

            <button
              className="submit-code-button"
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>


          {/* Result Placeholder */}

  <div className="execution-result">
  <h3>Execution Result</h3>

  {executionResult ? (
    <pre>{executionResult}</pre>
  ) : (
    <p>Run your code to see the output here.</p>
  )}
</div>

        </div>

      </div>

    </div>
  );
}

export default CodingProblem;