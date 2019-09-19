import { Request } from 'express'

interface PickupAddress {
  address: string
  city: string
  country: string
  name: string
  province: string
  storeId: string
  zipCode: string
}

const handleInitializeCheckout = (req: Request) => {
  // console.log('Initialized Checkout event recieved', JSON.stringify(req.body))
  const pickupAddress: PickupAddress = JSON.parse(
    req.body.attributes.addressJson
  )

  console.log('')
  console.log('PICKUP ADDRESS RECEIVED:    ', JSON.stringify(pickupAddress))
  console.log('')

  return [
    {
      // data: req.body.custom_data,
      data: {
        address: pickupAddress.address,
        // address2: 'Another Address Line',
        city: pickupAddress.city,
        // company: 'Bold Commerce Ltd',
        country: pickupAddress.country,
        // country_code: 'CA',
        different_billing_address: true,
        first_name: pickupAddress.name,
        // last_name: 'Doe',
        // phone: '204-678-9087',
        postal_code: pickupAddress.zipCode,
        // province: 'Manitoba',
        province_code: pickupAddress.province,
        update_billing: true,
      },
      type: 'CHANGE_SHIPPING_ADDRESS',
    },
  ]
}

export default handleInitializeCheckout
