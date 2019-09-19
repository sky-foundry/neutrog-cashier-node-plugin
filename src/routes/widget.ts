import { RequestHandler } from 'express'
import path from 'path'

const handler: RequestHandler = (req, res) => {
  res.sendFile('views/widget.html', { root: path.join(__dirname, '..') })
}

export default handler
