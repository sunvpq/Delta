import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Extract from './pages/Extract'
import Browse from './pages/Browse'
import TraceDetail from './pages/TraceDetail'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-navy font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/traces/:id" element={<TraceDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
