import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../applications/jwt-services'
import { usersService } from '../domains/users-services'
import { type ViewUserType } from '../types/types'
import { usersRepository } from '../repositories/users-db-repository'
import { keys } from '../db/db'
import { devicesRepository } from '../repositories/devices-db-repository'

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // проверка наличия куков
  if (!req.cookies.refreshToken) {
    res.sendStatus(401)
    return
  }
  // проверяет наличие пользователя и валидность токена
  const token = req.cookies.refreshToken
  console.log('20+++token', token)

  const payloadObject = await jwtService.getPayloadByToken(token, keys.refresh)
  console.log('24++', payloadObject)

  if (!payloadObject) return res.sendStatus(401)
  const userId = payloadObject.userId
  const deviceId = payloadObject.deviceId
  const exp = +payloadObject.exp
  // ---24.10
  console.log('31++', exp * 1000)

  if (exp * 1000 < Date.now()) res.sendStatus(401)
  // console.log('30+++token', userId)
  // console.log('31+++token', exp * 1000)
  const iat = +payloadObject.iat
  // console.log('34+++token', iat)
  // ---
  if (userId && deviceId) {
    // Получить user, проверить, что device его и если норм, вставить его в req
    const user = await usersRepository.findById(userId)
    const device = await devicesRepository.findByDevice(deviceId)
    if (!user || !device) {
      return res.sendStatus(404)
    }

    if (device.userId !== userId.toString()) {
      return res.sendStatus(403)
    }
    /*
    // ---24.10
    console.log('51+++token', device)
    console.log('52+++token', device.lastActiveDate)
    console.log('53+++token', new Date(+iat * 1000))

    console.log('55+++token', device.lastActiveDate === new Date(+iat * 1000))

    if (device.lastActiveDate !== new Date(+iat * 1000))
      // * 1000))
      return res.sendStatus(401)
    console.log('60+++token')
*/
    req.user = {
      id: user.id,
      login: user.accountData.userName.login,
      email: user.accountData.userName.email,
      createdAt: user.accountData.createdAt.toISOString(),
    }
    req.deviceId = deviceId
    next()
    return
  }
  return res.sendStatus(401)
}
