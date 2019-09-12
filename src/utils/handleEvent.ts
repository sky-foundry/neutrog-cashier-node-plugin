import { Request } from 'express'
import handleAppHook from './handleAppHook'
import handleInitializeCheckout from './handleInitializeCheckout'

const handleEvent = (req: Request) => {
  switch (req.body.event) {
    case 'initialize_checkout':
      return handleInitializeCheckout(req)
    case 'app_hook':
      return handleAppHook(req)
    default:
      return []
  }
}

export default handleEvent
