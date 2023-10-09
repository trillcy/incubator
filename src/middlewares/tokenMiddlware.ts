import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../applications/jwt-services'
import { usersService } from '../domains/users-services'
import { type ViewUserType } from '../types/types'
import { usersRepository } from '../repositories/users-db-repository'
import { keys } from '../db/db'

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

  const payloadObject = await jwtService.getUserIdByToken(token, keys.refresh)
  const userId = payloadObject.user.id
  const deviceId = payloadObject.deviceId
  console.log('24+++token', userId)
  if (userId) {
    // Если все норм, то получить user и вставить его в req
    const user = await usersRepository.findById(userId)

    if (user && deviceId) {
      // проверить есть ли токен в blackList
      const isWrong = user.deletedTokens.includes(token)
      if (isWrong) {
        return res.sendStatus(401)
      }
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
  }
  return res.sendStatus(401)
}
