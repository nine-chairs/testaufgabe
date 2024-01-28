import React from 'react'
import Calculator from './components/Calculator/Calculator'
import './App.css'
import logo from './images/wolt-logo.png'

function App() {
  return (
    <>
      <img className='woltLogo' src={logo} alt={'wolt-logo'}></img>
      <Calculator />
    </>
  )
}

export default App
