import { Request, Response, Router } from 'express'
import { blogsRepository } from '../repositories/blogs-db-repository'
import {
  ValidationError,
  body,
  param,
  validationResult,
} from 'express-validator'
import { postsRepository } from '../repositories/posts-db-repository'

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

  // =============

  const titleValidation = body('title')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })

  const shortDescriptionValidation = body('shortDescription')
    .isString()
    .isLength({ min: 1, max: 100 })

  const contentValidation = body('content')
    .isString()
    .trim()
    .notEmpty()

    .isLength({ min: 1, max: 1000 })

  const blogIdValidation = param('id')
    .isString()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })
    .custom(async (value) => {
      const blog = await blogsRepository.findById(value)
      console.log('56====', blog)
      if (!blog) throw new Error('incorrect blogId')
      return true
    })

  // =============
  const idValidation = param('id')
    .isString()
    .trim()
    .notEmpty()
    .exists({ checkFalsy: true })

  const nameValidation = body('name')
    // .custom(({ req }) => {
    //   return `Basic YWRtaW46cXdlcnR5` === req.headers.authorization
    // })
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 })

  const descriptionValidation = body('description')
    .isString()
    .isLength({ min: 1, max: 500 })

  const websiteUrlValidation = body('websiteUrl').isString().isURL()

  const auth = (basicString: string | undefined) => {
    return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false
  }

  router.post(
    '/',
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    async (req: Request, res: Response) => {
      console.log('61===blogs')

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
        const newBlog = await blogsRepository.create(
          name,
          description,
          websiteUrl
        )
        res.status(201).json(newBlog)
        //===.send()
      }
    }
  )

  router.get('/', async (req: Request, res: Response) => {
    const result = await blogsRepository.findAll()

    res.status(200).json(result)
  })

  router.get('/:id', idValidation, async (req: Request, res: Response) => {
    const resId = req.params.id

    const result = await blogsRepository.findById(resId)
    if (result) {
      res.status(200).json(result)
    } else {
      res.sendStatus(404)
    }
  })

  router.put(
    '/:id',
    idValidation,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
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

  return router
}
/*
  router.post(
    '/:id/posts',
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
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
        const { title, shortDescription, content } = req.body
        const blogId = req.params.id
        const newPost = await postsRepository.create(
          title,
          shortDescription,
          content,
          blogId
        )
        console.log('225=====', newPost)
        // добавляем blogName
        if (newPost) {
          const blogModel = await blogsRepository.findById(blogId)
          if (blogModel) {
            const blogName = blogModel.name
            console.log('231===posts', { ...newPost, blogName })

            res.status(201).json({ ...newPost, blogName })
          } else {
            res.sendStatus(444)
          }
        } else {
          res.sendStatus(404)
        }
      }

      res.status(200).json(req.params.id)
    }
  )
*/
