import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';


const firebaseConfig = {
    apiKey: "AIzaSyCoh8jK7yOCyNPmtRoc-33BQfjeUAeaa7A",
    authDomain: "mindco-df9af.firebaseapp.com",
    databaseURL: "https://mindco-df9af-default-rtdb.firebaseio.com",
    projectId: "mindco-df9af",
    storageBucket: "mindco-df9af.appspot.com",
    messagingSenderId: "155664905715",
    appId: "1:155664905715:web:61657dbaa0c5c5dae5ce86",
    measurementId: "G-BZZ3ETQ7K0"
};

const app = firebase.initializeApp(firebaseConfig);
const firestoreDB = firebase.firestore(app);
const realtimeDB = firebase.database(app);

// Save interactions
function saveUserInteraction(uid, interaction) {
    realtimeDB.ref(`userInteractions/users/${uid}`).set(interaction);
}


// Save data
function saveUserData(name, email, phone) {

    const date = firebase.firestore.FieldValue.serverTimestamp();

    firestoreDB.collection('users').add({
        name,
        email,
        phone,
        date
    })
        .then(refDoc => {
            const interaction = {
                type: "submit",
                timestamp: Date.now(),
            };
            saveUserInteraction(refDoc.id, interaction);
            console.log('Document successfully written!', refDoc.id);
        })
        .catch(err => {
            const interaction = {
                type: "error",
                timestamp: Date.now(),
            };
            saveUserInteraction("error", interaction);
            console.error('Error adding document: ', err);
        });
}

export default saveUserData;