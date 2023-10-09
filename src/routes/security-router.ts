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
import { sessionsRepository } from '../repositories/sessions-db-repository'
import { sessionDateMiddleware } from '../middlewares/sessionDateMiddlware'
import { sessionsService } from '../domains/sessions-services'

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
      const user = req.user

      if (user) {
        const sessions = await sessionsRepository.findAll(
          undefined,
          undefined,
          undefined,
          undefined,
          user.id
        )
        res.status(200).json(sessions)
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
    validationMiidleware.deviceValidation,
    async (req: Request, res: Response) => {
      const user = req.user
      console.log('57---auth', user)
      const currentDeviceId = req.headers['User-Agent']?.toString()
      if (user && currentDeviceId) {
        const deletedSessions = await sessionsService.deleteSession(
          user.id,
          currentDeviceId
        )
        return res.sendStatus(204)
      }
      return res.sendStatus(401)
    }
  )
  // удаляет все сессии пользователя кроме текущей
  router.delete(
    '/devices/:deviceId',
    tokenMiddleware,
    // уже должен быть req.user после tokenMiddleware
    sessionDateMiddleware,
    // проверяем на наличие сессии с таким девайсом
    validationMiidleware.deviceValidation,
    async (req: Request, res: Response) => {
      const user = req.user
      console.log('57---auth', user)
      const currentDeviceId = req.headers['User-Agent']?.toString()
      if (user && currentDeviceId) {
        const owner = await sessionsRepository.findByDevice(currentDeviceId)
        if (!owner) return res.sendStatus(404)
        if (user.id !== owner.userId) return res.sendStatus(403)
        const deletedSessions = await sessionsService.deleteSession(
          user.id,
          currentDeviceId
        )
        return res.sendStatus(204)
      }
      return res.sendStatus(456)
    }
  )
  return router
}
