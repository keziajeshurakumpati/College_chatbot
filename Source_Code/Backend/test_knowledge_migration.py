import unittest

import backend_api


class KnowledgeMigrationTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = backend_api.app.test_client()

    def ask(self, question):
        response = self.client.post(
            "/predict",
            json={"question": question}
        )
        self.assertEqual(response.status_code, 200)
        return response.get_json()

    def test_major_categories_return_rich_backend_knowledge(self):
        cases = [
            ("How do I apply for admission?", "admissions", "Admission"),
            ("What courses are offered?", "courses", "academic areas"),
            ("What are the fees?", "fees", "Fees depend"),
            ("What are the eligibility criteria?", "eligibility", "Eligibility"),
            ("What scholarships are available?", "scholarships", "scholarship"),
            ("Tell me about hostel accommodation", "hostel", "hostel accommodation"),
            ("What is the placement percentage?", "placements", "Training and Placement"),
            ("What is the exam grading system?", "examinations", "relative grading"),
        ]

        for question, intent, expected_text in cases:
            with self.subTest(question=question):
                payload = self.ask(question)
                self.assertEqual(payload["intent"], intent)
                self.assertEqual(payload["source"], "Backend Knowledge Base")
                self.assertIn(expected_text.lower(), payload["response"].lower())
                self.assertGreater(len(payload["related_questions"]), 0)

    def test_short_category_queries_use_rich_topics(self):
        expected_intents = {
            "fees": "fees",
            "hostel": "hostel",
            "courses": "courses",
            "placements": "placements",
            "scholarship": "scholarships",
            "eligibility": "eligibility",
        }

        for question, intent in expected_intents.items():
            with self.subTest(question=question):
                payload = self.ask(question)
                self.assertEqual(payload["intent"], intent)
                self.assertEqual(payload["matching_method"], "category_exact_match")
                self.assertEqual(payload["source"], "Backend Knowledge Base")

    def test_compound_questions_use_the_dominant_topic(self):
        cases = [
            ("B.Tech admission 2026", "admissions"),
            ("B.Tech fees", "fees"),
            ("hostel fees", "hostel"),
        ]

        for question, intent in cases:
            with self.subTest(question=question):
                payload = self.ask(question)
                self.assertEqual(payload["intent"], intent)
                self.assertEqual(payload["source"], "Backend Knowledge Base")

    def test_conversation_and_unrelated_questions_keep_existing_behavior(self):
        greeting = self.ask("hi")
        self.assertEqual(greeting["source"], "Common Message Handler")

        unrelated = self.ask("what is the weather today?")
        self.assertEqual(unrelated["source"], "College Domain Restriction")
        self.assertNotEqual(unrelated["source"], "Groq")

    def test_low_confidence_college_question_does_not_call_groq(self):
        payload = self.ask("I want help choosing what to study at university")
        self.assertNotEqual(payload["source"], "Groq")
        self.assertNotIn("Groq", payload["response"])


if __name__ == "__main__":
    unittest.main()
