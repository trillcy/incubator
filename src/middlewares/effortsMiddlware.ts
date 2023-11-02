import { Request, Response, NextFunction } from 'express'
import { effortsRepository } from '../repositories/efforts-db-repository'
import { effortsService } from '../domains/efforts-services'

const limitReq = 5
const expirateInMSeconds = 9999

export const effortsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const effort = {
    URL: req.originalUrl,
    IP: req.ip,
    limitTime: expirateInMSeconds,
  }

  const countOfRequests = await effortsRepository.countDocuments({
    IP: effort.IP,
    URL: effort.URL,
    inMSeconds: expirateInMSeconds,
  })

  if (countOfRequests >= limitReq) return res.sendStatus(429)

  await effortsService.createEffort(effort.IP, effort.URL, new Date())
  return next()
}
