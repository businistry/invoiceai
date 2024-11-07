import React, { useState } from 'react'
import axios from 'axios'

const GLCodeForm = () => {
  const [glCode, setGLCode] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/glcodes', { glCode, description })
      setGLCode('')
      setDescription('')
      alert('GL Code submitted successfully')
    } catch (error) {
      console.error('Error submitting GL Code:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit GL Code</h2>
      <input
        type="text"
        value={glCode}
        onChange={(e) => setGLCode(e.target.value)}
        placeholder="GL Code"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit">Submit GL Code</button>
    </form>
  )
}

export default GLCodeForm
