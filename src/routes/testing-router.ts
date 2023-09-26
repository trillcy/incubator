import { Request, Response, Router } from 'express'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'

export const testingRouter = () => {
  const router = Router()

  router.delete('/all-data', async (req: Request, res: Response) => {
    const resultPosts = await postsRepository.deleteAll()
    const resultBlogs = await blogsRepository.deleteAll()
    console.log('21===', resultPosts)
    console.log('25===', resultBlogs)

    res.sendStatus(204)
  })

  return router
}
