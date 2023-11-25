import { useEffect } from 'react'
//import React from 'react'
import './chat.css'
import {useState } from 'react'
//import io from 'socket.io-client'


// eslint-disable-next-line react/prop-types
function Chat({useSocket, userIs}) {
  let socket = useSocket
  // checks if user is searching or connected to socket
  const [searching, setSearching] = useState(false)
  const [found, setFound] = useState(false)
  const [msg, setMsg] = useState('')

  // array of messages to be rendered
  let [msgList, setMsgList] = useState([
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
        console.log('sending msgg')
        setMsg('')
      }
    }

  const connectToRandomUser = () =>{
    setSearching(true)
    const roomId = Math.random().toString(36).substring(7);
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
              {msgList.map((theMsg, i)=>{
                return <p key={i}><span className={theMsg.socketUser}>{theMsg.user}</span> : {theMsg.message}</p>
              })}
              
            </div>
            <div className='chat-input' onKeyDown={(e)=>{
              if (e.key === 'Escape' && searching === true){
                disconnectUser()
              }
            }}>
                { !searching ? <button className='refresh' onClick={connectToRandomUser}>New <br/> esc</button> : <button className='refresh' onClick={disconnectUser}>STOP</button>}
                <input className='type-text' onKeyDown={(e)=>{
                  if (e.key == 'Enter'){
                    sendMsg()
                  }
                }} type='text' value={msg} onChange={handleMsgChange} maxLength={50}></input>
                <button className='enter-input' onClick={sendMsg} disabled={found ? false : true}>Enter</button>
            </div>
        </div>
    </>
  )
}

export default Chat