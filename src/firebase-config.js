// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARbJVXXqy8Mf45SmzQAnwq6GkNFqfnBFo",
  authDomain: "firestoreiqro.firebaseapp.com",
  databaseURL: "https://firestoreiqro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firestoreiqro",
  storageBucket: "firestoreiqro.appspot.com",
  messagingSenderId: "1022420192026",
  appId: "1:1022420192026:web:1fd4d2c459d82455847aa3",
  measurementId: "G-2V0GQ0S0LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);    