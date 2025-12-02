import { useState } from 'react'
import { AuthPage } from './pages/authpage'
import { Homepage } from './pages/Homepage'
import { LandingPage } from './pages/LandingPage'
import { MyBooks } from './pages/MyBooks'
import { Profile } from './pages/Profile'
import { BookDetail } from './pages/BookDetail'
import { Wishlist } from './pages/Wishlist'
import { Messages } from './pages/Messages'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './context/authContext'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return children;
}

function LandingWrapper() {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/home" />;
  }
  return <LandingPage />;
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/' element={<LandingWrapper />} />
          <Route path='/home' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path='/my-books' element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path='/messages' element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/books/:id' element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
