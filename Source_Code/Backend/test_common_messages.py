import unittest

import backend_api


class CommonMessageApiTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = backend_api.app.test_client()

    def request(self, question):
        response = self.client.post(
            "/predict",
            json={"question": question}
        )
        self.assertEqual(response.status_code, 200)
        return response.get_json()

    def test_common_messages_return_conversational_responses(self):
        messages = [
            "hi",
            "hello",
            "hey",
            "thank you",
            "thanks",
            "thank you so much",
            "ok",
            "okay",
            "got it",
            "bye",
            "goodbye",
        ]

        for message in messages:
            with self.subTest(message=message):
                payload = self.request(message)
                self.assertEqual(payload["source"], "Common Message Handler")
                self.assertNotIn("No matching information found", payload["response"])

    def test_common_message_normalization_handles_spacing_and_punctuation(self):
        payload = self.request("  Thank   you so much!!! ")
        self.assertEqual(payload["intent"], "thanks")
        self.assertEqual(payload["source"], "Common Message Handler")

    def test_enquiries_containing_conversational_phrases_use_existing_pipeline(self):
        messages = [
            "hi, what are the fees?",
            "thanks, what is the hostel fee?",
            "okay tell me about admissions",
        ]

        for message in messages:
            with self.subTest(message=message):
                payload = self.request(message)
                self.assertNotEqual(payload["source"], "Common Message Handler")

    def test_unsupported_question_keeps_existing_fallback(self):
        payload = self.request("what is the weather today?")
        self.assertEqual(payload["source"], "College Domain Restriction")
        self.assertIn("only help with questions related to Galgotias University", payload["response"])


if __name__ == "__main__":
    unittest.main()
