import { RequestHandler } from 'express'
import httpsig from 'http-signature'

export const verifySignature: RequestHandler = (req, res, next) => {
  try {
    // verify Cashier's HTTP signature
    // this is required in order to verify that the request originated from Cashier
    const parsed = httpsig.parse(req)
    httpsig.verifyHMAC(parsed, process.env.CASHIER_CLIENT_SECRET)
    next()
  } catch (error) {
    res.status(401).end()
  }
}
