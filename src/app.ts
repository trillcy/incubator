import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videos-router'
import { testingRouter } from './routes/testing-router'
import { db } from './db/db'
export const RouterPaths = {
  videos: '/videos',
  testing: '/testing',
}

export const startApp = () => {
  const app = express()
  // const port = 3003

  app.use(express.json())

  app.use(RouterPaths.videos, videosRouter(db))
  app.use(RouterPaths.testing, testingRouter(db))
  return app
}
