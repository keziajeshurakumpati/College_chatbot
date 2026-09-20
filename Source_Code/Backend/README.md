# Galgotias University Enquiry Chatbot - Backend

This is the backend API for the Galgotias University Enquiry Chatbot.

## Features

- Machine Learning based intent classification
- TF-IDF Vectorization
- Logistic Regression Model
- Verified Dataset Matching
- Similarity Matching
- College Domain Detection
- Groq AI Fallback
- Random/Unrelated Question Restriction

## Technology Used

- Python
- Flask
- Scikit-learn
- Pandas
- Joblib
- Groq API

## Backend Files

| File | Description |
|------|-------------|
| backend_api.py | Main Flask backend API |
| galgotias_chatbot_dataset_cleaned_v7.csv | Chatbot dataset |
| logistic_regression_model.pkl | Trained ML model |
| tfidf_vectorizer.pkl | TF-IDF vectorizer |
| intent_classes.pkl | Intent classes |
| requirements.txt | Required Python packages |
| .env.example | Environment variable example |

## Installation

Install the required packages:

```bash
pip install -r requirements.txt