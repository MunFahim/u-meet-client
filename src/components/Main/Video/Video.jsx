//import React from 'react'
import {useRef, useEffect, useState, useMemo} from 'react'
//import { io } from 'socket.io-client'
import {Peer} from 'peerjs'
import './video.css'

// eslint-disable-next-line react/prop-types
function Video({ useSocket }) {

  const socket = useSocket;
  //const [userId, setUserId] = useState(null);
  //const [videoStream, setVideoStream] = useState(null);
  //const [secUserStream, setSecUserStream] = useState();
  const [id, setId] = useState('');

  const userVideoRef = useRef(null);
  const videoRef = useRef(null);
  const callRef = useRef(null);
  const peerRef = useRef(null)
  const [found, setFound] = useState(false)
  useEffect(()=>{
    if (!found){
    const peer = new Peer({
      host: 'u-meet-peerserver.onrender.com',
      port: 443,
      path: '/',
      secure: true
    })
    //console.log('testing')
    peer.on('open', (id)=>{
      setId(id)
      //console.log(id)
    })
    setFound(true)
    peerRef.current = peer
    }
    return () => {
      // Clean up Peer when the component is unmounted
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  },[found])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      //setVideoStream(stream);
    }).catch(error=>{
      console.log('could not get camera media', error)
    });

  }, []);

  useEffect(() => {
    const handleUserConnected = () => {
      //console.log('connected')
      const video = videoRef.current.srcObject;
      socket.emit('show-room', id);
      socket.on('user-connected', (newData)=>{
        const call = peerRef.current.call(newData, video);
        callRef.current = call;
        call.on('stream', (userVideo) => {
          userVideoRef.current.srcObject = userVideo;
        });
      })
      peerRef.current.on('call', call =>{
        call.answer(video)
        call.on('stream', userVideo=>{
          userVideoRef.current.srcObject = userVideo
        })
      })
    };

    if (socket) {
      socket.on('connectedUserRoom', handleUserConnected);
      socket.on('leaveRoom', closeVideo);
    }

    return () => {
      // Clean up event listeners when the component is unmounted
      if (socket) {
        socket.off('connectedUserRoom', handleUserConnected);
        socket.off('leaveRoom', closeVideo);
      }
    };
  }, [socket, id]);

  const closeVideo = () => {
    //setUserId(null);
    if (peerRef.current) {
      peerRef.current.destroy();
      setFound(false)
    }
    userVideoRef.current.srcObject = null;
    if (callRef.current) {
      callRef.current.close();
    }
  };


  return (
    <>
        <div className='video-container'>
            <div className='video-box user-two'>
              <video className='user-video' style={{minHeight: '410px', height: '100%', width: 'auto', maxWidth:'100%',borderRadius: '4px', objectFit: 'contain'}} ref={userVideoRef} playsInline autoPlay muted={false}></video> 
            </div>
            <div className='video-box user-one'>
              <video className='user-video' style={{minHeight: '410px', height: '100%', width: 'auto', maxWidth:'100%', borderRadius: '4px', objectFit: 'contain'}} ref={videoRef} playsInline autoPlay muted={true}></video>
            </div>
        </div>
    </>
  )
}

export default Video