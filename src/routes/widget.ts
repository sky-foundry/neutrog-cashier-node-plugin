import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res) => {
  res.sendFile('views/widget.html', { root: __dirname })
}

export default handler
