import React, { useState } from 'react';
import './App.css';
import JobForm from './components/JobForm';
import ResumeUpload from './components/ResumeUpload';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobId, setJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState({ title: '', description: '' });
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJobSubmit = (id, details) => {
    setJobId(id);
    setJobDetails(details);
    setCurrentStep(2);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setCurrentStep(3);
    setLoading(false);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setJobId(null);
    setJobDetails({ title: '', description: '' });
    setAnalysisResults(null);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>AI Resume Screening System</h1>
        <p>Get AI-powered insights on how your resume matches job requirements</p>
      </header>

      <main>
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className="progress-tracker">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Enter Job Details</div>
          </div>
          <div className="connector"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Upload Resume</div>
          </div>
          <div className="connector"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">View Results</div>
          </div>
        </div>

        <div className="content-container">
          {currentStep === 1 && (
            <JobForm onJobSubmit={handleJobSubmit} onError={handleError} />
          )}

          {currentStep === 2 && (
            <ResumeUpload 
              jobId={jobId} 
              jobDetails={jobDetails}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
              setLoading={setLoading}
            />
          )}

          {currentStep === 3 && analysisResults && (
            <ResultsDisplay 
              results={analysisResults} 
              jobDetails={jobDetails}
              onRestart={handleRestart}
            />
          )}

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Analyzing resume with AI...</p>
            </div>
          )}
        </div>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Resume Screening System</p>
      </footer>
    </div>
  );
}

export default App;