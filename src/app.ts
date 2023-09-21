import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videos-router'
import { testingRouter } from './routes/testing-router'
import { db } from './db/db'
import { blogsRouter } from './routes/blogs-router'

export const RouterPaths = {
  videos: '/videos',
  testing: '/testing',
  blogs: '/blogs',
}

export const startApp = () => {
  const app = express()
  // const port = 3003

  app.use(express.json())

  app.use(RouterPaths.videos, videosRouter(db))
  app.use(RouterPaths.testing, testingRouter(db))
  app.use(RouterPaths.blogs, blogsRouter())
  return app
}
