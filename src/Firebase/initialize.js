import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAdEBVqnfyygi8Ee6E5bQ3hhFk3FmST_j4",
  authDomain: "react-auth-1260a.firebaseapp.com",
  databaseURL: "https://react-auth-1260a-default-rtdb.firebaseio.com",
  projectId: "react-auth-1260a",
  storageBucket: "react-auth-1260a.firebasestorage.app",
  messagingSenderId: "999926172491",
  appId: "1:999926172491:web:2b2bcea4531046830df6ce",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
