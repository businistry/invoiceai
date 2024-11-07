import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './GLCodes.module.css'

const GLCodes = () => {
  const [glCodes, setGLCodes] = useState([])
  const [newCode, setNewCode] = useState({ code: '', description: '', keywords: '' })
  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState(null)

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
