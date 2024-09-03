// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "react-chat-aef3b.firebaseapp.com",
  projectId: "react-chat-aef3b",
  storageBucket: "react-chat-aef3b.appspot.com",
  messagingSenderId: "225723834934",
  appId: "1:225723834934:web:f669210fb452773a36ee97",
  measurementId: "G-SQN8JV4S6K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore();
export const storage = getStorage()