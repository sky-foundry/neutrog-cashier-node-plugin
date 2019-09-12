import bodyParser from 'body-parser'
import express, { Request } from 'express'
import request from 'request-promise'

import { verifySignature } from './middleware'

// Route imports
import routeCheckout from './routes/checkout'

const app = express()

app.use(bodyParser.json())

// Routes
app.get('/checkout', routeCheckout)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/widget', (req, res) => {
  res.sendFile('views/widget.html', { root: __dirname })
})

// request expects two different query string parameters,
//  platform: e.g. shopify
//  shop: e.g. example.myshopify.com
app.get('/oauth/redirect', (req, res) => {
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
})

// request expects three different query string parameters,
//  platform: e.g. shopify
//  shop: e.g. example.myshopify.com
//  code: a temporary authorization code which you can exchange for a Cashier access token
app.get('/oauth/authorize', (req, res) => {
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
})

app.post('/oauth/uninstalled', verifySignature, (req, res) => {
  const platform = req.query.platform
  const shop = req.query.shop

  // TODO: mark shop as uninstalled in database

  res.send()
})

app.post('/cashier/event', verifySignature, (req, res) => {
  // res.send(req.body.event);
  const actions = handleEvent(req)

  res.send({
    actions,
    success: true,
  })
})

app.post('/payment/preauth', verifySignature, (req, res) => {
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
})

app.post('/payment/capture', verifySignature, (req, res) => {
  res.send({
    reference_id: 'payment-12345',
    success: true,
  })
})

app.post('/payment/refund', verifySignature, (req, res) => {
  res.send({
    reference_id: 'payment-12345',
    success: true,
  })
})

function handleEvent(req: Request) {
  switch (req.body.event) {
    case 'initialize_checkout':
      return handleInitializeCheckout(req)
    case 'app_hook':
      return handleAppHook(req)
    default:
      return []
  }
}

function handleInitializeCheckout(req: Request) {
  return [
    {
      data: {
        frame_origin: process.env.APP_URL,
        name: 'my_payments_widget',
        position: 'payments',
        source: process.env.APP_URL + '/widget',
        type: 'iframe',
      },
      type: 'APP_UPDATE_WIDGET',
    },
    {
      data: {
        click_hook: 'apply_discount',
        icon: 'https://via.placeholder.com/50x50.png',
        name: 'my_discount_widget',
        position: 'discount',
        text: 'Discount 5%',
        type: 'app_hook',
      },
      type: 'APP_UPDATE_WIDGET',
    },
    {
      data: {
        click_hook: 'add_payment',
        name: 'my_payment_method',
        position: 'payment_gateway',
        text: 'Pay via the honor system',
        type: 'app_hook',
      },
      type: 'APP_UPDATE_WIDGET',
    },
  ]
}

function handleAppHook(req: Request) {
  switch (req.body.properties.hook) {
    case 'apply_discount':
      return [
        {
          data: {
            discountPercentage: 5,
            transformationMessage: 'Money saved',
          },
          type: 'DISCOUNT_CART',
        },
        {
          data: {
            click_hook: 'already_used',
            icon: 'https://via.placeholder.com/50x50.png',
            name: 'my_discount_widget',
            position: 'discount',
            text: "You're welcome",
            type: 'app_hook',
          },
          type: 'APP_UPDATE_WIDGET',
        },
      ]
    case 'already_used':
      return [
        {
          data: {
            click_hook: 'already_used',
            icon: 'https://via.placeholder.com/50x50.png',
            name: 'my_discount_widget',
            position: 'discount',
            text: "You've already used the discount",
            type: 'app_hook',
          },
          type: 'APP_UPDATE_WIDGET',
        },
      ]
    case 'add_payment':
      return [
        {
          data: {
            currency: req.body.order.currency,
            gateway_name: 'Honor System',
            line_text: 'Payment via honor system',
            value: req.body.order.order_total,
          },
          type: 'ADD_PAYMENT',
        },
      ]
    default:
      return []
  }
}

export default app
