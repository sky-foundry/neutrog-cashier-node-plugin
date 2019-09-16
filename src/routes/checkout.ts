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

  const data = {
    client_id: 'e9e5a91e-afa7-498a-ba78-5fbe39ee5bf0',
      client_secret: '48c76a83b793c5735f93a760640c9737b0af8ac8',
      // tslint:disable-next-line: object-literal-sort-keys
      cart: {
          weight: 100,
          // tslint:disable-next-line: object-literal-sort-keys
          item_count: 3,
          requires_shipping: true,
          currency: 'CAD',
          override_shipping: true,
          line_items: [
              {
                  id: 112233,
                  quantity: 2,
                  title: 'Product Title',
                  variant_title: 'Variant Title',
                  weight: 50,
                  // tslint:disable-next-line: object-literal-sort-keys
                  taxable: true,
                  image: 'https://example.com/thing.jpg',
                  requires_shipping: true,
                  price: '2000'
              },
              {
                  id: 112234,
                  quantity: 1,
                  title: 'The Thing',
                  variant_title: 'The Thing - Red',
                  weight: 50,
                  // tslint:disable-next-line: object-literal-sort-keys
                  taxable: false,
                  image: 'https://example.com/red-thing.png',
                  requires_shipping: true,
                  price: 2500
              }
          ]
      },
      customer: {
          id: 334455,
          // tslint:disable-next-line: object-literal-sort-keys
          email: 'john.smith@boldcommerce.com',
          first_name: 'John',
          last_name: 'Smith',
          addresses: [
              {
                  first_name: 'John',
                  last_name: 'Smith',
                  // tslint:disable-next-line: object-literal-sort-keys
                  company: 'Bold Commerce',
                  address1: '50 Fultz Blvd',
                  address2: '',
                  city: 'Winnipeg',
                  province: 'Manitoba',
                  country: 'Canada',
                  zip: 'R3Y 0L6',
                  country_code: 'CA',
                  province_code: 'MB',
                  default: true
              }
          ]
      },
      shipping_lines: [
          {
              display_text: 'Slow Shipping',
              value: 1000
          },
          {
              display_text: 'Fast Shipping',
              value: 4000
          }
      ]
  }

  const cashierResp = await Axios.post(
    `https://cashier.boldcommerce.com/api/v1/shopify/poo-bah-club.myshopify.com/carts/create_from_json`,
    data,
    {
      headers: {
        'X-Bold-Checkout-Access-Token': process.env.CASHIER_API_ACCESS_TOKEN,
      },
    }
  )

  console.log('cashier respon', cashierResp)

}

export default handler
