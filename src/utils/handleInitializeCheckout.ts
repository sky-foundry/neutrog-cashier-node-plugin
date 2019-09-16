import { Request } from 'express'

const handleInitializeCheckout = (req: Request) => {
  console.log('inital checkout req', req.body)

  return [
    {
      data: req.body.custom_data,
      type: 'CHANGE_SHIPPING_ADDRESS',
    },
  ]
}

export default handleInitializeCheckout
