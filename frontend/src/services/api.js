import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Save job details (title and description)
export const saveJobDetails = async (jobData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/job`, jobData);
    return response.data;
  } catch (error) {
    console.error('API error saving job details:', error);
    throw error;
  }
};

// Upload resume and get analysis
export const analyzeResume = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API error analyzing resume:', error);
    throw error;
  }
};