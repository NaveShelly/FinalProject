import firebase from "firebase";

const config = {
    apiKey: "AIzaSyCBMhqliwSM85rCvoKWfd15lkILNRXnGzg",
    authDomain: "jobmatch-b6a04.firebaseapp.com",
    databaseURL: "https://jobmatch-b6a04-default-rtdb.firebaseio.com",
    projectId: "jobmatch-b6a04",
    storageBucket: "jobmatch-b6a04.appspot.com",
    messagingSenderId: "1048199568172",
    appId: "1:1048199568172:web:8784a181fe4d134edfea89",
    measurementId: "G-8S40VBPG07"
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;