import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res) => {
  const domain = process.env.CASHIER_DOMAIN
  const clientID = process.env.CASHIER_CLIENT_ID

  const platform = req.query.platform
  const shop = req.query.shop

  if (typeof platform === 'undefined' || typeof shop === 'undefined') {
    res.status(400).send('Error: "shop" is required')
  }

  const scope = ['add_payments', 'modify_cart', 'provide_shipping_rates'].join(
    ' '
  )

  res.redirect(
    `https://${domain}/api/v1/${platform}/${shop}/oauth/authorize?client_id=${clientID}&scope=${scope}&response_type=code`
  )
}

export default handler
