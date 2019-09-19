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

// enum State {
//   NSW = 'New South Wales',
//   QLD = 'Queensland',
//   SA = 'South Australia',
//   TAS = 'Tasmania',
//   VIC = 'Victoria',
//   WA = 'Western Australia',
//   ACT = 'Australian Capital Territory',
//   NT = 'Northern Territory',
// }

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
  // console.log('Initialized Checkout event recieved', JSON.stringify(req.body))
  const pickupAddress: PickupAddress = JSON.parse(
    req.body.cart.attributes.addressJson
  )

  console.log('')
  console.log('PICKUP ADDRESS RECEIVED:    ', JSON.stringify(pickupAddress))
  console.log('')

  const state = states[pickupAddress.province] || ''

  return [
    {
      // data: req.body.custom_data,
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
  ]
}

export default handleInitializeCheckout
