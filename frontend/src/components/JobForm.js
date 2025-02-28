import React, { useState } from 'react';
import { saveJobDetails } from '../services/api';

const JobForm = ({ onJobSubmit, onError }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobTitle.trim() || !jobDescription.trim()) {
      onError('Please enter both job title and description.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await saveJobDetails({
        title: jobTitle,
        description: jobDescription
      });
      
      onJobSubmit(response.job_id, {
        title: jobTitle,
        description: jobDescription
      });
    } catch (error) {
      console.error('Error saving job details:', error);
      onError('Failed to save job details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="job-form">
      <h2>Enter Job Details</h2>
      <p>Enter the job title and description to analyze your resume against</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            disabled={isSubmitting}
            required
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;