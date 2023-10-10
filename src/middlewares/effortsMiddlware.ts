import { Request, Response, NextFunction } from 'express'
import { effortsRepository } from '../repositories/efforts-db-repository'
import { effortsService } from '../domains/efforts-services'

const limitReq = 5

export const effortsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const effort = {
    URL: req.originalUrl,
    IP: req.ip,
    limitDate: Date.now() - 10000,
  }

  const countOfRequests = await effortsRepository.countDocuments(effort)

  if (countOfRequests >= limitReq) return res.sendStatus(429)

  await effortsService.createEffort(effort.IP, effort.URL, effort.limitDate)
  return next()
}
