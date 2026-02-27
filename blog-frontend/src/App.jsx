import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import API, { getCurrentUser } from './api/api'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/Profile'


const App = () => {
  // const [loggedIn, setLoggedIn] = useState(false)


  const [user, setUser] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(()=>{
    const fetchUser = async () => {

      const loggedInUser = await getCurrentUser()
      if (loggedInUser){
        setUser(loggedInUser)
      }
    }
    fetchUser()
  }, [])


  useEffect(() => {
    if (!toast.message) return

    const timer = setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }
  
const handleLogout = async () => {
  await API.post("/auth/logout", {}, { withCredentials: true }); // clear token
  setUser(null);
  showToast('Logout successful!');
};

  return (
    <Router>
        
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover newestOnTop draggable={false} />
        <Routes>
        <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/" element={<Home loggedInUser={user} onLogout={handleLogout} onSuccess={showToast} />} />
          <Route path="/login" element={<Login onLogin={setUser} onSuccess={showToast} />} /> 
          <Route path="/register" element={<Register onRegister={setUser} onSuccess={showToast} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
  )
}


export default App