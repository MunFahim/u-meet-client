//import React from 'react'
import './navbar.css'
import logo from './../../images/logo.png'
import logoTxt from './../../images/textLogo.png'
function Navbar() {
  return (
    <>
        <nav className='nav-bar'>
            <div className="nav-start">
                <img style={{height: '60px'}}src={logo}></img>
                <img src={logoTxt} style={{height: '60px', width: '80px'}} />
            </div>
            <div className="nav-end">
                <ul>
                    <li>google</li>
                    <li>twitter</li>
                </ul>
            </div>
        </nav>
    </>
  )
}

export default Navbar