
/*
//import React from 'react'
import Video from './Video/Video'
import Chat from './Chat/Chat'
import {useState, useEffect} from 'react'
import './main.css'
import io from 'socket.io-client'

function Main() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io.connect('https://192.168.0.16:3001');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <>
        <main className='main-program'>
            <Video useSocket={socket}/>
            <Chat useSocket={socket}/>
        </main>
    </>
  )
}

export default Main*/