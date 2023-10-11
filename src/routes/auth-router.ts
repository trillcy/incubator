import { config } from 'dotenv'
config()
import { keys } from '../db/db'
import { Request, Response, Router, query } from 'express'
import { blogsRepository } from '../repositories/blogs-db-repository'
import { ValidationError, validationResult } from 'express-validator'
import { validationMiidleware } from '../middlewares/validation'
import { authService } from '../domains/auth-services'
import { jwtService } from '../applications/jwt-services'
import { authMiidleware } from '../middlewares/authMiddlware'
import { usersRepository } from '../repositories/users-db-repository'
import { type ViewEmailUserType } from '../types/types'
import { tokenMiddleware } from '../middlewares/tokenMiddlware'
import { devicesService } from '../domains/devices-services'
// import { effortsMiddleware } from '../middlewares/effortsMiddlware'
import { randomUUID } from 'crypto'
import { effortsMiddleware } from '../middlewares/effortsMiddlware'
import { usersService } from '../domains/users-services'

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
  // проверяем код с записанным
  // возвращает только код 204
  router.post(
    '/new-password',
    validationMiidleware.newPasswordValidation,
    validationMiidleware.recoveryCodeValidation,
    effortsMiddleware,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { newPassword, recoveryCode } = req.body
      console.log('56-auth.route-recoveryCode', recoveryCode)
      console.log('57-auth.route-newPassword', newPassword)
      if (!recoveryCode) {
        console.log('59-auth-error with recoveryCode')

        return res.sendStatus(477)
      }
      const user = await authService.confirmationPasswordCode(recoveryCode)
      console.log('60-auth.serv-user', user)

      if (!user) {
        return res.sendStatus(499)
      }
      const newUserPassword = await authService.updatePassword(
        user.id,
        newPassword
      )
      if (newUserPassword) {
        return res.sendStatus(204)
      } else {
        return res.sendStatus(444)
      }
    }
  )

  // восстановление пароля при помощи отправки email с кодом
  router.post(
    '/password-recovery',
    effortsMiddleware,
    validationMiidleware.recoveryEmailValidation,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      // надо создать коды
      const email = req.body.email
      const user = await usersRepository.findByEmail(email)
      if (!user) return res.sendStatus(404)
      const emailSuccess = await authService.sendPasswordRecoveryEmail(
        user.id,
        email
      )
      console.log('100----', emailSuccess)

      if (emailSuccess) {
        // надо записать новый код
        return res.sendStatus(204)
      } else {
        return res.sendStatus(444)
      }
    }
  )

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
  // по запросу клиента создает новую пару токенов
  // возвращает JWT accessToken - в теле ответа, refreshToken - в куках только для чтения
  router.post(
    '/refresh-token',
    tokenMiddleware,
    async (req: Request, res: Response) => {
      const user = req.user
      const deviceId = req.deviceId

      const title = req.headers['user-agent']?.toString() ?? 'Anonymous'
      const ip = req.ip

      if (user && title && ip && deviceId) {
        // выдаем access и refresh токены
        const accessData = { userId: user.id }
        const accessToken = await jwtService.createJWT(
          accessData,
          keys.access,
          '10min'
        )
        const refreshData = { userId: user.id, deviceId }

        const refreshToken = await jwtService.createJWT(
          refreshData,
          keys.refresh,
          '20min'
        )

        const payloadObject = await jwtService.decodeJWT(refreshToken)
        const lastActiveDate = new Date(payloadObject.iat * 10000)
        const expiredDate = payloadObject.exp

        const device = await devicesService.updateDevice(
          deviceId,
          ip,
          lastActiveDate
        )
        // if (!device) return res.sendStatus(444)
        return res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .status(200)
          .json({ accessToken: accessToken })
      }
      return res.sendStatus(401)
    }
  )
  // проверяет есть ли такой пользователь в БД
  // возвращает JWT accessToken - в теле ответа, refreshToken - в куках только для чтения
  router.post(
    '/login',
    validationMiidleware.loginOrEmailValidation,
    validationMiidleware.passwordValidation,
    effortsMiddleware,
    async (req: Request, res: Response) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        return res.status(400).send({ errorsMessages })
      }
      const { loginOrEmail, password } = req.body
      // проверяем что пользователь с таким login || email существует в БД
      // проверяем что пароль правильный
      const user = await authService.checkCredential(loginOrEmail, password)

      if (user) {
        // const checkUser = await usersRepository.findById(user._id)
        // if (!checkUser) return res.sendStatus(401)
        // ------
        // записываем devices
        const title = req.headers['user-agent']?.toString() ?? 'Anonymous'
        const ip = req.ip
        const deviceId = randomUUID()

        if (title && ip && deviceId) {
          // выдаем access и refresh токены
          const accessData = { userId: user._id }
          const accessToken = await jwtService.createJWT(
            accessData,
            keys.access,
            '10min'
          )
          const refreshData = { userId: user._id, deviceId }

          const refreshToken = await jwtService.createJWT(
            refreshData,
            keys.refresh,
            '20min'
          )
          console.log('115----auth', accessToken, refreshToken)

          const payloadObject = await jwtService.decodeJWT(refreshToken)
          const lastActiveDate = new Date(payloadObject.iat * 1000)
          console.log('iat:', payloadObject.iat)
          console.log('lastActiveDate:', lastActiveDate)
          const expiredDate = payloadObject.exp

          const device = await devicesService.createDevice(
            ip,
            title,
            deviceId,
            lastActiveDate,
            user._id.toString()
          )

          return res
            .cookie('refreshToken', refreshToken, {
              httpOnly: true,
              secure: true,
            })
            .status(200)
            .json({ accessToken: accessToken })
        } else {
          return res.sendStatus(444)
        }
      }
      return res.sendStatus(401)
    }
  )
  // проверяет есть ли такой пользователь в БД
  // возвращает JWT accessToken - в теле ответа, refreshToken - в куках только для чтения
  router.post(
    '/logout',
    tokenMiddleware,
    async (req: Request, res: Response) => {
      if (!req.deviceId) {
        return res.sendStatus(444)
      }
      const deletedDevice = await devicesService.deleteDevice(req.deviceId)
      // const deletedToken = await authService.deleteRefreshToken(
      //   req.user.id,
      //   req.cookies.refreshToken
      // )

      return res.sendStatus(204)
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
    effortsMiddleware,
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
    effortsMiddleware,
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
    effortsMiddleware,
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
