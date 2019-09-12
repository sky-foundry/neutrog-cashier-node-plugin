import { Request } from 'express'

const handleInitializeCheckout = (req: Request) => {
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

export default handleInitializeCheckout
