import dotenv from 'dotenv'
dotenv.config()

import { app } from './app'
import { connectDb } from './db/db'

// export const app = express()
// const port = 3004
// process.env.MONGO_URL
// app.use(express.json())
// export const RouterPaths = {
//   videos: '/videos',
//   testing: '/testing',
// }
// app.use(RouterPaths.videos, videosRouter(db))
// app.use(RouterPaths.testing, testingRouter(db))

export const startApp = async () => {
  await connectDb()
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })
}
startApp()
