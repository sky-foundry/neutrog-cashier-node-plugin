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
  'NSW' = 'New South Wales',
  'QLD' = 'Queensland',
  'SA' = 'South Australia',
  'TAS' = 'Tasmania',
  'VIC' = 'Victoria',
  'WA' = 'Western Australia',
  'ACT' = 'Australian Capital Territory',
  'NT' = 'Northern Territory',
}

const states = {
  'Australian Capital Territory': 'ACT',
  'New South Wales': 'NSW',
  'Northern Territory': 'NT',
  'Queensland': 'QLD',
  'South Australia': 'SA',
  'Tasmania': 'TAS',
  'Victoria': 'VIC',
  'Western Australia': 'WA'
}

const handleInitializeCheckout = (req: Request) => {

  // fail gracefully where the request does not have a pick up address
  if (
    !req.body &&
    !req.body.cart &&
    !req.body.cart.attributes &&
    !req.body.cart.attributes.Pickup_Store_JSON
    ) {
    return []
  }

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
        province: pickupAddress.province,
        province_code: state,
        update_billing: false,
      },
      type: 'CHANGE_SHIPPING_ADDRESS',
    },
  ]
}

export default handleInitializeCheckout
