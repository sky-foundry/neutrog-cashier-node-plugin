import { RequestHandler } from 'express'
import request from 'request-promise'

const handler: RequestHandler = (req, res) => {
  const platform = req.query.platform
  const shop = req.query.shop
  const code = req.query.code

  if (
    typeof code === 'undefined' ||
    typeof platform === 'undefined' ||
    typeof shop === 'undefined'
  ) {
    res.status(400).send('Error: "shop" is required')
  }

  const domain = process.env.CASHIER_DOMAIN
  const requestData = {
    client_id: process.env.CASHIER_CLIENT_ID,
    client_secret: process.env.CASHIER_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
  }

  request({
    json: requestData,
    method: 'POST',
    url: `https://${domain}/api/v1/${platform}/${shop}/oauth/access_token`,
  })
    .then(resp => {
      // TODO: save access_token in order to perform Cashier API calls

      // at this point the app is free to redirect the user wherever it wants
      // this example redirects back into the Cashier admin
      res.redirect(`https://${domain}/admin/${platform}/${shop}/marketplace`)
    })
    .catch(err => {
      // TODO: report error
      res.status(500).end()
    })
}

export default handler
