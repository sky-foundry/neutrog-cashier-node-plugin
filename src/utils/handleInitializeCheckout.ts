import { Request } from 'express'

const handleInitializeCheckout = (req: Request) => {
  return [
    {
      data: req.body.custom_data,
      type: 'CHANGE_SHIPPING_ADDRESS',
    },
  ]
}

export default handleInitializeCheckout
