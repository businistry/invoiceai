import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './GLCodes.module.css'

const GLCodes = () => {
  const [glCodes, setGLCodes] = useState([])
  const [newCode, setNewCode] = useState({ code: '', description: '', keywords: '' })
  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchGLCodes()
  }, [])

  const fetchGLCodes = async () => {
    try {
      const response = await axios.get('/api/glcodes')
      setGLCodes(response.data)
    } catch (error) {
      console.error('Error fetching GL codes:', error)
    }
  }

  const handleInputChange = (e) => {
    setNewCode({ ...newCode, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/glcodes', newCode)
      setNewCode({ code: '', description: '', keywords: '' })
      fetchGLCodes()
    } catch (error) {
      console.error('Error submitting GL Code:', error)
    }
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/query-glcodes', { invoiceText: searchText })
      setSearchResult(response.data)
    } catch (error) {
      console.error('Error querying GL Code:', error)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('glcodes', file)

    try {
      const response = await axios.post('/api/upload-glcodes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert(response.data.message)
      fetchGLCodes()
    } catch (error) {
      console.error('Error uploading GL Codes file:', error)
    }
  }

  return (
    <div className={styles.glCodes}>
      <h2>GL Codes</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="code"
          value={newCode.code}
          onChange={handleInputChange}
          placeholder="GL Code"
          required
        />
        <input
          type="text"
          name="description"
          value={newCode.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="keywords"
          value={newCode.keywords}
          onChange={handleInputChange}
          placeholder="Keywords (comma-separated)"
        />
        <button type="submit">Add GL Code</button>
      </form>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search GL Codes by invoice text"
        />
        <button type="submit">Search</button>
      </form>
      {searchResult && (
        <div>
          <h3>Search Result</h3>
          <p>GL Code: {searchResult.suggestedGLCode}</p>
          <p>Description: {searchResult.description}</p>
        </div>
      )}
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} accept=".csv, .json" />
        <button type="submit">Upload GL Codes</button>
      </form>
      <table className={styles.glCodesTable}>
        <thead>
          <tr>
            <th>GL Code</th>
            <th>Description</th>
            <th>Keywords</th>
          </tr>
        </thead>
        <tbody>
          {glCodes.map((code) => (
            <tr key={code.id}>
              <td>{code.code}</td>
              <td>{code.description}</td>
              <td>{code.keywords}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GLCodes
