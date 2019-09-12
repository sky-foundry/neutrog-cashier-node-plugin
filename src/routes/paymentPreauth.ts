import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res) => {
  if (req.body.payment.value >= 100000) {
    res.send({
      error: 'payment exceeds maximum value',
      success: false,
    })
  } else {
    res.send({
      reference_id: 'payment-12345',
      success: true,
    })
  }
}

export default handler
