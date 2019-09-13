import { config } from 'dotenv'
import app from './app'

config()

app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${process.env.PORT || 8000}!`)
})
