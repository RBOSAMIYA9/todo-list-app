import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyCLFHRMO1u-6UREh6q3FbzXBLpxFUUojGU",
    authDomain: "todo-list-a6588.firebaseapp.com",
    projectId: "todo-list-a6588",
    storageBucket: "todo-list-a6588.appspot.com",
    messagingSenderId: "1044997501729",
    appId: "1:1044997501729:web:c6a8edae1baaf822220460"
  };

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  export { db , auth , provider};