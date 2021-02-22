import express from 'express'
const app = express()

app.get('/auth/google/callback', (req, res) => {
  res.sendFile('./view/index.html', { root: __dirname })
})

export default app
