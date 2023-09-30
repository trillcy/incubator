import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videos-router'
import { testingRouter } from './routes/testing-router'
import { blogsRouter } from './routes/blogs-router'
import { postsRouter } from './routes/posts-router'
import { usersRouter } from './routes/users-router'
import { authRouter } from './routes/auth-router'
import { commentsRouter } from './routes/comments-router'
// import { videoDb } from './db/db'

export const RouterPaths = {
  videos: '/videos',
  testing: '/testing',
  blogs: '/blogs',
  posts: '/posts',
  users: '/users',
  auth: '/auth',
  comments: '/comments',
}

export const app = express()
// const port = 3004

app.use(express.json())

// app.use(RouterPaths.videos, videosRouter(videoDb))
app.use(RouterPaths.testing, testingRouter())
app.use(RouterPaths.blogs, blogsRouter())
app.use(RouterPaths.posts, postsRouter())
app.use(RouterPaths.users, usersRouter())
app.use(RouterPaths.auth, authRouter())
app.use(RouterPaths.comments, commentsRouter())
