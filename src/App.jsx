import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Upload from './pages/Upload'
import GLCodes from './pages/GLCodes'
import styles from './App.module.css'

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Navbar />
        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/gl-codes" element={<GLCodes />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
