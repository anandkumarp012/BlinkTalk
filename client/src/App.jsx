import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/authContextStore'
import assets from './assets/assets'
import { Particles } from '@/components/ui/particles'

const App = () => {
const { authUser } = useContext(AuthContext)

  return (
    <div className="relative min-h-screen bg-contain overflow-hidden" style={{ backgroundImage: `url(${assets.bgImage})`, backgroundColor: '#0a0a0a' }}>
      <Particles
        className="absolute inset-0 z-0"
        quantity={200}
        ease={80}
        color="#ffffff"
        refresh
      />
      <div className="relative z-10 h-full w-full">
        <Toaster />
        <Routes>
          <Route path='/' element={authUser? <Home />: <Navigate to="/login"/>} /> 
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/"/>} /> 
          <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login"/>} /> 
        </Routes>
      </div>
    </div>
  )
}

export default App