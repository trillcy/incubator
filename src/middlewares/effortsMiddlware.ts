import { Request, Response, NextFunction } from 'express'
import { devicesRepository } from '../repositories/devices-db-repository'
import { jwtService } from '../applications/jwt-services'

export const effortsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // проверка наличия куков
  if (!req.cookies.refreshToken) {
    res.sendStatus(401)
    return
  }
  // находим все сессии пользователя и проверяем по expireDate
  const token = await jwtService.decodeJWT(req.cookies.refreshToken)
  if (token.deviceId) {
    // Получаем кол-во сессий этого device за последние 10 сек
    const count = await devicesRepository.countEfforts(
      token.deviceId,
      new Date(Date.now() - 10000)
    )
    console.log('23++++', new Date(Date.now() - 10000), count)

    if (count > 4) {
      return res.sendStatus(429)
    }
    // req.count = await devicesRepository.countEfforts(deviceId, nowDate)

    next()
    return
  }
  return res.sendStatus(401)
}
