import Axios from 'axios'
import { createHmac } from 'crypto'
import { RequestHandler } from 'express'
import Shopify from 'shopify-api-node'

export interface Cart {
  token: string
  note?: null
  attributes: {}
  original_total_price: number
  total_price: number
  total_discount: number
  total_weight: number
  item_count: number
  items?: Array<{
    id: number
    properties: {}
    quantity: number
    variant_id: number
    key: string
    title: string
    price: number
    original_price: number
    discounted_price: number
    line_price: number
    original_line_price: number
    total_discount: number
    discounts?: (null)[] | null
    sku: string
    grams: number
    vendor: string
    taxable: boolean
    product_id: number
    product_has_only_default_variant: boolean
    gift_card: boolean
    final_price: number
    final_line_price: number
    url: string
    featured_image?: (null)[] | null
    image: string
    handle: string
    requires_shipping: boolean
    product_type: string
    product_title: string
    product_description: string
    variant_title?: null
    variant_options?: (null)[] | null
    options_with_values?: (null)[] | null
    line_level_discount_allocations?: (null)[] | null
  }> | null
  requires_shipping: boolean
  currency: string
  items_subtotal_price: number
  cart_level_discount_applications?: (null)[] | null
}

export interface BoldCart {
  cart: {
    id?: number
    weight: number
    item_count: number
    requires_shipping: boolean
    currency?: string
    override_shipping: boolean
    line_items?: Array<{
      id: number
      quantity: number
      title: string
      variant_title: string
      weight: number
      taxable: boolean
      image: string
      requires_shipping: boolean
      price: string | number
    }> | null
  }
  customer?: {
    id: number
    email: string
    first_name: string
    last_name: string
    addresses?: Array<{
      first_name: string
      last_name: string
      company: string
      address1: string
      address2: string
      city: string
      province: string
      country: string
      zip: string
      country_code: string
      province_code: string
      default: boolean
    }> | null
  }
  shipping_lines?: Array<{
    display_text: string
    value: number
  }> | null
}

const shopify = new Shopify({
  apiKey: '5a12fd5bc0ffa9010a021da7318eb31b',
  password: '47382b1a66c325712be1b57c8b9b1906',
  shopName: 'poo-bah-club',
})

const handler: RequestHandler = async (req, res) => {
  const cartID = '96166bf7a6bc906a1993231a1e38c685'
  const customerID = 995610984514

  const existingCart = (await Axios.get(
    `https://${process.env.SHOPIFY_STORE}.myshopify.com/cart.js`,
    {
      headers: {
        Cookie: `cart=${cartID};`,
      },
    }
  )).data as Cart

  const customer = await shopify.customer.get(customerID)

  const boldCart: BoldCart = {
    // id: not needed, it will be generated
    cart: {
      item_count: existingCart.item_count,
      line_items: existingCart.items.map(item => ({
        id: item.id,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        requires_shipping: item.requires_shipping,
        taxable: item.taxable,
        title: item.title,
        variant_title: item.variant_title,
        weight: 0,
      })),
      override_shipping: true,
      requires_shipping: true,
      weight: existingCart.total_weight,
    },
    customer: customer as BoldCart['customer'],
    shipping_lines: [
      {
        display_text: 'Pickup',
        value: 0,
      },
    ],
  }

  console.log('Bold Cart data', boldCart)

  const hmac = createHmac('sha256', process.env.CASHIER_CLIENT_SECRET)
    .update(`cart_id=${cartID}:shop=${process.env.SHOPIFY_STORE}.myshopify.com`)
    .digest('hex')

  const cashierResp = await Axios.get(
  `https://${process.env.SHOPIFY_STORE}.myshopify.com/cart.js`,
    {
      headers: {
        'X-Bold-Checkout-Access-Token': process.env.CASHIER_API_ACCESS_TOKEN,
      },
    }
  )

  console.log('cashier respon', cashierResp)

}

export default handler
