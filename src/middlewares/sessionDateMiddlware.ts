import { Request, Response, NextFunction } from 'express'
import { sessionsRepository } from '../repositories/sessions-db-repository'

export const sessionDateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // проверка наличия куков
  if (!req.cookies.refreshToken) {
    res.sendStatus(401)
    return
  }
  if (req.user) {
    // находим все сессии пользователя и проверяем по expireDate
    const token = req.cookies.refreshToken
    const userId = req.user.id
    if (userId) {
      // Если все норм, то получить кол-во активных сессий с датой -10 сек
      const nowDate = new Date()
      nowDate.setSeconds(nowDate.getSeconds() - 10)

      req.count = await sessionsRepository.countDates(userId, nowDate)

      next()
      return
    }
  }
  return res.sendStatus(401)
}
