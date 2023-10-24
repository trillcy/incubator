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
  console.log('32+++token', Date.now())
  console.log('33++', exp * 1000 < Date.now())

  if (exp * 1000 < Date.now()) res.sendStatus(401)
  // console.log('30+++token', userId)
  // console.log('31+++token', exp * 1000)
  const iat = payloadObject.iat
  // console.log('34+++token', iat)
  // ---
  if (userId && deviceId) {
    // Получить user, проверить, что device его и если норм, вставить его в req
    const user = await usersRepository.findById(userId)
    const device = await devicesRepository.findByDevice(deviceId)
    if (!user || !device) return res.sendStatus(404)
    // ---24.10
    if (device.lastActiveDate !== new Date(iat * 1000))
      return res.sendStatus(401)
    if (device.userId !== userId.toString()) {
      // ---
      return res.sendStatus(403)
    }
    console.log('32+++token', user)
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
