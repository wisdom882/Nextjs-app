import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAkIWvsYHVDxRmYVCOP_SUsD2azH_yvn8M",

    authDomain: "socialblog-bef11.firebaseapp.com",
  
    projectId: "socialblog-bef11",
  
    storageBucket: "socialblog-bef11.appspot.com",
  
    messagingSenderId: "885363867637",
  
    appId: "1:885363867637:web:dfa8e3026253ec2239aabc",
  
    measurementId: "G-MBFMTLCLKJ"
  
}

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig) 
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();