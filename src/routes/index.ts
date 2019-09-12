import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res) => {
  res.send('Hello World!')
}

export default handler
