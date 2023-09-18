import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videos-router'
import { testingRouter } from './routes/testing-router'
import { db } from './db/db'
import { startApp } from './app'

// export const app = express()
const port = 3004
const app = startApp()
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
