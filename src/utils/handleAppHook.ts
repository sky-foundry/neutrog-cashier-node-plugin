import { Request } from 'express'

const handleAppHook = (req: Request) => {
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

export default handleAppHook
