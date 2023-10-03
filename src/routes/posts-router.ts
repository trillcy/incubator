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
import { type ResultComment } from '../types/types'
import { type ViewCommentType } from '../types/types'
import { validationMiidleware } from '../middlewares/validation'
import { postsService } from '../domains/posts-services'
import { authMiidleware } from '../middlewares/authMiddlware'
import { commentsService } from '../domains/comments-services'
import { commentsRepository } from '../repositories/comments-db-repository'

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
  router.post(
    '/:postId/comments',
    authMiidleware,
    validationMiidleware.commentContentValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      } else {
        // TODO: как сравнить userId или userLogin - где взять???

        const { content } = req.body

        const postId = req.params.postId
        if (!postId) {
          res.sendStatus(404)
          return
        }
        const post = await postsRepository.findById(postId)
        if (!post) {
          res.sendStatus(404)
          return
        }

        const newComment: ViewCommentType | null =
          await commentsService.createComment(content, post.id, req.user!)

        if (newComment) {
          return res.status(201).json(newComment)
        } else {
          return res.sendStatus(404)
        }
      }
    }
  )

  router.get('/:postId/comments', async (req: Request, res: Response) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query
    const postId = req.params.postId
    if (!postId) {
      res.sendStatus(404)
      return
    }
    const post = await postsRepository.findById(postId)
    if (!post) {
      res.sendStatus(404)
      return
    }

    const result: ResultComment = await commentsRepository.findAllComments(
      sortBy?.toString(),
      sortDirection?.toString(),
      pageNumber?.toString(),
      pageSize?.toString(),
      postId?.toString()
    )
    res.status(200).json(result)
  })

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

        const result = await postsService.update(
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
