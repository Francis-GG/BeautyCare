import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAbVMKVFLkp4jFEwDZXcgNu6SvoKp1pUfw",
    authDomain: "beautycarego01-5afd9.firebaseapp.com",
    projectId: "beautycarego01-5afd9",
    storageBucket: "beautycarego01-5afd9.appspot.com",
    messagingSenderId: "428627553388",
    appId: "1:428627553388:web:4d87d2aabe6e750b643c49",
    measurementId: "G-P8F499897P"
  };
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);