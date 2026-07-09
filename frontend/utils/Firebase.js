import {getAuth, GoogleAuthProvider} from "firebase/auth";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginonecart-45d62.firebaseapp.com",
  projectId: "loginonecart-45d62",
  storageBucket: "loginonecart-45d62.firebasestorage.app",
  messagingSenderId: "976430649891",
  appId: "1:976430649891:web:bab10c38237edc00f3d796"
};


const app = initializeApp(firebaseConfig);





const auth=getAuth(app);
const provider=new GoogleAuthProvider();


export {auth,provider}



