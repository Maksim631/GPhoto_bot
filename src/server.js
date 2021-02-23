import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.get('/auth/google/callback', (req, res) => {
  res.sendFile('./view/index.html', { root: __dirname })
})

export default app
