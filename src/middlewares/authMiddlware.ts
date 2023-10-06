import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../applications/jwt-services'
import { usersService } from '../domains/users-services'
import { type ViewUserType } from '../types/types'
import { usersRepository } from '../repositories/users-db-repository'

export const authMiidleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // проверка наличия заголовка
  if (!req.headers.authorization) {
    res.sendStatus(401)
    return
  }
  // TODO: проверить наличие пользователя и валидность токена
  const token = req.headers.authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(
    token,
    process.env.SECRET_KEY_1 || '123'
  )
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
