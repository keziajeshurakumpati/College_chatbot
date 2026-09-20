# Galgotias University Enquiry Chatbot

A college-domain chatbot using a Flask ML backend and React/Vite frontend.

## Core flow
1. Greeting handler
2. Exact verified dataset match
3. High-confidence similarity match with token-overlap validation
4. Strong college-topic handling
5. ML intent prediction for college-related questions
6. Groq fallback for general college/student-life questions
7. Unrelated questions are rejected

## Run locally
### Backend
```
cd Source_Code/Backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Add GROQ_API_KEY to .env
python backend_api.py
```
Backend: http://127.0.0.1:5001

### Frontend
```
cd Source_Code/Frontend
npm install
copy .env.example .env
npm run dev
```
Open the URL shown by Vite.

## Security
Never share the real `.env` file or Groq API key.
