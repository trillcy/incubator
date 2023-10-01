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
import { jwtService } from '../applications/jwt-services'
import { authMiidleware } from '../middlewares/authMiddlware'

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
  // -----
  router.get('/me', authMiidleware, async (req: Request, res: Response) => {
    // const errors = validationResult(req)

    // if (!errors.isEmpty()) {
    //   const errorsArray = errors.array({ onlyFirstError: true })
    //   const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

    //   return res.status(400).send({ errorsMessages })
    // }
    const { user } = req

    if (user) {
      const userOut = {
        userId: user.id,
        login: user.login,
        email: user.email,
      }

      res.status(200).json(userOut)
      return
    }
    return res.sendStatus(401)
  })

  router.post(
    '/login',
    validationMiidleware.loginOrEmailValidation,
    validationMiidleware.passwordValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { loginOrEmail, password } = req.body

      const user = await authService.checkCredential(loginOrEmail, password)

      if (user) {
        const token = await jwtService.createJWT(user)
        console.log('94----auth.route', token)

        return res.status(200).json(token)
      }
      return res.sendStatus(401)
    }
  )

  return router
}
