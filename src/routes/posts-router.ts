import { Request, Response, Router } from 'express'
import { postsRepository } from '../repositories/posts-db-repository'
import {
  ValidationError,
  body,
  param,
  validationResult,
} from 'express-validator'
import { blogsRepository } from '../repositories/blogs-db-repository'
import {
  type PostType,
  type ViewPostType,
  type ResultPost,
} from '../db/postsDb'
import { validationMiidleware } from '../middlewares/validation'
import { postsService } from '../domains/posts-services'

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

export const postsRouter = () => {
  const router = Router()
  const auth = (basicString: string | undefined) => {
    return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false
  }

  router.get('/', async (req: Request, res: Response) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query

    const result: ResultPost | null = await postsRepository.findAll(
      // searchNameTerm?.toString(),
      sortBy?.toString(),
      sortDirection?.toString(),
      pageNumber?.toString(),
      pageSize?.toString()
    )
    if (result) {
      res.status(200).json(result)
    } else {
      res.sendStatus(404)
    }
  })

  router.get(
    '/:id',
    //validationMiidleware.idValidation,
    async (req: Request, res: Response) => {
      const postId = req.params.id

      const post = await postsRepository.findById(postId)
      // добавляем blogName
      if (post) {
        const blogId = post.blogId
        const blogModel = await blogsRepository.findById(blogId)
        if (blogModel) {
          const blogName = blogModel.name

          res.status(200).json({ ...post, blogName })
        } else {
          res.sendStatus(443)
        }
      } else {
        res.sendStatus(404)
      }
    }
  )
  router.post(
    '/',
    validationMiidleware.titleValidation,
    validationMiidleware.shortDescriptionValidation,
    validationMiidleware.contentValidation,
    validationMiidleware.blogIdValidation,

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
        const { title, shortDescription, content, blogId } = req.body
        const newPost = await postsService.create(
          title,
          shortDescription,
          content,
          blogId
        )
        // добавляем blogName
        if (newPost) {
          res.status(201).json(newPost)
        } else {
          res.sendStatus(444)
        }
      }
    }
  )

  router.put(
    '/:id',
    validationMiidleware.idValidation,
    validationMiidleware.titleValidation,
    validationMiidleware.shortDescriptionValidation,
    validationMiidleware.contentValidation,
    validationMiidleware.blogIdValidation,
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
        const { title, shortDescription, content, blogId } = req.body

        const result = await postsRepository.update(
          id,
          title,
          shortDescription,
          content,
          blogId
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
    const result = await postsRepository.delete(id)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  })

  return router
}
