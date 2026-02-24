import React, { useState } from 'react'
import PostList from './components/PostList'
import Home from './pages/Home'
import Login from './pages/Login'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  return loggedIn ? (
      <Home/>
  ) : (
    <Login onLogin={()=> setLoggedIn(true)}/>
  )
}

export default App