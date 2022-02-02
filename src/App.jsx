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
        <h1>VITC</h1>
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

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
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
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='👨‍💻'/>
      <p>{text}</p>
    </div>
  </>)
}
