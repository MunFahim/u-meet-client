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
                    <li><a className="nav-link" href="https://github.com/MunFahim" target="_blank" rel="noopener noreferrer">Creator</a></li>
                </ul>
            </div>
        </nav>
    </>
  )
}

export default Navbar