import { Request, Response, Router } from 'express'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { usersRepository } from '../repositories/users-db-repository'

export const testingRouter = () => {
  const router = Router()

  router.delete('/all-data', async (req: Request, res: Response) => {
    const resultPosts = await postsRepository.deleteAll()
    const resultBlogs = await blogsRepository.deleteAll()
    const resultUsers = await usersRepository.deleteAll()
    console.log('12===', resultPosts)
    console.log('13===', resultBlogs)
    console.log('14===', resultUsers)

    res.sendStatus(204)
  })

  return router
}
