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
import { devicesRepository } from '../repositories/devices-db-repository'
// import { effortsMiddleware } from '../middlewares/effortsMiddlware'
import { devicesService } from '../domains/devices-services'

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

export const securityRouter = () => {
  const router = Router()
  // пинимает refreshToken в cookie
  router.get(
    '/devices',
    // tokenMiddleware,
    async (req: Request, res: Response) => {
      const user = req.user
      console.log('43----sec.route', user)

      if (user) {
        const devices = await devicesRepository.findAll(user.id)
        res.status(200).json(devices)
        return
      }

      return res.sendStatus(401)
    }
  )
  // удаляет все сессии пользователя кроме текущей
  router.delete(
    '/devices',
    tokenMiddleware,
    // уже должен быть req.user после tokenMiddleware
    // sessionDateMiddleware,
    // проверяем на наличие сессии с таким девайсом
    // validationMiidleware.deviceValidation,
    async (req: Request, res: Response) => {
      const currentDeviceId = req.deviceId
      const userId = req.user?.id
      if (userId && currentDeviceId) {
        const deletedDevices = await devicesService.deleteUserDevices(
          userId,
          currentDeviceId
        )
        return res.sendStatus(204)
      }
      return res.sendStatus(444)
    }
  )
  // удаляет все сессии пользователя кроме текущей
  router.delete(
    '/devices/:deviceId',
    tokenMiddleware,
    async (req: Request, res: Response) => {
      const currentDeviceId = req.deviceId
      const userId = req.user?.id
      if (userId && currentDeviceId) {
        const user = await devicesRepository.findById(userId)
        if (!user) return res.sendStatus(404)
        const deletedDevices = await devicesService.deleteDevicesWithoutCurrent(
          userId,
          currentDeviceId
        )
        return res.sendStatus(204)
      }
      return res.sendStatus(401)
    }
  )
  return router
}
