import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "movie-database-website.firebaseapp.com",
  databaseURL: "https://movie-database-website-default-rtdb.firebaseio.com",
  projectId: "movie-database-website",
  storageBucket: "movie-database-website.appspot.com",
  messagingSenderId: "478952339171",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-ZW9T50NNW0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const database = getDatabase()