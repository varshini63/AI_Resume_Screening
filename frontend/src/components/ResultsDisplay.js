import React from 'react';

const ResultsDisplay = ({ results, jobDetails, onRestart }) => {
  const { 
    score, 
    summary, 
    strengths, 
    gaps, 
    extracted_info: extractedInfo 
  } = results;

  // Function to render the score gauge
  const renderScoreGauge = () => {
    let scoreColor = '#EA4335'; // Red for low scores
    
    if (score >= 80) {
      scoreColor = '#34A853'; // Green for high scores
    } else if (score >= 60) {
      scoreColor = '#FBBC05'; // Yellow for medium scores
    }
    
    return (
      <div className="score-gauge">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* Background circle */}
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="15"
          />
          
          {/* Score circle */}
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="none"
            stroke={scoreColor}
            strokeWidth="15"
            strokeDasharray={`${(score / 100) * 377} 377`}
            transform="rotate(-90 75 75)"
          />
          
          {/* Score text */}
          <text
            x="75"
            y="75"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="30"
            fontWeight="bold"
            fill={scoreColor}
          >
            {score}
          </text>
          
          <text
            x="75"
            y="95"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="12"
            fill="#757575"
          >
            out of 100
          </text>
        </svg>
      </div>
    );
  };

  // Function to determine match level text and color
  const getMatchLevel = (score) => {
    if (score >= 80) {
      return { text: 'Strong Match', color: '#34A853' };
    } else if (score >= 60) {
      return { text: 'Good Match', color: '#FBBC05' };
    } else if (score >= 40) {
      return { text: 'Fair Match', color: '#FF9800' };
    } else {
      return { text: 'Poor Match', color: '#EA4335' };
    }
  };

  const matchLevel = getMatchLevel(score);

  return (
    <div className="results-display">
      <h2>Resume Analysis Results</h2>
      
      <div className="results-header">
        <div className="score-container">
          {renderScoreGauge()}
          <div className="match-level" style={{ color: matchLevel.color }}>
            {matchLevel.text}
          </div>
        </div>
        
        <div className="job-details">
          <h3>Job: {jobDetails.title}</h3>
          <div className="analysis-summary">
            <p>{summary}</p>
          </div>
        </div>
      </div>
      
      <div className="results-grid">
        <div className="result-section strengths-section">
          <h3>Key Strengths</h3>
          <ul className="strengths-list">
            {strengths && strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <li key={`strength-${index}`}>
                  <i className="fas fa-check-circle"></i>
                  <span>{strength}</span>
                </li>
              ))
            ) : (
              <li className="no-data">No key strengths identified</li>
            )}
          </ul>
        </div>
        
        <div className="result-section gaps-section">
          <h3>Areas for Improvement</h3>
          <ul className="gaps-list">
            {gaps && gaps.length > 0 ? (
              gaps.map((gap, index) => (
                <li key={`gap-${index}`}>
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{gap}</span>
                </li>
              ))
            ) : (
              <li className="no-data">No significant gaps identified</li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="extracted-info">
        <h3>Information Extracted from Resume</h3>
        
        <div className="candidate-info">
          {extractedInfo?.name && (
            <div className="info-item">
              <strong>Name:</strong> {extractedInfo.name}
            </div>
          )}
          
          {extractedInfo?.email && (
            <div className="info-item">
              <strong>Email:</strong> {extractedInfo.email}
            </div>
          )}
        </div>
        
        <div className="resume-sections">
          <div className="experience-section">
            <h4>Professional Experience</h4>
            {extractedInfo?.experience && extractedInfo.experience.length > 0 ? (
              <ul>
                {extractedInfo.experience.map((exp, index) => (
                  <li key={`exp-${index}`}>
                    <div className="exp-company">{exp.company}</div>
                    <div className="exp-title">{exp.title}</div>
                    {exp.duration && <div className="exp-duration">{exp.duration}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No experience data extracted</p>
            )}
          </div>
          
          <div className="education-section">
            <h4>Education</h4>
            {extractedInfo?.education && extractedInfo.education.length > 0 ? (
              <ul>
                {extractedInfo.education.map((edu, index) => (
                  <li key={`edu-${index}`}>
                    <div className="edu-institution">{edu.institution}</div>
                    <div className="edu-degree">{edu.degree}</div>
                    {edu.field && <div className="edu-field">{edu.field}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No education data extracted</p>
            )}
          </div>
          
          <div className="skills-section">
            <h4>Skills</h4>
            {extractedInfo?.skills && extractedInfo.skills.length > 0 ? (
              <div className="skills-tags">
                {extractedInfo.skills.map((skill, index) => (
                  <span key={`skill-${index}`} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-data">No skills data extracted</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="results-actions">
        <button onClick={onRestart}>Start New Analysis</button>
      </div>

      <style jsx>{`
        .results-display {
          color: var(--text-color);
        }
        
        .results-header {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--medium-gray);
          padding-bottom: 1.5rem;
        }
        
        .score-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 2rem;
        }
        
        .match-level {
          font-size: 1.2rem;
          font-weight: bold;
          margin-top: 0.5rem;
        }
        
        .job-details {
          flex: 1;
        }
        
        .analysis-summary {
          margin-top: 0.5rem;
          line-height: 1.6;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .result-section {
          background-color: var(--light-gray);
          border-radius: 8px;
          padding: 1.5rem;
        }
        
        .result-section h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: var(--text-color);
        }
        
        .strengths-list,
        .gaps-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .strengths-list li,
        .gaps-list li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }
        
        .strengths-list i {
          color: var(--secondary-color);
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }
        
        .gaps-list i {
          color: var(--accent-color);
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }
        
        .extracted-info {
          background-color: white;
          border: 1px solid var(--medium-gray);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .extracted-info h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: var(--text-color);
        }
        
        .candidate-info {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .resume-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .skills-section {
          grid-column: 1 / -1;
        }
        
        .experience-section,
        .education-section,
        .skills-section {
          margin-bottom: 1.5rem;
        }
        
        .experience-section h4,
        .education-section h4,
        .skills-section h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: var(--primary-color);
          border-bottom: 1px solid var(--medium-gray);
          padding-bottom: 0.5rem;
        }
        
        .experience-section ul,
        .education-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .experience-section li,
        .education-section li {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px dashed var(--medium-gray);
        }
        
        .experience-section li:last-child,
        .education-section li:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .exp-company,
        .edu-institution {
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        
        .exp-duration,
        .edu-field {
          color: var(--dark-gray);
          font-size: 0.9rem;
        }
        
        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .skill-tag {
          background-color: var(--light-gray);
          color: var(--text-color);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .no-data {
          color: var(--dark-gray);
          font-style: italic;
        }
        
        .results-actions {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .results-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .score-container {
            margin-right: 0;
            margin-bottom: 1.5rem;
          }
          
          .results-grid {
            grid-template-columns: 1fr;
          }
          
          .resume-sections {
            grid-template-columns: 1fr;
          }
          
          .candidate-info {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsDisplay;