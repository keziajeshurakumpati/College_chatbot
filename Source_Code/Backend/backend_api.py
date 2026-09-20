from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
import json
import pandas as pd
import os
import re

from dotenv import load_dotenv

from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

load_dotenv()


# ============================================================
# FLASK SETUP
# ============================================================

app = Flask(__name__)

CORS(app)

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ============================================================
# LOAD ML MODEL FILES
# ============================================================

print("\nLoading ML Model...")


model = joblib.load(
    os.path.join(
        BASE_DIR,
        "logistic_regression_model.pkl"
    )
)


vectorizer = joblib.load(
    os.path.join(
        BASE_DIR,
        "tfidf_vectorizer.pkl"
    )
)


intent_classes = joblib.load(
    os.path.join(
        BASE_DIR,
        "intent_classes.pkl"
    )
)


print("ML Model Loaded Successfully!")


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading Dataset...")


dataset_path = os.path.join(
    BASE_DIR,
    "galgotias_chatbot_dataset_cleaned_v7.csv"
)


dataset = pd.read_csv(
    dataset_path
)


# ============================================================
# CLEAN DATASET
# ============================================================

dataset.columns = dataset.columns.str.strip()


required_columns = [
    "Question",
    "Intent",
    "Response"
]


for column in required_columns:

    if column not in dataset.columns:

        raise ValueError(
            f"Dataset missing required column: {column}"
        )


dataset = dataset.dropna(
    subset=required_columns
)


dataset["Question"] = (
    dataset["Question"]
    .astype(str)
    .str.strip()
)


dataset["Intent"] = (
    dataset["Intent"]
    .astype(str)
    .str.strip()
)


dataset["Response"] = (
    dataset["Response"]
    .astype(str)
    .str.strip()
)


print("Dataset Loaded Successfully!")

print(
    "Dataset Rows:",
    len(dataset)
)


# ============================================================
# PRECOMPUTE DATASET VECTORS
# ============================================================

print(
    "Preparing dataset similarity search..."
)


dataset_vectors = vectorizer.transform(
    dataset["Question"].tolist()
)


print(
    "Dataset similarity search ready!"
)


# ============================================================
# BACKEND KNOWLEDGE BASE
# ============================================================

knowledge_base_path = os.path.join(
    BASE_DIR,
    "knowledge_base.json"
)

with open(knowledge_base_path, "r", encoding="utf-8") as knowledge_file:
    knowledge_base = json.load(knowledge_file)

knowledge_topics = knowledge_base.get("topics", [])

if not knowledge_topics:
    raise ValueError("Knowledge base does not contain any topics")

knowledge_corpus = [
    " ".join([
        topic["category"],
        topic["title"],
        " ".join(topic.get("keywords", [])),
        " ".join(topic.get("patterns", [])),
        topic["response"],
        " ".join(topic.get("follow_ups", []))
    ])
    for topic in knowledge_topics
]

knowledge_vectors = vectorizer.transform(knowledge_corpus)

print("Backend knowledge base loaded:", len(knowledge_topics), "topics")

# Groq is intentionally disabled. Answers come from local verified data.
groq_client = None


# ============================================================
# KNOWLEDGE BASE MATCHING
# ============================================================

def get_knowledge_tokens(text):
    stop_words = {
        "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
        "can", "could", "i", "you", "me", "my", "to", "for", "of", "in",
        "on", "at", "and", "or", "with", "what", "how", "when", "where",
        "please", "tell", "about", "much", "university"
    }
    return {
        token
        for token in normalize_question(text).split()
        if len(token) > 2 and token not in stop_words
    }

def get_knowledge_topic(topic_id):
    return next(
        (topic for topic in knowledge_topics if topic["id"] == topic_id),
        None
    )

def make_knowledge_response(topic, confidence, method, similarity=None):
    result = {
        "intent": topic["category"],
        "response": topic["response"],
        "confidence": round(float(confidence), 4),
        "source": "Backend Knowledge Base",
        "matching_method": method,
        "related_questions": topic.get("follow_ups", [])
    }

    if similarity is not None:
        result["similarity"] = round(float(similarity), 4)

    return result

def get_strong_knowledge_match(question):
    normalized_question = normalize_question(question)

    category_aliases = {
        "admission": "admissions",
        "admissions": "admissions",
        "course": "courses",
        "courses": "courses",
        "fee": "fees",
        "fees": "fees",
        "eligibility": "eligibility",
        "scholarship": "scholarships",
        "scholarships": "scholarships",
        "hostel": "hostel",
        "placement": "placements",
        "placements": "placements",
        "examination": "examinations",
        "examinations": "examinations",
        "exam": "examinations",
        "contact": "contact"
    }

    if normalized_question in category_aliases:
        topic = get_knowledge_topic(category_aliases[normalized_question])
        if topic:
            return make_knowledge_response(
                topic,
                0.98,
                "category_exact_match"
            )

    best_topic = None
    best_score = 0.0

    for topic in knowledge_topics:
        score = 0.0

        for pattern in topic.get("patterns", []):
            normalized_pattern = normalize_question(pattern)
            if normalized_question == normalized_pattern:
                score += 10.0
            elif normalized_pattern in normalized_question:
                score += 6.0 + min(len(normalized_pattern.split()), 4) * 0.25

        for keyword in topic.get("keywords", []):
            normalized_keyword = normalize_question(keyword)
            if normalized_keyword in normalized_question:
                score += 2.0 if len(normalized_keyword.split()) > 1 else 1.0

        question_tokens = get_knowledge_tokens(normalized_question)
        keyword_tokens = get_knowledge_tokens(" ".join(topic.get("keywords", [])))
        score += min(len(question_tokens & keyword_tokens), 3) * 0.5

        if score > best_score:
            best_score = score
            best_topic = topic

    if best_topic and best_score >= 2.5:
        confidence = min(0.97, 0.70 + best_score / 30.0)
        return make_knowledge_response(
            best_topic,
            confidence,
            "pattern_keyword_match"
        )

    return None

def get_similar_knowledge_response(question):
    try:
        question_vector = vectorizer.transform([question])
        similarities = cosine_similarity(question_vector, knowledge_vectors)[0]
        best_index = similarities.argmax()
        best_score = float(similarities[best_index])
        best_topic = knowledge_topics[best_index]

        query_tokens = get_knowledge_tokens(question)
        topic_tokens = get_knowledge_tokens(
            " ".join([
                best_topic["title"],
                " ".join(best_topic.get("keywords", [])),
                " ".join(best_topic.get("patterns", []))
            ])
        )

        if best_score >= 0.82 and query_tokens & topic_tokens:
            return make_knowledge_response(
                best_topic,
                best_score,
                "knowledge_tfidf_similarity",
                best_score
            )

    except Exception as error:
        print("KNOWLEDGE SIMILARITY ERROR:", str(error))

    return None

def get_knowledge_response_for_intent(intent):
    intent_map = {
        "admission": "admissions",
        "course": "courses",
        "fees": "fees",
        "fee": "fees",
        "eligibility": "eligibility",
        "scholarship": "scholarships",
        "hostel": "hostel",
        "placement": "placements",
        "examination": "examinations"
    }
    topic = get_knowledge_topic(intent_map.get(intent, intent))
    if topic:
        return make_knowledge_response(
            topic,
            0.60,
            "logistic_regression_intent"
        )

    return None

# ============================================================
# SETTINGS
# ============================================================

# ML confidence required to trust ML prediction

ML_THRESHOLD = 0.60


# Dataset similarity threshold

SIMILARITY_THRESHOLD = 0.82


# ============================================================
# NORMALIZE QUESTION
# ============================================================

def normalize_question(question):

    question = str(question)

    question = question.lower()

    question = question.strip()


    # Remove punctuation

    question = re.sub(

        r"[^\w\s]",

        "",

        question

    )


    # Remove extra spaces

    question = re.sub(

        r"\s+",

        " ",

        question

    )


    return question


# ============================================================
# COMMON CONVERSATIONAL MESSAGE HANDLER
# ============================================================

def handle_common_message(text):

    normalized_text = normalize_question(text)

    conversational_messages = {
        "hi": ("greeting", "Hello! 👋 How can I help you with your Galgotias University enquiry?"),
        "hello": ("greeting", "Hi! 👋 What would you like to know about Galgotias University?"),
        "hey": ("greeting", "Hello! 👋 How can I help you with your Galgotias University enquiry?"),
        "hi there": ("greeting", "Hello! 👋 How can I help you with your Galgotias University enquiry?"),
        "hii": ("greeting", "Hello! 👋 How can I help you with your Galgotias University enquiry?"),
        "hiii": ("greeting", "Hello! 👋 How can I help you with your Galgotias University enquiry?"),
        "helo": ("greeting", "Hello! 👋 How can I help you with your Galgotias University enquiry?"),
        "good morning": ("greeting", "Good morning! 👋 How can I help you with your Galgotias University enquiry?"),
        "good afternoon": ("greeting", "Good afternoon! 👋 How can I help you with your Galgotias University enquiry?"),
        "good evening": ("greeting", "Good evening! 👋 How can I help you with your Galgotias University enquiry?"),
        "how are you": ("greeting", "I'm doing great! 😊 I'm here to help with your Galgotias University enquiry."),
        "wow": ("casual_reaction", "That's great! 😊 How can I help you with your college enquiry?"),
        "nice": ("casual_reaction", "Glad to hear that! What would you like to know about the university?"),
        "great": ("casual_reaction", "That's great! 😊 How can I help you with your college enquiry?"),
        "amazing": ("casual_reaction", "Glad to hear that! What would you like to know about the university?"),
        "thank you": ("thanks", "You're welcome! 😊 I'm happy to help. Let me know if you have any other questions."),
        "thanks": ("thanks", "You're welcome! 😊 I'm happy to help. Let me know if you have any other questions."),
        "thank you so much": ("thanks", "You're welcome! 😊 I'm happy to help. Let me know if you have any other questions."),
        "thanks a lot": ("thanks", "You're welcome! 😊 I'm happy to help. Let me know if you have any other questions."),
        "thx": ("thanks", "You're welcome! 😊 I'm happy to help. Let me know if you have any other questions."),
        "ty": ("thanks", "You're welcome! 😊 I'm happy to help. Let me know if you have any other questions."),
        "ok": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "okay": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "alright": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "got it": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "understood": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "fine": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "okay thanks": ("acknowledgement", "You're welcome! If you need anything else, just ask."),
        "bye": ("goodbye", "Goodbye! 👋 Feel free to come back if you have any questions about Galgotias University."),
        "goodbye": ("goodbye", "Goodbye! 👋 Feel free to come back if you have any questions about Galgotias University."),
        "see you": ("goodbye", "Goodbye! 👋 Feel free to come back if you have any questions about Galgotias University."),
        "see you later": ("goodbye", "Goodbye! 👋 Feel free to come back if you have any questions about Galgotias University."),
        "talk to you later": ("goodbye", "Goodbye! 👋 Feel free to come back if you have any questions about Galgotias University.")
    }

    message = conversational_messages.get(normalized_text)

    if message is None:
        return None

    return {
        "intent": message[0],
        "response": message[1]
    }


# ============================================================
# EXACT DATASET QUESTION MATCH
# ============================================================

def get_exact_question_response(question):

    normalized_question = normalize_question(
        question
    )


    for _, row in dataset.iterrows():

        dataset_question = normalize_question(

            row["Question"]

        )


        if dataset_question == normalized_question:

            return {

                "response":
                    row["Response"],

                "intent":
                    row["Intent"]

            }


    return None


# ============================================================
# CONTENT TOKEN CHECK FOR SIMILARITY MATCHES
# ============================================================

def get_content_tokens(text):
    stop_words = {
        "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
        "can", "could", "i", "you", "me", "my", "to", "for", "of", "in",
        "on", "at", "and", "or", "with", "what", "how", "when", "where",
        "please", "tell", "about", "much"
    }
    return {token for token in normalize_question(text).split()
            if len(token) > 2 and token not in stop_words}


# ============================================================
# SIMILAR DATASET QUESTION MATCH
# ============================================================

def get_similar_dataset_response(question):

    try:

        question_vector = vectorizer.transform(

            [question]

        )


        similarities = cosine_similarity(

            question_vector,

            dataset_vectors

        )[0]


        best_index = similarities.argmax()


        best_score = float(

            similarities[best_index]

        )


        best_row = dataset.iloc[best_index]

        query_tokens = get_content_tokens(question)
        match_tokens = get_content_tokens(best_row["Question"])
        token_overlap = len(query_tokens & match_tokens)

        # A cosine score alone can create false matches (for example,
        # an unrelated faculty question matching a fees question).
        # Require a high score AND meaningful shared content.
        if best_score >= SIMILARITY_THRESHOLD and token_overlap >= 1:


            return {

                "response":
                    best_row["Response"],

                "intent":
                    best_row["Intent"],

                "similarity":
                    best_score,

                "matched_question":
                    best_row["Question"]

            }


        return None


    except Exception as e:

        print(

            "SIMILARITY ERROR:",

            str(e)

        )


        return None


# ============================================================
# STRONG COLLEGE TOPIC DETECTION
# ============================================================

def detect_topic_keyword(question):

    q = normalize_question(
        question
    )


    topic_keywords = {


        # ====================================================
        # COURSES
        # ====================================================

        "courses": [

            "courses",

            "course offered",

            "courses offered",

            "programs offered",

            "programmes offered",

            "btech",

            "b tech",

            "bca",

            "mca",

            "mba",

            "mtech",

            "m tech",

            "specialization",

            "specializations"

        ],


        # ====================================================
        # ADMISSION
        # ====================================================

        "admission": [

            "admission",

            "admissions",

            "apply for admission",

            "admission process",

            "application process",

            "how to apply",

            "enrollment"

        ],


        # ====================================================
        # FEES
        # ====================================================

        "fees": [

            "college fees",

            "course fees",

            "tuition fees",

            "tuition fee",

            "fee structure",

            "installment"

        ],


        # ====================================================
        # ELIGIBILITY
        # ====================================================

        "eligibility": [

            "eligibility",

            "eligible",

            "eligibility criteria",

            "admission criteria",

            "marks required",

            "percentage required"

        ],


        # ====================================================
        # SCHOLARSHIPS
        # ====================================================

        "scholarships": [

            "scholarship",

            "scholarships",

            "financial aid",

            "fee waiver"

        ],


        # ====================================================
        # HOSTEL
        # ====================================================

        "hostel": [

            "hostel",

            "hostels",

            "hostel facility",

            "hostel fees",

            "hostel accommodation",

            "college accommodation"

        ],


        # ====================================================
        # PLACEMENTS
        # ====================================================

        "placement": [

            "placement",

            "placements",

            "placement cell",

            "placement package",

            "placement packages",

            "recruiters"

        ],


        # ====================================================
        # EXAMINATION
        # ====================================================

        "examination": [

            "college exam",

            "college exams",

            "examination",

            "examinations",

            "exam schedule",

            "exam timetable",

            "semester exam"

        ]

    }


    for intent, keywords in topic_keywords.items():

        for keyword in keywords:

            if keyword in q:

                return intent


    return None


# ============================================================
# CHECK IF QUESTION IS COLLEGE RELATED
# ============================================================

def is_college_related(question):

    q = normalize_question(
        question
    )


    college_keywords = [


        # GENERAL COLLEGE

        "college",

        "university",

        "galgotias",

        "galgotias university",

        "campus",

        "applying",

        "application",

        "apply",

        "before applying",

        "admission",

        "admissions",

        "registration",

        "documents",

        "document",

        "eligibility",

        "eligible",

        "departments",

        "department",

        "facilities",

        "facility",

        "courses",

        "course",

        "fees",

        "fee",

        "hostel",

        "scholarship",

        "scholarships",

        "placement",

        "placements",

        "examination",

        "examinations",

        "exam",

        "exams",

        "infrastructure",

        "student",

        "students",

        "class",

        "classes",

        "classroom",

        "faculty",

        "professor",

        "teachers",

        "teacher",


        # STUDENT LIFE

        "college life",

        "campus life",

        "student life",

        "make friends",

        "friendship",

        "clubs",

        "club",

        "society",

        "societies",

        "activities",

        "events",

        "workshop",

        "workshops",


        # ACADEMICS

        "study",

        "studies",

        "studying",

        "academic",

        "academics",

        "assignment",

        "assignments",

        "semester",

        "education",

        "learning",


        # CAREER

        "career",

        "internship",

        "internships",

        "skills",

        "resume",

        "cv",


        # EXAMS

        "exam preparation",

        "prepare for exam",

        "prepare for exams",

        "exam stress",


        # COLLEGE EXPERIENCE

        "college experience",

        "enjoy college",

        "enjoyable college",

        "enjoyable",

        "college journey",

        "first year",

        "freshers",

        "freshman"

    ]


    for keyword in college_keywords:

        if keyword in q:

            return True


    return False


# ============================================================
# ML PREDICTION
# ============================================================

def predict_question(user_question):


    question_vector = vectorizer.transform(

        [user_question]

    )


    probabilities = model.predict_proba(

        question_vector

    )[0]


    best_index = probabilities.argmax()


    intent = model.classes_[

        best_index

    ]


    confidence = float(

        probabilities[best_index]

    )


    return intent, confidence


# ============================================================
# DATASET RESPONSE BY INTENT
# ============================================================

def get_dataset_response(intent):


    matching_rows = dataset[

        dataset["Intent"]

        .str.lower()

        .str.strip()

        ==

        intent.lower()

        .strip()

    ]


    if not matching_rows.empty:


        return matching_rows.iloc[0][

            "Response"

        ]


    return None


# ============================================================
# RANDOM QUESTION RESPONSE
# ============================================================

def get_unrelated_response():

    return (

        "Sorry, I can only help with questions related to "
        "Galgotias University and college life.\n\n"

        "You can ask me about:\n\n"

        "• Admissions\n"
        "• Courses\n"
        "• Fees\n"
        "• Eligibility\n"
        "• Scholarships\n"
        "• Hostel\n"
        "• Placements\n"
        "• Examinations\n"
        "• General college and student life"

    )


# ============================================================
# GROQ FALLBACK
# ============================================================

def ask_groq(question):


    # ========================================================
    # CHECK GROQ CONNECTION
    # ========================================================

    if groq_client is None:


        print(

            "GROQ CLIENT NOT AVAILABLE"

        )


        return (

            "I can help with general college-related questions, "
            "but the AI assistant is currently unavailable. "
            "Please try again later."

        )


    # ========================================================
    # SYSTEM PROMPT
    # ========================================================

    system_prompt = """

You are a helpful College and Student Life Assistant.

IMPORTANT:

You are ONLY allowed to answer questions related to:

- College life
- Student life
- Campus experience
- Studying
- Academics
- Time management
- Making friends
- Student activities
- Clubs
- Career preparation
- Internships
- Skill development
- Exam preparation
- General education guidance

The user asked a question that was NOT found confidently
in the verified Galgotias University dataset.

Therefore:

1. Give ONLY general college or student guidance.

2. Do NOT invent specific facts about Galgotias University.

3. Never invent:

- Course availability
- Fees
- Admission dates
- Eligibility percentages
- Scholarship amounts
- Hostel details
- Placement statistics
- Packages
- Recruiters
- Examination dates

4. If the question asks for specific Galgotias University
information that you cannot verify, clearly say:

"Please contact Galgotias University administration or visit
the official website for verified information."

5. Keep answers concise and helpful.

6. Prefer numbered lists or short bullet points.

7. NEVER use:

- Markdown tables
- Table characters like |
- Large headings
- Complex formatting

8. Do NOT mention:

- Groq
- AI fallback
- Machine learning
- Confidence score
- Dataset
- API

Answer naturally like a helpful college assistant.

"""


    # ========================================================
    # CALL GROQ
    # ========================================================

    try:


        print(

            "Sending request to Groq..."

        )


        completion = (

            groq_client

            .chat

            .completions

            .create(


                model="openai/gpt-oss-20b",


                messages=[


                    {

                        "role": "system",

                        "content": system_prompt

                    },


                    {

                        "role": "user",

                        "content": question

                    }

                ],


                temperature=0.4,


                max_completion_tokens=250

            )

        )


        groq_response = (

            completion

            .choices[0]

            .message

            .content

        )


        if groq_response is None:

            raise Exception(

                "Groq returned empty response"

            )


        groq_response = (

            groq_response

            .strip()

        )


        # Remove table characters

        groq_response = re.sub(

            r"\|",

            "",

            groq_response

        )


        print(

            "Groq Response Received Successfully!"

        )


        return groq_response


    except Exception as e:


        print(

            "GROQ ERROR:",

            str(e)

        )


        return (

            "I'm sorry, I couldn't generate a response "
            "right now. Please try again later."

        )


# ============================================================
# PREDICT API
# ============================================================

@app.route(

    "/predict",

    methods=["POST"]

)

def predict():


    try:


        # ====================================================
        # GET REQUEST DATA
        # ====================================================

        data = request.get_json()


        if (

            not data

            or

            "question" not in data

        ):


            return jsonify({


                "success": False,


                "error":

                    "Question is required"


            }), 400


        user_question = str(

            data["question"]

        ).strip()


        if not user_question:


            return jsonify({


                "success": False,


                "error":

                    "Question cannot be empty"


            }), 400


        print("\n")

        print("=" * 60)

        print(

            "QUESTION:",

            user_question

        )

        print("=" * 60)


        # ====================================================
        # STEP 1: COMMON CONVERSATION
        # ====================================================

        common_message = handle_common_message(

            user_question

        )


        if common_message:


            print(

                "TYPE: COMMON CONVERSATION"

            )


            print(

                "SOURCE: Common Message Handler"

            )


            return jsonify({


                "success": True,


                "question":

                    user_question,


                "intent":

                    common_message["intent"],


                "confidence":

                    1.0,


                "response":

                    common_message["response"],


                "source":

                    "Common Message Handler"

            })


        # ====================================================
        # STEP 2: RICH KNOWLEDGE BASE MATCH
        # ====================================================

        strong_knowledge_match = get_strong_knowledge_match(
            user_question
        )

        if strong_knowledge_match:
            print(
                "RICH KNOWLEDGE MATCH:",
                strong_knowledge_match["matching_method"]
            )

            return jsonify({
                "success": True,
                "question": user_question,
                **strong_knowledge_match
            })

        similar_knowledge_match = get_similar_knowledge_response(
            user_question
        )

        if similar_knowledge_match:
            print(
                "RICH KNOWLEDGE TF-IDF MATCH:",
                similar_knowledge_match["similarity"]
            )

            return jsonify({
                "success": True,
                "question": user_question,
                **similar_knowledge_match
            })


        # ====================================================
        # STEP 3: EXACT DATASET MATCH
        # ====================================================

        exact_match = (

            get_exact_question_response(

                user_question

            )

        )


        if exact_match:


            print(

                "EXACT QUESTION MATCH FOUND"

            )


            print(

                "INTENT:",

                exact_match["intent"]

            )


            print(

                "SOURCE: Verified Dataset (Exact)"

            )


            return jsonify({


                "success": True,


                "question":

                    user_question,


                "intent":

                    exact_match["intent"],


                "confidence":

                    1.0,


                "response":

                    exact_match["response"],


                "source":

                    "Verified Dataset (Exact Match)"

            })


        # ====================================================
        # STEP 3: SIMILAR DATASET MATCH
        # ====================================================

        similar_match = (

            get_similar_dataset_response(

                user_question

            )

        )


        if similar_match:


            print(

                "SIMILAR DATASET MATCH FOUND"

            )


            print(

                "MATCHED QUESTION:",

                similar_match["matched_question"]

            )


            print(

                "SIMILARITY:",

                round(

                    similar_match["similarity"],

                    4

                )

            )


            print(

                "SOURCE: Verified Dataset (Similarity)"

            )


            return jsonify({


                "success": True,


                "question":

                    user_question,


                "intent":

                    similar_match["intent"],


                "confidence":

                    round(

                        similar_match["similarity"],

                        4

                    ),


                "response":

                    similar_match["response"],


                "source":

                    "Verified Dataset (Similar Match)"

            })


        # ====================================================
        # STEP 4: STRONG TOPIC KEYWORD
        # ====================================================

        keyword_intent = (

            detect_topic_keyword(

                user_question

            )

        )


        if keyword_intent:


            keyword_response = (

                get_dataset_response(

                    keyword_intent

                )

            )


            if keyword_response:


                print(

                    "STRONG COLLEGE TOPIC DETECTED:",

                    keyword_intent

                )


                print(

                    "SOURCE: Verified Dataset (Keyword)"

                )


                return jsonify({


                    "success": True,


                    "question":

                        user_question,


                    "intent":

                        keyword_intent,


                    "confidence":

                        0.90,


                    "response":

                        keyword_response,


                    "source":

                        "Verified Dataset (Keyword)"

                })


        # ====================================================
        # STEP 5: DOMAIN CHECK BEFORE ML
        # ====================================================

        college_related = is_college_related(user_question)

        if not college_related:
            print("RANDOM / UNRELATED QUESTION")
            print("SOURCE: College Domain Restriction")
            return jsonify({
                "success": True,
                "question": user_question,
                "intent": "unrelated",
                "confidence": 0.0,
                "response": get_unrelated_response(),
                "source": "College Domain Restriction"
            })

        # ====================================================
        # STEP 6: ML PREDICTION
        # ====================================================

        intent, confidence = (

            predict_question(

                user_question

            )

        )


        print(

            "PREDICTED INTENT:",

            intent

        )


        print(

            "CONFIDENCE:",

            round(

                confidence,

                4

            )

        )


        # ====================================================
        # STEP 6: HIGH CONFIDENCE ML
        # ====================================================

        if confidence >= ML_THRESHOLD:


            knowledge_response = get_knowledge_response_for_intent(
                intent
            )


            if knowledge_response:


                print(

                    "ML CONFIDENCE ACCEPTED"

                )


                print(

                        "SOURCE: Backend Knowledge Base"

                )


                return jsonify({


                    "success": True,


                    "question":

                        user_question,


                    "intent":

                        intent,


                    "confidence":

                        round(

                            confidence,

                            4

                        ),


                    "response":

                        knowledge_response["response"],

                    "related_questions":

                        knowledge_response["related_questions"],

                    "matching_method":

                        knowledge_response["matching_method"],


                    "source":

                        "Backend Knowledge Base"

                })


        # ====================================================
        # STEP 7: CHECK COLLEGE RELATED
        # ====================================================

        college_related = (

            is_college_related(

                user_question

            )

        )


        print(

            "COLLEGE RELATED:",

            college_related

        )


        # ====================================================
        # STEP 8: COLLEGE RELATED -> LOCAL KNOWLEDGE FALLBACK
        # ====================================================

        if college_related:


            knowledge_response = get_knowledge_response_for_intent(
                intent
            )

            if knowledge_response:
                print("LOW CONFIDENCE: USING LOCAL KNOWLEDGE BASE")


                return jsonify({


                "success": True,


                "question":

                    user_question,


                    "intent":

                        knowledge_response["intent"],


                "confidence":

                    round(

                        confidence,

                        4

                    ),


                    "response":

                        knowledge_response["response"],

                    "related_questions":

                        knowledge_response["related_questions"],

                    "matching_method":

                        "low_confidence_knowledge_fallback",


                "source":

                        "Backend Knowledge Base"

            })


        # ====================================================
        # STEP 9: RANDOM QUESTION -> REJECT
        # ====================================================

        print(

            "RANDOM / UNRELATED QUESTION"

        )


        print(

            "SOURCE: College Domain Restriction"

        )


        return jsonify({


            "success": True,


            "question":

                user_question,


            "intent":

                "unrelated",


            "confidence":

                round(

                    confidence,

                    4

                ),


            "response":

                get_unrelated_response(),


            "source":

                "College Domain Restriction"

        })


    except Exception as e:


        print(

            "ERROR:",

            str(e)

        )


        return jsonify({


            "success": False,


            "error":

                str(e)

        }), 500


# ============================================================
# HOME API
# ============================================================

@app.route(

    "/",

    methods=["GET"]

)

def home():


    return jsonify({


        "message":

            "College Enquiry Chatbot API is running",


        "status":

            "online",


        "groq":

            groq_client is not None,


        "dataset_rows":

            len(dataset)


    })


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":


    print("\n")

    print("=" * 60)

    print(

        "COLLEGE ENQUIRY CHATBOT API"

    )

    print(

        "Status: Starting..."

    )

    print(

        "URL: http://127.0.0.1:5001"

    )

    print("=" * 60)

    print("\n")


    app.run(


        host="0.0.0.0",


        port=int(

            os.environ.get(

                "PORT",

                5001

            )

        ),


        debug=False

    )