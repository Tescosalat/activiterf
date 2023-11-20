// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAc82hauwn4_FuAzKnDibcDILjIsY-rt0",
  authDomain: "activiter-8d5fa.firebaseapp.com",
  databaseURL: "https://activiter-8d5fa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "activiter-8d5fa",
  storageBucket: "activiter-8d5fa.appspot.com",
  messagingSenderId: "90629081810",
  appId: "1:90629081810:web:d016a8e38a9bfeaf597b0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };