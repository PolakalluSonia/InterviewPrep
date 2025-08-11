// Import the functions you need from the SDKs you need
import {initializeApp,getApps,getApp} from "firebase/app";
import {getAuth} from 'firebase/auth';
import{getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyANiNUPr_O-BCSCSTu1gSHuv-y2fyXkdSg",
    authDomain: "ainterview-ef91d.firebaseapp.com",
    projectId: "ainterview-ef91d",
    storageBucket: "ainterview-ef91d.firebasestorage.app",
    messagingSenderId: "596029140843",
    appId: "1:596029140843:web:5dcbfad7aef4da251d662e",
    measurementId: "G-6P1XTRFVWB"
};

// Initialize Firebase
const app = !getApps.length?initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);