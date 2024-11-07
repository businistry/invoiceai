import React, { useState } from 'react'
import axios from 'axios'
import styles from './Upload.module.css'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('invoice', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage(`File ${response.data.filename} uploaded successfully`)
    } catch (error) {
      setMessage('Error uploading file')
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.upload}>
      <h2>Upload Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf" />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload Invoice'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default Upload
