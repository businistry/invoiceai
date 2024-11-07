import React, { useState } from 'react'
import axios from 'axios'

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('invoice', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onUpload(response.data)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button type="submit">Upload Invoice</button>
    </form>
  )
}

export default FileUpload
