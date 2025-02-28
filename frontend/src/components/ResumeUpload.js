import React, { useState, useRef } from 'react';
import { analyzeResume } from '../services/api';

const ResumeUpload = ({ jobId, jobDetails, onAnalysisComplete, onError, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      onError('Please upload a resume in PDF, DOC, DOCX, or TXT format.');
      fileInputRef.current.value = '';
      setSelectedFile(null);
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      onError('File size should not exceed 5MB.');
      fileInputRef.current.value = '';
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      onError('Please select a resume file to upload.');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('job_id', jobId);
      
      const result = await analyzeResume(formData);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      onError('Failed to analyze resume. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload">
      <h2>Upload Your Resume</h2>
      
      <div className="job-summary">
        <h3>Selected Job: {jobDetails.title}</h3>
        <div className="job-description-preview">
          <p>{jobDetails.description.substring(0, 150)}...</p>
        </div>
      </div>

      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="resumeFile">Upload Resume (PDF, DOC, DOCX, or TXT)</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="resumeFile"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file-input"
              accept=".pdf,.doc,.docx,.txt"
            />
            
            <div className="file-upload-box">
              {selectedFile ? (
                <div className="selected-file">
                  <i className="fas fa-file-alt"></i>
                  <span>{selectedFile.name}</span>
                  <button 
                    type="button" 
                    className="remove-file"
                    onClick={() => {
                      setSelectedFile(null);
                      fileInputRef.current.value = '';
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Drag & drop your resume here or click to browse</p>
                  <small>Supported formats: PDF, DOC, DOCX, TXT (max 5MB)</small>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={!selectedFile}>
            Screen Resume
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeUpload;