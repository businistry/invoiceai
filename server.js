import express from 'express'
import sqlite3 from 'sqlite3'
import multer from 'multer'
import { Configuration, OpenAIApi } from 'openai'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

const app = express()
const port = 3000

app.use(express.json())

// Set up SQLite database
const db = new sqlite3.Database('./invoices.db')

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS gl_codes (id INTEGER PRIMARY KEY, code TEXT, description TEXT, keywords TEXT)")
  db.run("CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY, filename TEXT, gl_code TEXT, amount REAL, date TEXT)")
})

// Set up file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

// Set up OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// API routes
app.post('/api/upload', upload.single('invoice'), (req, res) => {
  const { filename } = req.file
  res.json({ filename })
})

app.post('/api/glcodes', (req, res) => {
  const { code, description, keywords } = req.body
  db.run("INSERT INTO gl_codes (code, description, keywords) VALUES (?, ?, ?)", [code, description, keywords], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'GL Code added successfully' })
  })
})

app.get('/api/glcodes', (req, res) => {
  db.all("SELECT * FROM gl_codes", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

app.get('/api/annotate/:filename', async (req, res) => {
  const { filename } = req.params

  try {
    // 1. Extract text from PDF
    const pdfBytes = fs.readFileSync(`uploads/${filename}`)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const text = await pages[0].getTextContent()

    // 2. Query OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Based on the following invoice text, suggest an appropriate GL code:\n\n${text}\n\nGL Code:`,
      max_tokens: 10,
    })

    const suggestedGLCode = completion.data.choices[0].text.trim()

    // 3. Annotate PDF
    const stampText = `GL Code: ${suggestedGLCode}\nAmount: $X,XXX.XX\nDate: MM/DD/YYYY`
    const { width, height } = pages[0].getSize()
    pages[0].drawText(stampText, {
      x: 50,
      y: height - 100,
      size: 12,
    })

    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(`annotated/${filename}`, pdfBytes)

    res.json({ message: 'Invoice annotated successfully', suggestedGLCode })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
