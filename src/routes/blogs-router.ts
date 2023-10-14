import { Request, Response, Router, query } from 'express'
import { blogsRepository } from '../repositories/blogs-db-repository'
import {
  ValidationError,
  body,
  param,
  validationResult,
} from 'express-validator'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsService } from '../domains/blogs-services'
import { validationMiidleware } from '../middlewares/validation'
import { postsService } from '../domains/posts-services'
import { ResultPost, ViewPostType } from '../db/postsDb'
import { ViewBlogType, type ResultBlog } from '../types/types'
type ErrorObject = { message: string; field: string }

const ErrorFormatter = (error: ValidationError): ErrorObject => {
  switch (error.type) {
    case 'field':
      return {
        message: error.msg,
        field: error.path,
      }
    default:
      return {
        message: error.msg,
        field: 'None',
      }
  }
}

export const blogsRouter = () => {
  const router = Router()

  const auth = (basicString: string | undefined) => {
    return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false
  }

  router.post(
    '/',
    validationMiidleware.nameValidation,
    validationMiidleware.descriptionValidation,
    validationMiidleware.websiteUrlValidation,
    async (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        res.status(400).send({ errorsMessages })
      } else {
        const { name, description, websiteUrl } = req.body
        const newBlog = await blogsService.create(name, description, websiteUrl)
        res.status(201).json(newBlog)
        //===.send()
      }
    }
  )

  router.get('/', async (req: Request, res: Response) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query

    const result: ResultBlog = await blogsRepository.findAll(
      searchNameTerm?.toString(),
      sortBy?.toString(),
      sortDirection?.toString(),
      pageNumber?.toString(),
      pageSize?.toString()
    )

    res.status(200).json(result)
  })

  router.get('/:id', async (req: Request, res: Response) => {
    const resId = req.params.id

    const result: ViewBlogType | null = await blogsRepository.findById(resId)
    if (result) {
      res.status(200).json(result)
    } else {
      res.sendStatus(404)
    }
  })

  router.put(
    '/:id',
    validationMiidleware.idValidation,
    validationMiidleware.nameValidation,
    validationMiidleware.descriptionValidation,
    validationMiidleware.websiteUrlValidation,
    async (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const id = req.params.id
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        res.status(400).send({ errorsMessages })
      } else {
        const { name, description, websiteUrl } = req.body

        const result = await blogsRepository.update(
          id,
          name,
          description,
          websiteUrl
        )

        if (result) {
          res.sendStatus(204)
          return
        } else {
          res.sendStatus(404)
        }
      }
    }
  )

  router.delete('/:id', async (req: Request, res: Response) => {
    const checkAuth = auth(req.headers.authorization)
    if (!checkAuth) {
      res.sendStatus(401)
      return
    }
    const id = req.params.id
    const result = await blogsRepository.delete(id)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  })

  router.post(
    '/:blogId/posts',
    validationMiidleware.titleValidation,
    validationMiidleware.shortDescriptionValidation,
    validationMiidleware.contentValidation,
    async (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      } else {
        const { title, shortDescription, content } = req.body
        const blogId = req.params.blogId

        if (!blogId) {
          res.sendStatus(404)
          return
        }
        const blogModel = await blogsRepository.findById(blogId)
        if (!blogModel) {
          res.sendStatus(404)
          return
        }
        const newPost: ViewPostType | null = await postsService.create(
          title,
          shortDescription,
          content,
          blogId
        )

        if (newPost) {
          return res.status(201).json(newPost)
        } else {
          return res.sendStatus(404)
        }
      }
    }
  )

  router.get('/:blogId/posts', async (req: Request, res: Response) => {
    const blogId = req.params.blogId

    if (!blogId) {
      res.sendStatus(404)
      return
    }
    const blogModel = await blogsRepository.findById(blogId)
    if (!blogModel) {
      res.sendStatus(404)
      return
    }

    const { sortBy, sortDirection, pageNumber, pageSize } = req.query
    const userId = req.user ? req.user.id : null

    const result = await postsRepository.findAll(
      userId,
      sortBy?.toString(),
      sortDirection?.toString(),
      pageNumber?.toString(),
      pageSize?.toString(),
      blogId
    )
    if (result) {
      res.status(200).json(result)
    } else {
      res.sendStatus(404)
    }
  })

  return router
}
