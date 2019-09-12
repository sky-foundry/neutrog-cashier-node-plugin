import { config } from 'dotenv'
import app from './app'

config()

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})
