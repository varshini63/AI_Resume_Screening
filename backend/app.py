from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from utils.ai_analyzer import analyze_resume_with_gemini
import tempfile
import PyPDF2
import docx2txt
import logging
from dotenv import load_dotenv
load_dotenv()  # Add this at the top of your app.py

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Temporary storage for job details
job_details = {}

@app.route('/api/job', methods=['POST'])
def save_job():
    """Save job title and description"""
    data = request.json
    job_id = str(uuid.uuid4())
    job_details[job_id] = {
        'title': data.get('title', ''),
        'description': data.get('description', '')
    }
    return jsonify({'job_id': job_id, 'message': 'Job details saved successfully'})

def extract_text_from_file(file):
    """Extract text from different file formats"""
    filename = file.filename.lower()
    
    # Save the file temporarily to process it
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp_file.name)
    temp_file.close()
    
    try:
        if filename.endswith('.pdf'):
            # Extract text from PDF
            text = ""
            with open(temp_file.name, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text
        
        elif filename.endswith('.docx'):
            # Extract text from DOCX
            text = docx2txt.process(temp_file.name)
            return text
        
        elif filename.endswith('.doc'):
            # For DOC files, you might need another library
            # This is a simplified approach
            return "DOC file format detected. Processing as text."
        
        elif filename.endswith('.txt'):
            # Extract text from TXT
            with open(temp_file.name, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
            return text
        
        else:
            return "Unsupported file format"
    
    finally:
        # Clean up the temporary file
        os.unlink(temp_file.name)

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    """Analyze resume against job description"""
    try:
        logger.debug("Received analyze request")
        
        if 'resume' not in request.files:
            logger.error("No resume file in request")
            return jsonify({'error': 'No resume file provided'}), 400
        
        job_id = request.form.get('job_id')
        if not job_id or job_id not in job_details:
            logger.error(f"Invalid job ID: {job_id}")
            return jsonify({'error': 'Invalid job ID'}), 400
        
        resume_file = request.files['resume']
        logger.debug(f"Processing file: {resume_file.filename}")
        
        # Extract text from the resume file
        resume_text = extract_text_from_file(resume_file)
        
        # Get job details
        job = job_details[job_id]
        
        logger.debug("Calling Gemini AI for analysis")
        # Analyze resume using Gemini AI
        analysis_result = analyze_resume_with_gemini(
            resume_text, 
            job['title'], 
            job['description']
        )
        
        logger.debug("Analysis completed successfully")
        return jsonify(analysis_result)
    
    except Exception as e:
        logger.exception("Error in analyze_resume endpoint")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)