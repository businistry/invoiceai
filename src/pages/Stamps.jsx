import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './Stamps.module.css'

const Stamps = () => {
  const [stamps, setStamps] = useState([])
  const [newStamp, setNewStamp] = useState({ name: '', file: null })

  useEffect(() => {
    fetchStamps()
  }, [])

  const fetchStamps = async () => {
    try {
      const response = await axios.get('/api/stamps')
      setStamps(response.data)
    } catch (error) {
      console.error('Error fetching stamps:', error)
    }
  }

  const handleInputChange = (e) => {
    if (e.target.name === 'file') {
      setNewStamp({ ...newStamp, file: e.target.files[0] })
    } else {
      setNewStamp({ ...newStamp, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', newStamp.name)
    formData.append('file', newStamp.file)

    try {
      await axios.post('/api/stamps', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setNewStamp({ name: '', file: null })
      fetchStamps()
    } catch (error) {
      console.error('Error submitting stamp:', error)
    }
  }

  return (
    <div className={styles.stamps}>
      <h2>Manage Stamps</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={newStamp.name}
          onChange={handleInputChange}
          placeholder="Stamp Name"
          required
        />
        <input
          type="file"
          name="file"
          onChange={handleInputChange}
          accept=".png"
          required
        />
        <button type="submit">Add Stamp</button>
      </form>
      <div className={styles.stampGrid}>
        {stamps.map((stamp) => (
          <div key={stamp.id} className={styles.stampItem}>
            <img src={`/api/stamps/${stamp.id}`} alt={stamp.name} />
            <p>{stamp.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stamps
