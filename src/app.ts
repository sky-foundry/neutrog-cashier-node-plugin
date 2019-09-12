import bodyParser from 'body-parser'
import express from 'express'

// Middleware imports
import verifySignature from './middleware/verifySignature'

// Route imports
import routeCashierEvent from './routes/cashierEvent'
import routeCheckout from './routes/checkout'
import routeIndex from './routes/index'
import routeOauthAuthorize from './routes/oauthAuthorize'
import routeOauthRedirect from './routes/oauthRedirect'
import routeOauthUninstalled from './routes/oauthUninstalled'
import routePaymentCapture from './routes/paymentCapture'
import routePaymentPreauth from './routes/paymentPreauth'
import routePaymentRefund from './routes/paymentRefund'
import routeWidget from './routes/widget'

const app = express()

app.use(bodyParser.json())

// Routes
app.get('/', routeIndex)

app.get('/checkout', routeCheckout)

app.get('/widget', routeWidget)

// request expects two different query string parameters,
//  platform: e.g. shopify
//  shop: e.g. example.myshopify.com
app.get('/oauth/redirect', routeOauthRedirect)

// request expects three different query string parameters,
//  platform: e.g. shopify
//  shop: e.g. example.myshopify.com
//  code: a temporary authorization code which you can exchange for a Cashier access token
app.get('/oauth/authorize', routeOauthAuthorize)

app.post('/oauth/uninstalled', verifySignature, routeOauthUninstalled)

app.post('/cashier/event', verifySignature, routeCashierEvent)

app.post('/payment/preauth', verifySignature, routePaymentPreauth)

app.post('/payment/capture', verifySignature, routePaymentCapture)

app.post('/payment/refund', verifySignature, routePaymentRefund)

export default app
