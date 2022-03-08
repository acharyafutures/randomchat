import React,{useState} from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDDfXDJN-yIxOhnIeddIIE08VbvYlidO0I",
  authDomain: "allchat-8c9b7.firebaseapp.com",
  projectId: "allchat-8c9b7",
  storageBucket: "allchat-8c9b7.appspot.com",
  messagingSenderId: "791858254104",
  appId: "1:791858254104:web:9e35fc4f0beea98105ce6d",
  measurementId: "G-S0MX74P4YL",
});
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user]=useAuthState(auth);

  return (
    <div className="App">
      <header> </header><section>
         {user ? <ChatRoom /> : <SignIn />} </section>{" "} 
    </div>
  );
}

function SignIn() {
  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={useSignInWithGoogle}> Sign in with Google </button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button onClick={() => auth.signOut()}> Sign Out </button>
    )
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idfield: "id" });
  const[formValue,setFormValue]=useState('');

  const sendMessage = async(e) =>{
    e.preventDefault();
    const{uid,photoURL}= auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
  }

  return (
    <>
      <div>
        {" "}
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}{" "}
      </div>{" "}
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Send</button> 
      </form>
    </>
  );

  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const messageClass =uid === auth.currentUser.uid ? 'sent':'received';
    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL}/>
        <p>{text}</p>  
      </div>
    
    )
  }
}

export default App;
