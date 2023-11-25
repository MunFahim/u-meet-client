//import React from 'react'
import { useState } from 'react'
import './index.css'
function Username(props) {
  const [user, setUser] = useState('')
  return (
    <div className='setUser'>
      <div className='userContent'>
        <h1 className='uMeetWelcome'>Welcome to U-Meet</h1>
        <p>Current supported browsers are: Google Chrome, Edge, and Safari</p>
        <p><strong>Note: </strong> if server isnt working waiting a few seconds for it to connection</p>
        <p>Make sure to have fun and be nice !</p>
        <div className='userEnter'>
          <input className='userInput' required={true} type='text'  onChange={(e)=>{
            setUser(e.target.value)
          }} minLength={3} maxLength={10} placeholder='Enter desired username'></input>
          <button type="submit" className='submitUserInput' onClick={()=>{
            // eslint-disable-next-line react/prop-types
            props.handleUser(user)
          }}>Start Chatting</button>
        </div>
      </div>
    </div>
  )
}

export default Username