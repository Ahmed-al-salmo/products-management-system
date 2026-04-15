import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyASkLsn0lDHM5X2p6QrzhU4wDFNd0SWYM0",
    authDomain: "product-management-syste-aa871.firebaseapp.com",
    projectId: "product-management-syste-aa871",
    storageBucket: "product-management-syste-aa871.firebasestorage.app",
    messagingSenderId: "21777334703",
    appId: "1:21777334703:web:bd916b2badc2d20cb1ef5a",
    measurementId: "G-S2S1E0BQ25"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
