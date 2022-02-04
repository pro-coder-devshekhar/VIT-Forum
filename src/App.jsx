import './App.css';
// import vit_logo from './vit.jpg'
import { useRef,useState } from 'react';
// import env from 'react-dotenv'
// importing Firebase components
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
// Firebase Firestore hooks
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

// can be exposed to github.
firebase.initializeApp({
    apiKey: "AIzaSyA6brviwkRlRi0wc8nNBHr32iBDUDv-2AY",
    authDomain: "vit-forum-b462e.firebaseapp.com",
    projectId: "vit-forum-b462e",
    storageBucket: "vit-forum-b462e.appspot.com",
    messagingSenderId: "273726707001",
    appId: "1:273726707001:web:f4023202ef34d8184fc4e8"
  })

// Initialize Firebase
const auth = firebase.auth();
const firestore = firebase.firestore();

export default function App() {
  // auth state
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        {/* <img src={vit_logo} alt="vit_logo" width='250px'/> */}
        <h1>VITC Forum</h1>
        <SignOut />
      </header>
      <section>
        {user ? <Forum /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      'hd':'vitstudent.ac.in'
    })
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function Forum() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { displayName, email, uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
      email
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
  <div className='Forum'>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
      <button type="submit" disabled={!formValue}>🚀</button>
    </form>
  </div>
  )
}

function ChatMessage(props) {
  const { displayName, text, uid, photoURL } = props.message;
//   const DateFormat = (s) => {
//     var sec_num = parseInt(s, 10); // don't forget the second param
//     var hours   = Math.floor(sec_num / 3600);
//     var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
//     // var seconds = sec_num - (hours * 3600) - (minutes * 60);
//     if (hours   < 10) {hours   = "0"+hours;}
//     if (minutes < 10) {minutes = "0"+minutes;}
//     return hours+':'+minutes;
// }
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<div key={`${messageClass}`}>
    <div className={`message ${messageClass}`}>
      {/* <h6>{DateFormat(`${createdAt.seconds}`)}</h6> */}
      <h3>{displayName}</h3><br />
      <img src={photoURL} alt='👨‍💻'/>
      <p>{text}</p>

    </div>
  </div>)
}
