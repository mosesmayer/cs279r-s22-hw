import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
var firebaseConfig = {
    // ...your firebase credentials
    apiKey: "AIzaSyAtREtdh52P3ABNMywn2ZSrnVabC6Aln9Q",
    authDomain: "cs279-hw4-svelte-firebase.firebaseapp.com",
    projectId: "cs279-hw4-svelte-firebase",
    storageBucket: "cs279-hw4-svelte-firebase.appspot.com",
    messagingSenderId: "705119243293",
    appId: "1:705119243293:web:354485236e51557086caf4",
    measurementId: "G-E13TNBEC1L"
};

// firebase.initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(firebaseApp);
// export const auth = firebase.auth();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();

// export const db = firebase.firestore();