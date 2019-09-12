import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res) => {
  res.send({
    reference_id: 'payment-12345',
    success: true,
  })
}

export default handler
