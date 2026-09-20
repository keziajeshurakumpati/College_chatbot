import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMJkpcWO1ORWKig7Cr6hPD_xDsTc2UhXM",
  authDomain: "galgotias-university-chatbot.firebaseapp.com",
  projectId: "galgotias-university-chatbot",
  storageBucket: "galgotias-university-chatbot.firebasestorage.app",
  messagingSenderId: "593437676145",
  appId: "1:593437676145:web:e95eb6c2e95147e1dbc1d0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
