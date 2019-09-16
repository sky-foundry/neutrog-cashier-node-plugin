import { Request } from 'express'

const handleInitializeCheckout = (req: Request) => {
  console.log('Initialized Checkout event recieved', JSON.stringify(req.body))

  return [
    {
      // data: req.body.custom_data,
      data: {
        address: '50 Fultz Blvd',
        address2: 'Another Address Line',
        city: 'Winnipeg',
        company: 'Bold Commerce Ltd',
        country: 'Canada',
        country_code: 'CA',
        different_billing_address: true,
        first_name: 'John',
        last_name: 'Doe',
        phone: '204-678-9087',
        postal_code: 'R3Y 0L6',
        province: 'Manitoba',
        province_code: 'MB',
        update_billing: true,
      },
      type: 'CHANGE_SHIPPING_ADDRESS',
    },
  ]
}

export default handleInitializeCheckout
