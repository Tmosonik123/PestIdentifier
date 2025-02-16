import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLP-T39DyupqikQ6a7MOI77nUTMNf5h3Y",
  authDomain: "pestidentifier.firebaseapp.com",
  projectId: "pestidentifier",
  storageBucket: "pestidentifier.firebasestorage.app",
  messagingSenderId: "227027690816",
  appId: "1:227027690816:web:304b6491b497a62c5e86a5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };
