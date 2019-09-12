import { RequestHandler } from 'express'
import handleEvent from '../utils/handleEvent'

const handler: RequestHandler = (req, res) => {
  // res.send(req.body.event);
  const actions = handleEvent(req)

  res.send({
    actions,
    success: true,
  })
}

export default handler
