import path from 'path'
import http from 'http'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const viewHtml = fs.readFileSync(__dirname + '/view/index.html')

export const server = http.createServer()

server.on('request', (req, res) => {
  const { url } = req
  if (url.match('/auth/google/callback')) {
    res.writeHeader(200, { 'Content-Type': 'text/html' })
    res.write(viewHtml)
    res.end()
  }
})
