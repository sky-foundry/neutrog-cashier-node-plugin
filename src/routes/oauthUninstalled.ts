import { RequestHandler } from 'express'

const handler: RequestHandler = (req, res) => {
  const platform = req.query.platform
  const shop = req.query.shop

  // TODO: mark shop as uninstalled in database

  res.send()
}

export default handler
