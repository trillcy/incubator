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
    tokenMiddleware,
    async (req: Request, res: Response) => {
      const userId = req.user?.id
      const deviceId = req.deviceId

      if (userId) {
        const devices = await devicesRepository.findAll(userId)
        res.status(200).json(devices)
        return
      }

      // return res.sendStatus(444)
    }
  )
  // удаляет все devices пользователя кроме текущей
  router.delete(
    '/devices',
    tokenMiddleware,
    async (req: Request, res: Response) => {
      const currentDeviceId = req.deviceId
      const userId = req.user?.id
      if (!userId || !currentDeviceId) return res.sendStatus(404)
      const deletedDevices =
        await devicesService.deleteUserDevicesWithoutCurrent(
          userId,
          currentDeviceId
        )
      if (!deletedDevices) return res.sendStatus(444)
      return res.sendStatus(204)
    }
  )
  // удаляет все сессии пользователя кроме текущей
  router.delete(
    '/devices/:deviceId',
    tokenMiddleware,
    async (req: Request, res: Response) => {
      // взяли deviceId из параметров (в токене не нужен)
      const currentDeviceId = req.params.deviceId

      const userId = req.user?.id
      if (userId && currentDeviceId) {
        // проверили существует ли deviceId
        const owner = await devicesRepository.findByDevice(currentDeviceId)

        if (!owner) return res.sendStatus(404)
        // проверили принадлежит ли deviceId данному user
        if (owner.userId !== userId.toString()) return res.sendStatus(403)
        // если все норм, то удаляем device
        const deletedDevices = await devicesService.deleteDevice(
          currentDeviceId
        )
        return res.sendStatus(204)
      }
      return res.sendStatus(401)
    }
  )
  return router
}
