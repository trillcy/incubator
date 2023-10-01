import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../applications/jwt-services'
import { usersService } from '../domains/users-services'
import { type ViewUserType } from '../types/types'

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
  const userId = await jwtService.getUserIdByToken(token)
  if (userId) {
    console.log('19++++authMiddlewre', userId)

    // Если все норм, то получить user и вставить его в req
    req.user = await usersService.findUserById(userId)
    console.log('23++++authMiddlewre', userId, req.user)

    next()
    return
  }
  res.send(401)
}
