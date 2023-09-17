import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videos-router'
import { testingRouter } from './routes/testing-router'
import { db } from './db/db'
import { app } from './app'

// export const app = express()
const port = 3003

// app.use(express.json())
// export const RouterPaths = {
//   videos: '/videos',
//   testing: '/testing',
// }
// app.use(RouterPaths.videos, videosRouter(db))
// app.use(RouterPaths.testing, testingRouter(db))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
