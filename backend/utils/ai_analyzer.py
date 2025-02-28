import os
import json
import requests

def analyze_resume_with_gemini(resume_text, job_title, job_description):
    """
    Analyze the resume against job description using Gemini AI
    Returns analysis and score
    """
    # Get API key from environment variables correctly
    api_key = os.environ.get("GEMINI_API_KEY")
    
    # Proper endpoint URL
    endpoint_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    
    if not api_key:
        raise ValueError("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.")
    
    try:
        # Create the prompt for Gemini
        prompt = f"""
        Task: Analyze how well the candidate's resume aligns with the job posting.
        
        Job Title: {job_title}
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        Please provide a detailed analysis in JSON format with the following structure:
        1. "score": A number between 0-100 indicating overall match percentage
        2. "summary": Brief summary of the analysis (2-3 sentences)
        3. "strengths": Array of key strengths found in the resume relative to the job (up to 5)
        4. "gaps": Array of missing skills or experiences from the job requirements (up to 5)
        5. "extracted_info": Object containing:
           - "name": Candidate's name
           - "email": Candidate's email
           - "experience": Array of work experiences with company, title, duration
           - "education": Array of education entries with institution, degree, field
           - "skills": Array of skills extracted from resume
        
        The response must be valid JSON.
        """
        
        # Create the payload for the API request
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        
        # Set headers with API key
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        
        # Make the API request to the custom endpoint
        response = requests.post(endpoint_url, json=payload, headers=headers)
        
        # Check if the request was successful
        response.raise_for_status()
        
        # Parse the response
        response_data = response.json()
        
        # Extract text from response (adjust based on the actual response structure)
        response_text = ""
        
        # Extract the generated content based on Gemini API response structure
        if "candidates" in response_data and len(response_data["candidates"]) > 0:
            response_text = response_data["candidates"][0]["content"]["parts"][0]["text"]
        elif "contents" in response_data and len(response_data["contents"]) > 0:
            parts = response_data["contents"][0]["parts"]
            if parts and "text" in parts[0]:
                response_text = parts[0]["text"]
        
        # If still empty, use the raw response as a fallback
        if not response_text:
            response_text = str(response_data)
        
        # Handle case where response might have markdown code block
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text
        
        # Parse JSON result
        result = json.loads(json_str)
        
        # Ensure the result has all required fields
        required_fields = ['score', 'summary', 'strengths', 'gaps', 'extracted_info']
        for field in required_fields:
            if field not in result:
                result[field] = [] if field in ['strengths', 'gaps'] else ({} if field == 'extracted_info' else "")
        
        return result
    
    except requests.exceptions.RequestException as e:
        print(f"API request error: {str(e)}")
        return {
            "error": f"API request failed: {str(e)}",
            "score": 0,
            "summary": "Failed to analyze resume due to an API connection error.",
            "strengths": [],
            "gaps": [],
            "extracted_info": {
                "name": "",
                "email": "",
                "experience": [],
                "education": [],
                "skills": []
            }
        }
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print(f"Response text: {response_text}")
        return {
            "error": f"Failed to parse response as JSON: {str(e)}",
            "score": 0,
            "summary": "Failed to analyze resume due to a response parsing error.",
            "strengths": [],
            "gaps": [],
            "extracted_info": {
                "name": "",
                "email": "",
                "experience": [],
                "education": [],
                "skills": []
            }
        }
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return {
            "error": str(e),
            "score": 0,
            "summary": "Failed to analyze resume due to an error.",
            "strengths": [],
            "gaps": [],
            "extracted_info": {
                "name": "",
                "email": "",
                "experience": [],
                "education": [],
                "skills": []
            }
        }