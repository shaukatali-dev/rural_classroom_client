import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZrT16HJs-3JrbbcSePf-e-EIpehkEPpg",
  authDomain: "rural-classroom.firebaseapp.com",
  projectId: "rural-classroom",
  storageBucket: "rural-classroom.appspot.com",
  messagingSenderId: "916425430497",
  appId: "1:916425430497:web:ba178206cb6a0f12402ea0",
  measurementId: "G-XZSY6TT3GT",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
