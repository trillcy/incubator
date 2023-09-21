import { Request, Response, Router } from 'express'
import { resolutions, type VideoType } from '../db/db'
import { blogsRepository } from '../repositories/blogs-repository'
import {
  ValidationError,
  body,
  param,
  validationResult,
} from 'express-validator'

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

    (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))
        console.log('74===', errorsMessages)

        res.status(400).send({ errorsMessages })
      } else {
        const { name, description, websiteUrl } = req.body
        const newBlog = blogsRepository.create(name, description, websiteUrl)
        res.status(201).json(newBlog) //===.send()
      }
    }
  )

  router.get('/', (req: Request, res: Response) => {
    const result = blogsRepository.findAll()
    console.log('10===blogs', result)

    res.status(200).json(result)
  })

  router.get('/:id', idValidation, (req: Request, res: Response) => {
    const resId = req.params.id

    const result = blogsRepository.findOne(resId)
    console.log('25===blogs', result)
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
    (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const id = req.params.id
      const errors = validationResult(req)
      console.log('48====', errors)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))
        console.log('74===', errorsMessages)

        res.status(400).send({ errorsMessages })
      } else {
        const { name, description, websiteUrl } = req.body

        const result = blogsRepository.update(id, name, description, websiteUrl)
        console.log('140====', result)

        if (result) {
          res.sendStatus(204)
          return
        } else {
          res.sendStatus(404)
        }
      }
    }
  )

  router.delete('/:id', (req: Request, res: Response) => {
    const checkAuth = auth(req.headers.authorization)
    if (!checkAuth) {
      res.sendStatus(401)
      return
    }
    const id = req.params.id
    console.log('281===', id)
    const result = blogsRepository.delete(id)
    console.log('283===', result)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  })

  return router
}
