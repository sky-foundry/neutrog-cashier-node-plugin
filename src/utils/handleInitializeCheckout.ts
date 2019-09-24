import { Request } from 'express'

interface PickupAddress {
  address: string
  city: string
  country: string
  name: string
  province: State
  storeId: string
  zipCode: string
}

enum State {
  'New South Wales' = 'NSW',
  'Queensland' = 'QLD',
  'South Australia' = 'SA',
  'Tasmania' = 'TAS',
  'Victoria' = 'VIC',
  'Western Australia' = 'WA',
  'Australian Capital Territory' = 'ACT',
  'Northern Territory' = 'NT',
}

const states = {
  ACT: 'Australian Capital Territory',
  NSW: 'New South Wales',
  NT: 'Northern Territory',
  QLD: 'Queensland',
  SA: 'South Australia',
  TAS: 'Tasmania',
  VIC: 'Victoria',
  WA: 'Western Australia',
}

const handleInitializeCheckout = (req: Request) => {
  const pickupAddress: PickupAddress = JSON.parse(
    req.body.cart.attributes.Pickup_Store_JSON
  )

  const state = states[pickupAddress.province] || ''

  return [
    {
      data: {
        address: pickupAddress.address,
        address2: '',
        city: pickupAddress.city,
        company: pickupAddress.name,
        country: pickupAddress.country,
        country_code: 'AU',
        different_billing_address: true,
        first_name: 'Neutrog',
        last_name: 'Shop',
        phone: '+61 8 8538 3500',
        postal_code: pickupAddress.zipCode,
        province: state,
        province_code: pickupAddress.province,
        update_billing: false,
      },
      type: 'CHANGE_SHIPPING_ADDRESS',
    },
    {
      data: {
        frame_origin: process.env.APP_URL,
        name: 'my_payments_widget',
        position: 'payment_gateway',
        source: process.env.APP_URL + '/widget',
        type: 'iframe',
      },
      type: 'APP_UPDATE_WIDGET',
    },
  ]
}

export default handleInitializeCheckout
