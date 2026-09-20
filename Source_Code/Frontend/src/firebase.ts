import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB10zwRdrXG6RPiONLI8ddd92OQO6id9f4",
  authDomain: "college-enquiry-chatbot-66646.firebaseapp.com",
  projectId: "college-enquiry-chatbot-66646",
  storageBucket: "college-enquiry-chatbot-66646.firebasestorage.app",
  messagingSenderId: "177141746624",
  appId: "1:177141746624:web:e8f6029e25d48872845625",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
