// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY2hLj3WPbVqlKvC-Vmc22nq4qnZDWhPk",
  authDomain: "imagesimilaritywithxd.firebaseapp.com",
  projectId: "imagesimilaritywithxd",
  storageBucket: "imagesimilaritywithxd.appspot.com",
  messagingSenderId: "766269120974",
  appId: "1:766269120974:web:0401924f489fe005568b9f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
