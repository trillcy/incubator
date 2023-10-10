import { Request, Response, Router } from 'express'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { usersRepository } from '../repositories/users-db-repository'
import { commentsRepository } from '../repositories/comments-db-repository'
import { devicesRepository } from '../repositories/devices-db-repository'
import { effortsRepository } from '../repositories/efforts-db-repository'

export const testingRouter = () => {
  const router = Router()

  router.delete('/all-data', async (req: Request, res: Response) => {
    const resultPosts = await postsRepository.deleteAll()
    const resultBlogs = await blogsRepository.deleteAll()
    const resultUsers = await usersRepository.deleteAll()
    const resultComments = await commentsRepository.deleteAll()
    const resultDevices = await devicesRepository.deleteAll()
    const resultEfforts = await effortsRepository.deleteAll()
    res.sendStatus(204)
  })

  return router
}
