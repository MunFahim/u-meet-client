
//import React from 'react'
import { useState, useEffect } from "react"
//import Main from './components/Main/Main'
import Navbar from './components/Navbar/Navbar.jsx'
import io from 'socket.io-client'
import './App.css'
import Video from './components/Main/Video/Video.jsx'
import Chat from './components/Main/Chat/Chat.jsx'
import SetUser from './components/SetUsername/Username.jsx'

function App() {
  const [socket, setSocket] = useState(null);
  const [userIs, setUserIs] = useState('')
  const [gotUsername, setGotUsername] = useState(false)

  const handleUsername = (inputUser) =>{
      if (inputUser != ''){
        //console.log(inputUser)
        setUserIs(inputUser)
      }
  }

  useEffect(()=>{
    if (userIs != ''){
      setGotUsername(true)
    }
  },[userIs])


  useEffect(() => {
    const newSocket = io.connect('https://u-meet-server.onrender.com/');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  return (
    <>
    <div className="program">
      <Navbar className="nav"/>
      {!gotUsername && <SetUser handleUser={handleUsername}/>}
      {gotUsername &&
      <main className='main-program'>
        <Video useSocket={socket}/>
        <Chat useSocket={socket} userIs={userIs}/>
      </main>
      }
    </div>
    </>
  )
}

export default App
