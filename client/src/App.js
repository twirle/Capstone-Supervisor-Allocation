import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthContext } from './context/AuthContext'

function App() {
  const { user, loading } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={!loading && (user ? <Home /> : <Navigate to="/login" />)}
            />
            <Route
              path="/login"
              element={!loading && (!user ? <Login /> : <Navigate to="/" />)}
            />
            <Route
              path="/signup"
              element={!loading && (!user ? <Signup /> : <Navigate to="/" />)}
            />
          </Routes>
        </div>
      </BrowserRouter >
    </div >
  );
}


export default App;