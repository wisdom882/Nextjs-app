import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAkIWvsYHVDxRmYVCOP_SUsD2azH_yvn8M",

    authDomain: "socialblog-bef11.firebaseapp.com",
  
    projectId: "socialblog-bef11",
  
    storageBucket: "socialblog-bef11.appspot.com",
  
    messagingSenderId: "885363867637",
  
    appId: "1:885363867637:web:dfa8e3026253ec2239aabc",
  
    measurementId: "G-MBFMTLCLKJ",
  
};


if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig) 
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

///helper functions
/**
 * gets a user/{uid} document with username
 * @param {string} username
 */

export async function getUserWithUsername(username){
    const userRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0]
    return userDoc
}

/**
 * Converts a firestore documet to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc){
    const data = doc.data();
    return{
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}