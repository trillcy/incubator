import { Request, Response, Router, query } from 'express'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { ValidationError, validationResult } from 'express-validator'
import { validationMiidleware } from '../middlewares/validation'
import { authService } from '../domains/auth-services'
import { jwtService } from '../applications/jwt-services'
import { authMiidleware } from '../middlewares/authMiddlware'
import { usersRepository } from '../repositories/users-db-repository'
import { type ViewEmailUserType } from '../types/types'

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
  // пинимает токен в заголовке
  // возвращает {userId, login, email}
  router.get('/me', authMiidleware, async (req: Request, res: Response) => {
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
  // проверяет есть ли такой пользователь в БД
  // возвращает JWT token
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
        return res.status(200).json({ accessToken: token })
      }
      return res.sendStatus(401)
    }
  )
  // регистрация пользователя
  // в middleware проверяем, что такого login и email нет
  // сохраняет user
  // отправляет письмо с подтверждением регистрации
  // возвращает только код 204
  router.post(
    '/registration',
    validationMiidleware.newLoginValidation,
    validationMiidleware.newEmailValidation,
    validationMiidleware.passwordValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { login, email, password } = req.body
      console.log('93----', login, email, password)

      const emailSuccess = await authService.registration(
        login,
        email,
        password
      )
      console.log('100----', emailSuccess)

      if (emailSuccess) {
        return res.sendStatus(204)
      } else {
        return res.sendStatus(444)
      }
    }
  )

  // в middleware проверяем наличие такого email ???
  // отправляет письмо с подтверждением регистрации
  // возвращает только код 204
  router.post(
    '/registration-email-resending',
    validationMiidleware.emailValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { email } = req.body
      console.log('128---auth', email)

      const emailSuccess = await authService.emailResending(email)
      console.log('129---auth', emailSuccess)
      if (emailSuccess) {
        return res.sendStatus(204)
      } else {
        return res.sendStatus(444)
      }
    }
  )

  // в middleware проверяем строку присланного кода - обычная строка ??? trim можно применять ???
  // проверяем код с записанным
  // возвращает только код 204
  router.post(
    '/registration-confirmation',
    validationMiidleware.codeValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { code } = req.body
      console.log('156----auth', code)

      const user = await authService.confirmationCode(code)

      if (user) {
        return res.sendStatus(204)
      } else {
        return res.sendStatus(400)
      }
    }
  )

  return router
}
