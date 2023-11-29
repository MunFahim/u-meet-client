import { useEffect, useRef } from 'react'
//import React from 'react'
import './chat.css'
import {useState } from 'react'
//import io from 'socket.io-client'
import {v4 as uuidv4} from 'uuid'

// eslint-disable-next-line react/prop-types
function Chat({useSocket, userIs}) {
  let socket = useSocket
  // checks if user is searching or connected to socket
  const [searching, setSearching] = useState(false)
  const [found, setFound] = useState(false)
  const [msg, setMsg] = useState('')
  const scrollRef = useRef(null)

  // array of messages to be rendered
  const [msgList, setMsgList] = useState([
    {
      user: 'Ome',
      message: 'WELCOME TO THE CHAT',
      socketUser: 'Owner'
    }
  ])
  const foundConnection = () =>{
    setMsgList([
      {
        user: 'Ome',
        message: 'WELCOME TO THE CHAT',
        socketUser: 'Owner'
      },
      {
        user: 'Ome',
        message: `CONNECTED TO USER`,
        socketUser: 'Owner'
      }
    ])
  }
  const reset = () =>{
    setMsgList([
      {
        user: 'Ome',
        message: 'WELCOME TO THE CHAT',
        socketUser: 'Owner'
      },
      {
        user: 'Ome',
        message: `DISCONNECTED FROM USER`,
        socketUser: 'Owner'
      }
    ])
    setSearching(false)
  }
  const looking = () =>{
    setMsgList([
      {
        user: 'Ome',
        message: 'WELCOME TO THE CHAT',
        socketUser: 'Owner'
      },
      {
        user: 'Ome',
        message: `SEARCHING...`,
        socketUser: 'Owner'
      }
    ])
  }

  useEffect(()=>{
    if (msgList.length){
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        display: 'block'
      })
    }
  },[msgList.length])

  useEffect(() => {
    if (socket) {
      //console.log('Setting up event listeners');
  
      const handleSearch = () => {
        looking();
      };
  
      const handleConnectedUser = (data) => {
        //console.log('User connected');
        if (data.user === true) {
          setFound(true);
          foundConnection();
        }
      };
  
      const handleLeaveRoom = () => {
        setFound(false);
        reset();
      };
  
      const handleMessage = (data) => {
        const username = data.id;
        const nick = data.nick
        const newMsg = data.message;
        setMsgList((prevMsgList) => [
          ...prevMsgList,
          {
            user: nick,
            message: newMsg,
            socketUser: username === socket.id ? 'originalUser' : 'connectedUser',
          },
        ]);
      };
  
      // Set up event listeners
      socket.on('search', handleSearch);
      socket.on('connectedUser', handleConnectedUser);
      socket.on('leaveRoom', handleLeaveRoom);
      socket.on('message', handleMessage);
  
      // Cleanup function to remove previous event listeners
      return () => {
        //console.log('Cleaning up event listeners');
        socket.off('search', handleSearch);
        socket.off('connectedUser', handleConnectedUser);
        socket.off('leaveRoom', handleLeaveRoom);
        socket.off('message', handleMessage);
      };
    }
  }, [socket]);


  const sendMsg = () => {
    if (msg.trim() != ''){
      socket.emit('message', msg, userIs);
      setMsg('')
    }
  }

  const connectToRandomUser = () =>{
    setSearching(true)
    const roomId = uuidv4()
    socket.emit('joinRoom', roomId, 1);
  }
  
  const disconnectUser = () =>{
    socket.emit('leaveRoom')
  }

  const handleMsgChange = (e) =>{
    setMsg(e.target.value)
  }

  return (
    <>
        <div className='chat-container'>
            <div className='chat-show'>
            <div className='the-chat'>
                {msgList.map((theMsg, i)=>{
                  return <p key={i}><span className={theMsg.socketUser}>{theMsg.user}</span> : {theMsg.message}</p>
                })}
                <p ref={scrollRef}/>
              </div>
            </div>
            <div className='chat-input' onKeyDown={(e)=>{
              if (e.key === 'Escape' && searching === true){
                disconnectUser()
              }
            }}>
                { !searching ? <button className='refresh' onClick={connectToRandomUser}>New <br/> esc</button> : <button className='stop-user' onClick={disconnectUser}>STOP</button>}
                <input className='type-text' onKeyDown={(e)=>{
                  if (e.key == 'Enter'){
                    sendMsg()
                  }
                }} type='text' value={msg} onChange={handleMsgChange} maxLength={50}></input>
                <button className='enter-input' onClick={sendMsg} disabled={found ? false : true}>Send</button>
            </div>
        </div>
    </>
  )
}

export default Chat