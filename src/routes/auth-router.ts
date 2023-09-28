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
import { authService } from '../domains/auth-services'

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

export const authRouter = () => {
  const router = Router()

  router.post(
    '/login',
    validationMiidleware.loginValidation,
    validationMiidleware.passwordValidation,
    validationMiidleware.emailValidation,
    async (req: Request, res: Response) => {
      console.log('61---auth')

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { loginOrEmail, password } = req.body
      const checkResult = await authService.checkCredential(
        loginOrEmail,
        password
      )

      if (checkResult) {
        return res.sendStatus(204)
      }
      return res.sendStatus(401)
    }
  )

  return router
}
