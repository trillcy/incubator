import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../applications/jwt-services'
import { usersService } from '../domains/users-services'
import { type ViewUserType } from '../types/types'
import { usersRepository } from '../repositories/users-db-repository'
import { keys } from '../db/db'

export const tokenMiidleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // проверка наличия куков
  if (!req.cookies.refreshToken) {
    res.sendStatus(401)
    return
  }
  // TODO: проверить наличие пользователя и валидность токена
  const token = req.cookies.refreshToken
  const userId = await jwtService.getUserIdByToken(token, keys.refresh)
  console.log('24+++token', userId)

  if (userId) {
    // Если все норм, то получить user и вставить его в req
    const user = await usersRepository.findById(userId)
    if (user) {
      req.user = {
        id: user.id,
        login: user.accountData.userName.login,
        email: user.accountData.userName.email,
        createdAt: user.accountData.createdAt.toISOString(),
      }
      next()
      return
    }
  }
  res.sendStatus(401)
}
